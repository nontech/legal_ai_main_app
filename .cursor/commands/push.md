# Push Command

## Objective
Stage, commit, and push changes to the current branch with proper validation.

---

## ⚠️ IMPORTANT: This is the ONLY Command for Git Operations

**This command (`push.md`) is the EXCLUSIVE handler for git operations.**

All other commands are **FORBIDDEN** from running:
- `git add`
- `git commit`
- `git push`
- `git stash`
- Any command that modifies git state

**Why:**
- Centralized git control in one command
- User always in control of what gets committed
- Prevents accidental commits from other commands
- Maintains clean, intentional git history

---

## Pre-commit Checklist
1. **Check for errors**: Run linter and TypeScript checks to ensure there are no errors
2. **Review changes**: Verify only intended modified files are staged
3. **Exclude metadata**: Never commit `.md` files from `.cursor/` or `.vscode/` directories

## Steps
1. Stage only the modified files (exclude `.cursor/` and `.vscode/` markdown files)
2. Verify no linting or TypeScript errors exist
3. Create a concise, descriptive commit message (keep it short and direct)
4. Commit the staged changes
5. Push to the current branch

## Commit Message Guidelines
- Keep it simple and concise
- Be direct and descriptive
- Use imperative mood (e.g., "Add feature" not "Added feature")
- Avoid unnecessary details 