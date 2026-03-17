import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AlertCircle, ShieldCheck, ArrowRight, Home } from 'lucide-react';

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

            {/* LEFT: Narrative Sidebar */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-20 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-[10px] font-medium text-secondary uppercase tracking-[0.5em] mb-12">Clarity - Context First Workflow Architecture</h2>
                    <div className="space-y-5">
                        <h3 className="text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
                            Every decision,<br /><span className="text-secondary">traceable.</span>
                        </h3>
                        <p className="text-base text-slate-400 font-normal max-w-md leading-relaxed">
                            Full pipeline visibility from project scoping through release deployment.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Security</p>
                        <p className="text-xs font-medium text-slate-300">Role-based access control active</p>
                    </div>
                </div>

                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-secondary/8 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/3 blur-[80px] rounded-full" />
            </div>

            {/* RIGHT: Login Interface */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 md:px-24">
                <div className="w-full max-w-sm space-y-12">

                    <div className="space-y-4 text-center lg:text-left">
                        <div className="lg:hidden space-y-3 mb-6">
                            <span className="text-lg font-bold text-slate-900 tracking-tight">Clarity</span>
                            <h3 className="text-xl font-bold text-slate-600 leading-tight">
                                Sign in to your workspace
                            </h3>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
                        <p className="text-sm text-slate-500 font-normal">Sign in to continue to your organization's workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl text-sm flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="font-bold uppercase text-[10px] tracking-tight leading-relaxed">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-secondary transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-secondary transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group transition-all"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                        </button>

                        <div className="flex flex-col items-center gap-3 pt-2">
                            <button type="button" className="text-xs text-slate-500 font-normal hover:text-secondary transition-colors">
                                Forgot password?
                            </button>
                            <div className="h-px w-8 bg-slate-100" />
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium hover:text-slate-900 transition-colors">
                                    <Home className="w-3 h-3" /> Home
                                </button>
                                <button type="button" onClick={() => navigate('/register')} className="text-xs text-secondary font-medium hover:text-secondary/80 transition-colors">
                                    Create account
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="text-center pt-6">
                        <p className="text-[10px] text-slate-400 font-normal">
                            &copy; {new Date().getFullYear()} Clarity - Context First Workflow Architecture
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
