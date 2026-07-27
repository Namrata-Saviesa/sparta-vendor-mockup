# Sparta Vendor Mockup Handover

## Live links

- Hosted mockup: https://namrata-saviesa.github.io/sparta-vendor-mockup/
- GitHub repo: https://github.com/Namrata-Saviesa/sparta-vendor-mockup

## Important project rules

- Keep solutions simple. Do not rebuild from scratch when a scoped edit works.
- Always discuss the next functional direction with the user before building major new areas.
- Do not lie or guess. If something is uncertain, say so.
- After pushing changes that affect the hosted mockup, verify the live GitHub Pages URL has refreshed before saying the work is done.
- `PROJECT_SETUP.md` is intentionally untracked and must not be pushed.

## Current repo state

- Main file: `index.html`
- Current hosting branch: `main`
- Latest pushed commit at handover time: `7e1904d Add B2C subgroup manager access`
- Password gate exists on the hosted HTML.
- GitHub Pages URL remains the same after each push.

## What the mockup is for

This is an HTML mockup to explain Saviesa's Sparta dashboard requirements to the Sparta vendor. The scope has grown from one HTML page into a versioned, hosted dashboard specification covering PPC, material, purchase, production, reports, users, roles, and access rules.

## Completed major work

- Git + GitHub Pages hosting set up.
- Password gate added.
- Priority Control rebuilt with four levels:
  - Misc
  - Tatkal
  - High Priority
  - Normal
- OTIF Trend report made clickable with logic/formula/column explanations.
- Worker Efficiency report made clickable with date picker, Apr-Jun average, July current month, and trend.
- Supervisor Efficiency report made clickable with machine-hours logic capped so no single machine day exceeds 8 hours.
- Role switcher added in left sidebar.
- `Masters & Config -> Users & Roles` expanded with:
  - Directory
  - Visibility map
  - Page Access matrix
  - Floor operators
- Master Org Chart tile added in `Masters & Config`.

## Current role and access decisions

### Full Admin / Management

Users:
- Rajesh
- Monesh
- Mary
- Anand Laghate
- Mangesh
- Namrata

Access:
- All pages
- All B2B and B2C orders
- Masters & Config
- Page Access matrix

Important: Anand, Mangesh and Namrata should not be duplicated in PPC. They belong in Full Admin only.

### PPC / Planning

Current active non-admin PPC user:
- Amir

Access:
- PPC Dashboard
- RM Dashboard
- PO Dashboard
- Rejection Dashboard
- Auto Planning
- Process Routes
- Order Route & Days
- Order Detail
- Station Load
- Priority Control
- Reports

### B2C AI

Head:
- Harsha sees all AI B2C orders.

Subgroup:
- Vrinda sees only AI subgroup orders for:
  - Varun
  - Nivya

### B2C AID

Head:
- Bharti sees all AID/Retail/DL B2C orders.

Subgroup:
- Sakshi is `AID-walkin`.
- Sakshi sees only orders for:
  - Usha
  - Aishwarya
  - Ashmi
  - Krish

Subgroup:
- `AID-DL Manager` sees only orders for:
  - Ravi
  - Jennifer
  - Shruti
  - Siddhesh

### B2C Pune

Heads:
- Amarkant
- Rachana

Scope:
- Pune B2C team orders.

### Designers

Rule:
- Designers see only B2C orders.
- Designers see only their own orders.
- Designers should only see:
  - Order Detail
  - Order Route & Days

### Purchase

Users:
- Santosh
- Zubair
- Sandeep
- Pravin

Access:
- RM Dashboard
- PO Dashboard
- Reports

### Production / Factory

Users include:
- Avan
- Prashant
- Amir Production
- Pratish
- Sachin
- Suhas
- Thapa

Access:
- Order Route & Days
- Order Detail
- Station Load
- Station Scan
- Packing Station
- Reports

### Supervisors and operators

- Keep generic supervisor/operator names where actual names are not known.
- Operators are station scoped.
- Operators should only see Station Scan / Packing Station.

### Org chart only

Keep these in org chart but no active dashboard access for this phase:
- Digital Marketing
- Social Media
- SEO
- HR
- Finance
- Customer Care

## Current implementation notes

- Role definitions are in `roleProfiles` inside `index.html`.
- Order filtering is handled by:
  - `roleAllowsOrder(o)`
  - `currentDesigner()`
  - `currentChannelScope()`
  - `currentSubScope()`
  - `currentTeamDesigners()`
- Demo order list is `orRouteOrders`.
- Users & Roles directory data is built in the `USERS` array override after `GROUPS`.
- Page Access matrix is built from `PAGE_ACCESS_ROLES`.
- The old legacy `renderMap()` exists but active Users & Roles uses `renderOrgRoleMap()`.

## Things to watch

- Some older text in the HTML has encoding artifacts like `Â·` or malformed arrows. Avoid broad formatting rewrites unless necessary.
- Prefer targeted patches.
- `PROJECT_SETUP.md` remains untracked. Do not add it.
- When checking JavaScript syntax, extracting the `<script>` block and running `node --check` has been useful.

## Suggested next work

1. Clean the designer experience:
   - When designer logs in, show only Order Detail and Order Route & Days.
   - Make B2C-only state very clear in the filter bar.
   - Optionally hide disabled filters instead of only disabling them.

2. Continue clickable reports:
   - Identify the next report from the Reports page.
   - Add detail modal with logic, formulas, and column explanations.

3. Improve Users & Roles clarity:
   - Add a team-tree view under Users & Roles for B2C hierarchy:
     - Harsha -> AI -> Vrinda subgroup
     - Bharti -> AID -> Sakshi AID-walkin + AID-DL
     - Amarkant/Rachana -> Pune

4. Expand demo order coverage:
   - Add more sample orders for each subgroup so role switching always shows realistic data.

5. Later, consider replacing the simple password gate with real auth only if the project moves beyond a static mockup.
