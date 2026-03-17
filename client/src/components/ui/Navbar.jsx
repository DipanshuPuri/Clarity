import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

/**
 * Navbar - Solid, always-visible navigation bar for public pages.
 */
const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 h-16 bg-white border-b border-slate-200 shadow-sm">
            <Link to="/" className="flex items-center gap-2.5 group transition-all">
                <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <span className="text-white text-[10px] font-bold">C</span>
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight uppercase">Clarity</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Context First Workflow Architecture</span>
            </Link>

            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-5 py-2 hover:text-slate-900 transition-colors"
                >
                    Sign In
                </Button>
                <Button
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Get Started
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
