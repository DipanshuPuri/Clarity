import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi, API_BASE_URL } from '../api/auth';
import { usersApi } from '../api/users';
import { Building2, AlertCircle, Save, ShieldCheck, Users, Link as LinkIcon, Calendar, Briefcase, FileText, Activity, GitBranch, Rocket, BarChart3, Layers, Target, Zap, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const OrganizationDashboard = () => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [orgUsers, setOrgUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        organization: '',
        description: 'Advanced strategic operations command node. Over-indexed on shipping velocity and alignment.',
        websiteLink: 'https://clarityos.dev'
    });

    const mockMetrics = {
        establishedDate: 'Oct 14, 2025',
        departmentCount: 4,
        tier: 'Enterprise'
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const fetchOrgData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [data, usersData] = await Promise.all([
                authApi.getCurrentUser(),
                usersApi.getUsers()
            ]);

            if (data && data.user) {
                setUser(data.user);

                const rolePower = {
                    'FOUNDER': 6,
                    'ADMIN': 5,
                    'INVESTOR': 4,
                    'MANAGER': 3,
                    'MEMBER': 2,
                    'INTERN': 1
                };

                const sortedUsers = usersData.sort((a, b) => rolePower[b.role] - rolePower[a.role]);

                const mappedUsers = sortedUsers.map(u => {
                    const hash = u.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const states = ['Online', 'Offline', 'In-Meeting'];
                    return {
                        ...u,
                        status: states[hash % 3]
                    };
                });

                setOrgUsers(mappedUsers);

                setFormData(prev => ({
                    ...prev,
                    organization: data.user.organization || ''
                }));
            } else {
                setError('Organization context not found.');
            }
        } catch (err) {
            setError('Failed to fetch organization context.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const payload = {
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                organization: formData.organization
            };

            const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update organization');

            setStatus({ type: 'success', message: 'Organization synchronized successfully.' });
            setTimeout(() => {
                setStatus({ type: '', message: '' });
                setIsEditing(false);
            }, 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Synchronization failure' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-slate-900">
                    <div className="w-10 h-10 border-2 border-t-secondary border-slate-100 rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm font-medium animate-pulse">Initializing Organization Interface...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="p-10 bg-red-50/50 border border-red-100 rounded-2xl text-center max-w-md space-y-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <AlertCircle className="w-8 h-8 text-red-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Organization Fetch Failure</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{error}</p>
                    </div>
                    <Button
                        onClick={fetchOrgData}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl font-semibold text-sm tracking-wide hover:bg-slate-800 transition-all"
                    >
                        Retry Synchronization
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-slide-up pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 -mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                <div className="lg:col-span-2 space-y-6">
                    <header className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10 shrink-0">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-500 leading-none">Organization</span>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none mt-1">
                                {user?.organization || 'Independent Workspace'}
                            </h1>
                        </div>
                    </header>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-1 pb-2 border-b border-slate-50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                    <Users className="w-5 h-5 text-secondary" />
                                    Team Members
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-0 overflow-y-auto custom-scrollbar pr-2 -mx-2 px-2">
                            <div className="flex items-center gap-4 px-4 pb-2 mb-2 border-b border-slate-100 text-[9px] font-medium uppercase tracking-widest text-slate-400">
                                <div className="w-[35%]">Identity</div>
                                <div className="w-[25%]">Position</div>
                                <div className="w-[20%]">Presence</div>
                                <div className="w-[20%] text-right">Clearance</div>
                            </div>

                            {orgUsers.map((emp, index) => (
                                <div key={emp.id} className={`flex items-center gap-4 py-2.5 px-4 rounded-xl transition-all ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'} hover:bg-slate-50 hover:shadow-sm border border-transparent`}>
                                    <div className="w-[35%] flex items-center gap-3">
                                        {emp.profilePicture ? (
                                            <img src={emp.profilePicture} alt={emp.firstName} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 shadow-sm shrink-0">
                                                {emp.firstName?.charAt(0) || '?'}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-900 truncate">{emp.firstName} {emp.lastName}</p>
                                            <p className="text-[9px] font-medium text-slate-400 truncate">{emp.email}</p>
                                        </div>
                                    </div>
                                    <div className="w-[25%] flex items-start gap-2 pt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold text-slate-700 truncate">{emp.position || 'Operations Member'}</p>
                                            <p className="text-[9px] font-medium text-slate-400 truncate pt-0.5">{emp.department || 'General Operations'}</p>
                                        </div>
                                    </div>
                                    <div className="w-[20%] flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Online' ? 'bg-emerald-500 animate-pulse' : emp.status === 'In-Meeting' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                                        <span className={`text-[10px] font-medium ${emp.status === 'Online' ? 'text-emerald-600' : emp.status === 'In-Meeting' ? 'text-amber-600' : 'text-slate-500'}`}>{emp.status}</span>
                                    </div>
                                    <div className="w-[20%] text-right">
                                        <div className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md
                                            ${emp.role === 'FOUNDER' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                emp.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                    emp.role === 'INVESTOR' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        'bg-slate-100 text-slate-600 border border-slate-200'}
                                        `}>
                                            {emp.role}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6 lg:-mt-2">

                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10 p-1">
                            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-secondary" />
                                Platform Details
                            </h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-[10px] font-medium text-secondary uppercase tracking-widest hover:bg-secondary/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 p-1">
                            {status.message && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success'
                                    ? 'bg-green-50 border-green-100 text-green-700'
                                    : 'bg-red-50 border-red-100 text-red-700'
                                    }`}>
                                    {status.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    <span className="text-xs font-medium">{status.message}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 pl-1">
                                    <Building2 className="w-3 h-3" /> Organization Name
                                </label>
                                {isEditing ? (
                                    <Input
                                        name="organization"
                                        className="h-12 bg-slate-50 border-slate-200 focus:bg-white rounded-xl px-4 font-bold text-slate-900 text-sm"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        required
                                        placeholder="Organization Name"
                                    />
                                ) : (
                                    <div className="px-1 py-2 text-lg font-bold text-slate-900 tracking-tight">
                                        {formData.organization || 'Independent Workspace'}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 pl-1">
                                    <FileText className="w-3 h-3" /> Description
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-secondary focus:ring-1 focus:ring-secondary rounded-xl text-sm font-medium text-slate-900 resize-none outline-none transition-all placeholder:text-slate-400"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Brief strategic overview..."
                                    />
                                ) : (
                                    <div className="px-1 py-1 text-sm font-medium text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-3">
                                        {formData.description}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 pl-1">
                                    <LinkIcon className="w-3 h-3" /> Website
                                </label>
                                {isEditing ? (
                                    <Input
                                        name="websiteLink"
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl px-4 font-medium text-slate-900 text-sm"
                                        value={formData.websiteLink}
                                        onChange={handleChange}
                                        placeholder="https://"
                                    />
                                ) : (
                                    <div className="px-1 py-1 text-sm font-semibold text-secondary flex items-center gap-2 group cursor-pointer hover:underline underline-offset-4">
                                        {formData.websiteLink}
                                    </div>
                                )}
                            </div>

                            {/* Internal Read-Only Metrics - Fixed Grid Layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">Deployment</label>
                                    <div className="text-[11px] font-bold text-slate-800 truncate" title="Global Edge">
                                        Global Edge
                                    </div>
                                </div>
                                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">Projects</label>
                                    <div className="text-[11px] font-bold text-slate-800 truncate" title="24 Active">
                                        24 Active
                                    </div>
                                </div>
                                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">API Usage</label>
                                    <div className="text-[11px] font-bold text-slate-800 truncate" title="1.2M Req/Mo">
                                        1.2M Req/Mo
                                    </div>
                                </div>
                                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">Platform</label>
                                    <div className="text-[11px] font-bold text-slate-800 truncate" title="v2.4.1-stable">
                                        v2.4.1-stable
                                    </div>
                                </div>
                                <div className="space-y-0.5 border-l-2 border-slate-200 pl-3">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">Compliance</label>
                                    <div className="text-[11px] font-bold text-emerald-600 truncate" title="SOC2 Type II">
                                        SOC2 Type II
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-6 border-t border-slate-100 animate-fade-slide-up">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-12 w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSubmitting ? 'Committing...' : 'Commit Details'}
                                    </Button>
                                    <p className="text-center text-[9px] font-medium text-slate-400 mt-3">
                                        Changes sync to all workspace nodes.
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-50 pointer-events-none" />

                        <h3 className="text-xs font-medium text-secondary uppercase tracking-widest mb-8 relative z-10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                            Live Telemetry
                        </h3>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Active Tier</span>
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                    {mockMetrics.tier}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Personnel Depth</span>
                                </div>
                                <span className="text-lg font-bold text-white">{orgUsers.length}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Active Departments</span>
                                </div>
                                <span className="text-lg font-bold text-white">{mockMetrics.departmentCount}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">Commissioned Origin</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 tracking-tight">{mockMetrics.establishedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" /> Department Breakdown
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Engineering', head: 'Marcus Chen', count: 8, color: 'bg-blue-500', pct: 45 },
                                { name: 'Product', head: 'Neha Kapoor', count: 4, color: 'bg-purple-500', pct: 22 },
                                { name: 'Design', head: 'Riya Sharma', count: 3, color: 'bg-pink-500', pct: 17 },
                                { name: 'QA & DevOps', head: 'Dev Malhotra', count: 3, color: 'bg-emerald-500', pct: 16 },
                            ].map((dept, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{dept.name}</p>
                                            <p className="text-[9px] font-medium text-slate-400">Lead: {dept.head}</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{dept.count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${dept.color} rounded-full transition-all`} style={{ width: `${dept.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5" /> Organization Health
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Team Growth', value: '+6', trend: 'This Quarter', icon: Users },
                                { label: 'Retention Rate', value: '94%', trend: '12-month', icon: Target },
                                { label: 'Cross-Dept Collab', value: '72%', trend: '+9%', icon: Layers },
                                { label: 'Avg Onboarding', value: '4.2 days', trend: '-1.8d', icon: Zap },
                            ].map((metric, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <metric.icon className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{metric.label}</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-extrabold text-slate-900">{metric.value}</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-emerald-500 bg-emerald-50">{metric.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> Recent Organization Activity
                        </h3>
                        <div className="space-y-1">
                            {[
                                { action: 'Release deployed', target: 'v2.4.1 Hotfix → Production', author: 'Marcus Chen', time: '2h ago', icon: Rocket, color: 'text-emerald-500 bg-emerald-50' },
                                { action: 'Sprint completed', target: 'Sprint 14 — Auth Service', author: 'Neha Kapoor', time: '1d ago', icon: CheckCircle, color: 'text-blue-500 bg-blue-50' },
                                { action: 'Workflow modified', target: 'QA Verification Pipeline', author: 'Dev Malhotra', time: '2d ago', icon: GitBranch, color: 'text-purple-500 bg-purple-50' },
                                { action: 'New project created', target: 'Mobile SDK v3', author: 'Alexander Pierce', time: '3d ago', icon: Layers, color: 'text-secondary bg-secondary/10' },
                                { action: 'Team member added', target: 'Priya Nair → Engineering', author: 'Neha Kapoor', time: '4d ago', icon: Users, color: 'text-amber-500 bg-amber-50' },
                                { action: 'Security audit passed', target: 'Q1 2026 Compliance Review', author: 'Alexander Pierce', time: '5d ago', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                                        <item.icon className="w-3 h-3" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-slate-700">
                                            <span className="font-medium">{item.action}</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-900 truncate">{item.target}</p>
                                        <p className="text-[9px] font-medium text-slate-400 mt-0.5">{item.author} &middot; {item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrganizationDashboard;
