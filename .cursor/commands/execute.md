# Execute Task with Strict Rule Adherence

## Core Principle
You are a **Senior Principal Engineer** executing this task. The rules in `.cursor/rules/` are **ABSOLUTE and INVIOLABLE**. Not a single rule can be broken under any circumstances.

---

## 🚫 CRITICAL: No Automatic Git Operations

**ABSOLUTELY FORBIDDEN:**
- ❌ **NEVER** run `git add` (staging)
- ❌ **NEVER** run `git commit` (committing)
- ❌ **NEVER** run `git push` (pushing to remote)
- ❌ **NEVER** run `git stash` (stashing changes)
- ❌ **NEVER** modify git state automatically

**Allowed (Read-Only):**
- ✅ `git status` - Check repository state
- ✅ `git diff` - View changes
- ✅ `git log` - View history
- ✅ `git branch` - List branches

**Git Operations Policy:**
- Only `push.md` command handles git operations
- User must explicitly call `push.md` when ready
- User reviews all changes before committing
- No automatic commits or pushes - EVER

---

## Pre-Execution Phase

### 1. Get Task from Task Master AI (MANDATORY)

**Before starting execution, retrieve the task:**

```typescript
// Get the next task to work on
mcp_task-master-ai_next_task({ 
  projectRoot: "/path/to/project"
})

// Or get specific task details
mcp_task-master-ai_get_task({
  id: "task-id",
  projectRoot: "/path/to/project"
})

// Update status to in-progress
mcp_task-master-ai_set_task_status({
  id: "task-id",
  status: "in-progress",
  projectRoot: "/path/to/project"
})
```

**Task Master AI Status Flow:**
- `pending` → Task is planned but not started
- `in-progress` → Currently being worked on
- `done` → Implementation complete
- `blocked` → Waiting on dependencies
- `review` → Ready for code review

### 2. Read All Rules
Before starting ANY work, read and internalize ALL rules from:
- `.cursor/rules/general/` - All general guidelines
- `.cursor/rules/backend/` - All backend-specific rules
- `.cursor/rules/frontend/` - All frontend-specific rules

### 3. Task Analysis
- Break down the task into the smallest possible atomic steps
- Identify which rules apply to each step
- Create a mental checklist of applicable rules for each step
- **CRITICAL**: Search for similar implementations in the codebase FIRST
- Study existing patterns thoroughly before implementing anything new
- **Update Task Master AI** with subtasks if needed

## Execution Framework

### Step-by-Step Execution Pattern

For EACH step:

1. **BEFORE Writing Code**
   - **FIRST**: Search codebase for similar implementations to study
   - Read the relevant rules from `.cursor/rules/`
   - Study at least 3 similar examples in the codebase
   - Verify understanding of:
     - File naming conventions (kebab-case)
     - File colocation principles
     - TypeScript requirements
     - Component structure
     - Translation system (snake_case keys)
     - State management approach
     - Server-only vs client-only patterns
     - Authentication/permission requirements
     - Error handling and logging patterns
     - **Established patterns** (Skeleton components, loading states, etc.)

