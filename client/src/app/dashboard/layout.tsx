"use client";

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-navy-900">
            {/* Sidebar is fixed, so it doesn't take up space in the document flow */}
            <Sidebar />
            
            {/* Main content area needs to be offset on large screens to account for the fixed sidebar */}
            <main className="lg:pl-64 min-h-screen transition-all duration-300">
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
