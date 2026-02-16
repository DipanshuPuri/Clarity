import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * Login Page - Redesigned as a Premium Gateway
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Access Denied.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row animate-fade-in">

            {/* LEFT: Aesthetic Narrative Sidebar */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-24 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-12">Clarity Bureau</h2>
                    <div className="space-y-6">
                        <h3 className="text-6xl font-extrabold tracking-tighter leading-none">The end of blind execution.</h3>
                        <p className="text-xl text-white/90 font-medium tracking-wide max-w-md leading-relaxed">
                            High-fidelity traceability starting from intent, grounded in reality.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Protocol</p>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">Active RBAC Authorization</p>
                    </div>
                </div>
            </div>

            {/* RIGHT: Login Interface */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 md:px-24">
                <div className="w-full max-w-sm space-y-12">

                    {/* Header */}
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center lg:justify-start items-center gap-2 mb-8">
                            <span className="text-2xl font-serif text-secondary uppercase tracking-tighter">Clarity</span>
                            <div className="h-px w-8 bg-slate-100 mx-1" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Login</h1>
                        <p className="text-sm text-slate-400 font-medium">Verify your credentials to synchronize workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl text-sm flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="font-bold uppercase text-[10px] tracking-tight leading-relaxed">{error}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                    Identity Profile
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                    Access Credential
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group transition-all"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Authenticating...' : 'LOGIN'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </Button>

                        <div className="flex flex-col items-center gap-4 pt-2">
                            <button type="button" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-secondary transition-colors">
                                Forgot Access Credential?
                            </button>
                            <div className="h-px w-8 bg-slate-100" />
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => navigate('/')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                    BACK
                                </button>
                                <button type="button" onClick={() => navigate('/register')} className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:text-secondary/80 transition-colors">
                                    REGISTER
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center pt-8">
                        &copy; {new Date().getFullYear()} Clarity Bureau
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
