import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { isMobile } from '@/utils/isMobile';

interface MobileAwareMotionProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    children: ReactNode;
    disableOnMobile?: boolean;
}

export function MobileAwareMotion({
    children,
    disableOnMobile = true,
    ...motionProps
}: MobileAwareMotionProps) {
    const [shouldAnimate, setShouldAnimate] = useState(true);

    useEffect(() => {
        if (disableOnMobile) {
            setShouldAnimate(!isMobile());
        }
    }, [disableOnMobile]);

    if (disableOnMobile && !shouldAnimate) {
        // Extract only the safe props for div
        const { initial, animate, transition, variants, whileHover, whileTap, whileFocus, whileInView, ...safeProps } = motionProps as any;
        return <div {...safeProps}>{children}</div>;
    }

    return <motion.div {...motionProps}>{children}</motion.div>;
}
