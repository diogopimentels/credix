import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
    status: StatusType;
    children: React.ReactNode;
    className?: string;
}

const statusStyles: Record<StatusType, string> = {
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/20 dark:border-emerald-500/20 shadow-[0_0_10px_-4px_rgba(16,185,129,0.3)]",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/20 dark:border-amber-500/20 shadow-[0_0_10px_-4px_rgba(245,158,11,0.3)]",
    error: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/20 dark:border-rose-500/20 shadow-[0_0_10px_-4px_rgba(244,63,94,0.3)]",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/20 dark:border-blue-500/20 shadow-[0_0_10px_-4px_rgba(59,130,246,0.3)]",
    neutral: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200/20 dark:border-slate-500/20 shadow-[0_0_10px_-4px_rgba(100,116,139,0.3)]",
};

const dotStyles: Record<StatusType, string> = {
    success: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    warning: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    error: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
    info: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    neutral: "bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]",
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-300",
            statusStyles[status],
            className
        )}>
            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotStyles[status])} />
            {children}
        </span>
    );
}
