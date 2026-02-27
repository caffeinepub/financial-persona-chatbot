import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuestionFourProps {
    onSubmit: (percentage: number) => void;
}

export function QuestionFour({ onSubmit }: QuestionFourProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const numericValue = parseFloat(value);
    const isValid = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        setValue(raw);
        setError('');
    };

    const handleSubmit = () => {
        if (value === '') {
            setError('Please enter a percentage value.');
            return;
        }
        if (!isValid) {
            setError('Please enter a value between 0 and 100.');
            return;
        }
        onSubmit(numericValue);
    };

    const getContributionLabel = (pct: number) => {
        if (pct === 0) return 'No family contribution';
        if (pct < 20) return 'Minimal contribution';
        if (pct < 50) return 'Moderate contribution';
        if (pct < 80) return 'Significant contribution';
        return 'Major contribution';
    };

    return (
        <div className="space-y-3">
            <div className="relative flex items-center">
                <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 25"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="pr-10 h-12 bg-navy-800/50 border-navy-500 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground rounded-xl text-base font-sans"
                />
                <div className="absolute right-3 pointer-events-none">
                    <span className="text-gold font-bold text-lg font-display">%</span>
                </div>
            </div>

            {value && isValid && (
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground font-sans">
                        <span>0%</span>
                        <span className="text-gold font-semibold">{numericValue}%</span>
                        <span>100%</span>
                    </div>
                    <div className="h-2 bg-navy-600 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full transition-all duration-300"
                            style={{ width: `${numericValue}%` }}
                        />
                    </div>
                    <p className="text-xs text-teal font-sans text-center">{getContributionLabel(numericValue)}</p>
                </div>
            )}

            {error && <p className="text-xs text-destructive font-sans">{error}</p>}

            <Button
                onClick={handleSubmit}
                disabled={value === '' || !isValid}
                className="w-full bg-gold hover:bg-gold-dark text-navy-900 font-semibold rounded-xl h-11 transition-all duration-200 disabled:opacity-40"
            >
                Continue →
            </Button>
        </div>
    );
}
