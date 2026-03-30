"use client";

import React from 'react';
import { HistoryProvider } from '@/context/HistoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HistoryProvider>
            {children}
        </HistoryProvider>
    );
}
