
# Playwright Automation — 30-Day Complete Study Guide

**Version:** 1.0 · **Stack:** Playwright Test (JavaScript/TypeScript) · **Audience:** Beginners to intermediate QA / SDET

---

## How to use this guide

1. Create a single lab repository (`pw-30-day-lab`) and commit after each day.  
2. Run tests in UI mode once per day: `npx playwright test --ui`.  
3. Keep a **flake log**: every flaky test → root cause → fix (usually wrong locator or missing wait).  
4. Answers are included for **all** important questions and **all** mini-projects; still type code yourself.

## Prerequisites

- Node.js 18+ and npm  
- Basic JavaScript (async/await, imports)  
- Optional: TypeScript for Days 7+

## Quick reference

| Command | Purpose |
|---------|---------|
| `npx playwright test` | Run all tests |
| `npx playwright test file.spec.ts` | Run one file |
| `npx playwright test --grep @smoke` | Filter by tag |
| `npx playwright test --headed` | See browser |
| `npx playwright test --debug` | Inspector |
| `npx playwright show-report` | HTML report |

---

## 30-Day Study Schedule (Realistic)


| Week | Focus | Hours/week |
|------|--------|------------|
| 1 | Setup, locators, assertions, forms | ~14h |
| 2 | Waits, network, frames, files, API | ~14h |
| 3 | Auth, fixtures, POM, data-driven | ~14h |
| 4 | Visual, mobile, CI, capstone | ~16h |

**Daily rhythm (≈2–2.5h weekdays, 3–4h weekend):**

1. **30 min** — Read concepts + revision cards  
2. **45 min** — Type examples in your lab repo (no copy-paste only)  
3. **30 min** — Answer important questions aloud or in notes  
4. **45 min** — Mini-project / extend capstone  

**Weekly checkpoints:**

- **End Week 1:** 10+ tests on public demo sites; zero `waitForTimeout` in new tests  
- **End Week 2:** 1 suite with `route` mock + download assertion  
- **End Week 3:** POM for 2 pages + `storageState` auth  
- **End Week 4:** CI workflow green + final LMS capstone  

**Suggested calendar**

| Day | Topic | Lab |
|-----|--------|-----|
| 1 | Why Playwright & Environment Setup | 2.0h |
| 2 | Test Anatomy, Fixtures & Basic Navigation | 2.0h |
| 3 | Locators: getByRole & Accessible Queries | 2.5h |
| 4 | CSS, XPath, test ids & Custom Locators | 2.0h |
| 5 | Assertions & expect Polling | 2.5h |
| 6 | Hooks, Tags & Test Organization | 2.0h |
| 7 | playwright.config.ts Deep Dive | 2.5h |
| 8 | Debugging: UI Mode, Trace Viewer, Inspector | 2.0h |
| 9 | Filling Forms: text, password, textarea | 2.0h |
| 10 | Checkboxes, Radios, Selects & Custom dropdowns | 2.5h |
| 11 | Waiting Strategies | 2.5h |
| 12 | Network: intercept, mock, HAR | 2.5h |
| 13 | Frames & iFrames | 2.5h |
| 14 | Multiple tabs & popups | 2.5h |
| 15 | Dialogs: alert, confirm, prompt | 2.5h |
| 16 | Downloads & uploads | 2.5h |
| 17 | Screenshots & videos | 2.5h |
| 18 | API testing with request fixture | 2.5h |
| 19 | Authentication patterns | 2.5h |
| 20 | Fixtures: extend test | 2.5h |
| 21 | Page Object Model (POM) | 2.5h |
| 22 | Data-driven tests | 2.5h |
| 23 | Parallelism & sharding | 2.5h |
| 24 | Visual regression | 2.5h |
| 25 | Mobile & device emulation | 2.5h |
| 26 | Component testing (intro) | 2.5h |
| 27 | CI: GitHub Actions | 3.0h |
| 28 | Reporting & Allure | 2.5h |
| 29 | Performance & stability | 2.5h |
| 30 | Capstone: Full E2E suite | 4.0h |


## Day 1: Why Playwright & Environment Setup

**Estimated time:** 2.0 hours

### Learning objectives

- Understand what Playwright is and when to use it
- Install Node.js, VS Code, and Playwright Test
- Run your first passing test

### Key concepts (simple explanations)

**End-to-end (E2E) testing** — Automating a real browser to click, type, and verify UI behavior like a user would.

**Playwright Test runner** — Built-in test framework with fixtures, parallel runs, retries, traces, and HTML reports.

**Cross-browser** — Chromium, Firefox, and WebKit from one API; projects in config map to browsers.

**Auto-waiting** — Playwright waits for elements to be actionable before acting, reducing flaky sleeps.

### Hands-on example


```bash
# New project
mkdir pw-study && cd pw-study
npm init -y
npm init playwright@latest
# Choose: TypeScript or JavaScript, tests folder, GitHub Actions optional

npx playwright test
npx playwright test --ui
```


```javascript
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### Important questions (with answers)

**Q:** What problem does Playwright solve compared to manual QA?

**A:** It repeats consistent user flows quickly, catches regressions early, and runs in CI on every commit.

**Q:** Name three browsers Playwright supports out of the box.

**A:** Chromium, Firefox, and WebKit.

**Q:** What is the difference between `page.click` and a raw DOM click in brittle scripts?

**A:** Playwright auto-waits for visibility, stability, and enabled state; raw clicks often race the UI.

### Revision notes

- Install: `npm init playwright@latest`
- Run: `npx playwright test`, debug: `--ui`, `--debug`
- Test file pattern: `*.spec.ts` / `*.spec.js`
- Fixtures: `page`, `context`, `browser` injected by test runner

### Real-time mini-project: Mini-Project 1: Smoke test your favorite public site

Write one test that opens a site, checks the title, and asserts one visible heading.

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('site smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```


## Day 2: Test Anatomy, Fixtures & Basic Navigation

**Estimated time:** 2.0 hours

### Learning objectives

- Read Playwright test structure: describe, test, hooks
- Use `page.goto`, `page.url`, navigation options
- Understand test isolation (fresh context per test)

### Key concepts (simple explanations)

**test vs test.describe** — `test` is one case; `describe` groups related cases and shared hooks.

**async/await** — Every browser action returns a Promise; always await Playwright calls.

**baseURL** — Set in config so `goto('/login')` resolves to your app root.

**test.info()** — Metadata like title, project, retry index for logging and attachments.

### Hands-on example


```javascript
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('lands on home', async ({ page }) => {
    await expect(page).toHaveURL(/\/$/);
  });
});
```

### Important questions (with answers)

**Q:** Why is each test isolated?

**A:** Fresh browser context prevents cookie/storage leakage between tests.

**Q:** What does `waitUntil: 'networkidle'` do?

**A:** Waits until no network connections for ~500ms (use sparingly).

**Q:** When use `page.goto` vs `page.reload`?

**A:** `goto` for new URL; `reload` to refresh current page.

### Revision notes

- Default timeout: action 0 uses expect timeout (often 5s)
- Prefer `toHaveURL` over manual string compares
- Use `test.describe` + `beforeEach` for shared setup

### Real-time mini-project: Mini-Project 2: Multi-page navigation

