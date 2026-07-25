# 02 · Version History (reconstructed)

Both `Sparta_App_Mockup.html` and `Handover.md` share a version number. Latest = **v3.1**. A **v3.2** scope is defined but not yet built (see `06_NEXT_ROUND_v3.2.md`). Earlier rounds (v1.x → v2.1) predate the detailed record here; the reliable trail begins at v2.2.

> Reconstructed from the conversation record. The live `Handover.md` changelog is authoritative where it differs.

---

## v2.2 — Supply-chain tracking dashboard round
First checkpoint in the reliable record. Multiple dashboard changes delivered; session ended with a **zip archive** containing the updated mockup + `Handover.md` (v2.2). Established the terse-instruction / autonomous-implementation working pattern and Playwright screenshot verification.

## v2.3 → v2.6 — Rejection dashboard & station load planning
Large volume of screen changes:
- **Auto Planning:** CPM charts first moved to a side-panel (v2.3), which caused rendering overflow, then **reverted** and rebuilt with CPM charts inside **expandable table rows** (v2.4).
- **Rejection Dashboard:** rebuilt with period toggles, trend charts, a full rejection register, and WO/Client/Reference columns.
- **RM & PO Dashboards:** header-embedded searchable filters replaced top-bar filter controls.
- **Vendor OTIF ranking:** separated a **3-month average (Apr–Jun only, excluding the current partial month)** from a current-month column with a "3-mo trend" indicator. Reworked twice to get the "3-month average" definition right.
- **PO Dashboard:** Mail icon removal in v2.4 proved insufficient; the **entire Mail button column** was removed in v2.6.
- Generated a **25-sheet sample Excel** workbook (`Sparta_Sample_Reports.xlsx`) covering all Reports-tab reports.
- Added expanded **modal views to all 8 Masters & Config tiles**.
- Removed the **Exceptions** and **API & AI** screens from the nav entirely.

## v2.7 — Mail button / cleanup round
Mail buttons finalised as removed (v2.6/v2.7). Reference-vs-Project migration underway.

## v2.8 → v2.9 — Column model & Reference→Project
- Standardised the column spine everywhere: **WO → Channel → Client → Project → Vendor → Material → Status**.
- Began replacing **Reference (REF-XXXX)** with **Project** across screens.

## v3.0 — Dashboard UI updates (rejection, PPC, order route)
Picked up at v2.9, advanced to v3.0. Eight areas:
1. **Order Route & Days / Order Detail:** simplified channel/sub-channel dropdown labels ("All" instead of "B2B / B2C"; "All stores" instead of "AI / AID / Pune"); designer dropdown moved onto a single line (no wrap); mail icon button added next to XLS export on Order Route & Days.
2. **Station Load:** "Half/Full Day OT" renamed to **"Half Day"** (reframed as a **capacity reduction**, not an addition); "Use OT Capacity for" radio group **removed**.
3. **Colour unification:** three Station Load widgets (Day-wise load %, Station load, Station monthly plan) moved to the PPC Dashboard's **five-band** system via a shared **`loadBand()`** JS function.
4. **Masters & Config:** three tiles **removed** (Cycle Time Master, Product Route Master, Capacity Master) → 5 tiles remain.
5. **Working & Holiday Calendar master:** three shift definitions (General 9:00–17:30, Shift 1 07:00–15:00, Shift 2 15:00–23:00) + a working holiday date-picker.
6. **Vendor Lead-Time Master:** restructured to "Past 3-month Avg Lead Time" + "Current Month Lead Time"; rolling-window column removed.
7. **Priority Rules master:** rebuilt as a **four-tier Job Flow Priority** (1 Misc → 2 Tatkal → 3 High Priority → 4 Normal) with a **critical-path override** within each tier; **weights removed**.
8. **Cross-screen data reconciliation:** Auto Planning's descriptive text became canonical project names (e.g. "Family Room Sliding Door" for WO 0374, "Kitchens Flat 703–901" for WO 0134B), overwriting names invented in prior rounds; REF-XXXX dropped; Rejection Dashboard Reference column removed from register and trail, with Channel/Client/Project consolidated into the trail card header.

**Two inconsistencies flagged in v3.0 handover (still open):**
- Priority Control screen (#10) still uses the **old two-band** model — needs rebuild to the 4-tier model.
- **"Misc outranks Tatkal"** ordering flagged for confirmation, since Misc is described elsewhere as *uncategorised exceptions pending owner assignment*.

## v3.1 — Users & Roles configurator (current)
- **Masters & Config → Users & Roles:** tile's "Open" modal replaced with a dedicated **three-tab configurator** (Directory / Visibility map / Floor operators), reached via an "Open configurator" button.
- **Directory tab:** searchable, filterable (department + access level) table of all **68 users** — avatar, name, email, role, department, access chip, order-visibility scope.
- **Visibility map tab:** grouped cards for AI, AID, Pune, B2C, B2B and full-access (Ops/PPC), plus a plain-language callout of the **three visibility rules**: (a) designers see only their own orders; (b) AI/AID/Pune heads see their designers' orders; (c) Monesh sees all B2C + all B2B.
- **Floor operators tab:** one tile per station listing operator count + login emails, all scoped to **Station Scan only**.
- 68 users seeded on the **name@saviesahome.com** pattern; four access tiers — **Read+Write+Edit, Read+Write, View, Scan (station)**.
- Follow-up tweak: removed department **emoji icons**; shortened "AI/AID/Pune Studio" to **"AI" / "AID" / "Pune"** across Directory, filter dropdown and Visibility map.

## Parallel documentation round (v3.1 basis)
Against the new `Sparta.xlsx` (23 requirement lines + a Comments sheet), two docs were produced **without changing any files**:
- **`Sparta_Requirements_Mapping.md`** — line-by-line map of all 23 rows → exact screen/widget/steps, each tagged covered / partial / not-covered.
- **`recommendation.md`** — mockup study + prioritised v3.2 recommendation.
A stakeholder comment from **Anand Laghate** in the Comments sheet overrode the sheet text on OTIF: publish **Overall + B2C/B2B only**, no per-store breakdown.
