---
name: js-thread-management
description: >
  Audit JavaScript thread usage in React Native: detect long-running synchronous
  computations, expensive render logic, console.log in production, and suggest
  Web Workers, Reanimated worklets, debouncing, and Hermes profiler.
  Triggers: "JS thread", "JavaScript thread", "frame drops", "console.log production", "Hermes profiler", "synchronous computation", "setNativeProps".
argument-hint: 'File path with heavy JS computation or animation logic to audit'
---

# JavaScript Thread Management

## When to Use

- UI feels unresponsive during data processing (sorting, filtering)
- Frame rate drops while the JS thread is computing
- `console.log` / `console.warn` calls are present in production code
- Expensive logic runs inside `render` or event handlers synchronously

## Detection Checklist

### 1. Strip console.* in Production Builds

Each `console.log` crosses the JS-to-native bridge and blocks the JS thread.

```js
// babel.config.js
module.exports = {
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
```

Install: `npm install --save-dev babel-plugin-transform-remove-console`

### 2. Move Heavy Computation Off the JS Thread

```tsx
// ❌ Sorting 10 000 items synchronously during render
const sorted = items.sort(compareFn);

// ✅ Option A — memoize so it only runs when items change
const sorted = useMemo(() => [...items].sort(compareFn), [items]);

// ✅ Option B — offload to a Web Worker for very large datasets
import { wrap } from 'comlink';
const worker = new Worker('./sortWorker.ts');
const sortAsync = wrap<(items: Item[]) => Item[]>(worker);
const sorted = await sortAsync(items);
```

### 3. Use Reanimated Worklets for Animation Logic

```tsx
// ❌ JS thread — runs callback on every frame crossing the bridge
Animated.event([{ nativeEvent: { translationX: translateX } }], {
  useNativeDriver: false,
});

// ✅ Worklet runs entirely on the UI thread
import { useAnimatedGestureHandler } from 'react-native-reanimated';

const gestureHandler = useAnimatedGestureHandler({
  onActive: (event) => {
    translateX.value = event.translationX; // UI thread, no bridge
  },
});
```

### 4. Debounce or Throttle Expensive Event Callbacks

```tsx
const onChangeText = useMemo(
  () =>
    debounce((text: string) => {
      runExpensiveFilter(text);
    }, 200),
  [],
);
```

### 5. Use setNativeProps for Imperative High-Frequency Updates

```tsx
const viewRef = useRef<View>(null);

// Bypasses React reconciliation — no setState, no re-render
const onScrollEvent = (offset: number) => {
  viewRef.current?.setNativeProps({ style: { top: -offset * 0.5 } });
};
```

> Prefer Reanimated shared values over `setNativeProps` for animations.

## Tools

- **Hermes Profiler** — record `.cpuprofile` from Flipper → open in Chrome DevTools Performance tab
- **Systrace** — identify JS thread frame budget violations
- **RN Perf Monitor** — real-time JS FPS counter (shake menu)

## Priority Signals

| Pattern | Impact |
|---|---|
| `console.log` in production bundle | High |
| Synchronous sort/filter of large arrays in render | High |
| JS-thread gesture handlers (PanResponder, Animated.event) | High |
| Expensive handler not debounced/throttled | Medium |
