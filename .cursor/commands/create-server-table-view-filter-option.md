### Add Filter and View Options to Server Table

You are an expert React/Next.js developer specializing in server-side table components. Add filter and view options to server table components following the established patterns in this codebase.

## Purpose
- Add new filter fields, grouping options, or other view options to server table components
- Automatically update the `DataTableAdvancedToolbar` configuration
- Create necessary components following codebase patterns (e.g., grouping components using `ViewMenu`)

## Inputs
- The user will provide: 
  - Table component name or file path (e.g., "course table", "courses-server-table.tsx")
  - Type of option to add (e.g., "filter", "grouping option", "view option")
  - Option details (field name, label, type, options for selects, etc.)

## Output
- Modified table component file with updated configuration
- New component files if needed (e.g., grouping components)
- Updated imports and type definitions
- Proper integration with existing table structure

## Steps

1. **Identify the table component**
   - Locate the server table component file (usually ends with `-server-table.tsx`)
   - Read the component to understand its current structure
   - Identify the `DataTableAdvancedToolbar` usage

2. **Determine option type and requirements**
   - **Filter field**: Add to `filterFields` array in `DataTableAdvancedToolbar`
   - **Grouping option**: Add to `additionalViewOptions.content` (requires creating/updating a grouping component)
   - **Other view options**: Add to `additionalViewOptions.content` or create custom component

3. **Add filter fields** (if applicable)
   - Add new entry to `filterFields` array
   - Use correct `type` (e.g., "text", "multi-select", "select", "date", etc.)
   - Include proper `label` using translation keys (e.g., `t.generic.name`)
   - For select/multi-select: include `options` array with `label` and `value`
   - Reference existing patterns from `courses-server-table.tsx`

4. **Add grouping options** (if applicable)
   - Check if grouping component exists (e.g., `CourseGrouping`)
   - If exists: update the component to add new grouping option
   - If not exists: create new grouping component following `CourseGrouping` pattern:
     - Use `ViewMenu`, `ViewMenuContent`, `ViewMenuSection`, `ViewMenuItem` components
     - Use `Select` component for dropdown
     - Handle grouping state with `table.setGrouping()`
     - Include proper translation keys
   - Update `additionalViewOptions.content` to include the grouping component
   - Add grouping column IDs to `excludedColumns` if needed

5. **Update imports** (if needed)
   - Add any new component imports
   - Add translation keys if needed
   - Ensure all imports follow codebase conventions

6. **Handle state management** (if needed)
   - For grouping: check if context/provider exists (e.g., `CourseGroupingContext`)
   - Create provider/context if needed for state management
   - Follow existing patterns for state persistence

## Hard Rules

- **Follow codebase patterns**: 
  - Use `ViewMenu` components for view options (not custom divs)
  - Use translation keys (`t.generic.*`, `t.orghub.*`, etc.) - never hardcode strings
  - Use snake_case for translation keys, kebab-case for file names
  - Filter fields use `DataTableAdvancedFilterField` type
  
- **Component structure**:
  - Grouping components should be in `components/` folder colocated with table
  - Use TypeScript interfaces for props
  - Follow single responsibility principle

- **Translation keys**:
  - Always use existing translation keys when possible
  - If new keys needed, document them but don't create translation files (they're managed separately)
  - Use bracket notation for hyphenated sections: `t["section-name"]`

- **Type safety**:
  - Properly type all table instances: `Table<TData>`
  - Use proper types from `@tanstack/react-table`
  - Ensure filter field IDs match column IDs or data structure

- **File naming**:
  - Grouping components: `*-grouping.tsx` or `*-grouping/index.tsx`
  - Providers: `*-provider.tsx` or `*-provider.ts`
  - Use kebab-case for all file names

## Acceptance Checklist

- [ ] Table component file updated with new option
- [ ] Filter fields added to `filterFields` array (if filter option)
- [ ] Grouping/view component created/updated (if grouping/view option)
- [ ] Component properly integrated in `additionalViewOptions.content` (if grouping/view option)
- [ ] All imports added and correct
- [ ] Translation keys used (no hardcoded strings)
- [ ] TypeScript types correct
- [ ] Follows existing codebase patterns (ViewMenu, Select, etc.)
- [ ] State management handled if needed (providers/context)
- [ ] Excluded columns updated if grouping columns added
- [ ] Code follows single responsibility principle

## Examples

### Example 1: Add Filter Field
Input:
```
Add a "category" filter field to the courses table that filters by course category with options: "Beginner", "Intermediate", "Advanced"
```

Output:
- Updated `filterFields` array in `courses-server-table.tsx`:
```typescript
{
  id: "category",
  label: t.generic.category, // or appropriate translation key
  type: "multi-select",
  options: [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ],
}
```

### Example 2: Add Grouping Option
Input:
```
Add a "category" grouping option to the courses table
```

Output:
- Updated `CourseGrouping` component with new `SelectItem`:
```typescript
<SelectItem value="_groupingCategory">
  {t.generic.category}
</SelectItem>
```
- Updated `additionalViewOptions.excludedColumns` to include `"_groupingCategory"` if needed
- Updated grouping handler logic

### Example 3: Add Text Filter
Input:
```
Add a "description" text filter to the courses table
```

Output:
- Updated `filterFields` array:
```typescript
{
  id: "description",
  label: t.generic.description,
  type: "text",
  placeholder: t.generic.search_description, // if translation exists
}
```

## Reference Files
- Table component: `src/app/[lang]/dashboard/orghub/(pages)/course-management/courses/components/courses-server-table/courses-server-table.tsx`
- Grouping component: `src/app/[lang]/dashboard/orghub/(pages)/course-management/courses/components/course-grouping/index.tsx`
- Toolbar component: `src/app/components/server-side-table/data-table-advanced-toolbar.tsx`
- View options: `src/app/components/server-side-table/data-table-view-options.tsx`
- Types: `src/app/components/server-side-table/types.ts`

