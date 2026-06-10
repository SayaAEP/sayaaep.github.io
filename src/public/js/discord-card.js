// Discord card hover effect with 1.2s delay
const aepTrigger = document.getElementById('aep-trigger');
const discordCard = document.getElementById('discord-card');
const iframe = discordCard.querySelector('iframe');
let showTimeout;

// Auto-resize iframe to content height
iframe.addEventListener('load', () => {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const resizeIframe = () => {
            const height = iframeDoc.body.scrollHeight;
            iframe.style.height = height + 'px';
        };
        resizeIframe();
        // Re-check after images load
        setTimeout(resizeIframe, 500);
    } catch (e) {
        // Fallback if can't access iframe content
        iframe.style.height = '720px';
    }
});

// Show card after hovering for 1.2 seconds
aepTrigger.addEventListener('mouseenter', () => {
    showTimeout = setTimeout(() => {
        discordCard.classList.add('show');
    }, 1200);
});

// Cancel show and hide card on mouse leave
aepTrigger.addEventListener('mouseleave', () => {
    clearTimeout(showTimeout);
    discordCard.classList.remove('show');
});

// Close card when clicking outside
document.addEventListener('click', (e) => {
    if (!discordCard.contains(e.target) && !aepTrigger.contains(e.target)) {
        discordCard.classList.remove('show');
    }
});
