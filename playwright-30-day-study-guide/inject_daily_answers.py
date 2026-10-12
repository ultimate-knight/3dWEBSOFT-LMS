#!/usr/bin/env python3
"""Inject answers after each 'Important questions' block in the uploaded guide text."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "uploaded-guide.txt"
OUT_MD = ROOT / "Playwright_Automation_Complete_30_Day_Study_Guide.md"
OUT_PDF = ROOT / "Playwright_Automation_Complete_30_Day_Study_Guide.pdf"

# Answers in order per day (3 per day, days 1–30)
DAILY_ANSWERS: list[list[str]] = [
    [
        "Playwright Test is Microsoft’s test runner for Playwright: it provides `test`/`expect`, fixtures (`page`, `request`), hooks, parallel workers, retries, reporters, and HTML/trace output.",
        "The `page` fixture is a fresh browser tab (Page) in an isolated BrowserContext for that test. Playwright creates it before the test and closes it after, so you get a clean session without manual browser launch.",
        "Run one file with `npx playwright test path/to/file.spec.js` (or `.ts`). You can also use `-g \"test title\"` to run a single test inside the file.",
    ],
    [
        "Browser operations return Promises; `await` waits for the action to finish so the next line does not run on a half-loaded page or mid-click state.",
        "An array is an ordered list of values (e.g. several users). An object is one record with named fields (e.g. one user’s `username` and `active` flag).",
        "Use `for...of` when you need to loop a collection and `await` inside the loop—e.g. data-driven tests—without callback/async pitfalls of `forEach`.",
    ],
    [
        "Browser = engine instance; BrowserContext = isolated session (cookies, storage, permissions); Page = one tab/window inside a context. Multiple contexts do not share cookies unless you copy state.",
        "Isolation prevents tests from polluting each other’s login, cart, or DB rows, so parallel runs and reruns stay deterministic.",
        "It launches (or reuses) browser/context, gives you a new Page, and tears down after the test so you do not leak memory or session state.",
    ],
    [
        "It matches how users and assistive tech see controls (button, link, textbox) and is usually more stable than CSS classes or DOM depth.",
        "Your locator matches more than one element when Playwright expects a single target for an action. Narrow with role+name, container, or `filter()`.",
        "When the team adds `data-testid` (or similar) as a stable contract between dev and QA, especially for custom widgets without good labels.",
    ],
    [
        "`fill()` sets the input value in one step (clear + type)—best for most fields. `type()`/`pressSequentially()` simulates keystrokes when the app validates per key.",
        "On a native `<select>`: `await page.getByLabel('Course').selectOption({ label: 'Playwright' })` or by `value` / index.",
        "`await page.getByLabel('Accept terms').check()` then `await expect(locator).toBeChecked()` to verify state.",
    ],
    [
        "Playwright’s locator assertions (e.g. `toBeVisible()`) retry until the condition is true or the timeout expires—they wait for the UI, not a single instant snapshot.",
        "The matcher is async and polls the DOM; `await` ensures you wait for the assertion to finish and fail with a useful message if the element never appears.",
        "Checking an action only proves the click ran; checking the result proves the app showed the right message, URL, or data—the test’s real goal.",
    ],
    [
        "Clear title, preconditions, steps, test data, expected observable outcome, and cleanup/isolation notes.",
        "Valid login, invalid password, blank/required fields, locked/disabled account (if applicable)—plus logout/session cleared.",
        "Ordered suites hide dependencies; any test should pass alone so parallel CI and debugging stay trustworthy.",
    ],
    [
        "testDir, timeouts, baseURL, reporters, browser projects, retries, trace/screenshot/video, `use` defaults, and optional globalSetup.",
        "`beforeEach` runs before every test (fresh navigation/login). `beforeAll` runs once per worker—risky if tests mutate shared state.",
        "Relative URLs (`page.goto('/login')`) work across local/staging by changing one config value instead of every test file.",
    ],
    [
        "An element is ready for action: attached, visible, stable, enabled, and receiving events (not covered by another element).",
        "They wait a fixed time regardless of app speed—too short flakes, too long wastes CI minutes and masks missing waits.",
        "Use a web-first assertion (`expect(...).toBeVisible()`), `waitForURL`, or `waitForResponse`; increase timeout only after confirming the app is legitimately slow.",
    ],
    [
        "`selectOption({ label: 'Playwright' })` or `selectOption('value')` on the select locator.",
        "`page.getByRole('row', { name: /Amina.*Playwright/ })` or `getByRole('row').filter({ hasText: '...' })`.",
        "Rows/cells tied to user-visible text survive layout changes better than `tr:nth-child(3) td:nth-child(2)`.",
    ],
    [
        "The dialog event fires synchronously when the dialog appears; if no handler is registered yet, the test can hang or auto-dismiss unpredictably.",
        "`const [popup] = await Promise.all([page.waitForEvent('popup'), clickTrigger])` (or `context.waitForEvent('page')`).",
        "A tab is a Page in the same BrowserContext (shared cookies). A new context is a separate session—like another user or incognito.",
    ],
    [
        "`await locator.setInputFiles('path/to/file')` on the file input (hidden inputs are OK).",
        "The download starts after the click; registering the waiter first avoids missing a fast download event.",
        "In `tests/fixtures/` (or `test-data/`)—small, non-secret files committed to the repo; never real customer documents.",
    ],
    [
        "Action log, DOM snapshots, network, console, timing, and screenshots/videos linked to each step.",
        "`npx playwright test --debug` or `--ui`, or set `PWDEBUG=1`—step through with Inspector.",
        "Failures in CI are hard to reproduce locally; traces are the fastest way to see locators, network, and overlays at the failing moment.",
    ],
    [
        "Happy path, invalid input, required fields, boundary values, and at least one negative assertion (error message or count 0).",
        "Stable locators, clear names, no shared mutable data, config baseURL, and assertions on outcomes—not only actions.",
        "HTML report screenshot, list of tests run, README with setup/commands, and notes on environment assumptions.",
    ],
    [
        "Locators for that page and user-like methods (`login`, `open`, `search`)—not the whole test scenario or unrelated pages.",
        "Tests become hard to read; you jump through layers to see what is being verified. Keep assertions in specs unless truly reusable.",
        "In the test file: the test should state the expected user-visible outcome (`expect` on alert, URL, row, etc.).",
    ],
    [
        "Dependency injection with lifecycle—setup before `use()`, teardown after—so tests declare what they need without copy-paste.",
        "Parallel workers overwrite the same account name or counter, causing random pass/fail.",
        "When multiple tests need the same constructed object (page object, authenticated context) with consistent setup/teardown.",
    ],
    [
        "Testing at edges of allowed input—min/max length, empty, just below/above limits—where bugs often appear.",
        "One test logic, many data rows—less duplication and clearer failure names per case.",
        "Includes the case identifier and intent: `email validation: missing-at` so the report shows which row failed.",
    ],
    [
        "Typically cookies and localStorage (and similar) serialized to JSON so a new context can skip UI login.",
        "It is equivalent to live session credentials—anyone with the file can act as that user; rotate if leaked.",
        "For the login flow itself, MFA changes, or when you must prove the sign-in UI end-to-end.",
    ],
    [
        "`expect(response.status()).toBe(200)` or `expect(response.ok()).toBeTruthy()` for success range.",
        "Status alone can be 200 with wrong JSON; assert schema fields the UI or contract depends on.",
        "`Date.now()`, UUID, or `pw-${Date.now()}@example.test` emails so parallel runs do not collide.",
    ],
    [
        "Intercept, modify, mock (`fulfill`), abort, or continue requests matching a URL pattern.",
        "That the real backend, database, or integration is correct—only that the UI handles the mocked response.",
        "Users see errors too; UI must show alerts, retry, or empty states without breaking.",
    ],
    [
        "Shared accounts, duplicate unique keys, order-dependent data, or race on the same record when workers increase.",
        "Each test sets up its own data and does not rely on another test’s side effects.",
        "Useful in CI for transient network issues; dangerous if overused to hide locator/timing bugs without fixing root cause.",
    ],
    [
        "By impact × likelihood: revenue paths, auth, data loss, and compliance first; cosmetic/low-risk later.",
        "Smoke = small fast gate on critical health; regression = broader suite covering many features and edge cases.",
        "Something a user or tester can see or query without reading server logs—message, URL, row, API field.",
    ],
    [
        "Wrong password, unknown user, blank fields, locked account, expired session—anything that must not grant access.",
        "`process.env.E2E_USER` / `E2E_PASSWORD` from `.env` (gitignored) or CI secrets—never literals in git.",
        "Setup, env vars, how to run tests/reports, test account policy, scope, and known limitations.",
    ],
    [
        "Parse displayed subtotal/tax/total text or `data-testid` totals; compare before/after quantity changes; do not trust a single static string if prices change.",
        "Empty cart, invalid postal code, missing required fields, session timeout, payment failure simulation.",
        "No real money or inventory impact; predictable data; legal permission to automate.",
    ],
    [
        "Create, Read, Update, Delete—core persistence operations your admin/LMS features rely on.",
        "Parallel tests and reruns won’t clash on the same row name; search/delete targets stay unambiguous.",
        "Assert row gone from UI, empty search results, or GET API returns 404/not in list after delete.",
    ],
    [
        "A named browser/device configuration in `playwright.config` (e.g. chromium, firefox, webkit) with its own `use` options.",
        "Different rendering, timing, or WebKit-specific behavior (date inputs, scroll, flex bugs) exposes app or test assumptions.",
        "Re-run with `--project=webkit`, open trace, compare snapshot and locator counts—fix app or test, avoid blind skip.",
    ],
    [
        "The name exposed to assistive tech—often from visible text, `aria-label`, or associated `<label>`.",
        "Layout and navigation change (hamburger vs full nav); catch controls that overflow or hide on small screens.",
        "Real device GPUs, touch quirks, and OS fonts—emulation is representative, not exhaustive.",
    ],
    [
        "`npm ci` installs exactly from `package-lock.json` for reproducible CI builds (vs `npm install` which may resolve newer versions).",
        "You still want the HTML report when tests fail; `always()` uploads artifacts even on failure.",
        "GitHub Actions secrets / vault env vars—never in repo, logs, or committed `.auth` files.",
    ],
    [
        "Page object: locators + actions; test: scenario steps + assertions + why it matters.",
        "Prerequisites, URLs, env vars, install commands, test users policy, how to run smoke vs full, and CI behavior.",
        "Fixtures/JSON with fake data, unique IDs per run, gitignore secrets, teardown/delete after create tests.",
    ],
    [
        "Example: requirement ‘invalid login shows error’ → goto login → fill bad creds → click → expect alert → no dashboard URL → context closed automatically.",
        "Trace: locator count 0 vs many, overlay, wrong frame, not enabled—fix locator or wait for state, not blind timeout.",
        "Repeatable parallel regression, API contracts, precise edge cases, and evidence (report/trace) on every commit.",
    ],
]


def inject_answers(text: str) -> str:
    parts = re.split(r"(Important questions\n)", text)
    if len(parts) < 2:
        raise SystemExit("No 'Important questions' sections found")

    out = [parts[0]]
    day_idx = 0
    for i in range(1, len(parts), 2):
        header = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        if day_idx >= len(DAILY_ANSWERS):
            out.append(header + body)
            continue

        # body starts with numbered questions until Revision notes / Weekly / Page break
        m = re.match(
            r"(.*?)(\nRevision notes|\nWeekly checkpoint|\nPLAYWRIGHT)",
            body,
            re.DOTALL,
        )
        if not m:
            out.append(header + body)
            day_idx += 1
            continue

        questions_block = m.group(1).strip()
        rest = body[m.start(2) :]

        answers = DAILY_ANSWERS[day_idx]
        lines = [ln.strip() for ln in questions_block.split("\n") if ln.strip()]
        ans_section = "\n\n**Answers**\n\n"
        for n, line in enumerate(lines):
            q = re.sub(r"^\d+\.\s*", "", line)
            a = answers[n] if n < len(answers) else "(See revision notes and examples above.)"
            ans_section += f"{n + 1}. **{q}**\n\n   {a}\n\n"

        out.append(header + questions_block + ans_section + rest)
        day_idx += 1

    return "".join(out)


def to_markdown(text: str) -> str:
    # Light cleanup for markdown PDF
    md = "# Playwright Automation — Complete 30-Day Study Guide (With All Answers)\n\n"
    md += "*All daily **Important questions** now include full answers below each question block.*\n\n---\n\n"
    md += text.replace("\f", "\n\n---\n\n")
    md = re.sub(r"PLAYWRIGHT AUTOMATION • 30-DAY STUDY GUIDE\n\nPage \d+\n", "", md)
    return md


def main():
    text = SRC.read_text(encoding="utf-8")
    enriched = inject_answers(text)
    md = to_markdown(enriched)
    OUT_MD.write_text(md, encoding="utf-8")
    print(f"Wrote {OUT_MD} ({len(md):,} chars), injected answers for {len(DAILY_ANSWERS)} days")


if __name__ == "__main__":
    main()
