// AUTO-GENERATED RICH MOCK DATA
export const mockWorkflowsData = {
    projects: [
        {
            id: "proj_root",
            name: "Organization Root",
            workflows: [
                {
                    id: "wf_adv_eng",
                    name: "Advanced Engineering Pipeline",
                    description: "End-to-end SDLC pipeline including code reviews, deep testing, and structured release train. Features intensive branching and review back-loops.",
                    version: "2.1.0",
                    createdBy: "Dipanshu Puri",
                    usageCount: 843,
                    updatedAt: "2026-02-23T03:23:55.868Z",
                    insights: [
                        { type: "bottleneck", message: "Code Review currently accounts for 40% of cycle time.", icon: "Clock" },
                        { type: "trend", message: "Rejection from QA to Development has spiked 12% this week.", icon: "TrendingUp" }
                    ],
                    history: [
          {
                    "date": "2026-02-18T04:23:55.868Z",
                    "author": "Dipanshu",
                    "description": "Initial workflow framework constructed."
          },
          {
                    "date": "2026-02-19T04:23:55.868Z",
                    "author": "Neha Kapoor",
                    "description": "Added complex branching for security and performance audits after UAT."
          },
          {
                    "date": "2026-02-21T04:23:55.868Z",
                    "author": "Aarav Mehta",
                    "description": "Enforced strict review loops on QA and UAT."
          },
          {
                    "date": "2026-02-22T04:23:55.868Z",
                    "author": "Dev Malhotra",
                    "description": "Added post-release monitoring node based on recent prod incidents."
          }
],
                    statuses: [
          {
                    "id": "n_backlog",
                    "name": "Backlog",
                    "category": "start",
                    "color": "#cbd5e1",
                    "x": 0,
                    "y": 0,
                    "owners": [
                              "Product Owner"
                    ],
                    "description": "Raw feature requests and bug reports waiting for prioritization.",
                    "executionNotes": [
                              "Checked compliance for Backlog phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Backlog phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.867Z"
                              }
                    ]
          },
          {
                    "id": "n_discovery",
                    "name": "Discovery",
                    "category": "active",
                    "color": "#3b82f6",
                    "x": 250,
                    "y": 0,
                    "owners": [
                              "Product Owner",
                              "Neha Kapoor"
                    ],
                    "description": "Gathering requirements, drafting the PRD, and aligning stakeholders.",
                    "executionNotes": [
                              "Checked compliance for Discovery phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Discovery phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_tech_design",
                    "name": "Technical Design",
                    "category": "active",
                    "color": "#6366f1",
                    "x": 500,
                    "y": 0,
                    "owners": [
                              "Aarav Mehta",
                              "Dipanshu"
                    ],
                    "description": "Architectural planning, database schema design, and API contracts.",
                    "executionNotes": [
                              "Checked compliance for Technical Design phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Technical Design phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_design_review",
                    "name": "Design Review",
                    "category": "review",
                    "color": "#eab308",
                    "x": 750,
                    "y": 0,
                    "owners": [
                              "Manager"
                    ],
                    "description": "Architects review the technical strategy to ensure scalability and alignment.",
                    "executionNotes": [
                              "Checked compliance for Design Review phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Design Review phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_development",
                    "name": "Development",
                    "category": "active",
                    "color": "#3b82f6",
                    "x": 1000,
                    "y": 0,
                    "owners": [
                              "Backend Team",
                              "Riya Sharma"
                    ],
                    "description": "Active coding sprint. Unit tests must be written alongside features.",
                    "executionNotes": [
                              "Checked compliance for Development phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Development phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_code_review",
                    "name": "Code Review",
                    "category": "review",
                    "color": "#eab308",
                    "x": 1250,
                    "y": 0,
                    "owners": [
                              "Dev Malhotra",
                              "Aarav Mehta"
                    ],
                    "description": "Peer reviews focused on code quality, test coverage, and security best practices.",
                    "executionNotes": [
                              "Checked compliance for Code Review phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Code Review phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_qa",
                    "name": "QA Testing",
                    "category": "active",
                    "color": "#a855f7",
                    "x": 1500,
                    "y": 0,
                    "owners": [
                              "QA Team"
                    ],
                    "description": "Comprehensive testing phase in staging environment. Includes edge cases and regression.",
                    "executionNotes": [
                              "Checked compliance for QA Testing phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the QA Testing phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_uat",
                    "name": "UAT",
                    "category": "review",
                    "color": "#f97316",
                    "x": 1750,
                    "y": 0,
                    "owners": [
                              "Product Owner"
                    ],
                    "description": "User Acceptance Testing by stakeholders to verify business criteria.",
                    "executionNotes": [
                              "Checked compliance for UAT phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the UAT phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_sec_audit",
                    "name": "Security Audit",
                    "category": "active",
                    "color": "#ec4899",
                    "x": 2000,
                    "y": -150,
                    "owners": [
                              "Security Team"
                    ],
                    "description": "Pen-testing and vulnerability scanning for critical path features.",
                    "executionNotes": [
                              "Checked compliance for Security Audit phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Security Audit phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_perf_audit",
                    "name": "Performance Audit",
                    "category": "active",
                    "color": "#14b8a6",
                    "x": 2000,
                    "y": 150,
                    "owners": [
                              "Dipanshu"
                    ],
                    "description": "Load testing and latency monitoring sweeps.",
                    "executionNotes": [
                              "Checked compliance for Performance Audit phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Performance Audit phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_ready_deploy",
                    "name": "Ready for Deploy",
                    "category": "active",
                    "color": "#8b5cf6",
                    "x": 2250,
                    "y": 0,
                    "owners": [
                              "Manager",
                              "Dev Malhotra"
                    ],
                    "description": "Final sign-off received. Ticket mapped to upcoming release cycle.",
                    "executionNotes": [
                              "Checked compliance for Ready for Deploy phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Ready for Deploy phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_production",
                    "name": "Production Release",
                    "category": "active",
                    "color": "#ef4444",
                    "x": 2500,
                    "y": 0,
                    "owners": [
                              "Backend Team"
                    ],
                    "description": "Code is actively deploying or deployed. Feature flags configured.",
                    "executionNotes": [
                              "Checked compliance for Production Release phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Production Release phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_monitoring",
                    "name": "Post-Release Monitor",
                    "category": "active",
                    "color": "#0ea5e9",
                    "x": 2750,
                    "y": 0,
                    "owners": [
                              "Dipanshu",
                              "Riya Sharma"
                    ],
                    "description": "Monitoring error rates and performance metrics 24h post-launch.",
                    "executionNotes": [
                              "Checked compliance for Post-Release Monitor phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Post-Release Monitor phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "n_closed",
                    "name": "Closed",
                    "category": "end",
                    "color": "#22c55e",
                    "x": 3000,
                    "y": 0,
                    "owners": [
                              "Product Owner"
                    ],
                    "description": "Feature successfully shipped and stable. Value delivered.",
                    "executionNotes": [
                              "Checked compliance for Closed phase.",
                              "Verified relevant tracking tickets."
                    ],
                    "discussions": [
                              {
                                        "author": "Dipanshu",
                                        "content": "Ensured the Closed phase covers edge cases.",
                                        "timestamp": "2026-02-21T04:23:55.868Z"
                              }
                    ]
          }
],
                    transitions: [
          {
                    "id": "e_bck_disc",
                    "fromStatusId": "n_backlog",
                    "toStatusId": "n_discovery",
                    "label": "Start Discovery",
                    "rules": [
                              "Must have priority assigned."
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Start Discovery.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_disc_tech",
                    "fromStatusId": "n_discovery",
                    "toStatusId": "n_tech_design",
                    "label": "PRD Approved",
                    "rules": [
                              "PRD linked",
                              "Business goals defined"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for PRD Approved.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_tech_rev",
                    "fromStatusId": "n_tech_design",
                    "toStatusId": "n_design_review",
                    "label": "Submit Design",
                    "rules": [
                              "Schema attached"
                    ],
                    "automation": [
                              "Notify Manager"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Submit Design.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_rev_dev",
                    "fromStatusId": "n_design_review",
                    "toStatusId": "n_development",
                    "label": "Design Approved",
                    "rules": [
                              "Manager approval stamp"
                    ],
                    "automation": [
                              "Alert Devs"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Design Approved.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_rev_tech",
                    "fromStatusId": "n_design_review",
                    "toStatusId": "n_tech_design",
                    "label": "Reject Design",
                    "rules": [
                              "Feedback provided"
                    ],
                    "automation": [
                              "Alert Aarav"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Reject Design.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_dev_cr",
                    "fromStatusId": "n_development",
                    "toStatusId": "n_code_review",
                    "label": "Create PR",
                    "rules": [
                              "PR link present",
                              "Tests pass"
                    ],
                    "automation": [
                              "Ping Dev Malhotra"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Create PR.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_cr_qa",
                    "fromStatusId": "n_code_review",
                    "toStatusId": "n_qa",
                    "label": "PR Approved",
                    "rules": [
                              "2 approvals required"
                    ],
                    "automation": [
                              "Deploy to Staging"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for PR Approved.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_cr_dev",
                    "fromStatusId": "n_code_review",
                    "toStatusId": "n_development",
                    "label": "Request Changes",
                    "rules": [
                              "Feedback is mandatory"
                    ],
                    "automation": [
                              "Email author"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Request Changes.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_qa_uat",
                    "fromStatusId": "n_qa",
                    "toStatusId": "n_uat",
                    "label": "QA Passed",
                    "rules": [
                              "Test cases linked"
                    ],
                    "automation": [
                              "Notify Product Owner"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for QA Passed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_qa_dev",
                    "fromStatusId": "n_qa",
                    "toStatusId": "n_development",
                    "label": "QA Failed",
                    "rules": [
                              "Bug ticket mapped"
                    ],
                    "automation": [
                              "Alert Assignee"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for QA Failed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_uat_sec",
                    "fromStatusId": "n_uat",
                    "toStatusId": "n_sec_audit",
                    "label": "Sec Path",
                    "rules": [
                              "Sec label present"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Sec Path.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_uat_perf",
                    "fromStatusId": "n_uat",
                    "toStatusId": "n_perf_audit",
                    "label": "Perf Path",
                    "rules": [
                              "Perf label present"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Perf Path.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_uat_dev",
                    "fromStatusId": "n_uat",
                    "toStatusId": "n_development",
                    "label": "UAT Rejected",
                    "rules": [
                              "JIRA sync"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for UAT Rejected.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_sec_ready",
                    "fromStatusId": "n_sec_audit",
                    "toStatusId": "n_ready_deploy",
                    "label": "Audit Passed",
                    "rules": [
                              "Vuln report clear"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Audit Passed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_sec_dev",
                    "fromStatusId": "n_sec_audit",
                    "toStatusId": "n_development",
                    "label": "Audit Failed",
                    "rules": [
                              "High sev vulnerabilities found"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Audit Failed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_perf_ready",
                    "fromStatusId": "n_perf_audit",
                    "toStatusId": "n_ready_deploy",
                    "label": "Perf Passed",
                    "rules": [
                              "Latency < 100ms"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Perf Passed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_perf_dev",
                    "fromStatusId": "n_perf_audit",
                    "toStatusId": "n_development",
                    "label": "Perf Failed",
                    "rules": [
                              "N+1 queries detected"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Perf Failed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_ready_prod",
                    "fromStatusId": "n_ready_deploy",
                    "toStatusId": "n_production",
                    "label": "Deploy to Prod",
                    "rules": [
                              "Release cut"
                    ],
                    "automation": [
                              "Trigger GitHub Action"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Deploy to Prod.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_prod_mon",
                    "fromStatusId": "n_production",
                    "toStatusId": "n_monitoring",
                    "label": "Deployed",
                    "rules": [
                              "Version tagged"
                    ],
                    "automation": [
                              "Start Datadog Monitors",
                              "Slack Announce"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Deployed.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "e_mon_closed",
                    "fromStatusId": "n_monitoring",
                    "toStatusId": "n_closed",
                    "label": "Sign-off",
                    "rules": [
                              "No spikes found ~24h",
                              "Error budget intact"
                    ],
                    "automation": [
                              "Mark Done"
                    ],
                    "discussions": [
                              {
                                        "author": "QA Team",
                                        "content": "Verified automation rules for Sign-off.",
                                        "timestamp": "2026-02-22T04:23:55.868Z"
                              }
                    ]
          }
],
                    discussions: [
                        { "author": "Dipanshu", "content": "This workflow is mandatory for all tier-1 services.", "timestamp": "2026-02-14T20:23:55.868Z" },
                        { "author": "Neha Kapoor", "content": "Should we make Performance Audit optional for frontend?", "timestamp": "2026-02-21T12:23:55.869Z" },
                        { "author": "Aarav Mehta", "content": "For now, everything passes through it. Better safe than sorry.", "timestamp": "2026-02-21T14:23:55.869Z" }
                    ]
                },
                {
                    id: "wf_sec_inc",
                    name: "Security Incident Response",
                    description: "High-velocity war-room protocol for P1/P2 data and infrastructure breaches. Strictly requires containment -> investigation -> legal loops.",
                    version: "1.4.2",
                    createdBy: "Security Team",
                    usageCount: 14,
                    updatedAt: "2026-02-23T02:23:55.869Z",
                    insights: [
                        { type: "trend", message: "Mean Time To Resolution (MTTR) is down 15%. Faster patching.", icon: "TrendingUp" }
                    ],
                    history: [
                        { "date": "2026-02-06T12:23:55.869Z", "author": "Security Team", "description": "V1 established." },
                        { "date": "2026-02-18T04:23:55.869Z", "author": "Manager", "description": "Added legal review mandate for data breaches." },
                        { "date": "2026-02-22T08:23:55.869Z", "author": "Dipanshu", "description": "Added regression loops to patching stage." }
                    ],
                    statuses: [
          {
                    "id": "i_triage",
                    "name": "Triage",
                    "category": "start",
                    "color": "#ef4444",
                    "x": 0,
                    "y": 0,
                    "owners": [
                              "Security Team"
                    ],
                    "description": "Evaluate incoming threat intelligence or alert.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_sev",
                    "name": "Sev Evaluation",
                    "category": "active",
                    "color": "#f97316",
                    "x": 250,
                    "y": 0,
                    "owners": [
                              "Dipanshu",
                              "Manager"
                    ],
                    "description": "Categorize incident as P1, P2, P3.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_contain",
                    "name": "Containment",
                    "category": "active",
                    "color": "#ef4444",
                    "x": 500,
                    "y": 0,
                    "owners": [
                              "Backend Team"
                    ],
                    "description": "Stop the bleeding. Shut down vulnerable instances.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_investigate",
                    "name": "Investigation",
                    "category": "active",
                    "color": "#8b5cf6",
                    "x": 750,
                    "y": 0,
                    "owners": [
                              "Aarav Mehta"
                    ],
                    "description": "Forensics, log analysis, and root cause tracing.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_legal",
                    "name": "Legal Review",
                    "category": "review",
                    "color": "#eab308",
                    "x": 1000,
                    "y": -150,
                    "owners": [
                              "Manager"
                    ],
                    "description": "Legal team assesses breach disclosure mandates.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_pr",
                    "name": "PR Strategy",
                    "category": "review",
                    "color": "#0ea5e9",
                    "x": 1000,
                    "y": 150,
                    "owners": [
                              "Product Owner"
                    ],
                    "description": "Drafting customer communications if required.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_resolve",
                    "name": "Resolution",
                    "category": "active",
                    "color": "#3b82f6",
                    "x": 1250,
                    "y": 0,
                    "owners": [
                              "Riya Sharma"
                    ],
                    "description": "Developing and deploying the final patch.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_review",
                    "name": "Patch Review",
                    "category": "review",
                    "color": "#eab308",
                    "x": 1500,
                    "y": 0,
                    "owners": [
                              "Dev Malhotra"
                    ],
                    "description": "Mandatory peer review for hotfixes.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_deploy",
                    "name": "Emerg Deploy",
                    "category": "active",
                    "color": "#ec4899",
                    "x": 1750,
                    "y": 0,
                    "owners": [
                              "Backend Team"
                    ],
                    "description": "Bypass standard CI pipeline for rapid rollout.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_monitor",
                    "name": "Active Monitor",
                    "category": "active",
                    "color": "#14b8a6",
                    "x": 2000,
                    "y": 0,
                    "owners": [
                              "QA Team"
                    ],
                    "description": "Watching logs closely for regressions or secondary attacks.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_post",
                    "name": "Post-Mortem",
                    "category": "review",
                    "color": "#6366f1",
                    "x": 2250,
                    "y": 0,
                    "owners": [
                              "Dipanshu",
                              "Aarav Mehta"
                    ],
                    "description": "Documenting timeline, failures, and preventative actions.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "i_close",
                    "name": "Closed",
                    "category": "end",
                    "color": "#22c55e",
                    "x": 2500,
                    "y": 0,
                    "owners": [
                              "Manager"
                    ],
                    "description": "Incident fully resolved and post-mortem signed off.",
                    "executionNotes": [
                              "Fast-track protocol applies.",
                              "Check SLA limits."
                    ],
                    "discussions": [
                              {
                                        "author": "Security Team",
                                        "content": "Always prioritize containment.",
                                        "timestamp": "2026-02-23T03:23:55.868Z"
                              }
                    ]
          }
],
                    transitions: [
          {
                    "id": "ie_t_s",
                    "fromStatusId": "i_triage",
                    "toStatusId": "i_sev",
                    "label": "Confirm",
                    "rules": [
                              "Verify IOC"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_s_c",
                    "fromStatusId": "i_sev",
                    "toStatusId": "i_contain",
                    "label": "P1/P2 Declared",
                    "rules": [
                              "Sev >= P2"
                    ],
                    "automation": [
                              "Page All",
                              "Wake CEO"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_c_i",
                    "fromStatusId": "i_contain",
                    "toStatusId": "i_investigate",
                    "label": "Contained",
                    "rules": [
                              "Vulnerability isolated",
                              "Killswitches active"
                    ],
                    "automation": [
                              "Log Timestamp"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_i_l",
                    "fromStatusId": "i_investigate",
                    "toStatusId": "i_legal",
                    "label": "Data Breach",
                    "rules": [
                              "PII exposed"
                    ],
                    "automation": [
                              "Contact General Counsel"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_i_p",
                    "fromStatusId": "i_investigate",
                    "toStatusId": "i_pr",
                    "label": "Public Outage",
                    "rules": [
                              "Downtime > 5m"
                    ],
                    "automation": [
                              "Update Statuspage"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_i_r",
                    "fromStatusId": "i_investigate",
                    "toStatusId": "i_resolve",
                    "label": "Root Cause Found",
                    "rules": [
                              "Exploit replicated locally"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_l_r",
                    "fromStatusId": "i_legal",
                    "toStatusId": "i_resolve",
                    "label": "Legal OK",
                    "rules": [
                              "Counsel sign-off"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_p_r",
                    "fromStatusId": "i_pr",
                    "toStatusId": "i_resolve",
                    "label": "PR Sent",
                    "rules": [
                              "Exec approval"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_r_rev",
                    "fromStatusId": "i_resolve",
                    "toStatusId": "i_review",
                    "label": "Patch Devbed",
                    "rules": [
                              "Unit tests passed"
                    ],
                    "automation": [
                              "Ping Reviewers"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_rev_d",
                    "fromStatusId": "i_review",
                    "toStatusId": "i_deploy",
                    "label": "Patch Perfect",
                    "rules": [
                              "1 Tech Lead Approval"
                    ],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_rev_r",
                    "fromStatusId": "i_review",
                    "toStatusId": "i_resolve",
                    "label": "Fix Failed",
                    "rules": [
                              "Vulnerability bypass found"
                    ],
                    "automation": [
                              "Escalate"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_d_m",
                    "fromStatusId": "i_deploy",
                    "toStatusId": "i_monitor",
                    "label": "Live",
                    "rules": [],
                    "automation": [
                              "Purge CDN Cache"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_m_post",
                    "fromStatusId": "i_monitor",
                    "toStatusId": "i_post",
                    "label": "Stable 24h",
                    "rules": [],
                    "automation": [],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_m_r",
                    "fromStatusId": "i_monitor",
                    "toStatusId": "i_resolve",
                    "label": "Regression",
                    "rules": [],
                    "automation": [
                              "Reopen War-room"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          },
          {
                    "id": "ie_post_c",
                    "fromStatusId": "i_post",
                    "toStatusId": "i_close",
                    "label": "Miroboard signed",
                    "rules": [
                              "RCA doc attached"
                    ],
                    "automation": [
                              "Close Incident",
                              "Notify All"
                    ],
                    "discussions": [
                              {
                                        "author": "Manager",
                                        "content": "SLA triggers review anytime this path fires.",
                                        "timestamp": "2026-02-23T02:23:55.868Z"
                              }
                    ]
          }
],
                    discussions: [
                        { "author": "QA Team", "content": "Hotfixes still need sanity checks in active monitor.", "timestamp": "2026-02-22T18:23:55.869Z" },
                        { "author": "Dev Malhotra", "content": "We can bypass deploy restrictions but an RCA is non-negotiable.", "timestamp": "2026-02-22T23:23:55.869Z" }
                    ]
                }
            ]
        }
    ]
};