Test that clicking 'More information' on example.com opens the IANA page.

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('follow link', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'More information...' }).click();
  await expect(page).toHaveURL(/iana\.org/);
});
```


## Day 3: Locators: getByRole & Accessible Queries

**Estimated time:** 2.5 hours

### Learning objectives

- Prefer user-facing locators (role, label, text)
- Chain and filter locators
- Understand strict mode (single match)

### Key concepts (simple explanations)

**getByRole** — Maps to ARIA roles: button, link, textbox, heading — mirrors how assistive tech sees the page.

**getByLabel** — Finds inputs associated with a <label> or aria-label.

**getByPlaceholder / getByText** — Fallbacks when roles are weak; text should be stable.

**locator.first() / nth()** — Escape hatch when multiple matches; fix UI duplication when possible.

### Hands-on example


```javascript
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
```

### Important questions (with answers)

**Q:** Why prefer getByRole over CSS #id?

**A:** IDs change; roles reflect user-meaningful elements and survive refactors better.

**Q:** What error does strict mode cause?

**A:** Playwright throws if a locator resolves to more than one element.

**Q:** How to click the second 'Edit' button?

**A:** Use `.nth(1)` or filter by parent row: `row.getByRole('button', { name: 'Edit' })`.

### Revision notes

- Order: Role → Label → Placeholder → Text → Test id
- Use `{ name: '...' }` exact or regex
- Debug: `await page.getByRole('button').all()` in UI mode

### Real-time mini-project: Mini-Project 3: Login form locators (practice site)

Automate login on https://the-internet.herokuapp.com/login (student / SuperSecretPassword!).

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('heroku login', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
});
```


## Day 4: CSS, XPath, test ids & Custom Locators

**Estimated time:** 2.0 hours

### Learning objectives

- Use data-testid responsibly
- Combine locators with and/or
- Build reusable locator helpers

### Key concepts (simple explanations)

**page.locator('css')** — Powerful but brittle; use for shadow DOM or legacy apps.

**getByTestId** — Reads `data-testid`; contract between dev and QA.

**filter()** — Narrows locators: `page.getByRole('listitem').filter({ hasText: 'Due' })`.

**locator.or()** — Try alternative locators when UI varies.

### Hands-on example


```javascript
const row = page.getByRole('row').filter({ hasText: 'Invoice #42' });
await row.getByRole('button', { name: 'Pay' }).click();
```

### Important questions (with answers)

**Q:** When is CSS acceptable?

**A:** Shadow roots, canvas, or no semantic HTML — document why.

**Q:** What is `data-testid` convention?

**A:** Stable hook not tied to styling; e.g. `data-testid=checkout-submit`.

**Q:** Difference filter vs has?

**A:** `filter({ has: locator })` requires child locator inside.

### Revision notes

- testid config: `testIdAttribute: 'data-test-id'`
- Avoid XPath unless unavoidable

### Real-time mini-project: Mini-Project 4: Table row action

On a demo table page, click action in a specific row (use filter/hasText).

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('sortable table row action', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/tables');
  const table = page.getByRole('table');
  const target = table.getByRole('row').filter({ hasText: 'Action' }).first();
  await expect(target).toBeVisible();
  await target.getByRole('link', { name: 'edit' }).click();
  await expect(page).toHaveURL(/tables/);
});
```


## Day 5: Assertions & expect Polling

**Estimated time:** 2.5 hours

### Learning objectives

- Use web-first assertions (auto-retry)
- Soft assertions when collecting multiple checks
- Negation and custom messages

### Key concepts (simple explanations)

**expect(locator).toBeVisible()** — Retries until timeout; preferred over manual wait + assert.

**toHaveText / toContainText** — String or regex; whitespace can matter — use regex for flexibility.

**expect.poll()** — Custom async polling for non-locator state.

**expect.soft()** — Continues test after failure; useful for audit-style checks.

### Hands-on example


```javascript
await expect(page.getByRole('alert')).toHaveText('Saved');
await expect(page.getByTestId('score')).toHaveText(/\d+/);
await expect.poll(async () => {
  const r = await page.request.get('/api/status');
  return r.ok();
}).toBeTruthy();
```

### Important questions (with answers)

**Q:** Why not use `expect(await el.isVisible()).toBe(true)`?

**A:** No retry — race conditions cause flakes.

**Q:** Default expect timeout?

**A:** 5 seconds (configurable via `expect: { timeout }`).

**Q:** When use soft assertions?

**A:** Bulk UI validation where you want all failures in one run.

### Revision notes

- Matchers: visible, enabled, checked, value, attribute, count
- Use `not` for negative cases

### Real-time mini-project: Mini-Project 5: Assert dashboard widgets

After login, assert 3 widgets visible with expected labels.

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('dashboard widgets after login', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  await expect.soft(page.getByRole('heading', { level: 2 })).toHaveText('Secure Area');
  await expect.soft(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});
```


## Day 6: Hooks, Tags & Test Organization

**Estimated time:** 2.0 hours

### Learning objectives

- Use beforeEach / afterEach for shared setup and teardown
- Apply test.describe for logical grouping
- Run subsets with tags and --grep
- Skip or mark broken tests with test.skip and test.fixme

### Key concepts (simple explanations)

**beforeEach** — Runs before every test in the describe block — ideal for navigation to a starting page.

**afterEach** — Cleanup: delete test data, reset mocks; runs even if test fails.

**test.describe.configure** — Set mode: parallel vs serial when tests share state.

**Annotations @smoke** — Tags in title or test.info().annotations; filter in CI for fast smoke runs.

### Hands-on example


```javascript
import { test, expect } from '@playwright/test';

test.describe('Internet app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');
  });

  test('home @smoke', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome');
  });

  test.fixme('broken feature', async () => {
    // skipped until bug-123 fixed
  });
});
// Run: npx playwright test --grep @smoke
```

### Important questions (with answers)

**Q:** When should tests run serially?

**A:** When they mutate shared backend state or depend on order (prefer isolated data instead).

**Q:** Difference between test.skip and test.fixme?

**A:** `skip` is intentional; `fixme` signals known product/test bug to fix later.

**Q:** Can hooks be async?

**A:** Yes — always await async setup (DB seed, login).

**Q:** How to run only one file?

**A:** `npx playwright test tests/login.spec.ts`

**Q:** Why group with describe?

**A:** Shared hooks, readable reports, and scoped configuration.

### Revision notes

- Structure: `describe` → `beforeEach` → `test`
- Tag smoke tests for PR checks
- Avoid serial unless necessary
- Name tests: behavior + expected outcome

### Real-time mini-project: Organize Herokuapp smoke suite