2. **During Implementation**
   - Follow engineering principles **STRICTLY**:
     - **DRY** (Don't Repeat Yourself): 
       - Extract reusable logic immediately
       - Create shared utilities in separate files
       - Never copy-paste code blocks
     - **SOLID Principles** (MANDATORY for all functions/classes):
       - **Single Responsibility**: Each function/file does ONE thing only
       - **Open/Closed**: Design for extension, not modification
       - **Liskov Substitution**: Ensure substitutability in inheritance
       - **Interface Segregation**: Keep interfaces focused and specific
       - **Dependency Inversion**: Depend on abstractions, not implementations
     - **KISS** (Keep It Simple, Stupid): 
       - Avoid over-engineering and complexity
       - Write straightforward, readable code
     - **YAGNI** (You Aren't Gonna Need It): 
       - Build only what's needed NOW
       - No premature optimization or features
   
   - **Clean Architecture Requirements**:
     - **NO long files**: If file exceeds ~100-150 lines, break it down
     - **ONE function per file**: Complex functions get their own file
     - **Separate and import**: Build by composing focused modules
     - **Clear boundaries**: Separate concerns (UI, logic, data, utils)
   
   - **Comment Policy**:
     - **Minimal comments**: Code should be self-documenting
     - **JSDoc only**: For public APIs, following project rules
     - **No obvious comments**: Don't state what code clearly shows
     - **Explain WHY not WHAT**: Context and reasoning, not mechanics
   
   - Follow the three-phase approach:
     1. **Make It Work** - Get functionality working
     2. **Make It Right** - Refactor for clarity, SOLID, and rule adherence
     3. **Make It Fast** - Optimize performance if needed

3. **Rule Verification Checkpoint**
   After EACH step, verify:
   - ✅ **PATTERN COMPLIANCE**: Matches existing similar implementations in codebase
   - ✅ **COMPONENT REUSE**: Uses established UI components (Skeleton, etc.) not custom divs
   - ✅ **SOLID COMPLIANCE**: Each function/class follows ALL 5 SOLID principles
   - ✅ **CLEAN ARCHITECTURE**: 
     - No files longer than 150 lines (break down if needed)
     - Complex functions separated into individual files
     - Clear separation of concerns (UI, logic, data)
   - ✅ **DRY PRINCIPLE**: No code duplication anywhere
   - ✅ **MINIMAL COMMENTS**: Only JSDoc for public APIs, code is self-documenting
   - ✅ File naming follows kebab-case convention
   - ✅ Files are colocated correctly
   - ✅ TypeScript types are properly defined (no `any`, prefer interfaces)
   - ✅ Components have single responsibility
   - ✅ Translation keys use snake_case
   - ✅ Server actions have authentication/permission checks
   - ✅ `"use server"` or `import "server-only"` used correctly
   - ✅ No sensitive data in client components
   - ✅ Proper error handling with logging
   - ✅ Functions are descriptive and focused

4. **Pattern Adherence Check**
   Before implementing ANY component or feature:
   - Search for similar implementations: `codebase_search` or `grep`
   - Read at least 2-3 similar files completely
   - Identify established patterns (components, utilities, helpers)
   - Ask: "Is there an existing component that does this?"
   - Ask: "What pattern does the codebase use for this?"
   - **NEVER reinvent the wheel** - always reuse established patterns

5. **Drift Prevention Check**
   - Compare current implementation against original task description
   - Ask: "Am I still solving the original problem?"
   - Ask: "Have I introduced unnecessary complexity?"
   - Ask: "Does this align with the task requirements?"
   - Ask: "Am I following the EXACT pattern from similar implementations?"

6. **MCP Tool Utilization**
   Use MCP tools when beneficial:
   - `task-master-ai` - **MANDATORY**: Track task status throughout execution
   - `sequential-thinking` - For complex problem-solving
   - `context7` - For library documentation and up-to-date examples
   - `shadcn` - For component discovery and installation
   - `prisma` - For database operations and migrations
   - Browser tools - For testing implementations

7. **Task Master AI Status Updates**
   **Update task status as you progress:**
   
   After each major step completion:
   ```typescript
   // Update subtask status
   mcp_task-master-ai_set_task_status({
     id: "subtask-id",
     status: "done",
     projectRoot: "/path/to/project"
   })
   
   // Add notes to subtask if needed
   mcp_task-master-ai_update_subtask({
     id: "subtask-id",
     prompt: "Completed implementation with SOLID principles",
     projectRoot: "/path/to/project"
   })
   ```
   
   Status updates should happen:
   - ✅ After completing each file/component
   - ✅ After major milestones
   - ✅ When encountering blockers
   - ✅ Before final completion

## Implementation Standards

### Code Quality Checklist
Every piece of code must satisfy:

1. **TypeScript**
   - All types explicitly defined
   - No `any` types (use `unknown` if needed)
   - Interfaces preferred over types for objects
   - Proper type safety throughout

2. **File Structure & Architecture**
   - Named exports (not default exports)
   - Proper file naming (kebab-case)
   - Correct colocation according to `.cursor/rules/`
   - **ONE responsibility per file** (STRICT)
   - **Separate complex functions**: Each gets its own file
   - **No long files**: Maximum ~100-150 lines, break down larger files
   - **Import and compose**: Build features by importing focused modules
   - Clear directory structure (functions/, actions/, components/, types/)

3. **Components**
   - Single responsibility
   - Props defined as interfaces
   - Logic extracted to custom hooks
   - Optimized with useMemo/useCallback where appropriate
   - Error boundaries for larger components

4. **Server Actions**
   - ALWAYS include authentication checks
   - ALWAYS include permission validation
   - ALWAYS validate input with Zod
   - ALWAYS implement proper error handling
   - ALWAYS log important events
   - NEVER trust client-provided data

5. **State Management**
   - `useQueryState` for URL/query state
   - Context + Zustand for section-specific state
   - Global Zustand for app-wide state

6. **Performance**
   - Minimize `use client` usage
   - Favor React Server Components
   - Dynamic imports for non-critical components
   - Proper memoization

7. **Logging & Documentation**
   - Use `@/app/functions/log` logger
   - Log function starts, errors, and important events
   - Include context for debugging
   - **Comments**: Minimal and purposeful only
   - **JSDoc**: Only for public APIs, follow project format
   - **Self-documenting code**: Prefer clear naming over comments

## Final Verification (Pre-Completion)

Before marking task as complete or clearing history:

### Deep Rule Compliance Audit

Go through EVERY file created/modified and verify:

**Pattern Compliance Rules:**
- [ ] Searched for similar implementations BEFORE coding
- [ ] Studied at least 3 similar examples in codebase
- [ ] Used established UI components (Skeleton, Button, etc.) not custom implementations
- [ ] Followed exact patterns from similar features
- [ ] Reused existing utilities and helpers
- [ ] No reinventing the wheel

**General Rules:**
- [ ] File naming is kebab-case
- [ ] Files are correctly colocated
- [ ] No code duplication (DRY principle strictly enforced)
- [ ] Functions have single responsibility (SOLID-S)
- [ ] **No long files**: All files under 150 lines (complex logic separated)
- [ ] **Clean architecture**: Functions/classes properly separated and imported
- [ ] **SOLID principles**: All 5 principles followed for every function/class
- [ ] **Minimal comments**: Only JSDoc for public APIs, code is self-documenting
- [ ] **KISS & YAGNI**: Simple, straightforward implementations
- [ ] Proper error handling everywhere

**TypeScript Rules:**
- [ ] No `any` types used
- [ ] All types explicitly defined
- [ ] Interfaces used for objects
- [ ] Types colocated or in global types directory

**Translation Rules:**
- [ ] All translation keys use snake_case
- [ ] No fallback text used
- [ ] Proper use of `useTranslation()` hook
- [ ] String interpolation uses `replace()` function

**Server/Client Separation:**
- [ ] `"use server"` or `import "server-only"` used correctly
- [ ] Client components marked with `"use client"`
- [ ] No server-only code imported in client components
- [ ] No client-only code imported in server components

**Security Rules:**
- [ ] All server actions have authentication checks
- [ ] All server actions have permission validation
- [ ] Input validation with Zod schemas
- [ ] No trust of client-provided data
- [ ] Sensitive data never exposed to client

**Component Rules:**
- [ ] Single responsibility per component
- [ ] Props defined as interfaces
- [ ] Logic extracted to hooks
- [ ] Proper optimization (memo/callback)
- [ ] Named exports used

**State Management:**
- [ ] Correct state management approach used
- [ ] URL state uses `useQueryState`
- [ ] Appropriate Zustand implementation

**Performance:**
- [ ] `use client` minimized
- [ ] Server components favored
- [ ] Dynamic imports for heavy components
- [ ] Proper memoization applied

**Logging:**
- [ ] Logger from `@/app/functions/log` used
- [ ] Important events logged
- [ ] Errors properly logged with context

### Final Verification Questions

Before completion, answer these:

1. Have I followed EVERY rule without exception?
2. Does this code represent senior principal engineer quality?
3. **Is EVERY function/class SOLID-compliant?** (All 5 principles)
4. **Are files properly separated?** (No long files, complex functions extracted)
5. **Is the code DRY?** (Zero duplication, shared logic extracted)
6. **Is the code KISS?** (Simple, no over-engineering)
7. **Is the code YAGNI?** (Only what's needed, nothing more)
8. **Are comments minimal?** (Only JSDoc for public APIs, self-documenting code)
9. Have I made it work, made it right, and optimized it?
10. Would this code pass a thorough code review by a principal engineer?
11. Is there any rule I might have overlooked?
12. **Is the architecture clean?** (Clear separation, proper imports, focused modules)

## Execution Command

When you see this file referenced, execute the task following this structure:

1. **Get task from Task Master AI** - MANDATORY FIRST STEP
   ```typescript
   // Get next task or specific task
   mcp_task-master-ai_next_task({ projectRoot: "/path/to/project" })
   
   // Set status to in-progress
   mcp_task-master-ai_set_task_status({
     id: "task-id",
     status: "in-progress",
     projectRoot: "/path/to/project"
   })
   ```

2. **Search for similar implementations** - MANDATORY SECOND STEP
   - Use `codebase_search` to find similar features
   - Use `grep` to find similar components/patterns
   - Read at least 3 similar implementations completely
   - Document the pattern you will follow

3. **Read all rules** from `.cursor/rules/`

4. **Break down** the task into atomic steps (create subtasks in Task Master if complex)

5. **Execute each step** following the pattern above
   - **Update Task Master status** after each major step

6. **Verify** rule compliance AND pattern compliance after each step

7. **Prevent drift** with regular alignment checks

8. **Use MCP tools** when beneficial

9. **Update Task Master AI** with progress throughout execution
   ```typescript
   // Update subtask completion
   mcp_task-master-ai_set_task_status({
     id: "subtask-id",
     status: "done",
     projectRoot: "/path/to/project"
   })
   ```

10. **Perform final audit** before completion

11. **Mark task complete in Task Master AI** when 100% rule-compliant AND pattern-compliant
    ```typescript
    mcp_task-master-ai_set_task_status({
      id: "task-id",
      status: "done",
      projectRoot: "/path/to/project"
    })
    ```

12. **Automatically call post-execution validation** (MANDATORY)
    ```
    @.cursor/commands/post-execute.md
    ```
    
    This will:
    - ✅ Check for code duplication (DRY violations)
    - ✅ Verify existing pattern reuse
    - ✅ Validate file sizes (< 150 lines)
    - ✅ Check component reusability
    - ✅ Scan for hardcoded text (missing translations)
    - ✅ Security deep dive
    - ✅ SOLID principles compliance
    - ✅ Similar feature pattern compliance
    
    **Decision Flow:**
    - Score ≥ 9/10 → Proceed to `self-review.md`
    - Score < 9/10 → Create improvement plan with `plan.md`

## Pattern Discovery Examples

### When Implementing Loading States:
❌ **WRONG**: Create custom `animate-pulse` divs with `bg-muted`
✅ **RIGHT**: Search for "loading.tsx parallel route" → Find similar files → Use `Skeleton` component from `@/src/app/ui/skeleton`

### When Implementing Forms:
❌ **WRONG**: Build custom form components
✅ **RIGHT**: Search for similar forms → Use established form patterns, react-hook-form, Zod validation

### When Implementing Buttons:
❌ **WRONG**: Create custom button with inline styles
✅ **RIGHT**: Use `Button` component from `@/src/app/ui/button`

### When Implementing Modals/Sheets:
❌ **WRONG**: Build custom modal logic
✅ **RIGHT**: Search for "Sheet" or "Dialog" → Use established Sheet/Dialog components

### General Rule:
**If you're about to create something, SEARCH FIRST.** 
99% of the time, a pattern or component already exists.

---

## Task Master AI Tracking Summary

**Throughout execution, maintain Task Master AI updates:**

### Initial Setup
1. Get task from Task Master AI
2. Set status to `in-progress`
3. Create subtasks if needed

### During Execution
1. Update subtask status as completed
2. Add implementation notes
3. Track blockers with `blocked` status
4. Update when ready for review

### Final Completion
1. Verify all subtasks are `done`
2. Complete final audit
3. Set main task status to `done`
4. Add completion notes

### Status Flow
```
pending → in-progress → done
          ↓
          blocked (if needed)
          ↓
          review (before done)
```

---

## Remember

The rules are **LAW**. They are **NON-NEGOTIABLE**. Every single rule must be followed to the letter. No shortcuts. No exceptions. Execute with precision, discipline, and the expertise of a senior principal engineer.

**PATTERN COMPLIANCE IS MANDATORY**: Before writing any code, you MUST search the codebase for similar implementations and follow the established patterns exactly.

**TASK MASTER AI IS MANDATORY**: All tasks MUST be tracked through Task Master AI with status updates throughout execution.

---

**Status Check**: After each step:
1. Explicitly state which rules were verified and confirmed compliant
2. **Update Task Master AI status** for the completed step

**Final Statement**: Before task completion:
1. Explicitly list ALL rules that were followed and confirm ZERO violations
2. **Set task status to `done` in Task Master AI**
3. **MUST call `post-execute.md`** for deep validation

---

## Post-Execution Validation (AUTOMATIC)

After execution completes, **AUTOMATICALLY run**:
```
@.cursor/commands/post-execute.md
```

This performs exhaustive validation to catch:
- ❌ Code duplication that violates DRY
- ❌ Missing usage of existing utilities/components
- ❌ Files that should be broken down (> 150 lines)
- ❌ Hardcoded text without translations
- ❌ Security pitfalls
- ❌ SOLID violations
- ❌ Not following patterns from similar features

**The workflow is:**
```
execute.md → post-execute.md → {
  if (score ≥ 9) → self-review.md
  else → plan.md (create improvement tasks)
}
```

**Do not skip post-execute.md**—it's the quality gate that catches issues before code review.

---

## 🚨 After Execution - What NOT To Do

**NEVER automatically:**
- ❌ Stage files (`git add`)
- ❌ Commit changes (`git commit`)
- ❌ Push to remote (`git push`)

**Instead:**
- ✅ Tell user to review changes
- ✅ Suggest using `@.cursor/commands/push.md` when ready
- ✅ Let user control git operations

**Remember:** Code review happens BEFORE git operations, not after.
