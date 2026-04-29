---
name: animation-performance
description: >
  Audit animation implementations in React Native for JS-thread bottlenecks:
  detect missing useNativeDriver, JS-driven animations, LayoutAnimation misuse,
  and oversized Lottie files. Suggest Reanimated 2/3, gesture-handler, and
  pausing off-screen animations.
  Triggers: "animation performance", "useNativeDriver", "Reanimated", "Lottie", "frame drops", "animation jank".
argument-hint: 'File path with animation code to audit'
---

# Animation Performance

## When to Use

- Animations cause frame drops (< 60 FPS)
- Animated API is used without `useNativeDriver: true`
- Lottie animations play continuously even when off-screen
- Gesture-driven animations run on the JS thread

## Detection Checklist

### 1. Always Use useNativeDriver for transform/opacity

```tsx
// ❌ Runs on JS thread — frame drops if JS is busy
Animated.timing(opacity, { toValue: 1, duration: 300 }).start();

// ✅ Runs on UI thread
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // only works with transform + opacity
}).start();
```

> `useNativeDriver` only supports `transform` and `opacity`. For layout properties (width, height, margin), use Reanimated or accept JS-thread execution.

### 2. Migrate to Reanimated 2/3 (Worklets)

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const scale = useSharedValue(1);

// This function runs entirely on the UI thread (worklet)
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePress = () => {
  scale.value = withSpring(1.2);
};
```

### 3. Use react-native-gesture-handler for Gesture Animations

```tsx
// ❌ PanResponder — all gesture callbacks on JS thread
import { PanResponder } from 'react-native';

// ✅ GestureDetector — gesture logic on UI thread
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan().onUpdate((e) => {
  translateX.value = e.translationX;
});
```

### 4. Pause Lottie Animations When Off-Screen

```tsx
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

const animRef = useRef<LottieView>(null);

useFocusEffect(
  useCallback(() => {
    animRef.current?.play();
    return () => animRef.current?.pause();
  }, []),
);
```

Also compress Lottie files: use LottieFiles optimizer or convert to dotLottie format.

### 5. Avoid LayoutAnimation for Complex Transitions

`LayoutAnimation` applies to all layout changes globally and cannot be fine-tuned per element. Use Reanimated's `Layout` animations for targeted control:

```tsx
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View entering={FadeIn} exiting={FadeOut}>
  {children}
</Animated.View>
```

## Priority Signals

| Pattern | Impact |
|---|---|
| `Animated.timing` without `useNativeDriver` | High |
| `PanResponder` for drag animations | High |
| Lottie playing off-screen | Medium |
| `LayoutAnimation` for targeted element transitions | Medium |
