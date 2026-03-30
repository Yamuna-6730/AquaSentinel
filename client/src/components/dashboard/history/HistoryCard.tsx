"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Navigation, Calendar, Eye, Trash2 } from 'lucide-react';
import { HistoryEntry } from '@/context/HistoryContext';

interface HistoryCardProps {
    entry: HistoryEntry;
    onPlayClick: (entry: HistoryEntry) => void;
    onDelete?: (id: string) => void;
}

const HistoryCard = ({ entry, onPlayClick, onDelete }: HistoryCardProps) => {
    
    // Formatting date and time
    const dateStr = entry.timestamp.toLocaleDateString();
    const timeStr = entry.timestamp.toLocaleTimeString();

    // Risk badge styling
    const riskStyles = {
        'Low': 'bg-green-500/20 text-green-400',
        'Medium': 'bg-yellow-500/20 text-yellow-400',
        'High': 'bg-red-500/20 text-red-500 glow-text shadow-[0_0_10px_rgba(239,68,68,0.3)]'
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`relative p-6 rounded-[24px] border border-white/5 transition-all group overflow-hidden ${
                entry.riskZone === 'High' ? 'bg-red-950/20 hover:border-red-500/30' : 
                'glass-card hover:border-cyan-500/30'
            }`}
        >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-1">
                        {entry.objectDetected ? (entry.objectType || 'Unknown Object') : 'Clear Surface'}
                    </h3>
                </div>
                <div className="flex gap-2">
                    {onDelete && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                    <button 
                        onClick={() => onPlayClick(entry)}
                        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition-all group-hover:scale-110 shadow-sm"
                    >
                        <Play size={12} className="ml-0.5" />
                    </button>
                </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 text-xs text-white/60">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-cyan-400/70" />
                    <span className="font-mono">{timeStr}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-cyan-400/70" />
                    <span className="font-mono">{entry.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-400/70" />
                    <span className="font-mono">{dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Eye size={14} className="text-cyan-400/70" />
                    <span className="font-mono">{entry.visibilityScore}%</span>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${riskStyles[entry.riskZone]}`}>
                    {entry.riskZone === 'High' ? 'CRITICAL RISK' : `${entry.riskZone} RISK`}
                </span>
            </div>
        </motion.div>
    );
};

export default HistoryCard;
