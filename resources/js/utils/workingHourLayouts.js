export const workingHourLayouts = {
    daily: [
        { key: 'monday', days: ['monday'], label: 'days.monday' },
        { key: 'tuesday', days: ['tuesday'], label: 'days.tuesday' },
        { key: 'wednesday', days: ['wednesday'], label: 'days.wednesday' },
        { key: 'thursday', days: ['thursday'], label: 'days.thursday' },
        { key: 'friday', days: ['friday'], label: 'days.friday' },
        { key: 'saturday', days: ['saturday'], label: 'days.saturday' },
        { key: 'sunday', days: ['sunday'], label: 'days.sunday' },
    ],
    split: [
        { key: 'weekday', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], label: 'groups.weekday' },
        { key: 'saturday', days: ['saturday'], label: 'days.saturday' },
        { key: 'sunday', days: ['sunday'], label: 'days.sunday' },
    ],
    weekend: [
        { key: 'weekday', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], label: 'groups.weekday' },
        { key: 'weekend', days: ['saturday', 'sunday'], label: 'groups.weekend' },
    ],
};

export function groupsForLayout(layout) {
    return workingHourLayouts[layout] ?? workingHourLayouts.daily;
}
