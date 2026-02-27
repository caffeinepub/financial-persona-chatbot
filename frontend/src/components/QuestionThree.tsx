import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface LoanOption {
    id: string;
    label: string;
    emoji: string;
}

const LOAN_OPTIONS: LoanOption[] = [
    { id: 'home_loan', label: 'Home Loan', emoji: '🏠' },
    { id: 'personal_loan', label: 'Personal Loan', emoji: '💳' },
    { id: 'car_loan', label: 'Car Loan', emoji: '🚗' },
    { id: 'education_loan', label: 'Education Loan', emoji: '🎓' },
    { id: 'other_loan', label: 'Other Loan', emoji: '📄' },
];

interface QuestionThreeProps {
    onSubmit: (data: { noLoans: boolean; loans: Record<string, number> }) => void;
}

export function QuestionThree({ onSubmit }: QuestionThreeProps) {
    const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
    const [noLoans, setNoLoans] = useState(false);
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleLoan = (id: string) => {
        setNoLoans(false);
        setSelectedLoans(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
        if (selectedLoans.includes(id)) {
            setAmounts(prev => { const n = { ...prev }; delete n[id]; return n; });
            setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
    };

    const toggleNoLoans = () => {
        if (!noLoans) {
            setSelectedLoans([]);
            setAmounts({});
            setErrors({});
        }
        setNoLoans(prev => !prev);
    };

    const handleAmountChange = (id: string, val: string) => {
        const raw = val.replace(/[^0-9.]/g, '');
        setAmounts(prev => ({ ...prev, [id]: raw }));
        setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    const validate = () => {
        if (!noLoans && selectedLoans.length === 0) return false;
        if (noLoans) return true;
        const newErrors: Record<string, string> = {};
        for (const id of selectedLoans) {
            const amt = parseFloat(amounts[id] || '');
            if (isNaN(amt) || amt <= 0) {
                newErrors[id] = 'Enter a valid amount';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (noLoans) {
            onSubmit({ noLoans: true, loans: {} });
        } else {
            const loans: Record<string, number> = {};
            for (const id of selectedLoans) {
                loans[id] = parseFloat(amounts[id] || '0');
            }
            onSubmit({ noLoans: false, loans });
        }
    };

    const canProceed = noLoans || selectedLoans.length > 0;

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {LOAN_OPTIONS.map((opt) => {
                    const isSelected = selectedLoans.includes(opt.id);
                    return (
                        <div key={opt.id} className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                            isSelected ? 'border-gold bg-gold/10' : 'border-navy-500 bg-navy-800/50'
                        }`}>
                            <button
                                onClick={() => toggleLoan(opt.id)}
                                disabled={noLoans}
                                className="flex items-center gap-3 px-4 py-3 w-full text-left disabled:opacity-40"
                            >
                                <span className="text-lg">{opt.emoji}</span>
                                <span className={`flex-1 text-sm font-semibold font-sans ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                                    {opt.label}
                                </span>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected ? 'border-gold bg-gold' : 'border-navy-500'
                                }`}>
                                    {isSelected && <Check className="w-3 h-3 text-navy-900" strokeWidth={3} />}
                                </div>
                            </button>
                            {isSelected && (
                                <div className="px-4 pb-3">
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-gold font-bold text-sm font-display">₹</span>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Outstanding amount"
                                            value={amounts[opt.id] || ''}
                                            onChange={(e) => handleAmountChange(opt.id, e.target.value)}
                                            className="pl-7 pr-14 h-10 bg-navy-900/50 border-navy-500 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground rounded-lg text-sm font-sans"
                                        />
                                        <span className="absolute right-3 text-muted-foreground text-xs font-sans">INR</span>
                                    </div>
                                    {errors[opt.id] && (
                                        <p className="text-xs text-destructive mt-1 font-sans">{errors[opt.id]}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* No Loans option */}
                <button
                    onClick={toggleNoLoans}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl border text-left transition-all duration-200 ${
                        noLoans
                            ? 'border-teal bg-teal/10 shadow-teal'
                            : 'border-navy-500 bg-navy-800/50 hover:border-teal/50'
                    }`}
                >
                    <span className="text-lg">✅</span>
                    <span className={`flex-1 text-sm font-semibold font-sans ${noLoans ? 'text-teal' : 'text-foreground'}`}>
                        No Loans
                    </span>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        noLoans ? 'border-teal bg-teal' : 'border-navy-500'
                    }`}>
                        {noLoans && <Check className="w-3 h-3 text-navy-900" strokeWidth={3} />}
                    </div>
                </button>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={!canProceed}
                className="w-full bg-gold hover:bg-gold-dark text-navy-900 font-semibold rounded-xl h-11 transition-all duration-200 disabled:opacity-40"
            >
                Continue →
            </Button>
        </div>
    );
}
