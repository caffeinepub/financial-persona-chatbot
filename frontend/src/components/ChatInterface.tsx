import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ProgressIndicator } from './ProgressIndicator';
import { QuestionOne } from './QuestionOne';
import { QuestionTwo } from './QuestionTwo';
import { QuestionThree } from './QuestionThree';
import { QuestionFour } from './QuestionFour';
import { QuestionFive } from './QuestionFive';

export interface CollectedAnswers {
    assetClasses: string[];
    income: number;
    loans: { noLoans: boolean; loans: Record<string, number> };
    familyContribution: number;
    expenses: { selected: string[]; otherText: string };
}

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text?: string;
    questionIndex?: number;
    isTyping?: boolean;
}

const QUESTIONS = [
    {
        text: "Hello! 👋 I'm your financial advisor bot. Let's build your financial persona together.\n\nFirst up — What asset classes do you prefer to invest in? (Select all that apply)",
        userSummary: (val: string[]) => val.join(', '),
    },
    {
        text: "Great choices! 💼\n\nNow, what is your monthly in-hand income post taxes?",
        userSummary: (val: number) => `₹${val.toLocaleString('en-IN')} / month`,
    },
    {
        text: "Got it! 📊\n\nDo you have any outstanding loans? Select all that apply and enter the outstanding amounts.",
        userSummary: (val: { noLoans: boolean; loans: Record<string, number> }) => {
            if (val.noLoans) return 'No outstanding loans';
            const entries = Object.entries(val.loans);
            if (entries.length === 0) return 'No loans';
            return entries.map(([k, v]) => `${k.replace(/_/g, ' ')}: ₹${v.toLocaleString('en-IN')}`).join(', ');
        },
    },
    {
        text: "Understood! 🏠\n\nWhat percentage of your monthly salary goes towards family contributions? Give an estimated value.",
        userSummary: (val: number) => `${val}% of monthly salary`,
    },
    {
        text: "Almost done! 🎯\n\nWhat are your upcoming major expenses in the next 5 years? (Select all that apply)",
        userSummary: (val: { selected: string[]; otherText: string }) => {
            const items = val.selected.map(s => s === 'other' ? val.otherText || 'Other' : s.replace(/_/g, ' '));
            return items.join(', ');
        },
    },
];

interface ChatInterfaceProps {
    onComplete: (answers: CollectedAnswers) => void;
    isCalculating: boolean;
}

export function ChatInterface({ onComplete, isCalculating }: ChatInterfaceProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [answers, setAnswers] = useState<Partial<CollectedAnswers>>({});
    const [showTyping, setShowTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showTyping]);

    // Show first question on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTyping(true);
            setTimeout(() => {
                setShowTyping(false);
                setMessages([{
                    id: 'q0',
                    sender: 'bot',
                    text: QUESTIONS[0].text,
                    questionIndex: 0,
                }]);
            }, 1200);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    const handleAnswer = (questionIndex: number, value: unknown) => {
        const newAnswers = { ...answers };

        // Store answer
        if (questionIndex === 0) newAnswers.assetClasses = value as string[];
        if (questionIndex === 1) newAnswers.income = value as number;
        if (questionIndex === 2) newAnswers.loans = value as { noLoans: boolean; loans: Record<string, number> };
        if (questionIndex === 3) newAnswers.familyContribution = value as number;
        if (questionIndex === 4) newAnswers.expenses = value as { selected: string[]; otherText: string };

        setAnswers(newAnswers);

        // Add user reply message
        const q = QUESTIONS[questionIndex];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const summaryText = (q.userSummary as (v: any) => string)(value);

        const userMsg: Message = {
            id: `user-${questionIndex}`,
            sender: 'user',
            text: summaryText,
        };

        const updatedMessages = messages.map(m =>
            m.questionIndex === questionIndex ? { ...m, questionIndex: undefined } : m
        );
        updatedMessages.push(userMsg);
        setMessages(updatedMessages);

        const nextQuestion = questionIndex + 1;

        if (nextQuestion < QUESTIONS.length) {
            setCurrentQuestion(nextQuestion);
            setShowTyping(true);
            setTimeout(() => {
                setShowTyping(false);
                setMessages(prev => [...prev, {
                    id: `q${nextQuestion}`,
                    sender: 'bot',
                    text: QUESTIONS[nextQuestion].text,
                    questionIndex: nextQuestion,
                }]);
            }, 1000);
        } else {
            // All questions answered
            setCurrentQuestion(5);
            setShowTyping(true);
            setTimeout(() => {
                setShowTyping(false);
                setMessages(prev => [...prev, {
                    id: 'calculating',
                    sender: 'bot',
                    text: "Perfect! 🎉 I have all the information I need. Let me analyze your financial profile...",
                }]);
                onComplete(newAnswers as CollectedAnswers);
            }, 800);
        }
    };

    const renderQuestionInput = (questionIndex: number) => {
        switch (questionIndex) {
            case 0:
                return <QuestionOne onSubmit={(val) => handleAnswer(0, val)} />;
            case 1:
                return <QuestionTwo onSubmit={(val) => handleAnswer(1, val)} />;
            case 2:
                return <QuestionThree onSubmit={(val) => handleAnswer(2, val)} />;
            case 3:
                return <QuestionFour onSubmit={(val) => handleAnswer(3, val)} />;
            case 4:
                return <QuestionFive onSubmit={(val) => handleAnswer(4, val)} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-navy-500 bg-navy-700/30 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
                        <span className="text-navy-900 font-bold text-base font-display">₹</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold font-display text-foreground">FinPersona Bot</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                            <span className="text-xs text-teal font-sans">Online</span>
                        </div>
                    </div>
                </div>
                {currentQuestion < 5 && (
                    <ProgressIndicator current={currentQuestion} total={5} />
                )}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto chat-scrollbar px-4 py-5 space-y-4">
                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        sender={msg.sender}
                        text={msg.text}
                    >
                        {msg.questionIndex !== undefined && !isCalculating
                            ? renderQuestionInput(msg.questionIndex)
                            : null}
                    </ChatMessage>
                ))}

                {(showTyping || isCalculating) && (
                    <ChatMessage sender="bot" isTyping />
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
