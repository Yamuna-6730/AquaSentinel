"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadCardProps {
    onFileSelected: (file: File) => void;
    previewUrl: string | null;
}

const UploadCard = ({ onFileSelected, previewUrl }: UploadCardProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelected(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelected(e.dataTransfer.files[0]);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative flex flex-col items-center justify-center h-[300px] rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                previewUrl ? 'border-cyan-500 shadow-[0_0_30px_rgba(0,210,255,0.2)]' : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            {previewUrl ? (
                <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent flex items-end p-6">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <ImageIcon size={16} />
                            <span className="text-xs uppercase tracking-widest font-bold">Image Uploaded</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center p-8 text-center text-white/50">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors">
                        <Upload size={28} className="text-white group-hover:text-cyan-400" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-white mb-2">Upload Image Data</p>
                    <p className="text-xs">Drag and drop or click to browse</p>
                </div>
            )}
        </motion.div>
    );
};

export default UploadCard;