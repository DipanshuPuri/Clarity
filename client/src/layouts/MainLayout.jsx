import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronRight, ShieldCheck, Building2, User, UserCircle, Settings, LogOut as LogOutIcon, Globe, Target } from 'lucide-react';
import { ROUTES, NAV_ITEMS } from '../routes/config';
import ReleaseBanner from '../components/releases/ReleaseBanner';

/**
 * MainLayout - Redesigned with Global Header & Top-Right Profile
 */
const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const canvasRef = useRef(null);

    // Reset scroll position on route change
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.scrollTo(0, 0);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = ROUTES.LOGIN;
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const isActive = (path) => location.pathname === path || (path !== ROUTES.DASHBOARD && location.pathname.startsWith(path));

    // Guard: Unresolved Auth
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] block">Establishing Context</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Consulting Architecture...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Guard: Null User
    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    return (
        <div className="flex flex-row min-h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">

            {/* 1. SIDEBAR: Ultra-Minimal Station */}
            <aside className="w-[220px] flex-shrink-0 flex flex-col bg-[#fbfcfd] border-r border-slate-100 h-screen sticky top-0 shadow-sm z-20">

                {/* Branding Section */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-50 flex-shrink-0">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-900/10 transition-transform hover:scale-110">
                        <Target className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-slate-900 tracking-normal uppercase leading-none select-none">
                            CLARITY
                        </span>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.3em] mt-1">
                            Workstation
                        </span>
                    </div>
                </div>

                {/* Navigation: High-Contrast Links */}
                <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {NAV_ITEMS.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`
                                flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group
                                ${isActive(link.path)
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]'
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className={`w-3.5 h-3.5 transition-colors ${isActive(link.path) ? 'text-secondary' : 'text-slate-300 group-hover:text-slate-900'}`} />
                                {link.label}
                            </div>
                            {isActive(link.path) && <ChevronRight className="w-3 h-3 text-secondary" />}
                        </Link>
                    ))}

                    {/* Separator */}
                    <div className="h-px bg-slate-100 my-3 mx-2" />

                    {/* Utility Links */}
                    <Link
                        to="/app/organization"
                        className={`
                            flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group
                            ${isActive('/app/organization')
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Building2 className={`w-3.5 h-3.5 transition-colors ${isActive('/app/organization') ? 'text-secondary' : 'text-slate-300 group-hover:text-slate-900'}`} />
                            Organization
                        </div>
                        {isActive('/app/organization') && <ChevronRight className="w-3 h-3 text-secondary" />}
                    </Link>
                    <Link
                        to="/app/profile"
                        className={`
                            flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group
                            ${isActive('/app/profile')
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Settings className={`w-3.5 h-3.5 transition-colors ${isActive('/app/profile') ? 'text-secondary' : 'text-slate-300 group-hover:text-slate-900'}`} />
                            Profile
                        </div>
                        {isActive('/app/profile') && <ChevronRight className="w-3 h-3 text-secondary" />}
                    </Link>
                </nav>

                {/* Sidebar Footer: Org Status */}
                <div className="p-4 border-t border-slate-50">
                    <Link to="/app/organization" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <Building2 className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest truncate leading-none">
                                {user?.organization || 'Context First Workflow Architecture'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* 2. MAIN AREA: Header + Canvas */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* GLOBAL TOP BAR: Organization & Profile */}
                <header className="h-16 w-full bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-8 flex-shrink-0 z-50 sticky top-0">

                    {/* Organization Context (Clickable to Dashboard) */}
                    <Link to="/app/organization" className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-2xl transition-all">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Organization</p>
                            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight group-hover:text-secondary transition-colors">
                                {user?.organization || 'Independent Strategist'}
                            </h2>
                        </div>
                    </Link>

                    {/* Top-Right Profile Identity */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-4 p-2 pl-4 bg-[#fbfcfd] border border-slate-100 rounded-2xl hover:border-secondary/30 hover:shadow-sm transition-all group"
                        >
                            <div className="text-right hidden sm:block space-y-0.5">
                                <p className="text-xs font-bold text-slate-900 leading-none">
                                    {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                                </p>
                                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest leading-none">
                                    {user?.role === 'FOUNDER' ? 'FOUNDER' : user?.role || 'Verified Access'}
                                </p>
                            </div>

                            <div className="relative">
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-xl object-cover border border-white shadow-sm"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                        {(user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                </div>
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <div className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-50 animate-scale-in">
                                    <div className="space-y-1 pb-4 mb-4 border-b border-slate-50">
                                        <Link
                                            to="/app/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                                <UserCircle className="w-4 h-4 text-secondary" />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900">View Profile</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition-colors group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                <LogOutIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">Log Out</span>
                                        </button>
                                    </div>
                                    <Link to="/app/organization" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                                        <Building2 className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Go to Organization Hub</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <ReleaseBanner />

                {/* CANVAS: Viewport for Content */}
                <div ref={canvasRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
                    <div key={location.pathname} className="max-w-7xl mx-auto w-full animate-page-fade">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
