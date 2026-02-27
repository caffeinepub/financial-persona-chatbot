import React from 'react';
import { ScoreChart } from './ScoreChart';
import { Button } from '@/components/ui/button';
import { RotateCcw, TrendingUp } from 'lucide-react';
import type { PersonaScores } from '../backend';

interface DashboardProps {
    scores: PersonaScores;
    onReset: () => void;
}

function getDescriptor(score: number, inverted = false): { label: string; color: string } {
    const s = Number(score);
    if (inverted) {
        if (s >= 75) return { label: 'Excellent', color: '#4ade80' };
        if (s >= 50) return { label: 'Good', color: '#a3e635' };
        if (s >= 25) return { label: 'Fair', color: '#facc15' };
        return { label: 'Poor', color: '#f87171' };
    } else {
        if (s <= 25) return { label: 'Low', color: '#4ade80' };
        if (s <= 50) return { label: 'Moderate', color: '#facc15' };
        if (s <= 75) return { label: 'High', color: '#fb923c' };
        return { label: 'Very High', color: '#f87171' };
    }
}

const EMPTY_COLOR = 'oklch(0.26 0.02 250)';

export function Dashboard({ scores, onReset }: DashboardProps) {
    const riskScore = Number(scores.riskAppetite);
    const debtScore = Number(scores.debtProfile);
    const earningScore = Number(scores.earningPotential);
    const emergencyScore = Number(scores.emergencyBrokeLikelihood);
    const fulfillmentScore = Number(scores.upcomingExpenseFulfillmentLikelihood);

    const riskDesc = getDescriptor(riskScore);
    const debtDesc = getDescriptor(debtScore, true);
    const earningDesc = getDescriptor(earningScore, true);
    const emergencyDesc = getDescriptor(emergencyScore);
    const fulfillmentDesc = getDescriptor(fulfillmentScore, true);

    const chartData = [
        {
            name: 'Risk Appetite',
            score: riskScore,
            description: 'Your tolerance for investment risk and volatility',
            colorFilled: '#d4a017',
            descriptor: riskDesc.label,
            descriptorColor: riskDesc.color,
            icon: '🎯',
        },
        {
            name: 'Debt Profile',
            score: debtScore,
            description: 'Your current debt health and loan burden',
            colorFilled: '#14b8a6',
            descriptor: debtDesc.label,
            descriptorColor: debtDesc.color,
            icon: '💳',
        },
        {
            name: 'Earning Potential',
            score: earningScore,
            description: 'Your income level and financial capacity',
            colorFilled: '#a3e635',
            descriptor: earningDesc.label,
            descriptorColor: earningDesc.color,
            icon: '💰',
        },
        {
            name: 'Emergency Broke Risk',
            score: emergencyScore,
            description: 'Likelihood of financial distress in a major emergency',
            colorFilled: '#f97316',
            descriptor: emergencyDesc.label,
            descriptorColor: emergencyDesc.color,
            icon: '🚨',
        },
        {
            name: 'Expense Fulfillment',
            score: fulfillmentScore,
            description: 'Ability to meet upcoming expenses without loans',
            colorFilled: '#818cf8',
            descriptor: fulfillmentDesc.label,
            descriptorColor: fulfillmentDesc.color,
            icon: '📊',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-navy-500 bg-navy-700/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
                            <span className="text-navy-900 font-bold text-base font-display">₹</span>
                        </div>
                        <div>
                            <h1 className="text-base font-bold font-display text-foreground">FinPersona</h1>
                            <p className="text-xs text-muted-foreground font-sans">Your Financial Profile</p>
                        </div>
                    </div>
                    <Button
                        onClick={onReset}
                        variant="outline"
                        size="sm"
                        className="border-navy-500 text-muted-foreground hover:text-foreground hover:border-gold/50 rounded-xl gap-2 font-sans"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retake
                    </Button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Hero section */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-4">
                        <TrendingUp className="w-4 h-4 text-gold" />
                        <span className="text-xs font-semibold text-gold font-sans">Analysis Complete</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
                        Your Financial Persona
                    </h2>
                    <p className="text-muted-foreground font-sans max-w-lg mx-auto text-sm leading-relaxed">
                        Based on your responses, here's a comprehensive breakdown of your financial health across 5 key dimensions.
                    </p>
                </div>

                {/* Charts grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 animate-scale-in">
                    {chartData.map((chart) => (
                        <ScoreChart
                            key={chart.name}
                            name={chart.name}
                            score={chart.score}
                            description={chart.description}
                            colorFilled={chart.colorFilled}
                            colorEmpty={EMPTY_COLOR}
                            descriptor={chart.descriptor}
                            descriptorColor={chart.descriptorColor}
                            icon={chart.icon}
                        />
                    ))}
                </div>

                {/* Summary card */}
                <div className="bg-card border border-navy-500 rounded-2xl p-6 card-shadow animate-fade-in">
                    <h3 className="text-base font-bold font-display text-foreground mb-4 flex items-center gap-2">
                        <span className="text-gold">📋</span> Profile Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {chartData.map((chart) => (
                            <div key={chart.name} className="flex items-center justify-between py-2 border-b border-navy-500 last:border-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{chart.icon}</span>
                                    <span className="text-sm font-medium font-sans text-foreground">{chart.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-navy-600 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${chart.score}%`,
                                                backgroundColor: chart.colorFilled,
                                            }}
                                        />
                                    </div>
                                    <span
                                        className="text-xs font-bold font-sans w-8 text-right"
                                        style={{ color: chart.colorFilled }}
                                    >
                                        {chart.score}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-navy-500 mt-12 py-6">
                <div className="max-w-5xl mx-auto px-4 text-center">
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
