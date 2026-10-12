"""Rich day-by-day content for Playwright 30-day guide (Days 6–30)."""

from textwrap import dedent


def code(lang, body):
    return f"\n```{lang}\n{body.strip()}\n```\n\n"


def d(
    n,
    title,
    time_h,
    objectives,
    concepts,
    example,
    questions,
    revision,
    project_title,
    project_brief,
    project_answer,
):
    return {
        "n": n,
        "title": title,
        "time_h": time_h,
        "objectives": objectives,
        "concepts": concepts,
        "example": example,
        "questions": questions,
        "revision": revision,
        "mini_project": (project_title, project_brief, project_answer),
    }


def all_detailed_days():
    days = []

    days.append(
        d(
            6,
            "Hooks, Tags & Test Organization",
            2.0,
            [
                "Use beforeEach / afterEach for shared setup and teardown",
                "Apply test.describe for logical grouping",
                "Run subsets with tags and --grep",
                "Skip or mark broken tests with test.skip and test.fixme",
            ],
            [
                ("beforeEach", "Runs before every test in the describe block — ideal for navigation to a starting page."),
                ("afterEach", "Cleanup: delete test data, reset mocks; runs even if test fails."),
                ("test.describe.configure", "Set mode: parallel vs serial when tests share state."),
                ("Annotations @smoke", "Tags in title or test.info().annotations; filter in CI for fast smoke runs."),
            ],
            code(
                "javascript",
                """
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
""",
            ),
            [
                (
                    "When should tests run serially?",
                    "When they mutate shared backend state or depend on order (prefer isolated data instead).",
                ),
                (
                    "Difference between test.skip and test.fixme?",
                    "`skip` is intentional; `fixme` signals known product/test bug to fix later.",
                ),
                ("Can hooks be async?", "Yes — always await async setup (DB seed, login)."),
                (
                    "How to run only one file?",
                    "`npx playwright test tests/login.spec.ts`",
                ),
                (
                    "Why group with describe?",
                    "Shared hooks, readable reports, and scoped configuration.",
                ),
            ],
            [
                "Structure: `describe` → `beforeEach` → `test`",
                "Tag smoke tests for PR checks",
                "Avoid serial unless necessary",
                "Name tests: behavior + expected outcome",
            ],
            "Organize Herokuapp smoke suite",
            "Create a describe block with 3 tagged tests: headings, links, and footer.",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            7,
            "playwright.config.ts Deep Dive",
            2.5,
            [
                "Configure baseURL, timeouts, and reporters",
                "Define browser projects (chromium, firefox, webkit)",
                "Set retries and trace for CI",
                "Understand `use` vs project-level overrides",
            ],
            [
                ("defineConfig", "Central place for testDir, workers, globalSetup, and expect defaults."),
                ("projects[]", "Each project is a browser/device profile; same tests run per project."),
                ("use.baseURL", "Enables `page.goto('/login')` without hardcoding host."),
                ("trace / screenshot / video", "Artifacts on failure: `trace: 'on-first-retry'` balances speed and debuggability."),
            ],
            code(
                "typescript",
                """
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
""",
            ),
            [
                ("What does forbidOnly do in CI?", "Fails build if `test.only` left in code — prevents accidental focused runs."),
                ("How to run only chromium?", "`npx playwright test --project=chromium`"),
                ("Where set global timeout?", "`timeout: 60000` at config root (per test)."),
                ("ENV in config?", "Use `process.env.BASE_URL` for staging vs prod."),
                ("workers locally vs CI?", "Local: CPU cores; CI: often 2–4 to avoid OOM."),
            ],
            [
                "Never commit secrets in config — use env vars",
                "baseURL + relative goto = portable tests",
                "HTML report: `npx playwright show-report`",
                "Match retries to pipeline stability goals",
            ],
            "Config lab: multi-project",
            "Add a `smoke` project that only runs tests matching @smoke (use grep in npm script).",
            code(
                "json",
                """
// package.json scripts
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke --project=chromium"
  }
}
""",
            ),
        )
    )

    days.append(
        d(
            8,
            "Debugging: UI Mode, Trace Viewer, Inspector",
            2.0,
            [
                "Debug failing tests with --debug and Inspector",
                "Use UI Mode to pick locators and watch steps",
                "Read traces: actions, network, console, snapshots",
            ],
            [
                ("UI Mode", "Interactive runner: time travel, watch locators, edit and re-run."),
                ("Inspector", "Step-through with highlight; opens with PWDEBUG=1 or --debug."),
                ("Trace Viewer", "Post-mortem timeline; open zip from report or `show-trace`."),
                ("page.pause()", "Temporary breakpoint in code during local debug only."),
            ],
            code(
                "bash",
                """
npx playwright test tests/login.spec.ts --ui
npx playwright test --debug
npx playwright show-trace test-results/.../trace.zip
""",
            ),
            [
                ("First step when a test fails in CI?", "Download trace from artifact → find failing action → fix locator/wait."),
                ("What is actionability?", "Element visible, stable, enabled, not obscured — shown in trace."),
                ("How to log locator count?", "`console.log(await page.getByRole('button').count())` in headed mode."),
                ("Danger of page.pause()?", "Never merge to main — blocks CI."),
                ("UI Mode vs debug?", "UI Mode for exploration; debug for stepping one test."),
            ],
            [
                "Re-run single test: `-g \"test name\"`",
                "Trace on first retry catches flakes",
                "Use Pick Locator in UI mode",
                "Compare screenshot in trace to expected UI",
            ],
            "Debug a failing locator",
            "Intentionally wrong locator, run --ui, fix using Pick Locator.",
            code(
                "javascript",
                """
// Wrong on purpose — fix in UI mode
test('debug me', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByRole('button', { name: 'Log in' }).click(); // fix name to 'Login'
});
""",
            ),
        )
    )

    days.append(
        d(
            9,
            "Filling Forms: text, password, textarea",
            2.0,
            [
                "Use fill for inputs and textareas",
                "Tab order and keyboard navigation",
                "Clear and re-fill patterns",
            ],
            [
                ("fill()", "Sets value directly — fastest and least flaky for standard inputs."),
                ("pressSequentially()", "Character-by-character; use for inputs that validate per keystroke."),
                ("keyboard.press", "Enter to submit, Tab to move focus, shortcuts with modifiers."),
                ("inputValue()", "Read current value for assertions."),
            ],
            code(
                "javascript",
                """
await page.getByLabel('Username').fill('student');
await page.getByLabel('Password').fill('secret');
await page.keyboard.press('Enter');
await expect(page.getByLabel('Username')).toHaveValue('student');
""",
            ),
            [
                ("fill vs type (deprecated)?", "Prefer fill; type was removed in favor of pressSequentially."),
                ("How to append text?", "read value then fill combined, or click end + pressSequentially."),
                ("Contenteditable?", "Use locator.fill if supported or keyboard typing."),
                ("Password fields?", "Same as text; never log values in CI output."),
                ("Disabled field?", "Action fails — assert toBeDisabled first."),
            ],
            [
                "getByLabel for form fields",
                "Submit with button click or Enter",
                "Assert with toHaveValue",
                "Avoid focusing via brittle CSS",
            ],
            "Registration form",
            "Fill all fields on https://demoqa.com/automation-practice-form (sample subset).",
            code(
                "javascript",
                """
import { test, expect } from '@playwright/test';

test('practice form partial', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.getByPlaceholder('First Name').fill('Ada');
  await page.getByPlaceholder('Last Name').fill('Lovelace');
  await page.getByPlaceholder('name@example.com').fill('ada@example.com');
  await expect(page.getByPlaceholder('First Name')).toHaveValue('Ada');
});
""",
            ),
        )
    )

    days.append(
        d(
            10,
            "Checkboxes, Radios, Selects & Custom dropdowns",
            2.5,
            [
                "check/uncheck and expect checked state",
                "selectOption on native selects",
                "Click combobox + option for custom UI",
            ],
            [
                ("check() / uncheck()", "For checkbox inputs; asserts state with toBeChecked."),
                ("selectOption", "By value, label, or index on <select>."),
                ("combobox pattern", "Role combobox opens listbox/options in React/MUI/Angular."),
                ("force: true", "Bypass actionability — last resort; fix overlay instead."),
            ],
            code(
                "javascript",
                """
await page.getByRole('checkbox', { name: 'Accept terms' }).check();
await page.getByLabel('Country').selectOption({ label: 'India' });
await page.getByRole('combobox', { name: 'City' }).click();
await page.getByRole('option', { name: 'Delhi' }).click();
""",
            ),
            [
                ("How to assert radio selected?", "toBeChecked on the radio locator."),
                ("Multi-select?", "selectOption with array of values."),
                ("Why combobox click fails?", "Option list in portal — wait for option visible."),
                ("indeterminate checkbox?", "May need evaluate — rare; prefer explicit UI state."),
                ("Custom select ant design?", "Often getByTitle or getByText for option."),
            ],
            [
                "Native select → selectOption",
                "Custom → combobox + option",
                "Always assert final state",
                "Scroll into view if needed (auto usually handles)",
            ],
            "Heroku checkbox + dropdown",
            "Test checkboxes page and dropdown page on the-internet.herokuapp.com.",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            11,
            "Waiting Strategies",
            2.5,
            [
                "Prefer web-first assertions over manual waits",
                "waitForURL, waitForLoadState, waitForResponse",
                "Avoid waitForTimeout except experiments",
            ],
            [
                ("auto-wait", "Built into click/fill; you rarely need explicit element waits."),
                ("waitForURL", "After navigation or SPA route change — glob or regex pattern."),
                ("waitForResponse", "Gate on API completion before asserting UI."),
                ("waitForFunction", "Custom JS predicate on page when needed."),
            ],
            code(
                "javascript",
                """
await page.getByRole('link', { name: 'Login' }).click();
await page.waitForURL('**/secure');
await page.waitForLoadState('domcontentloaded');
const resp = await page.waitForResponse(r =>
  r.url().includes('/api/me') && r.status() === 200
);
""",
            ),
            [
                ("Why is waitForTimeout bad?", "Fixed delay is always too short or too long — flaky either way."),
                ("load vs networkidle?", "networkidle is discouraged on SPAs with websockets."),
                ("waitForSelector?", "Still valid; prefer expect(locator).toBeVisible()."),
                ("SPA navigation?", "waitForURL or expect URL assertion."),
                ("Parallel click + wait?", "Promise.all([waitForResponse, click])."),
            ],
            [
                "Assertion = wait + check",
                "Pair actions with URL or API wait",
                "Document why any explicit wait exists",
                "Increase timeout only after fixing root cause",
            ],
            "Dynamic loading",
            "Heroku dynamic loading: click Start, wait for finish text.",
            code(
                "javascript",
                """
test('dynamic loading', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading');
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText('Hello World!')).toBeVisible({ timeout: 15000 });
});
""",
            ),
        )
    )

    days.append(
        d(
            12,
            "Network: intercept, mock, HAR",
            2.5,
            [
                "Use page.route to stub or modify traffic",
                "fulfill, continue, abort routes",
                "Test UI when API is slow or erroring",
            ],
            [
                ("page.route", "Pattern match URL; handler receives Route object."),
                ("route.fulfill", "Return mock body/status without hitting server."),
                ("route.continue", "Modify headers/body then pass through."),
                ("route.fetch", "Get real response, then edit and fulfill — partial mock."),
            ],
            code(
                "javascript",
                """
await page.route('**/api/status', async route => {
  await route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'down' }),
  });
});
await page.goto('/status');
await expect(page.getByText('Service unavailable')).toBeVisible();
""",
            ),
            [
                ("Mock vs stub vs spy?", "Mock replaces response; spy records calls; stub provides canned data."),
                ("Order of routes?", "First registered match wins; specific patterns first."),
                ("Test error UI?", "fulfill 500 and assert error banner."),
                ("HAR?", "Record with `recordHar` in config for replay debugging."),
                ("Mobile API?", "Same route API works for any client of those URLs."),
            ],
            [
                "Stub at network layer for fast UI tests",
                "Never mock what you intend to integration-test",
                "Unroute when test done if shared page",
                "Assert request payload with route handler",
            ],
            "Mock JSON on todo app",
            "Use route to return one todo and assert UI (local app or static HTML).",
            code(
                "javascript",
                """
test('mock todos', async ({ page }) => {
  await page.route('**/api/todos', r =>
    r.fulfill({ json: [{ id: 1, title: 'Learn Playwright', completed: false }] })
  );
  await page.goto('http://localhost:3000/todos');
  await expect(page.getByText('Learn Playwright')).toBeVisible();
});
""",
            ),
        )
    )

    days.append(
        d(
            13,
            "Frames & iFrames",
            2.5,
            [
                "Scope actions with frameLocator",
                "Chain locators inside frames",
                "Handle nested frames carefully",
            ],
            [
                ("frameLocator", "Returns Locator scoped to iframe — resilient to frame element changes."),
                ("contentFrame()", "Lower-level; prefer frameLocator for tests."),
                ("iframe loading", "Wait for element inside frame — auto-wait applies inside scope."),
                ("cross-origin", "Cannot access DOM if truly cross-origin — test via UI visible in frame only."),
            ],
            code(
                "javascript",
                """
const frame = page.frameLocator('#myFrame');
await frame.getByRole('button', { name: 'Submit' }).click();
await expect(frame.getByText('Success')).toBeVisible();
""",
            ),
            [
                ("Why tests fail on iframes?", "Locators searched in main document only."),
                ("Nested iframe?", "chain frameLocators: page.frameLocator('#a').frameLocator('#b')"),
                ("Name/id selector?", "page.frameLocator('iframe[name=embed]')"),
                ("Payment iframe?", "Often 3rd party — use visible text in frame scope."),
                ("Detach?", "Re-navigate if frame reloads — get fresh frameLocator."),
            ],
            [
                "Always scope: frameLocator → getByRole",
                "Don't use brittle frame index",
                "Test iframe src loads (optional network wait)",
                "TinyMCE/editor often in iframe",
            ],
            "Heroku WYSIWYG / iframe",
            "TinyMCE editor page uses iframe — type and assert.",
            code(
                "javascript",
                """
test('tinymce iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');
  const editor = page.frameLocator('#mce_0_ifr').locator('body');
  await editor.click();
  await editor.fill('Hello from Playwright');
  await expect(editor).toContainText('Hello from Playwright');
});
""",
            ),
        )
    )

    days.append(
        d(
            14,
            "Multiple tabs & popups",
            2.5,
            [
                "Wait for new Page with context.waitForEvent('page')",
                "Switch between tabs in same context",
                "Close popups and assert opener state",
            ],
            [
                ("BrowserContext", "Isolated session; multiple pages (tabs) share cookies."),
                ("waitForEvent('page')", "Fires when popup/tab opens — pair with click via Promise.all."),
                ("popup.url()", "Assert navigated URL on new page."),
                ("bringToFront()", "Focus tab before interacting."),
            ],
            code(
                "javascript",
                """
const [popup] = await Promise.all([
  page.context().waitForEvent('page'),
  page.getByRole('link', { name: 'Open window' }).click(),
]);
await popup.waitForLoadState();
await expect(popup).toHaveURL(/windows\.net/);
await popup.close();
""",
            ),
            [
                ("target=_blank?", "Usually new page in same context — use waitForEvent."),
                ("window.open?", "Same pattern."),
                ("Different context?", "Rare — login in one context, guest in another."),
                ("How many pages?", "context.pages() length."),
                ("Popup blockers?", "Playwright allows popups by default."),
            ],
            [
                "Promise.all([waitForEvent, action])",
                "Always waitForLoadState on new page",
                "Close popups to avoid leaks",
                "Assert both opener and popup",
            ],
            "Heroku windows",
            "Click link that opens new window; assert heading on popup.",
            code(
                "javascript",
                """
test('new window', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);
  await expect(newPage.getByRole('heading', { name: 'New Window' })).toBeVisible();
  await newPage.close();
});
""",
            ),
        )
    )

    days.append(
        d(
            15,
            "Dialogs: alert, confirm, prompt",
            2.5,
            [
                "Register dialog handler before action",
                "accept / dismiss and read message",
                "Handle prompt input text",
            ],
            [
                ("dialog event", "Fires for alert, confirm, prompt — must handle or test hangs."),
                ("dialog.accept()", "OK on alert/confirm; optional prompt text."),
                ("dialog.dismiss()", "Cancel on confirm/prompt."),
                ("dialog.message()", "Assert text content."),
            ],
            code(
                "javascript",
                """
page.once('dialog', async dialog => {
  expect(dialog.type()).toBe('confirm');
  expect(dialog.message()).toContain('Are you sure');
  await dialog.accept();
});
await page.getByRole('button', { name: 'Delete' }).click();
""",
            ),
            [
                ("What if no handler?", "Test times out when dialog appears."),
                ("once vs on?", "once auto-removes; on handles multiple."),
                ("Native vs custom modal?", "Custom modals are DOM — use getByRole dialog."),
                ("Order?", "Register handler BEFORE click."),
                ("prompt?", "dialog.accept('typed answer')."),
            ],
            [
                "Handler before action",
                "Assert dialog.message()",
                "Custom modals ≠ window.alert",
                "Use once for single dialog",
            ],
            "Heroku JavaScript alerts",
            "Accept confirm on https://the-internet.herokuapp.com/javascript_alerts",
            code(
                "javascript",
                """
test('js confirm', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.once('dialog', d => d.accept());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
  await expect(page.getByText('You clicked: Ok')).toBeVisible();
});
""",
            ),
        )
    )

    days.append(
        d(
            16,
            "Downloads & uploads",
            2.5,
            [
                "Wait for download event and save file",
                "Upload with setInputFiles",
                "Assert file name and size",
            ],
            [
                ("waitForEvent('download')", "Pair with click that triggers download."),
                ("download.saveAs", "Write to disk for assertions."),
                ("setInputFiles", "Works on hidden file inputs; single or multiple files."),
                ("readFile sync", "Node fs to assert contents after saveAs."),
            ],
            code(
                "javascript",
                """
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByText('Download report').click(),
]);
const path = await download.path();
expect(download.suggestedFilename()).toMatch(/\\.pdf$/);

await page.getByLabel('Upload').setInputFiles('fixtures/avatar.png');
""",
            ),
            [
                ("Downloads folder?", "Configured via acceptDownloads in use."),
                ("Drag-drop upload?", "locator.setInputFiles or dispatch drop event."),
                ("Large files?", "Increase timeout; use test fixture path."),
                ("CI headless downloads?", "Supported same as local."),
                ("Multiple files?", "setInputFiles(['a.txt','b.txt'])."),
            ],
            [
                "Promise.all download pattern",
                "fixtures/ folder for uploads",
                "Assert suggestedFilename",
                "Clean up saved files in afterEach",
            ],
            "Heroku file upload",
            "Upload file and see uploaded filename.",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            17,
            "Screenshots & videos",
            2.5,
            [
                "Capture full page and element screenshots",
                "Configure video on failure",
                "Attach screenshots to report",
            ],
            [
                ("page.screenshot", "fullPage, clip, mask sensitive regions."),
                ("expect(locator).toHaveScreenshot", "Visual comparison with threshold."),
                ("video: 'retain-on-failure'", "Saves disk; on in use block."),
                ("test.info().attach", "Add image to HTML report."),
            ],
            code(
                "javascript",
                """
await page.screenshot({ path: 'artifacts/home.png', fullPage: true });
await test.info().attach('after-login', {
  body: await page.screenshot(),
  contentType: 'image/png',
});
""",
            ),
            [
                ("Element screenshot?", "locator.screenshot()"),
                ("Mask?", "mask: [page.getByLabel('SSN')] in screenshot options."),
                ("CI visual diffs?", "Commit baseline snapshots; review in PR."),
                ("maxDiffPixels?", "Tolerance for anti-aliasing."),
                ("When not visual test?", "Functional assert cheaper — use screenshots for debug."),
            ],
            [
                "screenshot only-on-failure in config",
                "Store artifacts in test-results/",
                "Visual tests need stable fonts/data",
                "Attach for stakeholder reports",
            ],
            "Screenshot element",
            "Screenshot the login form on Heroku login page.",
            code(
                "javascript",
                """
test('login form shot', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  const form = page.locator('#login');
  await form.screenshot({ path: 'test-results/login-form.png' });
});
""",
            ),
        )
    )

    days.append(
        d(
            18,
            "API testing with request fixture",
            2.5,
            [
                "Use APIRequestContext for REST calls",
                "Share cookies with browser via storageState",
                "Setup data via API faster than UI",
            ],
            [
                ("request fixture", "Isolated API client; respects baseURL from config."),
                ("request.newContext", "Separate auth headers per role."),
                ("expect(await response.json())", "Parse body; assert schema fields."),
                ("API + UI", "Seed via POST /api/items then assert UI list."),
            ],
            code(
                "javascript",
                """
test('api creates user', async ({ request }) => {
  const res = await request.post('/api/users', {
    data: { name: 'Test User', email: 't@example.com' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.id).toBeTruthy();
});
""",
            ),
            [
                ("Why API setup?", "Faster tests; UI only for user-visible path."),
                ("Auth header?", "extraHTTPHeaders in request context."),
                ("GraphQL?", "POST with query in data body."),
                ("File upload API?", "multipart via request.post with multipart."),
                ("Rate limits?", "Mock or test account pool."),
            ],
            [
                "request shares baseURL",
                "Validate status + critical fields",
                "Teardown DELETE in afterEach",
                "Don't duplicate every UI flow in API",
            ],
            "ReqRes API sample",
            "Public API: list users and assert first user has email.",
            code(
                "javascript",
                """
test('reqres list', async ({ request }) => {
  const res = await request.get('https://reqres.in/api/users?page=1');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.data[0].email).toContain('@');
});
""",
            ),
        )
    )

    days.append(
        d(
            19,
            "Authentication patterns",
            2.5,
            [
                "Save storageState after login",
                "globalSetup for one-time auth",
                "Multiple roles: admin.json, user.json",
            ],
            [
                ("storageState", "JSON of cookies + localStorage replayed into new contexts."),
                ("globalSetup", "Runs once before all tests — expensive login once."),
                ("test.use({ storageState })", "Per-file or per-describe role."),
                ("OAuth / SSO", "May need real IdP test tenant or bypass with API token + cookie injection."),
            ],
            code(
                "typescript",
                """
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: { storageState: 'playwright/.auth/user.json' },
});
""",
            ),
            [
                ("Commit auth json?", "No — generate in CI globalSetup; gitignore .auth/"),
                ("Expired session?", "Refresh in setup or shorter test suite."),
                ("2FA?", "Use test bypass codes or mock SMS in staging."),
                ("Parallel roles?", "Separate storage files per worker if needed."),
                ("Logout test?", "Use context without storageState."),
            ],
            [
                "globalSetup → storageState",
                "gitignore playwright/.auth",
                "Multiple projects per role",
                "UI login test once; reuse state elsewhere",
            ],
            "Auth reuse",
            "Script global-setup login to Heroku and save state (pattern).",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            20,
            "Fixtures: extend test",
            2.5,
            [
                "Create custom fixtures with test.extend",
                "Compose Page Objects via fixtures",
                "Auto-cleanup with fixture teardown",
            ],
            [
                ("test.extend", "Add typed fixtures; dependency injection between fixtures."),
                ("worker scope", "Rare — shared DB per worker."),
                ("auto fixture", "Runs even if test doesn't list it — for cleanup."),
                ("base test export", "Export custom `test` from fixtures.ts; import everywhere."),
            ],
            code(
                "typescript",
                """
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const p = new LoginPage(page);
    await use(p);
  },
});
""",
            ),
            [
                ("Fixture vs beforeEach?", "Fixture lazy per test; can depend on other fixtures."),
                ("page is a fixture", "Built-in; don't recreate browser manually."),
                ("Teardown?", "Code after `await use(x)` runs after test."),
                ("TypeScript?", "Strongly type custom fixtures."),
                ("Import test from?", "Always from your fixtures file in suite."),
            ],
            [
                "One fixtures.ts per project",
                "Teardown after use()",
                "Don't put assertions in fixtures",
                "loginPage fixture for DRY",
            ],
            "Logged-in page fixture",
            "Fixture that logs in before each test using storage or UI.",
            code(
                "typescript",
                """
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
""",
            ),
        )
    )

    # Days 21-30
    days.append(
        d(
            21,
            "Page Object Model (POM)",
            2.5,
            [
                "Encapsulate selectors and actions in classes",
                "Keep tests readable as user stories",
                "Avoid assertion logic inside POM (mostly actions)",
            ],
            [
                ("Page class", "Holds Page + locators as readonly fields."),
                ("methods", "login(), openSettings() — return void or next page object."),
                ("composition", "DashboardPage contains Sidebar component."),
                ("anti-pattern", "Giant god page with 200 methods — split by feature."),
            ],
            code(
                "typescript",
                """
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
""",
            ),
            [
                ("POM vs fixtures?", "POM organizes UI; fixtures wire lifecycle — often combined."),
                ("Where assertions?", "In spec files; POM may return locators for expect."),
                ("Private locators?", "Expose only actions users care about."),
                ("Inheritance?", "BasePage with common nav — use sparingly."),
                ("Maintain when?", "UI changes — update one POM file."),
            ],
            [
                "One page class per route/screen",
                "Locators as readonly fields",
                "Tests read like Gherkin",
                "No expect in POM (team choice)",
            ],
            "Refactor Heroku login to POM",
            "LoginPage class + 1-line test.",
            code(
                "typescript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            22,
            "Data-driven tests",
            2.5,
            [
                "Loop cases with test() or test.describe",
                "Externalize data JSON/CSV",
                "Parameterize expected results",
            ],
            [
                ("for-each test", "Each case is independent test in report."),
                ("test.describe + table", "Readable matrix of inputs."),
                ("fixtures with data", "Load JSON once per worker."),
                ("tag invalid cases", "Negative tests with clear names."),
            ],
            code(
                "javascript",
                """
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
""",
            ),
            [
                ("One test per row?", "Better isolation in reports."),
                ("CSV?", "Parse in globalSetup or import json."),
                ("Secrets in data?", "Use env vars for passwords."),
                ("50+ rows?", "Split files or use test.describe.parallel."),
                ("Snapshot per case?", "Name includes case id."),
            ],
            [
                "Descriptive test names from data",
                "Positive + negative pairs",
                "JSON in test-data/",
                "Avoid shared mutable case state",
            ],
            "Login matrix",
            "3 invalid + 1 valid login cases.",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            23,
            "Parallelism & sharding",
            2.5,
            [
                "Configure workers and fullyParallel",
                "Shard in CI: --shard=1/4",
                "Isolate tests — no shared DB rows",
            ],
            [
                ("workers", "Parallel test files; default ~50% cores."),
                ("fullyParallel", "Tests inside file run parallel too."),
                ("shard", "Split suite across machines for speed."),
                ("test.describe.serial", "When sharing one resource."),
            ],
            code(
                "bash",
                """
npx playwright test --workers=4
npx playwright test --shard=2/4
""",
            ),
            [
                ("Flakes when parallel?", "Shared data collision — unique IDs per test."),
                ("One worker debug?", "--workers=1 for ordering issues."),
                ("CI matrix?", "One job per shard + merge reports."),
                ("Database?", "Transaction per test or container per job."),
                ("Rate limit?", "Throttle workers or mock API."),
            ],
            [
                "Unique test data per run",
                "shard in large suites",
                "serial only as last resort",
                "merge blob reports in CI",
            ],
            "Parallel-safe IDs",
            "Use random email per test when creating users.",
            code(
                "javascript",
                """
test('create user', async ({ page }) => {
  const email = `user_${Date.now()}@test.com`;
  // use email in form...
});
""",
            ),
        )
    )

    days.append(
        d(
            24,
            "Visual regression",
            2.5,
            [
                "Baseline screenshots with toHaveScreenshot",
                "Update baselines deliberately",
                "Mask dynamic regions",
            ],
            [
                ("toHaveScreenshot", "Compares to snapshot in snapshots/ folder."),
                ("maxDiffPixelRatio", "Allow minor rendering variance."),
                ("animations", "Disable CSS animations in test env for stability."),
                ("Docker for CI", "Same OS/fonts as baseline generator."),
            ],
            code(
                "javascript",
                """
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100,
  mask: [page.locator('.clock')],
});
""",
            ),
            [
                ("First run?", "Creates baseline — review before commit."),
                ("Update flag?", "`--update-snapshots` locally only."),
                ("Component vs page?", "Both supported; clip region for widget."),
                ("Flaky visual?", "Font loading — wait for fonts or use webfont mock."),
                ("Dark mode?", "Separate baselines per theme project."),
            ],
            [
                "Commit baselines in git",
                "Mask dates and avatars",
                "Same browser project as baseline",
                "Review visual diffs in PR",
            ],
            "Heroku login visual",
            "Baseline screenshot of login page.",
            code(
                "javascript",
                """
test('login visual', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await expect(page).toHaveScreenshot('heroku-login.png');
});
""",
            ),
        )
    )

    days.append(
        d(
            25,
            "Mobile & device emulation",
            2.5,
            [
                "Use devices from @playwright/test",
                "Touch taps and viewport",
                "Separate mobile project in config",
            ],
            [
                ("devices['iPhone 13']", "Viewport, userAgent, isMobile, hasTouch."),
                ("tap()", "Touch equivalent of click for mobile."),
                ("orientation", "landscape via viewport size."),
                ("responsive", "Same test two projects desktop + mobile."),
            ],
            code(
                "typescript",
                """
projects: [
  { name: 'mobile', use: { ...devices['Pixel 5'] } },
],
""",
            ),
            [
                ("Real device?", "Playwright is emulation; BrowserStack for real hardware."),
                ("Hamburger menu?", "tap icon; wait for nav drawer."),
                ("Hover on mobile?", "No hover — design for tap."),
                ("geo?", "geolocation in context options."),
                ("Slow 3G?", "emulate network conditions via CDP if needed."),
            ],
            [
                "mobile project in CI",
                "tap not click for touch targets",
                "Assert no horizontal scroll",
                "Test critical flows on mobile",
            ],
            "Mobile viewport smoke",
            "Run example.com with Pixel 5 project.",
            code(
                "javascript",
                """
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

test('mobile example', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
});
""",
            ),
        )
    )

    days.append(
        d(
            26,
            "Component testing (intro)",
            2.5,
            [
                "Understand @playwright/experimental-ct-react",
                "Mount components in isolation",
                "When CT vs full E2E",
            ],
            [
                ("Component test", "Fast feedback for UI states without full app boot."),
                ("mount(<Button />)", "Render component with props variants."),
                ("providers", "Wrap with Router/Theme in mount options."),
                ("E2E still needed", "Integration, routing, real API."),
            ],
            code(
                "typescript",
                """
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('button', async ({ mount }) => {
  const c = await mount(<Button label="Go" />);
  await c.getByRole('button', { name: 'Go' }).click();
});
""",
            ),
            [
                ("Setup CT?", "npm init playwright@latest --ct"),
                ("Vite?", "CT uses Vite under the hood for React."),
                ("Storybook?", "Alternative; CT runs real browser like E2E."),
                ("Angular/Vue?", "CT kits exist per framework."),
                ("Same locators?", "Yes — getByRole works on mounted component."),
            ],
            [
                "CT for state matrix",
                "E2E for critical journeys",
                "Share locators with E2E where possible",
                "Experimental API — pin version",
            ],
            "Button states",
            "Mount disabled and enabled button; assert behavior.",
            code(
                "typescript",
                """
test('disabled', async ({ mount }) => {
  const c = await mount(<Button disabled label="X" />);
  await expect(c.getByRole('button')).toBeDisabled();
});
""",
            ),
        )
    )

    days.append(
        d(
            27,
            "CI: GitHub Actions",
            3.0,
            [
                "Install browsers with deps on Ubuntu",
                "Cache npm and playwright browsers",
                "Upload report artifact on failure",
            ],
            [
                ("ubuntu-latest", "Standard CI runner; --with-deps installs system libs."),
                ("fail fast", "Smoke job on PR; full suite on main."),
                ("secrets", "BASE_URL, TEST_USER in GitHub secrets."),
                ("sharding", "matrix strategy 1..4 shards."),
            ],
            code(
                "yaml",
                """
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
""",
            ),
            [
                ("Why install --with-deps?", "Headless Chrome needs OS libraries on Linux."),
                ("Retries in CI?", "2 retries common for network flakes."),
                ("Scheduled run?", "cron for nightly full regression."),
                ("PR comment?", "Third-party actions post report link."),
                ("Docker image?", "mcr.microsoft.com/playwright for preinstalled browsers."),
            ],
            [
                "Always upload report on failure",
                "forbidOnly in CI config",
                "Parallel shards for speed",
                "Separate env staging URL",
            ],
            "CI pipeline for lab repo",
            "Add workflow file to pw-30-day-lab and get green build.",
            code(
                "yaml",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            28,
            "Reporting & Allure",
            2.5,
            [
                "HTML reporter defaults",
                "Add Allure or junit for dashboards",
                "test.step for hierarchy",
            ],
            [
                ("list + html", "Local list; HTML for drill-down."),
                ("allure-playwright", "Rich trends, categories, history."),
                ("junit.xml", "CI systems parse for pass/fail gates."),
                ("test.step", "Nested steps in report timeline."),
            ],
            code(
                "javascript",
                """
test('checkout', async ({ page }) => {
  await test.step('add to cart', async () => {
    await page.getByRole('button', { name: 'Add' }).click();
  });
  await test.step('pay', async () => {
    await page.getByRole('button', { name: 'Pay' }).click();
  });
});
""",
            ),
            [
                ("Attachments?", "screenshots, logs via test.info().attach."),
                ("Merge reports?", "blob reporter + merge-reports CLI."),
                ("Slack notify?", "Webhook on failure post-processing."),
                ("Trace in Allure?", "Attach trace link manually."),
                ("Who reads report?", "Devs want trace; PM wants steps."),
            ],
            [
                "test.step for long flows",
                "blob for sharded CI",
                "Category tags in Allure",
                "Keep step names business-readable",
            ],
            "Step-based login test",
            "Refactor Heroku login with test.step.",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    days.append(
        d(
            29,
            "Performance & stability",
            2.5,
            [
                "Identify flake root causes",
                "Use retries wisely",
                "Quarantine flaky tests",
            ],
            [
                ("flake", "Non-deterministic fail — usually timing or data."),
                ("quarantine", "test.fixme + ticket; run in nightly only."),
                ("test timeout", "Increase only after fixing slow backend."),
                ("metrics", "Track pass rate per test over time."),
            ],
            code(
                "javascript",
                """
// playwright.config.ts — trace helps find flakes
use: { trace: 'on-first-retry' },
retries: process.env.CI ? 2 : 0,
""",
            ),
            [
                ("Retry hides bugs?", "Yes if overused — fix root cause."),
                ("Shared env?", "Staging refresh breaks tests — version data."),
                ("Clock?", "mock Date for time-sensitive UI."),
                ("Animations?", "prefers-reduced-motion in test CSS."),
                ("Load test?", "Not Playwright's job — use k6/Locust."),
            ],
            [
                "Flake log in team wiki",
                "Zero tolerance for test.only in main",
                "Stabilize locators first",
                "Nightly full + PR smoke",
            ],
            "Stabilize dynamic test",
            "Replace sleep with expect in dynamic loading test.",
            code(
                "javascript",
                """
// Bad: await page.waitForTimeout(5000);
await expect(page.getByText('Hello World!')).toBeVisible({ timeout: 15000 });
""",
            ),
        )
    )

    days.append(
        d(
            30,
            "Capstone: Full E2E suite",
            4.0,
            [
                "Design suite for a small LMS or e-commerce demo",
                "Combine POM, API setup, auth, CI",
                "Document how to run smoke vs full",
            ],
            [
                ("test pyramid", "Many unit/component, fewer E2E — but E2E catch integration gaps."),
                ("critical path", "Login, browse, purchase/enroll, logout."),
                ("env strategy", "docker-compose up for local; ephemeral preview for PR."),
                ("maintenance", "Review failures weekly; delete obsolete tests."),
            ],
            code(
                "typescript",
                """
// tests/smoke/critical.spec.ts — @smoke
// tests/regression/ — full
// pages/, fixtures/, test-data/
// .github/workflows/playwright.yml
""",
            ),
            [
                ("How many E2E?", "Enough to cover revenue paths — not every field."),
                ("Data cleanup?", "API teardown or isolated tenant."),
                ("Preview URL?", "Vercel comment bot runs against PR URL."),
                ("Ownership?", "Team owns suite — not solo QA."),
                ("Done definition?", "Green CI + documented README."),
            ],
            [
                "README: install, test, debug",
                "smoke < 5 min",
                "POM for main pages",
                "auth via globalSetup",
            ],
            "Final capstone: Sauce Demo checkout",
            "Full flow on https://www.saucedemo.com/ — login, add items, checkout, finish.",
            code(
                "javascript",
                """
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
""",
            ),
        )
    )

    return days
