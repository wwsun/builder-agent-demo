import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatPanel } from '@/components/workspace/ChatPanel';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { useBuilderAgent } from '@/context/BuilderContext';

export default function Chat() {
  const navigate = useNavigate();
  const { role, messages, addMessage, generateResponse, isTyping } = useBuilderAgent();

  // Redirect if no messages (direct access protection)
  useEffect(() => {
    if (messages.length === 0) {
      navigate('/');
    }
  }, [messages, navigate]);

  const handleSendMessage = (content: string) => {
    addMessage(content, 'user');
    generateResponse(content);
  };

  if (messages.length === 0) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Panel: Chat (Fixed width for now, can be resizable later) */}
      <div className="w-[400px] flex-shrink-0 h-full border-r border-zinc-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <ChatPanel 
          role={role}
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </div>

      {/* Right Panel: Preview (Flexible) */}
      <div className="flex-1 h-full min-w-0 bg-zinc-50">
        <PreviewPanel role={role} />
      </div>
    </div>
  );
}
