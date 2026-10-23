const icons = {
    broom: 'M12 2.5v10.5M8.25 13h7.5M8.25 13.2 7 21.2M10.1 13.2 9.65 21.2M12 13.2v8M13.9 13.2l.45 8M15.75 13.2 17 21.2',
    sparkle: 'M12.813 15.904 12 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L5.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L12 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L18.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09Z',
    equipment: 'M12 17V7m0 10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M12 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0v10',
    dumbbell: 'M3.5 9.5v5M6 7v10M8.5 9.5v5M8.5 12h7M15.5 9.5v5M18 7v10M20.5 9.5v5',
    clock: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    users: 'M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
    shield: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
};

export const whyUsIconNames = Object.keys(icons);

export default function WhyUsIcon({ name, className = 'h-6 w-6' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icons[name] ?? icons.sparkle} />
        </svg>
    );
}
