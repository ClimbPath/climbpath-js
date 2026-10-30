/*!
 * cp-tooltips
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
class ClimbPathTooltip {
    constructor(options = {}) {
        this.options = {
            placement: 'top',
            offset: 12,
            viewportPadding: 10,

            showDelay: 150,
            hideDelay: 100,

            animation: true,
            autoPosition: true,

            touch: true,
            followScroll: true,

            enabled: true,

            ...options
        };

        this.tooltip = document.createElement('div');
        this.tooltip.className = 'cp-tooltip';
        this.tooltip.setAttribute('role', 'tooltip');

        this.activeTarget = null;
        this.showTimer = null;
        this.hideTimer = null;
        this.removeTimer = null;

        this.isVisible = false;
        this.isDestroyed = false;

        this.handlePointerOver = this.handlePointerOver.bind(this);
        this.handlePointerOut = this.handlePointerOut.bind(this);
        this.handleFocusIn = this.handleFocusIn.bind(this);
        this.handleFocusOut = this.handleFocusOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.init();
    }

    init() {
        document.addEventListener('pointerover', this.handlePointerOver);
        document.addEventListener('pointerout', this.handlePointerOut);

        document.addEventListener('focusin', this.handleFocusIn);
        document.addEventListener('focusout', this.handleFocusOut);

        document.addEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleOutsideClick, true);

        window.addEventListener('resize', this.handleResize);

        if (this.options.followScroll) {
            window.addEventListener('scroll', this.handleScroll, true);
        }
    }

    handlePointerOver(e) {
        if (!this.options.enabled || e.pointerType === 'touch') return;

        const target = e.target.closest('[cp-tooltip]');

        if (!target || target.contains(e.relatedTarget)) return;

        this.scheduleShow(target);
    }

    handlePointerOut(e) {
        if (e.pointerType === 'touch') return;

        const target = e.target.closest('[cp-tooltip]');

        if (!target || target.contains(e.relatedTarget)) return;

        this.scheduleHide();
    }

    handleFocusIn(e) {
        if (!this.options.enabled) return;

        const target = e.target.closest('[cp-tooltip]');

        if (target) {
            this.show(target);
        }
    }

    handleFocusOut(e) {
        const target = e.target.closest('[cp-tooltip]');

        if (target) {
            this.scheduleHide();
        }
    }

    handleClick(e) {
        if (!this.options.enabled || !this.options.touch) return;

        const target = e.target.closest('[cp-tooltip]');

        if (!target) return;

        if (this.activeTarget === target && this.isVisible) {
            this.hide();
        } else {
            this.show(target);
        }
    }

    handleOutsideClick(e) {
        if (!this.options.touch || !this.activeTarget) return;

        if (
            !this.activeTarget.contains(e.target) &&
            !this.tooltip.contains(e.target)
        ) {
            this.hide();
        }
    }

    handleResize() {
        if (this.activeTarget && this.isVisible) {
            this.updatePosition();
        }
    }

    handleScroll() {
        if (this.activeTarget && this.isVisible) {
            this.updatePosition();
        }
    }

    scheduleShow(target) {
        clearTimeout(this.hideTimer);
        clearTimeout(this.showTimer);

        this.showTimer = setTimeout(() => {
            this.show(target);
        }, this.options.showDelay);
    }

    scheduleHide() {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);

        this.hideTimer = setTimeout(() => {
            this.hide();
        }, this.options.hideDelay);
    }

    clearTimers() {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        clearTimeout(this.removeTimer);
    }

    getContent(target) {
        const type = target.getAttribute('cp-tooltip');

        if (type === 'text') {
            return {
                type: 'text',
                content: target.getAttribute('cp-tooltip-text') || ''
            };
        }

        if (type === 'custom') {
            const customType = target.getAttribute('cp-tooltip-custom');

            if (!customType) return null;

            const contentNode = Array.from(
                document.querySelectorAll('[cp-tooltip-content]')
            ).find(node =>
                node.getAttribute('cp-tooltip-content') === customType
            );

            if (!contentNode) return null;

            return {
                type: 'custom',
                content: contentNode.cloneNode(true)
            };
        }

        return null;
    }

    show(target) {
        if (
            !this.options.enabled ||
            this.isDestroyed ||
            !target ||
            !target.isConnected
        ) return;

        this.clearTimers();

        const content = this.getContent(target);

        if (!content) {
            this.hide();
            return;
        }

        this.activeTarget = target;

        this.tooltip.className = `cp-tooltip cp-tooltip--${content.type}`;

        this.tooltip.replaceChildren();

        if (content.type === 'text') {
            this.tooltip.textContent = content.content;
        } else {
            this.tooltip.appendChild(content.content);
        }

        if (!this.tooltip.isConnected) {
            document.body.appendChild(this.tooltip);
        }

        this.tooltip.style.display = 'block';

        this.updatePosition();

        requestAnimationFrame(() => {
            if (this.isDestroyed || !this.activeTarget) return;

            if (this.options.animation) {
                this.tooltip.classList.add('is-visible');
            } else {
                this.tooltip.classList.add('is-visible');
            }

            this.isVisible = true;
        });
    }

    updatePosition() {
        if (!this.activeTarget || !this.tooltip.isConnected) return;

        const targetRect = this.activeTarget.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        const offset = this.options.offset;
        const padding = this.options.viewportPadding;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const requestedPlace =
            this.activeTarget.getAttribute('cp-tooltip-place') ||
            this.options.placement;

        const opposite = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        };

        const candidates = requestedPlace === 'auto'
            ? ['top', 'bottom', 'right', 'left']
            : [requestedPlace];

        if (this.options.autoPosition && requestedPlace !== 'auto') {
            candidates.push(opposite[requestedPlace]);
        }

        candidates.push('top', 'bottom', 'right', 'left');

        const uniqueCandidates = [...new Set(candidates)];

        const positions = {
            top: {
                top: targetRect.top - tooltipRect.height - offset,
                left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
            },
            bottom: {
                top: targetRect.bottom + offset,
                left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
            },
            left: {
                top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
                left: targetRect.left - tooltipRect.width - offset
            },
            right: {
                top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
                left: targetRect.right + offset
            }
        };

        let selectedPosition = positions[uniqueCandidates[0]];

        for (const place of uniqueCandidates) {
            const position = positions[place];

            const fits =
                position.top >= padding &&
                position.left >= padding &&
                position.top + tooltipRect.height <= viewportHeight - padding &&
                position.left + tooltipRect.width <= viewportWidth - padding;

            if (fits) {
                selectedPosition = position;
                break;
            }
        }

        let top = selectedPosition.top;
        let left = selectedPosition.left;

        left = Math.max(
            padding,
            Math.min(left, viewportWidth - tooltipRect.width - padding)
        );

        top = Math.max(
            padding,
            Math.min(top, viewportHeight - tooltipRect.height - padding)
        );

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    hide() {
        this.clearTimers();

        if (!this.tooltip.isConnected) {
            this.activeTarget = null;
            this.isVisible = false;
            return;
        }

        this.tooltip.classList.remove('is-visible');

        this.activeTarget = null;
        this.isVisible = false;

        this.removeTimer = setTimeout(() => {
            if (!this.activeTarget && this.tooltip.isConnected) {
                this.tooltip.remove();
            }
        }, this.options.animation ? 180 : 0);
    }

    setOptions(options = {}) {
        this.options = {
            ...this.options,
            ...options
        };

        if (!this.options.followScroll) {
            window.removeEventListener('scroll', this.handleScroll, true);
        } else {
            window.addEventListener('scroll', this.handleScroll, true);
        }

        if (this.activeTarget && this.isVisible) {
            this.updatePosition();
        }

        return this;
    }

    enable() {
        this.options.enabled = true;
        return this;
    }

    disable() {
        this.options.enabled = false;
        this.hide();
        return this;
    }

    destroy() {
        this.clearTimers();

        document.removeEventListener('pointerover', this.handlePointerOver);
        document.removeEventListener('pointerout', this.handlePointerOut);

        document.removeEventListener('focusin', this.handleFocusIn);
        document.removeEventListener('focusout', this.handleFocusOut);

        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('click', this.handleOutsideClick, true);

        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll, true);

        this.tooltip.remove();

        this.activeTarget = null;
        this.isVisible = false;
        this.isDestroyed = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cpTooltips = new ClimbPathTooltip(
        window.CPTooltipsConfig || {}
    );
});
