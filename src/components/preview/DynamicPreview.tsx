import React from 'react';
import { RoleType } from '@/types';
import { CodePreview } from './CodePreview';
import { DesignPreview } from './DesignPreview';
import { DocumentPreview } from './DocumentPreview';
import { useBuilderAgent } from '@/context/BuilderContext';

interface DynamicPreviewProps {
  role: RoleType;
}

export const DynamicPreview: React.FC<DynamicPreviewProps> = ({ role }) => {
  const { previewContent } = useBuilderAgent();

  switch (role) {
    case 'developer':
      return <CodePreview code={previewContent} />;
    case 'designer':
      return <DesignPreview designState={previewContent} />;
    case 'product':
      return <DocumentPreview content={previewContent} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-zinc-400">
          Unknown role type
        </div>
      );
  }
};
