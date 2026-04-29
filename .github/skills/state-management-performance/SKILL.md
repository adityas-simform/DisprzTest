---
name: state-management-performance
description: >
  Audit state management for performance issues in React Native: unnecessary
  global state, excessive re-renders from state updates, and opportunities to
  use built-in React hooks (useTransition, useDeferredValue, useOptimistic)
  instead of manual patterns.
  Triggers: "state management", "global state", "Redux re-renders", "memoized selectors", "useTransition", "useDeferredValue".
argument-hint: 'File path or feature name with state management to audit'
---

# State Management Performance

## When to Use

- Components re-render on every global state change, even unrelated ones
- State that is only used in one component lives in a global store
- Manual loading/optimistic state patterns exist that a React built-in hook handles
- Selectors are not memoized, causing derived data recalculation on every render

## Detection Checklist

### 1. Unnecessary Global State

Move state as close to where it is consumed as possible:

```tsx
// ❌ Global store for UI-only state
dispatch(setModalVisible(true));

// ✅ Local state in the component that owns the modal
const [isVisible, setIsVisible] = useState(false);
```

### 2. Memoized Selectors (Redux / Zustand)

```tsx
// ❌ Re-computes on every state change
const expensiveList = useSelector((state) =>
  state.items.filter((i) => i.active),
);

// ✅ Re-computes only when state.items changes
import { createSelector } from 'reselect';
const selectActiveItems = createSelector(
  (state: RootState) => state.items,
  (items) => items.filter((i) => i.active),
);
const expensiveList = useSelector(selectActiveItems);
```

### 3. Use Built-in React Hooks Before Adding State

Before reaching for manual state management, check if a React built-in hook already solves the pattern:

| Pattern | Built-in hook |
|---|---|
| Non-urgent / deferred updates | `useDeferredValue` |
| Async transitions with pending state | `useTransition` |
| Optimistic UI updates | `useOptimistic` (React 19) |

```tsx
// useDeferredValue — defer expensive filtered list re-render
const deferredQuery = useDeferredValue(searchQuery);

// useTransition — mark non-urgent updates
const [isPending, startTransition] = useTransition();
startTransition(() => setFilteredData(filter(data, query)));

// useOptimistic (React 19) — avoid manual local + rollback state
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, pending: true }],
);
```

### 4. State Normalization

Avoid deeply nested state objects. Use a flat, normalized shape:

```tsx
// ❌
{ users: [{ id: 1, posts: [{ id: 10, comments: [...] }] }] }

// ✅ Normalized
{
  users: { byId: { 1: { id: 1 } }, allIds: [1] },
  posts: { byId: { 10: { id: 10, userId: 1 } }, allIds: [10] },
}
```

## Priority Signals

| Pattern | Impact |
|---|---|
| Global store for transient UI state | High |
| Non-memoized selectors on large arrays | High |
| Manual loading/optimistic state (built-in hook available) | Medium |
| Un-normalized deeply nested state | Medium |
