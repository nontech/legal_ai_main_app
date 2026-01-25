### Create Backend Service

You are an expert in TypeScript, Next.js, Prisma, and service-oriented architecture. Create a complete backend service following the established patterns.

## Purpose
Generate a fully-functional backend service with repository pattern, validation, types, and example usage—ready for immediate use.

## Inputs
The user will provide:
- Domain name (e.g., "rooms", "courses", "bookings")
- Key entities and their fields
- Primary operations needed (create, update, delete, list, etc.)
- Any special relationships or nested services

## Output
Produce these files with complete, working code:
1. `<domain>.types.ts` — TypeScript interfaces for DTOs
2. `<domain>-validation.schemas.ts` — Zod validation schemas
3. `<domain>.repository.ts` — Repository with DB access only
4. `<domain>.service.ts` — Service orchestration with factory function
5. Example server action in appropriate location
6. Verification checklist

## Service Architecture Principles

### One Job
- Each service owns a single domain use case
- Clear boundaries, no cross-domain logic in services

### Validate First
- Zod schema → validated DTOs only
- Never trust raw input

### Repository Handles DB
- Services orchestrate, repositories persist
- All Prisma calls live in repositories only

### Context Everywhere
- Always pass `ServiceContext` (institutionId + userId, optional prisma)
- Validate context in service methods
- Use `hasPermission()` before calling services from actions

### Transactions When Needed
- Group multi-step writes using `executeInTransaction`
- Pass transaction context down to nested calls

## Steps

### 1. Clarify Requirements
Ask the user (if not provided):
- What is the domain name?
- What are the main entities and their fields?
- What operations are needed?
- Are there related services (tags, amenities, etc.)?
- What permissions guard these operations?

### 2. Create Folder Structure
```
src/app/functions/server/services/<domain>/
  ├── <domain>.types.ts
  ├── <domain>-validation.schemas.ts
  ├── <domain>.repository.ts
  └── <domain>.service.ts
```

### 3. Generate Types (DTOs)
```typescript
// <domain>.types.ts
export interface <Domain>CreateInput {
  // fields based on requirements
}

export interface <Domain>UpdateInput {
  // partial fields
}
```

### 4. Create Validation Schemas
```typescript
// <domain>-validation.schemas.ts
import { z } from "zod";

export const create<Domain>Schema = z.object({
  // field validations matching types
});

export const update<Domain>Schema = z.object({
  // optional field validations
});
```

### 5. Implement Repository
```typescript
// <domain>.repository.ts
import "server-only";
import type { PrismaClient } from "@prisma/client";
import { BaseRepository } from "../base/repository.interface";
import type { ServiceContext } from "../base/service-context.types";
import type { <Domain>CreateInput, <Domain>UpdateInput } from "./<domain>.types";

export class <Domain>Repository extends BaseRepository<any, <Domain>CreateInput, <Domain>UpdateInput> {
  constructor(protected override prisma: PrismaClient) {
    super(prisma);
  }

  async findById(id: string, context: ServiceContext) {
    // implementation
  }

  async create(data: <Domain>CreateInput, context: ServiceContext) {
    // implementation
  }

  async update(id: string, data: <Domain>UpdateInput, context: ServiceContext) {
    // implementation
  }

  async delete(id: string, context: ServiceContext) {
    // implementation
  }

  // add custom query methods as needed
}
```

