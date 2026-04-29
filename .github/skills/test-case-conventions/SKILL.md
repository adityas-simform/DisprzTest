---
name: test-case-conventions
description: "Write, review, or generate test cases for this React Native mobile banking project. Use when: creating new tests, adding spec files, writing unit/functional/snapshot/a11y tests, mocking Redux store, testing hooks with React Query, testing components with React Testing Library, setting up mock wrappers, following project test naming conventions."
argument-hint: "Describe the module/component/hook to test"
---

# Test Case Conventions — Mobile SME Banking

## When to Use
- Writing new spec files for screens, hooks, services, or Redux slices
- Reviewing whether existing tests follow project conventions
- Setting up mock wrappers, stores, or query clients for tests
- Generating snapshot, unit, functional, or a11y tests

---

## File Naming & Structure

**Always use `.spec.ts` / `.spec.tsx`** (never `.test.ts`).

Suffix the file name based on what is being tested:

| Suffix | Purpose |
|---|---|
| `unit.spec.ts(x)` | Logic, utilities, hooks, reducers |
| `functional.spec.ts(x)` | API calls, user interactions, side effects |
| `snapshot.spec.tsx` | Component render snapshots |
| `a11y.spec.tsx` | Accessibility (labels, hints, roles) |
| `ui.spec.tsx` | Styles and testID assertions |
| `performance.spec.tsx` | Render count tracking |

**Colocation rule**: Tests live in a `/spec/` folder **next to the source file**, not in a separate top-level `__tests__` folder (except integration tests).

```
src/mobileBanking/screens/Accounts/Dashboard/
├── index.tsx
└── spec/
    ├── unit.spec.tsx
    ├── snapshot.spec.tsx
    ├── functional.spec.tsx
    └── mock/
        └── index.ts      ← All mock data and store setup
```

---

## Testing Stack

| Library | Version | Purpose |
|---|---|---|
| `jest` | 29.7.0 | Test runner |
| `@testing-library/react-native` | 13.3.3 | Component rendering & querying |
| `@testing-library/react-hooks` | 8.0.1 | Hook testing via `renderHook` |
| `@testing-library/jest-native` | ^4.0.4 | Custom matchers (extended in `setupFilesAfterEnv`) |
| `redux-mock-store` | ^1.5.4 | Mock Redux store |
| `react-test-renderer` | 19.1.0 | Snapshot rendering |

Run tests with `yarn test` (runs `TZ=UTC jest`). Update snapshots with `yarn snapshots`.

---

## Test Structure

```typescript
// 1. Module-level mocks (before any imports of the module under test)
jest.mock("@mobileBanking/api/PayApi", () => ({
  confirmBeneficiaries: jest.fn(),
}));

// 2. Imports
import { render, fireEvent } from "@testing-library/react-native";
import MyComponent from "../index";
import { props, wrapper } from "./mock";

// 3. Setup
beforeEach(() => {
  jest.clearAllMocks();
});

// 4. Grouped describe blocks
describe("MyComponent", () => {
  describe("when condition X", () => {
    it("should do Y", () => {
      // arrange → act → assert
    });
  });
});
```

**Rules:**
- Always call `jest.clearAllMocks()` in `beforeEach`
- Group related tests in nested `describe` blocks
- Use `it("should ...")` phrasing for test names
- Use `describe.skip` / `test.skip` to disable tests rather than deleting them

---

## Component Testing

```typescript
import { render, fireEvent } from "@testing-library/react-native";
import MyComponent from "../index";
import { props, wrapper } from "./mock";

describe("MyComponent component tests", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText, getByLabelText, getByHintText } =
      render(<MyComponent {...props} />, { wrapper });

    expect(getByTestId("myComponent.root")).not.toBeNull();
    expect(getByText("Expected text")).not.toBeNull();
  });

  it("should call onPress when pressed", () => {
    const { getByTestId } = render(<MyComponent {...props} />, { wrapper });
    fireEvent.press(getByTestId("myComponent.root"));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });
});
```

**Query priority** (prefer in this order):
1. `getByTestId` — by `testID` prop
2. `getByLabelText` — by `accessibilityLabel`
3. `getByHintText` — by `accessibilityHint`
4. `getByText` — by visible text
5. `queryByTestId` — when element may not exist (returns `null` instead of throwing)

