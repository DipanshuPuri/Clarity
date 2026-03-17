import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, TrendingDown, Clock, Zap, Users, Flag, AlertTriangle, Layers, ShieldAlert, Info, CheckCircle2, ChevronDown, ExternalLink, Gauge, BarChart3 } from 'lucide-react';
import { ComposedChart, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Bar, Legend as RLegend } from 'recharts';

// ─── MOCK TELEMETRY DATA ───────────────────────────────────────────────────────

const telemetryCards = [
    {
        id: 'throughput', label: 'Throughput', value: '1,204', unit: 'ops/wk',
        change: +14.2, baseline: 1054, baselineLabel: '30d avg',
        risk: 'nominal', icon: Zap, color: 'indigo',
        sparkline: [820, 940, 880, 1010, 1080, 1120, 1204],
        insight: 'Throughput increased 14.2% over the 30-day baseline driven by parallelized CI/CD pipelines in Omega Unit and reduced QA queue times after the recent workflow optimization.',
    },
    {
        id: 'cycleTime', label: 'Cycle Time', value: '4.2', unit: 'days',
        change: -16.0, baseline: 5.0, baselineLabel: '30d avg',
        risk: 'nominal', icon: Clock, color: 'blue',
        sparkline: [6.1, 5.8, 5.4, 5.0, 4.8, 4.5, 4.2],
        insight: 'Cycle time (active work duration) dropped 0.8d after removing the redundant staging approval step. Fastest cycles observed in the Omega and Gamma units.',
    },
    {
        id: 'leadTime', label: 'Lead Time', value: '11.3', unit: 'days',
        change: -8.1, baseline: 12.3, baselineLabel: '30d avg',
        risk: 'elevated', icon: Flag, color: 'amber',
        sparkline: [14.2, 13.8, 12.6, 12.3, 11.9, 11.5, 11.3],
        insight: 'Lead time (request-to-delivery) is above the 10-day SLA target. The gap between cycle and lead time indicates 7.1 days of wait/queue time, primarily at the Client Approval and Design Review stages.',
    },
    {
        id: 'resolution', label: 'Resolution Rate', value: '87', unit: '%',
        change: +3.4, baseline: 84, baselineLabel: '30d avg',
        risk: 'nominal', icon: Gauge, color: 'purple',
        sparkline: [79, 81, 83, 82, 85, 86, 87],
        insight: 'First-contact resolution improved 3.4% after introducing auto-triage rules in the intake queue. Beta Unit still lags at 71% due to complex cross-team dependencies.',
    },
    {
        id: 'delayRisk', label: 'Delay Risk', value: '0.34', unit: '',
        change: +22.0, baseline: 0.28, baselineLabel: 'threshold',
        risk: 'critical', icon: ShieldAlert, color: 'red',
        sparkline: [0.18, 0.21, 0.19, 0.24, 0.28, 0.31, 0.34],
        insight: 'Delay risk breached the 0.28 safety threshold. Two concurrent bottlenecks in QA Review are the primary contributors — the Apollo CRM and Helix Pipeline projects are both in critical-path review simultaneously.',
    },
];

const insightItems = [
    {
        type: 'success',
        text: 'Throughput exceeded the 30-day baseline by 14.2% — sustained velocity confirmed across all execution units.',
        detail: 'The surge is attributed to Omega Unit\'s parallel CI/CD pipeline deployment and Gamma Unit\'s auto-scaling of data ingestion workflows. Both changes were implemented in Sprint 14.',
    },
    {
        type: 'warning',
        text: 'Lead Time remains 11.3d, elevated above the 10d SLA target. Primary drag traced to Client Approval stage.',
        detail: 'Client Approval currently averages 3.2 days per ticket — 60% longer than the process benchmark. Two enterprise clients (Acme Corp, Vertex Inc.) have approval chains exceeding 5 business days.',
    },
    {
        type: 'critical',
        text: 'Delay Risk breached the safety threshold (0.28). Two concurrent bottlenecks in QA Review are compounding exposure.',
        detail: 'Apollo CRM and Helix Pipeline are both in critical-path QA simultaneously, consuming 80% of QA capacity. Recommendation: stagger review cycles or temporarily allocate two additional reviewers.',
    },
    {
        type: 'info',
        text: 'Resolution Rate improved to 87% with the new auto-triage rules reducing misrouted tickets by 40%.',
        detail: 'The auto-triage system correctly routes 92% of incoming tickets on first pass. Beta Unit\'s lower rate (71%) is primarily due to multi-team dependency tickets that require manual escalation.',
    },
];

