import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuestionTwoProps {
    onSubmit: (income: number) => void;
}

export function QuestionTwo({ onSubmit }: QuestionTwoProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const numericValue = parseFloat(value.replace(/,/g, ''));
    const isValid = !isNaN(numericValue) && numericValue > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        setValue(raw);
        setError('');
    };

    const handleSubmit = () => {
        if (!isValid) {
            setError('Please enter a valid positive income amount.');
            return;
        }
        onSubmit(numericValue);
    };

    const formatDisplay = (val: string) => {
        const num = parseFloat(val.replace(/,/g, ''));
        if (isNaN(num)) return val;
        return num.toLocaleString('en-IN');
    };

    return (
        <div className="space-y-3">
            <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center pointer-events-none">
                    <span className="text-gold font-bold text-base font-display">₹</span>
                </div>
                <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 50,000"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="pl-8 pr-16 h-12 bg-navy-800/50 border-navy-500 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground rounded-xl text-base font-sans"
                />
                <div className="absolute right-3 pointer-events-none">
                    <span className="text-muted-foreground text-sm font-medium font-sans">INR</span>
                </div>
            </div>
            {value && isValid && (
                <p className="text-xs text-teal font-sans">
                    ≈ ₹{formatDisplay(value)} per month
                </p>
            )}
            {error && <p className="text-xs text-destructive font-sans">{error}</p>}
            <Button
                onClick={handleSubmit}
                disabled={!isValid}
                className="w-full bg-gold hover:bg-gold-dark text-navy-900 font-semibold rounded-xl h-11 transition-all duration-200 disabled:opacity-40"
            >
                Continue →
            </Button>
        </div>
    );
}
