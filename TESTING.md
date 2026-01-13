# Testing Guide

This document provides instructions for running and writing tests for the Zentrais Debate MVP.

## Setup

Install test dependencies:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory:

```
__tests__/
├── components/
│   └── debate/
│       └── ThreadCard.test.tsx
├── hooks/
│   └── useDebate.test.tsx
└── lib/
    └── api/
        └── mock-data.test.ts
```

## Writing Tests

### Component Tests

Example component test:

```typescript
import { render, screen } from '@testing-library/react';
import { ThreadCard } from '@/components/debate/ThreadCard';

describe('ThreadCard', () => {
  it('renders thread title', () => {
    render(<ThreadCard thread={mockThread} />);
    expect(screen.getByText('Test Topic')).toBeInTheDocument();
  });
});
```

### Hook Tests

Example hook test:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useDebate } from '@/hooks/useDebate';

describe('useDebate', () => {
  it('should load threads', async () => {
    const { result } = renderHook(() => useDebate());
    await waitFor(async () => {
      await result.current.loadThreads();
    });
    expect(result.current.threads.length).toBeGreaterThan(0);
  });
});
```

### API Tests

Example API test:

```typescript
import { topicsAPI } from '@/lib/api/mock-data';

describe('topicsAPI', () => {
  it('should get all topics', async () => {
    const topics = await topicsAPI.getAll();
    expect(Array.isArray(topics)).toBe(true);
  });
});
```

## Test Coverage Goals

- Components: 80%+
- Hooks: 80%+
- API Services: 90%+
- Utilities: 90%+

## Mocking

### Mocking Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
```

### Mocking API Services

```typescript
jest.mock('@/lib/api/mock-data', () => ({
  topicsAPI: {
    getAll: jest.fn(() => Promise.resolve([])),
  },
}));
```

## Best Practices

1. **Test user interactions**: Use `@testing-library/user-event` for simulating user actions
2. **Test accessibility**: Use `screen.getByRole()` and similar queries
3. **Test async behavior**: Use `waitFor()` for async operations
4. **Keep tests focused**: Each test should verify one behavior
5. **Use descriptive test names**: Test names should clearly describe what they're testing

## Continuous Integration

Tests should run automatically on:
- Pull requests
- Commits to main branch
- Before deployment

## Troubleshooting

### Tests failing with "Cannot find module"
- Ensure all dependencies are installed: `npm install`
- Check that path aliases in `jest.config.js` match `tsconfig.json`

### Tests timing out
- Increase timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

### Mock not working
- Ensure mocks are defined before imports
- Check mock function signatures match actual functions

