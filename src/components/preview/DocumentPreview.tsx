import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit3, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_MARKDOWN = `# Product Requirements Document (PRD)

## 1. Introduction
**Project Name**: NetEase Cuocuo Builder
**Version**: 1.0.0
**Status**: Draft

The goal is to build an AI-powered workspace that empowers Designers, Product Managers, and Developers to create content faster.

## 2. User Personas
- **Designer**: Needs quick UI iteration and asset generation.
- **Product Manager**: Needs structured documentation and logic flow.
- **Developer**: Needs clean, previewable code generation.

## 3. Functional Requirements

### 3.1 Workspace
The workspace should support a split-pane layout:
1. **Chat Panel**: For interaction with the AI agent.
2. **Preview Panel**: For real-time content rendering.

### 3.2 Role-Based Views
- **Code View**: Syntax highlighting + Mobile Preview.
- **Design View**: Canvas + Toolbar.
- **Doc View**: Notion-like editor.

## 4. Success Metrics
> "Speed is the ultimate currency."

- Reduce initial draft time by 70%.
- Improve collaboration efficiency by 50%.
`;

interface DocumentPreviewProps {
  content?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ content: initialContent }) => {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [content, setContent] = useState(initialContent || MOCK_MARKDOWN);

  // Sync with prop updates
  React.useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  return (
    <div className="flex flex-col h-full bg-white w-full max-w-4xl mx-auto shadow-sm my-4 rounded-xl border border-zinc-200 overflow-hidden">
      {/* Doc Header */}
      <div className="h-12 border-b border-zinc-100 flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('preview')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
              mode === 'preview' 
                ? "bg-white text-zinc-900 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={() => setMode('edit')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
              mode === 'edit' 
                ? "bg-white text-zinc-900 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Edit3 size={14} />
            Edit
          </button>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 p-1 rounded">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'preview' ? (
          <div className="prose prose-zinc max-w-none p-8 sm:p-12">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-8 sm:p-12 resize-none outline-none font-mono text-sm leading-relaxed text-zinc-800"
            placeholder="Start typing..."
          />
        )}
      </div>
    </div>
  );
};
