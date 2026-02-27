import React, { useState } from 'react';
import { ChatInterface, type CollectedAnswers } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { useCalculatePersonaScores } from './hooks/useQueries';
import {
    mapAssetClasses,
    mapIncome,
    mapLoanAmount,
    mapFamilyContribution,
    mapExpenses,
} from './lib/scoring';
import type { PersonaScores } from './backend';

type AppView = 'chat' | 'dashboard';

export default function App() {
    const [view, setView] = useState<AppView>('chat');
    const [personaScores, setPersonaScores] = useState<PersonaScores | null>(null);

    const { mutate: calculateScores, isPending } = useCalculatePersonaScores();

    const handleChatComplete = (answers: CollectedAnswers) => {
        // Map user answers to backend enum types
        const assetClasses = mapAssetClasses(answers.assetClasses);
        const income = mapIncome(answers.income);

        // Calculate total loan amount
        const totalLoan = answers.loans.noLoans
            ? 0
            : Object.values(answers.loans.loans).reduce((sum, v) => sum + v, 0);
        const loanAmount = mapLoanAmount(totalLoan);

        const familyContribution = mapFamilyContribution(answers.familyContribution);

        // Count upcoming expenses (excluding 'other' if empty)
        const expenseCount = answers.expenses.selected.filter(
            s => s !== 'other' || answers.expenses.otherText.trim() !== ''
        ).length;
        const upcomingExpenses = mapExpenses(expenseCount);

        calculateScores(
            {
                assetClasses,
                income,
                loanAmount,
                familyContribution,
                upcomingExpenses,
            },
            {
                onSuccess: (scores) => {
                    setPersonaScores(scores);
                    setView('dashboard');
                },
                onError: (err) => {
                    console.error('Failed to calculate scores:', err);
                },
            }
        );
    };

    const handleReset = () => {
        setPersonaScores(null);
        setView('chat');
        // Force re-mount of chat by using a key
        window.location.reload();
    };

    if (view === 'dashboard' && personaScores) {
        return <Dashboard scores={personaScores} onReset={handleReset} />;
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundImage: 'url(/assets/generated/chatbot-bg.dim_1920x1080.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Overlay */}
            <div className="fixed inset-0 bg-background/85 backdrop-blur-sm pointer-events-none" />

            {/* App header */}
            <header className="relative z-10 border-b border-navy-500/50 bg-navy-700/20 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
                            <span className="text-navy-900 font-bold text-base font-display">₹</span>
                        </div>
                        <div>
                            <h1 className="text-base font-bold font-display text-foreground">FinPersona</h1>
                            <p className="text-xs text-muted-foreground font-sans">AI Financial Profile Builder</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/30">
                        <span className="text-xs text-teal font-semibold font-sans">🔒 Private & Secure</span>
                    </div>
                </div>
            </header>

            {/* Chat container */}
            <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-6">
                <div className="w-full max-w-2xl bg-navy-700/60 backdrop-blur-md border border-navy-500/50 rounded-2xl card-shadow overflow-hidden flex flex-col"
                    style={{ minHeight: 'calc(100vh - 160px)', maxHeight: 'calc(100vh - 120px)' }}
                >
                    <ChatInterface
                        onComplete={handleChatComplete}
                        isCalculating={isPending}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-navy-500/30 py-4">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <p className="text-xs text-muted-foreground font-sans">
                        © {new Date().getFullYear()} FinPersona · Built with{' '}
                        <span className="text-red-400">♥</span> using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'finpersona')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:text-gold-light transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
