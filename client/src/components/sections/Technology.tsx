"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Cpu, Radio, Zap, Layers } from 'lucide-react';

const Technology = () => {
    const techs = [
        {
            icon: <Camera size={24} />,
            title: "RGB Camera",
            desc: "High-resolution optical monitoring for surface object identification."
        },
        {
            icon: <Radio size={24} />,
            title: "Ultrasonic Sensors",
            desc: "Short-range depth sensing and obstacle distance verification."
        },
        {
            icon: <Layers size={24} />,
            title: "GPS Module",
            desc: "Precise geospatial positioning and route tracking integration."
        },
        {
            icon: <Cpu size={24} />,
            title: "YOLOv8",
            desc: "YOLOv8 is a fast, powerful AI model that detects and understands objects in images in real time with a single pass."
        },
        {
            icon: <Zap size={24} />,
            title: "Risk Prediction",
            desc: "Advanced algorithms to forecast potential navigation hazards."
        }
    ];

    return (
        <section id="technology" className="py-24 bg-white/5 backdrop-blur-3xl border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4">Core Technology</h2>
                    <h3 className="text-4xl font-black text-white">Advanced Engineering Stack</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {techs.map((tech, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-3xl group hover:border-cyan-500/50 transition-all flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-navy-900 transition-colors shadow-lg group-hover:shadow-cyan-500/20">
                                {tech.icon}
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">{tech.title}</h4>
                            <p className="text-xs text-white/40 leading-relaxed uppercase tracking-wider font-semibold">
                                {tech.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Technology;
