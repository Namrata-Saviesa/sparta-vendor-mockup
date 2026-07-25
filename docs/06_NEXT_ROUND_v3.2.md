# 06 · Next Round (v3.2) — Scope & Execution Order

Source: `recommendation.md` + `Sparta_Requirements_Mapping.md` (the 23-line `Sparta.xlsx` mapping). Nothing here needs a new nav screen — everything fits into existing screens, Masters tiles, or Reports cards. The nav was deliberately trimmed in earlier rounds; **keep it trimmed.**

## Recommended build order
1. ✅ **Rebuild Priority Control** to the 4-lane model + CP override; cascade labels to Station Scan. *(Implemented in the v3.2 mockup round; fixes the known inconsistency and satisfies row 22.)*
2. **OTIF trend widget** per Anand's comment (row 5) — Overall / B2C / B2B, Apr–Jun avg + current month. No store-level.
3. Row 4 — **Designer "all my ongoing jobs" worklist** (`s-oroute`).
4. Row 18 — **≥90% job-bank chaser → 5-day dispatch planner** (`s-dash` widget).
5. Row 24 — **Date-revision count + auto-notify** (`s-dash` KPI + note, `s-rep` card).
6. Row 9 — **Vendor day-wise follow-up log** (`s-po` follow-up column + drawer).
7. Row 13 — **Assembly plan + man-day scans** (`s-order` card, `s-scan` note, `s-rep` card).
8. Row 14 — **Event-triggered send** (packing list on dispatch) — new "Event-triggered sends" section in Report Scheduler (`s-cron`).
9. Row 12 — **2-week day-wise dealer-wise readiness** (`s-rep` + Monday cron row).
10. Row 7 — **WO split: cutting / stores / vendor** (`s-order` breakdown card).
11. Row 8 — **ALP consolidated cutting-list barcode** (`s-oroute`).
12. Row 6 — **Barcode route symbols on labels** (`s-scan`).
13. Row 15 — **Laminate/PU/glass sqft demand** (`s-po` widget).
14. Row 10 — **Wastage % by cost → incentives** (`s-rej` cost cols + KPI, `s-rep` card).
15. Row 11 — **Month × product × process production** (`s-rep` card, `s-load` KPI line).
16. Row 17 — **Store & category order flow** (`s-rep` card).
17. Rows 19–21 — **Offcut store domain** (new Masters tile "Offcut Store Master" + new "Stores & offcut" Reports category: in-vs-used/ageing/compliance + scrap-size threshold). Largest genuinely new area; contain it, don't add a 16th nav screen.
18. Row 16 — **Designer tree + client→WO cascade** (Users & Roles tree + find-bar cascade).
19. Row 23 — **Report scheduler → designer routing** (`s-cron` routing section).
20. Row 3 — **1-year data retention** Masters tile.

## Thematic gaps the sheet exposed
- **No Stores/Offcut domain** at all (rows 19–21) — the biggest new area.
- **No cost dimension** — rejections/rework tracked in pieces & days, never rupees (row 10). Incentives/KRAs depend on this. Add material-cost + process-cost columns + Wastage % KPI; station cost rates become a **new master-data dependency**.
- **Cron-only communication** — scheduler is time-based only; row 14 needs an **event-triggered** send. Signals to the vendor that the backend needs an **event bus, not just cron**.
- **Designer experience is filter-deep, not list-deep** — visibility rules exist but there's no broad "all my ongoing jobs" worklist and no designer-level report routing.
- **Assembly is a black box** — only a route chip + plan date; row 13 wants planned-days entry, computed end date, and crew/man-day capture from end-of-day scans (also a new costing feed: planned vs actual man-days).
- **Chasing workflow missing** — row 18 defines a process: ≥90%-complete orders enter a job bank; a chaser assigns them to a 5-day dispatch planner.

## Smaller independent polish
- Fix the **Reference/Project residue** on the Dashboard "Expected vs committed" table.
- Seed **8–10 skeleton WOs** so new list widgets aren't empty.
- Make Reports cards **expandable to 3 sample columns** (25 → ~33 cards) for column-level vendor quoting. Low priority.
- Resolve the **6-day vs 7-day** week basis.
- Add a visible **Data Retention & Archive** tile.
- **Protect removed features** — repeat the "do not reintroduce" list (doc 03) in every handover.

## Full row → landing map (from Sparta_Requirements_Mapping.md)
| Row | Requirement (short) | Status | Lands on |
|---|---|---|---|
| 3 | 1-year data retention | 🔴 | `s-mast` new tile |
| 4 | Designer-wise ongoing jobs search | 🟡 | `s-oroute` new widget |
| 5 | OTIF publishing + trend (Overall + B2C/B2B only) | 🟡 | `s-dash` widget, `s-rep` card edit |
| 6 | Barcode route symbols on labels | 🔴 | `s-scan` label card |
| 7 | WO split: cutting / stores / vendor | 🟡 | `s-order` breakdown card |
| 8 | ALP consolidated cutting-list barcode | 🔴 | `s-oroute` (WO 0428B ALP line) |
| 9 | Vendor day-wise follow-up log | 🟡 | `s-po` follow-up column + drawer |
| 10 | Wastage % by cost → incentives | 🟡 | `s-rej` cost cols + KPI, `s-rep` card |
| 11 | Month × product × process production | 🟡 | `s-rep` card, `s-load` KPI line |
| 12 | 2-week day-wise dealer-wise readiness | 🟡 | `s-rep` card + Monday cron row |
| 13 | Assembly plan + man-day scans | 🟡 | `s-order` card, `s-scan` note, `s-rep` card |
| 14 | Auto packing-list email on dispatch | 🟡 | `s-cron` event-trigger section, `s-pack` note |
| 15 | Laminate/PU/glass sqft demand | 🔴 | `s-po` new widget |
| 16 | Designer tree + client→WO cascade | ✅/🟡 | Users & Roles tree, find-bar cascade |
| 17 | Store & category order flow | 🟡 | `s-rep` card |
| 18 | ≥90% job-bank chaser → 5-day planner | 🟡 | `s-dash` new widget, `s-rep` card |
| 19 | Offcut rack/shelf barcode store | 🔴 | `s-mast` new tile + modal |
| 20 | Offcut in-vs-used, ageing, compliance | 🔴 | `s-rep` new category (2 cards) |
| 21 | Offcut scrap-size threshold | 🔴 | Offcut master config table |
| 22 | 4-tier Job Flow Priority + CP override | ✅ | `s-prio` full rebuild completed |
| 23 | Report scheduler → designer routing | 🟡 | `s-cron` routing section |
| 24 | Date revision count + auto-notify | 🟡 | `s-dash` KPI + note, `s-rep` card |

Legend: ✅ covered · 🟡 partial · 🔴 not covered yet.