Create a describe block with 3 tagged tests: headings, links, and footer.

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test.describe('Heroku smoke @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');
  });

  test('title @smoke', async ({ page }) => {
    await expect(page).toHaveTitle(/The Internet/);
  });

  test('examples link @smoke', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Form Authentication' })).toBeVisible();
  });

  test('powered by @smoke', async ({ page }) => {
    await expect(page.getByText('Powered by Elemental Selenium')).toBeVisible();
  });
});
```


## Day 7: playwright.config.ts Deep Dive

**Estimated time:** 2.5 hours

### Learning objectives

- Configure baseURL, timeouts, and reporters
- Define browser projects (chromium, firefox, webkit)
- Set retries and trace for CI
- Understand `use` vs project-level overrides

### Key concepts (simple explanations)

**defineConfig** — Central place for testDir, workers, globalSetup, and expect defaults.

**projects[]** — Each project is a browser/device profile; same tests run per project.

**use.baseURL** — Enables `page.goto('/login')` without hardcoding host.

**trace / screenshot / video** — Artifacts on failure: `trace: 'on-first-retry'` balances speed and debuggability.

### Hands-on example


```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
```

### Important questions (with answers)

**Q:** What does forbidOnly do in CI?

**A:** Fails build if `test.only` left in code — prevents accidental focused runs.

**Q:** How to run only chromium?

**A:** `npx playwright test --project=chromium`

**Q:** Where set global timeout?

**A:** `timeout: 60000` at config root (per test).

**Q:** ENV in config?

**A:** Use `process.env.BASE_URL` for staging vs prod.

**Q:** workers locally vs CI?

**A:** Local: CPU cores; CI: often 2–4 to avoid OOM.

### Revision notes

- Never commit secrets in config — use env vars
- baseURL + relative goto = portable tests
- HTML report: `npx playwright show-report`
- Match retries to pipeline stability goals

### Real-time mini-project: Config lab: multi-project

Add a `smoke` project that only runs tests matching @smoke (use grep in npm script).

**Answer / solution:**


```json
// package.json scripts
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke --project=chromium"
  }
}
```


## Day 8: Debugging: UI Mode, Trace Viewer, Inspector

**Estimated time:** 2.0 hours

### Learning objectives

- Debug failing tests with --debug and Inspector
- Use UI Mode to pick locators and watch steps
- Read traces: actions, network, console, snapshots

### Key concepts (simple explanations)

**UI Mode** — Interactive runner: time travel, watch locators, edit and re-run.

**Inspector** — Step-through with highlight; opens with PWDEBUG=1 or --debug.

**Trace Viewer** — Post-mortem timeline; open zip from report or `show-trace`.

**page.pause()** — Temporary breakpoint in code during local debug only.

### Hands-on example


```bash
npx playwright test tests/login.spec.ts --ui
npx playwright test --debug
npx playwright show-trace test-results/.../trace.zip
```

### Important questions (with answers)

**Q:** First step when a test fails in CI?

**A:** Download trace from artifact → find failing action → fix locator/wait.

**Q:** What is actionability?

**A:** Element visible, stable, enabled, not obscured — shown in trace.

**Q:** How to log locator count?

**A:** `console.log(await page.getByRole('button').count())` in headed mode.

**Q:** Danger of page.pause()?

**A:** Never merge to main — blocks CI.

**Q:** UI Mode vs debug?

**A:** UI Mode for exploration; debug for stepping one test.

### Revision notes

- Re-run single test: `-g "test name"`
- Trace on first retry catches flakes
- Use Pick Locator in UI mode
- Compare screenshot in trace to expected UI

### Real-time mini-project: Debug a failing locator

Intentionally wrong locator, run --ui, fix using Pick Locator.

**Answer / solution:**


```javascript
// Wrong on purpose — fix in UI mode
test('debug me', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByRole('button', { name: 'Log in' }).click(); // fix name to 'Login'
});
```


## Day 9: Filling Forms: text, password, textarea

**Estimated time:** 2.0 hours

### Learning objectives

- Use fill for inputs and textareas
- Tab order and keyboard navigation
- Clear and re-fill patterns

### Key concepts (simple explanations)

**fill()** — Sets value directly — fastest and least flaky for standard inputs.

**pressSequentially()** — Character-by-character; use for inputs that validate per keystroke.

**keyboard.press** — Enter to submit, Tab to move focus, shortcuts with modifiers.

**inputValue()** — Read current value for assertions.

### Hands-on example


```javascript
await page.getByLabel('Username').fill('student');
await page.getByLabel('Password').fill('secret');
await page.keyboard.press('Enter');
await expect(page.getByLabel('Username')).toHaveValue('student');
```

### Important questions (with answers)

**Q:** fill vs type (deprecated)?

**A:** Prefer fill; type was removed in favor of pressSequentially.

**Q:** How to append text?

**A:** read value then fill combined, or click end + pressSequentially.

**Q:** Contenteditable?

**A:** Use locator.fill if supported or keyboard typing.

**Q:** Password fields?

**A:** Same as text; never log values in CI output.

**Q:** Disabled field?

**A:** Action fails — assert toBeDisabled first.

### Revision notes

- getByLabel for form fields
- Submit with button click or Enter
- Assert with toHaveValue
- Avoid focusing via brittle CSS

### Real-time mini-project: Registration form

Fill all fields on https://demoqa.com/automation-practice-form (sample subset).

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('practice form partial', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.getByPlaceholder('First Name').fill('Ada');
  await page.getByPlaceholder('Last Name').fill('Lovelace');
  await page.getByPlaceholder('name@example.com').fill('ada@example.com');
  await expect(page.getByPlaceholder('First Name')).toHaveValue('Ada');
});
```


## Day 10: Checkboxes, Radios, Selects & Custom dropdowns

**Estimated time:** 2.5 hours

### Learning objectives

- check/uncheck and expect checked state
- selectOption on native selects
- Click combobox + option for custom UI

### Key concepts (simple explanations)

**check() / uncheck()** — For checkbox inputs; asserts state with toBeChecked.

**selectOption** — By value, label, or index on <select>.

**combobox pattern** — Role combobox opens listbox/options in React/MUI/Angular.

**force: true** — Bypass actionability — last resort; fix overlay instead.

### Hands-on example


```javascript
await page.getByRole('checkbox', { name: 'Accept terms' }).check();
await page.getByLabel('Country').selectOption({ label: 'India' });
await page.getByRole('combobox', { name: 'City' }).click();
await page.getByRole('option', { name: 'Delhi' }).click();
```

### Important questions (with answers)

**Q:** How to assert radio selected?

**A:** toBeChecked on the radio locator.

**Q:** Multi-select?

**A:** selectOption with array of values.

**Q:** Why combobox click fails?

**A:** Option list in portal — wait for option visible.

**Q:** indeterminate checkbox?

**A:** May need evaluate — rare; prefer explicit UI state.

**Q:** Custom select ant design?

**A:** Often getByTitle or getByText for option.

### Revision notes

- Native select → selectOption
- Custom → combobox + option
- Always assert final state
- Scroll into view if needed (auto usually handles)

### Real-time mini-project: Heroku checkbox + dropdown

Test checkboxes page and dropdown page on the-internet.herokuapp.com.

**Answer / solution:**


```javascript
test('checkboxes', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const first = page.getByRole('checkbox').first();
  await first.check();
  await expect(first).toBeChecked();
});

test('dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.locator('#dropdown').selectOption('2');
  await expect(page.locator('#dropdown')).toHaveValue('2');
});
```


## Day 11: Waiting Strategies

**Estimated time:** 2.5 hours

### Learning objectives

- Prefer web-first assertions over manual waits
- waitForURL, waitForLoadState, waitForResponse
- Avoid waitForTimeout except experiments