**testID naming convention** — dot-notation reflecting component hierarchy:
```
"menuItem.settings"           // MenuItem with id="settings"
"menuItem.settings.rightIcon" // Nested element inside MenuItem
"selectButton.from.icon.selected"
```

---

## Hook Testing

Use `renderHook` from `@testing-library/react-hooks` (not `react-native`).

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import useMyHook from "../index";
import { wrapper } from "./mock";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useMyHook unit tests", () => {
  it("should return expected value", () => {
    const { result } = renderHook(() => useMyHook(arg), { wrapper });
    expect(result.current).toStrictEqual(expectedValue);
  });

  it("should update on state change", async () => {
    const { result } = renderHook(() => useMyHook(), { wrapper });
    await act(async () => {
      result.current.doSomething();
    });
    expect(result.current.value).toBe(expected);
  });
});
```

For hooks that use **React Query**, clear `queryClient` in `beforeEach`:

```typescript
import { queryClient } from "@common/utils/tests/queryClient";

beforeEach(() => {
  queryClient.clear();
});
```

Seed query data with:
```typescript
queryClient.setQueryData([QueryKeys.SOME_KEY], mockData);
```

---

## Redux Slice Testing

Test reducers directly — no store needed.

```typescript
import myReducer from "../index";
import { actionA, actionB, resetAction } from "../actions";

const initialState = { /* ... */ };

describe("myReducer", () => {
  it("should handle actionA", () => {
    const result = myReducer(initialState, actionA(payload));
    expect(result).toEqual(expectedState);
  });

  it("should return empty state on resetAction", () => {
    const result = myReducer(initialState, resetAction());
    expect(result).toEqual({});
  });
});
```

---

## API / Service Testing

```typescript
import "@api/spec/mock"; // sets up axios mock
import axios from "@api/axiosConfig";
import MyApi from "@mobileBanking/api/MyApi";

beforeEach(() => {
  jest.clearAllMocks();
});

// Use describe.skip for API functional tests that hit real endpoints
describe.skip("MyApi functional requirements", () => {
  describe("getResource", () => {
    it("should call axios.request with expected params", () => {
      MyApi.getResource();

      expect(axios.request).toBeCalledTimes(1);
      expect(axios.request).toBeCalledWith({
        headers: { Authorization: "Bearer mock-access-token" },
        method: "get",
        url: "v1/custom/banks/coop/resource",
      });
    });

    it("should return data key from axios response", async () => {
      const data = { key: "value" };
      (axios.request as jest.Mock).mockResolvedValueOnce({ data });
      const response = await MyApi.getResource();
      expect(response).toBe(data);
    });
  });
});
```

---

## Mock Setup (`spec/mock/index.ts`)

Every spec folder should have a `mock/index.ts` exporting:
1. A configured mock Redux store
2. A React wrapper component
3. Any mock data objects

```typescript
// spec/mock/index.ts
import React, { ReactNode } from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import defaultStore from "@common/utils/tests/defaultStore";
import { QueryClientTestWrapper } from "@common/utils/tests/queryClient";

const mockedStore = {
  ...defaultStore,
  // Override specific slices needed for this test
  PayReducer: {
    creditAccount: {
      accountType: "Business",
      reference: "test.reference",
      identification: "test.identification",
      nickname: "test.nickname",
    },
  },
};

const mockStore = configureMockStore([thunk]);
export const store = mockStore(mockedStore);

export const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <QueryClientTestWrapper>{children}</QueryClientTestWrapper>
  </Provider>
);

// Mock data
export const mockProps = {
  onPress: jest.fn(),
  label: "Test Label",
};
```

For hooks that only need React Query (no Redux), use the shared helper:

```typescript
import configureMockStore from "redux-mock-store";
import defaultStore from "@common/utils/tests/defaultStore";
import getTestWrapper from "@common/utils/tests/wrapper";

const mockStore = configureMockStore([]);
export const wrapper = getTestWrapper(mockStore(defaultStore));
```

---

## React Query Mutation Testing

```typescript
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";
import useMyMutation from "../index";
import MyApi from "@mobileBanking/api/MyApi";
import { store, wrapper } from "./mock";

