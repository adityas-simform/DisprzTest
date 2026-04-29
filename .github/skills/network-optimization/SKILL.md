---
name: network-optimization
description: >
  Audit network usage in React Native apps: detect duplicate API calls,
  unnecessary refetching, and missing caching. Suggest React Query / SWR,
  request debouncing, throttling, and batching.
  Triggers: "duplicate API calls", "refetching", "network optimization", "React Query", "SWR", "caching", "debounce requests".
argument-hint: 'File path or feature with network/API calls to audit'
---

# Network Optimization

## When to Use

- The same API endpoint is called multiple times for the same data
- Data is refetched on every screen mount with no caching
- Search/filter inputs fire a request on every keystroke
- Multiple small requests could be batched into one

## Detection Checklist

### 1. Replace Manual Fetch Logic with React Query

```tsx
// ❌ Manual fetch — no caching, no deduplication
useEffect(() => {
  fetch('/api/users').then((r) => r.json()).then(setUsers);
}, []);

// ✅ React Query — automatic caching, deduplication, background refetch
import { useQuery } from '@tanstack/react-query';

const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Debounce Search Requests

```tsx
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const debouncedSearch = useMemo(
  () => debounce((query: string) => searchApi(query), 300),
  [],
);

// Call debouncedSearch instead of searchApi directly
```

### 3. Configure staleTime to Reduce Refetching

```tsx
// React Query — data stays fresh for 5 minutes, no background refetch
const { data } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => fetchProfile(userId),
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
});
```

### 4. Batch Multiple Requests

Where the API supports it, combine multiple requests into one:

```tsx
// ❌ Three sequential requests
const user = await fetchUser(id);
const posts = await fetchPosts(id);
const followers = await fetchFollowers(id);

// ✅ Parallel (if independent)
const [user, posts, followers] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchFollowers(id),
]);
```

### 5. Throttle High-Frequency Events

```tsx
import throttle from 'lodash/throttle';

const throttledOnScroll = useMemo(
  () => throttle((offset: number) => trackScrollDepth(offset), 500),
  [],
);
```

## Priority Signals

| Pattern | Impact |
|---|---|
| Same query called on every mount with no cache | High |
| Search firing request per keystroke | High |
| Sequential API calls that could be parallelized | Medium |
| Missing `staleTime` in React Query (refetches on every focus) | Medium |
