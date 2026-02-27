import React from 'react';

interface ChatMessageProps {
    sender: 'bot' | 'user';
    text?: string;
    children?: React.ReactNode;
    isTyping?: boolean;
}

export function ChatMessage({ sender, text, children, isTyping }: ChatMessageProps) {
    const isBot = sender === 'bot';

    return (
        <div className={`flex items-end gap-3 message-appear ${isBot ? 'justify-start' : 'justify-end'}`}>
            {isBot && (
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
                    <span className="text-navy-900 font-bold text-sm font-display">₹</span>
                </div>
            )}

            <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                    isBot
                        ? 'bg-navy-700 border border-navy-500 rounded-tl-sm card-shadow'
                        : 'bg-gradient-to-br from-gold to-gold-dark text-navy-900 rounded-tr-sm shadow-gold'
                }`}
            >
                {isTyping ? (
                    <div className="flex items-center gap-1.5 py-1 px-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                    </div>
                ) : (
                    <>
                        {text && (
                            <p className={`text-sm leading-relaxed font-sans ${isBot ? 'text-foreground' : 'text-navy-900 font-medium'}`}>
                                {text}
                            </p>
                        )}
                        {children && <div className="mt-3">{children}</div>}
                    </>
                )}
            </div>

            {!isBot && (
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-navy-600 border border-navy-500 flex items-center justify-center">
                    <span className="text-foreground font-semibold text-sm font-display">U</span>
                </div>
            )}
        </div>
    );
}
