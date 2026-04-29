---
name: ram-bundles-inline-requires
description: >
  Enable RAM bundles and inline requires in React Native to reduce startup parse
  time. Detects eagerly-loaded rarely-visited modules and configures Metro for
  on-demand module loading.
  Triggers: "RAM bundle", "inline requires", "metro.config", "startup parse time", "module loading", "ram-bundle".
argument-hint: 'metro.config.js or android/app/build.gradle file path'
---

# RAM Bundles & Inline Requires

## When to Use

- The app has a large number of screens/features, many rarely visited
- Cold start is slow because Metro's JS bundle is fully parsed at launch
- Source-map analysis shows many modules loaded eagerly that aren't needed on startup

## How It Works

- **RAM Bundle**: splits the JS bundle into individual indexed modules that are loaded on demand from disk, instead of parsing the entire bundle at startup.
- **Inline Requires**: defers `require()` calls to the first time a module is actually used, rather than executing all top-level imports at startup.

## Configuration

### 1. Enable Inline Requires in metro.config.js

```js
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    inlineRequires: true,
  },
});

module.exports = config;
```

### 2. Enable RAM Bundle on Android

In `android/app/build.gradle`:
```groovy
project.ext.react = [
    bundleCommand: "ram-bundle",
]
```

> iOS uses an indexed RAM format automatically when Hermes is disabled. With Hermes enabled, Hermes bytecode pre-compilation provides equivalent startup benefits — RAM bundles are not needed on iOS + Hermes.

### 3. Use Inline require() for Heavy Rarely-Used Modules

```tsx
// ❌ Top-level import parsed at startup even if screen is never visited
import HeavyPDFViewer from 'react-native-pdf';

// ✅ Loaded only when the function is called
const openPDF = () => {
  const HeavyPDFViewer = require('react-native-pdf').default;
  // use HeavyPDFViewer
};
```

### 4. Measure TTI Before and After

```bash
# Capture a Systrace trace before enabling
adb shell atrace --async_start -c -b 16384 gfx view sched freq

# Enable inline requires, rebuild, then capture again and compare
```

Use `react-native-performance` to log TTI programmatically and diff the two measurements.

## Priority Signals

| Pattern | Impact |
|---|---|
| Large app (100+ screens) without RAM bundle / inline requires | High |
| Heavy SDK imported at top-level in entry file | High |
| Hermes disabled (misses bytecode pre-compile benefit) | Medium |
