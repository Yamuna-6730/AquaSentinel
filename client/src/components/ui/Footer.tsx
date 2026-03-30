"use client";

import React from 'react';
import { Waves, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="py-20 relative overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
                                <Waves className="text-cyan-400" size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white glow-text">VASM</span>
                        </div>
                        <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-6">
                            Global leader in visibility-aware surface monitoring solutions.
                            Engineering a safer and cleaner marine future through
                            intelligent hardware and software integration.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                            <SocialIcon icon={<Github size={18} />} />
                            <SocialIcon icon={<Mail size={18} />} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
                        <ul className="space-y-4 text-sm text-white/40">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Hardware Specs</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Research Papers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
                        <ul className="space-y-4 text-sm text-white/40">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
                    <p>© 2026 VASM Systems Int. All rights reserved.</p>
                    <p>Designed for Marine Excellence.</p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 transition-all">
        {icon}
    </a>
);

export default Footer;
