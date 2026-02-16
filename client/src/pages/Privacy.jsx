import React from 'react';
import Navbar from '../components/ui/Navbar';
import { ShieldAlert, EyeOff, Fingerprint, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * Privacy - Privacy Shield Protocol Station
 */
const Privacy = () => {
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
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Security Station</span>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            PRIVACY <span className="text-secondary">SHIELD</span>
                        </h1>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">Effective Date: February 11, 2026</p>
                    </div>
                </div>

                <div className="p-12 bg-[#fcfdfe] border border-slate-100 rounded-[48px] space-y-12 shadow-sm text-slate-600 font-medium leading-relaxed">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-secondary" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">01. Identity Protection</h2>
                        </div>
                        <p className="pl-8 text-sm">
                            At Clarity Bureau, your identity is treated as a strategic asset. We utilize encrypted session protocols to ensure that your workflow activity remains isolated and protected from third-party interception.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-5 h-5 text-secondary" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">02. Data Sovereignty</h2>
                        </div>
                        <p className="pl-8 text-sm">
                            Your Intelligence Station data belongs solely to you. We do not aggregate or sell your strategic intents, decision records, or execution units. All data is stored in secured, high-availability clusters.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <EyeOff className="w-5 h-5 text-secondary" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">03. Minimal Exposure</h2>
                        </div>
                        <p className="pl-8 text-sm">
                            We follow the principle of least privilege. Only essential metadata required for synchronization and synchronization is processed. Your reasoning and internal reflections are strictly private.
                        </p>
                    </section>

                    <p className="text-[10px] text-slate-400 pt-10 border-t border-slate-100 italic">
                        The Clarity Bureau maintains the highest tier of confidentiality protocols to secure your strategic journey.
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

export default Privacy;
