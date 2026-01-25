### Create CSV Import Feature

You are an expert in building reusable CSV import systems with real-time progress tracking, error reporting, and batch processing. Follow the instructions precisely to create a complete, production-ready CSV import feature.

## Purpose
Create a new CSV import feature with frontend hook, validation, batch processing, progress tracking, and error handling following our standardized architecture.

## Inputs
The user will provide:
- **Feature name** (e.g., "user", "course", "enrollment")
- **Data model** (what fields need to be imported)
- **Validation rules** (required fields, format constraints)
- **Target API path** (e.g., `/api/users/import`)
- **Processing logic** (what happens with the validated data)

## Output
Generate the following files:
1. **Specialized Hook**: `src/app/[lang]/dashboard/{feature}/hooks/use-{feature}-import.ts`
2. **API Route**: `src/app/api/{feature}/import/progress/route.ts`
3. **Validation Function**: `src/app/api/{feature}/import/progress/functions/validate-{feature}-item.ts`
4. **Processing Function**: `src/app/api/{feature}/import/progress/functions/process-{feature}-items.ts`
5. **Type Definitions**: `src/app/api/{feature}/import/progress/types.ts`
6. **Component Integration**: Update existing component to use the new import system

## Steps

### 1. Create Type Definitions
Define TypeScript interfaces for:
- Raw CSV item type
- Validated item type
- Success result type
- Error result type
- Service context type

### 2. Create Validation Function
Implement server-side validation using Zod schema:
- Define schema with all validation rules
- Return null for valid items
- Return structured error for invalid items
- Include line number in errors

### 3. Create Processing Function
Implement batch processing logic:
- Accept validated items array
- Use Prisma for database operations
- Handle success and error cases
- Return `CsvImportBatchResult` with typed success/error arrays

### 4. Create API Route
Set up SSE endpoint:
- Extract items from request body
- Get user context with `getUserAuthOrThrow()`
- Use `getCsvImportService()` from the core service
- Configure batch size and retry logic
- Return stream with proper headers

### 5. Create Specialized Hook
Build feature-specific hook:
- Extend `useImport` from core system
- Add CSV file state management
- Implement `createErrorLog` function for CSV error export
- Add reset functionality
- Handle progress, complete, and error callbacks

### 6. Update UI Component
Integrate the import system:
- Import specialized hook
- Add `ImportProgressDialog` and `ImportResultDialog`
- Wire up CSV upload, progress tracking, and result display
- Implement error download functionality

## Hard Rules

### File Naming & Location
- Use **kebab-case** for all file names: `use-user-import.ts`, `validate-user-item.ts`
- Follow **colocation**: place files close to where they're used
- API files go in: `src/app/api/{feature}/import/progress/`
- Hooks go in: `src/app/[lang]/dashboard/{feature}/hooks/`
- Functions go in nested `/functions/` directories within API routes

### TypeScript
- Use **interfaces** over types
- Never use `any` - use `unknown` for edge cases
- Export all types needed by other modules
- Use Zod for runtime validation schemas

### Server-Side Code
- Always add `import "server-only"` to API route files
- Add `"use server"` directive to server actions
- Implement authentication with `getUserAuthOrThrow()`
- Include proper error logging with `log.error()`

### Import System Architecture
- **DO NOT create global state** - use local state in `useImport`
- **DO NOT poll** - use Server-Sent Events (SSE)
- **DO batch processing** - configure appropriate `batchSize` (default: 10)
- **DO retry failed batches** - configure `maxRetries` (default: 3)
- **DO create error logs** - implement `createErrorLog` in specialized hook

### Code Quality
- Add JSDoc comments to all exported functions
- Include logging at function entry points: `log.info("Starting import", { context })`
- Handle errors gracefully with try-catch and log.error
- Use descriptive variable names

### UI Components
- Use existing `ImportProgressDialog` and `ImportResultDialog`
- DO NOT create custom progress/result dialogs
- Follow existing dialog patterns for consistency

## File Structure Template

```
src/app/
├── [lang]/dashboard/{feature}/
│   └── hooks/
│       └── use-{feature}-import.ts          # Specialized hook
│
└── api/{feature}/import/progress/
    ├── route.ts                              # SSE API endpoint
    ├── types.ts                              # Type definitions
    └── functions/
        ├── validate-{feature}-item.ts        # Validation logic
        └── process-{feature}-items.ts        # Batch processing logic
```

## Code Templates

### 1. Type Definitions Template
```typescript
// src/app/api/{feature}/import/progress/types.ts
export interface Raw{Feature}Item {
  // Raw CSV fields (all strings)
  name: string;
  email: string;
  // ... other fields
}

export interface Validated{Feature}Item extends Raw{Feature}Item {
  line: number;
  // Add any transformed fields
}

export interface {Feature}ImportSuccess {
  line: number;
  name: string;
  // Fields to show in success results
}

export interface {Feature}ImportError {
  line: number;
  email: string;
  error: string;
}

export interface {Feature}ImportContext {
  institutionId: string;
  userId: string;
  // Add any required context
}
```

