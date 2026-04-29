---
name: bundle-size-optimization
description: >
  Audit and reduce React Native bundle size: identify large dependencies,
  unused libraries, and suggest lighter alternatives, code splitting, and
  dynamic imports.
  Triggers: "bundle size", "large dependencies", "unused imports", "code splitting", "dynamic import", "source-map-explorer".
argument-hint: 'Package.json or specific module to audit'
---

# Bundle Size Optimization

## When to Use

- App download size is too large
- Cold start is slow due to large JS bundle parse time
- Dependencies with heavy payloads are imported but only partially used
- Source-map analysis shows unexpected large modules

## Detection & Analysis

### 1. Visualise the Bundle

```bash
# Generate a production bundle with source map
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/main.bundle \
  --sourcemap-output /tmp/main.bundle.map

# Visualise with source-map-explorer
npx source-map-explorer /tmp/main.bundle /tmp/main.bundle.map
```

### 2. Remove Unused Libraries

```bash
# Find packages imported in package.json but not required anywhere
npx depcheck
```

Uninstall confirmed unused packages:
```bash
npm uninstall unused-package
```

### 3. Use Lighter Alternatives

| Heavy library | Lighter alternative |
|---|---|
| `moment` (330 KB) | `date-fns` (tree-shakeable) or `dayjs` (~7 KB) |
| `lodash` (full) | `lodash-es` + named imports, or native JS |
| `@emotion/react` | Inline `StyleSheet.create` |
| Full icon library | Only import needed icons |

### 4. Tree-shake Named Imports

```tsx
// ❌ Imports entire lodash bundle
import _ from 'lodash';

// ✅ Only the needed function
import debounce from 'lodash/debounce';
```

### 5. Dynamic Imports for Rarely-Used Code

```tsx
// Loaded only when the user navigates to this screen
const ReportScreen = React.lazy(() => import('./ReportScreen'));
```

### 6. Enable ProGuard / R8 (Android)

In `android/app/build.gradle`:
```groovy
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

## Priority Signals

| Pattern | Impact |
|---|---|
| `moment` imported in the bundle | High (300 KB+) |
| Full `lodash` import | High |
| Large rarely-visited screens eagerly loaded | Medium |
| Icons library loaded in full | Medium |
