import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Shield, ArrowRight, Briefcase, User, Building2, Rocket, ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * Register Page - Multi-step Organizational Onboarding
 */
const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [orgData, setOrgData] = useState({
        name: '',
        industry: '',
        size: '',
        description: '',
        website: ''
    });
    const [wantsOrg, setWantsOrg] = useState(null); // null, true, false
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOrgChange = (e) => {
        setOrgData({ ...orgData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setIsSubmitting(false);
            return;
        }

        try {
            const signupPayload = {
                ...formData,
                orgDetails: wantsOrg ? orgData : null
            };
            await signup(signupPayload);
            navigate('/app/dashboard');
        } catch (err) {
            alert(err.message || 'Registration failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row animate-fade-in font-sans">

            {/* LEFT: Aesthetic Narrative Sidebar */}
            <div className="hidden lg:flex w-5/12 bg-slate-900 flex-col justify-between p-16 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-10">
                    <div className="space-y-2">
                        <span className="text-[10px] font-medium text-secondary uppercase tracking-[0.4em]">New Account</span>
                        <h2 className="text-3xl font-extrabold tracking-tight leading-none text-white">Create Your Identity</h2>
                    </div>
                    <div className="space-y-6">
                        <p className="text-base text-slate-400 font-normal leading-relaxed">
                            {step === 1 ? 'Start by setting up your personal profile' :
                                step === 2 ? 'Choose how you want to organize your work' :
                                    'Provide details about your organization'}
                        </p>
                        <div className="h-px w-12 bg-secondary/50" />
                        <div className="space-y-4">
                            {[
                                { label: 'Personal Info', active: step >= 1 },
                                { label: 'Workspace Setup', active: step >= 2 },
                                { label: 'Organization Details', active: step >= 3 }
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-3 transition-opacity ${item.active ? 'opacity-100' : 'opacity-30'}`}>
                                    {item.active ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-slate-300">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/5 blur-[80px] rounded-full" />
            </div>

            {/* RIGHT: Registration Form */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center items-center px-8 md:px-24 py-12 overflow-y-auto bg-white">
                <div className="w-full max-w-xl space-y-10">

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Step {step}</h1>
                            <p className="text-sm text-slate-500 font-normal">
                                {step === 1 ? 'Enter your personal details' :
                                    step === 2 ? 'Choose your workspace type' :
                                        'Tell us about your organization'}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${step === s ? 'bg-secondary w-10' : 'bg-slate-100'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Personal Identity */}
                    {step === 1 && (
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 pl-1">First Name</label>
                                    <Input name="firstName" placeholder="Jane" className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 pl-1">Last Name</label>
                                    <Input name="lastName" placeholder="Doe" className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <select name="role" className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 font-normal appearance-none focus:outline-none focus:border-secondary transition-colors text-sm" value={formData.role} onChange={handleChange} required>
                                        <option value="" disabled>Select Authority Level</option>
                                        <option value="INTERN">Intern</option>
                                        <option value="MEMBER">Member</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="FOUNDER">Founder</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">Email</label>
                                <Input type="email" name="email" placeholder="you@company.com" className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 pl-1">Password</label>
                                    <Input type="password" name="password" placeholder="••••••••" className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 pl-1">Confirm Password</label>
                                    <Input type="password" name="confirmPassword" placeholder="••••••••" className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={formData.confirmPassword} onChange={handleChange} required />
                                </div>
                            </div>

                            <button className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group transition-all" type="submit">
                                Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </form>
                    )}

                    {/* Step 2: Strategic Choice */}
                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                                <Rocket className="w-10 h-10 text-secondary" />
                                <h3 className="text-lg font-bold text-slate-900">Set up your workspace</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                                    Create an organization to collaborate with your team, or continue as an individual.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <button
                                    onClick={() => { setWantsOrg(true); nextStep(); }}
                                    className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-secondary hover:shadow-lg transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Building2 className="w-5 h-5 text-secondary" />
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 mb-1">Create Organization</p>
                                    <p className="text-xs text-slate-500 font-normal">Set up a shared workspace for your team</p>
                                </button>

                                <button
                                    onClick={() => { setWantsOrg(false); handleSubmit(); }}
                                    className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all text-left group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <User className="w-5 h-5 text-slate-400" />
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 mb-1">Continue Solo</p>
                                    <p className="text-xs text-slate-500 font-normal">Continue without an organization for now</p>
                                </button>
                            </div>

                            <button onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 font-normal hover:text-slate-900 transition-colors">
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                        </div>
                    )}

                    {/* Step 3: Organization Details */}
                    {step === 3 && (
                        <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">Organization Name</label>
                                <Input name="name" placeholder="Acme Inc." className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={orgData.name} onChange={handleOrgChange} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 pl-1">Industry</label>
                                    <Input name="industry" placeholder="Technology" className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={orgData.industry} onChange={handleOrgChange} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 pl-1">Team Size</label>
                                    <select name="size" className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-normal appearance-none focus:outline-none focus:border-secondary text-sm" value={orgData.size} onChange={handleOrgChange}>
                                        <option value="" disabled>Select size</option>
                                        <option value="1-10">1–10 people</option>
                                        <option value="11-50">11–50 people</option>
                                        <option value="51-200">51–200 people</option>
                                        <option value="200+">200+ people</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">Description</label>
                                <textarea name="description" placeholder="What does your organization do?" className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl p-4 font-normal text-sm focus:outline-none focus:border-secondary transition-colors" value={orgData.description} onChange={handleOrgChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 pl-1">Website</label>
                                <Input name="website" placeholder="https://..." className="h-11 bg-slate-50 border-slate-200 rounded-xl px-4 font-normal" value={orgData.website} onChange={handleOrgChange} />
                            </div>

                            <button className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group transition-all" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Organization'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            <button type="button" onClick={prevStep} className="flex items-center gap-2 text-xs text-slate-500 font-normal hover:text-slate-900 transition-colors">
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                        </form>
                    )}

                    <div className="flex flex-col items-center gap-3 pt-3">
                        <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Home
                        </button>
                        <div className="h-px w-8 bg-slate-100" />
                        <button type="button" onClick={() => navigate('/login')} className="text-xs text-slate-500 font-normal hover:text-slate-900 transition-colors">
                            Already have an account? <span className="text-secondary font-medium">Sign in</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
