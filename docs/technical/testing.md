# KomunaID Testing Guidelines

## Overview

KomunaID uses a two-tier testing strategy: PHPUnit for backend (Laravel API) and Vitest for frontend (web application). All code must pass its respective test suite before merge.

---

## Backend Testing (PHPUnit)

### Structure
```
apps/api/tests/
├── Unit/            # Pure logic, no database or HTTP
├── Integration/     # Database, queues, external services
└── Feature/         # HTTP endpoints, full request lifecycle
```

### Running Tests
```bash
cd apps/api
php artisan test                    # Run all tests
php artisan test --filter=AuthTest  # Run a single test class
php artisan test --testsuite=Unit   # Run a specific suite
```

### Guidelines

1. **Unit Tests**
   - Test a single class or method in isolation.
   - No database, file system, or network access.
   - Use mocks/fakes for dependencies.

2. **Integration Tests**
   - Test component interactions (e.g., repository + database).
   - Use `RefreshDatabase` or `DatabaseTransactions` trait.
   - Test queue jobs, event listeners, and service classes.

3. **Feature Tests**
   - Test full HTTP request/response cycle.
   - Use `RefreshDatabase` trait.
   - Authenticate via `actingAs()` or token headers.
   - Assert status codes, response structure, and side effects.

### Conventions
- Test method names describe the scenario: `test_user_cannot_access_admin_route_without_permission`.
- Each test verifies one behavior.
- Use `assertEquals`, `assertJson`, `assertDatabaseHas` for assertions.
- Factories (not seeds) provide test data.

### Example
```php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_receives_401(): void
    {
        $this->getJson('/api/users')
            ->assertStatus(401);
    }

    public function test_user_can_list_own_profile(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }
}
```

### Coverage Target
- Minimum 80% line coverage for new code.
- Coverage reports: `php artisan test --coverage --min=80`.

---

## Frontend Testing (Vitest)

### Structure
```
apps/web/src/
├── __tests__/
│   ├── unit/          # Pure function / hook tests
│   ├── component/     # Component rendering and interaction
│   └── e2e/           # End-to-end browser tests (Playwright)
```

### Running Tests
```bash
cd apps/web
npx vitest              # Run in watch mode
npx vitest run          # Run once
npx vitest run --coverage  # With coverage report
```

### Guidelines

1. **Unit Tests**
   - Pure functions, hooks, utilities, formatters.
   - No DOM or network access.
   - Fast, deterministic, no side effects.

2. **Component Tests**
   - Render components in a simulated DOM (jsdom/happy-dom).
   - Test props, events, conditional rendering, loading states.
   - Use `@testing-library/react` queries and user-event.

3. **E2E Tests**
   - Full browser interaction via Playwright.
   - Test critical user flows (login, register, CRUD operations).
   - Run against a local dev server with test data.

### Conventions
- Test file co-locates with source: `UserCard.tsx` → `UserCard.test.tsx`.
- Use `describe` blocks to group related tests.
- Use `it('should ...')` for individual test cases.
- Mock API calls with MSW (Mock Service Worker).
- Snapshot tests are discouraged except for complex, stable components.

### Example
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits credentials on valid input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'SecureP@ss123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'SecureP@ss123',
    });
  });
});
```

### Coverage Target
- Minimum 80% line coverage for new code.
- Coverage configured in `vitest.config.ts`.

---

## CI Integration

Both test suites run in CI on every push and pull request:

```yaml
# .github/workflows/test.yml (simplified)
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd apps/api && composer install && php artisan test --coverage --min=80

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd apps/web && npm ci && npx vitest run --coverage
```

- PRs cannot merge if either suite fails or coverage drops below threshold.
- Flaky tests are tracked and must be fixed or quarantined within one sprint.

---

## Best Practices

| Do | Don't |
|----|-------|
| Write tests before or alongside code | Skip tests because "it works locally" |
| Use factories for test data | Use hardcoded IDs or seed data |
| Test edge cases and error paths | Only test the happy path |
| Keep tests fast and isolated | Share state between tests |
| Mock external services | Make real API calls in unit/integration tests |
| Assert behavior, not implementation | Assert internal method calls or render trees |
