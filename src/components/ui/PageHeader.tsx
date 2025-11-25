import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 animate-slide-up w-full max-w-full overflow-hidden", className)}>
            <div className="space-y-1.5">
                {breadcrumbs && (
                    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        {breadcrumbs.map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                                {index > 0 && <ChevronRight className="w-4 h-4" />}
                                {item.href ? (
                                    <Link
                                        to={item.href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground font-medium">{item.label}</span>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && (
                    <p className="text-muted-foreground text-lg">{description}</p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
