# Post-Execution Deep Validation Command

## Objective
Perform **exhaustive validation** after implementation to catch issues that violate DRY, SOLID, KISS, YAGNI, and clean architecture principles. This command finds **what should have been done better** before code review.

---

## 🚫 CRITICAL: No Automatic Git Operations

**ABSOLUTELY FORBIDDEN:**
- ❌ **NEVER** run `git add` (staging)
- ❌ **NEVER** run `git commit` (committing)
- ❌ **NEVER** run `git push` (pushing)
- ❌ **NEVER** modify git state

**This command validates code, it does NOT commit it.**

**After validation:**
- If issues found → Create improvement plan
- If no issues → Proceed to self-review
- User decides when to commit via `push.md`

---

---

## Core Principle
**This is the quality gate between execution and review.**
- If issues found → Create improvement plan with `plan.md`
- If no issues → Proceed to `self-review.md`

---

## Validation Categories

### 1. Code Duplication Detection (DRY Violations)

#### Check for Duplicate Validation Schemas
```bash
# Find duplicate Zod schemas
grep -r "z.object({" --include="*.ts" --include="*.tsx" -A 10

# Look for similar validation patterns
grep -r "z.string().min(" --include="*.ts" -B 2 -A 2
```

**Common Violations:**
- ❌ Same Zod schema in multiple files
- ❌ Similar validation logic not extracted
- ❌ Repeated type definitions

**Examples to Find:**
```typescript
// VIOLATION: Duplicate schema
// File: actions.ts
const platformSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  // ...
});

// File: add-platform-dialog/index.tsx
const platformSchema = z.object({  // ← DUPLICATE!
  name: z.string().min(1),
  url: z.string().url(),
  // ...
});

// SOLUTION: Shared validation
// File: validation/platform.schema.ts
export const platformSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  // ...
});
```

#### Check for Duplicate Components
```bash
# Find similar component patterns
grep -r "function.*Button" --include="*.tsx" -l | xargs wc -l
grep -r "export.*Dialog" --include="*.tsx" -l
```

**Look for:**
- ❌ Custom delete buttons when reusable exists
- ❌ Custom modals when Sheet/Dialog components exist
- ❌ Custom form inputs when shared Input exists
- ❌ Custom loading states when Skeleton exists

#### Check for Duplicate Utility Usage
```bash
# Find date formatting
grep -r "new Date" --include="*.tsx" --include="*.ts" -B 1 -A 1
grep -r "toLocaleString\|toISOString\|format(" --include="*.tsx"

# Find similar transformations
grep -r "map(.*=>.*)" --include="*.tsx" -A 3
```

**Common Issues:**
- ❌ Custom date formatting when `dayjs` utility exists
- ❌ Custom text transformations when utility exists
- ❌ Repeated data transformations

---

### 2. Existing Pattern Reuse (Search for Similar Features)

#### Mandatory Search for Similar Implementations
```typescript
// For each new feature, search codebase for similar patterns

// Example: Adding LTI platform dialog
// Search for similar dialogs:
grep -r "Dialog\|Sheet" --include="*.tsx" | grep -i "add\|create"

// Search for similar form validation:
grep -r "react-hook-form" --include="*.tsx" -l

// Search for similar table actions:
grep -r "columns" --include="*.tsx" | grep -i "delete\|edit"
```

**Check Against These Patterns:**
- [ ] Does a similar feature exist? (e.g., data-sync, user-management)
- [ ] How do similar features handle:
  - Form validation?
  - Button states (disabled when invalid)?
  - Error handling?
  - Success feedback?
  - Loading states?
- [ ] Are we using the SAME patterns?

**Example Pattern to Follow:**
```typescript
// From data-sync or similar features:
// ✅ Button becomes primary when form is valid
const isValid = form.formState.isValid;

<Button 
  type="submit" 
  disabled={!isValid || isSubmitting}
  variant={isValid ? "default" : "secondary"}
>
  {isSubmitting ? "Creating..." : "Create"}
</Button>
```

---

### 3. File Size & Decomposition (Clean Architecture)

