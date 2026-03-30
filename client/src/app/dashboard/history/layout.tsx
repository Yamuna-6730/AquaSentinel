import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-navy-900 text-white selection:bg-cyan-500/30 overflow-x-hidden pt-0 mt-0">
            {/* Background elements */}
            <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar />

            {/* Main Content Wrapper - Push content to the right of the w-64 sidebar */}
            <main className="pl-64 min-h-screen relative z-10 w-full overflow-hidden">
                {children}
            </main>
        </div>
    );
}