### 6. Implement Service
```typescript
// <domain>.service.ts
import "server-only";
import { BaseService } from "../base/base.service";
import type { ServiceContext } from "../base/service-context.types";
import { ValidationService } from "../shared/validation.service";
import { <Domain>Repository } from "./<domain>.repository";
import { create<Domain>Schema, update<Domain>Schema } from "./<domain>-validation.schemas";
import type { <Domain>CreateInput, <Domain>UpdateInput } from "./<domain>.types";
import { prisma as prismaSingleton } from "@/src/app/misc/singletons/prisma";

export class <Domain>Service extends BaseService {
  private repository = new <Domain>Repository(this.prisma);
  private validation = new ValidationService(this.prisma);

  constructor() {
    super(prismaSingleton);
  }

  async validateContext(context: ServiceContext) {
    return Boolean(context?.institutionId && context?.userId);
  }

  async create<Domain>(data: <Domain>CreateInput, context: ServiceContext) {
    this.log("Creating <domain>", { data });
    const dto = this.validation.validateSchema(create<Domain>Schema, data);

    return this.executeInTransaction(async (tx) => {
      const result = await this.repository.create(dto, { ...context, prisma: tx });
      return result;
    });
  }

  async update<Domain>(id: string, data: <Domain>UpdateInput, context: ServiceContext) {
    this.log("Updating <domain>", { id, data });
    const dto = this.validation.validateSchema(update<Domain>Schema, data);

    return this.executeInTransaction(async (tx) => {
      const result = await this.repository.update(id, dto, { ...context, prisma: tx });
      return result;
    });
  }

  // add other operations as needed
}

// Factory function - memoized singleton
let <domain>ServiceInstance: <Domain>Service | null = null;

/**
 * Factory function to get a <Domain>Service instance.
 * Returns a memoized singleton instance for better performance and resource management.
 * Services remain stateless; no request data is stored on instances.
 */
export function get<Domain>Service(): <Domain>Service {
  if (!<domain>ServiceInstance) {
    <domain>ServiceInstance = new <Domain>Service();
  }
  return <domain>ServiceInstance;
}
```

### 7. Create Example Server Action
```typescript
// src/app/[lang]/<domain>/actions/create-<domain>.ts
"use server";

import { get<Domain>Service } from "@/src/app/functions/server/services/<domain>/<domain>.service";
import { hasPermission } from "@/src/app/functions/server/roles/permission";

export async function create<Domain>Action(formData: FormData) {
  const context = await hasPermission("create:<domain>");

  const input = {
    // map formData to DTO
  };

  const service = get<Domain>Service();
  return service.create<Domain>(input, context);
}
```

## Hard Rules

### File Organization
- Use kebab-case for file names: `room-booking.service.ts`
- Colocate all service files under `services/<domain>/`
- Never put DB logic outside repositories

### Service Pattern
- Services accept only validated DTOs (never raw input)
- All DB calls isolated to repositories
- Every method receives ServiceContext
- Use factory functions, not ServiceRegistry (deprecated)
- Always use `this.log()` for traceability

### Validation & Security
- Validate with Zod before any business logic
- Check permissions in actions before calling services
- Service should validate context in each method
- Never trust client input

### Transactions
- Use `executeInTransaction` for multi-step writes
- Pass transaction context to nested service calls
- Keep transactions as short as possible

### Code Quality
- Add JSDoc comments for public service methods
- Use meaningful variable names
- Follow TypeScript best practices (no `any`, prefer interfaces)
- Import `"server-only"` at top of service and repository files

## Service Checklist

After generation, verify:
- [ ] Service, repository, schemas, and types created with correct names and imports
- [ ] Search codebase: no prisma calls outside repository
- [ ] All inputs validated with Zod; services accept only DTOs
- [ ] All DB calls isolated to repository; services orchestrate only
- [ ] Every method receives ServiceContext; permission checked before service call
- [ ] Proper logging with `this.log()`; meaningful errors thrown
- [ ] Actions are thin: "use server", map inputs → DTOs, call service, return result
- [ ] Factory function created (e.g., `get<Domain>Service`)
- [ ] ServiceRegistry NOT used (deprecated)
- [ ] No TypeScript errors or linting issues

## Example Interaction

**User**: "Create a booking service with create, update, cancel operations. Bookings have roomId, userId, startTime, endTime, and notes."

**Agent Response**:
1. Creates folder structure
2. Generates `booking.types.ts` with interfaces
3. Creates `booking-validation.schemas.ts` with Zod schemas
4. Implements `booking.repository.ts` with DB methods
5. Implements `booking.service.ts` with business logic
6. Creates example `create-booking.ts` action
7. Runs through checklist and reports completion

## Acceptance Checklist
- [ ] All 4 core files generated (types, schemas, repository, service)
- [ ] Example server action created
- [ ] Factory function implemented (not ServiceRegistry)
- [ ] All code follows repository patterns
- [ ] Validation schemas match types
- [ ] ServiceContext passed to all methods
- [ ] Logging and error handling present
- [ ] Service checklist completed
- [ ] No TypeScript errors

