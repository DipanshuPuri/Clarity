import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Layers, Clock, Activity, ArrowRight, Calendar, Trash2 } from 'lucide-react';
import ReleaseComposerModal from '../components/releases/ReleaseComposerModal';
import ReleaseChecklistPanel from '../components/releases/ReleaseChecklistPanel';
import ReleaseTimelinePanel from '../components/releases/ReleaseTimelinePanel';
import DeployReleaseModal from '../components/releases/DeployReleaseModal';
import ReleaseImpactPreviewModal from '../components/releases/ReleaseImpactPreviewModal';
import AssignRoleModal from '../components/releases/AssignRoleModal';
import ReleaseCommandBoard from '../components/releases/ReleaseCommandBoard';
import { projectsApi } from '../api/projects';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Releases Module - Three-Column Command Layout
 */

// ─── Comprehensive mock data matching org context ───
const MOCK_RELEASES = [
    {
        id: 'rel-1',
        name: 'Project Titan - Core Engine',
        description: 'Critical overhaul of the Titan Core execution logic. Targeting zero-latency event propagation and concurrent audit logging for high-throughput environments.',
        status: 'ACTIVE',
        readinessScore: 42,
        targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        freezeDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce', position: 'Founder', profilePicture: null },
        engOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne', profilePicture: null },
        qaOwner: null,
        deployOwner: { id: 'u4', firstName: 'Alexander', lastName: 'Pierce', profilePicture: null },
        projects: [{ id: 'mp1', name: 'Project Titan', status: 'ONGOING' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [],
        dependedUponBy: [{ id: 'rel-2' }],
        checklists: [
            { id: 'cl1', title: 'Titan core unit test suite > 95%', completionState: true },
            { id: 'cl2', title: 'Concurrent logging stress test', completionState: false },
            { id: 'cl3', title: 'Refactor approval from Arch Board', completionState: false }
        ],
        audits: [
            { id: 'a1', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Initiated Titan core refactor' },
            { id: 'a2', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user: { firstName: 'Jason', lastName: 'Bourne' }, reason: 'Moved to ACTIVE after internal review' },
            { id: 'a3', eventType: 'owner_changed', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Assigned Jason Bourne as Engineering lead' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-2',
        name: 'Cloud Migration Phoenix - Phase 1',
        description: 'Transitioning the Phoenix infrastructure to a hybrid-cloud architecture. Focus on data persistence layers and failover synchronization.',
        status: 'FROZEN',
        readinessScore: 88,
        targetDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        freezeDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        releaseOwner: { id: 'u3', firstName: 'Sarah', lastName: 'Connor', position: 'Product Lead', profilePicture: null },
        engOwner: { id: 'u5', firstName: 'Elena', lastName: 'Fisher', profilePicture: null },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker', profilePicture: null },
        deployOwner: null,
        projects: [{ id: 'mp2', name: 'Cloud Migration Phoenix', status: 'ONGOING' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [{ id: 'rel-1' }],
        dependedUponBy: [],
        checklists: [
            { id: 'cl4', title: 'Cloud-native driver validation', completionState: true },
            { id: 'cl5', title: 'Sync latency below 50ms', completionState: true },
            { id: 'cl6', title: 'PostgreSQL cluster migration verify', completionState: false }
        ],
        audits: [
            { id: 'a4', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 14).toISOString(), user: { firstName: 'Sarah', lastName: 'Connor' }, reason: 'Phoenix phase 1 kickoff' },
            { id: 'a5', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Codebase frozen for final migration dry-run' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-3',
        name: 'Project Nova - Analytics Bridge',
        description: 'Implementing the Nova Bridge to connect core analytics with executive visualization modules. Focused on real-time data streaming.',
        status: 'ACTIVE',
        readinessScore: 12,
        targetDate: new Date(Date.now() + 86400000 * 14).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce', position: 'Founder', profilePicture: null },
        engOwner: null,
        qaOwner: null,
        deployOwner: null,
        projects: [{ id: 'mp3', name: 'Project Nova', status: 'ONGOING' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [],
        dependedUponBy: [],
        checklists: [
            { id: 'cl7', title: 'Schema definition for Nova stream', completionState: false },
            { id: 'cl8', title: 'API gateway endpoint authorization', completionState: false }
        ],
        audits: [
            { id: 'a7', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Nova Bridge active development' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-4',
        name: 'Neural Network Expansion - Inference Tier',
        description: 'Scaling the inference tier for the Neural Network module. Upgrading compute nodes and optimizing model weight distribution.',
        status: 'READY',
        readinessScore: 97,
        targetDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        releaseOwner: { id: 'u3', firstName: 'Sarah', lastName: 'Connor', position: 'Product Lead', profilePicture: null },
        engOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne', profilePicture: null },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker', profilePicture: null },
        deployOwner: { id: 'u4', firstName: 'Alexander', lastName: 'Pierce', profilePicture: null },
        projects: [{ id: 'mp6', name: 'Neural Network Expansion', status: 'ONGOING' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [{ id: 'rel-1' }],
        dependedUponBy: [],
        checklists: [
            { id: 'cl9', title: 'Model load test results verified', completionState: true },
            { id: 'cl10', title: 'Weight distribution latency < 200ms', completionState: true }
        ],
        audits: [
            { id: 'a8', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 21).toISOString(), user: { firstName: 'Sarah', lastName: 'Connor' }, reason: 'Inference tier optimization kickoff' },
            { id: 'a9', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), user: { firstName: 'Peter', lastName: 'Parker' }, reason: 'Model verification successful' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-5',
        name: 'Project Echo - Notification Hub',
        description: 'Refactoring the Echo notification hub. Implementing cross-platform push synchronization and event-driven message dispatching.',
        status: 'ACTIVE',
        readinessScore: 55,
        targetDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        freezeDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        releaseOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne', position: 'Engineering Lead', profilePicture: null },
        engOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne', profilePicture: null },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker', profilePicture: null },
        deployOwner: null,
        projects: [{ id: 'mp4', name: 'Project Echo', status: 'UPCOMING' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [{ id: 'rel-1' }],
        dependedUponBy: [{ id: 'rel-6' }],
        checklists: [
            { id: 'cl11', title: 'Cross-platform push token sync', completionState: true },
            { id: 'cl12', title: 'Message dispatch queue stress test', completionState: false },
            { id: 'cl13', title: 'Echo hub auth protocols', completionState: true }
        ],
        audits: [
            { id: 'a10', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 12).toISOString(), user: { firstName: 'Jason', lastName: 'Bourne' }, reason: 'Echo hub architectural improvement' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-6',
        name: 'Identity Shield V2 - Core Security',
        description: 'Hardening the Identity Shield infrastructure. Implementing polymorphic encryption and MFA-level session validation.',
        status: 'FROZEN',
        readinessScore: 76,
        targetDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        freezeDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce', position: 'Founder', profilePicture: null },
        engOwner: { id: 'u5', firstName: 'Elena', lastName: 'Fisher', profilePicture: null },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker', profilePicture: null },
        deployOwner: { id: 'u4', firstName: 'Alexander', lastName: 'Pierce', profilePicture: null },
        projects: [{ id: 'p-nova', name: 'Identity Shield V2', status: 'ACTIVE' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [{ id: 'rel-5' }],
        dependedUponBy: [],
        checklists: [
            { id: 'cl14', title: 'Encryption key rotation dry-run', completionState: true },
            { id: 'cl15', title: 'Session hijacking simulation', completionState: false },
            { id: 'cl16', title: 'MFA callback reliability test', completionState: true }
        ],
        audits: [
            { id: 'a12', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 18).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Identity Shield security cycle' },
            { id: 'a13', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: { firstName: 'Elena', lastName: 'Fisher' }, reason: 'Frozen for final encryption audit' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-7',
        name: 'Predictive Intent V3 - Logic Tier',
        description: 'Deploying the V3 logic tier for Predictive Intent. Introducing Bayesian probability layers into the core decision engine.',
        status: 'ACTIVE',
        readinessScore: 18,
        targetDate: new Date(Date.now() + 86400000 * 28).toISOString(),
        releaseOwner: { id: 'u3', firstName: 'Sarah', lastName: 'Connor', position: 'Product Lead', profilePicture: null },
        engOwner: null,
        qaOwner: null,
        deployOwner: null,
        projects: [{ id: 'p-echo', name: 'Predictive Intent V3', status: 'IN_PROGRESS' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [{ id: 'rel-1' }, { id: 'rel-4' }],
        dependedUponBy: [],
        checklists: [
            { id: 'cl17', title: 'Probability model validation', completionState: false },
            { id: 'cl18', title: 'Decision tier backtesting complete', completionState: false }
        ],
        audits: [
            { id: 'a14', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), user: { firstName: 'Sarah', lastName: 'Connor' }, reason: 'V3 inference logic active development' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-8',
        name: 'Global Ops Gateway - Legacy Sync',
        description: 'Maintenance cycle for the Global Ops Gateway. Patching legacy sync protocols and upgrading TLS configurations.',
        status: 'DEPLOYED',
        readinessScore: 100,
        targetDate: new Date(Date.now() - 86400000 * 12).toISOString(),
        freezeDate: new Date(Date.now() - 86400000 * 15).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce', position: 'Founder', profilePicture: null },
        engOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne', profilePicture: null },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker', profilePicture: null },
        deployOwner: { id: 'u4', firstName: 'Alexander', lastName: 'Pierce', profilePicture: null },
        projects: [{ id: 'p6', name: 'Global Ops Gateway', status: 'COMPLETED' }],
        tickets: [],
        blockingTickets: [],
        dependsOn: [],
        dependedUponBy: [{ id: 'rel-1' }],
        checklists: [
            { id: 'cl19', title: 'TLS 1.3 protocol verification', completionState: true },
            { id: 'cl20', title: 'Legacy buffer overflow audit', completionState: true }
        ],
        audits: [
            { id: 'a15', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 45).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Security maintenance for Global Gateway' },
            { id: 'a16', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 12).toISOString(), user: { firstName: 'Alexander', lastName: 'Pierce' }, reason: 'Verified successfully and deployed to edge' }
        ],
        _count: { tickets: 0 }
    },
    {
        id: 'rel-9',
        name: 'Project Sentinel - Threat Detection',
        description: 'Advanced real-time threat detection engine. Implementing machine learning models for anomaly detection and automated incident response.',
        status: 'DEPLOYED',
        readinessScore: 100,
        targetDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce', position: 'Founder' },
        engOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne' },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker' },
        deployOwner: { id: 'u4', firstName: 'Alexander', lastName: 'Pierce' },
        projects: [{ id: 'sentinel', name: 'Project Sentinel' }],
        checklists: [
            { id: 'cl21', title: 'Anomalous pattern matching > 99%', completionState: true },
            { id: 'cl22', title: 'Auto-response latency < 500ms', completionState: true }
        ],
        audits: [
            { id: 'a17', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 30).toISOString(), user: { firstName: 'Alexander' }, reason: 'Sentinel core initialization' },
            { id: 'a18', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user: { firstName: 'Alexander' }, reason: 'Successful deployment to global nodes' }
        ]
    },
    {
        id: 'rel-10',
        name: 'Quantum Ledger - Distribution Tier',
        description: 'Rebuilding the distribution tier for the Quantum Ledger. High-frequency consistency checks and decentralized state management.',
        status: 'ACTIVE',
        readinessScore: 62,
        targetDate: new Date(Date.now() + 86400000 * 8).toISOString(),
        releaseOwner: { id: 'u3', firstName: 'Sarah', lastName: 'Connor' },
        engOwner: { id: 'u5', firstName: 'Elena', lastName: 'Fisher' },
        qaOwner: null,
        projects: [{ id: 'quantum', name: 'Quantum Ledger' }],
        checklists: [
            { id: 'cl23', title: 'State consistency validation loop', completionState: true },
            { id: 'cl24', title: 'High-frequency peer sync test', completionState: false }
        ],
        audits: [
            { id: 'a19', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 10).toISOString(), user: { firstName: 'Sarah' }, reason: 'Quantum distribution overhaul' }
        ]
    },
    {
        id: 'rel-11',
        name: 'Aurora UI - Design System V4',
        description: 'Major update to the Aurora design system. Implementing glassmorphism effects and dynamic micro-animations across all context modules.',
        status: 'FROZEN',
        readinessScore: 82,
        targetDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        freezeDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce' },
        engOwner: { id: 'u2', firstName: 'Jason', lastName: 'Bourne' },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker' },
        projects: [{ id: 'aurora', name: 'Aurora UI' }],
        checklists: [
            { id: 'cl25', title: 'Component-wide blur optimization', completionState: true },
            { id: 'cl26', title: 'Animation frame rate audit > 60fps', completionState: false }
        ],
        audits: [
            { id: 'a20', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 15).toISOString(), user: { firstName: 'Alexander' }, reason: 'Aurora V4 design cycle' },
            { id: 'a21', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), user: { firstName: 'Jason' }, reason: 'Codebase locked for final UI verification' }
        ]
    },
    {
        id: 'rel-12',
        name: 'Data Lake Alpha - Ingestion Pipeline',
        description: 'Optimizing the ingestion pipeline for Data Lake Alpha. High-volume parallel processing and automated schema inference.',
        status: 'READY',
        readinessScore: 95,
        targetDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        releaseOwner: { id: 'u3', firstName: 'Sarah', lastName: 'Connor' },
        engOwner: { id: 'u5', firstName: 'Elena', lastName: 'Fisher' },
        qaOwner: { id: 'u6', firstName: 'Peter', lastName: 'Parker' },
        deployOwner: { id: 'u4', firstName: 'Alexander', lastName: 'Pierce' },
        projects: [{ id: 'datalake', name: 'Data Lake Alpha' }],
        checklists: [
            { id: 'cl27', title: 'Parallel stream ingestion test', completionState: true },
            { id: 'cl28', title: 'Schema inference accuracy > 99%', completionState: true }
        ],
        audits: [
            { id: 'a22', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 25).toISOString(), user: { firstName: 'Sarah' }, reason: 'Alpha ingestion optimization' },
            { id: 'a23', eventType: 'status_changed', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), user: { firstName: 'Elena' }, reason: 'Pipeline ready for production deploy' }
        ]
    },
    {
        id: 'rel-13',
        name: 'Horizon Gateway - Cross-Region Sync',
        description: 'Implementing cross-region synchronization for the Horizon Gateway. Ensuring data sovereignty and low-latency global access.',
        status: 'ACTIVE',
        readinessScore: 5,
        targetDate: new Date(Date.now() + 86400000 * 45).toISOString(),
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce' },
        projects: [{ id: 'horizon', name: 'Horizon Gateway' }],
        checklists: [
            { id: 'cl29', title: 'Region sovereignty mapping', completionState: false },
            { id: 'cl30', title: 'Gateway auth handshake protocol', completionState: false }
        ],
        audits: [
            { id: 'a24', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: { firstName: 'Alexander' }, reason: 'Horizon Gateway global phase' }
        ]
    },
    {
        id: 'rel-14',
        name: 'Neural Link - Kinetic Interface',
        description: 'Development of the Kinetic Interface module for Neural Link. High-bandwidth neural data processing and motor cortex feedback loops.',
        status: 'ACTIVE',
        readinessScore: 32,
        targetDate: new Date(Date.now() - 86400000 * 4).toISOString(), // STYRICTLY OVERDUE
        releaseOwner: { id: 'u1', firstName: 'Alexander', lastName: 'Pierce' },
        engOwner: { id: 'u5', firstName: 'Elena', lastName: 'Fisher' },
        projects: [{ id: 'neurallink', name: 'Neural Link' }],
        checklists: [
            { id: 'cl31', title: 'Kinetic signal calibration', completionState: true },
            { id: 'cl32', title: 'Latency threshold verification (< 5ms)', completionState: false }
        ],
        audits: [
            { id: 'a25', eventType: 'release_created', timestamp: new Date(Date.now() - 86400000 * 12).toISOString(), user: { firstName: 'Alexander' }, reason: 'Kinetic interface kickoff' }
        ]
    }
];

// Mock risk data per release
const MOCK_RISKS = {
    'rel-1': {
        risks: [
            { type: 'PERFORMANCE_CRITICAL', severity: 'CRITICAL', message: 'Core execution engine showing 150ms latency spikes in stress tests.' },
            { type: 'MISSING_QA_OWNER', severity: 'WARNING', message: 'QA Owner slot is unassigned. Quality gate verification cannot proceed.' },
            { type: 'INCOMPLETE_AUDIT', severity: 'WARNING', message: '2 of 3 verification gates remain incomplete — High-throughput logging pending.' }
        ],
        readinessExplanations: [
            'Latency spikes in stress tests (-30% readiness)',
            'QA Owner unassigned (-15% readiness)',
            'Audit logging incomplete (-13% readiness)'
        ]
    },
    'rel-2': {
        risks: [
            { type: 'SYNC_STALL', severity: 'CRITICAL', message: 'Failover synchronization stalling during high-load persistence tests.' },
            { type: 'MISSING_DEPLOY_OWNER', severity: 'WARNING', message: 'Deployment Owner is unassigned. Infrastructure shifts require ops lead.' }
        ],
        readinessExplanations: [
            'Sync stall during load test (-12% readiness)',
            'Deploy Owner unassigned (-5% readiness)'
        ]
    },
    'rel-3': {
        risks: [
            { type: 'API_AUTH_FAILURE', severity: 'CRITICAL', message: 'Real-time data stream failing authorization handshake in auth-bridge.' },
            { type: 'LOW_READINESS', severity: 'CRITICAL', message: 'Readiness score is critically low at 12%. Schema definition not finalized.' }
        ],
        readinessExplanations: [
            'Auth handshake failing (-50% readiness)',
            'All ownership slots empty (-25% readiness)',
            'Schema not finalized (-13% readiness)'
        ]
    },
    'rel-4': {
        risks: [
            { type: 'INFERENCE_LATENCY', severity: 'WARNING', message: 'Scaling inference tier showing inconsistent response times across region zones.' },
            { type: 'RESOURCE_SKEW', severity: 'WARNING', message: 'Compute node distribution favoring US-EAST nodes; 15% skew detected.' }
        ],
        readinessExplanations: [
            'Regional inference variance (-3% readiness)',
            'Compute skew detected (-5% readiness)'
        ]
    },
    'rel-5': {
        risks: [
            { type: 'DISPATCH_LATENCY', severity: 'CRITICAL', message: 'Event-driven message dispatching showing queue buildup in local tests.' },
            { type: 'AUTH_PROTOCOL_MISMATCH', severity: 'WARNING', message: 'Echo hub attempting to use deprecated OAuth 1.0 flow for legacy integrations.' }
        ],
        readinessExplanations: [
            'Dispatch queue buildup (-25% readiness)',
            'Legacy auth protocol detected (-12% readiness)'
        ]
    },
    'rel-6': {
        risks: [
            { type: 'ENCRYPTION_OVERHEAD', severity: 'WARNING', message: 'Polymorphic encryption adding 25ms overhead to core request cycles.' },
            { type: 'MFA_CALLBACK_TIMEOUT', severity: 'CRITICAL', message: 'MFA callback service timing out for 2% of high-entropy sessions.' }
        ],
        readinessExplanations: [
            'Encryption overhead slightly high (-12% readiness)',
            'MFA callback timeouts (-15% readiness)'
        ]
    },
    'rel-7': {
        risks: [
            { type: 'LOGIC_TIER_MISSING', severity: 'CRITICAL', message: 'Bayesian probability layer has not been integrated into decision engine.' },
            { type: 'TRAINING_DATA_STALE', severity: 'WARNING', message: 'Predictive intent models using data from Q3; fresh ingestion cycle pending.' }
        ],
        readinessExplanations: [
            'Core logic layer missing (-40% readiness)',
            'Training data stale (-15% readiness)'
        ]
    },
    'rel-8': {
        risks: [
            { type: 'UPGRADE_FAILOVER', severity: 'WARNING', message: 'Legacy TLS configurations requiring manual verification cycle.' },
            { type: 'DEPRECATED_PROTOCOL', severity: 'WARNING', message: 'RSA-1024 certificates detected in edge ingress; upgrade to ECC-384 recommended.' }
        ],
        readinessExplanations: [
            'Manual verification required for legacy protocols.',
            'Deprecated encryption standards (-15% readiness)'
        ]
    },
    'rel-9': {
        risks: [],
        readinessExplanations: ['Sentinel fully operational and deployed (100% readiness)']
    },
    'rel-10': {
        risks: [
            { type: 'CONSISTENCY_LACK', severity: 'CRITICAL', message: 'Distribution tier failing state consistency checks in peer sync tests.' },
            { type: 'QA_RESOURCES', severity: 'WARNING', message: 'No QA resource allocated to Quantum distribution tier.' }
        ],
        readinessExplanations: [
            'State consistency failures (-30% readiness)',
            'QA missing (-8% readiness)'
        ]
    },
    'rel-11': {
        risks: [
            { type: 'UI_LATENCY', severity: 'WARNING', message: 'Animation frame rate drops below 60fps on mobile context view.' },
            { type: 'ASSET_WEIGHT', severity: 'WARNING', message: 'Aurora design system assets exceeding 2MB payload threshold.' }
        ],
        readinessExplanations: [
            'Mobile UI frame rate issues (-18% readiness)',
            'Heavy design assets (-5% readiness)'
        ]
    },
    'rel-12': {
        risks: [
            { type: 'INGESTION_POLISH', severity: 'WARNING', message: 'Manual schema overrides still required for 2% of Alpha data streams.' },
            { type: 'PARALLEL_SYNC_FAIL', severity: 'CRITICAL', message: 'Parallel ingestion failing for streams with high-entropy keys.' }
        ],
        readinessExplanations: [
            'Schema inference not fully autonomous (-5% readiness)',
            'Parallel sync failures (-22% readiness)'
        ]
    },
    'rel-13': {
        risks: [
            { type: 'PLANNING_PHASE', severity: 'WARNING', message: 'Initial architecture review pending for multi-region handshake.' },
            { type: 'EGRESS_COST_RISK', severity: 'WARNING', message: 'Cross-region sync projected to exceed egress budget by 15%.' }
        ],
        readinessExplanations: [
            'Early planning phase (-95% readiness)',
            'Budgetary egress concerns (-5% readiness)'
        ]
    },
    'rel-14': {
        risks: [
            { type: 'SIGNAL_INTERFERENCE', severity: 'CRITICAL', message: 'Neural signal interference detected in motor cortex feedback simulations.' },
            { type: 'OVERDUE_DEADLINE', severity: 'CRITICAL', message: 'Release is 4 days past target delivery date. Resource reallocation required.' },
            { type: 'BANDWIDTH_THROTTLE', severity: 'WARNING', message: 'Neural link data stream throttled at 2Gbps edge.' }
        ],
        readinessExplanations: [
            'Signal interference issues (-40% readiness)',
            'Past target date (-28% readiness)',
            'Bandwidth bottlenecks (-5% readiness)'
        ]
    }
};

const Releases = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeReleases, setActiveReleases] = useState([]);
    const [selectedRelease, setSelectedRelease] = useState(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [isDeployOpen, setIsDeployOpen] = useState(false);
    const [isImpactOpen, setIsImpactOpen] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assigningRole, setAssigningRole] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState(true);
    const [liveRisks, setLiveRisks] = useState([]);
    const [readinessExplanations, setReadinessExplanations] = useState([]);
    const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm }
    const [projectsMap, setProjectsMap] = useState({}); // name -> real DB id

    // Fetch real projects from the API to build a name -> real DB id lookup
    useEffect(() => {
        const fetchRealProjects = async () => {
            try {
                const projects = await projectsApi.getProjects();
                const map = {};
                projects.forEach(p => {
                    map[p.name.toLowerCase().trim()] = p.id;
                });
                setProjectsMap(map);
            } catch (e) {
                console.warn('Could not fetch projects for release linking:', e);
            }
        };
        fetchRealProjects();
    }, []);

    const fetchReleases = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/releases', {
                withCredentials: true
            });
            const dbReleases = Array.isArray(res.data) ? res.data : [];
            
            // Map DB releases with status-based logic
            const mappedDb = dbReleases.map(rel => {
                let formattedDate = 'Unscheduled';
                let targetDateActual = '';
                let daysRemaining = Infinity;
                if (rel.targetDate) {
                    const targetDt = new Date(rel.targetDate);
                    const diff = targetDt - new Date();
                    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    formattedDate = daysRemaining > 0 ? `T-${daysRemaining} Days` : 'Overdue';
                    targetDateActual = targetDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                }
                let riskLevel = 'LOW';
                if (rel.readinessScore < 50 && ['FROZEN', 'READY'].includes(rel.status)) riskLevel = 'HIGH';
                else if (rel.readinessScore < 30 && rel.status === 'ACTIVE') riskLevel = 'HIGH';
                else if (rel.readinessScore < 20) riskLevel = 'HIGH';
                return { ...rel, targetDateFormatted: formattedDate, targetDateActual, riskLevel, daysRemaining };
            });

            // Map Mock releases similarly
            const mappedMock = MOCK_RELEASES.map(rel => {
                let formattedDate = 'Unscheduled';
                let targetDateActual = '';
                let daysRemaining = Infinity;
                if (rel.targetDate) {
                    const targetDt = new Date(rel.targetDate);
                    const diff = targetDt - new Date();
                    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    formattedDate = daysRemaining > 0 ? `T-${daysRemaining} Days` : 'Overdue';
                    targetDateActual = targetDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                }
                let riskLevel = 'LOW';
                if (rel.readinessScore < 50 && ['FROZEN', 'READY'].includes(rel.status)) riskLevel = 'HIGH';
                else if (rel.readinessScore < 30 && rel.status === 'ACTIVE') riskLevel = 'HIGH';
                else if (rel.readinessScore < 20) riskLevel = 'HIGH';
                return { ...rel, targetDateFormatted: formattedDate, targetDateActual, riskLevel, daysRemaining };
            });

            // Merge: Prefer DB entries if names/titles collide, but otherwise keep all
            const dbNames = new Set(mappedDb.map(r => (r.name || r.title || '').toLowerCase().trim()));
            const uniqueMock = mappedMock.filter(m => !dbNames.has((m.name || m.title || '').toLowerCase().trim()));
            
            const merged = [...mappedDb, ...uniqueMock];

            // Sorting logic
            const sorted = merged.sort((a, b) => {
                const aIsDeployed = a.status === 'DEPLOYED';
                const bIsDeployed = b.status === 'DEPLOYED';

                // 1. Group by Deployed (Deployed always at the bottom)
                if (aIsDeployed !== bIsDeployed) return aIsDeployed ? 1 : -1;

                if (!aIsDeployed) {
                    // 2. Non-Deployed: Overdue first, then by daysRemaining ascending
                    const aOverdue = a.daysRemaining <= 0 ? 1 : 0;
                    const bOverdue = b.daysRemaining <= 0 ? 1 : 0;
                    if (aOverdue !== bOverdue) return bOverdue - aOverdue;
                    
                    if (a.daysRemaining !== b.daysRemaining) return a.daysRemaining - b.daysRemaining;
                } else {
                    // 3. Deployed: Sort by deployment date (newest first)
                    // We'll use targetDate as proxy for deployment date in mock data
                    const aTime = new Date(a.targetDate || a.createdAt || 0).getTime();
                    const bTime = new Date(b.targetDate || b.createdAt || 0).getTime();
                    if (aTime !== bTime) return bTime - aTime;
                }

                return new Date(b.createdAt || b.id || 0) - new Date(a.createdAt || a.id || 0);
            });
            
            // Log for debugging
            console.log("Sorted releases:", sorted.map(r => ({ name: r.name, status: r.status, days: r.daysRemaining })));

            setActiveReleases(sorted);
            
            // Update selection
            if (sorted.length > 0) {
                const currentId = selectedRelease?.id;
                const exists = sorted.find(r => r.id === currentId);
                if (!selectedRelease || !exists) {
                    setSelectedRelease(sorted[0]);
                } else {
                    setSelectedRelease(exists);
                }
            }
        } catch (error) {
            console.error("Failed to fetch releases", error);
            // On error, just show mock data
            const mappedMock = MOCK_RELEASES.map(rel => {
                let formattedDate = 'Unscheduled';
                if (rel.targetDate) {
                    const diff = new Date(rel.targetDate) - new Date();
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    formattedDate = days > 0 ? `T-${days} Days` : 'Overdue';
                }
                let riskLevel = 'LOW';
                if (rel.readinessScore < 50 && ['FROZEN', 'READY'].includes(rel.status)) riskLevel = 'HIGH';
                else if (rel.readinessScore < 30 && rel.status === 'ACTIVE') riskLevel = 'HIGH';
                return { ...rel, targetDateFormatted: formattedDate, riskLevel };
            });
            setActiveReleases(mappedMock);
            if (mappedMock.length > 0 && !selectedRelease) setSelectedRelease(mappedMock[0]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReleases();
    }, []);

    useEffect(() => {
        if (!selectedRelease) return;
        const fetchRisks = async () => {
            // Check if it's a mock release first
            if (String(selectedRelease.id).startsWith('rel-')) {
                const mockRisk = MOCK_RISKS[selectedRelease.id];
                if (mockRisk) {
                    setLiveRisks(mockRisk.risks);
                    setReadinessExplanations(mockRisk.readinessExplanations);
                } else {
                    setLiveRisks([]);
                    setReadinessExplanations([]);
                }
                return;
            }

            try {
                const res = await axios.get(`/api/releases/${selectedRelease.id}/risks`, {
                    withCredentials: true
                });
                
                // If backend returns empty risks for a non-mock release, that's real data
                setLiveRisks(res.data.risks || []);
                setReadinessExplanations(res.data.readinessExplanations || []);
            } catch (e) {
                console.error("Failed to fetch real time risks:", e);
                setLiveRisks([]);
                setReadinessExplanations([]);
            }
        };
        fetchRisks();
    }, [selectedRelease]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'FROZEN': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'READY': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'DEPLOYED': return 'text-slate-400 bg-slate-100 border-slate-200';
            case 'ACTIVE': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'STABILIZATION': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'DEGRADED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-100 border-slate-200';
        }
    };

    const handleDeleteRelease = async () => {
        if (!selectedRelease) return;
        setConfirmModal({
            title: 'Remove Release',
            message: `Are you sure you want to remove "${selectedRelease.name}"? This action is permanent and will delete all associated audits and progress.`,
            confirmLabel: 'Delete Permanently',
            confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
            onConfirm: async () => {
                try {
                    if (!selectedRelease.id.startsWith('rel-')) {
                        await axios.delete(`/api/releases/${selectedRelease.id}`, { withCredentials: true });
                        fetchReleases();
                    } else {
                        const updated = activeReleases.filter(r => r.id !== selectedRelease.id);
                        setActiveReleases(updated);
                        if (updated.length > 0) setSelectedRelease(updated[0]);
                        else setSelectedRelease(null);
                    }
                } catch (e) { 
                    console.error("Failed to delete", e);
                    alert("Failed to delete release. Check console for details.");
                }
                setConfirmModal(null);
            }
        });
    };

    const handleMarkReady = async () => {
        if (!selectedRelease) return;
        setConfirmModal({
            title: 'Mark Release Ready',
            message: `Are you sure you want to mark "${selectedRelease.name}" as READY? This signals that all verification gates are satisfied and the release is deployable.`,
            confirmLabel: 'Confirm Ready',
            confirmClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
            onConfirm: async () => {
                try {
                    if (String(selectedRelease.id).startsWith('rel-')) {
                        setActiveReleases(prev => prev.map(r => r.id === selectedRelease.id ? { ...r, status: 'READY' } : r));
                        setSelectedRelease(prev => ({ ...prev, status: 'READY' }));
                    } else {
                        await axios.patch(`/api/releases/${selectedRelease.id}/status`, { status: 'READY' }, { withCredentials: true });
                        fetchReleases();
                    }
                } catch (e) { console.error("Failed", e); }
                setConfirmModal(null);
            }
        });
    };

    const handleMarkActive = async () => {
        if (!selectedRelease) return;
        setConfirmModal({
            title: 'Return to Active Development',
            message: `Are you sure you want to return "${selectedRelease.name}" to ACTIVE status? This will unlock the payload for further commits and signal ongoing development.`,
            confirmLabel: 'Confirm Active',
            confirmClass: 'bg-blue-500 hover:bg-blue-600 text-white',
            onConfirm: async () => {
                try {
                    if (String(selectedRelease.id).startsWith('rel-')) {
                        setActiveReleases(prev => prev.map(r => r.id === selectedRelease.id ? { ...r, status: 'ACTIVE' } : r));
                        setSelectedRelease(prev => ({ ...prev, status: 'ACTIVE' }));
                    } else {
                        await axios.patch(`/api/releases/${selectedRelease.id}/status`, { status: 'ACTIVE' }, { withCredentials: true });
                        fetchReleases();
                    }
                } catch (e) { console.error("Failed", e); }
                setConfirmModal(null);
            }
        });
    };

    return (
        <div className="animate-in fade-in duration-500 h-full flex flex-col pt-2 text-slate-900">
            {/* Standardized Header */}
            <div className="flex items-center justify-between mb-4 pb-3">
                <div className="flex items-center gap-6">
                    <h1 className="text-4xl font-extrabold uppercase tracking-tight flex items-center gap-3">
                        <Rocket className="w-8 h-8 text-secondary" />
                        Releases
                    </h1>
                    <div className="hidden lg:flex items-center gap-2 pt-1">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">Deployment Orchestration</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Column View
                        </button>
                        <button
                            onClick={() => setViewMode('graph')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Graph View
                        </button>
                    </div>
                    <button
                        onClick={() => setIsComposerOpen(true)}
                        className="px-5 py-2.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-transform">
                        Initialize Branch
                    </button>
                </div>
            </div>

            {/* View Logic */}
            <div className="flex-1 mt-3">
                {viewMode === 'graph' ? (
                    <div style={{ height: '600px', width: '100%' }}>
                        <ReleaseCommandBoard
                            releases={activeReleases}
                            selectedReleaseId={selectedRelease?.id}
                            onSelectRelease={(release) => {
                                setSelectedRelease(release);
                            }}
                        />
                    </div>
                ) : (
                    <div className="h-full grid grid-cols-12 divide-x divide-slate-200/60">

                        {/* LEFT COLUMN: Active Releases */}
                        <div className="col-span-3 bg-slate-50/50 flex flex-col min-h-[600px]">
                            <div className="p-6 border-b border-slate-200/60 bg-white/50">
                                <h2 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5" />
                                    Active Branches
                                </h2>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                                        <div className="w-6 h-6 border-2 border-slate-300 border-t-secondary rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading releases...</p>
                                    </div>
                                ) : activeReleases.length === 0 ? (
                                    <p className="text-xs font-bold text-slate-400 p-4 text-center">No active releases.</p>
                                ) : (
                                    activeReleases.map(release => (
                                        <div
                                            key={release.id}
                                            onClick={() => setSelectedRelease(release)}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedRelease?.id === release.id ? 'bg-white border-slate-300 shadow-md shadow-slate-200/50' : 'bg-transparent border-transparent hover:bg-slate-100/50'} flex flex-col gap-3 group`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-secondary transition-colors">{release.name}</h3>
                                                {release.targetDateFormatted === 'Overdue' && release.status !== 'DEPLOYED' && (
                                                    <div className="bg-red-50 text-red-500 rounded-full p-1 animate-pulse" title="Release is Overdue">
                                                        <AlertTriangle className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between w-full mt-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getStatusColor(release.status)}`}>
                                                        {release.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                        <Cpu className="w-3 h-3 text-slate-400" />
                                                        {release.readinessScore}%
                                                    </span>
                                                </div>
                                                {release.status !== 'DEPLOYED' && (
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {release.targetDateFormatted}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* CENTER COLUMN: Readiness Overview */}
                        <div className="col-span-6 bg-white flex flex-col min-h-[600px] h-full overflow-y-auto custom-scrollbar">
                            {selectedRelease ? (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">

                                    <div className="p-6 md:px-10 pb-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${getStatusColor(selectedRelease.status)}`}>
                                                    {selectedRelease.status} MODULE
                                                </span>
                                                <div className="flex gap-2">
                                                    {/* ALWAYS VISIBLE DELETE BUTTON */}
                                                    <button
                                                        onClick={handleDeleteRelease}
                                                        className="h-8 w-8 flex items-center justify-center border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors order-last"
                                                        title="Remove Release"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>

                                                    {['READY', 'FROZEN'].includes(selectedRelease.status) && (
                                                        <button
                                                            onClick={handleMarkActive}
                                                            className="h-8 px-4 border border-blue-500 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors"
                                                        >
                                                            Mark Active
                                                        </button>
                                                    )}

                                                    {selectedRelease.status === 'READY' && (
                                                        <button
                                                            onClick={() => setIsDeployOpen(true)}
                                                            className="h-8 px-4 border border-red-500 bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                                        >
                                                            Deploy
                                                        </button>
                                                    )}
                                                    {selectedRelease.status === 'ACTIVE' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setIsImpactOpen(true)}
                                                                className="h-8 px-4 border border-amber-500 text-amber-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-colors"
                                                            >
                                                                Freeze Payload
                                                            </button>
                                                            <button
                                                                onClick={handleMarkReady}
                                                                className="h-8 px-4 border border-emerald-500 text-emerald-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                            >
                                                                Mark Ready
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{selectedRelease.name}</h2>
                                            <p className="text-sm text-slate-500 font-medium italic font-serif">{selectedRelease.description || 'No strategic specification provided.'}</p>
                                        </div>

                                        {/* Ownership Map */}
                                        <div className="flex items-center gap-4 mt-8 pb-4 border-b border-slate-100">
                                            {[
                                                { label: 'Engineering', key: 'engOwner', roleId: 'engOwnerId' },
                                                { label: 'Quality Assurance', key: 'qaOwner', roleId: 'qaOwnerId' },
                                                { label: 'Deployment', key: 'deployOwner', roleId: 'deployOwnerId' }
                                            ].map(({ label, key, roleId }) => (
                                                <div key={key} className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{label}</span>
                                                    <button
                                                        disabled={!['ADMIN', 'FOUNDER', 'MANAGER'].includes(user?.role)}
                                                        onClick={() => { setAssigningRole(roleId); setAssignModalOpen(true); }}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        {selectedRelease[key] ? (
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="w-4 h-4 rounded-md bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-500 uppercase">{selectedRelease[key].firstName?.[0] || '?'}</span>
                                                                {selectedRelease[key].firstName} {selectedRelease[key].lastName}
                                                            </span>
                                                        ) : <span className="text-amber-500 italic">Unassigned</span>}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="p-5 border border-slate-200/80 rounded-[24px] bg-slate-50 shadow-inner">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Cpu className="w-4 h-4 text-slate-400" />
                                                    <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Readiness Score</h4>
                                                </div>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-4xl font-bold tracking-tighter text-slate-900">{selectedRelease.readinessScore}<span className="text-lg text-slate-400">%</span></span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                                                    <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${selectedRelease.readinessScore}%` }} />
                                                </div>
                                            </div>
                                            <div className="p-5 border border-slate-200/80 rounded-[24px] bg-slate-50 shadow-inner">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Target Date</h4>
                                                </div>
                                                <div className="flex items-end gap-3">
                                                    <span className="text-3xl font-bold tracking-tighter text-slate-900">
                                                        {selectedRelease.status === 'DEPLOYED' ? 'Deployed' : selectedRelease.targetDateFormatted}
                                                    </span>
                                                    {selectedRelease.targetDateActual && (
                                                        <span className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {selectedRelease.targetDateActual}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                                    {selectedRelease.status === 'FROZEN' ? 'Codebase Locked' : 'Commits Allowed'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Linked Projects */}
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Linked Projects</h4>
                                                <span className="text-[10px] font-bold text-slate-400">{selectedRelease.projects?.length || 0} Included</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-slate-700">
                                                {selectedRelease.projects?.map(p => {
                                                    const realId = projectsMap[p.name.toLowerCase().trim()];
                                                    return (
                                                        <div
                                                            key={p.id}
                                                            onClick={() => {
                                                                if (realId) navigate(`/app/projects/${realId}`);
                                                                else alert(`Project "${p.name}" not found in the database.`);
                                                            }}
                                                            className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm flex items-center justify-between group cursor-pointer hover:border-secondary hover:shadow-md transition-all"
                                                        >
                                                            <span className="truncate pr-3 group-hover:text-secondary transition-colors">{p.name}</span>
                                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-secondary group-hover:translate-x-0.5 transition-all shrink-0" />
                                                        </div>
                                                    );
                                                })}
                                                {(!selectedRelease.projects || selectedRelease.projects.length === 0) && (
                                                    <p className="col-span-2 text-xs text-slate-400 italic">No projects bound to this release.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Blocking Tickets */}
                                        {selectedRelease.blockingTickets?.length > 0 && (
                                            <div className="space-y-4 pt-4">
                                                <div className="flex items-center justify-between border-b border-red-100 pb-2">
                                                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                                                        <ShieldAlert className="w-3.5 h-3.5" />
                                                        Blocking Tickets
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-red-400">{selectedRelease.blockingTickets.length} Active</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {selectedRelease.blockingTickets.map((bt, i) => {
                                                        // Find the real project ID for navigation
                                                        const firstProjectName = selectedRelease.projects?.[0]?.name || '';
                                                        const realProjectId = projectsMap[firstProjectName.toLowerCase().trim()];
                                                        return (
                                                            <div
                                                                key={i}
                                                                onClick={() => {
                                                                    if (realProjectId) navigate(`/app/projects/${realProjectId}?ticketId=${bt.ticketId}`);
                                                                    else navigate('/app/projects');
                                                                }}
                                                                className="p-3 border border-red-100 rounded-xl bg-red-50/50 flex items-center justify-between cursor-pointer hover:bg-red-100/50 hover:shadow-sm transition-all group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                                                                    <div>
                                                                        <span className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors">{bt.title}</span>
                                                                        <span className="text-[9px] font-bold text-slate-400 ml-2 uppercase">{bt.status}</span>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${bt.priority === 'Critical' ? 'text-red-500 bg-red-50 border-red-200' : 'text-amber-500 bg-amber-50 border-amber-200'}`}>
                                                                    {bt.priority}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3">Release Verification Status</h4>
                                            <ReleaseChecklistPanel releaseId={selectedRelease.id} mockChecklists={selectedRelease.checklists} />
                                        </div>
                                    </div>

                                    {/* History section in a fixed scrollable container */}
                                    <div className="mt-6 border-t border-slate-100 bg-slate-50/10 flex flex-col">
                                        <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-secondary" />
                                                History
                                            </h4>
                                        </div>
                                        <div className="h-[400px] overflow-y-auto custom-scrollbar md:px-10 px-6 py-6">
                                            <div className="max-w-3xl mx-auto">
                                                <ReleaseTimelinePanel release={selectedRelease} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select a release module</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Live Risk Panel */}
                        <div className="col-span-3 bg-slate-900 text-white flex flex-col h-fit min-h-0 max-h-full relative overflow-hidden shadow-inset-xl">

                            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-bl-[100px] pointer-events-none" />

                            <div className="p-6 border-b border-white/10 relative z-10">
                                <h2 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                    Live Risk Telemetry
                                </h2>
                            </div>

                            <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar-dark relative z-10 shrink-0 max-h-full">

                                {/* Engine Diagnostics */}
                                <div className="space-y-3">
                                    {liveRisks && liveRisks.length > 0 ? (
                                        liveRisks.map((risk, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-xl border-l-4 ${risk.severity === 'CRITICAL' ? 'border-l-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-l-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'} border-y border-r border-white/10 flex flex-col gap-2 relative overflow-hidden group`}
                                            >
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                                                <div className="flex items-start justify-between z-10">
                                                    <div className="flex items-center gap-2">
                                                        {risk.severity === 'CRITICAL' ? <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white leading-tight">{risk.type.replace(/_/g, ' ')}</p>
                                                    </div>
                                                </div>
                                                <div className="z-10 w-full pr-2">
                                                    <p className="text-[11px] font-bold text-slate-300 leading-snug">{risk.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 border border-white/10 border-dashed rounded-xl bg-white/5 gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                            <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest text-center">Zero Active Risks<br /><span className="text-slate-500">Pipeline optimal.</span></p>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Readiness Explanation Log */}
                                {readinessExplanations.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-4">Readiness Deficit Log</h3>
                                        {readinessExplanations.map((exp, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-amber-400">{exp}</span>
                                                <Activity className="w-3.5 h-3.5 text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {readinessExplanations.length > 0 && <div className="h-px bg-white/10" />}

                                {/* Dynamic Gate Requirements */}
                                <div className="space-y-3 pb-6">
                                    <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-4">Verification Gates</h3>
                                    {selectedRelease?.checklists && selectedRelease.checklists.length > 0 ? (
                                        selectedRelease.checklists.map((check, i) => (
                                            <div key={i} className="flex items-center justify-between group">
                                                <span className={`text-[11px] font-bold ${check.completionState ? 'text-slate-300' : 'text-slate-500'}`}>{check.title}</span>
                                                {check.completionState ?
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
                                                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600 group-hover:border-amber-500 transition-colors" />
                                                }
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[10px] text-slate-500 italic">No verification gates configured.</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ReleaseComposerModal
                isOpen={isComposerOpen}
                onClose={() => {
                    setIsComposerOpen(false);
                    fetchReleases();
                }}
                release={selectedRelease}
            />

            <DeployReleaseModal
                isOpen={isDeployOpen}
                onClose={() => {
                    setIsDeployOpen(false);
                    fetchReleases();
                }}
                release={selectedRelease}
            />

            <ReleaseImpactPreviewModal
                isOpen={isImpactOpen}
                onClose={() => setIsImpactOpen(false)}
                release={selectedRelease}
                onConfirmFreeze={async () => {
                    try {
                        if (!selectedRelease.id.startsWith('rel-')) {
                            // Pass overrideFreeze to bypass the guard middleware
                            await axios.patch(`/api/releases/${selectedRelease.id}/status`, { 
                                status: 'FROZEN',
                                overrideFreeze: true 
                            }, { withCredentials: true });
                            fetchReleases();
                            setIsImpactOpen(false); // Close the modal upon success
                        } else {
                            setActiveReleases(prev => prev.map(r => r.id === selectedRelease.id ? { ...r, status: 'FROZEN' } : r));
                            setSelectedRelease(prev => ({ ...prev, status: 'FROZEN' }));
                            setIsImpactOpen(false);
                        }
                    } catch (e) {
                        console.error("Failed to freeze", e);
                        alert("Freeze requires ADMIN override or encountered an error. Check console for details.");
                    }
                }}
            />

            <AssignRoleModal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                roleTitle={assigningRole === 'engOwnerId' ? 'Engineering Owner' : assigningRole === 'qaOwnerId' ? 'QA Owner' : 'Deployment Owner'}
                onAssign={async (userId, assignedUser) => {
                    const isMock = String(selectedRelease.id).startsWith('rel-');
                    const keyMap = {
                        engOwnerId: 'engOwner',
                        qaOwnerId: 'qaOwner',
                        deployOwnerId: 'deployOwner'
                    };

                    const updateLocalState = (uId, uObj) => {
                        const updateKey = keyMap[assigningRole];
                        const updateFunc = (r) => {
                            if (r.id !== selectedRelease.id) return r;
                            return { ...r, [updateKey]: uObj, [assigningRole]: uId };
                        };
                        setActiveReleases(prev => prev.map(updateFunc));
                        setSelectedRelease(prev => updateFunc(prev));
                    };

                    try {
                        // Instant UI update
                        updateLocalState(userId, assignedUser);

                        if (!isMock) {
                            await axios.put(`/api/releases/${selectedRelease.id}`, {
                                [assigningRole]: userId
                            }, { withCredentials: true });
                            // Fetch fresh state but it's now safe because getReleases includes full objects
                            await fetchReleases();
                        }
                        
                        setAssignModalOpen(false);
                    } catch (e) {
                        console.error("Failed to assign role:", e);
                        alert(`Assignment failed: ${e.response?.data?.error || e.message}.`);
                        // Refresh to sync if failed
                        fetchReleases();
                        setAssignModalOpen(false);
                    }
                }}
            />

            {/* Styled Confirmation Modal */}
            {
                confirmModal && ReactDOM.createPortal(
                    <div
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-backdrop-in"
                        onClick={() => setConfirmModal(null)}
                    >
                        <div
                            className="bg-white w-full max-w-md rounded-[28px] shadow-2xl border border-slate-200/60 overflow-hidden animate-slide-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 pb-4">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-secondary" />
                                    {confirmModal.title}
                                </h3>
                            </div>
                            <div className="px-8 pb-8 pt-2">
                                <p className="text-sm font-bold text-slate-500 leading-relaxed">{confirmModal.message}</p>
                            </div>
                            <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="px-6 py-2.5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${confirmModal.confirmClass}`}
                                >
                                    {confirmModal.confirmLabel}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

        </div >
    );
};

export default Releases;
