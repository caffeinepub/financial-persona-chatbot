import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
    name: string;
    score: number;
    description: string;
    colorFilled: string;
    colorEmpty: string;
    descriptor: string;
    descriptorColor: string;
    icon: string;
    invertedScale?: boolean;
}

export function ScoreChart({
    name,
    score,
    description,
    colorFilled,
    colorEmpty,
    descriptor,
    descriptorColor,
    icon,
}: ScoreChartProps) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const data = [
        { value: clampedScore },
        { value: 100 - clampedScore },
    ];

    return (
        <div className="bg-card border border-navy-500 rounded-2xl p-5 card-shadow flex flex-col items-center gap-3 hover:border-gold/30 transition-all duration-300 group">
            <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={64}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            <Cell fill={colorFilled} />
                            <Cell fill={colorEmpty} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xl font-bold font-display" style={{ color: colorFilled }}>
                        {clampedScore}
                    </span>
                    <span className="text-xs text-muted-foreground font-sans">/100</span>
                </div>
            </div>

            <div className="text-center space-y-1">
                <h3 className="text-sm font-bold font-display text-foreground leading-tight">{name}</h3>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">{description}</p>
                <div
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans"
                    style={{ backgroundColor: `${descriptorColor}20`, color: descriptorColor }}
                >
                    {descriptor}
                </div>
            </div>
        </div>
    );
}
