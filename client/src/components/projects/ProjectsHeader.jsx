import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronDown, ListFilter, Settings, LayoutGrid, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const ProjectsHeader = ({ onSearch, currentTeam, onTeamChange, onCreateProject, availableTeams = [], onShowAllUnits, showCreateButton }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Logic: Only show 'All Units' if count > 10. 
    // If <= 10, just show the specific units.
    const showAllUnitsOption = availableTeams.length > 10;
    const teamsToDisplay = availableTeams.slice(0, 10);

    return (
        <div className="space-y-4 animate-fade-in relative z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase flex items-center gap-3"><FolderKanban className="w-8 h-8 text-secondary" />Projects</h1>
                    <div className="hidden lg:flex items-center gap-2 pt-1">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Bureau</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="h-11 w-full px-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:border-secondary/20 transition-all group"
                            >
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Execution Unit</span>
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest truncate max-w-[120px]">
                                        {currentTeam === 'All Units' ? 'Overview' : currentTeam}
                                    </span>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-secondary transition-all ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in max-h-60 overflow-y-auto custom-scrollbar">
                                        <button
                                            onClick={() => {
                                                onTeamChange('All Units');
                                                setIsMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mb-1 ${currentTeam === 'All Units' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <LayoutGrid className={`w-3 h-3 ${currentTeam === 'All Units' ? 'text-white' : 'text-secondary'}`} />
                                                Full Overview
                                            </div>
                                        </button>

                                        <div className="h-px bg-slate-50 my-1" />

                                        {teamsToDisplay.map(team => (
                                            <button
                                                key={team}
                                                onClick={() => {
                                                    onTeamChange(team);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${currentTeam === team ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                                            >
                                                {team}
                                            </button>
                                        ))}

                                        {showAllUnitsOption && (
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    onShowAllUnits();
                                                }}
                                                className="w-full text-center px-5 py-3 mt-1 bg-slate-50 rounded-xl text-[9px] font-bold text-secondary uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
                                            >
                                                View All Units ({availableTeams.length})
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {showCreateButton && (
                            <Button
                                onClick={onCreateProject}
                                className="h-11 bg-slate-900 text-white rounded-xl px-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5 text-secondary" />
                                Create Project
                            </Button>
                        )}
                    </div>

                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search strategic projects..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full h-12 bg-white border border-slate-100 rounded-xl pl-12 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-secondary/30 transition-all shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectsHeader;
