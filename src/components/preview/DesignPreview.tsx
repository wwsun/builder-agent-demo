import React, { useState } from 'react';
import { 
  MousePointer2, 
  Hand, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon,
  Palette,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'hand', icon: Hand, label: 'Pan' },
  { id: 'shape', icon: Square, label: 'Rectangle' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
];

interface DesignPreviewProps {
  designState?: string;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({ designState }) => {
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);

  // Check if content looks like HTML
  const isHtmlContent = designState && (designState.trim().startsWith('<') || designState.includes('<!DOCTYPE html>'));

  return (
    <div className="flex h-full w-full bg-[#F3F3F3] relative overflow-hidden">
      {/* Floating Toolbar */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col bg-white rounded-2xl shadow-lg border border-zinc-200/60 p-1.5 gap-1 z-20">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200 relative group",
              activeTool === tool.id 
                ? "bg-zinc-900 text-white shadow-md" 
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            )}
            title={tool.label}
          >
            <tool.icon size={20} />
            {activeTool === tool.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute inset-0 rounded-xl bg-zinc-900 -z-10" 
              />
            )}
          </button>
        ))}
        <div className="h-px w-full bg-zinc-200 my-1" />
        <button className="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
          <Palette size={20} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 h-full overflow-auto flex items-center justify-center p-20 cursor-crosshair">
        <div 
          className="bg-white shadow-sm transition-transform duration-200 ease-out origin-center"
          style={{ 
            width: '100%', 
            maxWidth: '1000px',
            height: '800px', 
            transform: `scale(${zoom / 100})` 
          }}
        >
          {/* Design Content */}
          <div className="w-full h-full flex flex-col">
            {isHtmlContent ? (
              // Render HTML Wireframe
              <iframe 
                srcDoc={designState}
                className="w-full h-full border-none"
                title="Design Wireframe"
                sandbox="allow-scripts"
              />
            ) : (
              // Default Placeholder
              <div className="w-full h-full p-12 flex flex-col">
                <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl mb-8 flex items-center justify-center border border-dashed border-purple-200">
                  <span className="text-purple-300 font-medium text-lg">Waiting for Design Generation...</span>
                </div>
                
                <div className="flex gap-8">
                  <div className="w-2/3 space-y-4">
                    <div className="h-8 w-3/4 bg-zinc-100 rounded-lg" />
                    <div className="h-4 w-full bg-zinc-50 rounded" />
                    <div className="h-4 w-full bg-zinc-50 rounded" />
                    <div className="h-4 w-5/6 bg-zinc-50 rounded" />
                  </div>
                  <div className="w-1/3 space-y-4">
                    <div className="aspect-square bg-zinc-50 rounded-xl border border-zinc-100" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Selection Box Simulation */}
          <div className="absolute top-12 left-12 right-12 bottom-12 border-2 border-blue-500 rounded-none pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-lg border border-zinc-200/60">
        <button 
          onClick={() => setZoom(z => Math.max(z - 10, 25))}
          className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium w-12 text-center tabular-nums">{zoom}%</span>
        <button 
          onClick={() => setZoom(z => Math.min(z + 10, 200))}
          className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600"
        >
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
};
