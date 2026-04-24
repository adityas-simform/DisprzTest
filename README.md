# DisprzTest

A React Native mobile application paired with a lightweight Express REST API.

## Table of contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Repository structure](#repository-structure)
- [React Native app](#react-native-app)
  - [Installation](#installation)
  - [Run on Android](#run-on-android)
  - [Run on iOS](#run-on-ios)
- [Express API server](#express-api-server)
  - [Server installation](#server-installation)
  - [Start the server](#start-the-server)
- [Running tests](#running-tests)
- [Linting](#linting)
- [Troubleshooting](#troubleshooting)
- [Learn more](#learn-more)

---

## Overview

**DisprzTest** is a bootstrapped [React Native](https://reactnative.dev) project (created with
[`@react-native-community/cli`](https://github.com/react-native-community/cli)) that demonstrates
a mobile client consuming a simple in-memory user management API built with
[Express](https://expressjs.com) and TypeScript.

---

## Prerequisites

Make sure the following tools are installed before proceeding.

| Tool | Minimum version | Notes |
|------|----------------|-------|
| [Node.js](https://nodejs.org) | 22.11.0 | See `engines` in `package.json` |
| [npm](https://npmjs.com) | 10.x | Bundled with Node 22 |
| [Ruby](https://www.ruby-lang.org) | 3.2 | Required for CocoaPods (iOS only) |
| [CocoaPods](https://cocoapods.org) | 1.15 | iOS dependency manager |
| [Xcode](https://developer.apple.com/xcode/) | 15 | macOS + iOS builds |
| [Android Studio](https://developer.android.com/studio) | Hedgehog | Android builds |
| Java JDK | 17 | Required for Android toolchain |

> **Tip**: Follow the official
> [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
> guide for a detailed walkthrough.

---

## Repository structure

```text
DisprzTest/
├── android/            # Android native project
├── ios/                # iOS native project
├── server/             # Express REST API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── types/
│   │   └── validators/
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/     # Shared React Native components
│   └── utils/          # Utility functions
├── __tests__/          # Jest tests
├── App.tsx             # Root application component
└── package.json
```

---

## React Native app

### Installation

Install JavaScript dependencies from the project root:

```sh
npm install
```

### Run on Android

1. Start the Metro bundler:

   ```sh
   npm start
   ```

2. In a new terminal, launch the Android build:

   ```sh
   npm run android
   ```

   > Make sure an Android emulator is running or a physical device is connected via ADB.

### Run on iOS

1. Install Ruby gems (first clone only):

   ```sh
   bundle install
   ```

2. Install CocoaPods dependencies (first clone or after updating native deps):

   ```sh
   bundle exec pod install
   ```

3. Start the Metro bundler:

   ```sh
   npm start
   ```

4. In a new terminal, launch the iOS build:

   ```sh
   npm run ios
   ```

   > Xcode must be installed and a simulator or device must be available.

---

## Express API server

The server lives in the `server/` directory. It exposes a RESTful user management API on port
**3000** by default. See [`server/README.md`](server/README.md) for the full API reference.

### Server installation

```sh
cd server
npm install
```

### Start the server

**Development** (uses `ts-node`, no build step needed):

```sh
cd server
npm run dev
```

**Production** (compile first, then run):

```sh
cd server
npm run build
npm start
```

The server will print:

```text
Server running on http://localhost:3000
```

You can override the port by setting the `PORT` environment variable:

```sh
PORT=8080 npm run dev
```

---

## Running tests

From the project root:

```sh
npm test
```

---

## Linting

```sh
npm run lint
```

---

## Troubleshooting

- **Metro bundler cache issues** — clear the cache with `npm start -- --reset-cache`.
- **CocoaPods not found** — run `gem install cocoapods` or use `bundle exec pod install`.
- **Android build fails** — ensure `ANDROID_HOME` and `JAVA_HOME` environment variables are set
  correctly.

For more help, see the
[React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting).

---

## Learn more

- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Express documentation](https://expressjs.com/en/4x/api.html)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)
