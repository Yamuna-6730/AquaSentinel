"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, ShieldAlert, Trash2 } from 'lucide-react';
import { useHistory, HistoryEntry } from '@/context/HistoryContext';
import HistoryCard from '@/components/dashboard/history/HistoryCard';
import HistoryModal from '@/components/dashboard/history/HistoryModal';

export default function HistoryPage() {
    const { history, clearHistory } = useHistory();
    const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

    // Provide a dummy method for deleting single entries if we want to expand functionality
    const handleDeleteEntry = (id: string) => {
        // Implement single delete in context if needed, for now just clear all available.
        console.log(`Delete ${id} (Need to implement in context)`);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="p-8 lg:p-12 w-full max-w-7xl mx-auto min-h-screen flex flex-col gap-8 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white glow-text flex items-center gap-4"
                    >
                        <HistoryIcon className="text-cyan-400" size={32} />
                        Detection History
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/60 mt-2 max-w-2xl"
                    >
                        Review previously analyzed surface data and AI detection results. Access the persistent log of marine object classifications.
                    </motion.p>
                </div>

                {history.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={clearHistory}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors uppercase tracking-widest text-[10px] font-bold shrink-0"
                    >
                        <Trash2 size={14} />
                        Clear History
                    </motion.button>
                )}
            </div>

            {/* Content Feed */}
            {history.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/5"
                >
                    <ShieldAlert size={48} className="text-white/20 mb-4" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">No Records Found</h3>
                    <p className="text-white/50 text-center max-w-md">
                        There is no detection history available yet. Navigate to the dashboard and upload an image or start the live feed.
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {history.map(entry => (
                        <motion.div key={entry.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                            <HistoryCard 
                                entry={entry} 
                                onPlayClick={(data) => setSelectedEntry(data)} 
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Modal Overlay */}
            <HistoryModal 
                isOpen={!!selectedEntry} 
                onClose={() => setSelectedEntry(null)} 
                entry={selectedEntry} 
            />
        </div>
    );
}