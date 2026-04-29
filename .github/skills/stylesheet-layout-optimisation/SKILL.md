---
name: stylesheet-layout-optimisation
description: >
  Audit StyleSheet and layout patterns in React Native: detect inline style
  objects created on every render, dynamic styles recalculated unnecessarily,
  and deeply nested View hierarchies causing excessive layout passes.
  Triggers: "inline styles", "StyleSheet.create", "layout optimization", "View hierarchy", "nested views", "useMemo styles".
argument-hint: 'File path with component styles to audit'
---

# StyleSheet & Layout Optimisation

## When to Use

- Inline style objects are created on every render
- Dynamic styles are recalculated even when their inputs haven't changed
- View hierarchies are deeply nested without functional purpose
- Layout is slow on Android due to unnecessary `overflow: hidden`

## Detection Checklist

### 1. Use StyleSheet.create for Static Styles

```tsx
// ❌ New object reference on every render
<View style={{ flex: 1, backgroundColor: '#fff' }} />

// ✅ StyleSheet.create — style IDs sent instead of full objects, validated in DEV
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
<View style={styles.container} />
```

### 2. Memoize Dynamic Styles

```tsx
// ❌ New style object on every render even when `isActive` hasn't changed
<View style={{ opacity: isActive ? 1 : 0.5 }} />

// ✅ Recalculates only when isActive changes
const dynamicStyle = useMemo(
  () => ({ opacity: isActive ? 1 : 0.5 }),
  [isActive],
);
<View style={dynamicStyle} />
```

Or combine with static styles:

```tsx
<View style={[styles.container, dynamicStyle]} />
```

### 3. Flatten Unnecessary View Hierarchies

Each extra `View` adds a layout node that the Yoga engine must resolve.

```tsx
// ❌ Wrapper View with no styling purpose
<View>
  <View style={styles.card}>
    <View>
      <Text>{title}</Text>
    </View>
  </View>
</View>

// ✅ Flatten to minimum required depth
<View style={styles.card}>
  <Text>{title}</Text>
</View>
```

Use **React DevTools** or **Flipper Layout** plugin to inspect the component tree and spot unnecessary nesting.

### 4. Avoid overflow: hidden on Android When Unnecessary

`overflow: hidden` on Android creates an extra compositing layer:

```tsx
// ❌ Forces extra GPU layer on Android
<View style={{ overflow: 'hidden', borderRadius: 8 }}>

// ✅ Only add when clipping is actually needed
```

On iOS, `overflow: hidden` is handled natively and is generally fine.

### 5. Use flexbox Efficiently

```tsx
// ❌ Absolute positioning for layout that flexbox can express
<View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

// ✅ Flexbox — cheaper layout pass
<View style={{ flex: 1 }} />
```

## Priority Signals

| Pattern | Impact |
|---|---|
| Inline style objects in FlatList `renderItem` | High |
| View nesting depth > 8 levels | Medium |
| `overflow: hidden` on Android without clipping purpose | Medium |
| Dynamic styles not memoized in frequently re-rendering component | Medium |
