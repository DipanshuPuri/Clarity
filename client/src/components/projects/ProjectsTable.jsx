import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, Ticket } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        'Live': 'bg-green-50 text-green-600 border-green-100',
        'Ongoing': 'bg-blue-50 text-blue-600 border-blue-100',
        'Starts Soon': 'bg-purple-50 text-purple-600 border-purple-100',
        'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
        'Completed': 'bg-slate-50 text-slate-600 border-slate-200'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${styles[status] || styles.Ongoing}`}>
            {status}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const styles = {
        'Critical': 'text-red-500',
        'High': 'text-orange-500',
        'Medium': 'text-blue-500',
        'Low': 'text-slate-400',
        'Zero': 'text-slate-300'
    };

    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${priority === 'Critical' ? 'bg-red-500 animate-pulse' : priority === 'High' ? 'bg-orange-500' : 'bg-slate-300'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${styles[priority] || 'text-slate-400'}`}>
                {priority}
            </span>
        </div>
    );
};

const ProjectsTable = ({ projects }) => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = React.useState({ key: 'lastUpdated', direction: 'desc' });

    const sortedProjects = [...projects].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Set fallback custom metrics
        if (sortConfig.key === 'contributors') {
            aValue = a.members?.length || 0;
            bValue = b.members?.length || 0;
        }

        // Handle numeric values
        if (sortConfig.key === 'budget' || sortConfig.key === 'contributors' || sortConfig.key === 'tickets') {
            aValue = Number(aValue);
            bValue = Number(bValue);
        }

        // Handle dates
        if (sortConfig.key === 'deadline' || sortConfig.key === 'createdAt' || sortConfig.key === 'lastUpdated') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const Header = ({ label, sortKey, align = 'left' }) => (
        <th
            onClick={() => requestSort(sortKey)}
            className={`px-4 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-slate-900 transition-colors group whitespace-nowrap ${align === 'center' ? 'text-center' : ''}`}
        >
            <div className={`flex items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
                {label}
                <div className={`flex flex-col opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig.key === sortKey ? 'opacity-100' : ''}`}>
                    <ChevronRight className={`w-2.5 h-2.5 -rotate-90 transition-colors ${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-secondary' : 'text-slate-300'}`} />
                    <ChevronRight className={`w-2.5 h-2.5 rotate-90 transition-colors ${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-secondary' : 'text-slate-300'}`} />
                </div>
            </div>
        </th>
    );

    return (
        <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm animate-fade-slide-up">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <Header label="Project" sortKey="name" />
                            <Header label="Budget" sortKey="budget" />
                            <Header label="Deadline" sortKey="deadline" />
                            <Header label="Status" sortKey="status" />
                            <Header label="Created" sortKey="createdAt" />
                            <Header label="Last Update" sortKey="lastUpdated" />
                            <Header label={
                                <div className="flex flex-col items-center">
                                    <Users className="w-3 h-3" />
                                    <span className="text-[7px] mt-1">Units</span>
                                </div>
                            } sortKey="contributors" align="center" />
                            <Header label={
                                <div className="flex flex-col items-center">
                                    <Ticket className="w-3 h-3" />
                                    <span className="text-[7px] mt-1">Tickets</span>
                                </div>
                            } sortKey="tickets" align="center" />
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedProjects.map((project) => (
                            <tr
                                key={project.id}
                                onClick={() => navigate(`/app/projects/${project.id}`)}
                                className={`group hover:bg-slate-50/50 border-b border-slate-50 cursor-pointer transition-all duration-300 ${project.status === 'Completed' ? 'opacity-60 grayscale-[0.3]' : ''}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-3">
                                            <p className={`text-[13px] font-bold text-slate-900 group-hover:text-secondary transition-colors whitespace-nowrap ${project.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                                                {project.name}
                                            </p>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex-shrink-0">
                                                ID: {project.id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.15em]">{project.team} Unit</span>
                                            <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{project.problemStatement}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="text-[11px] font-bold text-slate-900 tabular-nums">
                                        ${project.budget?.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <StatusBadge status={project.status} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {new Date(project.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-0.5">
                                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${project.lastUpdated ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {new Date(project.lastUpdated || project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-center whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-slate-900 bg-slate-50 w-7 h-7 flex items-center justify-center rounded-lg mx-auto border border-slate-100 tabular-nums">
                                        {project.members?.length || 0}
                                    </span>
                                </td>
                                <td className="px-3 py-4 text-center whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-slate-900 bg-slate-50 w-7 h-7 flex items-center justify-center rounded-lg mx-auto border border-slate-100 tabular-nums">
                                        {Array.isArray(project.tickets) ? project.tickets.length : (project.tickets || 0)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-200 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsTable;
