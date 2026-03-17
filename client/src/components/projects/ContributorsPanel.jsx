import React from 'react';
import { Users, UserPlus } from 'lucide-react';

const ContributorsPanel = ({ contributors, onAssign }) => {
    return (
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6 animate-fade-in h-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" />
                    <h3 className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em]">Project Team</h3>
                </div>
            </div>

            <div className="space-y-4">
                {contributors.length === 0 ? (
                    <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No team members</p>
                    </div>
                ) : (
                    contributors.map((member, i) => (
                        <div key={i} className="flex items-center gap-3 group cursor-pointer">
                            {member.profilePicture ? (
                                <img src={member.profilePicture} className="w-8 h-8 rounded-lg border border-slate-50 transition-transform group-hover:scale-105" alt="" />
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white shadow-sm transition-transform group-hover:scale-105">
                                    {member.firstName?.[0] || member.email?.[0]}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-900 group-hover:text-secondary transition-colors truncate">{member.firstName} {member.lastName}</p>
                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-widest">{member.role}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={onAssign}
                className="w-full h-9 border border-dashed border-slate-200 rounded-lg flex items-center justify-center gap-2 hover:border-secondary/30 hover:bg-slate-50/50 transition-all group"
            >
                <UserPlus className="w-3 h-3 text-slate-300 group-hover:text-secondary" />
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-secondary uppercase tracking-widest">Assign Member</span>
            </button>
        </div>
    );
};

export default ContributorsPanel;
