import React from 'react';
import { Target, Calendar, BarChart3, Users, Settings, Plus, Clock, Activity } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const ProjectDetailHeader = ({ project, onAddTicket, onAddContributor, canEdit, onEdit, onDelete, onUpdateStatus }) => {
    const navigate = useNavigate();

    if (!project) return null;

    // Calculate progress
    const completed = project.tickets?.filter(t => t.status === 'Done').length || 0;
    const total = project.tickets?.length || 0;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const isCompleted = project.status === 'Completed';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Context Navigation */}
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-secondary cursor-pointer transition-colors" onClick={() => navigate('/app/projects')}>Projects</span>
                <span className="text-slate-200">/</span>
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{project.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="space-y-6 flex-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-3 py-1 border rounded-full text-[9px] font-bold uppercase tracking-widest ${isCompleted ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {project.status}
                                </span>
                                <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                                    {project.priority} Priority
                                </span>
                            </div>
                        </div>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-3xl italic font-serif">
                            "{project.problemStatement}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-3xl">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <BarChart3 className="w-2.5 h-2.5 text-secondary" /> Budget
                            </div>
                            <p className="text-[13px] font-bold text-slate-900">${project.budget?.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Calendar className="w-2.5 h-2.5 text-secondary" /> Deadline
                            </div>
                            <p className="text-[13px] font-bold text-slate-900">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Users className="w-2.5 h-2.5 text-secondary" /> Team Size
                            </div>
                            <p className="text-[13px] font-bold text-slate-900">{project.members?.length || 0} Units</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Target className="w-2.5 h-2.5 text-secondary" /> Flow List
                            </div>
                            <p className="text-[13px] font-bold text-slate-900">{total} Tickets</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Clock className="w-2.5 h-2.5 text-secondary" /> Updated
                            </div>
                            <p className="text-[13px] font-bold text-slate-900">{new Date(project.lastUpdated || project.updatedAt || new Date()).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Activity className="w-2.5 h-2.5 text-secondary" /> Created
                            </div>
                            <p className="text-[13px] font-bold text-slate-900">{new Date(project.createdAt || new Date()).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[240px]">
                    <Button onClick={onAddTicket} className="h-14 bg-secondary text-white rounded-2xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-secondary/10 hover:scale-105 active:scale-95 transition-all w-full">
                        <Plus className="w-4 h-4" />
                        Create Ticket
                    </Button>

                    <Button
                        onClick={() => navigate(`/app/workflow?projectId=${project.id}`)}
                        variant="secondary"
                        className="h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:border-secondary/20 transition-all w-full"
                    >
                        <Activity className="w-3.5 h-3.5 mr-2" />
                        Workflows
                    </Button>

                    {canEdit && (
                        <>
                            <Button
                                onClick={() => onEdit()}
                                variant="secondary"
                                className="h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:border-secondary/20 transition-all w-full"
                            >
                                <Settings className="w-3.5 h-3.5 mr-2" />
                                Edit Settings
                            </Button>

                            <Button
                                onClick={() => onDelete(project.id)}
                                className="h-12 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all w-full"
                            >
                                Delete Project
                            </Button>

                            <Button
                                onClick={() => onUpdateStatus(project.id, { status: isCompleted ? 'Ongoing' : 'Completed' })}
                                className={`h-12 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all w-full ${isCompleted ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95'}`}
                            >
                                {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailHeader;
