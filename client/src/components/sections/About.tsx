"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, Ship } from 'lucide-react';

const About = () => {
    const cards = [
        {
            icon: <AlertTriangle size={32} className="text-rose-400" />,
            title: "The Problem",
            text: "Submarine visibility is often compromised by marine debris and varying water conditions, leading to navigation hazards and system damage.",
            color: "border-rose-500/20 bg-rose-500/5"
        },
        {
            icon: <Lightbulb size={32} className="text-cyan-400" />,
            title: "The Solution",
            text: "VASM provides a visibility-aware monitoring layer that uses edge AI to detect hazards and predict risk in real-time.",
            color: "border-cyan-500/20 bg-cyan-500/5"
        },
        {
            icon: <Ship size={32} className="text-emerald-400" />,
            title: "Navigation Safety",
            text: "Enhanced situational awareness allows for safer surface operations and better environmental protection in critical marine zones.",
            color: "border-emerald-500/20 bg-emerald-500/5"
        }
    ];

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-cyan-400 mb-4">Project Overview</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-white mb-6">Redefining Marine <br />Surface Awareness</h3>
                    <p className="text-white/60 text-lg leading-relaxed">
                        The Visibility-Aware Surface Monitoring System (VASM) is an engineering
                        breakthrough in maritime safety. By combining high-fidelity
                        3D sensors with intelligent risk algorithms, we provide
                        unprecedented clarity in monitoring marine environments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-3xl border ${card.color} backdrop-blur-sm group hover:scale-[1.02] transition-all`}
                        >
                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                {card.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-4">{card.title}</h4>
                            <p className="text-sm text-white/50 leading-relaxed font-medium">
                                {card.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
