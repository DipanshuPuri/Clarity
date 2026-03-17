import React from 'react';
import Navbar from '../components/ui/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, FileText, Users, AlertTriangle } from 'lucide-react';

const Terms = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Shield,
            title: 'Acceptance of Terms',
            content: 'By accessing or using Clarity, you agree to be bound by these terms. Clarity is a workflow tracking platform — all actions you take within your workspace are logged for traceability and linked to your user profile.'
        },
        {
            icon: Lock,
            title: 'Data Integrity',
            content: 'Clarity enforces a context-first hierarchy to maintain data integrity. Once downstream records are created (e.g., tickets linked to a project, or releases referencing a workflow), parent records become read-only. This is by design and ensures that outcomes are always measured against their original context.'
        },
        {
            icon: FileText,
            title: 'Acceptable Use',
            content: 'Clarity is built for professional teams managing real projects and releases. You agree not to misuse the platform to distribute harmful content, circumvent access controls, or tamper with audit trails. Violations may result in account suspension.'
        },
        {
            icon: Users,
            title: 'Organization Accounts',
            content: 'When you create or join an organization, you grant other members visibility into shared projects, workflows, and releases within that organization. Organization founders and admins can manage member access and roles.'
        },
        {
            icon: AlertTriangle,
            title: 'Limitation of Liability',
            content: 'Clarity is provided on an "as is" basis. While we strive for high availability and data accuracy, we do not guarantee uninterrupted service. We are not liable for any indirect damages arising from your use of the platform.'
        }
    ];

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
                    <span className="text-[10px] font-medium text-secondary uppercase tracking-[0.4em]">Legal</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Terms & Conditions
                    </h1>
                    <p className="text-sm text-slate-500 font-normal">
                        Last updated: February 11, 2026
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 hover:border-slate-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                    <section.icon className="w-4 h-4 text-secondary" />
                                </div>
                                <h2 className="text-sm font-bold text-slate-900">{`${String(i + 1).padStart(2, '0')}. ${section.title}`}</h2>
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-relaxed pl-11">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-400 font-normal mt-10 pt-6 border-t border-slate-100">
                    Clarity - Context First Workflow Architecture reserves the right to update these terms as the platform evolves. Continued use of Clarity constitutes acceptance of any changes.
                </p>
            </main>

            <footer className="py-8 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-normal">
                    &copy; {new Date().getFullYear()} Clarity - Context First Workflow Architecture
                </p>
            </footer>
        </div>
    );
};

export default Terms;
