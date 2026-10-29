# CP Custom Cursor

**A configurable custom cursor with smooth movement, elastic motion, and particle effects.**

`cp-custom-cursor` is a lightweight, dependency-free JavaScript library that replaces the default mouse cursor with a customizable animated cursor.

Designed to be easy to integrate into any website, it offers configurable colors, sizes, hover effects, motion particles, and more — all in a single JavaScript file.

<p align="center">
  <strong>Vanilla JavaScript · Zero dependencies · Fully configurable</strong>
</p>

---

## ✨ Features

- **Custom appearance** — configure cursor and particle colors.
- **Smooth movement** — create fluid cursor-following animations.
- **Elastic motion** — add a stretching effect based on cursor movement.
- **Particle trail** — generate particles as the cursor moves.
- **Hover effects** — change cursor size over selected elements.
- **Flexible configuration** — customize behavior through a simple options object.
- **Runtime updates** — change settings after initialization.
- **Reduced motion support** — respect the user's motion preferences.
- **Touch-device detection** — optionally disable the cursor on touch devices.
- **No dependencies** — built with vanilla JavaScript.
- **Single-file setup** — HTML, CSS, and JavaScript behavior are handled by one file.

## 📦 Installation

### Option 1 — Download

1. Download `cp-custom-cursor.js` from this repository.
2. Place it in your project's JavaScript directory.
3. Include it in your HTML page.

```html
<script src="/js/cp-custom-cursor.js"></script>
```

## 🚀 Quick start

The cursor works with its default settings. To customize it, define `CPCustomCursorConfig` **before** loading the library.

```html
<script>
    window.CPCustomCursorConfig = {
        color: '#c1d82f',
        particleColor: '#ffffff',
        size: 10,
        hoverSize: 18,
        particles: true,
        maxParticles: 24,
        followSpeed: 0.25
    };
</script>

<script src="/js/cp-custom-cursor.js"></script>
```

That's it. No additional HTML markup or stylesheet is required.

## ⚙️ Configuration

The library accepts an options object through `window.CPCustomCursorConfig`.

### Appearance

| Option | Description |
|---|---|
| `color` | Main cursor color. |
| `particleColor` | Particle trail color. |
| `size` | Default cursor size. |
| `hoverSize` | Cursor size when hovering over a target. |
| `zIndex` | Stacking order of the cursor and effects. |
| `className` | Custom CSS class for the cursor element. |
| `particleClassName` | Custom CSS class for particle elements. |

### Movement

| Option | Description |
|---|---|
| `followSpeed` | Controls how quickly the cursor follows the pointer. |
| `stretchSensitivity` | Controls how strongly movement affects stretching. |
| `maxStretch` | Maximum stretching amount. |

### Particles

| Option | Description |
|---|---|
| `particles` | Enables or disables the particle trail. |
| `maxParticles` | Maximum number of particles allowed at once. |
| `particleInterval` | Interval between particle creation attempts. |
| `particleSpeedThreshold` | Minimum movement speed required to emit particles. |
| `particleCount` | Particle intensity preset: `low`, `medium`, or `high`. |
| `particleSize` | Minimum and maximum particle sizes. |
| `particleDuration` | Minimum and maximum particle lifetimes. |

### Behavior

| Option | Description |
|---|---|
| `hoverTargets` | CSS selector for elements that trigger the hover effect. |
| `hideNativeCursor` | Hides the native cursor while the custom cursor is active. |
| `respectReducedMotion` | Respects the system's reduced-motion preference. |
| `disableOnTouch` | Disables the custom cursor on touch-oriented devices. |
| `enabled` | Enables or disables the cursor. |
| `autoStart` | Controls automatic initialization, if supported by the current build. |

### Example configuration

```javascript
window.CPCustomCursorConfig = {
    color: '#c1d82f',
    particleColor: '#c1d82f',

    size: 10,
    hoverSize: 18,
    zIndex: 9999,

    followSpeed: 0.25,
    stretchSensitivity: 0.12,
    maxStretch: 1.8,

    particles: true,
    maxParticles: 24,
    particleInterval: 18,
    particleSpeedThreshold: 1.5,
    particleCount: 'medium',

    particleSize: {
        min: 2,
        max: 5
    },

    particleDuration: {
        min: 300,
        max: 700
    },

    hoverTargets: 'a, button, [data-cursor-hover]',

    hideNativeCursor: true,
    respectReducedMotion: true,
    disableOnTouch: true,
    enabled: true
};
```

*Use the option names and value formats supported by the version you have installed. Defaults and available options may change between releases.*

## 🎨 Customization examples

### Change the cursor color

```javascript
window.cpCustomCursor.setOptions({
    color: '#00e5ff',
    particleColor: '#00e5ff'
});
```

### Disable particles

```javascript
window.cpCustomCursor.setOptions({
    particles: false
});
```

### Change the cursor size

```javascript
window.cpCustomCursor.setOptions({
    size: 12,
    hoverSize: 22
});
```

### Customize hover targets

```javascript
window.CPCustomCursorConfig = {
    hoverTargets: 'a, button, .interactive, [data-cursor-hover]'
};
```

The hover selector should be configured before the library initializes unless the installed version explicitly supports updating it at runtime.

## 🧩 JavaScript API

The automatically initialized instance is available as:

```javascript
window.cpCustomCursor
```

### `setOptions(options)`

Updates the cursor configuration at runtime.

```javascript
window.cpCustomCursor.setOptions({
    color: '#ff4d6d',
    size: 14
});
```

### `destroy()`

Removes the custom cursor and cleans up its effects.

```javascript
window.cpCustomCursor.destroy();
```

Check the source code for the exact lifecycle behavior of the version you are using.

## ♿ Accessibility and compatibility

- The library can respect the operating system's reduced-motion preference.
- It can disable itself on touch-oriented devices.
- The native cursor can remain visible if configured to do so.
- The custom cursor is a visual enhancement and should not replace standard interactive controls or keyboard accessibility.

Test the library with your site's navigation, dialogs, overlays, and other interactive elements before deploying it.

## 🌐 Browser support

The library is intended for modern browsers with JavaScript enabled. Actual support depends on the browser APIs used by the current implementation.

## 📄 License

This library is licensed under the [MIT License](./LICENSE), if a library-specific license is present.

If no library-specific license or explicit licensing notice exists, the repository's root [LICENSE](../../LICENSE) applies by default.

If this library includes third-party code or assets, their original license terms remain applicable.

## 🏔️ About ClimbPath

Developed and maintained by **ClimbPath**.

- Website: https://climbpath.eu/
- GitHub: https://github.com/ClimbPath/climbpath-js

## 💬 Contributing

Bug reports, suggestions, and improvements are welcome. Please include reproduction steps for reported issues and describe any relevant browser or device details.

---

**Built by ClimbPath. Open to everyone.**
