---
name: native-bridge-performance
description: >
  Audit frequent native bridge calls and heavy native module usage in React
  Native. Suggest batching, JSI / TurboModules, and patterns to minimize
  bridge crossings.
  Triggers: "native bridge", "bridge calls", "native module", "JSI", "TurboModules", "bridge performance".
argument-hint: 'File path or native module to audit'
---

# Native Bridge & Performance

## When to Use

- Frequent calls to native modules are causing JS thread contention
- High-frequency events (touch, scroll, animation frames) cross the bridge
- Native module calls are async when synchronous access is required
- The app targets RN 0.71+ and legacy bridge modules can be migrated

## Detection Checklist

### 1. Batch Native Calls

```tsx
// ❌ Three separate bridge crossings per frame
NativeModules.Haptics.impact();
NativeModules.Logger.log('event');
NativeModules.Analytics.track('tap');

// ✅ Batch into a single native call (if the module supports it)
NativeModules.EventBridge.batch([
  { type: 'haptic', payload: 'impact' },
  { type: 'log', payload: 'event' },
  { type: 'track', payload: 'tap' },
]);
```

### 2. Avoid High-Frequency Bridge Calls in Animations

Move animation logic entirely off the JS thread using Reanimated worklets:

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const offset = useSharedValue(0);

// Runs on UI thread — zero bridge crossings
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],
}));
```

### 3. Migrate to TurboModules (RN 0.71+)

TurboModules use JSI (JavaScript Interface) to call native code **synchronously** without the async bridge:

```tsx
// Old bridge (async, serialized)
NativeModules.MyModule.getValue(callback);

// TurboModule (JSI — synchronous, no serialization overhead)
import { NativeMyModule } from './NativeMyModule';
const value = NativeMyModule.getValue();
```

### 4. Reduce DevTools Bridge Overhead in Production

Ensure `__DEV__` guards are stripped and remote debugging is disabled in production builds. Remote debugging routes ALL JS through Chrome's V8 engine via WebSocket — this makes the bridge appear far slower than it is in production.

### 5. Use setNativeProps for Imperative High-Frequency Updates

```tsx
const viewRef = useRef<View>(null);

// No setState, no re-render, no bridge serialization round-trip per frame
const onProgress = (value: number) => {
  viewRef.current?.setNativeProps({ style: { width: value } });
};
```

> Prefer Reanimated shared values over `setNativeProps` where possible.

## Priority Signals

| Pattern | Impact |
|---|---|
| Native calls inside `onScroll` / animation callbacks | Critical |
| Legacy NativeModules used in critical path (migrate to JSI) | High |
| Multiple sequential native calls that could be batched | Medium |
