import fs from "fs";

const content = fs.readFileSync("c:/Users/ASUS/Desktop/college/Subjects/Sem6/Clarity/client/src/mock/workflowTemplates.js", "utf8");

// A simple approach: we find all instances of `"owners": [...],` and inject `"history": [...]` right after them if missing.
// We also need to guarantee 1-5 owners and 1-5 discussions. But the prompt says "Each event must contain sample data including: History entries, People assignments, Notes. Use organization users...".
// Assuming the `workflowTemplates.js` already has `owners` and `discussions` for most events based on my prior injection. BUT some DAG/Layered ones have empty `discussions: []`.

const newContent = content.replace(/discussions:\s*\[\]/g, `discussions: [
                    { author: "Alexander Pierce", content: "We need more focus on integration tests here.", timestamp: "2026-02-10T12:00:00Z" },
                    { author: "Elena Fisher", content: "Agreed. Adding it to the checklist.", timestamp: "2026-02-11T09:30:00Z" }
                ]`).replace(/executionNotes:\s*\[\]/g, `executionNotes: ["Verify all parameters.", "Cross-check dependencies."]`)
                .replace(/owners:\s*\["([^"]+)"\]/g, `owners: ["$1", "Jason Bourne", "Sarah Connor"]`) // bump owners to 3
                // add history if not present under owners
                .replace(/(owners:\s*\[[^\]]+\][^,]*),\s*(description:.+?,)/g, `$1,
                history: [
                    { date: "2026-02-05T08:00:00Z", author: "Sarah Connor", description: "Created event node." },
                    { date: "2026-02-06T10:15:00Z", author: "Alexander Pierce", description: "Updated execution criteria." }
                ],
                $2`);

fs.writeFileSync("c:/Users/ASUS/Desktop/college/Subjects/Sem6/Clarity/client/src/mock/workflowTemplates.js", newContent);
console.log("Injection complete.");
