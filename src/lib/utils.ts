import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number) {
    if (!amount || amount === '0') return 'Rp 0';

    // If string contains a range like "500.000 - 1.000.000"
    if (typeof amount === 'string' && amount.includes('-')) {
        const parts = amount.split('-').map(part => {
            const num = parseInt(part.replace(/[^\d]/g, '')) || 0;
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(num);
        });
        return parts.join(' - ');
    }

    const num = typeof amount === 'string' ? parseInt(amount.replace(/[^\d]/g, '')) || 0 : amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}
