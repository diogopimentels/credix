import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("container mx-auto p-6 md:p-8 max-w-7xl space-y-8 w-full max-w-full overflow-x-hidden", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}
