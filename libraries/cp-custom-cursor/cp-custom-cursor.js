/*!
 * cp-custom-cursor
 * Configurable custom cursor with motion particles.
 * Vanilla JavaScript — no dependencies.
 *
 * Author: ClimbPath
 * Author URL: https://climbpath.eu/
 * Source: https://github.com/ClimbPath/climbpath-js
 *
 * Copyright (c) 2026 ClimbPath
 * Licensed under the MIT License.
 * See the LICENSE file for details.
 */
(() => {
    'use strict';

    class CPCustomCursor {
        static defaults = {
            color: '#abcd03',
            particleColor: null,
            size: 10,
            hoverSize: 17,
            zIndex: 999999,

            followSpeed: 0.22,
            stretchSensitivity: 0.012,
            maxStretch: 0.55,

            particles: true,
            maxParticles: 32,
            particleInterval: 20,
            particleSpeedThreshold: 1.2,

            particleCount: {
                low: 1,
                medium: 2,
                high: 3
            },

            particleSize: {
                min: 1.5,
                max: 4
            },

            particleDuration: {
                min: 200,
                max: 320
            },

            hoverTargets: [
                'a',
                'button',
                '[role="button"]',
                'input',
                'textarea',
                'select',
                'label',
                '[data-cursor-hover]'
            ],

            hideNativeCursor: true,
            respectReducedMotion: true,
            disableOnTouch: true,
            enabled: true,

            className: 'cp-custom-cursor',
            particleClassName: 'cp-cursor-particle'
        };

        constructor(options = {}) {
            this.options = CPCustomCursor.merge(
                CPCustomCursor.defaults,
                options
            );

            this.cursor = null;
            this.styleElement = null;
            this.initialized = false;
            this.destroyed = false;
            this.animationFrame = null;
            this.particleCount = 0;

            this.lastParticleTime = 0;
            this.lastMouseX = 0;
            this.lastMouseY = 0;
            this.lastMoveTime = 0;

            this.mouseX = 0;
            this.mouseY = 0;
            this.cursorX = 0;
            this.cursorY = 0;

            this.stretchX = 1;
            this.stretchY = 1;
            this.currentAngle = 0;

            this.boundHandlers = {};

            this.finePointer = window.matchMedia(
                '(hover: hover) and (pointer: fine)'
            );

            this.reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            );

            if (
                !this.options.enabled ||
                (
                    this.options.disableOnTouch &&
                    !this.finePointer.matches
                )
            ) {
                return;
            }

            this.injectStyles();
            this.createCursor();
            this.bindEvents();
        }

        static merge(base, extra) {
            const result = { ...base };

            for (const [key, value] of Object.entries(extra || {})) {
                if (
                    value &&
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    base[key] &&
                    typeof base[key] === 'object' &&
                    !Array.isArray(base[key])
                ) {
                    result[key] = {
                        ...base[key],
                        ...value
                    };
                } else {
                    result[key] = value;
                }
            }

            return result;
        }

        get particlesEnabled() {
            return (
                this.options.particles &&
                !(
                    this.options.respectReducedMotion &&
                    this.reducedMotion.matches
                )
            );
        }

        injectStyles() {
            const o = this.options;
            const style = document.createElement('style');

            style.dataset.cpCustomCursor = 'true';

            style.textContent = `
                @media (hover: hover) and (pointer: fine) {
                    ${
                        o.hideNativeCursor
                            ? `
                                html.cp-custom-cursor-active,
                                html.cp-custom-cursor-active *,
                                html.cp-custom-cursor-active body,
                                html.cp-custom-cursor-active body * {
                                    cursor: none !important;
                                }
                            `
                            : ''
                    }
                }

                .${o.className} {
                    position: fixed;
                    top: 0;
                    left: 0;

                    width: ${Number(o.size)}px;
                    height: ${Number(o.size)}px;

                    background: ${o.color};
                    border-radius: 50%;

                    pointer-events: none;
                    z-index: ${Number(o.zIndex)};

                    opacity: 0;

                    transform: translate3d(-100px, -100px, 0);

                    will-change: transform, opacity, width, height;

                    transition:
                        width 140ms ease,
                        height 140ms ease;
                }

                html.cp-custom-cursor-active .${o.className} {
                    opacity: 1;
                }

                .${o.className}.is-hovering {
                    width: ${Number(o.hoverSize)}px;
                    height: ${Number(o.hoverSize)}px;
                }

                .${o.particleClassName} {
                    position: fixed;
                    top: 0;
                    left: 0;

                    width: var(--cp-particle-size, 3px);
                    height: var(--cp-particle-size, 3px);

                    border-radius: 50%;

                    background: var(
                        --cp-particle-color,
                        ${o.particleColor || o.color}
                    );

                    pointer-events: none;
                    z-index: ${Number(o.zIndex) - 1};

                    opacity: 0;
                    will-change: transform, opacity;

                    animation:
                        cp-custom-cursor-particle-fly
                        var(--cp-particle-duration, 260ms)
                        cubic-bezier(0.2, 0.65, 0.35, 1)
                        forwards;
                }

                @keyframes cp-custom-cursor-particle-fly {
                    0% {
                        opacity: 0.9;
                        transform: translate3d(0, 0, 0) scale(1);
                    }

                    35% {
                        opacity: 0.65;
                    }

                    100% {
                        opacity: 0;
                        transform:
                            translate3d(
                                var(--cp-move-x),
                                var(--cp-move-y),
                                0
                            )
                            scale(0.15);
                    }
                }

                @media (hover: none), (pointer: coarse) {
                    .${o.className},
                    .${o.particleClassName} {
                        display: none !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .${o.particleClassName} {
                        animation-duration: 100ms;
                    }
                }
            `;

            document.head.appendChild(style);
            this.styleElement = style;
        }

        createCursor() {
            this.cursor = document.createElement('div');

            this.cursor.className = this.options.className;
            this.cursor.setAttribute('aria-hidden', 'true');

            document.body.appendChild(this.cursor);
        }

        bindEvents() {
            this.boundHandlers.pointermove =
                this.onPointerMove.bind(this);

            this.boundHandlers.pointerover =
                this.onPointerOver.bind(this);

            this.boundHandlers.pointerleave = () => {
                if (this.cursor) {
                    this.cursor.style.opacity = '0';
                }
            };

            this.boundHandlers.pointerenter = () => {
                if (this.initialized && this.cursor) {
                    this.cursor.style.opacity = '';
                }
            };

            this.boundHandlers.blur = () => {
                if (this.cursor) {
                    this.cursor.style.opacity = '0';
                }
            };

            this.boundHandlers.focus = () => {
                if (this.initialized && this.cursor) {
                    this.cursor.style.opacity = '';
                }
            };

            document.addEventListener(
                'pointermove',
                this.boundHandlers.pointermove,
                { passive: true }
            );

            document.addEventListener(
                'pointerover',
                this.boundHandlers.pointerover
            );

            document.documentElement.addEventListener(
                'pointerleave',
                this.boundHandlers.pointerleave
            );

            document.documentElement.addEventListener(
                'pointerenter',
                this.boundHandlers.pointerenter
            );

            window.addEventListener(
                'blur',
                this.boundHandlers.blur
            );

            window.addEventListener(
                'focus',
                this.boundHandlers.focus
            );
        }

        onPointerMove(event) {
            if (
                event.pointerType !== 'mouse' ||
                this.destroyed
            ) {
                return;
            }

            const now = performance.now();

            this.mouseX = event.clientX;
            this.mouseY = event.clientY;

            if (!this.initialized) {
                this.cursorX = this.mouseX;
                this.cursorY = this.mouseY;

                this.lastMouseX = this.mouseX;
                this.lastMouseY = this.mouseY;
                this.lastMoveTime = now;

                this.initialized = true;

                document.documentElement.classList.add(
                    'cp-custom-cursor-active'
                );
            } else {
                const dx = this.mouseX - this.lastMouseX;
                const dy = this.mouseY - this.lastMouseY;

                const distance = Math.hypot(dx, dy);

                const elapsed = Math.max(
                    now - this.lastMoveTime,
                    1
                );

                const speed = distance / elapsed;

                this.emitParticles(
                    this.mouseX,
                    this.mouseY,
                    dx,
                    dy,
                    speed,
                    now
                );

                this.lastMouseX = this.mouseX;
                this.lastMouseY = this.mouseY;
                this.lastMoveTime = now;
            }

            this.startAnimation();
        }

        onPointerOver(event) {
            if (
                !(event.target instanceof Element) ||
                !this.cursor
            ) {
                return;
            }

            const selector = this.options.hoverTargets.join(',');

            const target = selector
                ? event.target.closest(selector)
                : null;

            this.cursor.classList.toggle(
                'is-hovering',
                Boolean(target)
            );
        }

        createParticle(x, y, directionX, directionY, speed) {
            if (
                !this.particlesEnabled ||
                this.particleCount >= this.options.maxParticles
            ) {
                return;
            }

            const o = this.options;

            const particle = document.createElement('span');
            particle.className = o.particleClassName;

            const size =
                o.particleSize.min +
                Math.random() *
                (o.particleSize.max - o.particleSize.min);

            const duration =
                o.particleDuration.min +
                Math.random() *
                (o.particleDuration.max - o.particleDuration.min);

            const moveX =
                -directionX * (5 + Math.random() * 13) +
                (Math.random() - 0.5) * 12;

            const moveY =
                -directionY * (5 + Math.random() * 13) +
                (Math.random() - 0.5) * 12;

            const speedFactor = Math.min(speed / 2, 1.5);

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            particle.style.setProperty(
                '--cp-particle-size',
                `${size}px`
            );

            particle.style.setProperty(
                '--cp-particle-duration',
                `${duration}ms`
            );

            particle.style.setProperty(
                '--cp-particle-color',
                o.particleColor || o.color
            );

            particle.style.setProperty(
                '--cp-move-x',
                `${moveX * speedFactor}px`
            );

            particle.style.setProperty(
                '--cp-move-y',
                `${moveY * speedFactor}px`
            );

            document.body.appendChild(particle);
            this.particleCount++;

            particle.addEventListener(
                'animationend',
                () => {
                    particle.remove();

                    this.particleCount = Math.max(
                        0,
                        this.particleCount - 1
                    );
                },
                { once: true }
            );
        }

        emitParticles(x, y, dx, dy, speed, now) {
            const o = this.options;

            if (
                !this.particlesEnabled ||
                speed < o.particleSpeedThreshold
            ) {
                return;
            }

            if (
                now - this.lastParticleTime <
                o.particleInterval
            ) {
                return;
            }

            this.lastParticleTime = now;

            const length = Math.hypot(dx, dy) || 1;

            const directionX = dx / length;
            const directionY = dy / length;

            const count =
                speed > 4
                    ? o.particleCount.high
                    : speed > 2.2
                        ? o.particleCount.medium
                        : o.particleCount.low;

            for (let i = 0; i < count; i++) {
                this.createParticle(
                    x - directionX * (4 + Math.random() * 8),
                    y - directionY * (4 + Math.random() * 8),
                    directionX,
                    directionY,
                    speed
                );
            }
        }

        animateCursor() {
            if (!this.cursor || this.destroyed) {
                this.animationFrame = null;
                return;
            }

            const dx = this.mouseX - this.cursorX;
            const dy = this.mouseY - this.cursorY;

            this.cursorX += dx * this.options.followSpeed;
            this.cursorY += dy * this.options.followSpeed;

            const speed = Math.hypot(dx, dy);

            if (speed > 0.15) {
                this.currentAngle = Math.atan2(dy, dx);
            }

            const targetStretch = Math.min(
                speed * this.options.stretchSensitivity,
                this.options.maxStretch
            );

            const targetX = 1 + targetStretch;
            const targetY = 1 - targetStretch * 0.4;

            this.stretchX +=
                (targetX - this.stretchX) * 0.25;

            this.stretchY +=
                (targetY - this.stretchY) * 0.25;

            this.cursor.style.transform = `
                translate3d(
                    ${this.cursorX}px,
                    ${this.cursorY}px,
                    0
                )
                translate(-50%, -50%)
                rotate(${this.currentAngle}rad)
                scale(${this.stretchX}, ${this.stretchY})
            `;

            if (
                Math.abs(dx) > 0.08 ||
                Math.abs(dy) > 0.08 ||
                Math.abs(this.stretchX - 1) > 0.005 ||
                Math.abs(this.stretchY - 1) > 0.005
            ) {
                this.animationFrame = requestAnimationFrame(
                    () => this.animateCursor()
                );
            } else {
                this.animationFrame = null;
            }
        }

        startAnimation() {
            if (this.animationFrame === null) {
                this.animationFrame = requestAnimationFrame(
                    () => this.animateCursor()
                );
            }
        }

        setOptions(options = {}) {
            this.options = CPCustomCursor.merge(
                this.options,
                options
            );

            if (!this.cursor || this.destroyed) {
                return this;
            }

            this.styleElement?.remove();
            this.cursor.remove();

            this.styleElement = null;
            this.cursor = null;

            this.injectStyles();
            this.createCursor();

            return this;
        }

        destroy() {
            this.destroyed = true;

            if (this.animationFrame !== null) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }

            document.removeEventListener(
                'pointermove',
                this.boundHandlers.pointermove
            );

            document.removeEventListener(
                'pointerover',
                this.boundHandlers.pointerover
            );

            document.documentElement.removeEventListener(
                'pointerleave',
                this.boundHandlers.pointerleave
            );

            document.documentElement.removeEventListener(
                'pointerenter',
                this.boundHandlers.pointerenter
            );

            window.removeEventListener(
                'blur',
                this.boundHandlers.blur
            );

            window.removeEventListener(
                'focus',
                this.boundHandlers.focus
            );

            document
                .querySelectorAll(`.${this.options.particleClassName}`)
                .forEach(particle => particle.remove());

            this.cursor?.remove();
            this.styleElement?.remove();

            document.documentElement.classList.remove(
                'cp-custom-cursor-active'
            );
        }
    }

    window.CPCustomCursor = CPCustomCursor;

    if (window.CPCustomCursorConfig?.autoStart !== false) {
        const start = () => {
            if (window.cpCustomCursor) {
                return;
            }

            const config = {
                ...(window.CPCustomCursorConfig || {})
            };

            delete config.autoStart;

            window.cpCustomCursor = new CPCustomCursor(config);
        };

        if (document.readyState === 'loading') {
            document.addEventListener(
                'DOMContentLoaded',
                start,
                { once: true }
            );
        } else {
            start();
        }
    }
})();
