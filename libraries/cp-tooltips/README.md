# CP Tooltips

A lightweight, customizable tooltip library with automatic positioning, smooth animations, and support for custom HTML content.

`cp-tooltips` is a dependency-free JavaScript library that makes it easy to add interactive tooltips to any website using simple HTML attributes.

Designed for flexibility and easy integration, it provides automatic viewport positioning, configurable delays, touch interaction, dynamic content handling, and a dedicated CSS stylesheet for complete visual customization.

**Vanilla JavaScript · Zero dependencies · Custom HTML · Automatic positioning · Fully customizable**

## ✨ Features

- **Simple integration** — create tooltips using HTML attributes without writing additional JavaScript.
- **Text tooltips** — display simple text directly through HTML attributes.
- **Custom HTML content** — create rich tooltips containing HTML elements, images, icons, and other content.
- **Four positioning options** — place tooltips at the top, bottom, left, or right of their target elements.
- **Automatic positioning** — automatically tries alternative positions when the requested position does not fit within the viewport.
- **Viewport boundaries** — keeps tooltips within the visible browser area.
- **Smooth animations** — animated appearance and disappearance with CSS transitions.
- **Configurable delays** — control how quickly tooltips appear and disappear.
- **Touch interaction** — optionally supports click-based tooltip activation on touch-oriented devices.
- **Keyboard interaction** — supports focus-based activation for keyboard navigation.
- **Dynamic elements** — works with elements added to the page after initialization through event delegation.
- **Scroll and resize handling** — updates tooltip positioning when the viewport or page changes.
- **Runtime configuration** — modify settings without reinitializing the library.
- **Reduced motion support** — respects the operating system's reduced-motion preference through CSS.
- **Custom styling** — all visual properties are controlled through a separate CSS stylesheet.
- **No dependencies** — built entirely with vanilla JavaScript.
- **Lightweight setup** — one JavaScript file and one CSS file.

## 📦 Installation

### Option 1 — Download

Download the following files from this repository:

- `cp-tooltips.js`
- `cp-tooltips-style.css`

Place them in your project's JavaScript and CSS directories.

Include both files in your HTML page:

```html
<link rel="stylesheet" href="/css/cp-tooltips-style.css">

<script src="/js/cp-tooltips.js"></script>
```

### Option 2 — Configure before initialization

You can define the configuration before loading the JavaScript file.

```html
<script>
    window.CPTooltipsConfig = {
        placement: 'top',
        offset: 12,
        autoPosition: true
    };
</script>

<script src="/js/cp-tooltips.js"></script>
```

The library initializes automatically after the DOM is ready.

## 🚀 Quick start

CP Tooltips uses HTML attributes to define tooltip behavior.

### Text tooltip

Use `cp-tooltip="text"` and `cp-tooltip-text` to display a simple text tooltip.

```html
<button
    cp-tooltip="text"
    cp-tooltip-text="This is a simple tooltip">
    Hover me
</button>
```

### Custom HTML tooltip

For more advanced tooltips, use `cp-tooltip="custom"`.

Define the custom content using `cp-tooltip-content` and reference it through `cp-tooltip-custom`.

```html
<button
    cp-tooltip="custom"
    cp-tooltip-custom="info">
    Hover me
</button>

<div cp-tooltip-content="info">
    <div class="tt-custom-wrapper">
        <strong>Additional information</strong>
        <p>This is a custom HTML tooltip.</p>
    </div>
</div>
```

Custom content is cloned into the tooltip when activated. The original content remains in the document.

You can include HTML elements, images, icons, links, and custom components.

## 📍 Positioning

CP Tooltips supports four positioning options and an automatic positioning mode.

| Position | Description |
|---|---|
| `top` | Displays the tooltip above the target element. |
| `bottom` | Displays the tooltip below the target element. |
| `left` | Displays the tooltip to the left of the target element. |
| `right` | Displays the tooltip to the right of the target element. |
| `auto` | Automatically selects the first suitable position. |