#### Check File Lengths
```bash
# Find files > 150 lines
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 150' | sort -rn

# Check specific directories
wc -l components/**/*.tsx actions/**/*.ts functions/**/*.ts
```

**Violations:**
- ❌ Any file > 150 lines
- ❌ Multiple components in one file
- ❌ Multiple functions in one file
- ❌ Mixed concerns (UI + logic + data)

**Required Breakdown Pattern:**
```typescript
// VIOLATION: 300-line dialog component
// File: add-platform-dialog/index.tsx

// SOLUTION: Break into focused files
// add-platform-dialog/
//   ├── index.tsx (main component, ~50 lines)
//   ├── platform-form.tsx (form component)
//   ├── validation-schema.ts (shared schema)
//   ├── use-platform-form.ts (form logic hook)
//   └── types.ts (type definitions)
```

---

### 4. Component Reusability Check

#### Search for Existing Reusable Components
```bash
# Find UI component library
ls -la src/app/ui/ src/components/ui/

# Search for common components
grep -r "export.*Button" src/app/ui/ src/components/ui/
grep -r "export.*Dialog\|Sheet" src/app/ui/ src/components/ui/
grep -r "export.*Input" src/app/ui/ src/components/ui/
grep -r "export.*DeleteButton\|ConfirmDelete" --include="*.tsx"
```

**Check Each Implementation:**
- [ ] Used `Button` from UI library? (Not custom button)
- [ ] Used `Dialog/Sheet` from UI library? (Not custom modal)
- [ ] Used `Input` from UI library? (Not custom input)
- [ ] Used existing delete confirmation pattern?
- [ ] Used existing `Skeleton` for loading states?

**Example Violations:**
```typescript
// ❌ WRONG: Custom delete button
export function DeletePlatformButton() {
  const [open, setOpen] = useState(false);
  // Custom implementation...
}

// ✅ RIGHT: Use existing pattern
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
// Or search for similar delete buttons in codebase and follow that pattern
```

---

### 5. Hardcoded Text Detection (Translation Violations)

#### Search for Hardcoded Strings
```bash
# Find hardcoded text in JSX
grep -r '>[A-Z][a-z].*</' --include="*.tsx" | grep -v "t\."

# Find hardcoded strings in attributes
grep -r 'placeholder="[A-Z]' --include="*.tsx"
grep -r 'label="[A-Z]' --include="*.tsx"
grep -r 'title="[A-Z]' --include="*.tsx"

# Find error messages not using translations
grep -r '".*required\|invalid\|error"' --include="*.ts" --include="*.tsx" | grep -v "t\."
```

**All User-Facing Text Must Use Translations:**
```typescript
// ❌ VIOLATIONS:
<Button>Create Platform</Button>
<Input placeholder="Enter name" />
const error = "Name is required";

// ✅ CORRECT:
import { useTranslation } from "@/src/app/functions/client/translations";
const { t } = useTranslation();

<Button>{t.settings.lti.create_platform}</Button>
<Input placeholder={t.settings.lti.enter_name} />
const error = t.settings.lti.name_required;
```

**Check Translation Keys:**
- [ ] All button text uses translations
- [ ] All form labels use translations
- [ ] All placeholders use translations
- [ ] All error messages use translations
- [ ] All success messages use translations
- [ ] Keys use `snake_case` format

---

### 6. Security Deep Dive

#### Server Actions Security
```bash
# Check all server actions have auth
grep -r '"use server"' --include="*.ts" -A 20 | grep -L "auth()\|getUserAuthOrThrow"

# Check permission validation
grep -r '"use server"' --include="*.ts" -A 20 | grep -L "hasPermission"

# Check input validation
grep -r '"use server"' --include="*.ts" -A 20 | grep -L "\.parse(\|\.safeParse("
```

**Every Server Action Must Have:**
```typescript
"use server";

export async function actionName(input: InputType) {
  // ✅ 1. Authentication
  const session = await getUserAuthOrThrow();
  
  // ✅ 2. Permission check
  await hasPermission(session.userId, "permission:name");
  
  // ✅ 3. Input validation
  const validated = schema.parse(input);
  
  // ✅ 4. Error handling
  try {
    // Implementation
  } catch (error) {
    log.error("Action failed", error);
    throw error;
  }
}
```

