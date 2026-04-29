---
name: new-architecture-migration
description: >
  Audit and migrate a React Native project to the New Architecture (Fabric +
  TurboModules). Checks if New Architecture is enabled, identifies legacy bridge
  modules and components, and guides migration to TurboModules and Fabric.
  Triggers: "New Architecture", "Fabric", "TurboModules", "JSI", "newArchEnabled", "legacy bridge migration".
argument-hint: 'android/gradle.properties or ios/Podfile to audit New Architecture config'
---

# New Architecture (Fabric + TurboModules)

## When to Use

- The project uses RN 0.71+ but New Architecture is not enabled
- Native modules still use the old bridge (NativeModules API)
- Custom native UI components use the old renderer (requireNativeComponent)
- Synchronous native calls are needed but currently async via the old bridge

## Detection Checklist

### 1. Enable New Architecture

**Android** — `android/gradle.properties`:
```properties
# Enable New Architecture
newArchEnabled=true
```

**iOS** — `ios/Podfile`:
```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :new_arch_enabled => ENV['RCT_NEW_ARCH_ENABLED'] == '1'
)
```

Run with: `RCT_NEW_ARCH_ENABLED=1 pod install`

### 2. Identify Legacy Native Modules

```tsx
// ❌ Old bridge — NativeModules (async, serialized via JSON)
import { NativeModules } from 'react-native';
const { MyModule } = NativeModules;
MyModule.doSomething(params, callback);
```

### 3. Migrate to TurboModules (JSI)

1. Create a TypeScript spec file:
```tsx
// NativeMyModule.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  doSomething(params: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');
```

2. Implement the native side (Android/iOS) conforming to the spec
3. Replace `NativeModules.MyModule` with the typed TurboModule import

### 4. Migrate Custom Native Components to Fabric

```tsx
// ❌ Old renderer
const MyNativeComponent = requireNativeComponent<Props>('MyNativeComponent');

// ✅ Fabric — create a codegen spec in the native component's JS file
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';

interface NativeProps extends ViewProps {
  color: string;
}

export default codegenNativeComponent<NativeProps>('MyNativeComponent');
```

### 5. Run the Migration Check

```bash
npx @rnx-kit/align-deps --preset microsoft/react-native
```

Check third-party libraries for New Architecture support: [reactnative.directory](https://reactnative.directory) — filter by "New Architecture".

## Priority Signals

| Pattern | Impact |
|---|---|
| `newArchEnabled=false` on RN 0.71+ | High |
| Legacy NativeModules in performance-critical paths | High |
| requireNativeComponent usage | Medium |
