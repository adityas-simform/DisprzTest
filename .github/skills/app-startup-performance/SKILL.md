---
name: app-startup-performance
description: >
  Audit React Native app cold start and Time to Interactive (TTI): detect heavy
  synchronous initialization, eager module loading, and blocking operations
  before first render. Suggest InteractionManager, React.lazy, and TTI measurement.
  Triggers: "cold start", "app startup", "TTI", "slow launch", "InteractionManager", "splash screen", "startup performance".
argument-hint: 'Entry file (index.js / App.tsx) or App initializer to audit'
---

# App Startup & Cold Start Performance

## When to Use

- App takes a long time before the first screen appears
- Heavy logic runs synchronously during app initialization
- Many modules are eagerly imported at the top level in `index.js` or `App.tsx`
- Splash screen duration feels longer than necessary

## Detection Checklist

### 1. Defer Non-Critical Work with InteractionManager

```tsx
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // Heavy non-critical work — runs after all transitions/interactions settle
    loadAnalyticsSDK();
    prefetchSecondaryData();
  });
  return () => task.cancel();
}, []);
```

### 2. Lazy-Load Heavy Screens

```tsx
// ❌ All screens parsed and executed at startup
import DashboardScreen from './DashboardScreen';
import ReportsScreen from './ReportsScreen'; // rarely visited

// ✅ Loaded only when navigated to
const ReportsScreen = React.lazy(() => import('./ReportsScreen'));
```

Wrap in `Suspense` with a lightweight fallback:

```tsx
<Suspense fallback={<LoadingSpinner />}>
  <ReportsScreen />
</Suspense>
```

### 3. Yield to the JS Thread During Init

```tsx
// Heavy initialization split across frames
const initApp = async () => {
  await loadCriticalConfig();
  await new Promise((r) => requestAnimationFrame(r)); // yield
  await loadSecondaryConfig();
};
```

### 4. Optimise Splash Screen with react-native-bootsplash

```tsx
import BootSplash from 'react-native-bootsplash';

const App = () => {
  useEffect(() => {
    // Hide splash only after critical data is ready
    BootSplash.hide({ fade: true });
  }, []);
};
```

Avoid hiding the splash screen prematurely and then showing a loading spinner — this creates a flash of empty content.

### 5. Measure TTI

```tsx
import { performance } from 'react-native-performance';

// Mark when the first meaningful content is rendered
performance.mark('TTI');
performance.measure('startup', 'nativeLaunchStart', 'TTI');
```

Use **Flipper** or **Systrace** to correlate the TTI mark with the JS timeline.

## Priority Signals

| Pattern | Impact |
|---|---|
| Heavy SDK init on main thread before first render | Critical |
| All screens eagerly imported in root navigator | High |
| Synchronous AsyncStorage reads blocking render | High |
| Splash hidden before critical data is ready | Medium |