### Key concepts (simple explanations)

**auto-wait** — Built into click/fill; you rarely need explicit element waits.

**waitForURL** — After navigation or SPA route change — glob or regex pattern.

**waitForResponse** — Gate on API completion before asserting UI.

**waitForFunction** — Custom JS predicate on page when needed.

### Hands-on example


```javascript
await page.getByRole('link', { name: 'Login' }).click();
await page.waitForURL('**/secure');
await page.waitForLoadState('domcontentloaded');
const resp = await page.waitForResponse(r =>
  r.url().includes('/api/me') && r.status() === 200
);
```

### Important questions (with answers)

**Q:** Why is waitForTimeout bad?

**A:** Fixed delay is always too short or too long — flaky either way.

**Q:** load vs networkidle?

**A:** networkidle is discouraged on SPAs with websockets.

**Q:** waitForSelector?

**A:** Still valid; prefer expect(locator).toBeVisible().

**Q:** SPA navigation?

**A:** waitForURL or expect URL assertion.

**Q:** Parallel click + wait?

**A:** Promise.all([waitForResponse, click]).

### Revision notes

- Assertion = wait + check
- Pair actions with URL or API wait
- Document why any explicit wait exists
- Increase timeout only after fixing root cause

### Real-time mini-project: Dynamic loading

Heroku dynamic loading: click Start, wait for finish text.

**Answer / solution:**


```javascript
test('dynamic loading', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText('Hello World!')).toBeVisible({ timeout: 15000 });
});
```


## Day 12: Network: intercept, mock, HAR

**Estimated time:** 2.5 hours

### Learning objectives

- Use page.route to stub or modify traffic
- fulfill, continue, abort routes
- Test UI when API is slow or erroring

### Key concepts (simple explanations)

**page.route** — Pattern match URL; handler receives Route object.

**route.fulfill** — Return mock body/status without hitting server.

**route.continue** — Modify headers/body then pass through.

**route.fetch** — Get real response, then edit and fulfill — partial mock.

### Hands-on example


```javascript
await page.route('**/api/status', async route => {
  await route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'down' }),
  });
});
await page.goto('/status');
await expect(page.getByText('Service unavailable')).toBeVisible();
```

### Important questions (with answers)

**Q:** Mock vs stub vs spy?

**A:** Mock replaces response; spy records calls; stub provides canned data.

**Q:** Order of routes?

**A:** First registered match wins; specific patterns first.

**Q:** Test error UI?

**A:** fulfill 500 and assert error banner.

**Q:** HAR?

**A:** Record with `recordHar` in config for replay debugging.

**Q:** Mobile API?

**A:** Same route API works for any client of those URLs.

### Revision notes

- Stub at network layer for fast UI tests
- Never mock what you intend to integration-test
- Unroute when test done if shared page
- Assert request payload with route handler

### Real-time mini-project: Mock JSON on todo app

Use route to return one todo and assert UI (local app or static HTML).

**Answer / solution:**


```javascript
test('mock todos', async ({ page }) => {
  await page.route('**/api/todos', r =>
    r.fulfill({ json: [{ id: 1, title: 'Learn Playwright', completed: false }] })
  );
  await page.goto('http://localhost:3000/todos');
  await expect(page.getByText('Learn Playwright')).toBeVisible();
});
```


## Day 13: Frames & iFrames

**Estimated time:** 2.5 hours

### Learning objectives

- Scope actions with frameLocator
- Chain locators inside frames
- Handle nested frames carefully

### Key concepts (simple explanations)

**frameLocator** — Returns Locator scoped to iframe — resilient to frame element changes.

**contentFrame()** — Lower-level; prefer frameLocator for tests.

**iframe loading** — Wait for element inside frame — auto-wait applies inside scope.

**cross-origin** — Cannot access DOM if truly cross-origin — test via UI visible in frame only.

### Hands-on example


```javascript
const frame = page.frameLocator('#myFrame');
await frame.getByRole('button', { name: 'Submit' }).click();
await expect(frame.getByText('Success')).toBeVisible();
```

### Important questions (with answers)

**Q:** Why tests fail on iframes?

**A:** Locators searched in main document only.

**Q:** Nested iframe?

**A:** chain frameLocators: page.frameLocator('#a').frameLocator('#b')

**Q:** Name/id selector?

**A:** page.frameLocator('iframe[name=embed]')

**Q:** Payment iframe?

**A:** Often 3rd party — use visible text in frame scope.

**Q:** Detach?

**A:** Re-navigate if frame reloads — get fresh frameLocator.

### Revision notes

- Always scope: frameLocator → getByRole
- Don't use brittle frame index
- Test iframe src loads (optional network wait)
- TinyMCE/editor often in iframe

### Real-time mini-project: Heroku WYSIWYG / iframe

TinyMCE editor page uses iframe — type and assert.

**Answer / solution:**


```javascript
test('tinymce iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  const editor = page.frameLocator('#mce_0_ifr').locator('body');
  await editor.click();
  await editor.fill('Hello from Playwright');
  await expect(editor).toContainText('Hello from Playwright');
});
```


## Day 14: Multiple tabs & popups

**Estimated time:** 2.5 hours

### Learning objectives

- Wait for new Page with context.waitForEvent('page')
- Switch between tabs in same context
- Close popups and assert opener state

### Key concepts (simple explanations)

**BrowserContext** — Isolated session; multiple pages (tabs) share cookies.

**waitForEvent('page')** — Fires when popup/tab opens — pair with click via Promise.all.

**popup.url()** — Assert navigated URL on new page.

**bringToFront()** — Focus tab before interacting.

### Hands-on example


```javascript
const [popup] = await Promise.all([
  page.context().waitForEvent('page'),
  page.getByRole('link', { name: 'Open window' }).click(),
]);
await popup.waitForLoadState();
await expect(popup).toHaveURL(/windows\.net/);
await popup.close();
```

### Important questions (with answers)

**Q:** target=_blank?

**A:** Usually new page in same context — use waitForEvent.

**Q:** window.open?

**A:** Same pattern.

**Q:** Different context?

**A:** Rare — login in one context, guest in another.

**Q:** How many pages?

**A:** context.pages() length.

**Q:** Popup blockers?

**A:** Playwright allows popups by default.

### Revision notes

- Promise.all([waitForEvent, action])
- Always waitForLoadState on new page
- Close popups to avoid leaks
- Assert both opener and popup

### Real-time mini-project: Heroku windows

Click link that opens new window; assert heading on popup.

**Answer / solution:**


```javascript
test('new window', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);
  await expect(newPage.getByRole('heading', { name: 'New Window' })).toBeVisible();
  await newPage.close();
});
```


## Day 15: Dialogs: alert, confirm, prompt

**Estimated time:** 2.5 hours

### Learning objectives

- Register dialog handler before action
- accept / dismiss and read message
- Handle prompt input text

### Key concepts (simple explanations)

**dialog event** — Fires for alert, confirm, prompt — must handle or test hangs.

**dialog.accept()** — OK on alert/confirm; optional prompt text.

**dialog.dismiss()** — Cancel on confirm/prompt.

**dialog.message()** — Assert text content.

### Hands-on example


