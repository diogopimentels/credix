import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("container mx-auto p-6 md:p-8 max-w-7xl space-y-8", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}
