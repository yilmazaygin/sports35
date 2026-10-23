let frame = 0;
let generation = 0;
let removeUserListeners = null;
let pendingSectionId = null;

function stopScroll() {
    generation += 1;
    cancelAnimationFrame(frame);

    if (removeUserListeners) {
        removeUserListeners();
        removeUserListeners = null;
    }
}

export function queueSectionScroll(id) {
    pendingSectionId = id;
}

export function scrollToSection(id) {
    const target = document.getElementById(id);

    if (!target) {
        return false;
    }

    stopScroll();

    const run = generation;
    const header = document.querySelector('header');
    const offset = (header?.getBoundingClientRect().height ?? 0) + 20;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    const start = window.scrollY;
    const distance = top - start;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const url = new URL(window.location.href);

    if (url.hash !== `#${id}`) {
        url.hash = id;
        window.history.replaceState(window.history.state, '', url);
    }

    if (reduced || Math.abs(distance) < 2) {
        window.scrollTo(0, top);

        return true;
    }

    const duration = Math.min(1100, Math.max(700, Math.abs(distance) * 0.45));
    const startTime = performance.now();
    const easeInOutCubic = (progress) => (
        progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - ((-2 * progress + 2) ** 3) / 2
    );

    const onUserInterrupt = (event) => {
        if (event.type === 'keydown' && !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
            return;
        }

        stopScroll();
    };

    window.addEventListener('wheel', onUserInterrupt, { passive: true });
    window.addEventListener('touchmove', onUserInterrupt, { passive: true });
    window.addEventListener('keydown', onUserInterrupt);
    removeUserListeners = () => {
        window.removeEventListener('wheel', onUserInterrupt);
        window.removeEventListener('touchmove', onUserInterrupt);
        window.removeEventListener('keydown', onUserInterrupt);
    };

    const step = (now) => {
        if (run !== generation) {
            return;
        }

        const progress = Math.min(1, (now - startTime) / duration);

        window.scrollTo(0, start + distance * easeInOutCubic(progress));

        if (progress < 1) {
            frame = requestAnimationFrame(step);

            return;
        }

        stopScroll();
    };

    frame = requestAnimationFrame(step);

    return true;
}

export function flushSectionScroll() {
    const id = pendingSectionId || window.location.hash.replace(/^#/, '');
    pendingSectionId = null;

    if (!id) {
        return;
    }

    window.requestAnimationFrame(() => scrollToSection(id));
}
