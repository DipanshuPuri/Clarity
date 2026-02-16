import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Shield, ArrowRight, Briefcase, User, Building2 } from 'lucide-react';

/**
 * Register Page - Detailed Onboarding Gateway
 */
const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        organization: '',
        role: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setIsSubmitting(false);
            return;
        }

        try {
            await signup(formData);
            navigate('/app/dashboard');
        } catch (err) {
            alert(err.message || 'Registration failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row animate-fade-in">

            {/* LEFT: Aesthetic Narrative Sidebar */}
            <div className="hidden lg:flex w-5/12 bg-slate-900 flex-col justify-between p-16 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-10">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Bureau Initialization</span>
                        <h2 className="text-4xl font-black tracking-tight leading-none text-white drop-shadow-lg">JOIN THE NETWORK</h2>
                    </div>
                    <div className="space-y-6">
                        <p className="text-lg text-slate-300 font-medium leading-relaxed">
                            "Strategy without context is just guessing. Join the few who demand precision."
                        </p>
                        <div className="h-px w-12 bg-secondary/50" />
                        <div className="space-y-4">
                            {[
                                'Immutable Decision Records',
                                'Real-time Strategic Alignment',
                                'Context-Aware Execution'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/5 blur-[80px] rounded-full" />
            </div>

            {/* RIGHT: Registration Form */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center items-center px-8 md:px-24 py-12 overflow-y-auto">
                <div className="w-full max-w-xl space-y-10">

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Initialize Protocol</h1>
                        <p className="text-sm text-slate-400 font-medium">Create your high-fidelity profile to access the Clarity Bureau.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Personal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                                <Input
                                    name="firstName"
                                    placeholder="Jane"
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl px-4 font-medium"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                                <Input
                                    name="lastName"
                                    placeholder="Doe"
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl px-4 font-medium"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Professional Context */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Organization Identity</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                                <Input
                                    name="organization"
                                    placeholder="Acme Corp Strategic Unit"
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 font-medium"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Role Designation</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                                <Input
                                    name="role"
                                    placeholder="Senior Product Architect"
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 font-medium"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Access Email</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="jane@clarity.ai"
                                className="h-12 bg-slate-50 border-slate-100 rounded-xl px-4 font-medium"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl px-4 font-medium"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl px-4 font-medium"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group transition-all"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Establishing Link...' : 'INITIALIZE ACCOUNT'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </Button>

                        <div className="text-center">
                            <button type="button" onClick={() => navigate('/login')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                Already maintain an identity? <span className="text-secondary border-b border-secondary/20 pb-0.5">Access Portal</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
