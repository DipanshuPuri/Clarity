import React from 'react';
import Navbar from '../components/ui/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Fingerprint, ShieldCheck, EyeOff, Database, Globe } from 'lucide-react';

const Privacy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Fingerprint,
            title: 'Information We Collect',
            content: 'When you create an account, we collect your name, email address, and role. When you use Clarity, we log workspace activity — projects created, tickets updated, workflows modified, and releases deployed — to maintain an accurate audit trail.'
        },
        {
            icon: ShieldCheck,
            title: 'How We Protect Your Data',
            content: 'All data is transmitted over encrypted connections. Sessions are authenticated using secure tokens with role-based access control (RBAC). We follow industry-standard practices for credential storage and never store passwords in plain text.'
        },
        {
            icon: Database,
            title: 'Data Ownership',
            content: 'Your workspace data belongs to you. We do not sell, rent, or share your project data, workflows, or release history with third parties. Organization data is accessible only to members of that organization based on their assigned roles.'
        },
        {
            icon: EyeOff,
            title: 'Minimal Data Collection',
            content: 'We follow the principle of least privilege. Only metadata necessary for platform functionality — such as timestamps, user IDs, and action types — is processed for analytics. Internal project details and ticket content remain private to your organization.'
        },
        {
            icon: Globe,
            title: 'Cookies & Analytics',
            content: 'Clarity uses essential cookies for session management and authentication. We do not use third-party advertising trackers. Anonymous usage analytics may be collected to improve platform performance and user experience.'
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
                    <span className="text-[10px] font-medium text-secondary uppercase tracking-[0.4em]">Security</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Privacy Policy
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
                    Clarity - Context First Workflow Architecture is committed to protecting your privacy. If you have questions about our data practices, please reach out to our team.
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

export default Privacy;