### 2. Validation Function Template
```typescript
// src/app/api/{feature}/import/progress/functions/validate-{feature}-item.ts
import "server-only";
import { z } from "zod";
import type { Raw{Feature}Item, {Feature}ImportError } from "../types";

const {feature}Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  // Add all validation rules
});

/**
 * Validates a single {feature} item from CSV import
 * @param item - Raw CSV item data
 * @param lineNumber - Line number in CSV (for error reporting)
 * @returns Error object if validation fails, null if valid
 */
export async function validate{Feature}Item(
  item: Raw{Feature}Item,
  lineNumber: number
): Promise<{Feature}ImportError | null> {
  try {
    {feature}Schema.parse(item);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        line: lineNumber,
        email: item.email || "",
        error: error.errors.map(e => e.message).join(", "),
      };
    }
    return {
      line: lineNumber,
      email: item.email || "",
      error: "Validation failed",
    };
  }
}
```

### 3. Processing Function Template
```typescript
// src/app/api/{feature}/import/progress/functions/process-{feature}-items.ts
import "server-only";
import { prisma } from "@/src/app/misc/singletons/prisma";
import { log } from "@/src/app/functions/log";
import type { CsvImportBatchResult } from "@/src/app/functions/server/services/csv-import/types";
import type {
  Validated{Feature}Item,
  {Feature}ImportSuccess,
  {Feature}ImportError,
  {Feature}ImportContext,
} from "../types";

/**
 * Processes a batch of validated {feature} items
 * @param items - Array of validated items to process
 * @param context - User and institution context
 * @returns Batch result with successes and errors
 */
export async function process{Feature}Items(
  items: Validated{Feature}Item[],
  context: {Feature}ImportContext
): Promise<CsvImportBatchResult<{Feature}ImportSuccess, {Feature}ImportError>> {
  try {
    log.info("Processing {feature} import batch", {
      count: items.length,
      institutionId: context.institutionId,
    });

    // Implement your processing logic here
    const results = await prisma.{model}.createMany({
      data: items.map(item => ({
        name: item.name,
        email: item.email,
        institutionId: context.institutionId,
        // Map other fields
      })),
      skipDuplicates: true,
    });

    const successResults: {Feature}ImportSuccess[] = items.map(item => ({
      line: item.line,
      name: item.name,
    }));

    return {
      success: successResults,
      errors: [],
    };
  } catch (error) {
    log.error("Error processing {feature} import batch", error);
    
    // Return all items as errors if batch fails
    const errors: {Feature}ImportError[] = items.map(item => ({
      line: item.line,
      email: item.email || "",
      error: error instanceof Error ? error.message : "Processing failed",
    }));

    return {
      success: [],
      errors,
    };
  }
}
```

### 4. API Route Template
```typescript
// src/app/api/{feature}/import/progress/route.ts
import "server-only";
import { getCsvImportService } from "@/src/app/functions/server/services/csv-import/csv-import.service";
import { getUserAuthOrThrow } from "@/src/app/functions/server/auth/auth";
import { log } from "@/src/app/functions/log";
import { validate{Feature}Item } from "./functions/validate-{feature}-item";
import { process{Feature}Items } from "./functions/process-{feature}-items";
import type { Raw{Feature}Item, {Feature}ImportContext } from "./types";

export async function POST(request: Request) {
  try {
    const { items } = await request.json() as { items: Raw{Feature}Item[] };
    
    log.info("{Feature} import started", { itemCount: items.length });
    
    const { user, institution } = await getUserAuthOrThrow();
    
    const context: {Feature}ImportContext = {
      institutionId: institution.id,
      userId: user.id,
    };
    
    const service = getCsvImportService();
    const stream = await service.processImportWithStream(
      items,
      {
        validator: validate{Feature}Item,
        processor: process{Feature}Items,
        batchSize: 10,
        maxRetries: 3,
      },
      context
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    log.error("{Feature} import failed", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

### 5. Specialized Hook Template
```typescript
// src/app/[lang]/dashboard/{feature}/hooks/use-{feature}-import.ts
"use client";

import { useCallback, useState } from "react";
import { useImport } from "@/src/app/components/csv-importer/hooks/use-import";
import type { Raw{Feature}Item, {Feature}ImportError } from "@/src/app/api/{feature}/import/progress/types";

