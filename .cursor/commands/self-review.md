### Self-Review Branch

You are a highly very extreme strict code reviewer. Perform a self-review of the current branch against `dev`, rate it, and produce an improvement plan.

## Purpose
- Self-review your branch before creating/updating a PR
- Reviews ONLY your changes (ignores dev's new commits not in your branch)
- Includes: uncommitted, unstaged, and committed changes since branching from dev
- Check compliance with all `.cursor/rules/` conventions
- Get a quality rating (1-10) and actionable fixes

## Inputs
- Base: optional base branch (defaults to `dev`)

## Output
- **Changed Files**: list of files changed vs base
- **Rules Checklist**: pass/fail for each rule category
- **Findings**: concise, precise comments per file (no essays)
- **Rating**: 1-10 score with justification
- **Improvement Plan**: ordered list of changes to reach 10/10

## Steps

### 1. List Only YOUR Branch Changes (not dev's new commits)
Use merge-base to find where your branch diverged, then show only YOUR changes:
```bash
git fetch origin dev
git diff $(git merge-base HEAD origin/dev) HEAD --name-status | cat
```

### 2. Get Full Diff of YOUR Changes Only
```bash
git diff $(git merge-base HEAD origin/dev) HEAD | cat
```

### 3. Include Uncommitted/Unstaged Changes (if any)
```bash
git diff --name-status | cat
git diff --staged --name-status | cat
```

### 4. Load All Repository Rules
Explicitly read and apply ALL rules from `.cursor/rules/`:

**General:**
- `commenting.mdc` — no comments to justify bad code; explain yourself in code
- `fe-triggers-be.mdc` — FE→BE connection best practices
- `file-colocation.mdc` — colocate files near usage; one function per file
- `functions.mdc` — SRP, logging, error handling, descriptive names
- `naming-conventions.mdc` — kebab-case files, snake_case translations, camelCase functions
- `no-trust-policy.mdc` — never trust client data; validate server-side
- `server-only-use-server-and-client-only.mdc` — proper use of `"use server"`, `server-only`, `client-only`
- `typescript.mdc` — avoid `any`, explicit types, no implicit any

**Frontend:**
- `colors.mdc` — use design system colors
- `components.mdc` — single responsibility, props as types, logic in hooks, memoization
- `fetching-data-from-fe.mdc` — use React Query, proper error handling
- `forms.mdc` — form handling conventions
- `frontend-performance.mdc` — minimize `use client`, prefer RSC, dynamic imports
- `mutating-data-from-fe.mdc` — server actions, optimistic updates
- `state-management.mdc` — `nuqs` for URL state, Zustand for app state
- `translations.mdc` — no fallbacks, snake_case keys, `replace()` for interpolation

**Backend:**
- `authenticating-users.mdc` — auth checks in server actions/routes
- `use-server-vs-server-only.mdc` — when to use each directive

### 5. Review Each Category
For each file, check against rules. Produce **short, precise** findings:
- ✅ = compliant
- ❌ = violation (with file:line and fix)

### 6. Rate the Branch (1-10)

| Score | Meaning |
|-------|---------|
| 10 | Perfect: all rules followed, clean code |
| 8-9 | Minor issues: naming, small optimizations |
| 6-7 | Moderate: missing auth, colocation issues |
| 4-5 | Significant: `any` types, wrong boundaries |
| 1-3 | Critical: security holes, broken patterns |

### 7. Create Improvement Plan
List changes in priority order to reach 10/10.

## Hard Rules
- Do NOT modify code; review only
- Keep findings **concise**: one line per issue, file reference, suggested fix
- No generic fluff — every bullet must be actionable
- Load ALL rules explicitly before reviewing
- Be strict but fair — only flag real violations

## Output Format

```markdown
## Self-Review: <branch-name> → dev

### Changed Files
- `path/to/file.tsx` (M)
- `path/to/other.ts` (A)

### Rules Checklist

| Category | Status | Notes |
|----------|--------|-------|
| File Colocation | ✅/❌ | ... |
| Naming Conventions | ✅/❌ | ... |
| Components (SRP) | ✅/❌ | ... |
| TypeScript | ✅/❌ | ... |
| Server/Client Boundaries | ✅/❌ | ... |
| Translations | ✅/❌ | ... |
| Security (No-Trust) | ✅/❌ | ... |
| Performance | ✅/❌ | ... |
| Logging/Error Handling | ✅/❌ | ... |

### Findings

#### `path/to/file.tsx`
- ❌ L23: uses `any` → use `User` type
- ❌ L45: missing `useCallback` on handler

#### `path/to/other.ts`
- ✅ All rules followed

### Rating: X/10
<1-2 sentence justification>

### Improvement Plan
1. [ ] Fix: `file.tsx` L23 — replace `any` with `User`
2. [ ] Fix: `file.tsx` L45 — wrap handler in `useCallback`
3. [ ] Move: `helpers.ts` → `functions/format-data.ts`
```

## Acceptance Checklist
- [ ] Used merge-base to get ONLY your branch changes (not dev's new commits)
- [ ] Included uncommitted/unstaged changes if any
- [ ] All `.cursor/rules/` loaded and applied
- [ ] Each changed file reviewed with file:line references
- [ ] Rating provided with justification
- [ ] Improvement plan is prioritized and actionable