// Execution Velocity — data per time range
// efficiency: 30–80 range, varies naturally
// Added: reopened tickets (subset of opened) and avg resolution time (hours)
const performanceDataByRange = {
    '24h': [
        { name: '6AM', ticketsOpened: 3, ticketsClosed: 2, reopened: 0, avgResHrs: 2.1, efficiency: 52 },
        { name: '9AM', ticketsOpened: 8, ticketsClosed: 5, reopened: 1, avgResHrs: 3.4, efficiency: 45 },
        { name: '12PM', ticketsOpened: 12, ticketsClosed: 10, reopened: 2, avgResHrs: 2.8, efficiency: 62 },
        { name: '3PM', ticketsOpened: 6, ticketsClosed: 9, reopened: 1, avgResHrs: 1.9, efficiency: 71 },
        { name: '6PM', ticketsOpened: 4, ticketsClosed: 7, reopened: 0, avgResHrs: 2.3, efficiency: 58 },
        { name: '9PM', ticketsOpened: 2, ticketsClosed: 3, reopened: 0, avgResHrs: 1.5, efficiency: 44 },
    ],
    '7d': [
        { name: 'Mon', ticketsOpened: 18, ticketsClosed: 14, reopened: 3, avgResHrs: 4.2, efficiency: 48 },
        { name: 'Tue', ticketsOpened: 24, ticketsClosed: 22, reopened: 2, avgResHrs: 3.1, efficiency: 58 },
        { name: 'Wed', ticketsOpened: 15, ticketsClosed: 19, reopened: 1, avgResHrs: 2.8, efficiency: 72 },
        { name: 'Thu', ticketsOpened: 30, ticketsClosed: 26, reopened: 4, avgResHrs: 3.9, efficiency: 55 },
        { name: 'Fri', ticketsOpened: 22, ticketsClosed: 28, reopened: 2, avgResHrs: 2.4, efficiency: 67 },
        { name: 'Sat', ticketsOpened: 6, ticketsClosed: 9, reopened: 1, avgResHrs: 1.8, efficiency: 75 },
        { name: 'Sun', ticketsOpened: 4, ticketsClosed: 7, reopened: 0, avgResHrs: 1.3, efficiency: 60 },
    ],
    '30d': [
        { name: 'Wk 1', ticketsOpened: 85, ticketsClosed: 72, reopened: 8, avgResHrs: 4.5, efficiency: 53 },
        { name: 'Wk 2', ticketsOpened: 92, ticketsClosed: 88, reopened: 6, avgResHrs: 3.8, efficiency: 61 },
        { name: 'Wk 3', ticketsOpened: 78, ticketsClosed: 81, reopened: 5, avgResHrs: 3.2, efficiency: 70 },
        { name: 'Wk 4', ticketsOpened: 104, ticketsClosed: 96, reopened: 9, avgResHrs: 4.1, efficiency: 58 },
    ],
    '6m': [
        { name: 'Sep', ticketsOpened: 310, ticketsClosed: 280, reopened: 28, avgResHrs: 5.2, efficiency: 47 },
        { name: 'Oct', ticketsOpened: 345, ticketsClosed: 320, reopened: 22, avgResHrs: 4.1, efficiency: 55 },
        { name: 'Nov', ticketsOpened: 290, ticketsClosed: 305, reopened: 18, avgResHrs: 3.6, efficiency: 63 },
        { name: 'Dec', ticketsOpened: 260, ticketsClosed: 270, reopened: 20, avgResHrs: 3.9, efficiency: 58 },
        { name: 'Jan', ticketsOpened: 380, ticketsClosed: 350, reopened: 32, avgResHrs: 4.8, efficiency: 52 },
        { name: 'Feb', ticketsOpened: 340, ticketsClosed: 330, reopened: 24, avgResHrs: 3.7, efficiency: 60 },
    ],
    '1y': [
        { name: 'Mar', ticketsOpened: 280, ticketsClosed: 250, reopened: 25, avgResHrs: 6.1, efficiency: 42 },
        { name: 'Apr', ticketsOpened: 310, ticketsClosed: 290, reopened: 20, avgResHrs: 5.4, efficiency: 48 },
        { name: 'May', ticketsOpened: 340, ticketsClosed: 330, reopened: 18, avgResHrs: 4.6, efficiency: 55 },
        { name: 'Jun', ticketsOpened: 290, ticketsClosed: 300, reopened: 14, avgResHrs: 3.8, efficiency: 64 },
        { name: 'Jul', ticketsOpened: 320, ticketsClosed: 310, reopened: 22, avgResHrs: 4.3, efficiency: 57 },
        { name: 'Aug', ticketsOpened: 370, ticketsClosed: 340, reopened: 30, avgResHrs: 5.1, efficiency: 45 },
        { name: 'Sep', ticketsOpened: 310, ticketsClosed: 280, reopened: 28, avgResHrs: 4.8, efficiency: 50 },
        { name: 'Oct', ticketsOpened: 345, ticketsClosed: 320, reopened: 19, avgResHrs: 4.0, efficiency: 58 },
        { name: 'Nov', ticketsOpened: 290, ticketsClosed: 305, reopened: 15, avgResHrs: 3.5, efficiency: 66 },
        { name: 'Dec', ticketsOpened: 260, ticketsClosed: 270, reopened: 17, avgResHrs: 3.7, efficiency: 62 },
        { name: 'Jan', ticketsOpened: 380, ticketsClosed: 350, reopened: 26, avgResHrs: 4.6, efficiency: 53 },
        { name: 'Feb', ticketsOpened: 340, ticketsClosed: 330, reopened: 21, avgResHrs: 3.9, efficiency: 60 },
    ],
    'all': [
        { name: '2023', ticketsOpened: 2100, ticketsClosed: 1950, reopened: 180, avgResHrs: 6.8, efficiency: 38 },
        { name: 'Q1 24', ticketsOpened: 820, ticketsClosed: 790, reopened: 62, avgResHrs: 5.2, efficiency: 47 },
        { name: 'Q2 24', ticketsOpened: 960, ticketsClosed: 920, reopened: 55, avgResHrs: 4.5, efficiency: 54 },
        { name: 'Q3 24', ticketsOpened: 1050, ticketsClosed: 1010, reopened: 68, avgResHrs: 4.8, efficiency: 58 },
        { name: 'Q4 24', ticketsOpened: 890, ticketsClosed: 870, reopened: 48, avgResHrs: 3.9, efficiency: 63 },
        { name: 'Q1 25', ticketsOpened: 1100, ticketsClosed: 1030, reopened: 72, avgResHrs: 4.2, efficiency: 56 },
    ],
};

