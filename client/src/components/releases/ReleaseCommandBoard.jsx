import React, { useEffect, useState, useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Position, Handle, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import {
    ShieldAlert, CheckCircle2, AlertTriangle, Zap, Clock, Cpu,
    FolderGit2, GitBranch, Ticket, Users, XCircle, ListChecks, UserX,
    X, Calendar, User, ChevronRight, Circle
} from 'lucide-react';

// ─── Dagre Layout ──────────────────────────────
const getLayoutedElements = (nodes, edges) => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 100, marginx: 40, marginy: 40 });

    const sizes = {
        releaseNode: { w: 360, h: 200 },
        checklistNode: { w: 220, h: 56 },
        ticketNode: { w: 220, h: 64 },
        ownerGapNode: { w: 200, h: 56 },
        summaryNode: { w: 200, h: 56 },
    };

    nodes.forEach(n => {
        const s = sizes[n.type] || { w: 200, h: 60 };
        g.setNode(n.id, { width: s.w, height: s.h });
    });
    edges.forEach(e => g.setEdge(e.source, e.target));
    dagre.layout(g);

    nodes.forEach(n => {
        const pos = g.node(n.id);
        const s = sizes[n.type] || { w: 200, h: 60 };
        n.targetPosition = 'top';
        n.sourcePosition = 'bottom';
        n.position = { x: pos.x - s.w / 2, y: pos.y - s.h / 2 };
    });

    return { nodes, edges };
};