```javascript
page.once('dialog', async dialog => {
  expect(dialog.type()).toBe('confirm');
  expect(dialog.message()).toContain('Are you sure');
  await dialog.accept();
});
await page.getByRole('button', { name: 'Delete' }).click();
```

### Important questions (with answers)

**Q:** What if no handler?

**A:** Test times out when dialog appears.

**Q:** once vs on?

**A:** once auto-removes; on handles multiple.

**Q:** Native vs custom modal?

**A:** Custom modals are DOM — use getByRole dialog.

**Q:** Order?

**A:** Register handler BEFORE click.

**Q:** prompt?

**A:** dialog.accept('typed answer').

### Revision notes

- Handler before action
- Assert dialog.message()
- Custom modals ≠ window.alert
- Use once for single dialog

### Real-time mini-project: Heroku JavaScript alerts

Accept confirm on https://the-internet.herokuapp.com/javascript_alerts

**Answer / solution:**


```javascript
test('js confirm', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.once('dialog', d => d.accept());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.getByText('You clicked: Ok')).toBeVisible();
});
```


## Day 16: Downloads & uploads

**Estimated time:** 2.5 hours

### Learning objectives

- Wait for download event and save file
- Upload with setInputFiles
- Assert file name and size

### Key concepts (simple explanations)

**waitForEvent('download')** — Pair with click that triggers download.

**download.saveAs** — Write to disk for assertions.

**setInputFiles** — Works on hidden file inputs; single or multiple files.

**readFile sync** — Node fs to assert contents after saveAs.

### Hands-on example


```javascript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByText('Download report').click(),
]);
const path = await download.path();
expect(download.suggestedFilename()).toMatch(/\.pdf$/);

await page.getByLabel('Upload').setInputFiles('fixtures/avatar.png');
```

### Important questions (with answers)

**Q:** Downloads folder?

**A:** Configured via acceptDownloads in use.

**Q:** Drag-drop upload?

**A:** locator.setInputFiles or dispatch drop event.

**Q:** Large files?

**A:** Increase timeout; use test fixture path.

**Q:** CI headless downloads?

**A:** Supported same as local.

**Q:** Multiple files?

**A:** setInputFiles(['a.txt','b.txt']).

### Revision notes

- Promise.all download pattern
- fixtures/ folder for uploads
- Assert suggestedFilename
- Clean up saved files in afterEach

### Real-time mini-project: Heroku file upload

Upload file and see uploaded filename.

**Answer / solution:**


```javascript
import path from 'path';
import { test, expect } from '@playwright/test';

test('upload', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');
  const file = path.join(__dirname, 'fixtures', 'sample.txt');
  await page.locator('#file-upload').setInputFiles(file);
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.getByText('File Uploaded!')).toBeVisible();
  await expect(page.locator('#uploaded-files')).toContainText('sample.txt');
});
```


## Day 17: Screenshots & videos

**Estimated time:** 2.5 hours

### Learning objectives

- Capture full page and element screenshots
- Configure video on failure
- Attach screenshots to report

### Key concepts (simple explanations)

**page.screenshot** — fullPage, clip, mask sensitive regions.

**expect(locator).toHaveScreenshot** — Visual comparison with threshold.

**video: 'retain-on-failure'** — Saves disk; on in use block.

**test.info().attach** — Add image to HTML report.

### Hands-on example


```javascript
await page.screenshot({ path: 'artifacts/home.png', fullPage: true });
await test.info().attach('after-login', {
  body: await page.screenshot(),
  contentType: 'image/png',
});
```

### Important questions (with answers)

**Q:** Element screenshot?

**A:** locator.screenshot()

**Q:** Mask?

**A:** mask: [page.getByLabel('SSN')] in screenshot options.

**Q:** CI visual diffs?

**A:** Commit baseline snapshots; review in PR.

**Q:** maxDiffPixels?

**A:** Tolerance for anti-aliasing.

**Q:** When not visual test?

**A:** Functional assert cheaper — use screenshots for debug.

### Revision notes

- screenshot only-on-failure in config
- Store artifacts in test-results/
- Visual tests need stable fonts/data
- Attach for stakeholder reports

### Real-time mini-project: Screenshot element

Screenshot the login form on Heroku login page.

**Answer / solution:**


```javascript
test('login form shot', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  const form = page.locator('#login');
  await form.screenshot({ path: 'test-results/login-form.png' });
});
```


## Day 18: API testing with request fixture

**Estimated time:** 2.5 hours

### Learning objectives

- Use APIRequestContext for REST calls
- Share cookies with browser via storageState
- Setup data via API faster than UI

### Key concepts (simple explanations)

**request fixture** — Isolated API client; respects baseURL from config.

**request.newContext** — Separate auth headers per role.

**expect(await response.json())** — Parse body; assert schema fields.

**API + UI** — Seed via POST /api/items then assert UI list.

### Hands-on example


```javascript
test('api creates user', async ({ request }) => {
  const res = await request.post('/api/users', {
    data: { name: 'Test User', email: 't@example.com' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.id).toBeTruthy();
});
```

### Important questions (with answers)

**Q:** Why API setup?

**A:** Faster tests; UI only for user-visible path.

**Q:** Auth header?

**A:** extraHTTPHeaders in request context.

**Q:** GraphQL?

**A:** POST with query in data body.

**Q:** File upload API?

**A:** multipart via request.post with multipart.

**Q:** Rate limits?

**A:** Mock or test account pool.

### Revision notes

- request shares baseURL
- Validate status + critical fields
- Teardown DELETE in afterEach
- Don't duplicate every UI flow in API

### Real-time mini-project: ReqRes API sample

Public API: list users and assert first user has email.

**Answer / solution:**


```javascript
test('reqres list', async ({ request }) => {
  const res = await request.get('https://reqres.in/api/users?page=1');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.data[0].email).toContain('@');
});
```


## Day 19: Authentication patterns

**Estimated time:** 2.5 hours

### Learning objectives

- Save storageState after login
- globalSetup for one-time auth
- Multiple roles: admin.json, user.json

### Key concepts (simple explanations)

**storageState** — JSON of cookies + localStorage replayed into new contexts.

**globalSetup** — Runs once before all tests — expensive login once.

**test.use({ storageState })** — Per-file or per-describe role.

**OAuth / SSO** — May need real IdP test tenant or bypass with API token + cookie injection.

### Hands-on example


```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: { storageState: 'playwright/.auth/user.json' },
});
```

### Important questions (with answers)

**Q:** Commit auth json?

**A:** No — generate in CI globalSetup; gitignore .auth/

**Q:** Expired session?

**A:** Refresh in setup or shorter test suite.

**Q:** 2FA?

**A:** Use test bypass codes or mock SMS in staging.

**Q:** Parallel roles?

**A:** Separate storage files per worker if needed.

**Q:** Logout test?

**A:** Use context without storageState.

### Revision notes

- globalSetup → storageState
- gitignore playwright/.auth
- Multiple projects per role
- UI login test once; reuse state elsewhere

### Real-time mini-project: Auth reuse

Script global-setup login to Heroku and save state (pattern).

**Answer / solution:**


```javascript
// global-setup.js
import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.context().storageState({ path: 'playwright/.auth/student.json' });
  await browser.close();
}
```


