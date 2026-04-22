---
applyTo: "src/components/**/*.tsx"
---

# Frontend Component Instructions (React Native)

These scoped instructions apply specifically to React Native components inside `src/components/**/*.tsx`.

## Framework-Specific Rules

1. **StyleSheet over Inline Styles**: Always use `StyleSheet.create()` for defining styles. Never use inline style objects (e.g., `style={{ color: 'red' }}`), as they are re-created on every render and bypass StyleSheet optimizations.

   ```tsx
   // ✅ Correct
   const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#fff' },
   });

   // ❌ Avoid
   <View style={{ flex: 1, backgroundColor: '#fff' }} />
   ```

2. **Props Interface Definition**: Every component must have an explicitly defined `Props` interface declared above the component. Use the component name as a prefix (e.g., `ButtonProps`, `CardProps`).

   ```tsx
   interface ButtonProps {
     label: string;
     onPress: () => void;
     disabled?: boolean;
   }

   const Button: React.FC<ButtonProps> = ({ label, onPress, disabled }) => { ... };
   ```

3. **Accessibility First**: All interactive components (buttons, touchables, inputs) must include accessibility props: `accessibilityLabel`, `accessibilityRole`, and `accessibilityHint` where applicable. Every `<Image>` must have an `accessibilityLabel` or `alt` prop.

4. **Avoid `TouchableOpacity` for New Code**: Prefer `Pressable` over `TouchableOpacity` or `TouchableHighlight` for new interactive elements, as it offers a more flexible and modern API.

5. **Memoization for Performance**: Wrap components exported from this directory with `React.memo()` to prevent unnecessary re-renders. Use `useCallback` for functions passed as props and `useMemo` for expensive computations.

   ```tsx
   export default React.memo(MyComponent);
   ```

6. **Responsive Dimensions**: Never hardcode pixel dimensions. Use `Dimensions.get('window')` or the `useWindowDimensions` hook, or use percentage-based/flex layouts to ensure components adapt to all screen sizes.

7. **Component File Structure**: Each component file must follow this structure in order:
   1. Imports
   2. Constants (local to this file)
   3. Props interface
   4. Component function
   5. `StyleSheet.create(...)` call
   6. Default export
