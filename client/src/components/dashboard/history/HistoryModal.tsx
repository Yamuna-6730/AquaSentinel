"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { HistoryEntry } from '@/context/HistoryContext';
import TelemetryPanel from '@/components/dashboard/TelemetryPanel';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: HistoryEntry | null;
}

const HistoryModal = ({ isOpen, onClose, entry }: HistoryModalProps) => {

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!entry) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed ml-40 inset-0 z-50 flex items-center justify-center p-4 lg:p-8">

                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-navy-900/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl h-[80vh] max-h-[650px] glass-card rounded-[24px] overflow-hidden flex flex-col border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                    >

                        {/* Header */}
                        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-navy-900/50">
                            <div>
                                <h2 className="text-base font-black uppercase tracking-widest text-white glow-text">
                                    Detection Log Overview
                                </h2>
                                <p className="text-[9px] text-white/40 font-mono mt-1">
                                    ID: {entry.id} | {entry.timestamp.toLocaleString()}
                                </p>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-2 gap-3 bg-navy-900/20">

                            {/* LEFT: Image */}
                            <div className="relative rounded-lg overflow-hidden border border-white/10 bg-navy-950 flex items-center justify-center h-[280px]">
                                <img 
                                    src={entry.image} 
                                    alt="Detection Captured" 
                                    className="w-full h-full object-contain scale-90"
                                />

                                <div className="absolute top-2 left-2">
                                    <div className="px-2 py-[2px] bg-navy-900/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-mono text-cyan-400 flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                        Visual Source
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Telemetry (scaled down) */}
                            <div className="flex items-center justify-center max-h-[500px] scale-[0.9] origin-top">
                                <TelemetryPanel 
                                    data={entry} 
                                    isDetecting={false} 
                                    compact 
                                />
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;