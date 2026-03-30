"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TelemetryData } from '@/components/dashboard/TelemetryPanel';

export interface HistoryEntry extends TelemetryData {
    id: string;
    image: string; // base64 string
    timestamp: Date;
}

interface HistoryContextType {
    history: HistoryEntry[];
    addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('vasm_history');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Convert timestamp strings back to Date objects
                const formatted = parsed.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                }));
                // Sort by newest first
                formatted.sort((a: HistoryEntry, b: HistoryEntry) => b.timestamp.getTime() - a.timestamp.getTime());
                setHistory(formatted);
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever history changes
    useEffect(() => {
        if (isLoaded) {
            try {
                // Keep only the last 50 items to prevent localStorage quota issues
                const limitedHistory = history.slice(0, 50);
                localStorage.setItem('vasm_history', JSON.stringify(limitedHistory));
            } catch (e) {
                console.warn("Failed to save history to localStorage. Storage might be full.", e);
            }
        }
    }, [history, isLoaded]);

    const addEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
        const newEntry: HistoryEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date()
        };
        
        setHistory(prev => [newEntry, ...prev]);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('vasm_history');
    };

    return (
        <HistoryContext.Provider value={{ history, addEntry, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
};
