"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Navigation, Eye, Globe } from 'lucide-react';

const SensorOverlay = () => {
    const [data, setData] = useState({
        detected: "Yes",
        risk: "Low",
        distance: 45.2,
        visibility: 88,
        gps: "40.7128° N, 74.0060° W"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => ({
                ...prev,
                distance: +(prev.distance + (Math.random() * 2 - 1)).toFixed(1),
                visibility: Math.min(100, Math.max(0, prev.visibility + Math.floor(Math.random() * 5 - 2))),
                risk: Math.random() > 0.8 ? (Math.random() > 0.5 ? "Medium" : "High") : "Low",
                detected: Math.random() > 0.9 ? "No" : "Yes"
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-6 left-6 z-10 w-80 glass-card p-6 rounded-2xl overflow-hidden">
            {/* Decorative scanner line */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-cyan-500/30 z-0"
            />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <Activity size={18} className="text-cyan-400 animate-pulse" />
                    <h3 className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">Live Sensor Telemetry</h3>
                </div>

                <div className="space-y-4">
                    <DataRow
                        label="Object Detected"
                        value={data.detected}
                        icon={<Eye size={14} />}
                        status={data.detected === "Yes" ? "success" : "warning"}
                    />
                    <DataRow
                        label="Risk Zone"
                        value={data.risk}
                        icon={<Shield size={14} />}
                        status={data.risk === "Low" ? "success" : data.risk === "Medium" ? "warning" : "danger"}
                    />
                    <DataRow
                        label="Distance"
                        value={`${data.distance}m`}
                        icon={<Navigation size={14} />}
                    />
                    <DataRow
                        label="Visibility Score"
                        value={`${data.visibility}%`}
                        icon={<Globe size={14} />}
                    />

                    <div className="pt-4 border-t border-white/10 mt-2">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">GPS Coordinates</span>
                        <span className="text-xs font-mono text-cyan-400/80">{data.gps}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataRow = ({ label, value, icon, status }: { label: string, value: string, icon: React.ReactNode, status?: string }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'text-emerald-400';
            case 'warning': return 'text-amber-400';
            case 'danger': return 'text-rose-400';
            default: return 'text-cyan-400';
        }
    };

    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                    <div className="text-white/60">{icon}</div>
                </div>
                <span className="text-[11px] text-white/50 uppercase tracking-wider">{label}</span>
            </div>
            <AnimatePresence mode="wait">
                <motion.span
                    key={value}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`text-sm font-bold font-mono ${getStatusColor()}`}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

export default SensorOverlay;
