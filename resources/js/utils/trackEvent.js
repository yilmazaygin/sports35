export function trackEvent(eventType, metadata = {}) {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) return;

    fetch(route('analytics.events'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token, Accept: 'application/json' },
        body: JSON.stringify({ event_type: eventType, path: window.location.pathname, ...metadata }),
        keepalive: true,
    }).catch(() => {});
}
