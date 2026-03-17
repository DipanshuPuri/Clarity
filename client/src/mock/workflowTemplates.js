// Additional Workflow Templates with rich sample data per event
const PEOPLE = ['Alexander Pierce', 'Sarah Connor', 'Jason Bourne', 'Elena Fisher', 'Peter Parker'];
const ts = (d) => `2026-02-${String(d).padStart(2,'0')}T${10+Math.floor(Math.random()*8)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:00Z`;

export const workflowTemplates = [
    {
        id: "wf_decision_matrix",
        name: "Strategic Decision Matrix",
        description: "A binary tree evaluation framework for high-stakes capability routing and investment analysis.",
        version: "3.0.1",
        createdBy: "Sarah Connor",
        usageCount: 42,
        updatedAt: "2026-02-22T14:30:00Z",
        insights: [
            { type: "bottleneck", message: "Financial review often loops back due to missing ROI projections.", icon: "Clock" }
        ],
        history: [
            { date: "2026-02-10T10:00:00Z", author: "Sarah Connor", description: "Created binary decision framework." },
            { date: "2026-02-12T09:15:00Z", author: "Alexander Pierce", description: "Added executive signoff gate." },
            { date: "2026-02-15T14:45:00Z", author: "Jason Bourne", description: "Wired financial and technical rejection paths." },
            { date: "2026-02-18T11:30:00Z", author: "Elena Fisher", description: "Improved rework loop logic from exec signoff." }
        ],
        statuses: [
            {
                id: "dm_start", name: "Initiate Proposal", category: "start", color: "#cbd5e1", x: 500, y: 0,
                owners: ["Alexander Pierce", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "New initiative proposed by any team lead with a formal submission.",
                executionNotes: ["Attach budget estimate.", "Link to strategic brief."],
                discussions: [
                    { author: "Alexander Pierce", content: "Every proposal must link back to a quarterly OKR.", timestamp: ts(10) },
                    { author: "Sarah Connor", content: "Added auto-routing to finance for proposals above $50k.", timestamp: ts(11) }
                ]
            },
            {
                id: "dm_review", name: "Initial Review", category: "review", color: "#eab308", x: 500, y: 150,
                owners: ["Jason Bourne", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Triage and preliminary sanity check for completeness.",
                executionNotes: ["Check for duplicate proposals.", "Ensure OKR alignment."],
                discussions: [
                    { author: "Jason Bourne", content: "I'm tagging ops team for proposals touching infra.", timestamp: ts(12) }
                ]
            },
            {
                id: "dm_fin", name: "Financial Audit", category: "active", color: "#3b82f6", x: 250, y: 300,
                owners: ["Elena Fisher", "Peter Parker"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Budget allocation check and ROI projection analysis.",
                executionNotes: ["Run NPV model.", "Confirm headcount availability."],
                discussions: [
                    { author: "Elena Fisher", content: "All projections need a 3-year horizon minimum.", timestamp: ts(13) },
                    { author: "Peter Parker", content: "Can we automate the spreadsheet pull from Finance API?", timestamp: ts(14) }
                ]
            },
            {
                id: "dm_tech", name: "Technical Feasibility", category: "active", color: "#14b8a6", x: 750, y: 300,
                owners: ["Jason Bourne", "Alexander Pierce"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Architecture and capacity check — can we actually build this?",
                executionNotes: ["Review database schema impact.", "Check API rate limits."],
                discussions: [
                    { author: "Jason Bourne", content: "Adding load test requirement for anything touching prod.", timestamp: ts(14) },
                    { author: "Alexander Pierce", content: "We should involve the SRE team for infra proposals.", timestamp: ts(15) }
                ]
            },
            {
                id: "dm_fin_app", name: "Fin Approved", category: "active", color: "#22c55e", x: 100, y: 450,
                owners: ["Elena Fisher", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Financial requirements met. Funds secured for the quarter.",
                executionNotes: ["Lock budget allocation."],
                discussions: [
                    { author: "Elena Fisher", content: "Q2 budget confirmed for all approved proposals.", timestamp: ts(16) }
                ]
            },
            {
                id: "dm_fin_rej", name: "Fin Rejected", category: "end", color: "#ef4444", x: 400, y: 450,
                owners: ["Elena Fisher", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Budget denied — insufficient ROI or conflicting allocations.",
                executionNotes: ["Notify submitter with rejection reasons."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dm_tech_app", name: "Tech Approved", category: "active", color: "#22c55e", x: 600, y: 450,
                owners: ["Jason Bourne", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Architecture approved. No blockers identified.",
                executionNotes: ["Update capacity planner."],
                discussions: [
                    { author: "Jason Bourne", content: "Green-lit after load test review.", timestamp: ts(17) }
                ]
            },
            {
                id: "dm_tech_rej", name: "Tech Rejected", category: "end", color: "#ef4444", x: 900, y: 450,
                owners: ["Jason Bourne", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Technically unviable with current stack or timeline.",
                executionNotes: ["Provide alternative approach if feasible."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dm_exec", name: "Executive Signoff", category: "review", color: "#8b5cf6", x: 500, y: 600,
                owners: ["Alexander Pierce", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Final strategic greenlight from CTO or VP Engineering.",
                executionNotes: ["Requires both financial and technical approval.", "Calendar invite for sign-off meeting."],
                discussions: [
                    { author: "Alexander Pierce", content: "I'll batch sign-offs on Fridays to reduce overhead.", timestamp: ts(18) },
                    { author: "Sarah Connor", content: "Can we add a Slack notification when items reach exec review?", timestamp: ts(19) }
                ]
            },
            {
                id: "dm_done", name: "Funded & Scheduled", category: "end", color: "#22c55e", x: 500, y: 750,
                owners: ["Sarah Connor", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Project initiated. Team assigned, sprint 0 planned.",
                executionNotes: ["Create project in Jira.", "Add to roadmap board."],
                discussions: [
                    { author: "Sarah Connor", content: "Auto-creating the project card when this state is reached.", timestamp: ts(20) }
                ]
            }
        ],
        transitions: [
            { id: "tr_dm_1", fromStatusId: "dm_start", toStatusId: "dm_review", label: "Submit", rules: ["Proposal form complete"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_2", fromStatusId: "dm_review", toStatusId: "dm_fin", label: "Check Budget", rules: ["Manager approval"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_3", fromStatusId: "dm_review", toStatusId: "dm_tech", label: "Check Feasibility", rules: ["Scope defined"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_4", fromStatusId: "dm_fin", toStatusId: "dm_fin_app", label: "Pass", rules: ["ROI > 15%"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_5", fromStatusId: "dm_fin", toStatusId: "dm_fin_rej", label: "Fail", rules: ["Budget exceeded"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_6", fromStatusId: "dm_tech", toStatusId: "dm_tech_app", label: "Pass", rules: ["No blockers"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_7", fromStatusId: "dm_tech", toStatusId: "dm_tech_rej", label: "Fail", rules: ["Infra limitation"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_8", fromStatusId: "dm_fin_app", toStatusId: "dm_exec", label: "Escalate", rules: ["Finance sign-off"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_9", fromStatusId: "dm_tech_app", toStatusId: "dm_exec", label: "Escalate", rules: ["Tech sign-off"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_10", fromStatusId: "dm_exec", toStatusId: "dm_done", label: "Approve", rules: ["Exec stamp"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dm_11", fromStatusId: "dm_exec", toStatusId: "dm_start", label: "Rework", rules: ["Feedback provided"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] }
        ],
        discussions: [
            { author: "Sarah Connor", content: "This matrix is now mandatory for all proposals above $30k.", timestamp: "2026-02-14T09:00:00Z" },
            { author: "Alexander Pierce", content: "Good. We've reduced rogue spending by 40% since adopting this.", timestamp: "2026-02-16T15:30:00Z" }
        ]
    },
    {
        id: "wf_continuous_loop",
        name: "Continuous Improvement Loop",
        description: "A circular retrospective and action model for iterative team enhancements across sprint boundaries.",
        version: "1.1.0",
        createdBy: "Jason Bourne",
        usageCount: 112,
        updatedAt: "2026-02-20T08:00:00Z",
        insights: [
            { type: "trend", message: "Teams using this loop show 22% faster cycle time improvement.", icon: "TrendingUp" }
        ],
        history: [
            { date: "2026-02-05T09:00:00Z", author: "Jason Bourne", description: "Created v1 of the improvement loop." },
            { date: "2026-02-10T11:00:00Z", author: "Elena Fisher", description: "Added root cause analysis node." },
            { date: "2026-02-14T16:00:00Z", author: "Peter Parker", description: "Connected measurement feedback to gather node." }
        ],
        statuses: [
            {
                id: "cl_gather", name: "Gather Feedback", category: "start", color: "#0ea5e9", x: 500, y: 0,
                owners: ["Peter Parker", "Elena Fisher"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Collect sprint retrospective data, customer complaints, and metric anomalies.",
                executionNotes: ["Send survey 24h before retro.", "Pull DORA metrics from CI."],
                discussions: [
                    { author: "Peter Parker", content: "Using Google Forms for anonymous feedback now.", timestamp: ts(8) },
                    { author: "Elena Fisher", content: "Should we also pull NPS scores here?", timestamp: ts(9) },
                    { author: "Jason Bourne", content: "Yes, NPS belongs in this phase.", timestamp: ts(9) }
                ]
            },
            {
                id: "cl_analyze", name: "Root Cause Analysis", category: "active", color: "#a855f7", x: 700, y: 200,
                owners: ["Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Apply 5 Whys or fishbone diagrams to identify root causes.",
                executionNotes: ["Timebox analysis to 2 hours.", "Document findings in Confluence."],
                discussions: [
                    { author: "Jason Bourne", content: "Fishbone works better for cross-team issues.", timestamp: ts(10) },
                    { author: "Sarah Connor", content: "Let's standardize on 5 Whys for single-team problems.", timestamp: ts(11) }
                ]
            },
            {
                id: "cl_plan", name: "Action Planning", category: "review", color: "#eab308", x: 500, y: 400,
                owners: ["Alexander Pierce", "Jason Bourne"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Formulate concrete action items with owners and due dates.",
                executionNotes: ["Each action must have a DRI.", "Max 3 actions per cycle."],
                discussions: [
                    { author: "Alexander Pierce", content: "Keeping it to 3 actions prevents dilution.", timestamp: ts(12) },
                    { author: "Peter Parker", content: "Can we track these in Jira instead of Notion?", timestamp: ts(13) }
                ]
            },
            {
                id: "cl_exec", name: "Implement Changes", category: "active", color: "#22c55e", x: 300, y: 200,
                owners: ["Elena Fisher", "Peter Parker"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Apply improvement actions within the next sprint cycle.",
                executionNotes: ["Tag tickets with [IMPROVEMENT].", "Demo results in next retro."],
                discussions: [
                    { author: "Elena Fisher", content: "Last cycle's changes reduced deploy failures by 18%.", timestamp: ts(15) },
                    { author: "Jason Bourne", content: "Great result. Make sure to document the before/after.", timestamp: ts(16) }
                ]
            }
        ],
        transitions: [
            { id: "tr_cl_1", fromStatusId: "cl_gather", toStatusId: "cl_analyze", label: "Process", rules: ["Feedback collected"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_cl_2", fromStatusId: "cl_analyze", toStatusId: "cl_plan", label: "Propose", rules: ["Root cause identified"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_cl_3", fromStatusId: "cl_plan", toStatusId: "cl_exec", label: "Commit", rules: ["DRI assigned"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_cl_4", fromStatusId: "cl_exec", toStatusId: "cl_gather", label: "Measure Again", rules: ["Sprint complete"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] }
        ],
        discussions: [
            { author: "Jason Bourne", content: "Every team should run this loop bi-weekly.", timestamp: "2026-02-06T10:00:00Z" },
            { author: "Elena Fisher", content: "Omega team saw the best results so far.", timestamp: "2026-02-14T14:00:00Z" }
        ]
    },
    {
        id: "wf_staggered_diag",
        name: "Rapid Onboarding Diagonal",
        description: "A staggered linear flow simulating a highly concurrent onboarding sequence across HR, IT, Security, and Department functions.",
        version: "2.0.0",
        createdBy: "Elena Fisher",
        usageCount: 89,
        updatedAt: "2026-02-18T12:00:00Z",
        insights: [
            { type: "bottleneck", message: "IT Provisioning takes an average of 2.3 days — longest step.", icon: "Clock" }
        ],
        history: [
            { date: "2026-01-28T10:00:00Z", author: "Elena Fisher", description: "Created onboarding workflow v1." },
            { date: "2026-02-02T14:30:00Z", author: "Sarah Connor", description: "Added security briefing as mandatory step." },
            { date: "2026-02-08T09:00:00Z", author: "Alexander Pierce", description: "Integrated with HR systems for auto-trigger." },
            { date: "2026-02-12T16:00:00Z", author: "Peter Parker", description: "Added department-specific customization gate." },
            { date: "2026-02-15T11:00:00Z", author: "Jason Bourne", description: "Reduced IT provisioning SLA from 3 days to 2." }
        ],
        statuses: [
            {
                id: "onb_hr", name: "HR Induction", category: "start", color: "#cbd5e1", x: 0, y: 0,
                owners: ["Sarah Connor", "Elena Fisher"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Employment paperwork, NDA signing, benefits enrollment.",
                executionNotes: ["Verify I-9 documentation.", "Issue employee badge.", "Setup payroll."],
                discussions: [
                    { author: "Sarah Connor", content: "We've automated the NDA signing via DocuSign.", timestamp: ts(5) },
                    { author: "Elena Fisher", content: "Badge issuance still needs physical presence. Working on virtual option.", timestamp: ts(6) },
                    { author: "Alexander Pierce", content: "Can we batch new hires on Mondays for efficiency?", timestamp: ts(7) }
                ]
            },
            {
                id: "onb_it", name: "IT Provisioning", category: "active", color: "#3b82f6", x: 200, y: 150,
                owners: ["Peter Parker", "Jason Bourne"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Hardware allocation, account setup, VPN access, and tool licenses.",
                executionNotes: ["Order laptop 5 days before start.", "Provision Slack, GitHub, Jira accounts.", "Setup SSO."],
                discussions: [
                    { author: "Peter Parker", content: "Moved to same-day provisioning for Slack and GitHub.", timestamp: ts(8) },
                    { author: "Jason Bourne", content: "VPN certs are now auto-generated. No more manual steps.", timestamp: ts(9) }
                ]
            },
            {
                id: "onb_sec", name: "Security Briefing", category: "active", color: "#ef4444", x: 400, y: 300,
                owners: ["Jason Bourne", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Access control policies, data handling procedures, and incident reporting.",
                executionNotes: ["Complete security awareness training.", "Sign data handling agreement.", "Setup 2FA."],
                discussions: [
                    { author: "Jason Bourne", content: "Training is now a 45-minute video + quiz.", timestamp: ts(10) },
                    { author: "Sarah Connor", content: "Pass rate is 94%. Those who fail get a 1-on-1 session.", timestamp: ts(11) }
                ]
            },
            {
                id: "onb_dept", name: "Department Specific", category: "active", color: "#14b8a6", x: 600, y: 450,
                owners: ["Alexander Pierce", "Elena Fisher"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Team introductions, codebase walkthrough, and project context briefing.",
                executionNotes: ["Assign buddy for first 30 days.", "Schedule 1-on-1 with manager.", "Share team wiki."],
                discussions: [
                    { author: "Alexander Pierce", content: "Each department has a custom checklist now.", timestamp: ts(12) },
                    { author: "Elena Fisher", content: "Engineering onboarding includes a starter ticket.", timestamp: ts(13) },
                    { author: "Peter Parker", content: "Love the starter ticket idea. Shipped my first PR on day 2.", timestamp: ts(14) }
                ]
            },
            {
                id: "onb_grad", name: "Fully Integrated", category: "end", color: "#22c55e", x: 800, y: 600,
                owners: ["Alexander Pierce", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Employee is fully operational. 30-day check-in scheduled.",
                executionNotes: ["Schedule 30-day feedback session.", "Add to org chart.", "Remove probation flag."],
                discussions: [
                    { author: "Alexander Pierce", content: "Average time to fully integrated: 8.5 days.", timestamp: ts(18) },
                    { author: "Sarah Connor", content: "Down from 14 days last quarter. Great improvement.", timestamp: ts(19) }
                ]
            }
        ],
        transitions: [
            { id: "tr_on_1", fromStatusId: "onb_hr", toStatusId: "onb_it", label: "Paperwork Complete", rules: ["All docs signed"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_on_2", fromStatusId: "onb_it", toStatusId: "onb_sec", label: "Accounts Ready", rules: ["All tools provisioned"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_on_3", fromStatusId: "onb_sec", toStatusId: "onb_dept", label: "Cleared", rules: ["Security quiz passed"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_on_4", fromStatusId: "onb_dept", toStatusId: "onb_grad", label: "Integrated", rules: ["Buddy sign-off"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] }
        ],
        discussions: [
            { author: "Elena Fisher", content: "This workflow should be triggered automatically when HR creates a new employee record.", timestamp: "2026-02-01T08:00:00Z" },
            { author: "Alexander Pierce", content: "Agreed. Working with IT on the integration.", timestamp: "2026-02-03T09:30:00Z" },
        ]
    },
    {
        id: "wf_branching_dag",
        name: "Feature Launch Coordination",
        description: "A Branching DAG used to parallelize and coordinate engineering, marketing, and legal efforts before a synchronized public release.",
        version: "1.4.0",
        createdBy: "Sarah Connor",
        usageCount: 65,
        updatedAt: "2026-02-28T09:00:00Z",
        insights: [
            { type: "bottleneck", message: "Legal review often stalls parallel tracks.", icon: "ShieldAlert" }
        ],
        history: [
            { date: "2026-02-15T10:00:00Z", author: "Sarah Connor", description: "Established parallel launch DAG." },
            { date: "2026-02-18T14:30:00Z", author: "Alexander Pierce", description: "Added legal review dependency for PR track." }
        ],
        statuses: [
            {
                id: "dag_init", name: "Launch Initiated", category: "start", color: "#cbd5e1", x: 400, y: 0,
                owners: ["Sarah Connor", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Feature is feature-complete in staging. Final pre-launch coordination begins.",
                executionNotes: ["Lock code freeze.", "Trigger coordination DAG."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dag_mkt", name: "Marketing Assets", category: "active", color: "#ec4899", x: 100, y: 150,
                owners: ["Elena Fisher", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Prepare social media posts, blog drafts, and ad copy.",
                executionNotes: ["Requires finalized screenshots."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dag_qa", name: "QA Signoff", category: "active", color: "#3b82f6", x: 400, y: 150,
                owners: ["Jason Bourne", "Peter Parker"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Final regression cycle and security scan.",
                executionNotes: ["Run automated suite.", "Pen test new endpoints."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dag_leg", name: "Legal Review", category: "review", color: "#8b5cf6", x: 700, y: 150,
                owners: ["Alexander Pierce", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Review terms of service changes and compliance.",
                executionNotes: ["GDPR checklist."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dag_sync", name: "Go/No-Go Sync", category: "review", color: "#eab308", x: 400, y: 350,
                owners: ["Sarah Connor", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "All parallel tracks must converge here for the final launch decision.",
                executionNotes: ["Requires all green signals."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            },
            {
                id: "dag_deploy", name: "Production Rollout", category: "end", color: "#22c55e", x: 400, y: 500,
                owners: ["Jason Bourne", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Code goes live, marketing goes out, release notes published.",
                executionNotes: ["Monitor logs for 1 hour."],
                discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
            }
        ],
        transitions: [
            { id: "tr_dag_1", fromStatusId: "dag_init", toStatusId: "dag_mkt", label: "Trigger MKT", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dag_2", fromStatusId: "dag_init", toStatusId: "dag_qa", label: "Trigger QA", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dag_3", fromStatusId: "dag_init", toStatusId: "dag_leg", label: "Trigger Legal", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dag_4", fromStatusId: "dag_mkt", toStatusId: "dag_sync", label: "Assets Ready", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dag_5", fromStatusId: "dag_qa", toStatusId: "dag_sync", label: "Tests Passed", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dag_6", fromStatusId: "dag_leg", toStatusId: "dag_sync", label: "Compliance Met", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_dag_7", fromStatusId: "dag_sync", toStatusId: "dag_deploy", label: "Launch", rules: ["Unanimous approval"], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] }
        ],
        discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
    },
    {
        id: "wf_layered_arch",
        name: "Layered System Migration",
        description: "A stacked layered architecture representing top-down dependencies (UI to API to DB) for full-stack rollouts.",
        version: "1.0.1",
        createdBy: "Jason Bourne",
        usageCount: 22,
        updatedAt: "2026-03-01T12:00:00Z",
        insights: [],
        history: [],
        statuses: [
            { id: "lay_ui", name: "Presentation Layer", category: "start", color: "#f97316", x: 300, y: 0, owners: ["Peter Parker", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Client-side frontend deployment.", executionNotes: ["Verify all parameters.", "Cross-check dependencies."], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "lay_api", name: "API Gateway", category: "active", color: "#0ea5e9", x: 300, y: 150, owners: ["Jason Bourne", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Routing and rate limiting configuration updates.", executionNotes: ["Verify all parameters.", "Cross-check dependencies."], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "lay_biz", name: "Business Logic", category: "active", color: "#6366f1", x: 300, y: 300, owners: ["Elena Fisher", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Microservice core functionality deployment.", executionNotes: ["Verify all parameters.", "Cross-check dependencies."], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "lay_db", name: "Data Layer", category: "end", color: "#14b8a6", x: 300, y: 450, owners: ["Alexander Pierce", "Jason Bourne", "Sarah Connor"],
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                description: "Database schema migrations and persistence tier.", executionNotes: ["Verify all parameters.", "Cross-check dependencies."], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] }
        ],
        transitions: [
            { id: "tr_lay_1", fromStatusId: "lay_ui", toStatusId: "lay_api", label: "Consumes", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_lay_2", fromStatusId: "lay_api", toStatusId: "lay_biz", label: "Routes to", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] },
            { id: "tr_lay_3", fromStatusId: "lay_biz", toStatusId: "lay_db", label: "Persists to", rules: [], discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ] }
        ],
        discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]
    }
];
