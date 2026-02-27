import React from 'react';

interface ProgressIndicatorProps {
    current: number;
    total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-300 rounded-full ${
                            i < current
                                ? 'w-6 h-2 bg-gold'
                                : i === current
                                ? 'w-8 h-2 bg-gold shadow-gold'
                                : 'w-2 h-2 bg-navy-500'
                        }`}
                    />
                ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground font-sans">
                {current + 1} of {total}
            </span>
        </div>
    );
}
