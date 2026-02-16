import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { BarChart3, ShieldCheck, PieChart, TrendingUp, Search, Info } from 'lucide-react';

/**
 * Reports - Intelligence Analytics Station
 */
const Reports = () => {
    return (
        <div className="animate-in fade-in duration-500 min-h-full -m-6 p-6 md:p-10 bg-white animate-fade-slide-up">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/10">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Insight Layer</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Intelligence Ledger</h1>
                    <p className="text-sm text-slate-500 font-medium max-w-md italic font-serif">
                        Meta-analysis of outcomes, strategy efficacy, and learning loop compliance.
                    </p>
                </div>

                <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                    <Search className="w-4 h-4 text-slate-400" />
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest cursor-pointer hover:text-secondary transition-colors">Generate Reflection PDF</span>
                </div>
            </div>

            {/* Empty State / Operational View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* Visual Placeholder */}
                <div className="lg:col-span-8">
                    <div className="py-32 flex flex-col items-center text-center bg-[#fbfcfd] border-2 border-dashed border-slate-100 rounded-[64px]">
                        <div className="p-8 bg-white rounded-full border border-slate-100 shadow-sm mb-10 relative">
                            <BarChart3 className="w-12 h-12 text-slate-200" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center border border-secondary/20">
                                <Info className="w-3 h-3 text-secondary" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Intelligence Engine Calibrating</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium mb-10">
                            The reporting engine is currently indexing project outcomes to generate cross-intent insights.
                        </p>
                    </div>
                </div>

                {/* Sidebar Metrics */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-10 bg-slate-900 rounded-[48px] text-white space-y-10 shadow-2xl shadow-slate-900/10">
                        <div>
                            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 block">System Pulse</h4>
                            <p className="text-3xl font-extrabold tracking-tight">Loop Integrity: 100%</p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Hypothesis</span>
                                <span className="text-sm font-bold">12</span>
                            </div>
                            <div className="h-px bg-slate-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Decision Density</span>
                                <span className="text-sm font-bold">4.2 / Intent</span>
                            </div>
                            <div className="h-px bg-slate-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</span>
                                <span className="text-sm font-bold text-secondary">78.4%</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning Ledger</p>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Historical Compliance: Verified</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Reports;
