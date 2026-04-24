# Contributing to DisprzTest

Thank you for taking the time to contribute! Please read this guide before opening a pull request.

## Table of contents

- [Branching strategy](#branching-strategy)
- [Commit message conventions](#commit-message-conventions)
- [Development workflow](#development-workflow)
- [Pull request checklist](#pull-request-checklist)
- [Code style](#code-style)

---

## Branching strategy

This project follows a simplified **GitHub Flow** model.

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Protected — direct pushes are not allowed. |
| `feature/<short-description>` | New features or enhancements (e.g. `feature/user-profile`). |
| `fix/<short-description>` | Bug fixes (e.g. `fix/date-format-crash`). |
| `docs/<short-description>` | Documentation-only changes (e.g. `docs/api-reference`). |
| `chore/<short-description>` | Tooling, dependencies, CI (e.g. `chore/upgrade-eslint`). |

### Rules

1. Always branch off `main`.
2. Keep branches short-lived — merge or close them within a few days.
3. Delete the remote branch after the PR is merged.

---

## Commit message conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Build tooling, dependency updates, CI configuration |

### Examples

```
feat(server): add DELETE /users/:id endpoint

fix(PrimaryButton): prevent double-tap on rapid presses

docs(server): add curl examples to API reference

chore: upgrade express to 4.19.2
```

### Rules

- Use the **imperative mood** in the summary line: "add" not "added" or "adds".
- Limit the summary line to **72 characters**.
- Reference issues in the footer using `Closes #<issue-number>` or `Fixes #<issue-number>`.

---

## Development workflow

1. **Fork** the repository and clone your fork locally.

2. Create a new branch:

   ```sh
   git checkout -b feature/my-feature
   ```

3. Install dependencies:

   ```sh
   # React Native
   npm install

   # Server
   cd server && npm install && cd ..
   ```

4. Make your changes following the [code style](#code-style) guidelines.

5. Run the linter:

   ```sh
   npm run lint
   ```

6. Run the test suite:

   ```sh
   npm test
   ```

7. Commit using the [Conventional Commits](#commit-message-conventions) format.

8. Push your branch and open a pull request against `main`.

---

## Pull request checklist

Before marking a PR as ready for review, confirm the following:

- [ ] Branch is up-to-date with `main`.
- [ ] All existing tests pass (`npm test`).
- [ ] New behaviour is covered by tests.
- [ ] ESLint reports no errors (`npm run lint`).
- [ ] TypeScript compiles without errors (`tsc --noEmit`).
- [ ] New public functions and interfaces include TSDoc blocks with `@param`, `@returns`, and
      at least one `@example`.
- [ ] Updated or new Markdown files pass `markdownlint`.
- [ ] The PR description explains *what* changed and *why*.
- [ ] Related issue is referenced in the PR description (e.g. `Closes #42`).
- [ ] Screenshots or screen recordings are attached for any UI changes.

---

## Code style

- **TypeScript**: All files use strict TypeScript. The `any` type is forbidden — use `unknown`
  when the type is genuinely dynamic.
- **React components**: Functional components only. Wrap exported components with
  `React.memo()`. Use `useCallback` for event handler props.
- **Naming**: `PascalCase` for components and interfaces, `camelCase` for functions and
  variables, `UPPER_SNAKE_CASE` for module-level constants.
- **Imports**: Ordered as described in `.github/copilot-instructions.md` — React/RN core →
  third-party → internal absolute → relative → type-only.
- **Styles**: Use `StyleSheet.create()`. No inline style objects.
- **Error handling**: Every `async` function must have a `try/catch` block with a meaningful
  error message. Errors must never be silently swallowed.
