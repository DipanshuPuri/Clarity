import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Layers, Rocket, ShieldAlert, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReleaseBanner = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [activeRelease, setActiveRelease] = useState(null);

    useEffect(() => {
        if (!token) return;
        const fetchActive = async () => {
            try {
                // Fetch releases and pick the most critical active one (FROZEN or ACTIVE)
                const res = await axios.get('/api/releases', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const priorityReleases = res.data.filter(r => ['ACTIVE', 'FROZEN', 'READY', 'STABILIZATION'].includes(r.status));
                if (priorityReleases.length > 0) {
                    // Sort by highest risk/status
                    const sorted = priorityReleases.sort((a, b) => {
                        const score = { 'STABILIZATION': 4, 'FROZEN': 3, 'READY': 2, 'ACTIVE': 1 };
                        return (score[b.status] || 0) - (score[a.status] || 0);
                    });
                    setActiveRelease(sorted[0]);
                } else {
                    setActiveRelease(null);
                }
            } catch (e) {
                console.error("Failed to fetch running releases:", e);
            }
        };
        fetchActive();
    }, [token]);

    if (!activeRelease) return null;

    let bannerColor = 'bg-slate-900 border-slate-700 text-white';
    let icon = <Rocket className="w-3.5 h-3.5" />;

    if (activeRelease.status === 'FROZEN') {
        bannerColor = 'bg-amber-500 border-amber-600 text-white';
        icon = <ShieldAlert className="w-3.5 h-3.5" />;
    } else if (activeRelease.status === 'STABILIZATION') {
        bannerColor = 'bg-blue-600 border-blue-700 text-white';
        icon = <Cpu className="w-3.5 h-3.5" />;
    }

    return (
        <div
            onClick={() => navigate('/app/releases')}
            className={`w-full py-1.5 px-4 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] border-b cursor-pointer transition-colors hover:brightness-110 z-[100] relative ${bannerColor}`}
        >
            <div className="flex items-center gap-2">
                {icon}
                <span>Release Context Active</span>
            </div>
            <span className="opacity-50">•</span>
            <span className="truncate max-w-sm">{activeRelease.name}</span>
            <span className="opacity-50">•</span>
            <span className="font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded border border-white/10">{activeRelease.status}</span>
        </div>
    );
};

export default ReleaseBanner;
