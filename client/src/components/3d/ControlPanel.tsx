"use client";

import React from 'react';
import { Maximize, RotateCw, Grid, Home, View, Box } from 'lucide-react';

interface ControlPanelProps {
    autoRotate: boolean;
    setAutoRotate: (v: boolean) => void;
    wireframe: boolean;
    setWireframe: (v: boolean) => void;
    showGrid: boolean;
    setShowGrid: (v: boolean) => void;
    onResetCamera: () => void;
    onViewFront: () => void;
    onViewTop: () => void;
    onViewSide: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    autoRotate, setAutoRotate,
    wireframe, setWireframe,
    showGrid, setShowGrid,
    onResetCamera, onViewFront, onViewTop, onViewSide
}) => {
    return (
        <div className="absolute top-6 right-6 z-10 w-64 glass-card p-4 rounded-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Model Controls</h3>

            <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-secondary-text group-hover:text-cyan-400 transition-colors">Wireframe Mode</span>
                    <button
                        onClick={() => setWireframe(!wireframe)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${wireframe ? 'bg-cyan-500' : 'bg-navy-800'}`}
                    >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${wireframe ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-secondary-text group-hover:text-cyan-400 transition-colors">Auto-Rotate</span>
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${autoRotate ? 'bg-cyan-500' : 'bg-navy-800'}`}
                    >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${autoRotate ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-secondary-text group-hover:text-cyan-400 transition-colors">Show Grid</span>
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${showGrid ? 'bg-cyan-500' : 'bg-navy-800'}`}
                    >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showGrid ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                </label>
            </div>

            <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-2">
                <button
                    onClick={onResetCamera}
                    className="flex items-center gap-2 text-[10px] bg-white/5 hover:bg-cyan-500/20 py-2 px-3 rounded border border-white/5 hover:border-cyan-500/50 transition-all font-medium uppercase tracking-tighter"
                >
                    <Home size={12} className="text-cyan-400" /> Reset
                </button>
                <button
                    onClick={onViewFront}
                    className="flex items-center gap-2 text-[10px] bg-white/5 hover:bg-cyan-500/20 py-2 px-3 rounded border border-white/5 hover:border-cyan-500/50 transition-all font-medium uppercase tracking-tighter"
                >
                    <View size={12} className="text-cyan-400" /> Front
                </button>
                <button
                    onClick={onViewTop}
                    className="flex items-center gap-2 text-[10px] bg-white/5 hover:bg-cyan-500/20 py-2 px-3 rounded border border-white/5 hover:border-cyan-500/50 transition-all font-medium uppercase tracking-tighter"
                >
                    <Maximize size={12} className="text-cyan-400" /> Top
                </button>
                <button
                    onClick={onViewSide}
                    className="flex items-center gap-2 text-[10px] bg-white/5 hover:bg-cyan-500/20 py-2 px-3 rounded border border-white/5 hover:border-cyan-500/50 transition-all font-medium uppercase tracking-tighter"
                >
                    <Box size={12} className="text-cyan-400" /> Side
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
