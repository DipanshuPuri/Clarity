import React, { useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Position,
    Handle,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Users, FileText, Clock } from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

// --- CUSTOM NODE: Workflow Status Node ---
// Displays Name, Color Bar, Owners, and Ticket Count
const StatusNode = ({ data, selected }) => {
    const isBottleneck = data.metrics && data.metrics.isBottleneck;

    return (
        <div
            className={`
                relative border rounded-2xl shadow-sm overflow-hidden min-w-[280px] transition-colors duration-200
                ${selected
                    ? 'bg-white border-secondary ring-4 ring-secondary/40 shadow-secondary/20 shadow-xl scale-[1.02] z-50'
                    : data.progressStatus === 'complete'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : data.progressStatus === 'ongoing'
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                            : data.progressStatus === 'skipped'
                                ? 'border-slate-300 bg-slate-50 opacity-60'
                                : isBottleneck
                                    ? 'bg-white border-orange-300 ring-1 ring-orange-200 shadow-orange-100/50 shadow-md hover:border-slate-300'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                }
            `}
        >
            {/* Input Handle (Left) */}
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-200 border-2 border-white" />

            {/* Category Color Bar */}
            <div className="h-2 w-full" style={{ backgroundColor: data.color || '#cbd5e1' }} />

            <div className="p-4 pt-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-3 pr-24">
                    {data.name}
                </h3>

                {/* Bottleneck Indicator */}
                {isBottleneck && (
                    <div className="absolute top-3.5 right-3 flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200/50 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm">
                        <Clock className="w-3 h-3" />
                        Avg {data.metrics.avgTimeInDays}d
                    </div>
                )}

                {data.category !== 'NOTE' && (
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                        {/* Explicit Assignees / Teams */}
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                            {data.owners?.length > 0 ? (
                                data.owners.map((owner, idx) => (
                                    <span key={idx} className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${data.progressStatus === 'complete' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                        data.progressStatus === 'ongoing' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                        {owner}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Unassigned</span>
                            )}
                        </div>

                        {/* Ticket Count Placeholder */}
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold tabular-nums">0</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Output Handle (Right) */}
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-slate-200 border-2 border-white" />
        </div>
    );
};

// --- DAGRE LAYOUT: Left -> Right Auto Spacing ---
const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // LR = Left to Right
    // nodesep = vertical spacing, ranksep = horizontal spacing
    dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 100, ranksep: 200 });

    nodes.forEach((node) => {
        // Approximate dimensions for the node (increased for new size)
        dagreGraph.setNode(node.id, { width: 300, height: 140 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Hybrid Diagonal & Clustered Layout:
        // By adding a fraction of X to Y, we create a cascading diagonal timeline
        // that fills a 16:9 screen optimally without purely horizontal scrolling.
        const skewedY = (nodeWithPosition.y * 0.8) + (nodeWithPosition.x * 0.35);

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 300 / 2, // Center the new width
                y: skewedY - 140 / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

/**
 * WorkflowCanvas
 * 
 * Interactive flowchart of exactly HOW tickets move.
 * Provides zooming, panning, and auto-spacing left to right.
 */
const WorkflowCanvas = ({ workflow, payloadMode = true }) => {
    const {
        selectedNodeId, setSelectedNodeId,
        selectedEdgeId, setSelectedEdgeId,
        viewport, setViewport, updateEventPosition
    } = useWorkflow();
    const [nodes, setNodes] = React.useState([]);
    const [edges, setEdges] = React.useState([]);

    const nodeTypes = useMemo(() => ({ statusNode: StatusNode }), []);

    // Transform mock schema into ReactFlow format whenever workflow changes
    useEffect(() => {
        if (!workflow) return;

        const rfNodes = workflow.statuses.map((status, index) => {
            // Priority: User's saved dragged coordinates, default layout coordinates for templates, fallback for newly spawned nodes.
            const posX = typeof status.x === 'number' ? status.x : (typeof status.positionX === 'number' ? status.positionX : (250 + (index * 20)));
            const posY = typeof status.y === 'number' ? status.y : (typeof status.positionY === 'number' ? status.positionY : (250 + (index * 20)));
            return {
                id: status.id,
                type: 'statusNode',
                data: {
                    name: status.name,
                    color: status.color,
                    owners: status.owners,
                    category: status.category,
                    metrics: status.metrics,
                    progressStatus: status.progressStatus
                },
                position: { x: posX, y: posY }
            };
        });

        const rfEdges = workflow.transitions.map(trans => ({
            id: trans.id,
            source: trans.fromStatusId,
            target: trans.toStatusId,
            label: trans.label,
            type: 'smoothstep', // nice right angles
            animated: false,
            style: { strokeWidth: 2, stroke: '#94a3b8' },
            labelStyle: { fill: '#64748b', fontWeight: 700, fontSize: 11, fontFamily: 'monospace' },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 8,
            labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.9, stroke: '#e2e8f0', strokeWidth: 1 },
            selected: trans.id === selectedEdgeId,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 15,
                height: 15,
                color: '#94a3b8',
            },
        }));

        setNodes(nds => {
            const currentNodes = new Map(nds.map(n => [n.id, n]));
            return rfNodes.map(node => {
                const existing = currentNodes.get(node.id);
                return {
                    ...node,
                    position: existing ? existing.position : node.position, // Keep manual drag position inside ReactFlow if currently editing
                    selected: selectedNodeId === node.id
                };
            });
        });

        setEdges(rfEdges.map(edge => ({
            ...edge,
            selected: selectedEdgeId === edge.id
        })));
    }, [workflow]);

    // Independent effects to handle selection without triggering re-layouts
    useEffect(() => {
        setNodes(nds => nds.map(node => ({ ...node, selected: node.id === selectedNodeId })));
    }, [selectedNodeId]);

    useEffect(() => {
        setEdges(eds => eds.map(edge => ({ ...edge, selected: edge.id === selectedEdgeId })));
    }, [selectedEdgeId]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onNodeDragStop = useCallback(
        (event, node) => {
            updateEventPosition(node.id, { x: node.position.x, y: node.position.y });
        },
        [updateEventPosition]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        []
    );
    const onNodeClick = useCallback(
        (event, node) => {
            setSelectedEdgeId(null);
            setSelectedNodeId(node.id);
        },
        [setSelectedNodeId, setSelectedEdgeId]
    );
    const onEdgeClick = useCallback(
        (event, edge) => {
            setSelectedNodeId(null);
            setSelectedEdgeId(edge.id);
        },
        [setSelectedNodeId, setSelectedEdgeId]
    );
    const onPaneClick = useCallback(
        () => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
        },
        [setSelectedNodeId, setSelectedEdgeId]
    );
    const onMoveEnd = useCallback(
        (event, vp) => {
            setViewport(vp);
        },
        [setViewport]
    );

    if (!workflow) return null;

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onNodeDragStop={onNodeDragStop}
                onEdgesChange={onEdgesChange}
                onConnect={!payloadMode ? onConnect : undefined}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                nodesDraggable={!payloadMode}
                nodesConnectable={!payloadMode}
                elementsSelectable={true}
                fitView={!viewport}
                fitViewOptions={{ padding: 0.15, duration: 800, maxZoom: 1 }}
                minZoom={0.3}
                maxZoom={2}
                defaultViewport={viewport || undefined}
                onMoveEnd={onMoveEnd}
                className={`bg-white ${payloadMode ? 'cursor-default' : ''}`}
            >
                <Background color="#cbd5e1" gap={32} size={1} />
                <Controls
                    className="opacity-70 hover:opacity-100 transition-opacity bg-white border-slate-100 shadow-sm rounded-xl overflow-hidden"
                    showInteractive={false}
                />
            </ReactFlow>
        </div>
    );
};

export default WorkflowCanvas;