## Day 20: Fixtures: extend test

**Estimated time:** 2.5 hours

### Learning objectives

- Create custom fixtures with test.extend
- Compose Page Objects via fixtures
- Auto-cleanup with fixture teardown

### Key concepts (simple explanations)

**test.extend** — Add typed fixtures; dependency injection between fixtures.

**worker scope** — Rare — shared DB per worker.

**auto fixture** — Runs even if test doesn't list it — for cleanup.

**base test export** — Export custom `test` from fixtures.ts; import everywhere.

### Hands-on example


```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const p = new LoginPage(page);
    await use(p);
  },
});
```

### Important questions (with answers)

**Q:** Fixture vs beforeEach?

**A:** Fixture lazy per test; can depend on other fixtures.

**Q:** page is a fixture

**A:** Built-in; don't recreate browser manually.

**Q:** Teardown?

**A:** Code after `await use(x)` runs after test.

**Q:** TypeScript?

**A:** Strongly type custom fixtures.

**Q:** Import test from?

**A:** Always from your fixtures file in suite.

### Revision notes

- One fixtures.ts per project
- Teardown after use()
- Don't put assertions in fixtures
- loginPage fixture for DRY

### Real-time mini-project: Logged-in page fixture

Fixture that logs in before each test using storage or UI.

**Answer / solution:**


```typescript
export const test = base.extend({
  loggedInPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/student.json' });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

test('secure area', async ({ loggedInPage }) => {
  await loggedInPage.goto('https://the-internet.herokuapp.com/secure');
  await expect(loggedInPage.getByText('Welcome to the Secure Area')).toBeVisible();
});
```


## Day 21: Page Object Model (POM)

**Estimated time:** 2.5 hours

### Learning objectives

- Encapsulate selectors and actions in classes
- Keep tests readable as user stories
- Avoid assertion logic inside POM (mostly actions)

### Key concepts (simple explanations)

**Page class** — Holds Page + locators as readonly fields.

**methods** — login(), openSettings() — return void or next page object.

**composition** — DashboardPage contains Sidebar component.

**anti-pattern** — Giant god page with 200 methods — split by feature.

### Hands-on example


```typescript
export class LoginPage {
  readonly user;
  readonly pass;
  readonly submit;
  constructor(private readonly page: Page) {
    this.user = page.getByLabel('Username');
    this.pass = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Login' });
  }
  async goto() { await this.page.goto('/login'); }
  async login(u: string, p: string) {
    await this.user.fill(u);
    await this.pass.fill(p);
    await this.submit.click();
  }
}
```

### Important questions (with answers)

**Q:** POM vs fixtures?

**A:** POM organizes UI; fixtures wire lifecycle — often combined.

**Q:** Where assertions?

**A:** In spec files; POM may return locators for expect.

**Q:** Private locators?

**A:** Expose only actions users care about.

**Q:** Inheritance?

**A:** BasePage with common nav — use sparingly.

**Q:** Maintain when?

**A:** UI changes — update one POM file.

### Revision notes

- One page class per route/screen
- Locators as readonly fields
- Tests read like Gherkin
- No expect in POM (team choice)

### Real-time mini-project: Refactor Heroku login to POM

LoginPage class + 1-line test.

**Answer / solution:**


```typescript
class LoginPage {
  constructor(private page) {}
  async open() { await this.page.goto('https://the-internet.herokuapp.com/login'); }
  async login(u, p) {
    await this.page.getByLabel('Username').fill(u);
    await this.page.getByLabel('Password').fill(p);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
test('pom login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login('student', 'SuperSecretPassword!');
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
});
```


## Day 22: Data-driven tests

**Estimated time:** 2.5 hours

### Learning objectives

- Loop cases with test() or test.describe
- Externalize data JSON/CSV
- Parameterize expected results

### Key concepts (simple explanations)

**for-each test** — Each case is independent test in report.

**test.describe + table** — Readable matrix of inputs.

**fixtures with data** — Load JSON once per worker.

**tag invalid cases** — Negative tests with clear names.

### Hands-on example


```javascript
const users = [
  { name: 'valid', user: 'student', pass: 'SuperSecretPassword!', ok: true },
  { name: 'bad pass', user: 'student', pass: 'wrong', ok: false },
];

for (const u of users) {
  test(`login ${u.name}`, async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.getByLabel('Username').fill(u.user);
    await page.getByLabel('Password').fill(u.pass);
    await page.getByRole('button', { name: 'Login' }).click();
    if (u.ok) await expect(page.getByText('secure area')).toBeVisible();
    else await expect(page.getByText('Your password is invalid!')).toBeVisible();
  });
}
```

### Important questions (with answers)

**Q:** One test per row?

**A:** Better isolation in reports.

**Q:** CSV?

**A:** Parse in globalSetup or import json.

**Q:** Secrets in data?

**A:** Use env vars for passwords.

**Q:** 50+ rows?

**A:** Split files or use test.describe.parallel.

**Q:** Snapshot per case?

**A:** Name includes case id.

### Revision notes

- Descriptive test names from data
- Positive + negative pairs
- JSON in test-data/
- Avoid shared mutable case state

### Real-time mini-project: Login matrix

3 invalid + 1 valid login cases.

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

const cases = [
  { title: 'valid', user: 'student', pass: 'SuperSecretPassword!', error: null },
  { title: 'wrong password', user: 'student', pass: 'bad', error: 'Your password is invalid!' },
  { title: 'wrong user', user: 'nobody', pass: 'SuperSecretPassword!', error: 'Your username is invalid!' },
  { title: 'empty username', user: '', pass: 'SuperSecretPassword!', error: 'Your username is invalid!' },
];

