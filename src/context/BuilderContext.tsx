import React, { createContext, useContext, useState, ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { RoleType, Message } from '@/types';

const SYSTEM_INSTRUCTIONS: Record<RoleType, string> = {
  developer: `你是一位精通 HTML、Tailwind CSS 的前端开发专家。
你的任务是根据用户需求，生成**可直接运行的、高保真的 HTML 页面代码**。
要求：
1. **必须**包含 \`<!DOCTYPE html>\` 和 \`<html>\` 标签。
2. 在 \`<head>\` 中引入 Tailwind CSS：\`<script src="https://cdn.tailwindcss.com"></script>\`。
3. 使用 Tailwind CSS 实现所有样式，追求现代、美观、商业级别的视觉效果。
4. 使用 FontAwesome 或类似 CDN 图标库（如 \`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />\`），以便图标能直接显示。
5. 如果需要图片，使用 \`https://picsum.photos/seed/{keyword}/800/600\`。
6. 代码应包含适当的交互（可以使用简单的 \`<script>\` 标签写原生 JS）。
7. 直接返回完整的 HTML 代码，用 \`\`\`html 包裹。`,

  product: `你是一位资深的产品经理。
你的任务是根据用户的模糊需求，撰写一份结构清晰、内容详实的 PRD（产品需求文档）。
要求：
1. 使用 Markdown 格式。
2. 包含：项目背景、核心玩法/功能、用户路径、功能详细需求（前端/后端）、UI/UX 规范等章节。
3. 语言风格专业、逻辑严密，同时易于理解。
4. 使用中文回答。`,

  designer: `你是一位资深的交互设计师。
你的任务是根据用户需求，生成**低保真/线框图风格的 HTML 页面代码**，用于展示布局和结构。
要求：
1. **必须**包含 \`<!DOCTYPE html>\` 和 \`<html>\` 标签。
2. 在 \`<head>\` 中引入 Tailwind CSS：\`<script src="https://cdn.tailwindcss.com"></script>\`。
3. 样式风格：
   - 使用黑白灰（grayscale）色调。
   - 使用边框（border）、背景色块来表示区域。
   - 使用 "X" 或占位符图标表示图片。
   - 字体使用等宽字体或系统默认字体，体现"设计稿"的草图感。
   - 可以在元素旁添加简单的标注（如红色文字说明）。
4. 直接返回完整的 HTML 代码，用 \`\`\`html 包裹。`,
};

interface BuilderContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'agent') => void;
  isTyping: boolean;
  previewContent: string;
  setPreviewContent: (content: string) => void;
  generateResponse: (userInput: string) => Promise<void>;
  resetSession: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<RoleType>('developer'); // Default to developer/campaign operator
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const addMessage = (content: string, role: 'user' | 'agent') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const generateResponse = async (userInput: string) => {
    setIsTyping(true);

    try {
      // Call Rust backend via Tauri invoke
      const responseText = await invoke<string>('generate_content', {
        role,
        prompt: userInput,
        systemInstruction: SYSTEM_INSTRUCTIONS[role],
      });

      const finalText =
        responseText || '抱歉，我暂时无法生成内容，请稍后再试。';

      // Extract content for preview based on role
      let newPreviewContent = '';

      if (role === 'developer' || role === 'designer') {
        // Extract code block (html or jsx)
        const codeMatch = finalText.match(
          /```(?:html|xml|tsx|jsx|typescript|javascript)?\s*([\s\S]*?)\s*```/,
        );
        if (codeMatch && codeMatch[1]) {
          newPreviewContent = codeMatch[1];
        } else {
          // Fallback: if no code block, maybe the whole text is code if it starts with <
          if (finalText.trim().startsWith('<')) {
            newPreviewContent = finalText;
          }
        }
      } else if (role === 'product') {
        // For PRD and Design, the whole response (or a large part) is the content
        newPreviewContent = finalText;
      }

      addMessage(finalText, 'agent');
      if (newPreviewContent) {
        setPreviewContent(newPreviewContent);
      }
    } catch (error) {
      console.error('Tauri Command Error:', error);
      addMessage(`抱歉，生成过程中遇到了问题：${error}`, 'agent');
    } finally {
      setIsTyping(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setPreviewContent('');
    setIsTyping(false);
  };

  return (
    <BuilderContext.Provider
      value={{
        role,
        setRole,
        messages,
        addMessage,
        isTyping,
        previewContent,
        setPreviewContent,
        generateResponse,
        resetSession,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderAgent = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilderAgent must be used within a BuilderProvider');
  }
  return context;
};
