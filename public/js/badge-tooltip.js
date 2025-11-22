// Badge tooltip that follows cursor
document.addEventListener('DOMContentLoaded', () => {
    // Create single tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'badge-tooltip-cursor';
    tooltip.style.cssText = `
        position: fixed;
        background: #27272a;
        color: #e4e4e7;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 13px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        z-index: 10000;
        transition: opacity 0.21s ease;
    `;
    document.body.appendChild(tooltip);
    
    // Select both badge links and standalone images with title attribute
    const badgeLinks = document.querySelectorAll('a.inline-flex');
    const standaloneImages = document.querySelectorAll('img[title]');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Function to add tooltip listeners
    const addTooltipListeners = (element, title) => {
        let hoverTimeout = null;
        
        // Remove default tooltip
        element.removeAttribute('title');
        
        // Desktop: hover dengan cursor follow
        if (!isTouchDevice) {
            element.addEventListener('mouseenter', () => {
                tooltip.textContent = title;
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            
            element.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.clientX + 16) + 'px';
                tooltip.style.top = (e.clientY + 16) + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'visible';
            });
        } else {
            // Mobile: tap dengan 300ms hold delay
            let touchStartTime = 0;
            
            element.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                
                hoverTimeout = setTimeout(() => {
                    const rect = element.getBoundingClientRect();
                    tooltip.textContent = title;
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    tooltip.style.top = (rect.bottom + -80) + 'px';
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                }, 300);
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                const holdTime = Date.now() - touchStartTime;
                
                // Cancel timeout jika touch < 300ms (scroll)
                if (holdTime < 300) {
                    clearTimeout(hoverTimeout);
                }
                
                // Hide tooltip after touchend
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                }, 2000);
            });
            
            element.addEventListener('touchmove', () => {
                // Cancel tooltip saat scroll
                clearTimeout(hoverTimeout);
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'visible';
            });
        }
    };
    
    // Apply to badge links
    badgeLinks.forEach(link => {
        const badge = link.querySelector('.badge-88x31');
        const title = link.getAttribute('title');
        
        if (badge && title) {
            addTooltipListeners(link, title);
        }
    });
    
    // Apply to standalone images
    standaloneImages.forEach(img => {
        const title = img.getAttribute('title');
        if (title) {
            addTooltipListeners(img, title);
        }
    });
});
