"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwitchCamera, Upload as UploadIcon, ShieldAlert } from 'lucide-react';
import UploadCard from '@/components/dashboard/UploadCard';
import CameraFeed from '@/components/dashboard/CameraFeed';
import TelemetryPanel, { TelemetryData } from '@/components/dashboard/TelemetryPanel';
import { useHistory } from '@/context/HistoryContext';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
    const [isDetecting, setIsDetecting] = useState(false);
    const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { addEntry } = useHistory();

    // AI Detection Process using FastAPI Backend
    const processDetection = useCallback(async (source: File | string, type: 'upload' | 'camera') => {
        setIsDetecting(true);
        setTelemetry(null);

        try {
            let response;
            const baseUrl = "http://localhost:8000/api/predict";

            if (type === 'upload' && source instanceof File) {
                const formData = new FormData();
                formData.append('file', source);
                response = await fetch(`${baseUrl}/image`, {
                    method: 'POST',
                    body: formData,
                });
            } else if (type === 'camera' && typeof source === 'string') {
                response = await fetch(`${baseUrl}/frame`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: source }),
                });
            }

            if (response && response.ok) {
                const result = await response.json();
                
                // Set the annotated image as the preview
                setPreviewUrl(result.annotated_image);

                // Map backend response to TelemetryData interface
                const telemetryData: TelemetryData = {
                    objectDetected: result.telemetry.object_detected,
                    objectType: result.detections.length > 0 ? result.detections[0].label : undefined,
                    riskZone: result.telemetry.risk_level,
                    distance: `${result.telemetry.distance.toFixed(1)}m`,
                    visibilityScore: Math.round(result.telemetry.visibility_score),
                    gpsCoordinates: `45°${(Math.random()*60).toFixed(2)}'N, 13°${(Math.random()*60).toFixed(2)}'E` // Mock GPS
                };

                setTelemetry(telemetryData);

                // Add to persistent history if an object is detected or it's a manual upload
                if (type === 'upload' || (type === 'camera' && telemetryData.objectDetected)) {
                    addEntry({
                        ...telemetryData,
                        image: result.annotated_image || previewUrl || '',
                    });
                }
            }
        } catch (error) {
            console.error("AI Detection Error:", error);
        } finally {
            setIsDetecting(false);
        }
    }, [addEntry, previewUrl]);

    const handleFileUpload = (file: File) => {
        processDetection(file, 'upload');
    };

    const handleCameraFrame = (dataUrl: string) => {
        if (!isDetecting) {
            processDetection(dataUrl, 'camera');
        }
    };

    return (
        <div className="p-8 lg:p-12 w-full max-w-7xl mx-auto min-h-screen flex flex-col gap-8">
            {/* Header */}
            <div>
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white glow-text flex items-center gap-4"
                >
                    <ShieldAlert className="text-cyan-400" size={32} />
                    Surface Data Upload
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60 mt-2 max-w-2xl"
                >
                    Deploy sensory visual data to the AquaSentinel AI core for real-time marine threat classification and visibility analysis.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Left Side: Inputs */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Tabs */}
                    <div className="flex bg-navy-800/50 p-2 rounded-2xl border border-white/5 w-max z-10 relative">
                        <button
                            onClick={() => { setActiveTab('upload'); setPreviewUrl(null); setTelemetry(null); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all z-10 ${
                                activeTab === 'upload' ? 'text-navy-900' : 'text-white/50 hover:text-white'
                            }`}
                        >
                            <UploadIcon size={16} />
                            Upload Image
                        </button>
                        <button
                            onClick={() => { setActiveTab('camera'); setPreviewUrl(null); setTelemetry(null); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all z-10 ${
                                activeTab === 'camera' ? 'text-navy-900' : 'text-white/50 hover:text-white'
                            }`}
                        >
                            <SwitchCamera size={16} />
                            Live Feed
                        </button>

                        <motion.div
                            className="absolute top-2 bottom-2 bg-cyan-500 rounded-xl shadow-[0_0_15px_rgba(0,210,255,0.6)] z-0"
                            initial={false}
                            animate={{
                                left: activeTab === 'upload' ? '0.5rem' : 'calc(50% + 0.25rem)',
                                width: 'calc(50% - 0.75rem)'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                    </div>

                    {/* Input Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'upload' ? (
                                <UploadCard onFileSelected={handleFileUpload} previewUrl={previewUrl} />
                            ) : (
                                <CameraFeed onFrameCaptured={handleCameraFrame} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Telemetry */}
                <div className="lg:col-span-5 h-[500px] lg:h-auto">
                    <TelemetryPanel data={telemetry} isDetecting={isDetecting} />
                </div>
            </div>
        </div>
    );
}
