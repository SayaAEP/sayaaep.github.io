// Badge tooltip that follows cursor - Firefox compatible
document.addEventListener('DOMContentLoaded', () => {
    // Create single tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'badge-tooltip-cursor';
    tooltip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltip);

    // Add styles via CSS (more reliable than inline styles for Firefox)
    const style = document.createElement('style');
    style.textContent = `
        .badge-tooltip-cursor {
            position: fixed;
            background: #141414d4;
            color: #e2e2e2ff;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 13px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            z-index: 10000;
            transition: opacity 0.21s ease, visibility 0.21s ease;
            transform: translate(0, 0);
            will-change: left, top, opacity;
        }
        .badge-tooltip-cursor.show {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(style);

    // Select elements with title attribute
    const badgeLinks = document.querySelectorAll('a.inline-flex');
    const customTitleLinks = document.querySelectorAll('a[title]');
    const standaloneImages = document.querySelectorAll('img[title]');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Function to add tooltip listeners
    const addTooltipListeners = (element) => {
        let hoverTimeout = null;
        let isHovered = false;

        // Store original title to data attribute
        const originalTitle = element.getAttribute('title');
        element.setAttribute('data-tooltip-text', originalTitle);
        element.removeAttribute('title');

        const showTooltip = (e) => {
            isHovered = true;
            // Always read current value from data-tooltip-text (may be updated by github-stars.js)
            const currentTitle = element.getAttribute('data-tooltip-text');
            if (!currentTitle) return;

            tooltip.innerHTML = currentTitle;

            // Position tooltip
            let x = e.clientX;
            let y = e.clientY;

            // Adjust position if tooltip would go off screen
            requestAnimationFrame(() => {
                const rect = tooltip.getBoundingClientRect();
                const padding = 16;

                // Check right edge
                if (x + padding + rect.width > window.innerWidth) {
                    x = x - rect.width - padding;
                }
                // Check left edge
                if (x - padding < 0) {
                    x = padding;
                }
                // Check bottom edge
                if (y + padding + rect.height > window.innerHeight) {
                    y = y - rect.height - padding;
                }
                // Check top edge
                if (y - padding < 0) {
                    y = padding;
                }

                tooltip.style.left = (x + padding) + 'px';
                tooltip.style.top = (y + padding) + 'px';
            });

            tooltip.classList.add('show');
        };

        const hideTooltip = () => {
            isHovered = false;
            tooltip.classList.remove('show');
        };

        // Desktop: hover dengan cursor follow
        if (!isTouchDevice) {
            // Use mouseenter/mouseleave for showing/hiding
            element.addEventListener('mouseenter', (e) => {
                showTooltip(e);
            });

            element.addEventListener('mousemove', (e) => {
                if (isHovered) {
                    let x = e.clientX;
                    let y = e.clientY;
                    const padding = 16;

                    // Boundary checks
                    requestAnimationFrame(() => {
                        const rect = tooltip.getBoundingClientRect();
                        if (x + padding + rect.width > window.innerWidth) {
                            x = x - rect.width - padding;
                        }
                        if (x - padding < 0) x = padding;
                        if (y + padding + rect.height > window.innerHeight) {
                            y = y - rect.height - padding;
                        }
                        if (y - padding < 0) y = padding;

                        tooltip.style.left = (x + padding) + 'px';
                        tooltip.style.top = (y + padding) + 'px';
                    });
                }
            });

            element.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        } else {
            // Mobile: tap dengan 300ms hold delay
            let touchStartTime = 0;

            element.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                // Get position of the element
                const rect = element.getBoundingClientRect();
                const fakeEvent = {
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top - 10
                };

                hoverTimeout = setTimeout(() => {
                    showTooltip(fakeEvent);
                }, 300);
            }, { passive: true });

            element.addEventListener('touchend', () => {
                const holdTime = Date.now() - touchStartTime;

                if (holdTime < 300) {
                    clearTimeout(hoverTimeout);
                }

                setTimeout(() => {
                    hideTooltip();
                }, 2000);
            });

            element.addEventListener('touchmove', () => {
                clearTimeout(hoverTimeout);
                hideTooltip();
            });
        }
    };

    // Apply to badge links (a.inline-flex with .badge-88x31 inside)
    badgeLinks.forEach(link => {
        const badge = link.querySelector('.badge-88x31');
        if (badge) {
            addTooltipListeners(link);
        }
    });

    // Apply to custom <a> with title (exclude badges)
    customTitleLinks.forEach(link => {
        if (!link.querySelector('.badge-88x31') && link.getAttribute('title')) {
            addTooltipListeners(link);
        }
    });

    // Apply to standalone images
    standaloneImages.forEach(img => {
        if (img.getAttribute('title')) {
            addTooltipListeners(img);
        }
    });
});