"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Waves, Upload, History, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'History', href: '/dashboard/history', icon: History },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-navy-900/80 border-r border-white/5 backdrop-blur-xl flex flex-col z-40">
            <div className="p-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-cyan-500 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.5)]">
                        <Waves className="text-navy-900" size={20} />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white glow-text">VASM</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                                    isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                                whileHover={{ x: 5 }}
                            >
                                <Icon size={20} />
                                <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(0,210,255,0.8)]"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>
            
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,210,255,1)] animate-pulse" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">System Online</div>
                        <div className="text-[10px] text-cyan-400 uppercase tracking-widest">Connected</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;