import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Zap, ListChecks, TrendingUp, ShieldCheck, ArrowRight, MessageCircle, Mail, Phone, HelpCircle, Instagram, Linkedin, Facebook, Twitter, ChevronRight, Activity, CheckCircle, Github, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/ui/Navbar';

/**
 * Home - Overhauled for "Context First Workflow Tracker"
 */
const Home = () => {
    return (
        <div className="snap-container bg-white overflow-x-hidden animate-fade-in">
            <Navbar />

            {/* 1. HERO SECTION */}
            <section className="snap-section min-h-screen flex flex-col items-center justify-center text-center px-10 relative overflow-hidden bg-slate-50/50">
                {/* Visual Background Element */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-secondary/5 to-transparent blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-slate-200/40 to-transparent blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 max-w-6xl">
                    <div className="space-y-4 mb-8">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em] animate-fade-in block">Strategic Workflow Architecture</span>
                        <h1 className="text-[10rem] font-black text-slate-900 tracking-normal leading-none animate-fade-slide-up ml-4">
                            CLARITY
                        </h1>
                        <h2 className="text-3xl font-bold text-secondary uppercase tracking-[0.3em] font-sans">
                            Context First Workflow Tracker
                        </h2>
                        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto leading-loose text-center">
                            The definitive environment for high-fidelity execution. Trace every action back to its strategic intent and record the reasoning behind every critical decision.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-200">
                        <Link to="/login">
                            <Button className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-slate-800 hover:scale-105 transition-all">
                                ACCESS WORKSPACE
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-12 animate-bounce opacity-30">
                    <div className="w-px h-12 bg-slate-400 mx-auto" />
                </div>
            </section>

            {/* 2. FEATURES / TRACEABILITY SECTION */}
            <section className="snap-section min-h-screen flex flex-col items-center justify-center py-32 px-10 bg-white">
                <div className="max-w-7xl mx-auto w-full space-y-24">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Proprietary Framework</span>
                        <h3 className="text-6xl font-black text-slate-900 tracking-tighter">A NEW DIMENSION OF TRACEABILITY</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Target,
                                label: 'Intentionality',
                                desc: 'Define not just what you are doing, but the core hypothesis behind every move.'
                            },
                            {
                                icon: Activity,
                                label: 'Actionable Context',
                                desc: 'Embedded reasoning layers ensure that no task is performed without justified purpose.'
                            },
                            {
                                icon: CheckCircle,
                                label: 'Validated Outcomes',
                                desc: 'Close the execution gap with formal reflections and outcome validation.'
                            }
                        ].map((feature, i) => (
                            <div key={i} className={`p-10 bg-white rounded-[40px] border border-slate-100 space-y-8 hover:shadow-2xl hover:shadow-secondary/5 hover:border-secondary/20 transition-all group animate-scale-in delay-${(i + 1) * 100}`}>
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-secondary group-hover:border-secondary transition-all">
                                    <feature.icon className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-tight">{feature.label}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. CTA SECTION - Free-flowing section to allow smooth Footer transition */}
            <section
                className="flex flex-col items-center justify-center text-center px-10 py-40 bg-slate-900 text-white relative overflow-hidden"
            >
                <div className="relative z-10 space-y-12 max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limited Deployment Access</span>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-7xl font-black tracking-tighter leading-[1.1] text-white px-4">
                            Start your journey at <br />
                            <span className="text-secondary">Clarity</span> now.
                        </h2>
                    </div>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Experience the world's most disciplined workflow environment. Join the teams who value "Why" as much as "Done".
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 w-full max-w-lg mx-auto">
                        <Link to="/login" className="w-full">
                            <Button className="w-full h-16 bg-secondary text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-secondary/90 hover:scale-105 transition-all">
                                LOGIN
                            </Button>
                        </Link>
                        <Link to="/register" className="w-full">
                            <Button variant="ghost" className="w-full h-16 text-white bg-white/10 border-2 border-white/10 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white/20 hover:border-white/30 transition-all">
                                REGISTER
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full text-white/0" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full text-white/0" />
            </section>

            {/* 4. FOOTER SECTION - Non-Snapping & Spaced */}
            <section className="bg-white flex flex-col justify-center px-10 md:px-24 pt-40">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-20 py-24 border-t border-slate-100">

                    {/* Brand & Social */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-4">
                            <span className="text-3xl font-black text-slate-900 tracking-normal uppercase">Clarity</span>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                Context First Workflow Tracker
                                <br />
                                <span className="text-[10px] opacity-60">High-Fidelity Intelligence Engine</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {[
                                { ic: Twitter, link: '#' },
                                { ic: Github, link: '#' },
                                { ic: Linkedin, link: '#' },
                                { ic: Globe, link: '#' }
                            ].map((social, i) => (
                                <a key={i} href={social.link} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-secondary hover:bg-secondary/5 hover:border-secondary transition-all border border-slate-100 shadow-sm">
                                    <social.ic className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-2 border-secondary pl-4">Platform</h5>
                            <ul className="space-y-4 pl-4">
                                <li><Link to="/login" className="text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase tracking-widest">Interface</Link></li>
                                <li><Link to="/projects" className="text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase tracking-widest">Containers</Link></li>
                                <li><Link to="/tasks" className="text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase tracking-widest">Execution</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-2 border-slate-200 pl-4">Base Operations</h5>
                            <ul className="space-y-4 pl-4">
                                <li><span className="text-xs text-slate-400 font-bold uppercase tracking-widest opacity-40 italic">v1.2.4-STABLE</span></li>
                                <li><span className="text-xs text-slate-400 font-bold uppercase tracking-widest opacity-40">Latency: 14ms</span></li>
                                <li><span className="text-xs text-slate-400 font-bold uppercase tracking-widest opacity-40">Nodes: 06</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Operational Map */}
                    <div className="lg:col-span-4">
                        <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 space-y-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Operational Status</h5>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-green-600 uppercase">Secure</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Command Center</h5>
                                    <p className="text-xs font-bold text-slate-900 leading-relaxed">Intelligence Station One, Palo Alto, Strategic Zone Alpha</p>
                                </div>
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl">
                                    <p className="text-[10px] font-bold text-slate-900 opacity-30 uppercase tracking-tighter">System Hash</p>
                                    <p className="text-[10px] font-mono text-secondary break-all">CL-992-BX-INTENT-44</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Protocol */}
                <div className="pb-20 text-center border-t border-slate-50 pt-20">
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                            <Link to="/terms" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.1em] hover:text-slate-900 transition-colors">Terms of Protocol</Link>
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            <Link to="/faq" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.1em] hover:text-slate-900 transition-colors">Intelligence Brief</Link>
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            <Link to="/privacy" className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.1em] hover:text-slate-900 transition-colors">Privacy Shield</Link>
                        </div>
                        <div className="space-y-4">
                            <div className="h-px w-64 bg-slate-100 mx-auto" />
                            <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-loose">
                                &copy; {new Date().getFullYear()} CLARITY BUREAU
                                <br />
                                <span className="text-slate-900 text-xs tracking-[0.1em]">ALL RIGHTS RESERVED</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
