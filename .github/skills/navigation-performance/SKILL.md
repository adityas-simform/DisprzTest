---
name: navigation-performance
description: >
  Audit React Navigation for performance issues including eager screen loading,
  heavy initial routes, deep nesting, and missing native stack usage.
  Triggers: "navigation performance", "lazy loading screens", "React Navigation slow", "deep navigation", "stack navigator".
argument-hint: 'Navigation file or screen name to audit'
---

# Navigation Performance

## When to Use

- App feels slow on startup due to heavy navigation tree initialization
- Screens load eagerly even when never visited
- Deeply nested navigators cause noticeable render overhead
- Transitions or screen mounts are slow

## Detection Checklist

### 1. Eager Screen Loading

```tsx
// ❌ All screens imported and mounted at root level
import HeavyScreen from './HeavyScreen';

// ✅ Lazy-load with React.lazy + dynamic import
const HeavyScreen = React.lazy(() => import('./HeavyScreen'));
```

### 2. Use Native Stack Navigator

```tsx
// ❌ JS-based stack — slower transitions
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Native stack — uses native UINavigationController / Fragment
import { createNativeStackNavigator } from '@react-navigation/native-stack';
```

> `@react-navigation/native-stack` delegates transitions to the platform's native navigation primitives, which run on the UI thread and cannot be blocked by JS.

### 3. Lazy Tab Loading

```tsx
// In Tab Navigator — defer mounting until first visit
<Tab.Navigator screenOptions={{ lazy: true }}>
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

### 4. Avoid Deep Nesting

Keep navigator depth to **3 levels or fewer**. Deep nesting causes:
- More components mounted on startup
- More reconciliation work during navigation events

Flatten where possible using shared navigators or conditional rendering.

### 5. Prevent Re-renders on Navigation State Changes

Use `React.memo` or `useFocusEffect` to guard against parent navigator
state changes triggering unnecessary child re-renders:

```tsx
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    fetchData();
  }, []),
);
```

## Priority Signals

| Pattern | Impact |
|---|---|
| JS stack instead of native stack | High |
| All screens eagerly imported | High |
| Tabs with `lazy: false` (default) on heavy screens | Medium |
| Navigator depth > 5 | Medium |
