import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ScrollArea } from './scroll-area';
import { cn } from './utils';

interface Message {
    id: number;
    role: 'user' | 'bot';
    text: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'bot', text: '안녕하세요! 저는 부산 갈맷길 전문 안내 AI입니다. 갈맷길에 대해 궁금한 점이 있으신가요?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 항상 맨 아래로 자동 스크롤
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            text: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: input.trim() })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (Status: ${response.status})`);
            }

            const data = await response.json();
            const botMessage: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: data.content
            };
            setMessages(prev => [...prev, botMessage]);

        }
        catch (error) {
            console.error('Chatbot Error', error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: '죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다: ' + (error instanceof Error ? error.message : 'Unknown error')
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // URL과 이미지를 감지하여 렌더링 (절대/상대 경로 모두 지원)
    const renderMessageWithLinks = (text: string) => {
        // 이미지 URL 패턴 감지 (https:// 또는 /로 시작)
        const imageUrlRegex = /((?:https?:\/\/|\/)[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi;
        const hasImage = text.match(imageUrlRegex);

        if (hasImage) {
            const lines = text.split('\n');
            return lines.map((line, lineIndex) => {
                const imageMatch = line.match(imageUrlRegex);
                if (imageMatch) {
                    return (
                        <div key={lineIndex} className="my-2">
                            <img
                                src={imageMatch[0]}
                                alt="맛집 이미지"
                                className="rounded-lg max-w-full h-auto max-h-48 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    );
                }
                // 일반 URL 처리
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const urlMatch = line.match(urlRegex);
                if (urlMatch) {
                    return (
                        <a
                            key={lineIndex}
                            href={urlMatch[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium break-all block mt-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            🔗 자세한 지도 보기
                        </a>
                    );
                }
                return <div key={lineIndex}>{line}</div>;
            });
        }

        // 이미지가 없으면 일반 URL만 처리
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium break-all block mt-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        🔗 자세한 지도 보기
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* 채팅창 (열렸을 때만 표시) */}
            {isOpen && (
                <Card className="w-[450px] h-[600px] mb-4 shadow-xl flex flex-col overflow-hidden border-2 border-primary/20">
                    <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <CardTitle className="text-lg">갈맷길 AI 챗봇</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-primary/80 h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-white">
                        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap",
                                            msg.role === 'user'
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {renderMessageWithLinks(msg.text)}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                                        <span className="animate-pulse">답변 작성 중...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className="p-4 border-t bg-background">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    placeholder="궁금한 점을 물어보세요..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={isLoading}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 플로팅 버튼 (닫혀있을 때만 표시하거나 항상 표시) */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            )}
        </div>
    );
}