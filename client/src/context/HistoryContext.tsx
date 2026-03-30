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
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Convert timestamp strings back to Date objects
                    const formatted = parsed.map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp)
                    }));
                    // Sort by newest first
                    formatted.sort((a: HistoryEntry, b: HistoryEntry) => b.timestamp.getTime() - a.timestamp.getTime());
                    setHistory(formatted);
                } else {
                    // saved exists but empty array — fall through to seed below
                    seedHistory();
                }
            } else {
                // Seed with dummy history using project public assets when none exists
                seedHistory();
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }
        setIsLoaded(true);
    }, []);

    // Helper to seed history (kept separate to allow reuse)
    const seedHistory = () => {
        const now = Date.now();
        const seed: HistoryEntry[] = [
            {
                id: 'seed1',
                image: '/next.svg',
                timestamp: new Date(now - 1000 * 60 * 5),
                objectDetected: true,
                objectType: 'fish',
                riskZone: 'Low',
                distance: '3.4m',
                visibilityScore: 78,
                gpsCoordinates: '12.9716,77.5946'
            },
            {
                id: 'seed2',
                image: '/globe.svg',
                timestamp: new Date(now - 1000 * 60 * 30),
                objectDetected: true,
                objectType: 'trash branch',
                riskZone: 'Medium',
                distance: '7.1m',
                visibilityScore: 45,
                gpsCoordinates: '12.2958,76.6394'
            },
            {
                id: 'seed3',
                image: '/file.svg',
                timestamp: new Date(now - 1000 * 60 * 60 * 5),
                objectDetected: false,
                objectType: undefined,
                riskZone: 'Low',
                distance: '--',
                visibilityScore: 99,
                gpsCoordinates: '13.0827,80.2707'
            }
        ];
        setHistory(seed);
    };
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
