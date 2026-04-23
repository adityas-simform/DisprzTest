# DisprzTest

A [React Native](https://reactnative.dev) mobile application built with TypeScript, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Tech Stack

| Technology | Version |
|---|---|
| React Native | 0.85.2 |
| React | 19.2.3 |
| TypeScript | ^5.8.3 |
| Node.js | >= 22.11.0 |

## Prerequisites

Before getting started, ensure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide for your target platform (Android / iOS).

- **Node.js** >= 22.11.0
- **Watchman** (macOS/Linux)
- **Android Studio** + Android SDK (for Android)
- **Xcode** + CocoaPods (for iOS, macOS only)

## Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/adityas-simform/DisprzTest.git
   cd DisprzTest
   ```

2. **Install JavaScript dependencies**

   ```sh
   npm install
   ```

3. **Install iOS native dependencies** *(macOS only)*

   ```sh
   bundle install
   bundle exec pod install
   ```

## Running the App

### Step 1: Start the Metro dev server

```sh
npm start
```

### Step 2: Run on a device or emulator

Open a new terminal tab and run one of the following:

**Android**

```sh
npm run android
```

**iOS** *(macOS only)*

```sh
npm run ios
```

If everything is set up correctly, the app will launch in the Android Emulator, iOS Simulator, or a connected physical device.

> You can also build and run directly from **Android Studio** or **Xcode**.

### Hot Reloading

The app supports [Fast Refresh](https://reactnative.dev/docs/fast-refresh) — save any source file to see your changes instantly.

To trigger a full reload manually:

- **Android**: Press <kbd>R</kbd> twice, or open the Dev Menu with <kbd>Ctrl</kbd>+<kbd>M</kbd> (Windows/Linux) / <kbd>Cmd ⌘</kbd>+<kbd>M</kbd> (macOS) and select **Reload**.
- **iOS**: Press <kbd>R</kbd> in the iOS Simulator.

## Project Structure

```
DisprzTest/
├── __tests__/                 # Test files
│   └── App.test.tsx
├── src/
│   ├── components/            # Reusable UI components
│   │   └── PrimaryButton.tsx
│   └── utils/                 # Utility/helper functions
│       └── formatDate.ts
├── App.tsx                    # Root application component
├── index.js                   # Entry point
├── app.json                   # App configuration
├── tsconfig.json              # TypeScript configuration
├── babel.config.js            # Babel configuration
├── metro.config.js            # Metro bundler configuration
├── jest.config.js             # Jest test configuration
└── package.json
```

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the Metro dev server |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm test` | Run the Jest test suite |
| `npm run lint` | Lint source files with ESLint |

## Testing

Run the full test suite with:

```sh
npm test
```

Tests are located in the `__tests__/` directory and use [Jest](https://jestjs.io/) with the `@react-native/jest-preset`.

## Linting & Formatting

This project uses [ESLint](https://eslint.org/) with the `@react-native` config and [Prettier](https://prettier.io/) for code formatting.

```sh
npm run lint
```

## Components

### `PrimaryButton`

A reusable, accessible button component.

**Props:**

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `label` | `string` | ✅ | — | Button text |
| `onPress` | `() => void` | ✅ | — | Press handler |
| `disabled` | `boolean` | ❌ | `false` | Disables the button |
| `testID` | `string` | ❌ | — | Test identifier |

**Usage:**

```tsx
import PrimaryButton from './src/components/PrimaryButton';

<PrimaryButton label="Submit" onPress={() => console.log('pressed')} />
```

## Utilities

### `formatDate(date: Date | string): string`

Formats a `Date` object or ISO 8601 string into a human-readable string (e.g. `"April 21, 2026"`). Throws an `Error` if the date is invalid.

### `isPastDate(date: Date | string): boolean`

Returns `true` if the given date is in the past.

## Troubleshooting

If you run into issues, refer to the React Native [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Blog](https://reactnative.dev/blog)
- [React Native GitHub Repository](https://github.com/facebook/react-native)