jest.mock("@mobileBanking/api/MyApi", () => ({
  createResource: jest.fn(),
}));

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
  (MyApi.createResource as jest.Mock).mockResolvedValue({ id: "test-id" });
});

describe("useMyMutation unit test", () => {
  it("should call api with expected params on mutate", async () => {
    const { result } = renderHook(() => useMyMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(mockPayload);
    });

    expect(MyApi.createResource).toBeCalledTimes(1);
    expect(MyApi.createResource).toBeCalledWith(expectedApiParams);
  });

  it("should reject when required data is missing", async () => {
    const { result } = renderHook(() => useMyMutation(), { wrapper });

    await expect(
      result.current.mutateAsync(null)
    ).rejects.toThrow("Expected error message");

    expect(MyApi.createResource).not.toBeCalled();
  });
});
```

---

## Snapshot Testing

```typescript
import { render } from "@testing-library/react-native";
import MyScreen from "../index";
import { props, wrapper } from "./mock";

describe("MyScreen snapshot test", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<MyScreen {...props} />, { wrapper });
    expect(toJSON()).toMatchSnapshot();
  });
});
```

Update snapshots with `yarn snapshots`. Commit snapshot files alongside component changes.

---

## Navigation Mocking

Navigation is globally auto-mocked. Cast and configure inside individual tests:

```typescript
import { useNavigation } from "@react-navigation/native";

(useNavigation as jest.Mock).mockReturnValue({
  navigate: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
});
```

---

## Common Assertions Reference

```typescript
// Existence
expect(element).not.toBeNull();
expect(queryByTestId("id")).toBeNull(); // element absent

// Equality
expect(value).toEqual(expected);        // deep equality
expect(value).toStrictEqual(expected);  // strict deep equality
expect(value).toBe(expected);           // reference equality

// Snapshots
expect(toJSON()).toMatchSnapshot();

// Function calls
expect(fn).toHaveBeenCalledTimes(1);
expect(fn).toBeCalledWith(arg1, arg2);
expect(fn).not.toBeCalled();

// Async rejections
await expect(promise).rejects.toThrow("error message");
```

---

## Mock Function Patterns

```typescript
jest.fn()                                    // Basic spy
jest.fn().mockReturnValue(value)            // Sync return value
jest.fn().mockResolvedValue(value)          // Resolved Promise
jest.fn().mockResolvedValueOnce(value)      // Resolved once, then default
jest.fn().mockRejectedValue(new Error("x")) // Rejected Promise
jest.fn().mockImplementation((arg) => arg)  // Custom implementation
(SomeModule.method as jest.Mock).mockReturnValue(value)  // Cast + configure
```

---

## Global Mocks (Already Configured in `jestMockSetup.js`)

These are available in all tests without additional setup:

- `react-native` NativeModules: `ForgeRockModule`, `PdfViewManager`, `AccessibilityHelper`
- `react-native` APIs: `Linking`, `Animated`, `Platform`
- `react-native-device-info`: `getUserAgent`, `getUniqueId`, `getSystemVersion`, `isTablet`, `isEmulator`
- `react-native-keychain`: `setGenericPassword`, `getGenericPassword`, `resetGenericPassword`
- `uuid`: `v4` → returns `"5f9f6eb8-f4f8-4687-9dbf-3fef2feec8f1"`
- `@react-navigation/native`: `useNavigation`, `useRoute`
- `@dynatrace/react-native-plugin`

Import project-specific test mocks explicitly:

```typescript
import "@tests/ACPTracker-mock";
import "@tests/trusteer-mock";
import "@tests/TasLib-mock";
import "@tests/integration/mocks/api/success/kvStore";
```

---

## Checklist Before Committing Tests

- [ ] File uses `.spec.ts(x)` suffix with correct category prefix
- [ ] Test file is in a `/spec/` folder next to the source
- [ ] Mock data is in `spec/mock/index.ts`
- [ ] `jest.clearAllMocks()` called in `beforeEach`
- [ ] All `describe` blocks have meaningful names
- [ ] All `it` descriptions start with `"should ..."`
- [ ] No hardcoded non-deterministic values (dates, UUIDs) — use mocks
- [ ] Snapshot files committed alongside component changes
- [ ] No `console.log` statements left in tests
