document.addEventListener('DOMContentLoaded', () => {
    // Delay to ensure badge-tooltip.js runs first
    setTimeout(() => {
        fetch('https://api.github.com/repos/TukangM/Windows10-11-iso')
            .then(res => res.json())
            .then(data => {
                const el = document.querySelector('a[href="https://github.com/TukangM/Windows10-11-iso"]');
                if (el) {
                    // Badge-tooltip.js menyimpan title di data-tooltip-text
                    const origTitle = el.getAttribute('data-tooltip-text') || el.getAttribute('title');
                    if (origTitle && origTitle.includes('{{stars}}')) {
                        const newTitle = origTitle.replace('{{stars}}', `⭐ ${data.stargazers_count} stars`);
                        // Update data-tooltip-text untuk badge-tooltip
                        el.setAttribute('data-tooltip-text', newTitle);
                        // Remove title attribute to prevent browser default tooltip
                        el.removeAttribute('title');
                    }
                }
            })
            .catch(() => {/* ignore error */});
    }, 50); // Wait 50ms for badge-tooltip.js to initialize
});