const velocityTotals = {
    '24h': { total: 35, change: 8 },
    '7d': { total: 119, change: 14 },
    '30d': { total: 359, change: 11 },
    '6m': { total: 1925, change: 9 },
    '1y': { total: 3935, change: 12 },
    'all': { total: 6920, change: 7 },
};

// Predictive delivery — 5 key projects with realistic varied data
const mockPredictiveData = [
    { project: 'Apollo\nCRM', estimated: 24, actual: 28, aiPredicted: 26 },
    { project: 'Vertex\nAPI', estimated: 18, actual: 15, aiPredicted: 17 },
    { project: 'Onyx\nDashboard', estimated: 32, actual: 30, aiPredicted: 29 },
    { project: 'Helix\nPipeline', estimated: 40, actual: 44, aiPredicted: 42 },
    { project: 'Nova\nMigration', estimated: 14, actual: 12, aiPredicted: 13 },
];

const mockHistory = [
    { id: 1, action: "Workflow 'Deployment' execution time reduced by 14%", unit: "Omega Unit", timestamp: "2 hours ago", status: "optimized" },
    { id: 2, action: "Critical bottleneck identified at 'QA Review' node", unit: "Alpha Unit", timestamp: "4 hours ago", status: "flagged" },
    { id: 3, action: "Resource reallocation pushed throughput +8%", unit: "Gamma Unit", timestamp: "1 day ago", status: "optimized" },
    { id: 4, action: "SLA breach detected in 'Client Approval' stage", unit: "Beta Unit", timestamp: "1 day ago", status: "breached" },
    { id: 5, action: "Predictive model adjusted for Q3 Delivery pipeline", unit: "System", timestamp: "2 days ago", status: "adjusted" },
    { id: 6, action: "Throughput surge detected from parallel execution in CI/CD", unit: "Omega Unit", timestamp: "2 days ago", status: "optimized" },
    { id: 7, action: "Auto-scaling triggered for 'Data Ingestion' workflow", unit: "Gamma Unit", timestamp: "3 days ago", status: "adjusted" },
    { id: 8, action: "SLA warning threshold reached for 'Design Review'", unit: "Alpha Unit", timestamp: "3 days ago", status: "flagged" },
    { id: 9, action: "Completed capacity rebalancing across Beta and Gamma units", unit: "System", timestamp: "4 days ago", status: "optimized" },
    { id: 10, action: "Delay Risk threshold recalibrated to 0.28 from 0.35", unit: "System", timestamp: "5 days ago", status: "adjusted" },
];

