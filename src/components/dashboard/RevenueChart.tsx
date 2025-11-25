import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface RevenueChartProps {
    data: {
        name: string
        total: number
    }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="col-span-4 border-white/10 bg-card/50 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 max-w-full overflow-x-hidden">
                <div className="w-full max-w-full">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data} margin={{ left: 0, right: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={"hsl(var(--chart-primary))"} stopOpacity={0.95} />
                                <stop offset="95%" stopColor={"hsl(var(--chart-primary))"} stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke={"hsl(var(--muted-foreground))"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={10}
                        />
                        <YAxis
                            stroke={"hsl(var(--muted-foreground))"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${value}`}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.18 }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                color: 'hsl(var(--card-foreground))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                                fontSize: '12px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        />
                        <Bar
                            dataKey="total"
                            fill="url(#colorTotal)"
                            radius={[6, 6, 0, 0]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