for (const c of cases) {
  test(`login matrix: ${c.title}`, async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    if (c.user) await page.getByLabel('Username').fill(c.user);
    if (c.pass) await page.getByLabel('Password').fill(c.pass);
    await page.getByRole('button', { name: 'Login' }).click();
    if (c.error) await expect(page.getByText(c.error)).toBeVisible();
    else await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  });
}
```


## Day 23: Parallelism & sharding

**Estimated time:** 2.5 hours

### Learning objectives

- Configure workers and fullyParallel
- Shard in CI: --shard=1/4
- Isolate tests — no shared DB rows

### Key concepts (simple explanations)

**workers** — Parallel test files; default ~50% cores.

**fullyParallel** — Tests inside file run parallel too.

**shard** — Split suite across machines for speed.

**test.describe.serial** — When sharing one resource.

### Hands-on example


```bash
npx playwright test --workers=4
npx playwright test --shard=2/4
```

### Important questions (with answers)

**Q:** Flakes when parallel?

**A:** Shared data collision — unique IDs per test.

**Q:** One worker debug?

**A:** --workers=1 for ordering issues.

**Q:** CI matrix?

**A:** One job per shard + merge reports.

**Q:** Database?

**A:** Transaction per test or container per job.

**Q:** Rate limit?

**A:** Throttle workers or mock API.

### Revision notes

- Unique test data per run
- shard in large suites
- serial only as last resort
- merge blob reports in CI

### Real-time mini-project: Parallel-safe IDs

Use random email per test when creating users.

**Answer / solution:**


```javascript
test('create user', async ({ page }) => {
  const email = `user_${Date.now()}@test.com`;
  // use email in form...
});
```


## Day 24: Visual regression

**Estimated time:** 2.5 hours

### Learning objectives

- Baseline screenshots with toHaveScreenshot
- Update baselines deliberately
- Mask dynamic regions

### Key concepts (simple explanations)

**toHaveScreenshot** — Compares to snapshot in snapshots/ folder.

**maxDiffPixelRatio** — Allow minor rendering variance.

**animations** — Disable CSS animations in test env for stability.

**Docker for CI** — Same OS/fonts as baseline generator.

### Hands-on example


```javascript
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100,
  mask: [page.locator('.clock')],
});
```

### Important questions (with answers)

**Q:** First run?

**A:** Creates baseline — review before commit.

**Q:** Update flag?

**A:** `--update-snapshots` locally only.

**Q:** Component vs page?

**A:** Both supported; clip region for widget.

**Q:** Flaky visual?

**A:** Font loading — wait for fonts or use webfont mock.

**Q:** Dark mode?

**A:** Separate baselines per theme project.

### Revision notes

- Commit baselines in git
- Mask dates and avatars
- Same browser project as baseline
- Review visual diffs in PR

### Real-time mini-project: Heroku login visual

Baseline screenshot of login page.

**Answer / solution:**


```javascript
test('login visual', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await expect(page).toHaveScreenshot('heroku-login.png');
});
```


## Day 25: Mobile & device emulation

**Estimated time:** 2.5 hours

### Learning objectives

- Use devices from @playwright/test
- Touch taps and viewport
- Separate mobile project in config

### Key concepts (simple explanations)

**devices['iPhone 13']** — Viewport, userAgent, isMobile, hasTouch.

**tap()** — Touch equivalent of click for mobile.

**orientation** — landscape via viewport size.

**responsive** — Same test two projects desktop + mobile.

### Hands-on example


```typescript
projects: [
  { name: 'mobile', use: { ...devices['Pixel 5'] } },
],
```

### Important questions (with answers)

**Q:** Real device?

**A:** Playwright is emulation; BrowserStack for real hardware.

**Q:** Hamburger menu?

**A:** tap icon; wait for nav drawer.

**Q:** Hover on mobile?

**A:** No hover — design for tap.

**Q:** geo?

**A:** geolocation in context options.

**Q:** Slow 3G?

**A:** emulate network conditions via CDP if needed.

### Revision notes

- mobile project in CI
- tap not click for touch targets
- Assert no horizontal scroll
- Test critical flows on mobile

### Real-time mini-project: Mobile viewport smoke

Run example.com with Pixel 5 project.

**Answer / solution:**


```javascript
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

test('mobile example', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
});
```


## Day 26: Component testing (intro)

**Estimated time:** 2.5 hours

### Learning objectives

- Understand @playwright/experimental-ct-react
- Mount components in isolation
- When CT vs full E2E

### Key concepts (simple explanations)

**Component test** — Fast feedback for UI states without full app boot.

**mount(<Button />)** — Render component with props variants.

**providers** — Wrap with Router/Theme in mount options.

**E2E still needed** — Integration, routing, real API.

### Hands-on example


```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('button', async ({ mount }) => {
  const c = await mount(<Button label="Go" />);
  await c.getByRole('button', { name: 'Go' }).click();
});
```

### Important questions (with answers)

**Q:** Setup CT?

**A:** npm init playwright@latest --ct

**Q:** Vite?

**A:** CT uses Vite under the hood for React.

**Q:** Storybook?

**A:** Alternative; CT runs real browser like E2E.

**Q:** Angular/Vue?

**A:** CT kits exist per framework.

**Q:** Same locators?

**A:** Yes — getByRole works on mounted component.

### Revision notes

- CT for state matrix
- E2E for critical journeys
- Share locators with E2E where possible
- Experimental API — pin version

### Real-time mini-project: Button states

Mount disabled and enabled button; assert behavior.

**Answer / solution:**


```typescript
test('disabled', async ({ mount }) => {
  const c = await mount(<Button disabled label="X" />);
  await expect(c.getByRole('button')).toBeDisabled();
});
```


## Day 27: CI: GitHub Actions

**Estimated time:** 3.0 hours

### Learning objectives

- Install browsers with deps on Ubuntu
- Cache npm and playwright browsers
- Upload report artifact on failure

### Key concepts (simple explanations)

**ubuntu-latest** — Standard CI runner; --with-deps installs system libs.

**fail fast** — Smoke job on PR; full suite on main.

**secrets** — BASE_URL, TEST_USER in GitHub secrets.

**sharding** — matrix strategy 1..4 shards.

### Hands-on example


```yaml
name: Playwright
on: [push, pull_request]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Important questions (with answers)

**Q:** Why install --with-deps?

**A:** Headless Chrome needs OS libraries on Linux.

**Q:** Retries in CI?

**A:** 2 retries common for network flakes.

**Q:** Scheduled run?

**A:** cron for nightly full regression.

**Q:** PR comment?

**A:** Third-party actions post report link.

**Q:** Docker image?

**A:** mcr.microsoft.com/playwright for preinstalled browsers.

### Revision notes

- Always upload report on failure
- forbidOnly in CI config
- Parallel shards for speed
- Separate env staging URL

### Real-time mini-project: CI pipeline for lab repo

Add workflow file to pw-30-day-lab and get green build.

**Answer / solution:**


```yaml
# .github/workflows/playwright.yml
name: Playwright tests
on: [push, pull_request]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```


## Day 28: Reporting & Allure

**Estimated time:** 2.5 hours

### Learning objectives

- HTML reporter defaults
- Add Allure or junit for dashboards
- test.step for hierarchy

### Key concepts (simple explanations)

**list + html** — Local list; HTML for drill-down.

**allure-playwright** — Rich trends, categories, history.

**junit.xml** — CI systems parse for pass/fail gates.

**test.step** — Nested steps in report timeline.

### Hands-on example


```javascript
test('checkout', async ({ page }) => {
  await test.step('add to cart', async () => {
    await page.getByRole('button', { name: 'Add' }).click();
  });
  await test.step('pay', async () => {
    await page.getByRole('button', { name: 'Pay' }).click();
  });
});
```

### Important questions (with answers)

**Q:** Attachments?

**A:** screenshots, logs via test.info().attach.

**Q:** Merge reports?

**A:** blob reporter + merge-reports CLI.

**Q:** Slack notify?

**A:** Webhook on failure post-processing.

**Q:** Trace in Allure?

**A:** Attach trace link manually.

**Q:** Who reads report?

**A:** Devs want trace; PM wants steps.

### Revision notes

- test.step for long flows
- blob for sharded CI
- Category tags in Allure
- Keep step names business-readable

### Real-time mini-project: Step-based login test

Refactor Heroku login with test.step.

**Answer / solution:**


```javascript
test('login steps', async ({ page }) => {
  await test.step('open', async () => {
    await page.goto('https://the-internet.herokuapp.com/login');
  });
  await test.step('credentials', async () => {
    await page.getByLabel('Username').fill('student');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
  });
  await test.step('submit', async () => {
    await page.getByRole('button', { name: 'Login' }).click();
  });
  await expect(page.getByText('secure area')).toBeVisible();
});
```