---

### 7. SOLID Principles Validation

#### Single Responsibility (S)
```bash
# Check for files with "and" in function names
grep -r "function.*And.*(" --include="*.ts"

# Check for components doing multiple things
grep -r "useState.*useState.*useState" --include="*.tsx" -l
```

**Violations:**
- ❌ Functions with "and" in name (`createAndValidate`)
- ❌ Components with 5+ useState hooks
- ❌ Files with multiple exports of different types

#### Dependency Inversion (D)
```bash
# Check for direct database imports in UI
grep -r "from.*prisma" components/**/*.tsx actions/**/*.ts

# Should use repository pattern
grep -r "prisma\." actions/**/*.ts | grep -v "repository"
```

---

### 8. Similar Feature Pattern Compliance

#### Identify Similar Features
```bash
# For LTI integrations, find similar settings sections
ls -la src/app/\[lang\]/dashboard/settings/components/sections/

# Compare implementation patterns
diff <(grep -r "Dialog" data-sync/ -l) <(grep -r "Dialog" lti-integrations/ -l)
```

**Cross-Reference Checklist:**
- [ ] Form validation matches similar features?
- [ ] Button behavior matches patterns?
- [ ] Error handling matches patterns?
- [ ] Success feedback matches patterns?
- [ ] Loading states match patterns?
- [ ] File structure matches patterns?

---

## Validation Process

### Step 1: Run All Checks
Execute each validation category systematically:

1. **Search for duplicates**
   - Zod schemas
   - Components
   - Utilities
   - Type definitions

2. **Search for similar features**
   - Identify comparable implementations
   - Compare patterns
   - Note deviations

3. **Check file sizes**
   - List files > 150 lines
   - Identify breakdown opportunities

4. **Verify component reuse**
   - Search UI library
   - Check for custom implementations
   - Validate pattern usage

5. **Scan for hardcoded text**
   - JSX text content
   - Attributes
   - Error messages

6. **Security audit**
   - Auth checks
   - Permission validation
   - Input validation

7. **SOLID compliance**
   - Single responsibility
   - Each principle verified

8. **Pattern compliance**
   - Compare with similar features
   - Document deviations

---

### Step 2: Document Findings

For each issue found, document:
```markdown
### Issue: [Category] - [Description]

**Location:** `path/to/file.ts:line`

**Problem:**
[What's wrong and why it violates principles]

**Evidence:**
```typescript
// Current implementation
```

**Solution:**
```typescript
// Correct implementation or reference to existing pattern
```

**Similar Pattern:** `path/to/similar/feature.tsx`
(Show how similar features handle this correctly)
```

---

### Step 3: Calculate Quality Score

#### Scoring Criteria
- **Code Duplication**: -2 points per duplicate
- **Missing Pattern Reuse**: -2 points per violation
- **File Size Violation**: -1 point per oversized file
- **Component Reuse**: -2 points per custom component that shouldn't exist
- **Hardcoded Text**: -1 point per instance
- **Security Issue**: -5 points per violation
- **SOLID Violation**: -2 points per principle violated

#### Score Interpretation
- **9-10**: Excellent, minimal issues → Proceed to `self-review.md`
- **7-8**: Good with minor issues → Create focused improvement plan
- **5-6**: Moderate issues → Create comprehensive improvement plan
- **0-4**: Significant issues → Must fix before review

---

### Step 4: Decision Flow

```typescript
if (qualityScore >= 9) {
  // Minimal or no issues
  console.log("✅ Quality check passed");
  console.log("Proceeding to self-review...");
  // Call self-review.md
} else {
  // Issues found
  console.log("⚠️ Issues found that need addressing");
  console.log("Creating improvement plan...");
  // Call plan.md with improvement tasks
}
```

---

## Output Format

