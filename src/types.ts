import React from 'react';

export type RoleType = 'designer' | 'product' | 'developer';

export interface Role {
  id: RoleType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}
