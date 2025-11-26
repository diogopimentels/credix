import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface MobileEntityCardProps {
    title: string;
    subtitle?: string;
    status?: {
        label: string;
        variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
    };
    details: {
        label: string;
        value: string | ReactNode;
    }[];
    actions?: ReactNode;
    onClick?: () => void;
}

export function MobileEntityCard({
    title,
    subtitle,
    status,
    details,
    actions,
    onClick,
}: MobileEntityCardProps) {
    return (
        <div
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-4 shadow-sm active:scale-[0.99] transition-transform touch-manipulation"
            onClick={onClick}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg leading-tight">{title}</h3>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                {status && (
                    <Badge variant={status.variant} className="shrink-0">
                        {status.label}
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                {details.map((detail, index) => (
                    <div key={index} className="space-y-0.5">
                        <p className="text-xs text-muted-foreground font-medium">{detail.label}</p>
                        <div className="font-medium truncate">{detail.value}</div>
                    </div>
                ))}
            </div>

            {actions && (
                <div className="pt-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {actions}
                </div>
            )}
        </div>
    );
}