// ─── Release Node ──────────────────────────────
const ReleaseNode = ({ data }) => {
    const { release, isSelected } = data;
    const isOverdue = release.targetDateFormatted === 'Overdue' && release.status !== 'DEPLOYED';

    const statusConfig = {
        READY:    { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        FROZEN:   { bg: 'bg-amber-500/15', text: 'text-amber-400', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
        ACTIVE:   { bg: 'bg-blue-500/15', text: 'text-blue-400', icon: <Zap className="w-3.5 h-3.5" /> },
        DEPLOYED: { bg: 'bg-green-500/15', text: 'text-green-300', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    };
    const sc = statusConfig[release.status] || statusConfig.ACTIVE;

    const daysLeft = release.targetDate
        ? Math.ceil((new Date(release.targetDate) - new Date()) / 86400000)
        : null;
    const urgencyClass = daysLeft !== null
        ? daysLeft < 0 ? 'text-red-400' : daysLeft <= 3 ? 'text-amber-400' : 'text-slate-400'
        : 'text-slate-500';

    const ownerInitials = release.releaseOwner
        ? `${release.releaseOwner.firstName?.[0] || ''}${release.releaseOwner.lastName?.[0] || ''}`
        : '??';

    const remainingTickets = (release.tickets || []).filter(t => t.status !== 'Done').length;
    const incompleteChecklists = (release.checklists || []).filter(c => !c.completionState).length;

    return (
        <div className={`w-[360px] bg-gradient-to-br from-slate-900 via-[#0c1222] to-slate-900 border-[1.5px] rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden relative group cursor-pointer
            ${isSelected ? 'border-indigo-500 scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.2)]' : isOverdue ? 'border-red-500/50' : 'border-slate-700/70 hover:border-slate-500'}`}>
            <Handle type="target" position={Position.Top} className="!w-4 !h-1.5 !bg-indigo-500 !rounded-b-md !rounded-t-none !border-none opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className={`px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b border-white/5 ${sc.bg} ${sc.text}`}>
                <span className="flex items-center gap-1.5">{sc.icon}{release.status}</span>
                <span className={`flex items-center gap-1.5 ${urgencyClass} normal-case font-medium tracking-normal`}>
                    <Clock className="w-3 h-3" />
                    {daysLeft !== null ? (daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`) : 'No date'}
                </span>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[13px] font-extrabold text-white leading-tight">{release.name}</h3>
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[9px] font-bold text-indigo-400 border border-white/10 shrink-0">{ownerInitials}</div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Readiness</span>
                        <span className={release.readinessScore > 80 ? 'text-emerald-400' : release.readinessScore > 40 ? 'text-indigo-400' : 'text-amber-400'}>{release.readinessScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div className={`h-full rounded-full transition-all duration-1000 ${release.readinessScore > 80 ? 'bg-emerald-500' : release.readinessScore > 40 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${release.readinessScore}%` }} />
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-400">
                        <FolderGit2 className="w-3 h-3 text-indigo-400" />{release.projects?.length || 0} proj
                    </div>
                    {remainingTickets > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400">
                            <Ticket className="w-3 h-3" />{remainingTickets} remaining
                        </div>
                    )}
                    {incompleteChecklists > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-400">
                            <ListChecks className="w-3 h-3" />{incompleteChecklists} gates
                        </div>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!w-4 !h-1.5 !bg-indigo-500 !rounded-t-md !rounded-b-none !border-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

// ─── Checklist Node ────────────────────────────
const ChecklistNode = ({ data }) => (
    <div className="w-[220px] bg-slate-900 border border-red-500/30 rounded-lg p-2.5 flex items-start gap-2 shadow-md cursor-pointer hover:border-red-500/60 transition-colors">
        <Handle type="target" position={Position.Top} className="!w-2 !h-1 !bg-red-500/50 !rounded-b !rounded-t-none !border-none opacity-0" />
        <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
        <span className="text-[10px] font-bold text-slate-300 leading-tight line-clamp-2">{data.item.title}</span>
    </div>
);

// ─── Ticket Node ───────────────────────────────
const TicketNode = ({ data }) => {
    const { ticket } = data;
    const dotColor = { 'To Do': 'bg-slate-500', 'In Progress': 'bg-blue-500 animate-pulse', 'In Review': 'bg-amber-500' };
    const prioColor = {
        Critical: 'text-red-400 bg-red-500/10 border-red-500/20', High: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        Medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20', Low: 'text-slate-400 bg-slate-700 border-slate-600',
    };
    return (
        <div className="w-[220px] bg-slate-900 border border-slate-700/60 rounded-lg p-2.5 shadow-md cursor-pointer hover:border-indigo-500/50 transition-colors">
            <Handle type="target" position={Position.Top} className="!w-2 !h-1 !bg-amber-500/40 !rounded-b !rounded-t-none !border-none opacity-0" />
            <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${dotColor[ticket.status] || 'bg-slate-500'}`} />
                <div className="flex-1 min-w-0">
                    <h5 className="text-[10px] font-bold text-slate-300 leading-tight line-clamp-2">{ticket.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${prioColor[ticket.priority] || prioColor.Low}`}>{ticket.priority}</span>
                        <span className="text-[8px] font-bold text-slate-600 uppercase">{ticket.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Owner Gap Node ────────────────────────────
const OwnerGapNode = ({ data }) => (
    <div className="w-[200px] bg-slate-900 border border-red-500/25 rounded-lg p-2.5 flex items-center gap-2 shadow-md">
        <Handle type="target" position={Position.Top} className="!w-2 !h-1 !bg-red-500/40 !rounded-b !rounded-t-none !border-none opacity-0" />
        <UserX className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span className="text-[10px] font-bold text-red-300">{data.label} unassigned</span>
    </div>
);

// ─── Summary Node ──────────────────────────────
const SummaryNode = ({ data }) => (
    <div className="w-[200px] bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 flex items-center gap-2 shadow-md">
        <Handle type="target" position={Position.Top} className="!w-2 !h-1 !bg-slate-600 !rounded-b !rounded-t-none !border-none opacity-0" />
        <data.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-[10px] font-bold text-slate-400">{data.label}</span>
    </div>
);

const nodeTypes = { releaseNode: ReleaseNode, checklistNode: ChecklistNode, ticketNode: TicketNode, ownerGapNode: OwnerGapNode, summaryNode: SummaryNode };

const makeEdge = (source, target, opts = {}) => ({
    id: `e-${source}-${target}`,
    source, target, type: 'smoothstep',
    pathOptions: { borderRadius: 16 },
    style: { stroke: '#334155', strokeWidth: 1.5, ...opts.style },
    markerEnd: { type: 'arrowclosed', color: opts.arrowColor || '#475569', width: 10, height: 10 },
    ...opts,
});

// ─── Detail Panel ──────────────────────────────
const DetailPanel = ({ panelData, onClose }) => {
    if (!panelData) return null;

    const { type, data } = panelData;

    return (
        <div className="absolute top-0 right-0 h-full w-[360px] bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 z-20 flex flex-col shadow-2xl animate-in slide-in-from-right-8 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between shrink-0">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    {type === 'release' ? <GitBranch className="w-3.5 h-3.5 text-indigo-500" /> : <Ticket className="w-3.5 h-3.5 text-amber-500" />}
                    {type === 'release' ? 'Release Details' : 'Ticket Details'}
                </h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {type === 'release' && <ReleasePanelContent release={data} />}
                {type === 'ticket' && <TicketPanelContent ticket={data} />}
            </div>
        </div>
    );
};

const ReleasePanelContent = ({ release }) => {
    const daysLeft = release.targetDate ? Math.ceil((new Date(release.targetDate) - new Date()) / 86400000) : null;
    const remaining = (release.tickets || []).filter(t => t.status !== 'Done');
    const done = (release.tickets || []).filter(t => t.status === 'Done');
    const incompleteChecks = (release.checklists || []).filter(c => !c.completionState);
    const completeChecks = (release.checklists || []).filter(c => c.completionState);

    const statusDot = { 'To Do': 'bg-slate-500', 'In Progress': 'bg-blue-500', 'In Review': 'bg-amber-500', 'Done': 'bg-emerald-500' };

    return (
        <>
            {/* Title */}
            <div>
                <h2 className="text-base font-extrabold text-white leading-tight">{release.name}</h2>
                {release.description && <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{release.description}</p>}
            </div>

            {/* Status + Deadline row */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border
                    ${release.status === 'ACTIVE' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                    release.status === 'FROZEN' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    release.status === 'READY' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    {release.status}
                </span>
                <span className={`text-[10px] font-bold flex items-center gap-1 ${daysLeft !== null && daysLeft < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    <Calendar className="w-3 h-3" />
                    {daysLeft !== null ? (daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`) : 'No deadline'}
                </span>
            </div>

            {/* Readiness */}
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Readiness Score</span>
                    <span className={release.readinessScore > 80 ? 'text-emerald-400' : 'text-amber-400'}>{release.readinessScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${release.readinessScore > 80 ? 'bg-emerald-500' : release.readinessScore > 40 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${release.readinessScore}%` }} />
                </div>
            </div>

            {/* Owners */}
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team</h4>
                <div className="space-y-1.5">
                    {[
                        { role: 'Release Owner', user: release.releaseOwner },
                        { role: 'Engineering', user: release.engOwner },
                        { role: 'QA', user: release.qaOwner },
                        { role: 'Deployment', user: release.deployOwner },
                    ].map(({ role, user }) => (
                        <div key={role} className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <span className="text-[10px] font-bold text-slate-500">{role}</span>
                            {user ? (
                                <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] font-bold text-indigo-400 border border-indigo-500/30">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    {user.firstName} {user.lastName}
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-red-400 flex items-center gap-1"><UserX className="w-3 h-3" />Unassigned</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Checklist */}
            {(release.checklists?.length > 0) && (
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verification Gates ({completeChecks.length}/{release.checklists.length})</h4>
                    <div className="space-y-1">
                        {release.checklists.map((cl, i) => (
                            <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${cl.completionState ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                                {cl.completionState ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />}
                                <span className={`text-[10px] font-bold leading-tight ${cl.completionState ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{cl.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remaining Tickets */}
            {remaining.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remaining Tickets ({remaining.length})</h4>
                    <div className="space-y-1">
                        {remaining.map(t => (
                            <div key={t.id} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot[t.status] || 'bg-slate-500'}`} />
                                <span className="text-[10px] font-bold text-slate-300 flex-1 truncate">{t.title}</span>
                                <span className="text-[8px] font-bold text-slate-600 uppercase shrink-0">{t.priority}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Done count */}
            {done.length > 0 && (
                <div className="px-3 py-2 bg-emerald-500/5 rounded-lg border border-emerald-500/15 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-400">{done.length} tickets completed</span>
                </div>
            )}

            {/* Projects */}
            {release.projects?.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Linked Projects</h4>
                    <div className="space-y-1">
                        {release.projects.map(p => (
                            <div key={p.id} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="text-[10px] font-bold text-slate-300 flex-1 truncate">{p.name}</span>
                                <span className="text-[9px] font-bold text-slate-600">{p.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

const TicketPanelContent = ({ ticket }) => {
    const statusDot = { 'To Do': 'bg-slate-500', 'In Progress': 'bg-blue-500', 'In Review': 'bg-amber-500', 'Done': 'bg-emerald-500' };
    const prioColor = {
        Critical: 'text-red-400 bg-red-500/10 border-red-500/20', High: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        Medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20', Low: 'text-slate-400 bg-slate-700 border-slate-600',
    };

    return (
        <>
            <div>
                <h2 className="text-base font-extrabold text-white leading-tight">{ticket.title}</h2>
                {ticket.description && <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{ticket.description}</p>}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDot[ticket.status] || 'bg-slate-500'}`} />
                    <span className="text-[11px] font-bold text-white">{ticket.status}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${prioColor[ticket.priority] || prioColor.Low}`}>
                    {ticket.priority}
                </span>
                {ticket.type && (
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">
                        {ticket.type}
                    </span>
                )}
            </div>

            {/* Metadata */}
            <div className="space-y-1.5">
                {ticket.assignee && (
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-[10px] font-bold text-slate-500">Assignee</span>
                        <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                            <User className="w-3 h-3 text-indigo-400" />
                            {ticket.assignee.firstName} {ticket.assignee.lastName}
                        </span>
                    </div>
                )}
                {ticket.projectId && (
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-[10px] font-bold text-slate-500">Project</span>
                        <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                            <FolderGit2 className="w-3 h-3 text-indigo-400" />
                            {ticket.projectId.substring(0, 8)}...
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── Main Component ────────────────────────────
const ReleaseCommandBoard = ({ releases, selectedReleaseId, onSelectRelease }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [panelData, setPanelData] = useState(null);

    const handleNodeClick = useCallback((e, node) => {
        if (node.type === 'releaseNode') {
            setPanelData({ type: 'release', data: node.data.release });
            onSelectRelease(node.data.release);
        } else if (node.type === 'ticketNode') {
            setPanelData({ type: 'ticket', data: node.data.ticket });
        }
    }, [onSelectRelease]);

    useEffect(() => {
        if (!releases || releases.length === 0) return;

        const withDates = releases
            .filter(r => r.status !== 'DEPLOYED' && r.targetDate)
            .map(r => ({ ...r, _deadline: new Date(r.targetDate) }))
            .sort((a, b) => a._deadline - b._deadline);
        const top5 = withDates.slice(0, 5);
        if (top5.length === 0) return;

        const allNodes = [];
        const allEdges = [];

        top5.forEach((release) => {
            const rId = release.id;
            allNodes.push({ id: rId, type: 'releaseNode', data: { release, isSelected: rId === selectedReleaseId }, position: { x: 0, y: 0 } });

            // Dependencies
            if (release.dependsOn) {
                release.dependsOn.forEach(dep => {
                    if (top5.some(r => r.id === dep.id)) {
                        allEdges.push(makeEdge(dep.id, rId, {
                            animated: true,
                            style: { stroke: '#818cf8', strokeWidth: 2.5, strokeDasharray: '8 4' },
                            arrowColor: '#818cf8',
                            label: 'blocks',
                            labelStyle: { fill: '#94a3b8', fontSize: 9, fontWeight: 700 },
                            labelBgPadding: [6, 3], labelBgBorderRadius: 4,
                            labelBgStyle: { fill: '#0f172a', fillOpacity: 0.95, stroke: '#334155', strokeWidth: 1 },
                        }));
                    }
                });
            }

            // Incomplete checklists
            (release.checklists || []).filter(c => !c.completionState).forEach((item, i) => {
                const nid = `cl-${rId}-${i}`;
                allNodes.push({ id: nid, type: 'checklistNode', data: { item }, position: { x: 0, y: 0 } });
                allEdges.push(makeEdge(rId, nid, { style: { stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '4 3' }, arrowColor: '#ef4444' }));
            });

            // Remaining tickets
            const remaining = (release.tickets || []).filter(t => t.status !== 'Done');
            remaining.slice(0, 5).forEach(ticket => {
                const nid = `tk-${rId}-${ticket.id}`;
                allNodes.push({ id: nid, type: 'ticketNode', data: { ticket }, position: { x: 0, y: 0 } });
                allEdges.push(makeEdge(rId, nid, { style: { stroke: '#475569', strokeWidth: 1 }, arrowColor: '#64748b' }));
            });
            if (remaining.length > 5) {
                const nid = `tk-more-${rId}`;
                allNodes.push({ id: nid, type: 'summaryNode', data: { label: `+${remaining.length - 5} more tickets`, icon: Ticket }, position: { x: 0, y: 0 } });
                allEdges.push(makeEdge(rId, nid));
            }

            // Missing owners
            [!release.engOwner && 'Engineering Owner', !release.qaOwner && 'QA Owner', !release.deployOwner && 'Deploy Owner']
                .filter(Boolean).forEach((role, i) => {
                    const nid = `owner-${rId}-${i}`;
                    allNodes.push({ id: nid, type: 'ownerGapNode', data: { label: role }, position: { x: 0, y: 0 } });
                    allEdges.push(makeEdge(rId, nid, { style: { stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '6 3' }, arrowColor: '#dc2626' }));
                });
        });

        const { nodes: ln, edges: le } = getLayoutedElements(allNodes, allEdges);
        setNodes(ln);
        setEdges(le);
    }, [releases, selectedReleaseId, setNodes, setEdges]);

    return (
        <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.12, duration: 800 }}
                minZoom={0.2}
                maxZoom={1.8}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#1e293b" gap={24} size={1} />
                <Controls className="bg-slate-900 border-slate-800 fill-slate-400" />
            </ReactFlow>

            {/* Title */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                    Deadline Proximity Graph
                </h2>
                <p className="text-[9px] font-medium text-slate-600 ml-5">5 nearest-deadline releases &bull; click to inspect</p>
            </div>

            {/* Legend */}
            <div className={`absolute bottom-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-3 space-y-1.5 pointer-events-none transition-all ${panelData ? 'right-[376px]' : 'right-4'}`}>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2">Legend</p>
                {[
                    { color: 'bg-blue-500/30 border-blue-500/40', label: 'Active' },
                    { color: 'bg-amber-500/30 border-amber-500/40', label: 'Frozen' },
                    { color: 'bg-emerald-500/30 border-emerald-500/40', label: 'Ready' },
                ].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded border ${l.color}`} /><span className="text-[9px] font-bold text-slate-400">{l.label}</span>
                    </div>
                ))}
                <div className="pt-1 border-t border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2"><XCircle className="w-3 h-3 text-red-400" /><span className="text-[9px] font-bold text-slate-400">Incomplete gate</span></div>
                    <div className="flex items-center gap-2"><Ticket className="w-3 h-3 text-amber-400" /><span className="text-[9px] font-bold text-slate-400">Remaining ticket</span></div>
                    <div className="flex items-center gap-2"><UserX className="w-3 h-3 text-red-400" /><span className="text-[9px] font-bold text-slate-400">Missing owner</span></div>
                </div>
            </div>

            {/* Detail Panel */}
            <DetailPanel panelData={panelData} onClose={() => setPanelData(null)} />
        </div>
    );
};

export default ReleaseCommandBoard;
