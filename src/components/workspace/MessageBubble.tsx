import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] md:max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
          isUser ? "ml-3 bg-zinc-900 text-white" : "mr-3 bg-zinc-100 text-zinc-600 border border-zinc-200"
        )}>
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </div>

        {/* Bubble */}
        <div className={cn(
          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
          isUser 
            ? "bg-zinc-900 text-white rounded-tr-sm" 
            : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm"
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          <span className={cn(
            "text-[10px] mt-2 block opacity-60",
            isUser ? "text-zinc-300" : "text-zinc-400"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
