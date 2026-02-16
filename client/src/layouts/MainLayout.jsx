import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Layout, Target, ListChecks, TrendingUp, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';

/**
 * MainLayout - Redesigned for Global White Surface Aesthetic
 */
const MainLayout = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authApi.getCurrentUser();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

    const navLinks = [
        { label: 'Dashboard', path: '/app/dashboard', icon: Layout },
    ];

    return (
        <div className="flex flex-row min-h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">

            {/* 1. SIDEBAR: Premium White Surface */}
            <aside className="w-[280px] flex-shrink-0 flex flex-col bg-[#fbfcfd] border-r border-slate-100 h-screen sticky top-0 shadow-sm z-20">

                {/* Branding Section */}
                <div className="h-24 flex flex-col justify-center px-10 border-b border-slate-50 flex-shrink-0">
                    <span className="text-3xl font-black text-slate-900 tracking-normal uppercase leading-none select-none">
                        CLARITY
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.3em] mt-1">
                        Bureau Station
                    </span>
                </div>

                {/* Navigation: High-Contrast Links */}
                <nav className="flex-1 py-12 px-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`
                                flex items-center justify-between px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group
                                ${isActive(link.path)
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]'
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <link.icon className={`w-4 h-4 transition-colors ${isActive(link.path) ? 'text-secondary' : 'text-slate-300 group-hover:text-slate-900'}`} />
                                {link.label}
                            </div>
                            {isActive(link.path) && <ChevronRight className="w-3 h-3 text-secondary" />}
                        </Link>
                    ))}
                </nav>

                {/* User Profile & Session Security */}
                <div className="p-8 border-t border-slate-50 bg-white/50 flex-shrink-0 space-y-6">
                    <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-secondary" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Context Identity</span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.email || 'Loading...'}</p>
                            <p className="text-[9px] font-extrabold text-secondary uppercase tracking-widest">
                                {user?.role || 'Verified Access'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out Session
                    </button>
                </div>
            </aside>

            {/* 2. MAIN AREA: Canvas for Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 custom-scrollbar">
                    <div className="max-w-7xl mx-auto w-full">
                        {/* Page content rendered here */}
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
