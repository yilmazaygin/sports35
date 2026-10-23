const icons = {
    home: (
        <>
            <path d="M4 10.5 12 4l8 6.5" />
            <path d="M6.5 9.8V20h11V9.8" />
            <path d="M10 20v-5h4v5" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4.5l3 2" />
        </>
    ),
    tag: (
        <>
            <path d="M3.5 12.5V4.8A1.3 1.3 0 0 1 4.8 3.5h7.7L20.5 11.5 12.5 19.5 3.5 12.5Z" />
            <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
        </>
    ),
    megaphone: (
        <>
            <path d="M4 10v4" />
            <path d="M4 10h4l9-4v12l-9-4H4" />
            <path d="M8 14.2c.2 2 1 3.8 2.2 4.8" />
        </>
    ),
    calendar: (
        <>
            <rect x="4" y="5.5" width="16" height="14" rx="2" />
            <path d="M8 3.5v4M16 3.5v4M4 10h16" />
        </>
    ),
    document: (
        <>
            <path d="M7 3.5h7l4 4V20.5H7V3.5Z" />
            <path d="M14 3.5V8h4.5" />
            <path d="M9.5 12.5h5M9.5 16h5" />
        </>
    ),
    photo: (
        <>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.4" />
            <path d="m7 16 3.2-3.2a1 1 0 0 1 1.4 0L17 17.5" />
        </>
    ),
    building: (
        <>
            <path d="M5 20.5V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5v15" />
            <path d="M15 10h2.5A1.5 1.5 0 0 1 19 11.5v9" />
            <path d="M3.5 20.5h17" />
            <path d="M8 8h2M8 12h2M8 16h2" />
        </>
    ),
    folder: (
        <>
            <path d="M3.5 8.5V6.8A1.3 1.3 0 0 1 4.8 5.5h4l1.6 1.8h8.3A1.3 1.3 0 0 1 20 8.6v8.6a1.3 1.3 0 0 1-1.3 1.3H4.8a1.3 1.3 0 0 1-1.3-1.3V8.5Z" />
        </>
    ),
    spark: (
        <>
            <path d="M12 3.5 13.4 9 19 10.5 13.4 12 12 17.5 10.6 12 5 10.5 10.6 9 12 3.5Z" />
            <path d="M18 15.5 18.6 17.4 20.5 18 18.6 18.6 18 20.5 17.4 18.6 15.5 18 17.4 17.4 18 15.5Z" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="9" r="3" />
            <path d="M3.8 19c.6-2.6 2.6-4 5.2-4s4.6 1.4 5.2 4" />
            <circle cx="17" cy="9.5" r="2.2" />
            <path d="M16.2 15c1.8.2 3.2 1.2 3.8 3.2" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3.5 19 6.2v5.4c0 4-2.8 6.8-7 8.4-4.2-1.6-7-4.4-7-8.4V6.2L12 3.5Z" />
            <path d="m9 12 2 2 4-4.5" />
        </>
    ),
    external: (
        <>
            <path d="M14 5h5v5" />
            <path d="M19 5 10.5 13.5" />
            <path d="M17 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5 18V7.5A1.5 1.5 0 0 1 6.5 6H11" />
        </>
    ),
    menu: (
        <>
            <path d="M4 7h16M4 12h16M4 17h16" />
        </>
    ),
    close: (
        <>
            <path d="M6 6l12 12M18 6 6 18" />
        </>
    ),
    chevron: (
        <path d="m6 9 6 6 6-6" />
    ),
    logout: (
        <>
            <path d="M10 6.5H6.8A1.3 1.3 0 0 0 5.5 7.8v8.4a1.3 1.3 0 0 0 1.3 1.3H10" />
            <path d="M10 12h8.5" />
            <path d="m15.5 8.5 3.5 3.5-3.5 3.5" />
        </>
    ),
};

export default function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {icons[name] ?? null}
        </svg>
    );
}
