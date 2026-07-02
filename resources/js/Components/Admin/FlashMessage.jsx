import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            // Auto-dismiss could be added here
        }
    }, [flash?.success]);

    if (!flash?.success) {
        return null;
    }

    return (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {flash.success}
        </div>
    );
}
