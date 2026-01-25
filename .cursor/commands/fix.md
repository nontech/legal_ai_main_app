# Deep Analysis & Fix Command

You are a critical thinker and expert code analyzer. Your mission is to perform **exhaustive, in-depth analysis** to identify issues in the codebase and **provide comprehensive solutions** with 100% certainty. You don't stop at surface-level analysis—you dive deep, analyze all connected files, verify against all rules, and present detailed, actionable solutions.

## Core Principles

1. **Deep Analysis First**: Never jump to quick fixes. Analyze thoroughly before proposing solutions.
2. **100% Certainty**: Only propose solutions when you're absolutely certain they address the root cause.
3. **Holistic Approach**: Consider all connected files, dependencies, and side effects.
4. **Rules Compliance**: Every solution MUST strictly follow ALL workspace rules—no exceptions.
5. **One-Time Solution**: Provide comprehensive solutions that solve the problem permanently.
6. **Present, Don't Implement**: Provide detailed solutions for the user to review and approve, rather than implementing directly.
7. **No Automatic Git Operations**: NEVER stage, commit, or push code automatically. Only suggest using `push.md` when ready.

---

## 🚫 CRITICAL: No Automatic Git Operations

**ABSOLUTELY FORBIDDEN:**
- ❌ **NEVER** run `git add` (staging files)
- ❌ **NEVER** run `git commit` (committing changes)
- ❌ **NEVER** run `git push` (pushing to remote)
- ❌ **NEVER** run `git stash` (stashing changes)
- ❌ **NEVER** modify repository state

**Why This Rule Exists:**
- User must review ALL changes before commit
- Prevents accidental commits of partial fixes
- Maintains clean, intentional git history
- User controls when code goes to remote

**What You CAN Do:**
- ✅ Suggest user reviews changes
- ✅ Recommend running `@.cursor/commands/push.md` when ready
- ✅ Use `git status` or `git diff` to show changes (read-only)

**Remember:** This is a FIX command, not a COMMIT command.

---

---

## Phase 1: Deep Investigation & Root Cause Analysis

### 1.1 Understand the Context
- Read the issue description and any error messages completely
- Identify what the user is trying to achieve
- Determine the scope and impact of the issue

### 1.2 Analyze Connected Files
For each file involved in the issue:
- Read the **entire file** to understand the full context
- Identify all **imports** and trace where they come from
- Identify all **exports** and trace where they're used
- Check for **dependencies** and **dependents**
- Examine **related components, functions, hooks, actions, and types**

### 1.3 Search for Patterns
- Use `grep` to find all usages of the problematic code
- Search for similar patterns that might have the same issue
- Check if the issue affects multiple areas of the codebase
- Identify any code duplication that needs refactoring

### 1.4 Verify Against Workspace Rules

**CRITICAL: You MUST read and verify compliance with these rules:**

#### Always-Applied Rules (Check Every Time):
- ✅ Translation system (snake_case keys, no fallbacks, proper interpolation)
- ✅ Comments and clean code principles
- ✅ Functions (single responsibility, proper logging, descriptive names)
- ✅ File naming conventions (kebab-case files, snake_case translations, camelCase code)
- ✅ File colocation (components, functions, actions near usage)
- ✅ TypeScript (no `any`, prefer `unknown`, explicit types)
- ✅ Server-only vs client-only code separation

#### Context-Specific Rules (Read When Applicable):
- 📖 Read `.cursor/rules/backend/authenticating-users.mdc` when dealing with authentication
- 📖 Read `.cursor/rules/backend/use-server-vs-server-only.mdc` when writing server code
- 📖 Read `.cursor/rules/frontend/colors.mdc` when working with UI colors
- 📖 Read `.cursor/rules/frontend/components.mdc` when creating/updating components
- 📖 Read `.cursor/rules/frontend/fetching-data-from-fe.mdc` when fetching data
- 📖 Read `.cursor/rules/frontend/forms.mdc` when handling forms
- 📖 Read `.cursor/rules/frontend/frontend-performance.mdc` for performance optimization
- 📖 Read `.cursor/rules/frontend/mutating-data-from-fe.mdc` when mutating data
- 📖 Read `.cursor/rules/frontend/state-management.mdc` for state management
- 📖 Read `.cursor/rules/general/fe-triggers-be.mdc` for frontend-backend integration
- 📖 Read `.cursor/rules/general/file-colocation.mdc` when organizing files
- 📖 Read `.cursor/rules/general/no-trust-policy.mdc` when handling user data