Set the position using `cp-tooltip-place`.

```html
<button
    cp-tooltip="text"
    cp-tooltip-text="Tooltip above"
    cp-tooltip-place="top">
    Top
</button>

<button
    cp-tooltip="text"
    cp-tooltip-text="Tooltip below"
    cp-tooltip-place="bottom">
    Bottom
</button>

<button
    cp-tooltip="text"
    cp-tooltip-text="Tooltip on the left"
    cp-tooltip-place="left">
    Left
</button>

<button
    cp-tooltip="text"
    cp-tooltip-text="Tooltip on the right"
    cp-tooltip-place="right">
    Right
</button>

<button
    cp-tooltip="text"
    cp-tooltip-text="Automatically positioned"
    cp-tooltip-place="auto">
    Auto
</button>
```

The default position is `top`.

### Automatic positioning

When `autoPosition` is enabled, the library first tries the requested position and then its opposite.

For example:

- `top` → `bottom`
- `bottom` → `top`
- `left` → `right`
- `right` → `left`

If neither position fits, the library tries other available directions.

The final position is adjusted to prevent the tooltip from overflowing the viewport.

## ⚙️ Configuration

The library accepts configuration options through `window.CPTooltipsConfig`.

```javascript
window.CPTooltipsConfig = {
    placement: 'top',
    offset: 12,
    viewportPadding: 10,

    showDelay: 150,
    hideDelay: 100,

    animation: true,
    autoPosition: true,

    touch: true,
    followScroll: true,

    enabled: true
};
```

### Positioning

| Option | Description |
|---|---|
| `placement` | Default tooltip position: `top`, `bottom`, `left`, `right`, or `auto`. |
| `offset` | Distance between the target element and tooltip in pixels. |
| `viewportPadding` | Minimum distance between the tooltip and viewport edges. |
| `autoPosition` | Automatically tries alternative positions when the requested position does not fit. |

### Timing

| Option | Description |
|---|---|
| `showDelay` | Delay before displaying a tooltip, in milliseconds. |
| `hideDelay` | Delay before hiding a tooltip, in milliseconds. |

### Behavior

| Option | Description |
|---|---|
| `animation` | Enables or disables tooltip visibility animations. |
| `touch` | Enables click-based tooltip activation on touch-oriented devices. |
| `followScroll` | Updates tooltip positioning when the page scrolls. |
| `enabled` | Enables or disables the entire library. |

### Example configuration

```javascript
window.CPTooltipsConfig = {
    placement: 'top',
    offset: 14,
    viewportPadding: 12,

    showDelay: 200,
    hideDelay: 150,

    animation: true,
    autoPosition: true,

    touch: true,
    followScroll: true,

    enabled: true
};
```

All options are optional. The library uses its default values when no custom configuration is provided.

## 🎨 Styling and customization

CP Tooltips uses a separate stylesheet:

`cp-tooltips-style.css`

The stylesheet controls the visual appearance of the tooltip and is intentionally independent of the JavaScript functionality.

You can freely customize:

- Background and text colors.
- Borders and border radius.
- Shadows and transparency.
- Typography and font weights.
- Padding and dimensions.
- Maximum tooltip width.
- Animation duration and transitions.
- Custom HTML elements and wrappers.

### CSS classes

| Class | Description |
|---|---|
| `.cp-tooltip` | Main tooltip container. |
| `.cp-tooltip--text` | Text tooltip variant. |
| `.cp-tooltip--custom` | Custom HTML tooltip variant. |
| `.cp-tooltip.is-visible` | Applied when the tooltip becomes visible. |
| `.tt-custom-wrapper` | Optional wrapper for custom tooltip content. |

### Custom styling example

```css
.cp-tooltip {
    background: #15181d;
    color: #ffffff;

    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;

    font-size: 0.85rem;
    font-weight: 500;

    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.tt-custom-wrapper {
    padding: 16px;

    background: #ffffff;
    color: #15181d;

    border-radius: 12px;
}
```

