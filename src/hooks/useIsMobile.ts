import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user is on a mobile device.
 * Uses both window width and User Agent as fallback.
 * Returns null on initial render to avoid SSR mismatch.
 */
export function useIsMobile(): boolean | null {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const check = () => {
            const widthCheck = window.innerWidth <= 767;
            const uaCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            setIsMobile(widthCheck || uaCheck);
        };

        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return isMobile;
}
