# Universal Command Principles

**ALL commands in this directory MUST enforce these principles.**

---

## 🚫 CRITICAL: No Automatic Git Operations

**ABSOLUTELY FORBIDDEN - NEVER DO THESE:**
- ❌ **NEVER** run `git add` automatically
- ❌ **NEVER** run `git commit` automatically
- ❌ **NEVER** run `git push` automatically
- ❌ **NEVER** run `git stash` automatically
- ❌ **NEVER** run any git command that modifies repository state

**Why:**
- User must have full control over what gets committed
- Prevents accidental commits of incomplete/incorrect code
- Avoids pushing broken code to remote
- Maintains clean git history

**Only Exception:**
- `push.md` command is the ONLY command allowed to handle git operations
- Even then, it should guide the user, not execute automatically

**Git commands are ONLY for:**
- Reading state: `git status`, `git diff`, `git log` (READ-ONLY)
- Everything else requires explicit user action via `push.md`

---

## 🏗️ Code Quality Principles (NON-NEGOTIABLE)

### SOLID Principles (MANDATORY for all functions/classes)
Every function and class must follow ALL 5 SOLID principles:

1. **Single Responsibility Principle (SRP)**
   - Each function/class does ONE thing only
   - One reason to change
   - If a function name contains "and", it's doing too much

2. **Open/Closed Principle (OCP)**
   - Open for extension, closed for modification
   - Use abstractions and interfaces
   - Extend behavior without changing existing code

3. **Liskov Substitution Principle (LSP)**
   - Subtypes must be substitutable for base types
   - Derived classes must honor base class contracts
   - No surprising behavior in inheritance

4. **Interface Segregation Principle (ISP)**
   - Many specific interfaces over one general interface
   - Clients shouldn't depend on interfaces they don't use
   - Keep interfaces focused and minimal

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions, not concretions
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions

### DRY (Don't Repeat Yourself)
- **ZERO code duplication** allowed
- Extract reusable logic immediately
- Create shared utilities in separate files
- Never copy-paste code blocks

### KISS (Keep It Simple, Stupid)
- Avoid over-engineering and complexity
- Write straightforward, readable code
- Simple solutions preferred over clever ones
- If it's hard to understand, it's too complex

### YAGNI (You Aren't Gonna Need It)
- Build only what's needed NOW
- No premature optimization
- No speculative features
- Focus on current requirements

---

## 🏛️ Clean Architecture Requirements

### File Organization
- **No long files**: Maximum 100-150 lines per file
- **One function per file**: Complex functions get their own file
- **Separate and import**: Build by composing focused modules
- **Clear boundaries**: Separate concerns (UI, logic, data, utils)

### Directory Structure
```
feature/
├── components/          # UI components (one per file)
├── actions/            # Server actions (one per file)
├── functions/          # Business logic (one per file)
├── hooks/              # Custom hooks (one per file)
├── types.ts           # Local types
└── page.tsx or feature.tsx
```

### Separation of Concerns
- **UI Layer**: Components only handle presentation
- **Business Logic**: Extracted to functions/
- **Data Layer**: Server actions and API calls
- **State Management**: Hooks and Zustand stores
- **Types**: Separate type definitions

---

## 💬 Documentation & Comments

### Minimal Comments Policy
- **Code should be self-documenting**
- Use clear, descriptive names instead of comments
- Comments are a last resort

### When Comments ARE Allowed
1. **JSDoc for public APIs** (following project format)
2. **Complex business rules** that aren't obvious
3. **Workarounds** that need explanation
4. **"Why" not "What"** - explain reasoning, not mechanics

### When Comments Are NOT Allowed
- ❌ Obvious statements (`// Set user name`)
- ❌ Explaining bad code (refactor instead)
- ❌ Commented-out code (delete it)
- ❌ Redundant comments (`// Constructor`)

---

## 📝 File Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | `kebab-case` | `user-profile.tsx` |
| Functions | `camelCase` | `getUserData()` |
| Components | `PascalCase` | `UserProfile` |
| Translation keys | `snake_case` | `user_profile_title` |
| Types/Interfaces | `PascalCase` | `UserProfile` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Directories | `kebab-case` | `user-management/` |

---

## 🔒 Security Principles (ABSOLUTE)

### No-Trust Policy
- **NEVER trust client data** without validation
- **ALWAYS validate** on the server
- **ALWAYS authenticate** before actions
- **ALWAYS check permissions** before operations

### Required Security Checks
```typescript
// EVERY server action must have:
1. Authentication check (getUserAuthOrThrow() or auth())
2. Permission validation (hasPermission())
3. Input validation (Zod schemas)
4. Error handling (try-catch)
5. Logging (log.info, log.error)
```

