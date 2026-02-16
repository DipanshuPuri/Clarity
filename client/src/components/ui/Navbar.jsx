import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import Button from './Button';

/**
 * Navbar - High-fidelity persistent navigation for public pages.
 */
const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2 group transition-all">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-secondary transition-colors shadow-lg shadow-black/10">
                    <span className="text-white text-xs font-black">C</span>
                </div>
                <span className="text-3xl font-black text-slate-900 tracking-normal uppercase">CLARITY</span>
            </Link>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/login')}
                        className="text-[10px] font-extrabold text-slate-900 uppercase tracking-widest px-6"
                    >
                        LOGIN
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => navigate('/login')}
                        className="bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-[0.2em] px-8 rounded-xl"
                    >
                        REGISTER
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
