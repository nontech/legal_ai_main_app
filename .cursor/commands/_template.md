# [Command Name]

## Objective
[Clear, concise statement of what this command does and when to use it]

---

## Command Philosophy

[Explain the approach and principles this command follows]

---

## Prerequisites

### 1. Use Sequential Thinking (if complex)
Use `mcp_sequential-thinking_sequentialthinking` to:
- [When and how to use sequential thinking for this command]
- [What to break down or analyze]

### 2. Read Relevant Rules
- `.cursor/rules/general/[relevant-rule].mdc`
- `.cursor/rules/backend/[relevant-rule].mdc` (if applicable)
- `.cursor/rules/frontend/[relevant-rule].mdc` (if applicable)

### 3. Understand the Context
- [What to analyze or understand before starting]
- [What to search for in the codebase]

---

## Programming Principles (MANDATORY)

This command MUST enforce:

### SOLID Principles
- **Single Responsibility**: [How this applies to the command]
- **Open/Closed**: [How this applies]
- **Liskov Substitution**: [How this applies]
- **Interface Segregation**: [How this applies]
- **Dependency Inversion**: [How this applies]

### Code Quality
- **DRY**: [No code duplication]
- **KISS**: [Keep solutions simple]
- **YAGNI**: [Build only what's needed]

### Clean Architecture
- **No long files**: Maximum 100-150 lines
- **Separation**: Complex functions in separate files
- **Boundaries**: Clear separation of concerns

### Documentation
- **Minimal comments**: Self-documenting code
- **JSDoc only**: For public APIs
- **Explain WHY not WHAT**

---

## Process / Steps

### Step 1: [First Step Name]
[Detailed description of what to do]

**Actions:**
- [ ] [Specific action]
- [ ] [Another action]

### Step 2: [Second Step Name]
[Description]

**Actions:**
- [ ] [Specific action]
- [ ] [Another action]

### Step 3: [Third Step Name]
[Description]

---

## [Specific Section Relevant to Command]

[Add command-specific sections here]

### Example Section
[Content specific to this command's purpose]

---

## Verification Checklist

Before completing this command, verify:

### Code Quality
- [ ] All functions follow SOLID principles
- [ ] Zero code duplication (DRY)
- [ ] Simple, straightforward code (KISS)
- [ ] Only necessary features (YAGNI)
- [ ] No files exceed 150 lines
- [ ] Complex functions in separate files

### Documentation
- [ ] Minimal comments (self-documenting code)
- [ ] JSDoc only for public APIs
- [ ] No obvious or redundant comments

### File Organization
- [ ] Files named in kebab-case
- [ ] Files correctly colocated
- [ ] Proper directory structure
- [ ] One responsibility per file

### TypeScript
- [ ] No `any` types
- [ ] All types explicitly defined
- [ ] Proper type safety

### Security (if applicable)
- [ ] Authentication checks in place
- [ ] Permission validation implemented
- [ ] Input validated with Zod
- [ ] Proper server/client separation

### Performance (if applicable)
- [ ] Minimal `"use client"` usage
- [ ] Proper memoization
- [ ] Dynamic imports for heavy components

### Rules Compliance
- [ ] All `.cursor/rules/` verified and followed
- [ ] Translation system rules followed (if applicable)
- [ ] No-trust policy enforced (if applicable)

---

## Testing Cases (if applicable)

Manual testing checklist for users:

### Testing Cases
- [ ] [Primary functionality test case]
- [ ] [Edge case or error handling test]
- [ ] [Integration test with related features]
- [ ] [UI/UX validation steps if applicable]
- [ ] [Performance checks if applicable]

---

## Output Format

When completing this command, provide:

```markdown
## [Command Output Title]

### [Section 1]
[Content]

### [Section 2]
[Content]

### Verification
- [ ] [Checklist item]
- [ ] [Checklist item]
```

---

## MCP Tools (Use When Beneficial)

- **Sequential Thinking** (`mcp_sequential-thinking_sequentialthinking`): [When to use for this command]
- **Context7** (`mcp_context7_*`): [When to use for library docs]
- **Perplexity** (`mcp_perplexity-ask_perplexity_ask`): [When to use for research]
- **BrightData** (`mcp_brightdata_*`): [When to use for web research]
- **Codebase Search**: [What patterns to search for]

---

## Common Pitfalls to Avoid

❌ **Don't:**
- [Common mistake 1]
- [Common mistake 2]
- [Common mistake 3]

✅ **Do:**
- [Best practice 1]
- [Best practice 2]
- [Best practice 3]

---

## Examples

### Example 1: [Scenario Name]
```typescript
// Example code or demonstration
```

**Explanation:**
[Why this example is good]

### Example 2: [Another Scenario]
```typescript
// More example code
```

**Explanation:**
[Why this example demonstrates the principle]

---

## Remember

> "[Key principle quote 1]"

> "[Key principle quote 2]"

> "[Key principle quote 3]"

---

**[Final reminder about the command's purpose and importance]**

