import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, API_BASE_URL } from '../api/auth';
import { User, Shield, Building2, Image as ImageIcon, CheckCircle, AlertCircle, Save, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/**
 * Settings - User Profile & Identity Management
 */
const Settings = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        organization: '',
        profilePicture: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.getCurrentUser();
            if (data && data.user) {
                setUser(data.user);
                setFormData({
                    firstName: data.user.firstName || '',
                    lastName: data.user.lastName || '',
                    organization: data.user.organization || '',
                    profilePicture: data.user.profilePicture || ''
                });
            } else {
                setError('Identity context not found.');
            }
        } catch (err) {
            setError('Failed to fetch identity context.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                // Note: Auth middleware handles identification via cookie
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to update profile');

            setStatus({ type: 'success', message: 'Identity context synchronized successfully.' });
            // Refresh page to update sidebar/context
            setTimeout(() => window.location.reload(), 1500);
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
                    <span className="text-slate-400 text-sm font-medium animate-pulse">Initializing Identity Interface...</span>
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
                        <h3 className="text-xl font-bold text-slate-900">Identity Fetch Failure</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{error}</p>
                    </div>
                    <Button
                        onClick={fetchUserData}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl font-semibold text-sm tracking-wide hover:bg-slate-800 transition-all"
                    >
                        Retry Synchronization
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-slide-up pb-20 -mt-4 max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Bureau Protocol</span>
                    <div className="h-px w-8 bg-slate-200" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Identity <span className="text-secondary">Context</span>.
                </h1>
                <p className="text-slate-500 font-normal max-w-2xl">
                    Manage your reasoning identity and organizational visibility.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left: Identity Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-8">
                        {status.message && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success'
                                ? 'bg-green-50 border-green-100 text-green-700'
                                : 'bg-red-50 border-red-100 text-red-700'
                                }`}>
                                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="text-xs font-medium">{status.message}</span>
                            </div>
                        )}

                        {/* Basic Info */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-secondary" />
                                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Personal Identity</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 pl-1">First Name</label>
                                    <Input
                                        name="firstName"
                                        className="h-12 bg-white border-slate-100 rounded-xl px-4 font-medium"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 pl-1">Last Name</label>
                                    <Input
                                        name="lastName"
                                        className="h-12 bg-white border-slate-100 rounded-xl px-4 font-medium"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Professional Context (Read-Only) */}
                        <section className="space-y-5 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 text-secondary" />
                                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Organizational Origin</h2>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 pl-1 mb-1 block">Organization Name</label>
                                    <div className="h-12 bg-white border border-slate-200 rounded-xl px-4 font-semibold text-slate-900 flex items-center">
                                        {formData.organization || 'Independent Workspace'}
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic mt-2 pl-1">
                                        Organization structure and billing is managed centrally.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => navigate('/app/organization')}
                                    className="w-full h-12 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                    Open in Organization Dashboard <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </section>

                        {/* Appearance / Avatar */}
                        <section className="space-y-5 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <ImageIcon className="w-4 h-4 text-secondary" />
                                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Visual Indicator</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 pl-1">Profile Picture URL</label>
                                <Input
                                    name="profilePicture"
                                    placeholder="https://images.unsplash.com/..."
                                    className="h-12 bg-white border-slate-100 rounded-xl px-4 font-medium"
                                    value={formData.profilePicture}
                                    onChange={handleChange}
                                />
                                <p className="text-[10px] text-slate-400 italic mt-2">Enter a direct image link to initialize your visual presence.</p>
                            </div>
                        </section>

                        <div className="pt-6 border-t border-slate-100">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold text-sm tracking-wide shadow-lg flex items-center justify-center gap-3 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                {isSubmitting ? 'Synchronizing...' : 'Update Identity Context'}
                            </Button>
                        </div>
                    </form>
                    </div>
                </div>

                {/* Right: Identity Card Preview */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-12 p-10 bg-[#fbfcfd] border border-slate-100 rounded-2xl space-y-10 shadow-sm overflow-hidden">
                        {/* Branding Header in Card */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                            <div className="space-y-1">
                                <span className="text-2xl font-extrabold text-slate-900 tracking-normal uppercase">CLARITY</span>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identity Status</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-bold text-green-600 uppercase">Authenticated</span>
                            </div>
                        </div>

                        {/* Visual & Core Identity */}
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-white border-2 border-slate-50 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner p-1">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <Shield className="w-10 h-10 text-slate-100" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Authority Level</p>
                                <p className="text-lg font-bold text-secondary uppercase tracking-tight">{user.role}</p>
                            </div>
                        </div>

                        {/* Detailed Identity Context */}
                        <div className="space-y-8 pt-4">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Bearer Name</p>
                                    <p className="text-sm font-semibold text-slate-900">{formData.firstName} {formData.lastName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Access Port</p>
                                    <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Project</p>
                                <p className="text-sm font-semibold text-slate-900">{formData.organization}</p>
                            </div>
                        </div>

                        <div className="pt-10">
                            <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2">Protocol Fingerprint</p>
                                <p className="text-[10px] font-mono text-slate-400 break-all">{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
