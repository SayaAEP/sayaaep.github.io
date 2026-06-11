document.addEventListener('DOMContentLoaded', () => {
    // Update star count immediately - badge-tooltip.js reads from data-tooltip-text dynamically
    fetch('https://api.github.com/repos/TukangM/Windows10-11-iso')
        .then(res => res.json())
        .then(data => {
            const el = document.querySelector('a[href="https://github.com/TukangM/Windows10-11-iso"]');
            if (el) {
                const origTitle = el.getAttribute('data-tooltip-text') || el.getAttribute('title');
                if (origTitle && origTitle.includes('{{stars}}')) {
                    const newTitle = origTitle.replace('{{stars}}', `⭐ ${data.stargazers_count} stars`);
                    el.setAttribute('data-tooltip-text', newTitle);
                }
            }
        })
        .catch(() => {/* ignore error */});
});