import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, GitBranch, Rocket, BarChart3, ArrowRight, ChevronRight, Layers, ShieldCheck, Lock, Eye, Github, Globe, Linkedin, Twitter } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/ui/Navbar';

const Home = () => {

    return (
        <div className="bg-white overflow-x-hidden">
            <Navbar />

            {/* ═══════════════════════════════════════════
                PANEL 1 — HERO (Dark, unique background)
            ═══════════════════════════════════════════ */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 relative overflow-hidden bg-slate-900 pt-16">
                {/* Full repeating pattern background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

                    {/* Premium Hexagonal Dot Matrix Pattern - Inverse Mask (Hidden in center, visible on edges) */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `radial-gradient(ellipse at center, rgba(15,23,42,1) 0%, rgba(15,23,42,1) 40%, rgba(15,23,42,0) 95%), url("data:image/svg+xml,%3Csvg width='60' height='103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='rgba(255,255,255,0.45)'%3E%3Ccircle cx='30' cy='25.98' r='1.5'/%3E%3Ccircle cx='0' cy='77.94' r='1.5'/%3E%3Ccircle cx='60' cy='77.94' r='1.5'/%3E%3Ccircle cx='30' cy='103.92' r='1.5'/%3E%3Ccircle cx='0' cy='25.98' r='1.5'/%3E%3Ccircle cx='60' cy='25.98' r='1.5'/%3E%3C/g%3E%3Cg stroke='rgba(255,255,255,0.22)' stroke-width='1'%3E%3Cpath d='M30 25.98 L60 77.94'/%3E%3Cpath d='M30 25.98 L0 77.94'/%3E%3Cpath d='M0 25.98 L30 77.94'/%3E%3Cpath d='M60 25.98 L30 77.94'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat',
                            backgroundSize: '100% 100%, 60px 103.923px',
                            backgroundPosition: 'center center, center center'
                        }}
                    />

                    {/* Secondary macro-grid overlay - Inverse Mask */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `radial-gradient(ellipse at center, rgba(15,23,42,1) 0%, rgba(15,23,42,1) 45%, rgba(15,23,42,0) 100%), url("data:image/svg+xml,%3Csvg width='240' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='240' height='240' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1.5'/%3E%3Ccircle cx='0' cy='0' r='2.5' fill='rgba(255,255,255,0.3)'/%3E%3Ccircle cx='240' cy='0' r='2.5' fill='rgba(255,255,255,0.3)'/%3E%3Ccircle cx='0' cy='240' r='2.5' fill='rgba(255,255,255,0.3)'/%3E%3Ccircle cx='240' cy='240' r='2.5' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat',
                            backgroundSize: '100% 100%, 240px 240px',
                            backgroundPosition: 'center center, center center'
                        }}
                    />

                    {/* Ambient glow behind text area */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-secondary/[0.06] blur-[160px]" />

                    {/* Corner bracket accents */}
                    <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-white/[0.12] rounded-tl-sm" />
                    <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-white/[0.12] rounded-tr-sm" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-white/[0.12] rounded-bl-sm" />
                    <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-white/[0.12] rounded-br-sm" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="space-y-6 mb-10">
                        <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] font-black text-white tracking-wide leading-[0.85] select-none">
                            CLARITY
                        </h1>
                        <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-[0.6em] block opacity-90 mt-4">
                            Context-First Workflow Architecture
                        </span>
                        <p className="text-lg md:text-xl text-slate-400 font-normal max-w-xl mx-auto leading-relaxed mt-8">
                            Organize projects, orchestrate workflows, ship releases, and track what matters — all with full traceability from intent to outcome.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login">
                            <button className="h-12 px-8 bg-secondary text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-secondary/90 transition-all flex items-center gap-2 group">
                                Open Workspace
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="h-12 px-8 bg-slate-900 text-white border border-slate-700 rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 hover:border-slate-600 transition-all">
                                Create Account
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 animate-bounce opacity-20">
                    <div className="w-px h-10 bg-white mx-auto" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 2 — HOW IT WORKS (Light)
            ═══════════════════════════════════════════ */}
            <section className="min-h-screen flex flex-col items-center justify-center py-28 px-8 bg-slate-50">
                <div className="max-w-6xl mx-auto w-full space-y-20">
                    <div className="text-center space-y-3">
                        <span className="text-[10px] font-medium text-secondary uppercase tracking-[0.4em]">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            The Execution Chain
                        </h2>
                        <p className="text-base text-slate-500 font-normal max-w-lg mx-auto leading-relaxed">
                            Every deliverable in Clarity moves through a structured pipeline — from project scoping to production deployment.
                        </p>
                    </div>

                    {/* Workflow Steps */}
                    <div className="flex items-stretch justify-center gap-0">
                        {[
                            {
                                label: 'Projects',
                                desc: 'Group related work into strategic containers. Define objectives, assign ownership, and track progress across tickets.',
                                icon: FolderKanban
                            },
                            {
                                label: 'Workflows',
                                desc: 'Design visual execution flows with branching logic, parallel paths, and conditional gates using the node-based canvas.',
                                icon: GitBranch
                            },
                            {
                                label: 'Releases',
                                desc: 'Bundle completed work into deployable releases. Freeze scope, run verification gates, and orchestrate deployments.',
                                icon: Rocket
                            },
                            {
                                label: 'Analytics',
                                desc: 'Measure velocity, track release health, monitor team capacity, and surface insights across the entire pipeline.',
                                icon: BarChart3
                            }
                        ].map((node, i, arr) => (
                            <React.Fragment key={i}>
                                <div className="group flex-1 max-w-[260px]">
                                    <div className="h-full p-6 bg-white rounded-2xl border border-slate-200 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                        <div className="space-y-4">
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                                                <node.icon className="w-5 h-5 text-secondary" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-bold text-slate-900 tracking-tight">{node.label}</h4>
                                                <p className="text-xs text-slate-500 font-normal leading-relaxed">{node.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {i < arr.length - 1 && (
                                    <div className="flex items-center justify-center w-10 flex-shrink-0">
                                        <ChevronRight className="w-5 h-5 text-slate-300" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 3 — CORE PRINCIPLES (Dark)
            ═══════════════════════════════════════════ */}
            <section className="min-h-screen flex flex-col items-center justify-center py-28 px-8 bg-slate-900 relative overflow-hidden">
                {/* Subtle background accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/3 blur-[120px] rounded-full" />

                <div className="max-w-6xl mx-auto w-full space-y-16 relative z-10">
                    <div className="text-center space-y-3">
                        <span className="text-[10px] font-medium text-secondary uppercase tracking-[0.4em]">Built Different</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Why Teams Choose Clarity
                        </h2>
                        <p className="text-base text-slate-400 font-normal max-w-lg mx-auto leading-relaxed">
                            Every design decision in Clarity is deliberate. Here's what sets it apart from conventional project trackers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Layers,
                                title: 'Unified Pipeline',
                                desc: 'Projects, tickets, workflows, and releases live in one connected system. No context-switching between disconnected tools — every piece of work traces back to its strategic origin.',
                                accent: 'from-secondary/20 to-secondary/5'
                            },
                            {
                                icon: Lock,
                                title: 'Scope Control',
                                desc: 'Release scope freezes lock what ships. Verification gates ensure nothing goes to production without passing readiness checks. Halt Pipeline gives you an emergency brake when things go wrong.',
                                accent: 'from-amber-500/20 to-amber-500/5'
                            },
                            {
                                icon: Eye,
                                title: 'Full Visibility',
                                desc: 'Dependency graphs show how releases connect. Risk telemetry flags blockers before they derail timelines. Role-based dashboards give every team member exactly the context they need.',
                                accent: 'from-blue-500/20 to-blue-500/5'
                            }
                        ].map((principle, i) => (
                            <div key={i} className="group p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${principle.accent} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10 space-y-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <principle.icon className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h5 className="text-sm font-bold text-white tracking-tight">{principle.title}</h5>
                                    <p className="text-xs text-slate-400 font-normal leading-relaxed">{principle.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 4 — CTA (Light)
            ═══════════════════════════════════════════ */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-white relative overflow-hidden">
                <div className="relative z-10 space-y-8 max-w-3xl">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
                            Ready to bring<br />
                            <span className="text-secondary">clarity</span> to your workflow?
                        </h2>
                    </div>
                    <p className="text-slate-500 text-lg font-normal leading-relaxed max-w-xl mx-auto">
                        Stop losing context between tools. Clarity gives your team one connected environment to plan, build, and ship — with every decision traceable.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/login">
                            <button className="h-12 px-8 bg-secondary text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-secondary/90 transition-all flex items-center gap-2 group">
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="h-12 px-8 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-all">
                                Create Account
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Subtle background */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-slate-100/80 blur-[150px] rounded-full" />
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 5 — FOOTER (Dark)
            ═══════════════════════════════════════════ */}
            <footer className="bg-slate-900 text-white px-8 md:px-16 pt-20 pb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">

                        {/* Brand */}
                        <div className="lg:col-span-4 space-y-5">
                            <div className="space-y-2">
                                <span className="text-xl font-bold text-white tracking-tight">Clarity</span>
                                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                                    Context-first workflow tracker for teams who<br />value traceability as much as delivery.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {[
                                    { ic: Twitter, link: '#' },
                                    { ic: Github, link: '#' },
                                    { ic: Linkedin, link: '#' },
                                    { ic: Globe, link: '#' }
                                ].map((social, i) => (
                                    <a key={i} href={social.link} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-secondary hover:border-secondary/30 transition-all">
                                        <social.ic className="w-3.5 h-3.5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="lg:col-span-3 space-y-4">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</h5>
                            <ul className="space-y-3">
                                <li><Link to="/login" className="text-sm text-slate-500 font-normal hover:text-white transition-colors">Dashboard</Link></li>
                                <li><Link to="/login" className="text-sm text-slate-500 font-normal hover:text-white transition-colors">Projects</Link></li>
                                <li><Link to="/login" className="text-sm text-slate-500 font-normal hover:text-white transition-colors">Workflows</Link></li>
                                <li><Link to="/login" className="text-sm text-slate-500 font-normal hover:text-white transition-colors">Releases</Link></li>
                            </ul>
                        </div>

                        {/* System Status */}
                        <div className="lg:col-span-5">
                            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-5">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</h5>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Operational</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-white">v1.2.4</p>
                                        <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Stable Build</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-white">14ms</p>
                                        <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Avg Latency</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-white">06</p>
                                        <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Active Nodes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-600 font-normal">
                            &copy; {new Date().getFullYear()} Clarity - Context First Workflow Architecture. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link to="/terms" className="text-xs text-slate-600 font-normal hover:text-slate-300 transition-colors">Terms</Link>
                            <Link to="/privacy" className="text-xs text-slate-600 font-normal hover:text-slate-300 transition-colors">Privacy</Link>
                            <Link to="/faq" className="text-xs text-slate-600 font-normal hover:text-slate-300 transition-colors">Help</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
