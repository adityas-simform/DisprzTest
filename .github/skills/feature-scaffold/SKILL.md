---
name: feature-scaffold
description: >
  Scaffold a new React Native feature with the correct folder structure and
  basic React hooks wired up. Use this skill when creating a new feature,
  screen, or standalone component that needs its own folder, custom hook,
  TypeScript types, and constants — following the project conventions in
  src/components/ or src/features/. Triggers: "create feature", "new screen",
  "scaffold component", "set up folder structure", "add hooks", "feature folder".
argument-hint: 'Feature name in PascalCase, e.g. UserProfile'
---

# Feature Scaffold

## When to Use

- Creating a new screen or self-contained feature (e.g. `UserProfile`, `CourseList`)
- Adding a component that needs its own custom hook, types, and constants
- Setting up a consistent folder structure that matches project conventions

## Folder Structure

Each feature lives under `src/features/<FeatureName>/` (screens / complex features)
or `src/components/<FeatureName>/` (reusable UI components).

```
src/
└── features/
    └── <FeatureName>/
        ├── index.ts                  # re-exports the main component
        ├── <FeatureName>.tsx         # main functional component
        ├── use<FeatureName>.ts       # custom hook (state + logic)
        ├── types.ts                  # TypeScript interfaces & types
        └── constants.ts              # feature-scoped constants
```

For a **reusable UI component** (no screen-level logic), place it under
`src/components/<ComponentName>/` using the same layout.

## Procedure

### 1. Identify the feature name

Use `PascalCase` for the folder and component (e.g. `UserProfile`).
Use `camelCase` for the hook (e.g. `useUserProfile`).

### 2. Create the folder

```
src/features/<FeatureName>/
```

### 3. Create `types.ts`

Define all TypeScript interfaces and types for the feature.
See [types template](./assets/types.template.ts).

### 4. Create `constants.ts`

Extract all magic strings / numbers into named constants.
See [constants template](./assets/constants.template.ts).

### 5. Create the custom hook `use<FeatureName>.ts`

- Encapsulate all state (`useState`), side effects (`useEffect`), and
  memoised values / callbacks (`useMemo`, `useCallback`) here.
- The component file must contain **no** business logic.
- See [hook template](./assets/hook.template.ts).

### 6. Create the component `<FeatureName>.tsx`

- Import the hook and render UI only.
- Follow all rules from `.github/instructions/frontend.instructions.md`:
  - `StyleSheet.create()` for styles
  - Explicit `Props` interface
  - Accessibility props on interactive elements
  - `Pressable` instead of `TouchableOpacity`
  - Wrap with `React.memo()`
- See [component template](./assets/component.template.tsx).

### 7. Create `index.ts`

Re-export the component as the public API of the feature folder:

```ts
export { default } from './<FeatureName>';
```

### 8. Validate

- No TypeScript errors (`tsc --noEmit`)
- No ESLint errors
- The hook covers: initial state, data-fetching side effect, cleanup
- All interactive elements have `accessibilityLabel` and `accessibilityRole`

## Hook Checklist

| Hook        | Use for                                              |
|-------------|------------------------------------------------------|
| `useState`  | Local UI state (loading, error, data)                |
| `useEffect` | Fetching data, subscriptions, cleanup on unmount     |
| `useCallback` | Functions passed as props to memoised children     |
| `useMemo`   | Derived/computed values that are expensive to recalculate |
| `useRef`    | Persisting values without triggering re-renders      |

## References

- [Component template](./assets/component.template.tsx)
- [Custom hook template](./assets/hook.template.ts)
- [Types template](./assets/types.template.ts)
- [Constants template](./assets/constants.template.ts)
- [Frontend instructions](../../instructions/frontend.instructions.md)
- [Global Copilot instructions](../../copilot-instructions.md)
