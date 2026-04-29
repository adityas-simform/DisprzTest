---
name: react-concurrent-features
description: >
  Audit and apply React 19 concurrent and compiler features in React Native:
  detect blocking state updates, manual memoization that the React Compiler can
  eliminate, and patterns solved by useTransition, useDeferredValue, and
  useOptimistic.
  Triggers: "React 19", "React Compiler", "useTransition", "useDeferredValue", "useOptimistic", "startTransition", "concurrent features".
argument-hint: 'File path with state management or heavy render logic to audit'
---

# React 19 Concurrent & Compiler Features

## When to Use

- Heavy state updates (filtering, sorting) block the JS thread and make UI unresponsive
- `useState` setters for non-urgent updates compete with urgent UI updates (e.g. input value)
- Extensive manual `useMemo` / `useCallback` / `React.memo` could be replaced by the React Compiler
- Manual loading + rollback patterns exist that `useOptimistic` handles natively

> Requires RN 0.76+ (React 19). React Compiler requires `babel-plugin-react-compiler`.

## Detection Checklist

### 1. useTransition — Non-Urgent State Updates

```tsx
// ❌ Filtering large list blocks the input from feeling responsive
const handleChange = (text: string) => {
  setQuery(text);
  setResults(filterData(data, text)); // expensive — blocks UI
};

// ✅ Mark filter as non-urgent — React yields to the urgent input update first
import { startTransition, useState } from 'react';

const handleChange = (text: string) => {
  setQuery(text);                          // urgent
  startTransition(() => {
    setResults(filterData(data, text));    // non-urgent — can be interrupted
  });
};
```

Show a pending indicator during the transition:
```tsx
const [isPending, startTransition] = useTransition();
// isPending === true while the deferred update is in progress
{isPending && <ActivityIndicator />}
```

### 2. useDeferredValue — Derived Expensive Values

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

// Pass deferredQuery to the expensive filtered list — it lags behind
// the input by one render cycle, keeping the input snappy
const filteredResults = useMemo(
  () => filterData(data, deferredQuery),
  [data, deferredQuery],
);
```

### 3. useOptimistic (React 19) — Optimistic UI

```tsx
// ❌ Manual optimistic state with separate loading/rollback logic
const [localItems, setLocalItems] = useState(items);
const [isLoading, setIsLoading] = useState(false);

// ✅ useOptimistic — handles optimistic update + auto-rollback
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (state, newItem: Item) => [...state, { ...newItem, pending: true }],
);

const handleAdd = async (newItem: Item) => {
  addOptimistic(newItem);           // immediately shows in UI
  await saveItem(newItem);          // on error, reverts automatically
};
```

### 4. React Compiler — Eliminate Manual Memoization

Check compatibility first:
```bash
npx react-compiler-healthcheck
```

Enable in `babel.config.js`:
```js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {}],
  ],
};
```

The compiler automatically memoizes components and hooks — remove manual
`useMemo`, `useCallback`, and `React.memo` where the compiler handles them.

### 5. Check for Built-in Hook Coverage Before Manual State

| Manual pattern | Built-in hook (check version first) |
|---|---|
| Debounced input → deferred filter | `useDeferredValue` |
| Loading + rollback for optimistic updates | `useOptimistic` (React 19) |
| Async transition pending state | `useTransition` |

## Priority Signals

| Pattern | Impact |
|---|---|
| Expensive filter/sort on every keystroke blocking input | High |
| Manual optimistic state with rollback logic | Medium |
| Excessive `useMemo`/`useCallback` (compiler candidate) | Medium |
| `startTransition` missing for non-urgent list updates | Medium |
