---
name: react-context-performance
description: >
  Audit React Context usage for performance issues: detect new object references
  on every render, large combined contexts, and components consuming more context
  than they need. Suggest useMemo, context splitting, and Zustand/Redux alternatives.
  Triggers: "Context performance", "context re-render", "useMemo context value", "context splitting", "Provider re-render".
argument-hint: 'File path with React Context definition or Provider usage to audit'
---

# React Context Performance

## When to Use

- All context consumers re-render on every state change, even unrelated ones
- The context `value` prop receives a new object/array literal on every render
- A single large Context combines state and dispatch (or multiple unrelated concerns)
- Components subscribe to a context but only use a small slice of it

## Detection Checklist

### 1. Memoize the Context Value

```tsx
// ❌ New object on every render — all consumers re-render
<UserContext.Provider value={{ user, setUser }}>
  {children}
</UserContext.Provider>

// ✅ Stable reference — consumers only re-render when user or setUser changes
const value = useMemo(() => ({ user, setUser }), [user, setUser]);
<UserContext.Provider value={value}>
  {children}
</UserContext.Provider>
```

### 2. Split State and Dispatch into Separate Contexts

Components that only dispatch actions don't need to re-render when state changes:

```tsx
const UserStateContext = createContext<User | null>(null);
const UserDispatchContext = createContext<Dispatch<Action>>(() => {});

<UserStateContext.Provider value={user}>
  <UserDispatchContext.Provider value={dispatch}>
    {children}
  </UserDispatchContext.Provider>
</UserStateContext.Provider>
```

```tsx
// Read-only consumer — only re-renders when user changes
const user = useContext(UserStateContext);

// Dispatch-only consumer — never re-renders due to state changes
const dispatch = useContext(UserDispatchContext);
```

### 3. Split Large Contexts by Concern

```tsx
// ❌ One context for everything — any change re-renders all consumers
<AppContext.Provider value={{ user, theme, notifications, cart }}>

// ✅ Separate contexts — components subscribe only to what they need
<UserContext.Provider value={userValue}>
  <ThemeContext.Provider value={themeValue}>
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  </ThemeContext.Provider>
</UserContext.Provider>
```

### 4. Replace High-Frequency Context with Zustand or Redux Selector

For frequently-changing values (e.g. scroll position, form state), Context causes
broad re-renders. Use a state manager with fine-grained subscriptions:

```tsx
// Zustand — component only re-renders when count changes
const count = useStore((state) => state.count);

// Redux — memoized selector limits subscriber scope
const count = useSelector(selectCount);
```

### 5. Create Custom Hook to Encapsulate Context Access

```tsx
// Guard against usage outside Provider
export const useUser = (): User => {
  const ctx = useContext(UserStateContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
```

## Priority Signals

| Pattern | Impact |
|---|---|
| Unmemoized object literal as context value | High |
| Single context for state + dispatch | High |
| High-frequency value (scroll, input) in Context | High |
| Large monolithic AppContext | Medium |
