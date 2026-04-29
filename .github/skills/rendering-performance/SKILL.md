---
name: rendering-performance
description: >
  Audit and fix unnecessary re-renders in React Native components. Use when
  identifying inline functions/objects in JSX, improper state usage, or
  missing memoization with React.memo, useMemo, or useCallback.
  Triggers: "re-renders", "unnecessary renders", "React.memo", "useMemo", "useCallback", "rendering performance".
argument-hint: 'Component file path or component name to audit'
---

# Rendering Performance

## When to Use

- A component re-renders more times than expected
- Inline functions or objects are passed as props in JSX
- `useMemo` / `useCallback` / `React.memo` are missing where they would help
- State updates are causing broad re-render cascades

## Detection Checklist

1. **Inline functions in JSX** — creates a new reference every render:
   ```tsx
   // ❌
   <Button onPress={() => handlePress(id)} />

   // ✅
   const handlePressItem = useCallback(() => handlePress(id), [id]);
   <Button onPress={handlePressItem} />
   ```

2. **Inline object/array literals as props**:
   ```tsx
   // ❌
   <View style={{ flex: 1 }} />

   // ✅
   const styles = StyleSheet.create({ container: { flex: 1 } });
   <View style={styles.container} />
   ```

3. **Missing React.memo on pure child components**:
   ```tsx
   // ❌
   const ListItem = ({ title }: { title: string }) => <Text>{title}</Text>;

   // ✅
   const ListItem = React.memo(({ title }: { title: string }) => (
     <Text>{title}</Text>
   ));
   ```

4. **Expensive derived values not memoized**:
   ```tsx
   // ❌
   const sorted = items.sort((a, b) => a.name.localeCompare(b.name));

   // ✅
   const sorted = useMemo(
     () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
     [items],
   );
   ```

5. **State that causes whole-tree re-renders** — move state as close to where it is used as possible.

## Tools

- **why-did-you-render** — attach to a component to log why it re-rendered
- **React DevTools Profiler** — flame graph shows render timing per component

## Priority Signals

| Pattern | Impact |
|---|---|
| Inline function in FlatList `renderItem` | High — triggers full list re-render |
| Missing `React.memo` on frequently-rendered child | Medium |
| Inline style objects | Low–Medium |
