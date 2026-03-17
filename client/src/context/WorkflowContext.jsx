import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { workflowApi } from '../api/workflows';
import { mockWorkflowsData } from '../mock/workflows';
import { workflowTemplates } from '../mock/workflowTemplates';

const getDeterministicTemplates = (projId) => {
    if (!projId) projId = 'default_unspecified';
    const allTemplates = [...(mockWorkflowsData.projects?.[0]?.workflows || []), ...workflowTemplates];

    let hash = 0;
    for (let i = 0; i < projId.length; i++) {
        hash = projId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const numTemplates = 2 + (Math.abs(hash) % 4);
    const selected = [];
    let currentHash = Math.abs(hash);
    const available = [...allTemplates];

    for (let i = 0; i < numTemplates && available.length > 0; i++) {
        const index = currentHash % available.length;
        const template = JSON.parse(JSON.stringify(available[index]));
        template.id = `${template.id}_${projId}`;
        selected.push(template);
        available.splice(index, 1);
        currentHash = (currentHash * 9301 + 49297) % 233280;
    }

    return selected;
};

const WorkflowContext = createContext();

export const useWorkflow = () => {
    const context = useContext(WorkflowContext);
    if (!context) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
};

export const WorkflowProvider = ({ children }) => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId');

    const [workflows, setWorkflows] = useState([]);
    const [activeWorkflow, setActiveWorkflow] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [viewport, setViewport] = useState(null);
    const [payloadMode, setPayloadMode] = useState(true); // true = PAYLOAD (read), false = CONFIGURE (edit)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInitialData = async (targetWorkflowId = null) => {
        setIsLoading(true);
        try {
            let globalWorkflows = [];
            if (projectId) {
                const response = await workflowApi.getByProject(projectId);

                if (response && response.length > 0) {
                    globalWorkflows = response.map(wf => ({
                        ...wf,
                        statuses: wf.nodes.map(n => ({
                            id: n.id,
                            name: n.name,
                            category: n.type,
                            color: n.color || '#cbd5e1',
                            progressStatus: 'pending',
                            positionX: n.positionX,
                            positionY: n.positionY,
                            description: n.description || '',
                            owners: n.owners || [],
                            history: n.history || [],
                            executionNotes: n.executionNotes || [],
                            discussions: n.discussions || []
                        })),
                        transitions: wf.edges.map(e => ({
                            id: e.id,
                            label: e.name,
                            fromStatusId: e.fromNodeId,
                            toStatusId: e.toNodeId,
                            owners: e.owners || []
                        }))
                    }));
                } else {
                    globalWorkflows = getDeterministicTemplates(projectId);
                }
            } else {
                globalWorkflows = getDeterministicTemplates('default_unspecified');
            }

            setWorkflows(globalWorkflows);

            if (targetWorkflowId) {
                const target = globalWorkflows.find(w => w.id === targetWorkflowId);
                setActiveWorkflow(target || (globalWorkflows.length > 0 ? globalWorkflows[0] : null));
            } else if (activeWorkflow) {
                const preserved = globalWorkflows.find(w => w.id === activeWorkflow.id);
                setActiveWorkflow(preserved || (globalWorkflows.length > 0 ? globalWorkflows[0] : null));
            } else {
                setActiveWorkflow(globalWorkflows.length > 0 ? globalWorkflows[0] : null);
            }

            setSelectedNodeId(null);
            setSelectedEdgeId(null);
            setViewport(null);
            setHasUnsavedChanges(false);
        } catch (err) {
            setError('Failed to load workflow data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load - Fetch from API based on projectId
    useEffect(() => {
        fetchInitialData();
    }, [projectId]);

    const discardChanges = async (targetWorkflowId = null) => {
        await fetchInitialData(targetWorkflowId);
    };

    const saveActiveWorkflow = async (options = {}) => {
        const { skipValidation = false } = options;
        if (!activeWorkflow || activeWorkflow.id.startsWith('wf_clone_') || activeWorkflow.id.startsWith('mock_')) {
            // Cannot save mock or unsaved clones without creating them first (not required by this spec)
            setHasUnsavedChanges(false);
            return;
        }

        try {
            const dataToSave = {
                name: activeWorkflow.name,
                description: activeWorkflow.description,
                isDefault: activeWorkflow.isDefault || false,
                nodes: (activeWorkflow.statuses || []).map(s => {
                    const isTemp = String(s.id).startsWith('ev_') || String(s.id).startsWith('nt_');
                    return {
                        id: isTemp ? undefined : s.id,
                        frontendId: isTemp ? s.id : undefined,
                        name: s.name,
                        type: s.category,
                        color: s.color,
                        description: s.description || '',
                        owners: s.owners || [],
                        history: s.history || [],
                        executionNotes: s.executionNotes || [],
                        discussions: s.discussions || [],
                        positionX: typeof s.x === 'number' ? s.x : (typeof s.positionX === 'number' ? s.positionX : 0),
                        positionY: typeof s.y === 'number' ? s.y : (typeof s.positionY === 'number' ? s.positionY : 0)
                    };
                }),
                edges: (activeWorkflow.transitions || []).map(t => ({
                    id: String(t.id).startsWith('tr_') ? undefined : t.id,
                    name: t.label,
                    fromNodeId: t.fromStatusId,
                    toNodeId: t.toStatusId,
                    owners: t.owners || []
                }))
            };

            // For new nodes/edges, we must map the frontend IDs back after save so the canvas doesn't break
            // But for simplicity in this frontend iteration, we'll just reload from the saved response
            const response = await workflowApi.update(activeWorkflow.id, dataToSave);

            const updatedMapped = {
                ...response,
                statuses: response.nodes.map(n => ({
                    id: n.id,
                    name: n.name,
                    category: n.type,
                    color: n.color || '#cbd5e1',
                    progressStatus: 'pending',
                    positionX: n.positionX,
                    positionY: n.positionY,
                    description: n.description || '',
                    owners: n.owners || [],
                    history: n.history || [],
                    executionNotes: n.executionNotes || [],
                    discussions: n.discussions || []
                })),
                transitions: response.edges.map(e => ({
                    id: e.id,
                    label: e.name,
                    fromStatusId: e.fromNodeId,
                    toStatusId: e.toNodeId,
                    owners: e.owners || []
                }))
            };

            setWorkflows(prev => prev.map(wf => wf.id === response.id ? updatedMapped : wf));
            setActiveWorkflow(updatedMapped);
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error('Failed to save workflow:', err);
        }
    };

    const handleSetActiveWorkflow = (wf) => {
        setActiveWorkflow(wf);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setViewport(null);
        setHasUnsavedChanges(false);
    };


    const createWorkflow = async (newWorkflow) => {
        try {
            const dataToSave = {
                name: newWorkflow.name || 'New Workflow',
                description: newWorkflow.description || '',
                projectId
            };

            const response = await workflowApi.create(dataToSave);

            const newMapped = {
                ...response,
                statuses: response.nodes.map(n => ({
                    id: n.id, name: n.name, category: n.type, color: n.color || '#cbd5e1', progressStatus: 'pending', positionX: n.positionX, positionY: n.positionY,
                    description: n.description || '', owners: n.owners || [], history: n.history || [], executionNotes: n.executionNotes || [], discussions: n.discussions || []
                })),
                transitions: response.edges.map(e => ({
                    id: e.id, label: e.name, fromStatusId: e.fromNodeId, toStatusId: e.toNodeId, owners: e.owners || []
                }))
            };

            setWorkflows(prev => [newMapped, ...prev]);
            handleSetActiveWorkflow(newMapped);
        } catch (err) {
            console.error('Failed to create workflow:', err);
        }
    };

    const deleteWorkflowById = async (idToDelete) => {
        try {
            await workflowApi.delete(idToDelete);

            // Remove from local state
            setWorkflows(prev => prev.filter(w => w.id !== idToDelete));

            // If the deleted workflow was active, switch to another one or null
            if (activeWorkflow && activeWorkflow.id === idToDelete) {
                setWorkflows(prev => {
                    const remaining = prev.filter(w => w.id !== idToDelete);
                    if (remaining.length > 0) {
                        handleSetActiveWorkflow(remaining[0]);
                    } else {
                        handleSetActiveWorkflow(null);
                    }
                    return remaining;
                });
            }
        } catch (err) {
            console.error('Failed to delete workflow:', err);
            throw err;
        }
    };

    const updateEventStatus = (workflowId, eventId, newStatus) => {
        setWorkflows(prev => prev.map(wf => {
            if (wf.id !== workflowId) return wf;
            return {
                ...wf,
                statuses: wf.statuses.map(st =>
                    st.id === eventId ? { ...st, progressStatus: newStatus } : st
                )
            };
        }));
        // Update active workflow reference if it's the currently viewed one
        if (activeWorkflow?.id === workflowId) {
            setActiveWorkflow(prev => ({
                ...prev,
                statuses: prev.statuses.map(st =>
                    st.id === eventId ? { ...st, progressStatus: newStatus } : st
                )
            }));
        }
    };

    const updateWorkflowStatus = (workflowId, newStatus) => {
        setWorkflows(prev => prev.map(wf => {
            if (wf.id !== workflowId) return wf;
            return { ...wf, progressStatus: newStatus };
        }));
        if (activeWorkflow?.id === workflowId) {
            setActiveWorkflow(prev => ({ ...prev, progressStatus: newStatus }));
        }
    };

    const logAction = (description) => {
        if (!activeWorkflow) return;
        const entry = {
            date: new Date().toISOString(),
            author: 'You',
            description
        };
        setActiveWorkflow(prev => ({
            ...prev,
            history: [...(prev.history || []), entry]
        }));
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? {
            ...wf,
            history: [...(wf.history || []), entry]
        } : wf));
    };

    const addEvent = (initialData = {}) => {
        if (!activeWorkflow) return;
        const newEvent = {
            id: `ev_${Date.now()}`,
            name: initialData.name || 'New Event',
            description: initialData.description || '',
            category: initialData.category || 'SYSTEM',
            color: initialData.color || '#94a3b8',
            progressStatus: 'pending',
            owners: [],
            metrics: {}
        };
        const updatedWorkflow = {
            ...activeWorkflow,
            statuses: [...(activeWorkflow.statuses || []), newEvent]
        };
        setActiveWorkflow(updatedWorkflow);
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? updatedWorkflow : wf));
        setHasUnsavedChanges(true);
        setSelectedNodeId(newEvent.id);
        setSelectedEdgeId(null);
        logAction(`Added event "${newEvent.name}".`);
    };

    const addConnection = (fromId, toId) => {
        if (!activeWorkflow || !fromId || !toId) return;
        const fromName = activeWorkflow.statuses?.find(s => s.id === fromId)?.name || fromId;
        const toName = activeWorkflow.statuses?.find(s => s.id === toId)?.name || toId;

        const newConnection = {
            id: `tr_${Date.now()}`,
            fromStatusId: fromId,
            toStatusId: toId,
            label: 'New Transition',
            owners: [],
        };
        const updatedWorkflow = {
            ...activeWorkflow,
            transitions: [...(activeWorkflow.transitions || []), newConnection]
        };
        setActiveWorkflow(updatedWorkflow);
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? updatedWorkflow : wf));
        setHasUnsavedChanges(true);
        setSelectedEdgeId(newConnection.id);
        setSelectedNodeId(null);
        logAction(`Added connection from "${fromName}" to "${toName}".`);
    };

    const addNote = () => {
        if (!activeWorkflow) return;
        const newNote = {
            id: `nt_${Date.now()}`,
            name: 'Text Box / Note',
            category: 'NOTE',
            color: '#fde047',
            progressStatus: 'skipped'
        };
        const updatedWorkflow = {
            ...activeWorkflow,
            statuses: [...(activeWorkflow.statuses || []), newNote]
        };
        setActiveWorkflow(updatedWorkflow);
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? updatedWorkflow : wf));
        setHasUnsavedChanges(true);
        logAction('Added a text box / note.');
    };

    const deleteSelected = () => {
        if (!activeWorkflow) return;

        if (selectedNodeId) {
            setActiveWorkflow(prev => {
                const updatedStatuses = prev.statuses.filter(s => s.id !== selectedNodeId);
                const updatedTransitions = prev.transitions?.filter(t => t.fromStatusId !== selectedNodeId && t.toStatusId !== selectedNodeId) || [];
                return {
                    ...prev,
                    statuses: updatedStatuses,
                    transitions: updatedTransitions
                };
            });
            setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? {
                ...wf,
                statuses: wf.statuses.filter(s => s.id !== selectedNodeId),
                transitions: wf.transitions?.filter(t => t.fromStatusId !== selectedNodeId && t.toStatusId !== selectedNodeId) || []
            } : wf));
            const deletedNode = activeWorkflow.statuses.find(s => s.id === selectedNodeId);
            setSelectedNodeId(null);
            setHasUnsavedChanges(true);
            logAction(`Deleted ${deletedNode?.category === 'NOTE' ? 'text box' : 'event'} "${deletedNode?.name || 'Unknown'}".`);
        } else if (selectedEdgeId) {
            const deletedEdge = activeWorkflow.transitions?.find(t => t.id === selectedEdgeId);
            setActiveWorkflow(prev => {
                const updatedTransitions = prev.transitions?.filter(t => t.id !== selectedEdgeId) || [];
                return {
                    ...prev,
                    transitions: updatedTransitions
                };
            });
            setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? {
                ...wf,
                transitions: wf.transitions?.filter(t => t.id !== selectedEdgeId) || []
            } : wf));
            setSelectedEdgeId(null);
            setHasUnsavedChanges(true);
            logAction(`Deleted connection "${deletedEdge?.label || 'Unknown'}".`);
        }
    };

    const updateEvent = (eventId, updates) => {
        if (!activeWorkflow) return;
        const updatedWorkflow = {
            ...activeWorkflow,
            statuses: activeWorkflow.statuses.map(s =>
                s.id === eventId ? { ...s, ...updates } : s
            )
        };
        setActiveWorkflow(updatedWorkflow);
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? updatedWorkflow : wf));
        setHasUnsavedChanges(true);
        const field = Object.keys(updates).join(', ');
        logAction(`Updated event "${activeWorkflow.statuses.find(s => s.id === eventId)?.name || eventId}": changed ${field}.`);
    };

    const updateConnection = (connectionId, updates) => {
        if (!activeWorkflow) return;
        const updatedWorkflow = {
            ...activeWorkflow,
            transitions: (activeWorkflow.transitions || []).map(t =>
                t.id === connectionId ? { ...t, ...updates } : t
            )
        };
        setActiveWorkflow(updatedWorkflow);
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? updatedWorkflow : wf));
        setHasUnsavedChanges(true);
        const field = Object.keys(updates).join(', ');
        logAction(`Updated connection "${activeWorkflow.transitions?.find(t => t.id === connectionId)?.label || connectionId}": changed ${field}.`);
    };

    // Debounce timer ref for auto-saving positions
    const positionSaveTimerRef = React.useRef(null);

    const updateEventPosition = (eventId, position) => {
        if (!activeWorkflow) return;
        const updatedWorkflow = {
            ...activeWorkflow,
            statuses: activeWorkflow.statuses.map(s =>
                s.id === eventId ? { ...s, x: position.x, y: position.y, positionX: position.x, positionY: position.y } : s
            )
        };
        setActiveWorkflow(updatedWorkflow);
        setWorkflows(prev => prev.map(wf => wf.id === activeWorkflow.id ? updatedWorkflow : wf));
        // Do NOT set hasUnsavedChanges for position drags — auto-save silently instead
        // Debounce: wait 800ms after the user stops dragging before persisting
        if (positionSaveTimerRef.current) clearTimeout(positionSaveTimerRef.current);
        positionSaveTimerRef.current = setTimeout(() => {
            saveActiveWorkflow({ skipValidation: true });
        }, 800);
    };

    const value = {
        workflows,
        activeWorkflow,
        setActiveWorkflow: handleSetActiveWorkflow,
        createWorkflow,
        deleteWorkflowById,
        updateEventStatus,
        updateWorkflowStatus,
        addEvent,
        addConnection,
        addNote,
        updateEvent,
        updateEventPosition,
        updateConnection,
        selectedNodeId,
        setSelectedNodeId,
        selectedEdgeId,
        setSelectedEdgeId,
        deleteSelected,
        viewport,
        setViewport,
        payloadMode,
        setPayloadMode,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        saveActiveWorkflow,
        discardChanges,
        isLoading,
        error
    };

    return (
        <WorkflowContext.Provider value={value}>
            {children}
        </WorkflowContext.Provider>
    );
};
