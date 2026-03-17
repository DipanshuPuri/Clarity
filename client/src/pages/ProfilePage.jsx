import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
    User, Building2, Shield, Mail, Globe, Briefcase, Camera, Lock, X, CheckCircle, AlertCircle, ChevronDown,
    Activity, Tag, Clock, Bell, BellOff, Zap, GitBranch, FileText, MessageSquare, Rocket,
    Github, Calendar, Award, BarChart3, Settings2, ExternalLink, Layers, Users
} from 'lucide-react';

const HIERARCHY = {
    'FOUNDER': 4,
    'CO_OWNER': 4,
    'ADMIN': 3,
    'MANAGER': 2,
    'MEMBER': 1,
    'INTERN': 0
};

// 30 activity entries (5x original) — realistic and synced to project context
const RECENT_ACTIVITY = [
    { id: 1, type: 'ticket', action: 'Created ticket', target: 'JWT Refresh Token Migration', project: 'Auth Service', time: '2 hours ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { id: 2, type: 'comment', action: 'Commented on', target: 'API Rate Limiting Strategy', project: 'Core Platform', time: '3 hours ago', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
    { id: 3, type: 'release', action: 'Approved release', target: 'v2.4.1 Hotfix', project: 'Client Portal', time: '5 hours ago', icon: Rocket, color: 'text-emerald-500 bg-emerald-50' },
    { id: 4, type: 'workflow', action: 'Modified workflow', target: 'Sprint Execution Pipeline', project: 'Workflows', time: '8 hours ago', icon: GitBranch, color: 'text-secondary bg-secondary/10' },
    { id: 5, type: 'ticket', action: 'Resolved ticket', target: 'WebSocket Connection Drops', project: 'Core Platform', time: '12 hours ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { id: 6, type: 'deploy', action: 'Deployed to production', target: 'v2.4.0 Stable', project: 'Auth Service', time: '1 day ago', icon: Zap, color: 'text-amber-500 bg-amber-50' },
    { id: 7, type: 'ticket', action: 'Assigned ticket', target: 'OAuth2 PKCE Integration', project: 'Auth Service', time: '1 day ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { id: 8, type: 'comment', action: 'Reviewed PR for', target: 'Database Connection Pooling', project: 'Core Platform', time: '1 day ago', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
    { id: 9, type: 'workflow', action: 'Created workflow', target: 'QA Verification Pipeline', project: 'Mobile SDK v3', time: '2 days ago', icon: GitBranch, color: 'text-secondary bg-secondary/10' },
    { id: 10, type: 'ticket', action: 'Escalated ticket', target: 'Memory Leak in Worker Threads', project: 'Core Platform', time: '2 days ago', icon: AlertCircle, color: 'text-red-500 bg-red-50' },
    { id: 11, type: 'release', action: 'Created release', target: 'v2.5.0 Beta', project: 'Client Portal', time: '2 days ago', icon: Rocket, color: 'text-emerald-500 bg-emerald-50' },
    { id: 12, type: 'deploy', action: 'Deployed to staging', target: 'v2.5.0-rc1', project: 'Client Portal', time: '3 days ago', icon: Zap, color: 'text-amber-500 bg-amber-50' },
    { id: 13, type: 'ticket', action: 'Closed ticket', target: 'CSP Header Misconfiguration', project: 'Auth Service', time: '3 days ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { id: 14, type: 'comment', action: 'Left feedback on', target: 'Sprint 14 Retrospective', project: 'Workflows', time: '3 days ago', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
    { id: 15, type: 'ticket', action: 'Created ticket', target: 'Redis Cache Invalidation Bug', project: 'Core Platform', time: '4 days ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { id: 16, type: 'workflow', action: 'Updated workflow', target: 'Release Readiness Checklist', project: 'Client Portal', time: '4 days ago', icon: GitBranch, color: 'text-secondary bg-secondary/10' },
    { id: 17, type: 'release', action: 'Froze release scope', target: 'v2.4.1 Hotfix', project: 'Client Portal', time: '4 days ago', icon: Rocket, color: 'text-emerald-500 bg-emerald-50' },
    { id: 18, type: 'ticket', action: 'Resolved ticket', target: 'Dashboard Metrics Latency', project: 'Core Platform', time: '5 days ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { id: 19, type: 'comment', action: 'Mentioned in', target: 'API v3 Migration Discussion', project: 'Core Platform', time: '5 days ago', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
    { id: 20, type: 'deploy', action: 'Rolled back deployment', target: 'v2.3.9 Patch', project: 'Auth Service', time: '5 days ago', icon: Zap, color: 'text-red-500 bg-red-50' },
    { id: 21, type: 'ticket', action: 'Created ticket', target: 'GraphQL N+1 Query Optimization', project: 'Core Platform', time: '6 days ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { id: 22, type: 'workflow', action: 'Archived workflow', target: 'Legacy Approval Flow', project: 'Auth Service', time: '6 days ago', icon: GitBranch, color: 'text-secondary bg-secondary/10' },
    { id: 23, type: 'release', action: 'Added tickets to', target: 'v2.5.0 Beta', project: 'Client Portal', time: '1 week ago', icon: Rocket, color: 'text-emerald-500 bg-emerald-50' },
    { id: 24, type: 'ticket', action: 'Assigned ticket', target: 'Mobile Push Notification Service', project: 'Mobile SDK v3', time: '1 week ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
    { id: 25, type: 'comment', action: 'Approved design for', target: 'New Onboarding Flow', project: 'Client Portal', time: '1 week ago', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
    { id: 26, type: 'deploy', action: 'Deployed to production', target: 'v2.3.8 Stable', project: 'Core Platform', time: '1 week ago', icon: Zap, color: 'text-amber-500 bg-amber-50' },
    { id: 27, type: 'ticket', action: 'Resolved ticket', target: 'Email Template Rendering Bug', project: 'Auth Service', time: '1 week ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { id: 28, type: 'workflow', action: 'Cloned workflow', target: 'Sprint Execution Pipeline', project: 'Mobile SDK v3', time: '2 weeks ago', icon: GitBranch, color: 'text-secondary bg-secondary/10' },
    { id: 29, type: 'release', action: 'Passed security audit for', target: 'Q1 2026 Compliance', project: 'Auth Service', time: '2 weeks ago', icon: Shield, color: 'text-emerald-500 bg-emerald-50' },
    { id: 30, type: 'ticket', action: 'Created epic', target: 'Mobile SDK v3 Architecture', project: 'Mobile SDK v3', time: '2 weeks ago', icon: Layers, color: 'text-secondary bg-secondary/10' },
];

const SKILLS = ['React', 'Node.js', 'TypeScript', 'System Design', 'DevOps', 'PostgreSQL', 'GraphQL', 'CI/CD Pipelines'];

const INTEGRATIONS_DATA = [
    { name: 'GitHub', status: 'connected', icon: Github, detail: '@alexander-pierce', color: 'text-slate-900' },
    { name: 'Slack', status: 'connected', icon: MessageSquare, detail: '#clarity-dev', color: 'text-purple-600' },
    { name: 'Jira', status: 'disconnected', icon: Layers, detail: 'Not connected', color: 'text-blue-500' },
];

const ProfilePage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Form and Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        title: user?.role || ''
    });

    // Modals State
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [showMfaModal, setShowMfaModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Org users for auth modal (fetched from API, matching org page)
    const [orgUsers, setOrgUsers] = useState([]);

    // Notification preferences
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        inApp: true,
        weeklyDigest: false,
    });

    // Integration toggle state
    const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA);

    const currentUserRank = HIERARCHY[user?.role] || 0;

    // Fetch org users when auth modal opens
    useEffect(() => {
        if (showAuthModal && orgUsers.length === 0) {
            const fetchUsers = async () => {
                try {
                    const data = await usersApi.getUsers();
                    const rolePower = { 'FOUNDER': 6, 'ADMIN': 5, 'INVESTOR': 4, 'MANAGER': 3, 'MEMBER': 2, 'INTERN': 1 };
                    const sorted = data.sort((a, b) => (rolePower[b.role] || 0) - (rolePower[a.role] || 0));
                    setOrgUsers(sorted);
                } catch (err) {
                    console.error('Failed to fetch users:', err);
                }
            };
            fetchUsers();
        }
    }, [showAuthModal]);

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async () => {
        try {
            const updatedUser = {
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            };
            login(updatedUser, localStorage.getItem('token'));
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save:', err);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setOrgUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const toggleIntegration = (idx) => {
        setIntegrations(prev => prev.map((int, i) =>
            i === idx ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected', detail: int.status === 'connected' ? 'Not connected' : int.detail === 'Not connected' ? 'Reconnected' : int.detail } : int
        ));
    };

    // RBAC Permission Check
    const canEditRole = (targetRole) => {
        const targetRank = HIERARCHY[targetRole] || 0;
        if (user?.role === 'FOUNDER' || user?.role === 'CO_OWNER') return true;
        return currentUserRank > targetRank;
    };
    const isEditable = user?.role === 'FOUNDER' || user?.role === 'CO_OWNER' || user?.role === 'ADMIN';

    // Use user's actual profile picture — same as header
    const avatarUrl = user?.profilePicture || null;

    // Portal-rendered MFA Modal
    const MfaModal = () => ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowMfaModal(false)} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-scale-in border border-slate-100">
                <button onClick={() => setShowMfaModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
                        <Lock className="w-7 h-7 text-secondary" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Multi-Factor Authentication</h2>
                    <p className="text-sm font-medium text-slate-500">
                        {mfaEnabled
                            ? "MFA is currently active. Disabling it reduces your account security significantly."
                            : "Enabling MFA adds an additional verification layer to protect your workspace access."
                        }
                    </p>
                </div>
                {!mfaEnabled && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How it works</p>
                        <div className="space-y-2">
                            {['Download an authenticator app (Google Authenticator, Authy)', 'Scan the QR code we provide', 'Enter the 6-digit code to verify'].map((step, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-[10px] font-bold text-secondary mt-0.5">{i + 1}.</span>
                                    <span className="text-xs font-medium text-slate-600">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-8 space-y-3">
                    <button
                        className={`w-full h-12 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${mfaEnabled
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-secondary hover:bg-secondary/90 text-white'}`}
                        onClick={() => { setMfaEnabled(!mfaEnabled); setShowMfaModal(false); }}
                    >
                        <Lock className="w-4 h-4" />
                        {mfaEnabled ? 'Deactivate MFA' : 'Activate MFA'}
                    </button>
                    <button className="w-full h-10 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-xl border border-slate-100 hover:bg-slate-50" onClick={() => setShowMfaModal(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );

    // Portal-rendered Auth Modal — full employee list matching org page
    const AuthModal = () => ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowAuthModal(false)} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scale-in border border-slate-100 flex flex-col max-h-[85vh] relative z-10">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-secondary" />
                            Manage Authorization
                        </h2>
                        <p className="text-xs font-medium text-slate-500 mt-1">Assign roles based on organizational hierarchy. Changes apply across all workspace nodes.</p>
                    </div>
                    <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {!isEditable ? (
                        <div className="text-center py-12 space-y-3">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-2 mx-auto">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Access Denied</h3>
                            <p className="text-sm font-medium text-slate-500">Your current clearance level ({user?.role}) does not permit modifying organizational roles.</p>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="flex items-center gap-4 px-4 pb-3 mb-3 border-b border-slate-100 text-[9px] font-medium uppercase tracking-widest text-slate-400">
                                <div className="w-[40%]">Identity</div>
                                <div className="w-[25%]">Position</div>
                                <div className="w-[20%]">Status</div>
                                <div className="w-[15%] text-right">Clearance</div>
                            </div>

                            {/* Employee Rows — org-page style */}
                            <div className="space-y-1">
                                {orgUsers.map((emp, index) => {
                                    const hash = emp.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
                                    const states = ['Online', 'Offline', 'In-Meeting'];
                                    const status = states[hash % 3];
                                    return (
                                        <div key={emp.id} className={`flex items-center gap-4 py-2.5 px-4 rounded-xl transition-all ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'} hover:bg-slate-50 hover:shadow-sm border border-transparent`}>
                                            <div className="w-[40%] flex items-center gap-3">
                                                {emp.profilePicture ? (
                                                    <img src={emp.profilePicture} alt={emp.firstName} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 shadow-sm shrink-0">
                                                        {emp.firstName?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-slate-900 truncate">
                                                        {emp.firstName} {emp.lastName}
                                                        {emp.email === user?.email && <span className="text-[8px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-md ml-2 inline-block font-bold">YOU</span>}
                                                    </p>
                                                    <p className="text-[9px] font-medium text-slate-400 truncate">{emp.email}</p>
                                                </div>
                                            </div>
                                            <div className="w-[25%]">
                                                <p className="text-[11px] font-semibold text-slate-700 truncate">{emp.position || 'Operations Member'}</p>
                                                <p className="text-[9px] font-medium text-slate-400 truncate">{emp.department || 'General Operations'}</p>
                                            </div>
                                            <div className="w-[20%] flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${status === 'Online' ? 'bg-emerald-500 animate-pulse' : status === 'In-Meeting' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                                                <span className={`text-[10px] font-medium ${status === 'Online' ? 'text-emerald-600' : status === 'In-Meeting' ? 'text-amber-600' : 'text-slate-500'}`}>{status}</span>
                                            </div>
                                            <div className="w-[15%] text-right">
                                                {isEditable && emp.email !== user?.email ? (
                                                    <select
                                                        value={emp.role}
                                                        onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                                                        className="appearance-none bg-slate-50 border border-slate-100 text-[8px] font-bold uppercase tracking-widest rounded-md px-2 py-1.5 outline-none cursor-pointer hover:bg-slate-100 text-slate-900"
                                                    >
                                                        {Object.keys(HIERARCHY).filter(r => r !== 'CO_OWNER').map(role => (
                                                            <option key={role} value={role} disabled={!canEditRole(role)}>{role}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md
                                                        ${emp.role === 'FOUNDER' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                            emp.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                                emp.role === 'INVESTOR' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                                    'bg-slate-100 text-slate-600 border border-slate-200'}
                                                    `}>
                                                        {emp.role}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );

    return (
        <div className="max-w-6xl mx-auto space-y-4 -mt-4 animate-fade-slide-up pb-16 px-4 sm:px-6">

            {/* Header */}
            <div className="flex items-end justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Identity Hub</span>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase flex items-center gap-3">
                        <User className="w-8 h-8 text-secondary" />
                        User Profile
                    </h1>
                </div>
                <Button
                    variant={isEditing ? 'primary' : 'secondary'}
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="h-10 text-xs font-semibold uppercase tracking-widest px-6"
                >
                    {isEditing ? 'Save Profile' : 'Edit Details'}
                </Button>
            </div>

            {/* Top Row: Identity Card + Account Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Identity Card */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center relative overflow-hidden">
                        <div className="relative inline-block mx-auto mb-3 z-10">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl rotate-2" />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-slate-900/10 rotate-3">
                                    {(user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                                </div>
                            )}
                            {isEditing && (
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="relative z-10 space-y-1">
                            {isEditing ? (
                                <div className="space-y-2 pt-2">
                                    <Input name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="First Name" className="text-center font-bold h-10 rounded-xl bg-white border-slate-200 text-slate-900" />
                                    <Input name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Last Name" className="text-center font-bold h-10 rounded-xl bg-white border-slate-200 text-slate-900" />
                                </div>
                            ) : (
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    {user?.firstName ? `${user.firstName} ${user.lastName}` : 'System User'}
                                </h2>
                            )}

                            {isEditing ? (
                                <Input name="title" value={formData.title} onChange={handleFormChange} placeholder="Role / Title" className="text-center font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl mt-2 bg-white border-slate-200 text-slate-900" />
                            ) : (
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                                    {user?.role === 'FOUNDER' || user?.role === 'CO_OWNER' ? 'FOUNDER' : user?.role || 'Verified Member'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Account Details</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Email</p>
                                    <p className="text-sm font-bold text-slate-900">{user?.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Joined</p>
                                    <p className="text-sm font-bold text-slate-900">Oct 14, 2025</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Last Active</p>
                                    <p className="text-sm font-bold text-slate-900">Just now</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Activity className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Sessions</p>
                                    <p className="text-sm font-bold text-slate-900">247 total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-3">

                    {/* Organization Banner */}
                    <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-slate-900/10 relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer" onClick={() => navigate('/app/organization')}>
                        <div className="relative z-10 space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-3.5 h-3.5 text-secondary" />
                                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Organizational Origin</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">{user?.organization || 'Independent'}</h2>
                            <p className="text-xs text-slate-400 font-medium max-w-sm">Tap to view organization metrics, active team members, and billing tier.</p>
                        </div>
                        <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-secondary group-hover:scale-110 transition-all shadow-sm">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary/20 blur-3xl rounded-full pointer-events-none group-hover:bg-secondary/30 transition-colors" />
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900">142</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Tickets Resolved</p>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+3</span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900">17</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Projects Owned</p>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                                    <Award className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">Streak</span>
                            </div>
                            <p className="text-2xl font-extrabold text-slate-900">89</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Events Processed</p>
                        </div>
                    </div>

                    {/* Skills / Expertise */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5" /> Skills & Expertise
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 hover:border-secondary/30 hover:text-secondary transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" /> Security & Settings
                        </h3>
                        <div className="grid gap-2">
                            {/* MFA Toggle */}
                            <button onClick={() => setShowMfaModal(true)} className="w-full flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-secondary/30 transition-all text-left">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${mfaEnabled ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-slate-400 group-hover:text-secondary'}`}>
                                        <Lock className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Multi-Factor Authentication</p>
                                        <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{mfaEnabled ? 'Currently Active' : 'Enhance Account Security'}</p>
                                    </div>
                                </div>
                                <div className={`w-9 h-5 rounded-full relative transition-colors ${mfaEnabled ? 'bg-secondary' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${mfaEnabled ? 'left-[18px] shadow-sm' : 'left-0.5'}`} />
                                </div>
                            </button>

                            {/* Manage Authorization */}
                            <button onClick={() => setShowAuthModal(true)} className="w-full flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-secondary/30 transition-all text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-secondary transition-colors">
                                        <Shield className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Manage Authorization</p>
                                        <p className="text-[9px] font-medium text-slate-500">RBAC Permissions Engine</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-slate-300 group-hover:text-secondary transition-colors">&rarr;</div>
                            </button>

                            {/* Organization Hub */}
                            <button onClick={() => navigate('/app/organization')} className="w-full flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-secondary/30 transition-all text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-secondary transition-colors">
                                        <Globe className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Go to Organization Hub</p>
                                        <p className="text-[9px] font-medium text-slate-500">View network and analytics</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-slate-300 group-hover:text-secondary transition-colors">&rarr;</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Activity + Notifications + Integrations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Activity Timeline */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" /> Recent Activity
                    </h3>
                    <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {RECENT_ACTIVITY.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700">
                                        <span className="font-medium">{item.action}</span>{' '}
                                        <span className="font-bold text-slate-900">{item.target}</span>
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                        {item.project} · {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Notifications + Integrations */}
                <div className="space-y-3">

                    {/* Notification Preferences */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5" /> Notifications
                        </h3>
                        <div className="space-y-3">
                            {[
                                { key: 'email', label: 'Email Alerts', desc: 'Ticket updates, mentions' },
                                { key: 'push', label: 'Push Notifications', desc: 'Real-time browser alerts' },
                                { key: 'inApp', label: 'In-App Notifications', desc: 'Activity feed updates' },
                                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary every Monday' },
                            ].map(pref => (
                                <button
                                    key={pref.key}
                                    onClick={() => setNotifications(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-secondary/20 transition-all text-left"
                                >
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{pref.label}</p>
                                        <p className="text-[9px] font-medium text-slate-400">{pref.desc}</p>
                                    </div>
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${notifications[pref.key] ? 'bg-secondary' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${notifications[pref.key] ? 'left-[18px]' : 'left-0.5'}`} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Connected Integrations */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" /> Integrations
                        </h3>
                        <div className="space-y-3">
                            {integrations.map((int, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${int.color}`}>
                                            <int.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{int.name}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{int.detail}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleIntegration(idx)}
                                        className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${int.status === 'connected'
                                            ? 'text-emerald-600 bg-emerald-50 hover:bg-red-50 hover:text-red-500'
                                            : 'text-secondary bg-secondary/10 hover:bg-secondary/20'}`}
                                    >
                                        {int.status === 'connected' ? 'Connected' : 'Connect'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mount Modals via Portal */}
            {showMfaModal && <MfaModal />}
            {showAuthModal && <AuthModal />}

        </div>
    );
};

export default ProfilePage;
