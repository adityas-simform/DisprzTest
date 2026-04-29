---
name: list-optimization
description: >
  Audit and optimize FlatList / SectionList implementations in React Native.
  Detects ScrollView misuse for large lists, missing keyExtractor, unoptimized
  window/batch settings, and inline renderItem functions.
  Triggers: "FlatList", "SectionList", "ScrollView large list", "list performance", "keyExtractor", "getItemLayout".
argument-hint: 'File path containing the list component to audit'
---

# List Optimization (FlatList / SectionList)

## When to Use

- A list feels janky or slow while scrolling
- Large data sets are rendered all at once
- `ScrollView` is wrapping an unknown/dynamic number of items
- `renderItem` is defined inline inside JSX

## Required Props Checklist

```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}     // ✅ always define
  renderItem={renderItem}                          // ✅ memoized outside JSX
  initialNumToRender={10}                          // ✅ limit initial render
  maxToRenderPerBatch={10}                         // ✅ limit per-batch rendering
  windowSize={5}                                   // ✅ lower = less memory usage
  removeClippedSubviews={true}                     // ✅ for long lists on Android
  getItemLayout={getItemLayout}                    // ✅ if items have fixed height
/>
```

## getItemLayout (fixed-height items)

```tsx
const ITEM_HEIGHT = 72;

const getItemLayout = (_: unknown, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});
```

> Skip `getItemLayout` for variable-height items — incorrect values cause layout bugs.

## Memoize renderItem

```tsx
// ❌ Inline — new function reference every render
<FlatList renderItem={({ item }) => <Row item={item} />} />

// ✅ Stable reference
const renderItem = useCallback(
  ({ item }: { item: Item }) => <Row item={item} />,
  [],
);
<FlatList renderItem={renderItem} />
```

## ScrollView vs FlatList

| Scenario | Use |
|---|---|
| Fixed, small number of items (< ~20) | `ScrollView` |
| Dynamic / unknown / large data set | `FlatList` |
| Grouped/sectioned data | `SectionList` |

## Memoize List Items

```tsx
const Row = React.memo(({ item }: { item: Item }) => (
  <View>
    <Text>{item.title}</Text>
  </View>
));
```

## Priority Signals

| Pattern | Impact |
|---|---|
| `ScrollView` wrapping 100+ dynamic items | Critical |
| Missing `keyExtractor` | High |
| Inline `renderItem` on re-rendering parent | High |
| `getItemLayout` missing on fixed-height list | Medium |
