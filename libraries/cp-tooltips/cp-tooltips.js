class ClimbPathTooltip {
    constructor() {
        this.tooltip = document.createElement('div');
        this.init();
    }

    init() {
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[cp-tooltip]');
            if (target) this.show(target);
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[cp-tooltip]');
            if (target) {
                const relatedTarget = e.relatedTarget;
                
                if (!this.tooltip.contains(relatedTarget)) {
                    this.hide();
                }
            }
        });
    }

    show(target) {
        const type = target.getAttribute('cp-tooltip'); 
        const place = target.getAttribute('cp-tooltip-place') || 'top';

        this.tooltip.className = 'cp-tooltip';
        this.tooltip.innerHTML = '';

        if (type === 'text') {
            this.tooltip.textContent = target.getAttribute('cp-tooltip-text');
        } else if (type === 'custom') {
            const customType = target.getAttribute('cp-tooltip-custom');

            const contentNode = target.querySelector(`[cp-tooltip-content="${customType}"]`) 
                             || document.querySelector(`[cp-tooltip-content="${customType}"]`);
            
            if (contentNode) {
                this.tooltip.innerHTML = contentNode.innerHTML;
            }
        }

        document.body.appendChild(this.tooltip);
        this.tooltip.style.display = 'block';

        const rect = target.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let topPos, leftPos;

        switch (place) {
            case 'bottom':
                topPos = rect.bottom + scrollY + 12;
                leftPos = rect.left + scrollX + (rect.width / 2) - (this.tooltip.offsetWidth / 2);
                break;

            case 'left':
                topPos = rect.top + scrollY + (rect.height / 2) - (this.tooltip.offsetHeight / 2);
                leftPos = rect.left + scrollX - this.tooltip.offsetWidth - 12;
                break;

            case 'right':
                topPos = rect.top + scrollY + (rect.height / 2) - (this.tooltip.offsetHeight / 2);
                leftPos = rect.right + scrollX + 12;
                break;

            default:
                topPos = rect.top + scrollY - this.tooltip.offsetHeight - 12;
                leftPos = rect.left + scrollX + (rect.width / 2) - (this.tooltip.offsetWidth / 2);
                break;
        }

        leftPos = Math.max(10, Math.min(leftPos, window.innerWidth - this.tooltip.offsetWidth - 10));
        topPos = Math.max(10, Math.min(topPos, window.innerHeight + scrollY - this.tooltip.offsetHeight - 10));

        this.tooltip.style.top = `${topPos}px`;
        this.tooltip.style.left = `${leftPos}px`;
    }

    hide() {
        if (this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ClimbPathTooltip();
});