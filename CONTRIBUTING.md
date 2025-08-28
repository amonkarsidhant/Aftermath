# Contributing to Aftermath

Thanks for your interest in contributing! This guide outlines how to participate in the project.

## Coding Standards

- Use TypeScript for Node and React code.
- Maintain a consistent code style using Prettier defaults and existing project patterns.
- Write clear commit messages and keep changes focused.

## Pull Request Flow

1. Fork the repository and create a feature branch.
2. Make your changes with clear commits.
3. Ensure documentation and tests are updated.
4. Open a pull request describing the motivation and changes.
5. Address review feedback before merging.

## Testing Requirements

Run the available test suites for any packages you modify. For example:

```bash
cd integrations && npm test
```

Pull requests should only be merged when the relevant tests pass.

## Continuous Integration

GitHub Actions runs frontend and backend test jobs on every push and pull request. These jobs install Node 18 dependencies, cache them for faster builds, and fail the pipeline if `npm test` exits with a non-zero status.

Run the same checks locally before committing:

```bash
cd backend && npm test
cd frontend && npm test
```
