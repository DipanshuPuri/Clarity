import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { ticketsApi } from '../api/tickets';
import { useAuth } from '../context/AuthContext';
import ProjectDetailHeader from '../components/projects/ProjectDetailHeader';
import TicketsTable from '../components/projects/TicketsTable';
import ContributorsPanel from '../components/projects/ContributorsPanel';
import TicketDrawer from '../components/projects/TicketDrawer';
import AssignMemberModal from '../components/projects/AssignMemberModal';
import CreateTicketModal from '../components/projects/CreateTicketModal';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [project, setProject] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Modal States
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTicketForEdit, setSelectedTicketForEdit] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const canEditProject = ['MANAGER', 'ADMIN', 'FOUNDER'].includes(user?.role);
    // Everyone can create/edit tickets as per requirements
    const canCreateTicket = true;
    const canEditTicket = true;

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        setIsLoading(true);
        try {
            const data = await projectsApi.getProjectById(projectId);
            setProject(data);
            setTickets(data.tickets || []);
            setActivities(data.activities || []);

            // Update selected ticket if open in drawer
            if (selectedTicket) {
                const updatedTicket = data.tickets?.find(t => t.id === selectedTicket.id);
                if (updatedTicket) setSelectedTicket(updatedTicket);
            } else {
                // Check if a ticketId is passed in the URL to open
                const urlTicketId = searchParams.get('ticketId');
                if (urlTicketId) {
                    const foundTicket = data.tickets?.find(t => t.id === urlTicketId);
                    if (foundTicket) setSelectedTicket(foundTicket);
                }
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTicket = async (ticketData) => {
        try {
            await ticketsApi.createTicket({ ...ticketData, projectId });
            fetchProjectDetails();
            setIsTicketModalOpen(false);
        } catch (error) {
            console.error('Failed to create ticket:', error);
        }
    };

    const handleUpdateTicket = async (ticketId, ticketData) => {
        try {
            await ticketsApi.updateTicket(ticketId, ticketData);
            fetchProjectDetails();
            setIsTicketModalOpen(false);
            setSelectedTicketForEdit(null);
        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };

    const handleUpdateTicketStatus = async (ticketId, status) => {
        try {
            await ticketsApi.updateTicket(ticketId, { status });
            fetchProjectDetails();
        } catch (error) {
            console.error('Failed to update ticket status:', error);
        }
    };

    const executeDeleteTicket = async () => {
        if (!ticketToDelete) return;
        try {
            await ticketsApi.deleteTicket(ticketToDelete);
            setTickets(tickets.filter(t => t.id !== ticketToDelete));
            if (selectedTicket?.id === ticketToDelete) {
                setSelectedTicket(null);
            }
            setTicketToDelete(null);
        } catch (error) {
            console.error('Failed to delete ticket:', error);
            alert('Failed to delete ticket. Check permissions.');
        }
    };

    const executeDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await projectsApi.deleteProject(projectToDelete);
            setProjectToDelete(null);
            navigate('/app/projects');
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project. Check permissions.');
        }
    };

    const handleUpdateProject = async (projectId, projectData) => {
        try {
            await projectsApi.updateProject(projectId, projectData);
            fetchProjectDetails();
            setIsProjectModalOpen(false);
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const handleAssignMember = async (member) => {
        try {
            await projectsApi.assignMember(projectId, { userId: member.id });
            fetchProjectDetails();
        } catch (error) {
            console.error('Failed to assign member:', error);
            alert('Failed to assign member. Check permissions.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-secondary rounded-full animate-spin" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-6 lg:px-8">
            <ProjectDetailHeader
                project={project}
                onAddTicket={() => {
                    setSelectedTicketForEdit(null);
                    setIsTicketModalOpen(true);
                }}
                onAddContributor={() => setIsAssignModalOpen(true)}
                canEdit={canEditProject}
                onEdit={() => setIsProjectModalOpen(true)}
                onDelete={(id) => setProjectToDelete(id)}
                onUpdateStatus={(id, data) => handleUpdateProject(id, data)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    <TicketsTable
                        tickets={tickets}
                        onTicketClick={setSelectedTicket}
                    />
                </div>
                <div className="lg:col-span-4 space-y-8">
                    <ContributorsPanel
                        contributors={project.members || []}
                        onAssign={() => setIsAssignModalOpen(true)}
                    />
                </div>
            </div>

            <TicketDrawer
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                ticket={selectedTicket}
                onComment={(t, c) => console.log('Comment:', c)}
                canEdit={canEditTicket}
                onEdit={(ticket) => {
                    setSelectedTicketForEdit(ticket);
                    setIsTicketModalOpen(true);
                }}
                onDelete={(id) => setTicketToDelete(id)}
                onUpdateStatus={handleUpdateTicketStatus}
            />

            <CreateTicketModal
                isOpen={isTicketModalOpen}
                onClose={() => {
                    setIsTicketModalOpen(false);
                    setSelectedTicketForEdit(null);
                }}
                onCreate={handleCreateTicket}
                onUpdate={handleUpdateTicket}
                ticket={selectedTicketForEdit}
                isEditing={!!selectedTicketForEdit}
            />

            <CreateProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                project={project}
                isEditing={true}
                onUpdate={handleUpdateProject}
            />

            <AssignMemberModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssignMember}
            />

            <ConfirmationModal
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={executeDeleteProject}
                title="Delete Project"
                message={`Are you sure you want to delete this project? This action cannot be undone and will permanently erase all associated tickets, workflows, and data.`}
                confirmText="Delete Project"
                isDangerous={true}
            />

            <ConfirmationModal
                isOpen={!!ticketToDelete}
                onClose={() => setTicketToDelete(null)}
                onConfirm={executeDeleteTicket}
                title="Delete Ticket"
                message="Are you sure you want to delete this ticket? This action cannot be undone."
                confirmText="Delete Ticket"
                isDangerous={true}
            />
        </div>
    );
};

export default ProjectDetailPage;
