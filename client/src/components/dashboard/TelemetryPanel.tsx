"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, AlertTriangle, Eye, Navigation } from 'lucide-react';

export interface TelemetryData {
    objectDetected: boolean;
    objectType?: string;
    riskZone: 'Low' | 'Medium' | 'High';
    distance: string;
    visibilityScore: number;
    gpsCoordinates: string;
}

interface TelemetryPanelProps {
    data: TelemetryData | null;
    isDetecting: boolean;
}

const TelemetryPanel = ({ data, isDetecting }: TelemetryPanelProps) => {

    const riskColorMap = {
        'Low': 'text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]',
        'Medium': 'text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]',
        'High': 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
    };

    const riskBgMap = {
        'Low': 'bg-green-400/10 border-green-400/30',
        'Medium': 'bg-yellow-400/10 border-yellow-400/30',
        'High': 'bg-red-500/10 border-red-500/30'
    };

    return (
        <div className="glass-card rounded-[32px] overflow-hidden flex flex-col h-full border border-cyan-500/20 relative">
            {isDetecting && (
                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-0 left-0 h-1 bg-cyan-400 w-full origin-left shadow-[0_0_15px_rgba(0,210,255,1)]"
                />
            )}
            
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="text-cyan-400" size={24} />
                    <h2 className="text-xl font-black uppercase tracking-widest text-white glow-text">Live Sensor Telemetry</h2>
                </div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest">
                    {isDetecting ? 'Processing AI...' : 'Awaiting Data'}
                </div>
            </div>

            <div className="p-8 flex-1 grid grid-cols-1 gap-6 relative">
                
                {/* Object Detected */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <Target className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Target Classification</div>
                            <div className="text-lg font-bold text-white">
                                {data ? (data.objectDetected ? `${data.objectType || 'Unknown Entity'}` : 'Clear Surface') : '--'}
                            </div>
                        </div>
                    </div>
                    {data?.objectDetected && (
                        <div className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                            Detected
                        </div>
                    )}
                </motion.div>

                {/* Risk Zone */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className={`p-6 rounded-2xl border transition-colors flex items-center justify-between ${data ? riskBgMap[data.riskZone] : 'bg-white/5 border-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5`}>
                            <AlertTriangle className={data ? `text-${data.riskZone === 'Low' ? 'green-400' : data.riskZone === 'Medium' ? 'yellow-400' : 'red-500'}` : 'text-white/50'} size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Hazard Risk Zone</div>
                            <div className={`text-lg font-bold ${data ? (data.riskZone === 'Low' ? 'text-green-400' : data.riskZone === 'Medium' ? 'text-yellow-400' : 'text-red-500 glow-text') : 'text-white'}`}>
                                {data ? data.riskZone : '--'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Distance */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col"
                    >
                        <div className="flex items-center gap-2 text-white/50 mb-4">
                            <Navigation size={16} />
                            <span className="text-[10px] uppercase tracking-widest">Est. Distance</span>
                        </div>
                        <div className="text-3xl font-black text-white font-mono">{data ? data.distance : '--'}</div>
                    </motion.div>

                    {/* Visibility */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col"
                    >
                        <div className="flex items-center gap-2 text-white/50 mb-4">
                            <Eye size={16} />
                            <span className="text-[10px] uppercase tracking-widest">Visibility Index</span>
                        </div>
                        <div className="text-3xl font-black text-white font-mono">{data ? `${data.visibilityScore}%` : '--'}</div>
                    </motion.div>
                </div>

                {/* GPS */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="mt-2 text-center"
                >
                    <div className="inline-block px-4 py-2 bg-navy-900/50 rounded-full border border-white/10 text-[10px] font-mono text-cyan-400 tracking-widest">
                        NFO: {data ? data.gpsCoordinates : 'AWAITING LOCK...'}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TelemetryPanel;