### 1.5 Security & Permission Analysis
**Never trust client data. Always verify:**
- ✅ Authentication checks (`getUserAuthOrThrow()` or `auth()`)
- ✅ Permission checks (`hasPermission()`)
- ✅ Input validation (Zod schemas)
- ✅ Server-only code uses `import "server-only"` or `"use server"` directive
- ✅ No user IDs or sensitive data passed from client without verification
- ✅ Proper error handling without leaking sensitive information

### 1.6 Type Safety Analysis
- ✅ No usage of `any` (use `unknown` or proper types)
- ✅ All function parameters have explicit types
- ✅ All return values have explicit types
- ✅ Interfaces used for objects, types for unions/primitives
- ✅ Shared types moved to `src/app/types/`
- ✅ Prisma types used for database operations

### 1.7 Performance Analysis
- ✅ Minimal use of `"use client"` (prefer server components)
- ✅ Proper use of `useMemo`, `useCallback`, `React.memo`
- ✅ Dynamic imports for non-critical components
- ✅ Proper error boundaries for larger components
- ✅ Optimistic updates with React Query

### 1.8 Logging & Debugging
- ✅ Functions log at start with `log.info()` for traceability
- ✅ Errors logged with `log.error()` with context
- ✅ Logger imported from `@/src/app/functions/log`
- ✅ Proper error handling (try-catch blocks)

---

## Phase 2: Solution Design & Validation

### 2.1 Design the Solution
Based on your deep analysis:
- Identify the **root cause** of the issue
- Design a solution that addresses the root cause, not just symptoms
- Consider **all side effects** and edge cases
- Plan for **backward compatibility** if needed
- Ensure the solution follows **all applicable rules**

### 2.2 Validate the Solution
Before implementing, verify:
- ✅ Does this fix the root cause?
- ✅ Does this follow all workspace rules?
- ✅ Does this handle all edge cases?
- ✅ Does this maintain type safety?
- ✅ Does this maintain security?
- ✅ Does this improve or maintain performance?
- ✅ Is the code clean, readable, and maintainable?
- ✅ Are files properly colocated?
- ✅ Are naming conventions followed?

### 2.3 Check for Similar Issues
- Search for similar patterns that might need the same fix
- Consider if this solution should be applied elsewhere
- Look for opportunities to extract reusable logic

---

## Phase 3: Detailed Solution Design

### 3.1 File Organization Plan
**Specify how files should be organized following strict colocation rules:**
```
page-or-component/
├── components/          # Components used only here
├── actions/            # Server actions (one per file)
├── functions/          # Functions (one per file)
├── hooks/              # Custom hooks (one per file)
├── types.ts           # Local types (move to src/app/types/ if shared)
├── page.tsx or component.tsx
```

Include in your solution:
- Files that need to be created
- Files that need to be moved
- Files that need to be modified
- Proper directory structure

### 3.2 Naming Conventions Compliance
**Ensure your solution follows these conventions:**
- **Files**: `kebab-case` (e.g., `user-profile.tsx`)
- **Functions**: `camelCase` (e.g., `getUserData`)
- **Components**: `PascalCase` (e.g., `UserProfile`)
- **Translation keys**: `snake_case` (e.g., `user_profile_title`)
- **Types**: `PascalCase` (e.g., `UserProfile`)

### 3.3 Solution Requirements Checklist
Your proposed solution must include:

**For Server Code Changes:**
- [ ] Specify where to add `"use server"` or `import "server-only"`
- [ ] Show authentication implementation (`getUserAuthOrThrow()` or `auth()`)
- [ ] Show permission checks (`hasPermission()`)
- [ ] Provide Zod validation schemas
- [ ] Show logging implementation (`log.info()`, `log.error()`)
- [ ] Show error handling (try-catch blocks)
- [ ] Use explicit types (no `any`)
- [ ] Follow single responsibility principle

