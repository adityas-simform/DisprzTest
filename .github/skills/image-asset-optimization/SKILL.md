---
name: image-asset-optimization
description: >
  Audit image and asset usage in React Native: detect large unoptimized images,
  missing caching strategies, and wrong format choices. Suggest WebP, thumbnails,
  and react-native-fast-image.
  Triggers: "image optimization", "asset optimization", "WebP", "react-native-fast-image", "image caching", "large images".
argument-hint: 'File path or screen with image components to audit'
---

# Image & Asset Optimization

## When to Use

- Images load slowly or cause frame drops during scrolling
- Network images re-download on every mount (no caching)
- Large PNG/JPEG assets are bundled in the app
- Avatar or thumbnail images are loaded at full resolution

## Detection Checklist

### 1. Use react-native-fast-image for Network Images

```tsx
// ❌ Default Image — no persistent cache, no priority control
<Image source={{ uri: imageUrl }} />

// ✅ FastImage — disk + memory cache, priority, headers
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={styles.avatar}
/>
```

### 2. Use WebP Format

- WebP is ~25–34% smaller than PNG/JPEG at equivalent quality
- Supported on Android API 14+ and iOS 14+
- Convert assets: `npx @squoosh/cli --webp '{}' assets/*.png`
- Or use a CDN that auto-negotiates WebP via `Accept` headers

### 3. Request Thumbnail / Resized Images

Never load a 2000×2000 px image into a 48×48 dp avatar:

```tsx
// ❌ Full resolution
const uri = `https://cdn.example.com/photo/${id}.jpg`;

// ✅ Request a thumbnail matching the display size
const AVATAR_SIZE = 96; // 2× for retina
const uri = `https://cdn.example.com/photo/${id}.jpg?w=${AVATAR_SIZE}`;
```

### 4. Preload Critical Images

```tsx
// Preload above-the-fold images before the screen mounts
FastImage.preload([
  { uri: heroImageUrl, priority: FastImage.priority.high },
]);
```

### 5. Optimise Bundled Assets

- Run `pngquant` or `optipng` on PNG assets in CI
- Use vector assets (SVG via `react-native-svg`) for icons instead of raster images
- Enable Android's WebP asset pipeline in `android/app/build.gradle`:
  ```groovy
  aaptOptions {
      cruncherEnabled = false // handled by webp conversion
  }
  ```

## Priority Signals

| Pattern | Impact |
|---|---|
| Full-res image in avatar/thumbnail slot | High |
| Network images with no caching (default `Image`) | High |
| PNG icons that could be SVG | Medium |
| Missing WebP conversion for large bundled images | Medium |
