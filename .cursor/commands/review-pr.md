### Review GitHub PR (minimal gh pr diff)

You are a senior code reviewer. Use only the minimal shell commands to fetch the diff and then produce an actionable review. Optionally post the review as a comment on a Linear issue.

## Purpose
- Review a GitHub Pull Request using minimal commands, then output a detailed, digestible checklist. If a Linear issue is provided, post the review as a comment there.

## Inputs
- PR: GitHub PR URL or number (required)
- Base branch: optional (e.g., `feat/test`). When provided, check it out before diffing
- Linear: optional Linear issue URL or key (e.g., `ABC-123`) to post the review as a comment
- Context: optional high-level goals or areas to focus on

## Output
- Produce a concise but detailed checklist grouped by category with concrete file references from the diff
- If Linear issue is provided, post the review as a COMMENT on the issue

Format strictly as:
- Headings for categories
- Bulleted checkboxes; one item per actionable suggestion, prefixed with file path
- Use short inline code for files like `src/app/.../file.tsx`
- Where helpful, include small diff snippets in a `diff` block

## Steps
1. Parse inputs (PR, optional base branch, optional Linear issue ID/URL, optional context)
2. Use ONLY these commands to obtain the patch:
   - If base branch provided: run
     ```bash
     git checkout <base_branch>
     ```
   - Then fetch the diff:
     ```bash
     gh pr diff "<PR>" --color=never | cat
     ```
   Notes:
   - Do not run extra git or gh commands beyond the above two. If the base branch is not provided, skip checkout and just run `gh pr diff`.
   - If authentication is required for `gh`, ask the user to run `gh auth login` and re-run the command.
3. Load and adhere to all repository rules:
   - Explicitly fetch ALL docs into memory from `.cursor/rules/**`
   - Follow workspace rules for translations (no fallbacks; snake_case keys; bracket notation where required), server/client separation (`server-only`, `"use server"`, `client-only`), file colocation, naming, logging from `src/app/functions/log.ts`, and FE conventions (Shadcn, Radix, Tailwind)
4. Analyze the patch:
   - Identify correctness issues, type safety, performance, security/privacy, SSR/CSR boundaries, i18n violations, logging/error handling, naming/colocation, tests coverage
   - Cite specific files/segments and keep bullets directly actionable
5. Produce the review output:
   - A digestible checklist grouped by category, with checkboxes and file references
   - Include short `diff` blocks where a tiny snippet clarifies the point
6. Linear (optional):
   - If a Linear issue URL or key is provided, POST THE REVIEW AS A COMMENT (not as a description change)
   - Comment header: `PR Review — <PR>` then the checklist
   - If no Linear reference provided, return the review text and ask whether to post it to a Linear issue

## Hard Rules
- Use only:
  - `git checkout <base_branch>` (only if provided)
  - `gh pr diff "<PR>" --color=never | cat`
- Do not modify the repo (no commits/merges/rebases)
- Do not change Linear issue metadata; only add a comment when provided
- Keep content concise and skimmable; use checklists and small code/diff blocks
- Reference concrete files and lines from the diff where possible
- Enforce translation rules: never use fallbacks; keys in snake_case; bracket notation for hyphenated sections; use `replace()` for interpolation
- Enforce server/client boundaries: use `server-only`, `"use server"`, `client-only` correctly; follow no-trust policy for client input
- Use logging via `src/app/functions/log.ts` for server-side changes
- Respect file naming (kebab-case) and colocation conventions

## Acceptance Checklist
- [ ] Only the minimal commands were executed to obtain the diff
- [ ] Review checklist includes concrete, actionable items with file references
- [ ] Translation, server/client, logging, and naming/colocation rules verified
- [ ] If Linear provided, comment posted with the full review; otherwise prompt the user

## Example
Input:
```
PR: `https://github.com/acme/fuxam-web/pull/1234`
Base: `feat/test`
Linear: `ABC-123`
Context: Focus on i18n keys and server-only boundaries
```
Output (abridged):
```
### Correctness & Bugs
- [ ] In `src/app/[lang]/dashboard/widget.tsx`: ensure props validated; add missing null checks

### i18n & Translations
- [ ] In `src/app/components/user-form.tsx`: use `replace()` for `{{count}}`; remove string concatenation
- [ ] In `src/app/components/header.tsx`: change `t.generic.cancelText` → `t.generic.cancel_text` (snake_case)

