# Modularization Plan For Next Chat

## Purpose

The current Sparta vendor mockup is a working single-file `index.html`. It should now be split into smaller files so we can safely add/delete/edit pages throughout August without making one huge HTML file harder to maintain.

This plan is for the next chat to interpret and implement carefully.

## Non-negotiable rules

- Do not change dashboard behavior while splitting files.
- Do not redesign the UI during the split.
- Do not rename screens, roles, users, report labels, or filter logic unless the user separately asks.
- Do not push a broken modular version.
- Keep a restore path back to the original single-file HTML.
- Keep `PROJECT_SETUP.md` untracked and do not push it.
- After any push affecting the hosted mockup, verify the GitHub Pages live URL has refreshed before saying done.

## Recommended approach

Use plain modular HTML/CSS/JS, not React/Vite yet.

Target structure:

```text
index.html
css/
  styles.css
js/
  app.js
  data.js
  roles.js
  reports.js
  screens.js
```

Keep GitHub Pages hosting exactly the same:

```text
https://namrata-saviesa.github.io/sparta-vendor-mockup/
```

## Before starting

1. Read `HANDOVER.md`.
2. Confirm current git status.
3. Confirm latest pushed version works on the hosted page.
4. Create a restore copy of the current single-file HTML before editing.

Suggested restore copy:

```text
backup/index.single-file.before-modularization.html
```

Also commit the backup before or together with the modular split so rollback is easy.

## Restore / rollback strategy

If modularization breaks anything, restore by copying the backup file back to `index.html`.

Manual restore:

```text
copy backup/index.single-file.before-modularization.html index.html
```

Git restore option:

```text
git checkout <last-good-commit> -- index.html
```

Important:

- Prefer restoring `index.html` from the backup file if the split is partially complete.
- Do not use destructive commands like `git reset --hard` unless the user explicitly asks.

## Suggested implementation sequence

### Step 1: Create backup

- Create `backup/`.
- Copy current `index.html` to:

```text
backup/index.single-file.before-modularization.html
```

Do not edit behavior yet.

### Step 2: Extract CSS

Move everything inside the current `<style>` block into:

```text
css/styles.css
```

Replace the `<style>` block in `index.html` with:

```html
<link rel="stylesheet" href="css/styles.css">
```

Validation:

- Open locally or inspect page.
- Visual layout should look the same.
- Password gate should still look the same.

### Step 3: Extract JS without changing logic

Move the script code into files in this order.

Recommended modules:

```text
js/data.js
js/roles.js
js/reports.js
js/screens.js
js/app.js
```

Simpler first pass is acceptable:

```text
js/app.js
```

Then split further only after the page works.

Use regular script tags, not ES modules, for the first split to reduce risk:

```html
<script src="js/data.js"></script>
<script src="js/roles.js"></script>
<script src="js/reports.js"></script>
<script src="js/screens.js"></script>
<script src="js/app.js"></script>
```

Keep order important:

1. Data/constants first.
2. Roles/access logic second.
3. Report data/rendering third.
4. Screen handlers fourth.
5. Startup/init last.

### Step 4: Suggested file responsibilities

#### `js/data.js`

Keep dummy/static data:

- `orRouteOrders`
- report demo rows
- calendar/static master data
- any sample vendors/material/order arrays

#### `js/roles.js`

Keep access logic:

- `roleProfiles`
- `ALL_PAGES`
- `PPC_PAGES`
- `currentDesigner()`
- `currentChannelScope()`
- `currentSubScope()`
- `currentTeamDesigners()`
- `roleAllowsOrder(o)`
- `applyRole(role)`
- `applyScopedOrderFilters(prefix)`
- `GROUPS`
- `USERS`
- `PAGE_ACCESS_ROLES`

Critical current role decisions:

- Full Admin / Management: Rajesh, Monesh, Mary, Anand Laghate, Mangesh, Namrata.
- Anand/Mangesh/Namrata must not be duplicated in PPC.
- PPC / Planning active non-admin user: Amir.
- Sakshi is `AID-walkin`: Usha, Aishwarya, Ashmi, Krish.
- `AID-DL Manager`: Ravi, Jennifer, Shruti, Siddhesh.
- Vrinda AI subgroup: Varun, Nivya.
- Designers see B2C own orders only.

#### `js/reports.js`

Keep report logic:

- report modal open/close logic
- OTIF report data and formulas
- Worker Efficiency report data and formulas
- Supervisor Efficiency report data and formulas
- any future report click handlers

#### `js/screens.js`

Keep screen/page behavior:

- navigation between screens
- filter bars
- station load rendering
- order route/order detail filter updates
- master modal open/close functions
- users configurator renderers

#### `js/app.js`

Keep startup only:

- attach event listeners
- call initial render functions
- initialize role
- initialize password gate

## Validation checklist

After each extraction step, check:

- Password gate still appears.
- Password still unlocks page.
- Sidebar navigation works.
- Role switcher works.
- Designer role only shows Order Detail and Order Route & Days.
- Designer cannot switch to B2B.
- Sakshi role sees only AID-walkin sample orders.
- AID-DL role sees only DL sample orders.
- Vrinda role sees only Varun/Nivya sample orders.
- Users & Roles opens.
- Directory tab renders.
- Visibility map renders.
- Page Access matrix renders.
- Floor operators tab renders.
- Reports open on click:
  - OTIF Trend
  - Worker Efficiency
  - Supervisor Efficiency
- Priority Control still opens and displays.
- No browser console errors.

## Technical checks

If JS remains non-module scripts, syntax-check each file:

```text
node --check js/data.js
node --check js/roles.js
node --check js/reports.js
node --check js/screens.js
node --check js/app.js
```

If the first pass keeps one JS file:

```text
node --check js/app.js
```

## Commit strategy

Use small commits.

Recommended commits:

1. `Add single-file backup before modularization`
2. `Extract stylesheet from index`
3. `Extract JavaScript from index`
4. `Split JavaScript by responsibility`

If the next chat wants the least risky path:

1. Create backup.
2. Extract CSS.
3. Extract all JS into one `js/app.js`.
4. Stop and verify live page.
5. Only then split JS further.

## What not to do

- Do not convert to React/Vite now.
- Do not introduce a build step yet.
- Do not change GitHub Pages hosting settings.
- Do not change the live URL.
- Do not refactor old encoding artifacts unless they block the split.
- Do not clean unrelated legacy code unless it directly breaks modularization.

## Suggested next-chat opening instruction

The next chat should start with:

```text
Read HANDOVER.md and MODULARIZATION_PLAN.md. Then modularize the current single-file HTML safely, keeping a backup and preserving all behavior.
```
