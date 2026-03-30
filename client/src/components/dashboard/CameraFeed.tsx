"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, StopCircle, Video } from 'lucide-react';

interface CameraFeedProps {
    onFrameCaptured: (dataUrl: string) => void;
}

const CameraFeed = ({ onFrameCaptured }: CameraFeedProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isActive, setIsActive] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setIsActive(true);
        } catch (err) {
            console.error("Error accessing camera", err);
            alert("Unable to access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsActive(false);
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current && isActive) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onFrameCaptured(dataUrl);
            }
        }
    };

    // Auto capture frame periodically for detection when active
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                captureFrame();
            }, 3000); // Capture every 3 seconds for simulation
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative flex flex-col items-center justify-center h-[300px] rounded-3xl border-2 border-dashed transition-all overflow-hidden ${
                isActive ? 'border-cyan-500 shadow-[0_0_30px_rgba(0,210,255,0.2)]' : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5 cursor-pointer'
            }`}
            onClick={() => !isActive && startCamera()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover ${isActive ? 'opacity-100' : 'opacity-0'}`} 
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isActive ? (
                <div className="flex flex-col items-center p-8 text-center text-white/50">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors">
                        <Camera size={28} className="text-white group-hover:text-cyan-400" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-white mb-2">Use Live Camera</p>
                    <p className="text-xs">Click to start real-time monitoring</p>
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent flex items-end p-6">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2 text-red-500">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                            <span className="text-xs uppercase tracking-widest font-bold glow-text">Live Feed Active</span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/40 p-2 rounded-full transition-colors backdrop-blur-md"
                        >
                            <StopCircle size={20} />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CameraFeed;