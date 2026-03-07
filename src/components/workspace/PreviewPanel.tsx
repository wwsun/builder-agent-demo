import React from 'react';
import { Maximize2, Download, Save } from 'lucide-react';
import { RoleType } from '@/types';
import { DynamicPreview } from '@/components/preview/DynamicPreview';

interface PreviewPanelProps {
  role: RoleType;
  title?: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ role, title = 'Untitled Project' }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-100/50">
      {/* Toolbar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-800 px-2 py-1 rounded hover:bg-zinc-100 cursor-text transition-colors">
            {title}
          </h2>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 font-medium uppercase">
            Draft
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors" title="Save">
            <Save size={18} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors" title="Export">
            <Download size={18} />
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-1" />
          <button className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors" title="Fullscreen">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-hidden relative">
        <DynamicPreview role={role} />
      </div>
    </div>
  );
};
