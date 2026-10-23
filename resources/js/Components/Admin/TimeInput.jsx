const hours = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'));

function timeParts(value) {
    const match = /^(\d{1,2}):(\d{2})/.exec(String(value ?? ''));

    if (!match) {
        return ['', ''];
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour > 23 || minute > 59) {
        return ['', ''];
    }

    return [String(hour).padStart(2, '0'), String(minute).padStart(2, '0')];
}

const selectClass = 'admin-control w-auto min-w-0 flex-1 tabular-nums';

export default function TimeInput({
    value,
    onChange,
    disabled = false,
    className = '',
    id,
    label,
    clearable = false,
}) {
    const [hour, minute] = timeParts(value);

    const update = (nextHour, nextMinute) => {
        if (nextHour === '' || nextMinute === '') {
            onChange('');
            return;
        }

        onChange(`${nextHour}:${nextMinute}`);
    };

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <select
                id={id}
                disabled={disabled}
                value={hour}
                aria-label={label ? `${label} 00–23` : '00–23'}
                onChange={(event) => update(event.target.value, event.target.value === '' ? '' : (minute || '00'))}
                className={selectClass}
            >
                {(clearable || hour === '') && <option value="">{clearable ? '—' : ''}</option>}
                {hours.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <span className="select-none text-sm font-medium text-zinc-400" aria-hidden="true">:</span>
            <select
                disabled={disabled}
                value={minute}
                aria-label={label ? `${label} 00–59` : '00–59'}
                onChange={(event) => update(event.target.value === '' ? '' : (hour || '00'), event.target.value)}
                className={selectClass}
            >
                {(clearable || minute === '') && <option value="">{clearable ? '—' : ''}</option>}
                {minutes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
        </div>
    );
}
