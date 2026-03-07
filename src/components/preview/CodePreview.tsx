import React from 'react';
import { Smartphone, Code2, Play, RefreshCw } from 'lucide-react';

const MOCK_CODE = `import React from 'react';
import { Button } from '@/components/ui/button';

export default function MobileApp() {
  return (
    <div className="p-4 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </header>

      <div className="space-y-4">
        <div className="p-4 bg-blue-500 rounded-2xl text-white">
          <h2 className="text-lg font-semibold mb-2">Daily Mix</h2>
          <p className="opacity-90">Curated just for you</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
      
      <Button className="w-full mt-6">
        Explore More
      </Button>
    </div>
  );
}`;

interface CodePreviewProps {
  code?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const displayCode = code || MOCK_CODE;
  
  return (
    <div className="flex h-full w-full bg-zinc-900 text-white overflow-hidden">
      {/* Code Editor Side */}
      <div className="flex-1 flex flex-col border-r border-zinc-800 min-w-0">
        <div className="h-10 flex items-center px-4 border-b border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
          <Code2 size={14} className="mr-2" />
          <span>src/App.tsx</span>
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <pre className="text-zinc-300">
            <code>{displayCode}</code>
          </pre>
        </div>
      </div>

      {/* Preview Side */}
      <div className="w-[400px] bg-zinc-100 flex flex-col border-l border-zinc-200 relative">
        <div className="h-10 bg-white border-b border-zinc-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-zinc-500">
            <Smartphone size={14} />
            <span className="text-xs font-medium">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-500">
              <RefreshCw size={12} />
            </button>
            <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-500">
              <Play size={12} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 bg-zinc-100 overflow-hidden">
          <div className="w-[320px] h-[640px] bg-white rounded-[40px] shadow-2xl border-[8px] border-zinc-900 overflow-hidden relative ring-1 ring-black/5">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-2xl z-20" />
            
            {/* Iframe Preview */}
            <iframe 
              srcDoc={displayCode}
              className="w-full h-full bg-white"
              title="Code Preview"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