const unitEfficiencyData = [
    { name: 'Alpha', team: 'Alpha', output: 78, color: 'bg-blue-500', textColor: 'text-blue-500 bg-blue-50', note: 'Steady execution' },
    { name: 'Beta', team: 'Beta', output: 64, color: 'bg-amber-500', textColor: 'text-amber-500 bg-amber-50', note: 'Bottleneck at Review' },
    { name: 'Gamma', team: 'Gamma', output: 85, color: 'bg-purple-500', textColor: 'text-purple-500 bg-purple-50', note: 'Scaling efficiently' },
    { name: 'Omega', team: 'Omega', output: 92, color: 'bg-emerald-500', textColor: 'text-emerald-500 bg-emerald-50', note: 'Peak velocity' },
];

const timeRanges = [
    { key: '24h', label: 'Last 24 Hours' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '6m', label: 'Last 6 Months' },
    { key: '1y', label: 'Last Year' },
    { key: 'all', label: 'All Time' },
];

// ─── MINI SPARKLINE (pure SVG) ─────────────────────────────────────────────────

const MiniSparkline = ({ data, color, width = 80, height = 32 }) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#spark-${color})`} />
            <circle cx={width} cy={parseFloat(points.split(' ').pop().split(',')[1])} r="3" fill={color} stroke="white" strokeWidth="2" />
        </svg>
    );
};

// ─── MULTILINE TICK for predictive chart ────────────────────────────────────────

const MultiLineTick = ({ x, y, payload }) => {
    const lines = (payload.value || '').split('\n');
    return (
        <g transform={`translate(${x},${y + 12})`}>
            {lines.map((line, i) => (
                <text
                    key={i}
                    x={0}
                    y={i * 12}
                    textAnchor="middle"
                    fill="#475569"
                    fontSize={9}
                    fontWeight="bold"
                >
                    {line}
                </text>
            ))}
        </g>
    );
};

