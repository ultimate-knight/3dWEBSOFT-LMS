#!/usr/bin/env python3
"""Generate Playwright 30-Day Study Guide (Markdown + PDF)."""

from pathlib import Path
from textwrap import dedent

from detailed_content import all_detailed_days

OUT_DIR = Path(__file__).resolve().parent
MD_PATH = OUT_DIR / "Playwright-30-Day-Complete-Guide.md"
PDF_PATH = OUT_DIR / "Playwright-30-Day-Complete-Guide.pdf"


def section(title: str, level: int = 2) -> str:
    return f"\n{'#' * level} {title}\n\n"


def code(lang: str, body: str) -> str:
    return f"\n```{lang}\n{body.strip()}\n```\n\n"


DAYS = []


def day(
    n: int,
    title: str,
    time_h: float,
    objectives: list[str],
    concepts: list[tuple[str, str]],
    example: str,
    questions: list[tuple[str, str]],
    revision: list[str],
    mini_project: tuple[str, str, str] | None = None,
):
    DAYS.append(
        {
            "n": n,
            "title": title,
            "time_h": time_h,
            "objectives": objectives,
            "concepts": concepts,
            "example": example,
            "questions": questions,
            "revision": revision,
            "mini_project": mini_project,
        }
    )


# --- Day definitions (30 days) ---
day(
    1,
    "Why Playwright & Environment Setup",
    2.0,
    [
        "Understand what Playwright is and when to use it",
        "Install Node.js, VS Code, and Playwright Test",
        "Run your first passing test",
    ],
    [
        (
            "End-to-end (E2E) testing",
            "Automating a real browser to click, type, and verify UI behavior like a user would.",
        ),
        (
            "Playwright Test runner",
            "Built-in test framework with fixtures, parallel runs, retries, traces, and HTML reports.",
        ),
        (
            "Cross-browser",
            "Chromium, Firefox, and WebKit from one API; projects in config map to browsers.",
        ),
        (
            "Auto-waiting",
            "Playwright waits for elements to be actionable before acting, reducing flaky sleeps.",
        ),
    ],
    code(
        "bash",
        """
# New project
mkdir pw-study && cd pw-study
npm init -y
npm init playwright@latest
# Choose: TypeScript or JavaScript, tests folder, GitHub Actions optional

npx playwright test
npx playwright test --ui
""",
    )
    + code(
        "javascript",
        """
// tests/example.spec.js
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
""",
    ),
    [
        (
            "What problem does Playwright solve compared to manual QA?",
            "It repeats consistent user flows quickly, catches regressions early, and runs in CI on every commit.",
        ),
        (
            "Name three browsers Playwright supports out of the box.",
            "Chromium, Firefox, and WebKit.",
        ),
        (
            "What is the difference between `page.click` and a raw DOM click in brittle scripts?",
            "Playwright auto-waits for visibility, stability, and enabled state; raw clicks often race the UI.",
        ),
    ],
    [
        "Install: `npm init playwright@latest`",
        "Run: `npx playwright test`, debug: `--ui`, `--debug`",
        "Test file pattern: `*.spec.ts` / `*.spec.js`",
        "Fixtures: `page`, `context`, `browser` injected by test runner",
    ],
    (
        "Mini-Project 1: Smoke test your favorite public site",
        "Write one test that opens a site, checks the title, and asserts one visible heading.",
        code(
            "javascript",
            """
import { test, expect } from '@playwright/test';

test('site smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
""",
        ),
    ),
)

day(
    2,
    "Test Anatomy, Fixtures & Basic Navigation",
    2.0,
    [
        "Read Playwright test structure: describe, test, hooks",
        "Use `page.goto`, `page.url`, navigation options",
        "Understand test isolation (fresh context per test)",
    ],
    [
        ("test vs test.describe", "`test` is one case; `describe` groups related cases and shared hooks."),
        ("async/await", "Every browser action returns a Promise; always await Playwright calls."),
        ("baseURL", "Set in config so `goto('/login')` resolves to your app root."),
        ("test.info()", "Metadata like title, project, retry index for logging and attachments."),
    ],
    code(
        "javascript",
        """
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('lands on home', async ({ page }) => {
    await expect(page).toHaveURL(/\\/$/);
  });
});
""",
    ),
    [
        ("Why is each test isolated?", "Fresh browser context prevents cookie/storage leakage between tests."),
        ("What does `waitUntil: 'networkidle'` do?", "Waits until no network connections for ~500ms (use sparingly)."),
        ("When use `page.goto` vs `page.reload`?", "`goto` for new URL; `reload` to refresh current page."),
    ],
    [
        "Default timeout: action 0 uses expect timeout (often 5s)",
        "Prefer `toHaveURL` over manual string compares",
        "Use `test.describe` + `beforeEach` for shared setup",
    ],
    (
        "Mini-Project 2: Multi-page navigation",
        "Test that clicking 'More information' on example.com opens the IANA page.",
        code(
            "javascript",
            """
import { test, expect } from '@playwright/test';

test('follow link', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'More information...' }).click();
  await expect(page).toHaveURL(/iana\\.org/);
});
""",
        ),
    ),
)