**Important:** The default stylesheet is only a starting point. Customize `cp-tooltips-style.css` to match your website's design system.

## 💡 Usage examples

### Icon tooltip

```html
<button
    cp-tooltip="text"
    cp-tooltip-text="Open settings"
    cp-tooltip-place="bottom">
    ⚙
</button>
```

### Rich information tooltip

```html
<div
    cp-tooltip="custom"
    cp-tooltip-custom="route-info"
    cp-tooltip-place="right">
    Route information
</div>

<div cp-tooltip-content="route-info">
    <div class="tt-custom-wrapper">
        <strong>Ferrata difficulty</strong>
        <p>Difficulty level: C/D</p>
        <span>Suitable for experienced climbers.</span>
    </div>
</div>
```

### Image preview

```html
<div
    cp-tooltip="custom"
    cp-tooltip-custom="preview">
    Hover for preview
</div>

<div cp-tooltip-content="preview">
    <div class="tt-custom-wrapper">
        <img src="/images/route.jpg" alt="Route preview">
        <strong>Mountain route</strong>
    </div>
</div>
```

### Dynamically added elements

The library uses event delegation, so elements added after initialization are supported automatically.

```javascript
const button = document.createElement('button');

button.setAttribute('cp-tooltip', 'text');
button.setAttribute('cp-tooltip-text', 'Dynamically added tooltip');

document.body.appendChild(button);
```

No additional initialization is required.

## 🧩 JavaScript API

The automatically initialized instance is available globally:

```javascript
window.cpTooltips
```

### setOptions(options)

Updates the library configuration at runtime.

```javascript
window.cpTooltips.setOptions({
    placement: 'bottom',
    offset: 16,
    showDelay: 300
});
```

Returns the current instance, allowing method chaining.

### show(element)

Manually displays a tooltip for a specific HTML element.

```javascript
const element = document.querySelector('#my-element');

window.cpTooltips.show(element);
```

### hide()

Hides the currently active tooltip.

```javascript
window.cpTooltips.hide();
```

### enable()

Enables tooltip functionality.

```javascript
window.cpTooltips.enable();
```

### disable()

Disables tooltip functionality and hides any active tooltip.

```javascript
window.cpTooltips.disable();
```

### destroy()

Removes event listeners, clears pending timers, removes the tooltip element, and destroys the current instance.

```javascript
window.cpTooltips.destroy();
```

After calling `destroy()`, a new instance must be created manually if you want to use the library again.

## ♿ Accessibility and compatibility

CP Tooltips includes basic accessibility considerations:

- Supports focus-based activation for keyboard navigation.
- Respects the operating system's reduced-motion preference through CSS.
- Uses semantic tooltip role attributes.
- Supports touch-oriented interaction through click activation.

Tooltips should not be the only way to access essential information.

For production use, consider combining tooltips with visible labels, accessible descriptions, and appropriate keyboard interactions.

## 🌐 Browser support

CP Tooltips is designed for modern browsers with JavaScript enabled.

It uses standard browser APIs, including:

- DOM event delegation.
- Pointer Events.
- `Element.closest()`.
- `getBoundingClientRect()`.
- CSS transitions.
- `requestAnimationFrame()`.

Actual compatibility depends on the browser APIs supported by the current implementation.

## 📄 License

This library is licensed under the MIT License, if a library-specific license is present.

If no library-specific license or explicit licensing notice exists, the repository's root LICENSE applies by default.

If this library includes third-party code or assets, their original license terms remain applicable.

## 🏔️ About ClimbPath

Developed and maintained by ClimbPath.

Website: https://climbpath.eu/

GitHub: https://github.com/ClimbPath/climbpath-js

## 💬 Contributing

Bug reports, suggestions, and improvements are welcome.

Please include reproduction steps for reported issues and describe any relevant browser or device details.

Built by ClimbPath. Open to everyone.