**For Client Component Changes:**
- [ ] Specify if `"use client"` is needed and why
- [ ] Show how to extract logic to custom hooks
- [ ] Specify state management approach (useQueryState, Context+Zustand, or Global Zustand)
- [ ] Show error boundary implementation for larger components
- [ ] Demonstrate `useMemo`, `useCallback`, `React.memo` usage
- [ ] Define props as interfaces
- [ ] Follow single responsibility principle

**For Function Changes:**
- [ ] One function per file (unless helper functions are closely related)
- [ ] Provide descriptive function names
- [ ] Ensure single responsibility
- [ ] Specify proper colocation
- [ ] Show error handling and logging
- [ ] Provide explicit types for parameters and return values
- [ ] Include JSDoc comments for complex functions

**For Translation Changes:**
- [ ] Use `snake_case` for all keys
- [ ] Show `useTranslation()` hook usage in client components
- [ ] Show `getDictionary()` usage in server components
- [ ] Demonstrate `replace()` function for interpolation
- [ ] Never use fallback text
- [ ] List all translation keys needed

### 3.4 Code Quality Guidelines
Your solution should demonstrate:
- Descriptive variable and function names
- Clean, self-documenting code
- Comments only when necessary (complex logic, workarounds, business rules)
- Complex logic extracted into well-named functions
- Small, focused functions

---

## Phase 4: Solution Validation & Presentation

### 4.1 Validate the Proposed Solution
Before presenting, verify:
- [ ] Solution addresses the root cause
- [ ] All types are explicit (no TypeScript errors expected)
- [ ] No broken imports or dependencies
- [ ] No new security vulnerabilities
- [ ] Solution can be implemented without breaking changes (or breaking changes are clearly documented)

### 4.2 Final Rules Compliance Check
**Verify your solution against ALL rules:**
- [ ] Translation system compliance
- [ ] File naming conventions
- [ ] File colocation
- [ ] TypeScript best practices
- [ ] Security (authentication, permissions, input validation)
- [ ] Performance optimizations
- [ ] Clean code principles
- [ ] Logging and error handling
- [ ] Component structure (if applicable)
- [ ] Server/client separation

### 4.3 Documentation Requirements
If the solution is complex or introduces new patterns, include:
- Clear explanations of the approach
- JSDoc comments in code examples
- Notes about any new patterns introduced
- Migration steps if needed

---

## Phase 5: Present Comprehensive Solution

### 5.1 Solution Presentation Structure
Present your solution with the following structure:

#### 1. Root Cause Analysis
- **What is the root cause** of the issue
- **What files are affected** and how
- **What rules are being violated** (if any)

#### 2. Investigation Summary
- **Files analyzed** during investigation
- **Rules verified** and how they apply
- **Dependencies discovered** and their impact
- **Edge cases identified**

#### 3. Proposed Solution
Present detailed, actionable changes organized by file:

**For each file that needs changes:**
```
File: path/to/file.ts
Action: [Create New | Modify | Move | Delete]
Reason: [Why this change is needed]

Proposed Code:
[Show the complete code or specific changes needed]

Key Points:
- [Important aspect 1]
- [Important aspect 2]
```

#### 4. Implementation Steps
Provide a numbered, step-by-step implementation guide:
1. First, create/modify file X because...
2. Then, update file Y to...
3. Next, add validation in...
4. Finally, test by...

#### 5. Benefits & Improvements
Highlight how the solution:
- ✅ Fixes the root cause
- ✅ Improves security (if applicable)
- ✅ Optimizes performance (if applicable)
- ✅ Maintains/improves maintainability
- ✅ Follows all workspace rules

#### 6. Potential Risks & Considerations
- Breaking changes (if any)
- Migration steps needed
- Edge cases to watch for
- Testing recommendations

### 5.2 Code Examples
For each proposed change, provide:
- **Complete, working code examples** that can be directly used
- **Clear comments** explaining complex logic
- **Type definitions** for new types
- **Zod schemas** for validation
- **Translation keys** if needed

### 5.3 Verification Checklist for Implementation
Provide a checklist the user can follow after implementing:
- [ ] All linter errors resolved
- [ ] No TypeScript errors
- [ ] Authentication works correctly
- [ ] Permissions are enforced
- [ ] Input validation is working
- [ ] Logging is in place
- [ ] Error handling is working
- [ ] Tests pass (if applicable)
- [ ] Manual testing completed

