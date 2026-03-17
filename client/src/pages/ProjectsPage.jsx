import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectsHeader from '../components/projects/ProjectsHeader';
import ProjectsTable from '../components/projects/ProjectsTable';
import { projectsApi } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import AllUnitsDrawer from '../components/projects/AllUnitsDrawer';

const ProjectsPage = () => {
    const { user } = useAuth();
    const canCreateProject = ['MANAGER', 'ADMIN', 'FOUNDER'].includes(user?.role?.toUpperCase());

    const [allProjects, setAllProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [currentTeam, setCurrentTeam] = useState('All Units');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUnitsDrawerOpen, setIsUnitsDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Hardcoded execution units as requested
    const availableTeams = ['Alpha', 'Beta', 'Gamma', 'Omega'];

    // Read ?team= query param from URL (e.g. from Analytics unit efficiency click)
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const teamParam = searchParams.get('team');
        if (teamParam && availableTeams.includes(teamParam)) {
            setCurrentTeam(teamParam);
            if (allProjects.length > 0) {
                applyFilters(searchQuery, teamParam, allProjects);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const data = await projectsApi.getProjects();
            setAllProjects(data);
            applyFilters(searchQuery, currentTeam, data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = (query, team, list = allProjects) => {
        let filtered = [...list];

        if (team !== 'All Units') {
            filtered = filtered.filter(p => p.team === team);
        }

        if (query) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.id && p.id.toString().toLowerCase().includes(query.toLowerCase()))
            );
        }

        setProjects(filtered);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        applyFilters(query, currentTeam);
    };

    const handleTeamChange = (team) => {
        setCurrentTeam(team);
        applyFilters(searchQuery, team);
    };

    const handleAddProject = async (newProjectData) => {
        try {
            const created = await projectsApi.createProject(newProjectData);
            const updatedAll = [created, ...allProjects];
            setAllProjects(updatedAll);
            applyFilters(searchQuery, currentTeam, updatedAll);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Check if you have Manager role permissions.');
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8">
            <ProjectsHeader
                onSearch={handleSearch}
                currentTeam={currentTeam}
                onTeamChange={handleTeamChange}
                onCreateProject={() => setIsCreateModalOpen(true)}
                availableTeams={availableTeams}
                onShowAllUnits={() => setIsUnitsDrawerOpen(true)}
                showCreateButton={canCreateProject}
            />

            <div className="space-y-4">
                <ProjectsTable projects={projects} />
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleAddProject}
            />

            <AllUnitsDrawer
                isOpen={isUnitsDrawerOpen}
                onClose={() => setIsUnitsDrawerOpen(false)}
                units={availableTeams}
                onSelect={handleTeamChange}
                currentUnit={currentTeam}
            />

            {/* Platform Footer Hint */}
            <div className="flex items-center justify-center gap-3 opacity-20 hover:opacity-100 transition-opacity pt-6">
                <div className="h-px w-12 bg-slate-300" />
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.4em]">Integrated Execution System</span>
                <div className="h-px w-12 bg-slate-300" />
            </div>
        </div>
    );
};

export default ProjectsPage;
