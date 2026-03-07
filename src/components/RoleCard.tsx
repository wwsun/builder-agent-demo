import React from 'react';
import { motion } from 'motion/react';
import { Role } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  onClick: (id: Role['id']) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, onClick }) => {
  const Icon = role.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(role.id)}
      className={cn(
        "relative cursor-pointer group flex flex-col items-start p-6 h-48 rounded-2xl border transition-all duration-200",
        isSelected 
          ? "border-zinc-900 bg-zinc-50 shadow-md ring-1 ring-zinc-900/5" 
          : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-sm"
      )}
    >
      <div className={cn(
        "p-3 rounded-xl mb-4 transition-colors",
        isSelected ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
      )}>
        <Icon size={24} />
      </div>
      
      <h3 className="text-lg font-semibold text-zinc-900 mb-1">
        {role.title}
      </h3>
      
      <p className="text-sm text-zinc-500 leading-relaxed">
        {role.description}
      </p>

      {isSelected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 text-zinc-900"
        >
          <CheckCircle2 size={20} fill="currentColor" className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};