## Day 29: Performance & stability

**Estimated time:** 2.5 hours

### Learning objectives

- Identify flake root causes
- Use retries wisely
- Quarantine flaky tests

### Key concepts (simple explanations)

**flake** — Non-deterministic fail — usually timing or data.

**quarantine** — test.fixme + ticket; run in nightly only.

**test timeout** — Increase only after fixing slow backend.

**metrics** — Track pass rate per test over time.

### Hands-on example


```javascript
// playwright.config.ts — trace helps find flakes
use: { trace: 'on-first-retry' },
retries: process.env.CI ? 2 : 0,
```

### Important questions (with answers)

**Q:** Retry hides bugs?

**A:** Yes if overused — fix root cause.

**Q:** Shared env?

**A:** Staging refresh breaks tests — version data.

**Q:** Clock?

**A:** mock Date for time-sensitive UI.

**Q:** Animations?

**A:** prefers-reduced-motion in test CSS.

**Q:** Load test?

**A:** Not Playwright's job — use k6/Locust.

### Revision notes

- Flake log in team wiki
- Zero tolerance for test.only in main
- Stabilize locators first
- Nightly full + PR smoke

### Real-time mini-project: Stabilize dynamic test

Replace sleep with expect in dynamic loading test.

**Answer / solution:**


```javascript
// Bad: await page.waitForTimeout(5000);
await expect(page.getByText('Hello World!')).toBeVisible({ timeout: 15000 });
```


## Day 30: Capstone: Full E2E suite

**Estimated time:** 4.0 hours

### Learning objectives

- Design suite for a small LMS or e-commerce demo
- Combine POM, API setup, auth, CI
- Document how to run smoke vs full

### Key concepts (simple explanations)

**test pyramid** — Many unit/component, fewer E2E — but E2E catch integration gaps.

**critical path** — Login, browse, purchase/enroll, logout.

**env strategy** — docker-compose up for local; ephemeral preview for PR.

**maintenance** — Review failures weekly; delete obsolete tests.

### Hands-on example


```typescript
// tests/smoke/critical.spec.ts — @smoke
// tests/regression/ — full
// pages/, fixtures/, test-data/
// .github/workflows/playwright.yml
```

### Important questions (with answers)

**Q:** How many E2E?

**A:** Enough to cover revenue paths — not every field.

**Q:** Data cleanup?

**A:** API teardown or isolated tenant.

**Q:** Preview URL?

**A:** Vercel comment bot runs against PR URL.

**Q:** Ownership?

**A:** Team owns suite — not solo QA.

**Q:** Done definition?

**A:** Green CI + documented README.

### Revision notes

- README: install, test, debug
- smoke < 5 min
- POM for main pages
- auth via globalSetup

### Real-time mini-project: Final capstone: Sauce Demo checkout

Full flow on https://www.saucedemo.com/ — login, add items, checkout, finish.

**Answer / solution:**


```javascript
import { test, expect } from '@playwright/test';

test('sauce demo checkout @smoke', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByText('Sauce Labs Backpack').click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: '1' }).click(); // cart badge
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('10001');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Finish' }).click();

  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});
```


## Appendix A: Capstone Projects (Full Answers)


### Project 1 — Login + logout (Days 3–6)

**Goal:** Stable login flow with POM-ready locators.


```typescript
import { test, expect } from '@playwright/test';

test('login logout', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('You logged out of the secure area!')).toBeVisible();
});
```


### Project 2 — Mock API + UI (Day 12–18)

**Goal:** UI shows mocked list when API is stubbed.


```typescript
test('mocked items', async ({ page }) => {
  await page.route('**/api/products', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Playwright Book' }]),
    });
  });
  await page.goto('http://localhost:3000/products');
  await expect(page.getByText('Playwright Book')).toBeVisible();
});
```


### Project 3 — Auth storage reuse (Day 19)

**global-setup.ts** logs in once; tests use `storageState`.


```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Email').fill('admin@test.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}
export default globalSetup;
```


### Project 4 — Page Object Model checkout (Day 21)


```typescript
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly submit: Locator;
  constructor(page: Page) {
    this.page = page;
    this.submit = page.getByRole('button', { name: 'Place order' });
  }
  async goto() { await this.page.goto('/checkout'); }
  async placeOrder() {
    await this.submit.click();
    await this.page.getByText('Thank you').waitFor();
  }
}
```


### Project 5 — CI GitHub Action (Day 27)


```yaml
name: Playwright
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```


### Project 6 — Final LMS-style E2E (Day 30)

**Scenario:** Admin logs in → opens course list → creates course → learner enrolls → sees certificate.

Use: baseURL, storageState for admin vs learner, API seed in globalSetup, `test.step` for reporting.


```typescript
import { test, expect } from '@playwright/test';
import { AdminCoursesPage } from './pages/AdminCoursesPage';

test.describe('LMS flow', () => {
  test('admin creates course, learner sees it', async ({ browser }) => {
    const adminContext = await browser.newContext({ storageState: 'admin.json' });
    const adminPage = await adminContext.newPage();
    const courses = new AdminCoursesPage(adminPage);
    await courses.createCourse('Playwright 101', 'E2E basics');
    await adminContext.close();

    const learnerContext = await browser.newContext({ storageState: 'learner.json' });
    const learnerPage = await learnerContext.newPage();
    await learnerPage.goto('/courses');
    await expect(learnerPage.getByRole('heading', { name: 'Playwright 101' })).toBeVisible();
    await learnerContext.close();
  });
});
```


## Appendix B: Revision Master Sheet


- **Locator priority:** Role → Label → Placeholder → Text → TestId → CSS  
- **Never:** naked `sleep` / `waitForTimeout` as first fix  
- **Always:** web-first `expect` matchers  
- **CI:** retries + trace on first retry + upload report on failure  
- **Auth:** globalSetup + storageState  
- **Maintainability:** POM + fixtures + stable test data  

### Exam-style cram (20 questions)

1. What is auto-waiting? → Actions retry until element is ready.  
2. Strict mode? → Locator must match exactly one element.  
3. `fill` vs `type`? → `fill` sets value; `type`/`pressSequentially` simulates keys.  
4. `route.fulfill`? → Mock network response.  
5. `storageState`? → Persist cookies/localStorage for reuse.  
6. `test.extend`? → Custom fixtures.  
7. `toHaveScreenshot`? → Visual regression.  
8. `frameLocator`? → Scope to iframe.  
9. `waitForEvent('download')`? → Capture download.  
10. Sharding? → Split suite across CI machines.  
11. `projects` in config? → Multiple browsers/devices.  
12. `baseURL`? → Relative navigation in tests.  
13. `trace: 'on-first-retry'`? → Debug flakes in CI.  
14. `expect.soft`? → Non-blocking assertions.  
15. `getByRole('button', { name })`? → Accessible button locator.  
16. `page.request`? → API calls sharing cookies.  
17. `globalSetup`? → Run once before all tests.  
18. `test.step`? → Report hierarchy.  
19. Why POM? → Single place to update selectors.  
20. Flake fix order? → Locator → assertion → wait condition → timeout last.  

---
*End of guide. Good luck — consistency beats intensity.*