### Server/Client Boundaries
- [ ] In `src/app/api/user/update/route.ts`: add `"use server"` and auth/permission checks
- [ ] In `src/app/components/uploader.tsx`: add `import 'client-only'` if using `window`

### Performance & FE
- [ ] In `src/app/components/list.tsx`: wrap heavy list item with `React.memo` or virtualization

### Types & Tests
- [ ] In `src/app/functions/server/roles/role.ts`: add explicit return types and narrow unknowns

If Linear provided: Comment posted to `ABC-123` with header `PR Review — https://github.com/acme/fuxam-web/pull/1234` and the checklist above.
```

### Review GitHub Pull Request (with optional Linear comment)

You are a senior reviewer. Execute a structured PR review from a pasted PR link, produce a detailed yet digestible checklist, and optionally post it as a comment to a Linear issue.

## Purpose
- Review code changes for a GitHub PR against its base branch, following repository rules, and output an actionable checklist. If a Linear issue is provided, post the review as a comment (not description).

## Inputs
- The user will provide at runtime:
  - GitHub PR URL (preferred) or explicit branches
  - Optionally: base branch name and head branch name (if auto-detection fails)
  - Optionally: Linear issue URL or key (e.g., ABC-123)

## Output
- Produce:
  - Review header with parsed PR info: repository, PR number, base branch, head branch
  - A concise summary of changes (files count, highlights)
  - A detailed, actionable checklist grouped by category and by file (see Format)
  - If a Linear identifier is provided: a confirmation that a COMMENT was posted with a link
- Format strictly as:
  - Heading: "Review for <owner/repo>#<PR>"
  - "Base: <base>  Head: <head>"
  - "Changed files (N):" list
  - "Checklist" section with bullets as [ ] items
  - Include file paths in backticks and reference line ranges when useful

## Steps
1. Parse inputs
   - Extract owner/repo and PR number from the GitHub PR URL when provided.
   - If `gh` CLI is available, run non-interactively to get base/head: `gh pr view <PR-URL> --json baseRefName,headRefName -q "+.baseRefName +.headRefName" | cat`.
   - If that fails, fall back to:
     - Ask for base and head, OR
     - For GitHub, fetch the PR head ref: `git fetch origin pull/<number>/head:review-pr-head` and ask the user for base.
2. Prepare local repo (non-destructive)
   - `cd` to the workspace root (absolute): `/Users/leovandenbrandt/Documents/Projects/_Current/fuxam/fuxam-web`.
   - Verify a clean tree: if `git status --porcelain` is not empty, stop and ask to stash/commit before proceeding.
   - `git fetch --all --prune` | cat
   - Checkout base branch: `git checkout <base>` | cat
   - Ensure head is available locally:
     - If head is a branch on origin: `git fetch origin <head>:review-pr-head` | cat
     - If PR URL only: `git fetch origin pull/<number>/head:review-pr-head` | cat
3. Compute diffs
   - List files: `git diff --name-status <base>...review-pr-head | cat`
   - Full diff (no pager): `git diff --no-ext-diff --no-color <base>...review-pr-head | cat`
   - Keep both outputs in context for analysis.
4. Load and enforce repository rules
   - Explicitly state: "Loaded all reviewer rules into memory."
   - Load ALL docs from `/.cursor/rules/**` and related command guidance from `/.cursor/commands/**` as reference materials.
   - Fetch requestable workspace rules (via rules API) and apply them:
     - `backend/authenticating-users`
     - `backend/use-server-vs-server-only`
     - `frontend/colors`
     - `frontend/components`
     - `frontend/fetching-data-from-fe`
     - `frontend/forms`
     - `frontend/frontend-performance`
     - `frontend/mutating-data-from-fe`
     - `frontend/state-management`
     - `general/fe-triggers-be`
     - `general/file-colocation`
     - `general/no-trust-policy`
   - Always apply translation system rules from the workspace: no fallbacks, snake_case keys, `useTranslation`/`getDictionary`, `replace()` for interpolation, bracket notation for hyphenated sections.
5. Analyze changes
   - Focus on changed `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.scss`, config files, and server actions/routes.
   - Use semantic search to locate patterns in changed files (imports, directives) and cross-check against rules.
   - Prepare concrete, file-referenced findings with short, actionable fixes.
6. Produce the review
   - Start with a 2–4 line summary.
   - Then output the checklist in the required format (see Format: Checklist Categories).
   - Where feasible, cite lines via code references for clarity.
7. Optional: Comment to Linear (only if user supplied Linear URL or key)
   - Resolve the issue by key or URL, then create a COMMENT with the full review body.
   - Do NOT update the description. Do NOT change labels, status, assignee, or metadata.
   - Confirm in chat: issue key and link to the comment.

## Hard Rules
- Do not modify code, commit, or push.
- Use non-interactive commands; pipe potential pagers to `| cat`.
- Always `cd` to the absolute workspace path before running git commands.
- If the working tree is dirty, stop and ask; do not auto-stash.
- Explicitly claim that all docs under `/.cursor/rules/**` were loaded before reviewing.
- Enforce repository conventions:
  - Kebab-case file names; colocate files per guidelines.
  - Minimal `"use client"`; prefer RSC and server actions with proper `"use server"`/`server-only`.
  - Use Shadcn/Radix/Tailwind; mobile-first, responsive.
  - Use React Query for data fetching from FE; do not fetch in client without hooks.
  - Use logger at `src/app/functions/log.ts`.
  - Translations: snake_case keys, no fallbacks, use `replace()`.
- Linear: post a COMMENT (not description). If missing Linear info, deliver the review and ask whether to comment it to an issue.

## Format: Checklist Categories
- Correctness & Bugs
  - [ ] Concrete issues with logic, missing guards, or incorrect dependencies
- Security & Permissions
  - [ ] Auth checks and `server-only`/`"use server"` boundaries enforced
- Performance
  - [ ] Memoization (`memo`, `useMemo`, `useCallback`) where re-renders are likely
  - [ ] Avoid heavy work in render/effects; prefer RSC where possible
- Translations & i18n (MANDATORY)
  - [ ] No fallbacks; snake_case keys; proper `replace()` usage
- Readability & Conventions
  - [ ] File naming (kebab-case), colocation, clear naming, SRP
- UI/Accessibility
  - [ ] Shadcn/Radix patterns, focus management, ARIA where needed
- Types & Testing
  - [ ] Strong TypeScript types; avoid `any`; add/adjust tests as needed

Each bullet should reference files directly, e.g.:
- [ ] In `src/app/[lang]/dashboard/components/chart.tsx`, wrap component with `memo` due to stable props.

## Tools Notes (for the agent)
- Prefer parallel operations when gathering context (diff list, rules fetch, file reads).
- Use `codebase_search` for semantic exploration; use `grep` for exact matches (e.g., `"use client"`, `server-only`, `getDictionary`, `useTranslation`, `replace\(`).
- Shell commands must be non-interactive and avoid pagers: append `| cat`.
- Linear operations: resolve issue by key/URL, then `create_comment` with the full review body.

## Acceptance Checklist
- [ ] Base and head branches determined (or asked when not derivable)
- [ ] Base branch checked out locally
- [ ] Diff computed with `<base>...<head>` and files listed
- [ ] Statement that ALL docs from `/.cursor/rules/**` were loaded
- [ ] Review checklist produced with concrete file references
- [ ] If Linear key/URL was provided: a COMMENT was posted (not description)

## Example
Input:
```
PR: https://github.com/fuxam/fuxam-web/pull/123
Linear: ABC-456
```
Output:
```
Review for fuxam/fuxam-web#123
Base: feat/test  Head: fix/test-bug

Changed files (7):
- src/app/[lang]/dashboard/components/widget.tsx (M)
- src/app/functions/server/users/get-users.ts (A)
...

Checklist
- Correctness & Bugs
  - [ ] In `src/app/functions/server/users/get-users.ts`, add auth check and error handling.
- Security & Permissions
  - [ ] `get-users.ts` must import `server-only` and validate permissions.
- Performance
  - [ ] In `widget.tsx`, wrap exported component with `memo`; memoize derived values with `useMemo`.
- Translations & i18n (MANDATORY)
  - [ ] In `widget.tsx`, replace hardcoded text with `useTranslation()` keys; ensure snake_case and use `replace()` for variables.
- Readability & Conventions
  - [ ] Rename `fetchUsers.ts` to `fetch-users.ts` and colocate under `functions/` per guidelines.
- Types & Testing
  - [ ] Add types to `getUsers`; remove `any`; add unit test for error path.

Commented review to Linear issue ABC-456.
```