day(
    3,
    "Locators: getByRole & Accessible Queries",
    2.5,
    [
        "Prefer user-facing locators (role, label, text)",
        "Chain and filter locators",
        "Understand strict mode (single match)",
    ],
    [
        ("getByRole", "Maps to ARIA roles: button, link, textbox, heading — mirrors how assistive tech sees the page."),
        ("getByLabel", "Finds inputs associated with a <label> or aria-label."),
        ("getByPlaceholder / getByText", "Fallbacks when roles are weak; text should be stable."),
        ("locator.first() / nth()", "Escape hatch when multiple matches; fix UI duplication when possible."),
    ],
    code(
        "javascript",
        """
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
""",
    ),
    [
        ("Why prefer getByRole over CSS #id?", "IDs change; roles reflect user-meaningful elements and survive refactors better."),
        ("What error does strict mode cause?", "Playwright throws if a locator resolves to more than one element."),
        ("How to click the second 'Edit' button?", "Use `.nth(1)` or filter by parent row: `row.getByRole('button', { name: 'Edit' })`."),
    ],
    [
        "Order: Role → Label → Placeholder → Text → Test id",
        "Use `{ name: '...' }` exact or regex",
        "Debug: `await page.getByRole('button').all()` in UI mode",
    ],
    (
        "Mini-Project 3: Login form locators (practice site)",
        "Automate login on https://the-internet.herokuapp.com/login (student / SuperSecretPassword!).",
        code(
            "javascript",
            """
import { test, expect } from '@playwright/test';

test('heroku login', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
});
""",
        ),
    ),
)

day(
    4,
    "CSS, XPath, test ids & Custom Locators",
    2.0,
    ["Use data-testid responsibly", "Combine locators with and/or", "Build reusable locator helpers"],
    [
        ("page.locator('css')", "Powerful but brittle; use for shadow DOM or legacy apps."),
        ("getByTestId", "Reads `data-testid`; contract between dev and QA."),
        ("filter()", "Narrows locators: `page.getByRole('listitem').filter({ hasText: 'Due' })`."),
        ("locator.or()", "Try alternative locators when UI varies."),
    ],
    code(
        "javascript",
        """
const row = page.getByRole('row').filter({ hasText: 'Invoice #42' });
await row.getByRole('button', { name: 'Pay' }).click();
""",
    ),
    [
        ("When is CSS acceptable?", "Shadow roots, canvas, or no semantic HTML — document why."),
        ("What is `data-testid` convention?", "Stable hook not tied to styling; e.g. `data-testid=checkout-submit`."),
        ("Difference filter vs has?", "`filter({ has: locator })` requires child locator inside."),
    ],
    ["testid config: `testIdAttribute: 'data-test-id'`", "Avoid XPath unless unavoidable"],
    (
        "Mini-Project 4: Table row action",
        "On a demo table page, click action in a specific row (use filter/hasText).",
        code(
            "javascript",
            """
import { test, expect } from '@playwright/test';

test('sortable table row action', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/tables');
  const table = page.getByRole('table');
  const target = table.getByRole('row').filter({ hasText: 'Action' }).first();
  await expect(target).toBeVisible();
  await target.getByRole('link', { name: 'edit' }).click();
  await expect(page).toHaveURL(/tables/);
});
""",
        ),
    ),
)

