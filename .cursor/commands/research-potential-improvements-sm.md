

Description:  
When a project lead requests a "blindspot-finder" analysis for a specific project part:
- The agent must perform a deep review of the specified section.
- The agent should look for:
  - Unclean or inconsistent code (naming, formatting, structure)
  - Performance issues (inefficient algorithms, unnecessary re-renders, etc.)
  - Missing React memoization or other optimizations (if relevant)
  - Any general deviations from project guidelines (guidelines will be provided separately)
- For each issue found, the agent must:
  - List the exact file(s) where the issue occurs
  - Add a brief comment (1-2 sentences) describing what is wrong in each file


Example format:
- `src/app/component.tsx`: No react memo found
- `src/app/function.ts`: Use promise.all to improve performance. Also the functions do not have logging

The goal is to help the project lead identify and address blind spots before moving forward.
