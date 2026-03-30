"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import ModelViewer from '@/components/3d/ModelViewer';
import ControlPanel from '@/components/3d/ControlPanel';
import SensorOverlay from '@/components/3d/SensorOverlay';
import * as THREE from 'three';

const Hero = () => {
    const [wireframe, setWireframe] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [controls, setControls] = useState<any>(null);

    const resetCamera = () => {
        if (controls) {
            controls.object.position.set(5, 5, 5);
            controls.target.set(0, 0, 0);
            controls.update();
        }
    };

    const setView = (position: [number, number, number]) => {
        if (controls) {
            controls.object.position.set(...position);
            controls.update();
        }
    };

    return (
        <section id="home" className="relative min-h-screen pt-20 flex items-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Side: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-8"
                >
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full w-fit">
                        <ShieldCheck size={16} className="text-cyan-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400">Next-Gen Marine Protection</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tighter text-white">
                        Visibility-Aware <br />
                        <span className="text-cyan-500 glow-text">Surface Monitoring</span>
                    </h1>

                    <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                        Advanced real-time monitoring system designed for submarine visibility
                        and marine waste detection. Mitigate risks and ensure safe navigation
                        in challenging aquatic environments.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a
                            href="#3d-model"
                            className="bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-black px-8 py-4 rounded-xl flex items-center gap-2 group transition-all shadow-xl"
                        >
                            Explore 3D Model
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/10 transition-all backdrop-blur-sm">
                            View Technology
                        </button>
                    </div>

                    <div className="flex gap-12 mt-8 border-t border-white/5 pt-8">
                        <div>
                            <div className="text-3xl font-black text-white leading-none">98.4%</div>
                            <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Detection Accuracy</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white leading-none">&lt; 0.5s</div>
                            <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Latency Response</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: 3D Viewer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative h-[600px] lg:h-[700px] w-full"
                >
                    <div className="absolute inset-0 bg-navy-900/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
                        <ModelViewer
                            modelPath="/object_0.glb"
                            wireframe={wireframe}
                            autoRotate={autoRotate}
                            showGrid={showGrid}
                            setControlsRef={setControls}
                        />
                    </div>

                    {/* Overlays */}
                    <ControlPanel
                        wireframe={wireframe}
                        setWireframe={setWireframe}
                        autoRotate={autoRotate}
                        setAutoRotate={setAutoRotate}
                        showGrid={showGrid}
                        setShowGrid={setShowGrid}
                        onResetCamera={resetCamera}
                        onViewFront={() => setView([0, 0, 7])}
                        onViewTop={() => setView([0, 7, 0])}
                        onViewSide={() => setView([7, 0, 0])}
                    />

                    <SensorOverlay />
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
