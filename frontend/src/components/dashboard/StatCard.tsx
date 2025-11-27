import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { MobileAwareMotion } from "@/components/ui/MobileAwareMotion";

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    delay?: number;
    id?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className, delay = 0, id }: StatCardProps) {
    return (
        <MobileAwareMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            disableOnMobile={true}
        >
            <Card id={id} className={cn("overflow-hidden relative bg-card/50 backdrop-blur-sm min-w-0 w-full border-0", className)}>
                <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8" />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                        <Icon className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
                    {(description || trend) && (
                        <div className="flex items-center gap-2 mt-2">
                            {trend && (
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                                    trend.isPositive
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                )}>
                                    {trend.isPositive ? "+" : ""}{trend.value}%
                                </span>
                            )}
                            {description && (
                                <p className="text-xs text-muted-foreground/80">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </MobileAwareMotion>
    );
}
