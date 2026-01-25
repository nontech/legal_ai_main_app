## Create a Cursor Chat Command (extreme expert prompt)

### What Cursor Commands are
- **Cursor Chat Commands** are plain Markdown files stored in `.cursor/commands` that you can trigger by typing `/` in chat. They standardize workflows, enforce quality, and accelerate repetitive tasks across a team.
- Commands are just Markdown prompts. Cursor reads the file’s content and uses it as the agent instruction for the current chat context.
- Files are auto-discovered from `.cursor/commands` and listed under the `/` menu.

Reference: [Cursor Chat Commands docs](https://cursor.com/docs/agent/chat/commands)

### How they work (from the docs)
- **Location**: Place `.md` files under `.cursor/commands`.
- **Discovery**: Type `/` in chat to see the list of commands (file name without extension is shown).
- **Execution**: When selected, the command’s Markdown is sent as the instruction to the agent.
- **Versioning/Sharing**: They live in your repo, so they’re shared via Git with your team.

Example directory:
```bash
.cursor/
  commands/
    address-github-pr-comments.md
    code-review-checklist.md
    create-pr.md
    light-review-existing-diffs.md
    onboard-new-developer.md
    run-all-tests-and-fix.md
    security-audit.md
    setup-new-feature.md
```

### Naming & file conventions
- Use kebab-case for file names: `short-actionable-name.md`.
- Start with a strong title and a one-liner purpose. Keep the rest crisp and skimmable.
- Prefer checklists and explicit outputs to reduce ambiguity.

---

## Use this command to create a new command
When you run `/create-command` (this file), it will guide you and then generate a new command file.

### What I (the agent) will do
1. Ask a few clarifying questions if needed: target workflow, desired result, input constraints, output format, tools/limits.
2. Propose 2–3 filename options (kebab-case) and confirm the selection.
3. Draft the command content using the template below, tailored to your use case.
4. Create or overwrite `.cursor/commands/<file-name>.md` with the content.
5. Return a short usage guide and a dry-run checklist.

### Questions I’ll ask you (answer succinctly)
- Goal: What should this command accomplish in one sentence?
- Scope: What steps must the agent take? What must it avoid?
- Inputs: What inputs will you provide at run time (e.g., a PR URL, file path, selection)?
- Output: What exact artifacts do you expect (e.g., a checklist, code edits, a summary)?
- Constraints: Tech stack rules, repository conventions, security boundaries, or tool usage restrictions.
- Examples: If any, paste one short example input and expected output.

---

## Anatomy of a great Cursor command
- **Clear role and scope**: Who the agent is, what it must do, what it must not do.
- **Deterministic output spec**: Headings and checklists that are easy to verify.
- **Repository-aware**: Mentions file paths, naming conventions, and constraints relevant to your codebase.
- **Short, strict rules**: Keep the prompt compact but unambiguous.
- **Safety/quality gates**: Add hard rules, acceptance criteria, and a done checklist.

---

## Authoring template (copy/adapt)
```markdown
### <Command Title>

You are an expert <role/expert-area>. Follow the instructions precisely.

## Purpose
- <One-liner of what this command does>

## Inputs
- The user will provide: <inputs at runtime>

## Output
- Produce: <concrete artifacts/checklists/files/edits>
- Format strictly as:
  - <headings>
  - <bullet lists>
  - <tables/code>

## Steps
1. <Step 1>
2. <Step 2>
3. <Step 3>

## Hard Rules
- Do not <forbidden action>.
- Follow repository conventions: kebab-case file names; colocate files appropriately.
- Keep content concise and skimmable; use checklists and short code blocks where needed.

## Acceptance Checklist
- [ ] <Item 1>
- [ ] <Item 2>
- [ ] <Item 3>

## Example
Input:
```
<short example input>
```
Output:
```
<short example output>
```
```

---

## Ready-to-use examples (you can save any as its own .md)

### Example 1 — Code Review Checklist (`code-review-checklist.md`)
```markdown
### Code Review Checklist

You are a senior reviewer. Produce a concise, actionable checklist for the given diff or files.

## Inputs
- The user will provide: files or PR link, high-level context/goals.

## Output
- A checklist grouped by category with file references where possible.

## Categories
- Correctness & Bugs
- Readability & Maintainability
- Performance & Resource Use
- Security & Privacy
- Testing & Types

## Hard Rules
- Keep to concise bullets; no essays.
- Reference concrete files/lines when possible.

## Acceptance Checklist
- [ ] Each category has 2–8 bullets max
- [ ] No generic fluff
- [ ] Directly actionable wording
```

### Example 2 — Create PR (`create-pr.md`)
```markdown
### Create Pull Request

You are a release-oriented engineer. Prepare a high-quality PR description.

## Inputs
- Branch name, summary of changes, linked issues.

## Output
- PR title (≤ 72 chars)
- PR description with: Motivation, Changes, Screenshots (if UI), Risks, Testing Plan, Rollback Plan, Linked Issues

## Hard Rules
- Use imperative mood for title (e.g., "Add", "Fix").
- Include a clear testing plan with steps.

## Acceptance Checklist
- [ ] Title <= 72 chars, imperative mood
- [ ] Risks and rollback considered
- [ ] Reproducible testing steps
```

### Example 3 — Run All Tests and Fix (`run-all-tests-and-fix.md`)
```markdown
### Run All Tests and Fix

You are a build cop. Execute tests and summarize failures, then propose minimal edits.

## Inputs
- The repo, any failing areas to prioritize.

## Output
- Summary of failures grouped by root cause
- Ordered fix plan
- Minimal code edits proposal (file:line context)

## Hard Rules
- Don’t over-refactor
- Preserve existing public APIs

## Acceptance Checklist
- [ ] Grouped root causes
- [ ] Minimal, safe fixes first
- [ ] Clear before/after for each change
```

### Example 4 — Onboard New Developer (`onboard-new-developer.md`)
```markdown
### Onboard New Developer

You are a DX mentor. Create a minimal onboarding plan.

## Inputs
- Primary area (e.g., dashboard), OS, package manager.

## Output
- Day 1 setup checklist
- First-task suggestions
- Critical docs links and team conventions

## Hard Rules
- Prefer shortest path to productivity
- Avoid nonessential tools on day 1

## Acceptance Checklist
- [ ] End-to-end run completes locally
- [ ] First task is feasible in < 2 hours
```

### Example 5 — Security Audit (`security-audit.md`)
```markdown
### Security Audit

You are an application security engineer. Perform a lightweight audit of the specified area.

## Inputs
- Area (e.g., API auth), relevant files/PR/diff.

## Output
- Risks (ranked), Evidence, Suggested Remediations, Owner, Priority

## Hard Rules
- No speculative claims; cite evidence (file and lines)
- Prioritize practical remediations

## Acceptance Checklist
- [ ] Each risk has evidence and remediation
- [ ] Prioritized and assignable
```

---

## Quickstart (build your own in 60 seconds)
1. Decide name: `my-command-name.md` (kebab-case).
2. Copy the Authoring template above.
3. Replace Purpose/Inputs/Output/Steps/Hard Rules with your specifics.
4. Save to `.cursor/commands/my-command-name.md`.
5. In chat, type `/my-command-name` and run.

---

## Troubleshooting
- Command not visible under `/`? Ensure the file is `.md` and inside `.cursor/commands`.
- Name not what you expect? The menu shows the file name without `.md`.
- Team can’t see it? Commit and push the file to your repository.

---

## Source
- Official docs: [Cursor Chat Commands](https://cursor.com/docs/agent/chat/commands)


