import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Option {
    id: string;
    label: string;
    sublabel: string;
    emoji: string;
}

const OPTIONS: Option[] = [
    { id: 'fd_rd_savings', label: 'FD / RD / Savings', sublabel: 'Fixed Deposits & Recurring', emoji: '🏦' },
    { id: 'gold_silver_etfs', label: 'Gold / Silver / ETFs', sublabel: 'Precious Metals & Exchange Traded', emoji: '🥇' },
    { id: 'real_estate', label: 'Real Estate', sublabel: 'Property & Land', emoji: '🏠' },
    { id: 'mfs_equity', label: 'MFs / Equity', sublabel: 'Mutual Funds & Stocks', emoji: '📈' },
    { id: 'debt', label: 'Debt', sublabel: 'Bonds & Debentures', emoji: '📋' },
];

interface QuestionOneProps {
    onSubmit: (selected: string[]) => void;
}

export function QuestionOne({ onSubmit }: QuestionOneProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
                {OPTIONS.map((opt) => {
                    const isSelected = selected.includes(opt.id);
                    return (
                        <button
                            key={opt.id}
                            onClick={() => toggle(opt.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                                isSelected
                                    ? 'border-gold bg-gold/10 shadow-gold'
                                    : 'border-navy-500 bg-navy-800/50 hover:border-gold/50 hover:bg-navy-700/50'
                            }`}
                        >
                            <span className="text-xl">{opt.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold font-sans ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                                    {opt.label}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">{opt.sublabel}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected ? 'border-gold bg-gold' : 'border-navy-500'
                            }`}>
                                {isSelected && <Check className="w-3 h-3 text-navy-900" strokeWidth={3} />}
                            </div>
                        </button>
                    );
                })}
            </div>
            <Button
                onClick={() => onSubmit(selected)}
                disabled={selected.length === 0}
                className="w-full bg-gold hover:bg-gold-dark text-navy-900 font-semibold rounded-xl h-11 transition-all duration-200 disabled:opacity-40"
            >
                Continue →
            </Button>
        </div>
    );
}
