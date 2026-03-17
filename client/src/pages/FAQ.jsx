import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

const FAQ = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const sections = [
        {
            category: 'Getting Started',
            items: [
                {
                    q: 'What is Clarity?',
                    a: 'Clarity is a context-first workflow tracker for teams. It connects projects, tickets, workflows, and releases into a single pipeline — so every piece of work traces back to the strategic decision that started it.'
                },
                {
                    q: 'How do I create a workspace?',
                    a: 'Register for an account and choose "Create Organization" during onboarding. You\'ll set your org name, industry, and team size. After that, you can invite members and start creating projects.'
                },
                {
                    q: 'Can I use Clarity without an organization?',
                    a: 'Yes. During registration, choose "Continue Solo" to use Clarity as an individual. You can create an organization later from the settings page.'
                }
            ]
        },
        {
            category: 'Projects & Workflows',
            items: [
                {
                    q: 'How are projects and tickets related?',
                    a: 'Projects are containers for related work. Each project holds tickets (tasks), and those tickets can be connected to workflows for execution logic and to releases for deployment tracking.'
                },
                {
                    q: 'What can I do with the workflow canvas?',
                    a: 'The workflow canvas lets you design visual execution flows using nodes and edges. You can create branching logic, parallel paths, conditional gates, and connect them to specific projects for automated tracking.'
                },
                {
                    q: 'Why can\'t I edit a project after linking tickets?',
                    a: 'Clarity enforces data integrity by making parent records read-only once downstream records exist. This ensures outcomes are measured against their original context and prevents rewriting history.'
                }
            ]
        },
        {
            category: 'Releases & Deployment',
            items: [
                {
                    q: 'What is a release in Clarity?',
                    a: 'A release bundles completed work into a deployable package. You can freeze scope, add projects, run verification gates, and deploy to staging or production — all tracked within the release timeline.'
                },
                {
                    q: 'What does "Halt Pipeline" do?',
                    a: 'Halt Pipeline is an emergency brake that stops a release from progressing. It changes the release status to HALTED, preventing any deployments until the issue is investigated and resolved.'
                },
                {
                    q: 'Can I deploy a release to different environments?',
                    a: 'Yes. The Deploy Release modal lets you choose between Staging and Production environments. You\'ll need to confirm the action by typing the project name to prevent accidental deployments.'
                }
            ]
        },
        {
            category: 'Account & Security',
            items: [
                {
                    q: 'How is my workspace secured?',
                    a: 'Clarity uses role-based access control (RBAC) and secure session tokens. Every action in your workspace is tied to your user identity, creating a full audit trail.'
                },
                {
                    q: 'What roles are available?',
                    a: 'The roles are: Intern, Member, Manager, Admin, and Founder. Each role has different permissions — for example, only Founders and Admins can manage organization settings and invite new members.'
                },
                {
                    q: 'Can I delete a project or release?',
                    a: 'Projects and releases can be archived but not deleted. Clarity preserves all records for traceability — even archived items remain accessible for historical reference and analytics.'
                }
            ]
        }
    ];

    // Flatten for accordion indexing
    let flatIndex = 0;

    return (
        <div className="min-h-screen bg-white animate-fade-slide-up">
            <Navbar />

            <main className="pt-28 pb-20 px-8 md:px-20 max-w-4xl mx-auto">
                {/* Back */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-10 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="space-y-3 mb-14">
                    <span className="text-[10px] font-medium text-secondary uppercase tracking-[0.4em]">Help Center</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm text-slate-500 font-normal">
                        Everything you need to know about using Clarity.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-12">
                    {sections.map((section, si) => (
                        <div key={si} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{section.category}</h2>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>

                            <div className="space-y-2">
                                {section.items.map((item, qi) => {
                                    const idx = `${si}-${qi}`;
                                    const isOpen = openIndex === idx;
                                    return (
                                        <div key={qi} className="border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                                className="w-full flex items-center justify-between p-5 text-left group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <HelpCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                                                    <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isOpen && (
                                                <div className="px-5 pb-5 pl-12">
                                                    <p className="text-sm text-slate-600 font-normal leading-relaxed">{item.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 p-8 bg-slate-900 rounded-2xl text-center space-y-4">
                    <h2 className="text-xl font-bold text-white">Still have questions?</h2>
                    <p className="text-sm text-slate-400 font-normal">
                        Our team is here to help. Reach out and we'll get back to you as soon as possible.
                    </p>
                    <a href="mailto:support@clarity.dev" className="inline-flex items-center gap-2 h-10 px-6 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors">
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </a>
                </div>
            </main>

            <footer className="py-8 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-normal">
                    &copy; {new Date().getFullYear()} Clarity - Context First Workflow Architecture
                </p>
            </footer>
        </div>
    );
};

export default FAQ;
