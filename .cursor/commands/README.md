# Command Reference Guide

## 🎯 Quick Selection Guide

### 📋 Planning Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `plan.md` | Full task planning with SOLID principles | Starting any new feature or significant change |
| `plan-project.md` | Project-level planning | Multi-feature projects or major initiatives |
| `plan-workshop.md` | Workshop planning | Planning collaborative sessions |

### ⚡ Execution Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `execute.md` | **Main execution with strict rules** | Implementing any feature/fix (PRIMARY) |
| `post-execute.md` | **Post-execution deep validation** | Auto-called after execute (MANDATORY) |
| `create-backend-service.md` | Backend service creation | New backend services |
| `create-csv-import.md` | CSV import functionality | Adding CSV import features |
| `create-server-table-view-filter-option.md` | Server-side table filters | Adding table filtering |

### 🔍 Review & Quality Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `self-review.md` | Review your branch before PR | Before creating/updating pull requests |
| `review-pr.md` | Review pull requests | Reviewing others' code |
| `fix.md` | Deep analysis and comprehensive fixes | Complex bugs requiring thorough investigation |
| `test.md` | Create manual testing checklists | Planning user verification steps |
| `refactor.md` | Improve code quality | Cleaning up existing code |
| `review-architecture.md` | Evaluate system architecture | Assessing overall architecture quality |

### 🔬 Research Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `research-deep-technical.md` | Technical deep dive | Understanding complex systems |
| `research-bug.md` | Bug investigation | Tracking down difficult bugs |
| `research-deadcode.md` | Find unused code | Identifying code to remove |
| `research-potential-improvements-lg.md` | Large improvement opportunities | Finding major optimization areas |
| `research-potential-improvements-sm.md` | Small improvement opportunities | Finding quick wins |

### 🧹 Maintenance Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `push.md` | Commit and push changes | Finalizing and pushing code |
| `clean-component.md` | Clean up components | Removing code smells from components |
| `purge-comment-slop.md` | Remove unnecessary comments | Cleaning up over-commented code |
| `optimize-performance.md` | Performance optimization | Improving application performance |

### 📚 Documentation Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `overview.md` | Generate architecture diagrams | Creating visual documentation |
| `visualize.md` | Code visualization | Understanding code structure |
| `tldr.md` | Quick summaries | Getting quick overview of code |
| `linear-create-ticket.md` | Create Linear tickets | Creating project management tickets |
| `linear-update-ticket.md` | Update Linear tickets | Updating ticket information |

---

## 🎬 Common Workflows

### New Feature Development
```
1. plan.md          → Plan the feature with testing cases
2. execute.md       → Implement the feature
3. post-execute.md  → Auto-validation (catches DRY, pattern, translation issues)
   ├─ If issues → Creates improvement plan
   └─ If clean → Proceeds to review
4. self-review.md   → Review your work (if post-execute passed)
5. push.md          → Commit and push
```

### Bug Fix
```
1. research-bug.md  → Investigate the bug
2. fix.md           → Deep analysis and solution
3. execute.md       → Implement the fix
4. test.md          → Create regression testing checklist
5. push.md          → Commit and push
```

### Code Cleanup
```
1. research-deadcode.md        → Find unused code
2. purge-comment-slop.md       → Remove bad comments
3. clean-component.md          → Clean components
4. refactor.md                 → Improve structure
5. self-review.md              → Verify quality
6. push.md                     → Commit and push
```

### Pre-Release Check
```
1. self-review.md              → Review all changes
2. test.md                     → Create verification checklist
3. optimize-performance.md     → Check performance
4. review-architecture.md      → Verify architecture
```

---

## 🎯 Decision Tree

**Starting Point:**
- 🤔 "I need to understand something" → `research-*` commands
- 📝 "I need to plan something" → `plan.md` or `plan-project.md`
- 💻 "I need to build something" → `plan.md` → `execute.md`
- 🐛 "Something is broken" → `research-bug.md` → `fix.md`
- 🧹 "Code needs cleanup" → `refactor.md` or `clean-component.md`
- ✅ "Ready to commit" → `self-review.md` → `push.md`
- 🚀 "Optimize performance" → `optimize-performance.md`

---

## 📖 Universal Principles

**ALL commands follow these principles** (see `_PRINCIPLES.md` for details):
- 🚫 **NO GIT OPERATIONS** - Only `push.md` handles git (add, commit, push)
- ✅ **Task Master AI** - All tasks tracked with status updates
- ✅ **SOLID** - All 5 principles enforced
- ✅ **DRY** - Zero code duplication
- ✅ **KISS** - Simple implementations
- ✅ **YAGNI** - Build only what's needed
- ✅ **Clean Architecture** - No files > 150 lines
- ✅ **Minimal Comments** - Self-documenting code
- ✅ **Rules Compliance** - Follows all `.cursor/rules/`

## 📊 Task Master AI Integration

**Plan and Execute commands now integrate with Task Master AI:**

### Planning Creates Tasks
- `plan.md` creates tasks in Task Master AI
- Sets initial status as `pending`
- Breaks down into subtasks

### Execution Updates Status
- `execute.md` gets next task
- Updates status to `in-progress`
- Updates subtasks as completed
- Marks task as `done` when finished

### Track Your Progress
View all tasks: `mcp_task-master-ai_get_tasks({ projectRoot: "/path" })`

Status flow: `pending` → `in-progress` → `done`

---

## 🆕 Creating New Commands

Use `_template.md` as a starting point for creating new commands.

---

## 🔗 Quick Links

- [Universal Principles](_PRINCIPLES.md)
- [Command Template](_template.md)
- [Project Rules](../rules/)
- [Execute Command (Most Used)](execute.md)
- [Plan Command (Start Here)](plan.md)

