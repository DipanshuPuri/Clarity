import React from 'react';
import Navbar from '../components/ui/Navbar';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * Terms - Legal Protocol Station
 */
const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white animate-fade-slide-up">
            <Navbar />

            <main className="pt-32 pb-20 px-8 md:px-24 max-w-4xl mx-auto space-y-20">
                <div className="space-y-6">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ml-3 text-slate-400 hover:text-secondary group transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
                    </Button>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Legal Protocol</span>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            TERMS & <span className="text-secondary">CONDITIONS</span>
                        </h1>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">Effective Date: February 11, 2026</p>
                    </div>
                </div>

                <div className="p-12 bg-[#fcfdfe] border border-slate-100 rounded-[48px] space-y-12 shadow-sm text-slate-600 font-medium leading-relaxed">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-secondary" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">01. Workspace Acceptance</h2>
                        </div>
                        <p className="pl-8 text-sm">
                            By establishing a session with Clarity, you agree to abide by the execution protocols defined within the platform. Clarity is a traceability engine; actions recorded are permanent and linked to your identity profile.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-secondary" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">02. Data Immutability</h2>
                        </div>
                        <p className="pl-8 text-sm">
                            Users acknowledge that the 'Context First' hierarchy is designed for data integrity. Once a strategic link is formed, parent records cannot be modified. This is a core feature of our Intelligence Station and is not subject to negation.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-secondary" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">03. Professional Conduct</h2>
                        </div>
                        <p className="pl-8 text-sm">
                            Clarity is designed for high-fidelity professional environments. Any misuse of the Intelligence Station to propagate misinformation or subvert strategic traceability will result in immediate session termination.
                        </p>
                    </section>

                    <p className="text-[10px] text-slate-400 pt-10 border-t border-slate-100 italic">
                        The Clarity Bureau reserves the right to calibrate these protocols as the engine evolves.
                    </p>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-50 text-center">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} CLARITY BUREAU.
                </p>
            </footer>
        </div>
    );
};

export default Terms;
