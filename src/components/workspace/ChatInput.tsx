import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  return (
    <div className="relative bg-white border border-zinc-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-zinc-900/5 focus-within:border-zinc-300 transition-all">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={disabled}
        rows={1}
        className="w-full py-3 pl-4 pr-12 bg-transparent border-none outline-none resize-none text-sm max-h-[150px] disabled:opacity-50"
      />
      
      <div className="absolute right-2 bottom-2 flex items-center gap-1">
        <button 
          className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
          disabled={disabled}
        >
          <Paperclip size={16} />
        </button>
        <button 
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "p-1.5 rounded-md transition-all",
            value.trim() && !disabled
              ? "bg-zinc-900 text-white hover:bg-zinc-800" 
              : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
          )}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
};
