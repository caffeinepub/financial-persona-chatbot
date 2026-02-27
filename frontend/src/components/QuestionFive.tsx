import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface ExpenseOption {
    id: string;
    label: string;
    emoji: string;
    isOther?: boolean;
}

const EXPENSE_OPTIONS: ExpenseOption[] = [
    { id: 'marriage', label: 'Marriage', emoji: '💍' },
    { id: 'home_purchase', label: 'Home Purchase', emoji: '🏠' },
    { id: 'car_purchase', label: 'Car Purchase', emoji: '🚗' },
    { id: 'child', label: 'Child', emoji: '👶' },
    { id: 'medical_expense', label: 'Medical Expense (Surgery)', emoji: '🏥' },
    { id: 'other', label: 'Other', emoji: '✏️', isOther: true },
];

interface QuestionFiveProps {
    onSubmit: (data: { selected: string[]; otherText: string }) => void;
}

export function QuestionFive({ onSubmit }: QuestionFiveProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [otherText, setOtherText] = useState('');
    const [error, setError] = useState('');

    const toggle = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
        if (id === 'other' && selected.includes('other')) {
            setOtherText('');
        }
        setError('');
    };

    const isOtherSelected = selected.includes('other');

    const handleSubmit = () => {
        if (selected.length === 0) {
            setError('Please select at least one option.');
            return;
        }
        if (isOtherSelected && otherText.trim() === '') {
            setError('Please describe your other expense.');
            return;
        }
        onSubmit({ selected, otherText });
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
                {EXPENSE_OPTIONS.map((opt) => {
                    const isSelected = selected.includes(opt.id);
                    return (
                        <div key={opt.id}>
                            <button
                                onClick={() => toggle(opt.id)}
                                className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl border text-left transition-all duration-200 ${
                                    isSelected
                                        ? 'border-gold bg-gold/10 shadow-gold'
                                        : 'border-navy-500 bg-navy-800/50 hover:border-gold/50 hover:bg-navy-700/50'
                                }`}
                            >
                                <span className="text-xl">{opt.emoji}</span>
                                <span className={`flex-1 text-sm font-semibold font-sans ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                                    {opt.isOther ? (
                                        <span className="italic text-muted-foreground">
                                            {isSelected && otherText ? otherText : 'Other (specify below)'}
                                        </span>
                                    ) : opt.label}
                                </span>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected ? 'border-gold bg-gold' : 'border-navy-500'
                                }`}>
                                    {isSelected && <Check className="w-3 h-3 text-navy-900" strokeWidth={3} />}
                                </div>
                            </button>
                            {opt.isOther && isSelected && (
                                <div className="mt-1 px-1">
                                    <Input
                                        type="text"
                                        placeholder="Describe your upcoming expense..."
                                        value={otherText}
                                        onChange={(e) => { setOtherText(e.target.value); setError(''); }}
                                        className="h-10 bg-navy-800/50 border-navy-500 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground rounded-xl text-sm font-sans"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && <p className="text-xs text-destructive font-sans">{error}</p>}

            <Button
                onClick={handleSubmit}
                disabled={selected.length === 0}
                className="w-full bg-gold hover:bg-gold-dark text-navy-900 font-semibold rounded-xl h-11 transition-all duration-200 disabled:opacity-40"
            >
                Generate My Profile →
            </Button>
        </div>
    );
}