### Security Checklist
- [ ] Authentication implemented
- [ ] Permissions verified
- [ ] Input validated with Zod
- [ ] `"use server"` or `import "server-only"` used
- [ ] No sensitive data exposed to client
- [ ] Proper error handling without leaking info

---

## 🛠️ MCP Tools Usage

### Always Use Sequential Thinking
For complex tasks, ALWAYS use `mcp_sequential-thinking_sequentialthinking`:
- Planning complex features
- Solving difficult problems
- Debugging intricate issues
- Architectural decisions

### Research Tools (When Needed)
- **Context7** (`mcp_context7_*`): Library docs, code examples
- **Perplexity** (`mcp_perplexity-ask_perplexity_ask`): Technical research
- **BrightData** (`mcp_brightdata_*`): Web research

### Task Management Tools
- **Task Master AI**: Complex task breakdown and tracking
- **Browser Tools**: Testing implementations

---

## 📚 Rules Compliance

### Must Verify Against `.cursor/rules/`

**General Rules (Always Check):**
- `commenting.mdc` - Comment policy
- `file-colocation.mdc` - Where to place files
- `functions.mdc` - Function standards
- `naming-conventions.mdc` - Naming rules
- `no-trust-policy.mdc` - Security policy
- `server-only-use-server-and-client-only.mdc` - Server/client separation
- `typescript.mdc` - TypeScript standards
- `fe-triggers-be.mdc` - Frontend-backend integration

**Backend Rules (When Applicable):**
- `authenticating-users.mdc` - Auth implementation
- `use-server-vs-server-only.mdc` - Directive usage

**Frontend Rules (When Applicable):**
- `colors.mdc` - Design system colors
- `components.mdc` - Component standards
- `fetching-data-from-fe.mdc` - Data fetching
- `forms.mdc` - Form handling
- `frontend-performance.mdc` - Performance
- `mutating-data-from-fe.mdc` - Data mutations
- `state-management.mdc` - State management
- `translations.mdc` - Translation system

---

## ✅ Universal Verification Checklist

Before completing ANY task, verify:

### Code Quality
- [ ] All functions follow SOLID principles
- [ ] Zero code duplication (DRY)
- [ ] Simple, straightforward code (KISS)
- [ ] Only necessary features (YAGNI)
- [ ] No files exceed 150 lines
- [ ] Complex functions separated into own files
- [ ] Clean architecture with clear boundaries

### Documentation
- [ ] Minimal comments (code is self-documenting)
- [ ] JSDoc only for public APIs
- [ ] No obvious or redundant comments

### File Organization
- [ ] Files named in kebab-case
- [ ] Files correctly colocated
- [ ] Proper directory structure
- [ ] One responsibility per file

### TypeScript
- [ ] No `any` types (use `unknown` if needed)
- [ ] All types explicitly defined
- [ ] Interfaces for objects, types for unions
- [ ] Proper type safety throughout

### Security
- [ ] Authentication checks in place
- [ ] Permission validation implemented
- [ ] Input validated with Zod
- [ ] No client data trusted
- [ ] Proper server/client separation

### Performance
- [ ] Minimal `"use client"` usage
- [ ] Server components favored
- [ ] Proper memoization applied
- [ ] Dynamic imports for heavy components

### Rules Compliance
- [ ] All `.cursor/rules/` verified and followed
- [ ] Translation system rules followed
- [ ] No-trust policy enforced
- [ ] Logging standards met

---

## 🧪 Testing Philosophy

### Manual Testing Approach
We use **manual testing checklists** rather than automated tests:
- Testing cases are provided as checkboxes for users
- Each feature includes comprehensive verification steps
- Testing covers primary functionality, edge cases, and integrations
- Users manually verify each scenario

### Testing Case Format
```markdown
### Testing Cases
- [ ] Primary functionality test case description
- [ ] Edge case or error handling scenario
- [ ] Integration test with related features
- [ ] Indirectly related functionality that might be affected
- [ ] UI/UX validation steps
- [ ] Performance or accessibility checks if applicable
```

---

## 🎯 Command Development Standards

When creating or updating commands:

1. **Follow this document** strictly
2. **Use `_template.md`** as starting point
3. **Include verification checklist** in every command
4. **Reference specific rules** from `.cursor/rules/`
5. **Enforce SOLID/DRY/KISS/YAGNI** explicitly
6. **Require MCP tool usage** where beneficial
7. **Output actionable results** not generic advice
8. **Provide manual testing checklists** for user verification

---

## 📖 Remember

> "The best code is code that doesn't need comments because it's self-documenting."

> "SOLID isn't optional—it's the foundation of maintainable software."

> "Clean architecture means no file should ever exceed 150 lines."

> "Security isn't a feature—it's a requirement."

> "Good testing cases empower users to verify their work thoroughly."

---

**These principles are ABSOLUTE and INVIOLABLE.**
**Not following them is not an option.**

