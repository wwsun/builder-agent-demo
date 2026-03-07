import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Message, RoleType } from '@/types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  role: RoleType;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isTyping?: boolean;
}

const ROLE_LABELS: Record<RoleType, string> = {
  designer: '交互设计师',
  product: '产品经理',
  developer: '活动运营'
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  role, 
  messages, 
  onSendMessage,
  isTyping 
}) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 border-r border-zinc-200">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-1.5 -ml-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900">{ROLE_LABELS[role]}</span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Assistant</span>
          </div>
        </div>
        <button className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isTyping && (
            <div className="flex w-full mb-6 justify-start animate-pulse">
              <div className="flex flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 mr-3 mt-1" />
                <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm p-4 h-10 w-16 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-zinc-200">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={onSendMessage} disabled={isTyping} />
          <div className="text-center mt-2">
            <p className="text-[10px] text-zinc-400">
              AI 生成的内容可能不准确，请核实重要信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