// ─── COLOR MAPS ────────────────────────────────────────────────────────────────

const colorMap = {
    indigo: { hex: '#6366f1', bg: 'bg-indigo-500/10', text: 'text-indigo-500', ring: 'ring-indigo-500/20', glow: 'bg-indigo-500/5' },
    blue: { hex: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-500/20', glow: 'bg-blue-500/5' },
    amber: { hex: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-500/20', glow: 'bg-amber-500/5' },
    purple: { hex: '#a855f7', bg: 'bg-purple-500/10', text: 'text-purple-500', ring: 'ring-purple-500/20', glow: 'bg-purple-500/5' },
    red: { hex: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/20', glow: 'bg-red-500/5' },
};

const riskConfig = {
    nominal: { dot: 'bg-emerald-500', label: 'NOMINAL', labelColor: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-200' },
    elevated: { dot: 'bg-amber-500', label: 'ELEVATED', labelColor: 'text-amber-600 bg-amber-50', border: 'border-amber-200' },
    critical: { dot: 'bg-red-500', label: 'CRITICAL', labelColor: 'text-red-600 bg-red-50', border: 'border-red-200' },
};

const insightConfig = {
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    critical: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
};

// ─── ANALYTICS PAGE ────────────────────────────────────────────────────────────

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState('7d');
    const [rangeOpen, setRangeOpen] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredInsight, setHoveredInsight] = useState(null);

    const currentRange = timeRanges.find(r => r.key === selectedRange);
    const currentPerformanceData = performanceDataByRange[selectedRange] || performanceDataByRange['7d'];
    const currentTotals = velocityTotals[selectedRange] || velocityTotals['7d'];

    // Compute average efficiency for the badge
    const avgEfficiency = useMemo(() => {
        const data = currentPerformanceData;
        const sum = data.reduce((acc, d) => acc + d.efficiency, 0);
        return Math.round(sum / data.length);
    }, [currentPerformanceData]);

    return (
        <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-6">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase flex items-center gap-3"><BarChart3 className="w-8 h-8 text-secondary" />Analytics</h1>
                <div className="hidden lg:flex items-center gap-2 pt-1">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">Strategic Intelligence</span>
                </div>
            </div>

            {/* ═══ SECTION 1: EXECUTION OVERVIEW — 5 Intelligence Cards ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {telemetryCards.map((card) => {
                    const colors = colorMap[card.color];
                    const risk = riskConfig[card.risk];
                    const isPositiveGood = ['throughput', 'resolution'].includes(card.id);
                    const isNegativeGood = ['cycleTime', 'leadTime', 'delayRisk'].includes(card.id);
                    const changeIsGood = isPositiveGood ? card.change > 0 : isNegativeGood ? card.change < 0 : Math.abs(card.change) < 10;
                    const isHovered = hoveredCard === card.id;

                    return (
                        <div
                            key={card.id}
                            className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-default"
                            onMouseEnter={() => setHoveredCard(card.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${colors.glow} rounded-bl-full pointer-events-none group-hover:w-32 group-hover:h-32 transition-all duration-500`} />
                            <div className={`absolute top-0 left-0 w-full h-[3px] ${risk.dot}`} />

                            {/* Normal card content */}
                            <div className={`relative z-10 transition-all duration-300 ${isHovered ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                        <card.icon className={`w-4 h-4 ${colors.text}`} />
                                    </div>
                                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${risk.labelColor} border ${risk.border}`}>
                                        {risk.label}
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{card.value}</h3>
                                    {card.unit && <span className="text-xs font-bold text-slate-400 uppercase">{card.unit}</span>}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-md flex items-center ${changeIsGood ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                        {card.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                        {card.change > 0 ? '+' : ''}{card.change}%
                                    </div>
                                </div>
                                <div className="mt-4 mb-2">
                                    <MiniSparkline data={card.sparkline} color={colors.hex} width={100} height={28} />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {card.baselineLabel}: {card.baseline}
                                    </span>
                                </div>
                            </div>

                            {/* Hover insight overlay */}
                            <div className={`relative z-10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <card.icon className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{card.label}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed">{card.insight}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ═══ INSIGHT SUMMARY PANEL ═══ */}
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Insight Summary</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Anomaly Detection • Last 7 Days</p>
                    </div>
                    <div className="ml-auto">
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                            {insightItems.length} Signals
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {insightItems.map((item, i) => {
                        const cfg = insightConfig[item.type];
                        const IconComp = cfg.icon;
                        const isHovered = hoveredInsight === i;
                        return (
                            <div
                                key={i}
                                className={`flex flex-col gap-2 p-4 rounded-2xl border ${cfg.border} ${cfg.bg} transition-all hover:shadow-sm cursor-default`}
                                onMouseEnter={() => setHoveredInsight(i)}
                                onMouseLeave={() => setHoveredInsight(null)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5"><IconComp className={`w-4 h-4 ${cfg.color}`} /></div>
                                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{item.text}</p>
                                </div>
                                {/* Hover detail — slides in */}
                                <div className={`overflow-hidden transition-all duration-300 ease-out ${isHovered ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-7 border-l-2 border-slate-200 ml-2">
                                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══ ROW 2: Execution Velocity (2/3) & Unit Efficiency (1/3) ═══ */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Execution Velocity — ComposedChart with dual Y-axis */}
                <div className="w-full lg:w-2/3 bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden group min-w-0 flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Header with dropdown — z-50 to stay above chart */}
                    <div className="flex items-center justify-between mb-8 relative z-50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-500" />
                                Execution Velocity
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tickets & Efficiency • {currentRange.label}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Time Range Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setRangeOpen(!rangeOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors text-[10px] font-bold text-slate-600 uppercase tracking-widest"
                                >
                                    {currentRange.label}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {rangeOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setRangeOpen(false)} />
                                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[160px] py-1 overflow-hidden">
                                            {timeRanges.map((r) => (
                                                <button
                                                    key={r.key}
                                                    onClick={() => { setSelectedRange(r.key); setRangeOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedRange === r.key
                                                        ? 'text-indigo-600 bg-indigo-50'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] font-medium text-slate-400 uppercase tracking-widest block">Score</span>
                                <span className="text-3xl font-bold text-slate-900 leading-none">{currentTotals.total.toLocaleString()}</span>
                                <span className="text-xs font-bold text-emerald-500 ml-2">↑ {currentTotals.change}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Avg Efficiency floating badge */}
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest">Avg Efficiency: {avgEfficiency}%</span>
                        </div>
                    </div>

                    {/* Chart — ComposedChart with dual Y-axis */}
                    <div className="h-[300px] w-full relative z-10 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={currentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                {/* Left Y-axis for ticket counts */}
                                <YAxis yAxisId="tickets" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                {/* Right Y-axis for efficiency % (30-80 range) */}
                                <YAxis
                                    yAxisId="efficiency"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[20, 90]}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#ef4444' }}
                                    tickFormatter={(v) => `${v}%`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#1e293b' }}
                                    formatter={(value, name) => {
                                        if (name === 'Employee Efficiency') return [`${value}%`, name];
                                        if (name === 'Avg Res. Time') return [`${value}h`, name];
                                        return [value, name];
                                    }}
                                />
                                {/* Ticket areas on left axis */}
                                <Area yAxisId="tickets" type="monotone" dataKey="ticketsOpened" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorOpened)" name="Tickets Opened" />
                                <Area yAxisId="tickets" type="monotone" dataKey="ticketsClosed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorClosed)" name="Tickets Closed" />
                                {/* Reopened as small bars on left axis */}
                                <Bar yAxisId="tickets" dataKey="reopened" fill="#f59e0b" barSize={8} radius={[4, 4, 0, 0]} name="Reopened" opacity={0.7} />
                                {/* Efficiency line on its own right axis — varies naturally */}
                                <Line yAxisId="efficiency" type="monotone" dataKey="efficiency" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} name="Employee Efficiency" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-5 mt-4 relative z-10 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1 rounded-full bg-indigo-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Opened</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Closed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm bg-amber-500 opacity-70" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reopened</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-0.5 bg-red-500 rounded-full" style={{ borderTop: '2px dashed #ef4444' }} />
                            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Efficiency %</span>
                        </div>
                    </div>
                </div>

                {/* Unit Efficiency — compact, all 4 teams, clickable */}
                <div className="w-full lg:w-1/3 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden flex flex-col min-w-0">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Unit Efficiency</h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Yield vs Capacity</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {unitEfficiencyData.sort((a, b) => b.output - a.output).map((unit) => (
                            <button
                                key={unit.name}
                                onClick={() => navigate(`/app/projects?team=${unit.team}`)}
                                className="w-full text-left group/unit cursor-pointer hover:bg-slate-50/50 rounded-xl p-2 -mx-2 transition-colors"
                            >
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5 group-hover/unit:text-indigo-600 transition-colors">
                                        {unit.name}
                                        <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover/unit:opacity-100 transition-opacity" />
                                    </span>
                                    <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${unit.textColor}`}>{unit.output}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`${unit.color} h-2 rounded-full transition-all`} style={{ width: `${unit.output}%` }}></div>
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{unit.note}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ ROW 3: Ledger (LEFT) & Predictive (RIGHT) ═══ */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Analytical Ledger — LEFT SIDE */}
                <div className="w-full lg:w-1/2 bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm flex flex-col min-w-0">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Analytical Ledger</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Chronology of Adjustments</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 max-h-[360px] pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                        {mockHistory.map((item) => (
                            <div key={item.id} className="flex gap-3 group">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ring-1 shadow-sm mt-1.5 transition-transform group-hover:scale-125 ${item.status === 'optimized' ? 'bg-emerald-500 ring-emerald-200' :
                                        item.status === 'flagged' ? 'bg-amber-500 ring-amber-200' :
                                            item.status === 'breached' ? 'bg-red-500 ring-red-200' :
                                                'bg-purple-500 ring-purple-200'
                                        }`} />
                                    <div className="w-px h-full bg-slate-100 mt-1.5" />
                                </div>
                                <div className="pb-3 flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 leading-snug">{item.action}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            {item.unit}
                                        </span>
                                        <span className="text-[9px] font-medium text-slate-400">
                                            {item.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Predictive Delivery Model — RIGHT SIDE */}
                <div className="w-full lg:w-1/2 bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-slate-900/10 relative overflow-hidden group min-w-0 flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-700" />

                    <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-800 pb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-400" />
                                Predictive Target Model
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Est. Delivery • Top 5 Projects</p>
                        </div>
                        <div className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 uppercase tracking-widest">AI Forecast</div>
                    </div>

                    <div className="h-[280px] w-full relative z-10 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockPredictiveData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="project"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={<MultiLineTick />}
                                    interval={0}
                                    height={40}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#475569', fontWeight: 'bold' }}
                                    width={35}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    labelFormatter={(label) => label.replace('\n', ' ')}
                                />
                                <Line type="monotone" dataKey="estimated" stroke="#475569" strokeWidth={2} strokeDasharray="5 5" name="Planned Timeline" dot={{ r: 4, fill: '#475569', strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="actual" stroke="#f8fafc" strokeWidth={3} name="Current Trajectory" dot={{ r: 5, fill: '#f8fafc', strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="aiPredicted" stroke="#a855f7" strokeWidth={3} name="AI Projected" dot={{ r: 5, fill: '#a855f7', strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 relative z-10">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-0.5 bg-slate-500 rounded-full" style={{ borderBottom: '2px dashed #475569' }} />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Planned</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1 rounded-full bg-white" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Trajectory</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1 rounded-full bg-purple-500" />
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">AI Projected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
