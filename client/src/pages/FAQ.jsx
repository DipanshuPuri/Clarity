import React from 'react';
import { HelpCircle, ChevronRight, Target, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';

/**
 * FAQ - Expanded Information Station
 */
const FAQ = () => {
    const navigate = useNavigate();

    const questions = [
        {
            category: 'Core Concepts',
            items: [
                { q: "What is 'Context First' tracking?", a: "Unlike traditional task managers that focus on just lists, Clarity requires an Intent (the Why) and a Decision (the What) before any Task (the How) is initialized. This ensures absolute traceability from action back to strategy." },
                { q: "Why are records immutable?", a: "Once a subsequent layer is created (e.g., a Task is linked to a Decision), the parent record becomes read-only. This maintains architectural integrity and prevents rewriting history, ensuring that outcomes are measured against original, unedited intents." }
            ]
        },
        {
            category: 'Operational Logic',
            items: [
                { q: "How do I close an execution loop?", a: "To mark a Task as DONE, you must first record an Outcome. This Outcome contains a formal reflection on success signals and learnings. Only after this 'post-mortem' is recorded can the task status be finalized." },
                { q: "What role defines an Intent?", a: "Intents are usually defined by MANAGERS who set the strategic directive for a Project Container. OPERATORS then derive granular Execution Units from these intents." }
            ]
        },
        {
            category: 'System Security',
            items: [
                { q: "How is my workspace secured?", a: "Clarity uses Role-Based Access Control (RBAC) and session-encrypted authentication. Every action is traceable to an identity, ensuring accountability within the Intelligence Station." },
                { q: "Can I delete a Project?", a: "Projects can only be archived. Clarity values the learning index of every endeavor; deleting data removes potential institutional intelligence." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white animate-fade-slide-up">
            <Navbar />

            <main className="pt-32 pb-20 px-8 md:px-24 max-w-5xl mx-auto space-y-20">
                <div className="space-y-6">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ml-3 text-slate-400 hover:text-secondary group transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
                    </Button>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Intelligence Brief</span>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            FREQUENTLY ASKED <span className="text-secondary">QUESTIONS</span>
                        </h1>
                    </div>
                </div>

                <div className="space-y-20">
                    {questions.map((section, i) => (
                        <div key={i} className="space-y-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">{section.category}</h2>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {section.items.map((item, j) => (
                                    <div key={j} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4 hover:border-secondary/20 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                                                <HelpCircle className="w-5 h-5 text-secondary" />
                                            </div>
                                            <h3 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight pt-1">
                                                {item.q}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed pl-14">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <section className="bg-slate-900 rounded-[64px] p-16 text-center space-y-8 shadow-2xl shadow-slate-900/10">
                    <Target className="w-12 h-12 text-secondary mx-auto" />
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Still have queries?</h2>
                        <p className="text-slate-400 text-sm font-medium">Contact our base operations for direct mission support.</p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Button className="bg-secondary text-white px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                            Open Comms
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-slate-50 text-center">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} CLARITY BUREAU.
                </p>
            </footer>
        </div>
    );
};

export default FAQ;
