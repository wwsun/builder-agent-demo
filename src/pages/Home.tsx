import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Palette, 
  FileText, 
  Smartphone, 
  ArrowUp, 
  Paperclip, 
  Sparkles 
} from 'lucide-react';
import { Role, RoleType } from '@/types';
import { RoleCard } from '@/components/RoleCard';
import { cn } from '@/lib/utils';
import { useBuilderAgent } from '@/context/BuilderContext';

const ROLES: Role[] = [
  {
    id: 'designer',
    title: '交互设计师',
    description: '快速生成高保真 UI 设计稿，支持组件库和即时预览。',
    icon: Palette,
    color: 'bg-purple-500'
  },
  {
    id: 'product',
    title: '产品经理',
    description: '撰写 PRD 文档、用户故事，梳理产品逻辑与功能结构。',
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    id: 'developer',
    title: '活动运营',
    description: '快速生成营销活动 H5 页面，支持抽奖、落地页等运营场景。',
    icon: Smartphone,
    color: 'bg-emerald-500'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { role: selectedRole, setRole: setSelectedRole, addMessage, generateResponse, resetSession } = useBuilderAgent();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Reset session when visiting home
  React.useEffect(() => {
    resetSession();
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message to context
    addMessage(inputValue, 'user');
    
    // Trigger AI response generation
    generateResponse(inputValue);

    // Navigate to chat
    navigate('/chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-zinc-200">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm mb-6">
          <Sparkles size={14} className="text-amber-500 mr-2" />
          <span className="text-xs font-medium text-zinc-600 uppercase tracking-wide">NetEase Cuocuo Builder</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
          你想构建什么？
        </h1>
        <p className="text-lg text-zinc-500">
          选择一个角色，开始你的创意之旅。
        </p>
      </motion.div>

      {/* Role Selection Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mb-16"
      >
        {ROLES.map((role) => (
          <RoleCard 
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            onClick={setSelectedRole}
          />
        ))}
      </motion.div>

      {/* Floating Input Launcher */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl fixed bottom-8 sm:bottom-12 z-50 px-4"
      >
        <div 
          className={cn(
            "relative bg-white rounded-3xl shadow-2xl transition-all duration-300 ease-out border",
            isFocused ? "ring-2 ring-zinc-900/10 border-zinc-300 scale-[1.01]" : "border-zinc-200/80"
          )}
        >
          <div className="flex flex-col p-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={`作为 ${ROLES.find(r => r.id === selectedRole)?.title}，我想...`}
              className="w-full min-h-[60px] max-h-[200px] p-4 text-lg bg-transparent border-none outline-none resize-none text-zinc-800 placeholder:text-zinc-400"
              rows={1}
            />
            
            <div className="flex items-center justify-between px-2 pb-1">
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors" title="上传附件">
                  <Paperclip size={20} />
                </button>
              </div>
              
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  "flex items-center justify-center p-2 rounded-full transition-all duration-200",
                  inputValue.trim() 
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md translate-x-0 opacity-100" 
                    : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                )}
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-zinc-400 font-medium">
            按 <kbd className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 border border-zinc-200">Enter</kbd> 发送
          </p>
        </div>
      </motion.div>
    </div>
  );
}
