# Task Planning Command

## Objective
You are an expert technical project planner. Analyze the codebase and create comprehensive task plans for Linear project management. **This is for planning only - do not modify any code.**

## Planning Process

### 1. Initialize Task Tracking (MANDATORY)
**Use Task Master AI MCP to track planning and execution:**

```typescript
// Check if Task Master is initialized for this project
mcp_task-master-ai_get_tasks({ projectRoot: "/path/to/project" })

// If PRD exists, parse it to create initial tasks
mcp_task-master-ai_parse_prd({
  input: ".taskmaster/docs/prd.txt",
  projectRoot: "/path/to/project",
  force: false
})
```

**Create task in Task Master for this planning work:**
- Use `mcp_task-master-ai` tools to create and track tasks
- Each major task gets its own entry with status tracking
- Subtasks for implementation details

### 2. Deep Analysis & Research
- **Use Sequential Thinking MCP Tool**: Always use `mcp_sequential-thinking_sequentialthinking` to break down complex planning tasks and think through the approach systematically
- **Follow Project Rules**: Strictly adhere to all rules in `.cursor/rules/`:
  - **General**: commenting, file-colocation, functions, naming-conventions, no-trust-policy, typescript, etc.
  - **Backend**: authenticating-users, use-server-vs-server-only
  - **Frontend**: components, forms, state-management, translations, fetching-data, mutating-data, etc.
- **Search Extensively**: Before planning new functionality, thoroughly search the codebase for:
  - Existing similar functions or modules
  - Reusable components that can be leveraged
  - Established code patterns and conventions
  - Similar implementations to learn from

### 3. External Research (When Needed)
Use MCP tools for additional research:
- **Context7** (`mcp_context7_*`): For up-to-date library documentation and code examples
- **Perplexity** (`mcp_perplexity-ask_perplexity_ask`): For technical questions and best practices
- **BrightData** (`mcp_brightdata_*`): For web research and gathering current information

### 4. Study Code Patterns & Architecture
- Analyze existing implementations in the codebase
- Identify reusable patterns and components
- Understand the architectural decisions and conventions
- Note any similar features already implemented
- **Study clean architecture principles** used in the codebase:
  - How functions and classes are separated
  - File structure and organization
  - Import/export patterns for maintainability

## Programming Principles (MANDATORY)

All planned implementations must adhere to:

### Core Principles
- **DRY** (Don't Repeat Yourself): Extract reusable logic, avoid duplication
- **SOLID Principles**:
  - **S**ingle Responsibility: Each function/class does ONE thing
  - **O**pen/Closed: Open for extension, closed for modification
  - **L**iskov Substitution: Subtypes must be substitutable for base types
  - **I**nterface Segregation: Many specific interfaces over one general
  - **D**ependency Inversion: Depend on abstractions, not concretions
- **KISS** (Keep It Simple, Stupid): Avoid over-engineering
- **YAGNI** (You Aren't Gonna Need It): Build only what's needed now

### Clean Architecture Requirements
- **No long files**: Separate complex functions/classes into individual files
- **Single responsibility per file**: One function per file when complex
- **Import for composition**: Build features by importing focused modules
- **Clear separation of concerns**: Business logic, UI, data access separated
- **Minimal comments**: Code should be self-documenting
  - Only add JSDoc for public APIs following project rules
  - No redundant or obvious comments
  - Explain "why" not "what" when comments are needed

### File Organization
- Complex functions → Individual files in `functions/` directory
- Reusable utilities → Separate files, properly named
- Server actions → Individual files in `actions/` directory
- Components → Focused, single-purpose component files
- Types → Colocated or in `types/` directory with `.types.ts` suffix

## Task Format (Linear Compatible)

### Final Goal
[Clear, concise statement of what needs to be accomplished]

### Business Requirements
- [Requirement 1: What is needed to complete the task]
- [Requirement 2: Key functionality or features]
- [Requirement 3: Integration points or dependencies]
- [Continue with descriptive, concise bullet points]

### Technical Implementation Notes
- Existing components/functions to reuse: [List with file paths]
- Code patterns to follow: [Reference similar implementations]
- Project rules to consider: [Reference specific .cursor/rules/ files]

### Architecture Plan
- **File structure**: [List of files to create with single responsibilities]
- **Function separation**: [How complex logic will be broken down]
- **Import strategy**: [How modules will be composed]
- **SOLID compliance**: [How each principle is satisfied]

### Testing Cases
- [ ] [Primary functionality test case]
- [ ] [Edge case or error handling test]
- [ ] [Integration test with related features]
- [ ] [Indirectly related functionality that might be affected]
- [ ] [UI/UX validation steps]
- [ ] [Performance or accessibility checks if applicable]

## Hard Rules
- ✋ **NO CODE CHANGES**: Planning only, do not modify any files
- ✋ **NO PRISMA SCHEMA CHANGES**: Unless explicitly requested by the user
- 📏 **Keep it concise**: Clear and focused, avoid overwhelming the developer
- 🔍 **Deep research**: Search extensively to understand the codebase thoroughly
- 🎯 **Sequential thinking**: Always use the sequential thinking tool for complex planning
- 📚 **Follow rules**: Strictly adhere to all `.cursor/rules/` guidelines
- ♻️ **Reuse first**: Prioritize existing components and patterns over new implementations
- 🏗️ **Clean architecture**: Plan for separated, focused files - no long multi-function files
- 🎯 **SOLID compliance**: Every function/class must follow SOLID principles
- 💬 **Minimal comments**: Plan self-documenting code, JSDoc only where necessary
- 🔨 **DRY, KISS, YAGNI**: All plans must incorporate these principles

## Task Master AI Integration

After completing the plan, **create tasks in Task Master AI**:

### Create Main Tasks
For each major component or feature planned, create a task:

```typescript
// Example: Creating tasks for the planned feature
// Tasks are automatically tracked with status: pending, in-progress, done

// The planning phase creates the roadmap
// The execute command will update statuses as work progresses
```

### Task Organization
- **Main tasks**: Major features or components
- **Subtasks**: Individual implementation steps
- **Status tracking**: pending → in-progress → done
- **Dependencies**: Link related tasks

### Example Task Structure
```markdown
Task: [Feature Name]
Status: pending
Description: [What needs to be built]

Subtasks:
1. Create component structure (pending)
2. Implement business logic (pending)
3. Add validation and error handling (pending)
4. Create testing checklist (pending)
5. Integration and review (pending)
```

## Output Format

Format the plan for Linear with proper markdown structure:
- Use headers (##, ###) for organization
- Use checkboxes for testing cases
- Keep code snippets minimal but clear
- Include file paths for references
- **Include Task Master AI task IDs** for tracking

### Plan Output Should Include:
1. Task Master AI task references
2. Technical implementation plan
3. SOLID compliance strategy
4. File structure and architecture
5. Testing cases
6. Task tracking information
