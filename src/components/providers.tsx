"use client";

import { AuthProvider } from '@/lib/AuthContext';
import { CreditProvider } from '@/lib/CreditContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CreditProvider>
        {children}
      </CreditProvider>
    </AuthProvider>
  );
}