export function use{Feature}Import() {
  const [csvFileData, setCsvFileData] = useState<Raw{Feature}Item[] | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const createErrorLog = useCallback((errors: {Feature}ImportError[]) => {
    const header = "Line,Email,Error\n";
    const csvContent = header + errors
      .map(error => 
        `${error.line},"${error.email}","${error.error.replace(/"/g, '""')}"`
      )
      .join("\n");
    
    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  }, []);

  const importHook = useImport<Raw{Feature}Item, {Feature}ImportError>({
    onProgress: (progress) => {
      console.log(`Import progress: ${progress.percentage}%`);
    },
    onComplete: (result) => {
      console.log(`Import complete: ${result.success.length} successful, ${result.errors.length} errors`);
    },
    onError: (error) => {
      console.error("Import error:", error);
    },
    createErrorLog,
  });

  const startImport = useCallback(
    async (data: Raw{Feature}Item[]) => {
      setCsvFileData(data);
      await importHook.startImport("/api/{feature}/import/progress", {
        items: data,
      });
    },
    [importHook]
  );

  const reset = useCallback(() => {
    setCsvFileData(null);
    setResetKey(prev => prev + 1);
    importHook.reset();
  }, [importHook]);

  return {
    ...importHook,
    startImport,
    csvFileData,
    setCsvFileData,
    resetKey,
    reset,
  };
}
```

## Acceptance Checklist

Before considering the implementation complete, verify:

- [ ] All 5 files created in correct locations with kebab-case names
- [ ] Type definitions include all required interfaces
- [ ] Validation uses Zod schema with clear error messages
- [ ] Processing function handles both success and error cases
- [ ] API route uses SSE with proper headers
- [ ] Hook extends useImport and includes createErrorLog
- [ ] Component uses ImportProgressDialog and ImportResultDialog
- [ ] Authentication implemented with getUserAuthOrThrow()
- [ ] Logging added at key points (start, error, completion)
- [ ] Error download generates valid CSV with headers
- [ ] No global state (Zustand) used
- [ ] All imports use absolute paths with @/ prefix
- [ ] TypeScript strict mode passes with no errors
- [ ] Server-only imports added where appropriate

## Testing Checklist

After implementation, test:

- [ ] CSV upload triggers import process
- [ ] Progress dialog shows real-time updates
- [ ] Valid items are processed successfully
- [ ] Invalid items show specific error messages
- [ ] Error log CSV downloads correctly
- [ ] "Import Again" resets state properly
- [ ] Large files (1000+ rows) process without timeout
- [ ] Batch failures retry automatically
- [ ] Network interruption handled gracefully
- [ ] Multiple imports don't interfere with each other

## Common Pitfalls to Avoid

1. **Don't create custom progress dialogs** - reuse existing components
2. **Don't use global state** - keep everything local in the hook
3. **Don't skip authentication** - always verify user context
4. **Don't forget line numbers** - essential for error reporting
5. **Don't use template literals in CSV** - properly escape quotes in error log
6. **Don't process all items at once** - use batch processing
7. **Don't ignore retry logic** - configure maxRetries appropriately
8. **Don't forget logging** - log at function entry and errors
9. **Don't hardcode batch size** - use service defaults or configure per feature
10. **Don't forget to validate on server** - never trust client-side validation alone

## Example Usage

After implementation, developers will use it like this:

```typescript
import { use{Feature}Import } from "./hooks/use-{feature}-import";
import { ImportProgressDialog } from "@/src/app/components/csv-importer/components/import-progress-dialog";
import { ImportResultDialog } from "@/src/app/components/csv-importer/components/import-result-dialog";

function {Feature}ImportComponent() {
  const {
    startImport,
    isImporting,
    progress,
    result,
    errorLogFile,
    reset,
  } = use{Feature}Import();

  const handleCsvUpload = (data: Raw{Feature}Item[]) => {
    startImport(data);
  };

  return (
    <>
      {/* Your CSV upload UI */}
      
      <ImportProgressDialog
        open={isImporting}
        progress={progress}
        onOpenChange={() => {}}
      />
      
      <ImportResultDialog
        open={!!result}
        result={result}
        onDownloadErrors={() => {
          if (errorLogFile) {
            const url = URL.createObjectURL(errorLogFile);
            const a = document.createElement("a");
            a.href = url;
            a.download = "{feature}-import-errors.csv";
            a.click();
            URL.revokeObjectURL(url);
          }
        }}
        onImportAgain={reset}
        onReset={reset}
      />
    </>
  );
}
```

## Reference Files

Core system files you'll be using:
- `/src/app/components/csv-importer/hooks/use-import.ts`
- `/src/app/components/csv-importer/components/import-progress-dialog.tsx`
- `/src/app/components/csv-importer/components/import-result-dialog.tsx`
- `/src/app/functions/server/services/csv-import/csv-import.service.ts`
- `/src/app/functions/server/services/csv-import/types.ts`

---

**Ready to implement? Provide the feature details and I'll generate all files following this architecture.**
