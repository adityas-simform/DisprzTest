# GitHub Copilot Instructions

These instructions apply globally across the entire codebase.

## Rules

1. **TypeScript Strictly Typed**: Always use explicit TypeScript types and interfaces. Avoid using `any` type. Prefer `unknown` over `any` when the type is truly unknown, and use proper generics where applicable.

2. **Functional Components Only**: All React components must be written as functional components using React hooks. Do not use class-based components. Use `React.FC<Props>` or explicit return types for all components.

3. **Naming Conventions**: 
   - React components: `PascalCase` (e.g., `UserProfile`)
   - Functions and variables: `camelCase` (e.g., `fetchUserData`)
   - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
   - Files containing components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
   - Utility/helper files: `camelCase.ts` (e.g., `formatDate.ts`)

4. **Error Handling**: Always handle errors explicitly. Use `try/catch` blocks for async operations and provide meaningful error messages. Never silently swallow errors.

5. **No Magic Numbers or Strings**: Extract all magic numbers and strings into named constants or enums. Keep constants in a dedicated `constants/` directory or co-located `constants.ts` file.

6. **Imports Order**: Organize imports in the following order, separated by a blank line:
   1. React and React Native core imports
   2. Third-party library imports
   3. Internal/local imports (absolute paths)
   4. Relative imports
   5. Type-only imports (`import type { ... }`)