day(
    5,
    "Assertions & expect Polling",
    2.5,
    [
        "Use web-first assertions (auto-retry)",
        "Soft assertions when collecting multiple checks",
        "Negation and custom messages",
    ],
    [
        ("expect(locator).toBeVisible()", "Retries until timeout; preferred over manual wait + assert."),
        ("toHaveText / toContainText", "String or regex; whitespace can matter — use regex for flexibility."),
        ("expect.poll()", "Custom async polling for non-locator state."),
        ("expect.soft()", "Continues test after failure; useful for audit-style checks."),
    ],
    code(
        "javascript",
        """
await expect(page.getByRole('alert')).toHaveText('Saved');
await expect(page.getByTestId('score')).toHaveText(/\\d+/);
await expect.poll(async () => {
  const r = await page.request.get('/api/status');
  return r.ok();
}).toBeTruthy();
""",
    ),
    [
        ("Why not use `expect(await el.isVisible()).toBe(true)`?", "No retry — race conditions cause flakes."),
        ("Default expect timeout?", "5 seconds (configurable via `expect: { timeout }`)."),
        ("When use soft assertions?", "Bulk UI validation where you want all failures in one run."),
    ],
    ["Matchers: visible, enabled, checked, value, attribute, count", "Use `not` for negative cases"],
    (
        "Mini-Project 5: Assert dashboard widgets",
        "After login, assert 3 widgets visible with expected labels.",
        code(
            "javascript",
            """
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
""",
        ),
    ),
)

DAYS.extend(all_detailed_days())


CAPSTONE = section("Appendix A: Capstone Projects (Full Answers)", 2) + dedent(
    """
### Project 1 — Login + logout (Days 3–6)

**Goal:** Stable login flow with POM-ready locators.

"""
) + code(
    "typescript",
    """
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
""",
) + dedent(
    """
### Project 2 — Mock API + UI (Day 12–18)

**Goal:** UI shows mocked list when API is stubbed.

"""
) + code(
    "typescript",
    """
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
""",
) + dedent(
    """
### Project 3 — Auth storage reuse (Day 19)

**global-setup.ts** logs in once; tests use `storageState`.

"""
) + code(
    "typescript",
    """
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
""",
) + dedent(
    """
### Project 4 — Page Object Model checkout (Day 21)

"""
) + code(
    "typescript",
    """
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
""",
) + dedent(
    """
### Project 5 — CI GitHub Action (Day 27)

"""
) + code(
    "yaml",
    """
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
""",
) + dedent(
    """
### Project 6 — Final LMS-style E2E (Day 30)

**Scenario:** Admin logs in → opens course list → creates course → learner enrolls → sees certificate.

Use: baseURL, storageState for admin vs learner, API seed in globalSetup, `test.step` for reporting.

"""
) + code(
    "typescript",
    """
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
""",
)


SCHEDULE = section("30-Day Study Schedule (Realistic)", 2) + dedent(
    """
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
"""
)

for d in DAYS:
    SCHEDULE += f"| {d['n']} | {d['title']} | {d['time_h']}h |\n"

SCHEDULE += "\n"


def render_day(d: dict) -> str:
    out = section(f"Day {d['n']}: {d['title']}", 2)
    out += f"**Estimated time:** {d['time_h']} hours\n\n"
    out += "### Learning objectives\n\n"
    for o in d["objectives"]:
        out += f"- {o}\n"
    out += "\n### Key concepts (simple explanations)\n\n"
    for name, expl in d["concepts"]:
        out += f"**{name}** — {expl}\n\n"
    out += "### Hands-on example\n\n" + d["example"]
    out += "### Important questions (with answers)\n\n"
    for q, a in d["questions"]:
        out += f"**Q:** {q}\n\n**A:** {a}\n\n"
    out += "### Revision notes\n\n"
    for r in d["revision"]:
        out += f"- {r}\n"
    out += "\n"
    if d["mini_project"]:
        title, brief, solution = d["mini_project"]
        out += f"### Real-time mini-project: {title}\n\n{brief}\n\n**Answer / solution:**\n\n{solution}"
    return out


INTRO = dedent(
    """
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
"""
)


def build_markdown() -> str:
    body = INTRO + SCHEDULE
    for d in DAYS:
        body += render_day(d)
    body += CAPSTONE
    body += section("Appendix B: Revision Master Sheet", 2)
    body += dedent(
        """
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
"""
    )
    return body


def main():
    md = build_markdown()
    MD_PATH.write_text(md, encoding="utf-8")
    print(f"Wrote {MD_PATH} ({len(md):,} chars)")


if __name__ == "__main__":
    main()