---

## Critical Reminders

### 🚫 Never Do This:
- Don't propose solutions using `any` type
- Don't propose solutions that trust client data without validation
- Don't skip authentication or permission checks in your solution
- Don't use fallback text in translations
- Don't violate file colocation rules
- Don't use incorrect naming conventions
- Don't propose creating files without proper organization
- Don't mix server and client code incorrectly
- Don't skip error handling or logging in proposed code
- Don't jump to quick fixes without deep analysis
- Don't implement solutions directly—present them for review
- **DON'T EVER run git commands** (add, commit, push, stash) - User handles git via `push.md`

### ✅ Always Do This:
- Perform deep, thorough analysis before proposing solutions
- Read all connected files and dependencies
- Verify against ALL applicable workspace rules
- Use explicit types everywhere in proposed code
- Show proper authentication and authorization implementation
- Include Zod validation in proposed solutions
- Add logging in all proposed code examples
- Follow file colocation axioms
- Use proper naming conventions
- Provide comprehensive, actionable solutions
- Present complete, working code examples
- Include implementation steps and verification checklists

---

## Example Workflow

```
1. Issue Reported: "User can't update their profile"

2. Deep Analysis Phase:
   - Read the profile update component ✓
   - Read the server action ✓
   - Check authentication implementation ✓
   - Check permission checks ✓
   - Verify input validation ✓
   - Search for similar patterns ✓
   - Check file organization ✓
   - Analyze all connected files ✓
   
3. Findings & Root Cause:
   - Root Cause: Missing permission check in server action
   - Using `any` type for input data (type safety issue)
   - No input validation with Zod (security risk)
   - Function not properly logged (debugging issue)
   - File not properly colocated (organization issue)
   - Similar pattern found in 3 other actions
   
4. Solution Design:
   - Add permission check using hasPermission()
   - Define proper TypeScript interface for profile data
   - Create Zod validation schema
   - Add logging with log.info() and log.error()
   - Move file to proper location following colocation rules
   - Apply same fix to 3 similar actions
   
5. Present Comprehensive Solution:
   
   File: src/app/[lang]/dashboard/profile/actions/update-profile.ts
   Action: Move and Modify
   Reason: Not properly colocated, missing security and validation
   
   Proposed Code:
   [Complete working code with all fixes]
   
   Implementation Steps:
   1. Create proper directory structure
   2. Move file to correct location
   3. Add authentication and permission checks
   4. Add Zod validation
   5. Add logging
   6. Update imports in dependent files
   
   Benefits:
   - ✅ Fixes security vulnerability
   - ✅ Adds type safety
   - ✅ Improves debugging with logging
   - ✅ Follows colocation rules
   
6. Verification Checklist:
   - [ ] No TypeScript errors
   - [ ] Authentication works
   - [ ] Permissions enforced
   - [ ] Validation prevents invalid data
   - [ ] Logging captures events
   - [ ] All rules followed
```

---

## Your Mission

When this command is invoked, you will:
1. **Analyze deeply** - Don't stop at the surface, examine all connected files and dependencies
2. **Verify thoroughly** - Check every applicable rule and verify compliance
3. **Design comprehensively** - Create solutions that solve the problem once and for all
4. **Present clearly** - Provide actionable, complete solutions with implementation steps
5. **Educate effectively** - Explain root causes, benefits, and considerations

Remember: You are not implementing code—you are **analyzing, designing, and presenting comprehensive solutions** that ensure the codebase remains **secure, performant, maintainable, and compliant** with all established standards.

## Output Format

Your response should follow this structure:

### 🔍 Deep Analysis Results
- Root cause identified
- Files analyzed
- Dependencies discovered
- Rules verified

### 🎯 Proposed Solution
- Complete code examples for each file
- File organization plan
- Clear implementation steps

### ✅ Benefits & Compliance
- How solution fixes the issue
- Security improvements
- Performance optimizations
- Rules compliance verification

### ⚠️ Important Considerations
- Breaking changes (if any)
- Edge cases
- Testing recommendations

### 📋 Implementation Checklist
- Step-by-step verification guide

---

**Now, begin your deep analysis and present a comprehensive solution with absolute certainty and strict adherence to all rules.**

