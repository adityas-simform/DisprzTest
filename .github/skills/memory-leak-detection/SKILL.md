---
name: memory-leak-detection
description: >
  Detect and fix memory leaks in React Native components: uncleaned useEffect
  subscriptions, active timers not cleared on unmount, and event listeners
  not removed. Provides cleanup patterns for each scenario.
  Triggers: "memory leak", "useEffect cleanup", "timer leak", "event listener leak", "unmount cleanup".
argument-hint: 'File path or component name to audit for memory leaks'
---

# Memory Leak Detection

## When to Use

- App memory grows over time without stabilizing
- Warning: "Can't perform a React state update on an unmounted component"
- Subscriptions, timers, or listeners set up in `useEffect` have no cleanup
- Network requests update state after a component has unmounted

## Detection Checklist

### 1. Always Return Cleanup from useEffect

```tsx
// ❌ No cleanup — subscription lives forever
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
}, []);

// ✅ Cleanup on unmount
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  return () => subscription.remove();
}, []);
```

### 2. Clear Timers on Unmount

```tsx
useEffect(() => {
  const timerId = setInterval(() => fetchUpdates(), 5000);
  return () => clearInterval(timerId);
}, []);

useEffect(() => {
  const timeoutId = setTimeout(() => setVisible(false), 3000);
  return () => clearTimeout(timeoutId);
}, []);
```

### 3. Cancel In-Flight Requests on Unmount

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') throw err;
    });

  return () => controller.abort();
}, []);
```

### 4. Remove Event Listeners

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height);
  const subscription = Keyboard.addListener('keyboardDidShow', handler);
  return () => subscription.remove();
}, []);
```

### 5. Unsubscribe from Observables / Redux Listeners

```tsx
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    setCount(store.getState().count);
  });
  return unsubscribe;
}, []);
```

### 6. Guard setState After Async Operations

```tsx
useEffect(() => {
  let isMounted = true;
  fetchData().then((data) => {
    if (isMounted) setData(data);
  });
  return () => { isMounted = false; };
}, []);
```

> React Query handles this automatically — prefer `useQuery` over manual `useEffect` + `fetch`.

## Tools

- **Flipper — Memory** plugin: heap snapshots and allocation tracking
- **Xcode Instruments — Leaks** (iOS): detect retained object cycles
- **Android Profiler — Memory** tab: heap dumps and GC pressure

## Priority Signals

| Pattern | Impact |
|---|---|
| `setInterval` with no `clearInterval` | High |
| Network request updating state after unmount | High |
| Event emitter subscription without `.remove()` | High |
| `setTimeout` without `clearTimeout` | Medium |