```markdown
# Post-Execution Validation Report

## Summary
- **Quality Score:** X/10
- **Issues Found:** X
- **Critical Issues:** X
- **Recommendations:** X

---

## 1. Code Duplication (DRY)

### ❌ Duplicate Validation Schema
**Files:**
- `actions.ts:15-25`
- `add-platform-dialog/index.tsx:45-55`

**Issue:** Same platformSchema defined in 2 files

**Solution:**
Create `validation/platform.schema.ts` and import in both files

**Priority:** High

---

## 2. Pattern Reuse

### ❌ Custom Delete Button
**File:** `columns/delete-platform-button.tsx`

**Issue:** Custom delete implementation exists

**Existing Pattern:** `src/app/components/shared/confirm-delete-dialog.tsx`

**Solution:** Use existing pattern from similar features

**Priority:** Medium

---

## 3. Missing Utility Usage

### ❌ Custom Date Formatting
**File:** `columns/created-at.tsx:12`

**Issue:** Manual date formatting used

**Existing Utility:** `src/app/functions/format-date.ts` (uses dayjs)

**Solution:**
```typescript
import { formatDate } from "@/src/app/functions/format-date";
return formatDate(date, "MMM DD, YYYY");
```

**Priority:** Low

---

## 4. File Decomposition Needed

### ❌ Large Dialog Component
**File:** `add-platform-dialog/index.tsx` (285 lines)

**Issue:** Exceeds 150 line limit

**Required Breakdown:**
- Extract form to `platform-form.tsx`
- Extract validation to `validation-schema.ts`
- Extract hook to `use-platform-form.ts`

**Priority:** High

---

## 5. Hardcoded Text

### ❌ Hardcoded Button Text
**File:** `add-platform-dialog/index.tsx:89`

**Current:**
```typescript
<Button>Create Platform</Button>
```

**Solution:**
```typescript
<Button>{t.settings.lti.create_platform}</Button>
```

**Missing Translation Keys:**
- `settings.lti.create_platform`
- `settings.lti.platform_name`
- `settings.lti.client_id`

**Priority:** High

---

## 6. Security Issues

✅ No security issues found
- All server actions have auth checks
- Permission validation present
- Input validation with Zod

---

## 7. SOLID Compliance

### ⚠️ Single Responsibility Violations
**File:** `add-platform-dialog/index.tsx`

**Issue:** Component handles form state + validation + submission + UI

**Solution:** Extract to separate concerns

---

## 8. Similar Feature Pattern Compliance

### ⚠️ Deviates from data-sync pattern
**Missing:**
- Button doesn't change to primary when valid
- Different validation feedback style

**Reference:** `data-sync/create-sync-dialog.tsx`

**Should implement:**
```typescript
const isValid = form.formState.isValid;
<Button variant={isValid ? "default" : "secondary"} />
```

---

## Decision

**Quality Score: 6/10**

### Issues Found: 8
- 2 Critical (security/architecture)
- 4 High priority (DRY, patterns)
- 2 Medium priority (utilities, translations)

### Recommendation: Create Improvement Plan

Proceeding to create improvement tasks with `plan.md`...

---

## Improvement Tasks (for plan.md)

1. **Extract Shared Validation Schema**
   - Create `validation/platform.schema.ts`
   - Update both files to import shared schema

2. **Replace Custom Components with Existing Patterns**
   - Use existing delete button pattern
   - Follow data-sync dialog pattern

3. **Use Existing Utilities**
   - Replace date formatting with dayjs utility

4. **Decompose Large Files**
   - Break down `add-platform-dialog/index.tsx`

5. **Add Missing Translations**
   - Add all translation keys
   - Remove hardcoded text

6. **Improve SOLID Compliance**
   - Extract form logic to hook
   - Separate UI from business logic
```

---

## Integration with Execution

After `execute.md` completes, it should:
1. Automatically call `post-execute.md`
2. Review the validation report
3. Either:
   - Proceed to `self-review.md` (score ≥ 9)
   - Create improvement plan with `plan.md` (score < 9)

---

## Remember

> "Perfect execution means following patterns, not creating new ones."

> "If similar features exist, your implementation should look almost identical."

> "Code duplication is technical debt—eliminate it immediately."

> "Every line of user-facing text must use translations."

---

**This validation ensures code quality BEFORE review, not after.**
**Catching issues here saves hours in code review iterations.**

