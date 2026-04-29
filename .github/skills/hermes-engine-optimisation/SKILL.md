---
name: hermes-engine-optimisation
description: >
  Audit Hermes engine configuration and usage in React Native: check if Hermes
  is enabled on both platforms, verify bytecode pre-compilation, and identify
  dead code inflating the bytecode bundle.
  Triggers: "Hermes", "Hermes profiler", "bytecode", "Hermes enabled", "cpuprofile", "dead code".
argument-hint: 'android/app/build.gradle or ios/Podfile to audit Hermes config'
---

# Hermes Engine Optimisation

## When to Use

- Hermes is not enabled on Android or iOS
- Startup is slow due to JS parsing overhead (Hermes provides bytecode pre-compilation)
- Dead code or unused exports are inflating the bytecode bundle
- JS performance hotspots need profiling

## Detection Checklist

### 1. Enable Hermes on Android

In `android/app/build.gradle`:
```groovy
android {
    defaultConfig {
        // ...
    }
}

project.ext.react = [
    enableHermes: true,
]
```

For RN 0.70+, Hermes is the default. Verify it's not explicitly disabled:
```groovy
// ❌ Explicitly disabled
enableHermes: false
```

### 2. Enable Hermes on iOS

In `ios/Podfile`:
```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => true
)
```

For RN 0.70+, verify `hermes_enabled` is not set to `false`.

### 3. Verify Hermes is Running at Runtime

```tsx
const isHermes = () => !!global.HermesInternal;
console.log('Hermes enabled:', isHermes());
```

### 4. Profile with Hermes Profiler

1. In Flipper → Hermes Debugger → Profiler tab
2. Record a trace during the slow operation
3. Download the `.cpuprofile`
4. Open in Chrome DevTools → Performance tab → Load profile
5. Identify hot JS functions by self-time

### 5. Remove Unused Exports to Reduce Bytecode Size

Hermes compiles all reachable code to bytecode. Dead exports increase bundle size:

```tsx
// ❌ Exporting unused utilities
export const unusedHelper = () => { /* ... */ };

// ✅ Remove or mark as internal (no export)
const unusedHelper = () => { /* ... */ };
```

Run `npx ts-prune` or `npx unimported` to find and remove unused exports/files.

### 6. Hermes + Inline Requires Combination

Hermes with inline requires provides the best startup performance:
- Hermes: pre-compiles JS to bytecode
- Inline requires: defers module execution to first use

See the `ram-bundles-inline-requires` skill for inline requires setup.

## Priority Signals

| Pattern | Impact |
|---|---|
| Hermes explicitly disabled | Critical |
| No profiling done on slow JS paths | High |
| Many unused exports in large codebase | Medium |
