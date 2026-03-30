"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Waves } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Technology', href: '#technology' },
        { name: '3D Model', href: '#3d-model' },
        { name: 'Features', href: '#features' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 glass shadow-2xl' : 'py-6 bg-transparent'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#home" className="flex items-center gap-2 group">
                    <div className="bg-cyan-500 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.5)]">
                        <Waves className="text-navy-900" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white glow-text">VASM</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-cyan-400 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <Link href="/dashboard" className="bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-105 active:scale-95 inline-block">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 glass transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] border-b border-white/10' : 'max-h-0'}`}>
                <div className="flex flex-col p-8 gap-6 items-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-cyan-400"
                        >
                            {link.name}
                        </a>
                    ))}
                    <Link href="/dashboard" className="w-full bg-cyan-500 text-navy-900 font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest text-center">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
