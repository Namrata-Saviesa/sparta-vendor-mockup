# 03 · Decisions & Protected Features

This is the "**inputs given over the versions**" file — the accumulated rulings that a new implementer must respect. **Several features were removed on purpose; do not reintroduce them.**

---

## A. Deliberately REMOVED — do not bring back
| Removed thing | Round | Note |
|---|---|---|
| **Mail buttons / Mail column** on PO Dashboard pending table | v2.6 / v2.7 | Icon removal in v2.4 was insufficient; the whole column went. |
| **Exceptions** screen | v2.x | Removed from nav entirely. |
| **API & AI** screen | v2.x | Removed from nav entirely. |
| **Priority weights** | v3.0 | Priority Rules rebuilt as tiers; numeric weights removed. |
| **Masters tiles: Cycle Time Master, Product Route Master, Capacity Master** | v3.0 | 8 tiles → 5. |
| **"Use OT Capacity for" radio group** (Station Load) | v3.0 | Removed when "Half Day" reframing landed. |
| **Rolling-window column** (Vendor Lead-Time Master) | v3.0 | Replaced by Past-3-mo-avg + Current-month. |
| **Reference / REF-XXXX codes** | v2.8–v3.0 | Replaced by **Project** everywhere. *(One residual spot flagged — see Open Items.)* |
| **Per-store OTIF breakdown** (AI/AID/Pune) | v3.1 doc | Overridden by Anand's comment: Overall + B2C/B2B only. |
| **Department emoji icons** in Users & Roles | v3.1 | Removed in the follow-up tweak. |

> The `Sparta_Requirements_Mapping.md` file explicitly instructs the executing model **not** to reintroduce any of these. Repeat that instruction in every handover.

## B. Standing conventions (apply everywhere)
- **Column spine:** WO → Channel → Client → Project → Vendor → Material → Status.
- **Date discipline (the single most important idea):** three distinct dates, never conflated —
  - **Committed** = contractual, never auto-changed;
  - **Revised** = PPC Head only, audit-logged with a mandatory reason code;
  - **Sparta ECD** = engine-computed.
- **Reason codes (reused, do not invent new lists):** Overtime approved / Vendor expedite / Customer date renegotiated / Capacity added / Other. These double as the **date-revision** reason codes.
- **Colour language:** one shared **5-band `loadBand()`** function drives all load colouring; changing thresholds is a one-line company-wide edit. Protect this — don't fork per-screen colour logic.
- **3-month convention:** "3-month average" = **Apr–Jun**, i.e. it **excludes the current partial month**, shown beside a separate current-month column with a trend indicator. (This was corrected twice — get it right.)
- **Week basis (UNRESOLVED):** Bottleneck heatmap sums **7 days (700%)**; Station Load uses a **6-day week (600%)**. Both documented but inconsistent — resolve before vendors code two week definitions. *(Open item.)*
- **Labels:** channel/sub-channel dropdowns read "All" / "All stores" (not "B2B / B2C" / "AI / AID / Pune"); sub-sections are "AI"/"AID"/"Pune" (no "Studio").

## C. Priority model (current definition)
Four-tier **Job Flow Priority**: **1 Misc → 2 Tatkal → 3 High Priority → 4 Normal**, with a **critical-path override** inside each tier. No weights.
- ✅ **v3.2 implemented in mockup:** the **Priority Control screen (#10)** has been rebuilt from the old **two-band High/Normal** board to the 4-tier model, and the 4-tier labels have been cascaded into the Station Scan queue's Priority column.
- ✅ **Confirmed by Anand:** ranking **Misc above Tatkal** is intentional. Keep Misc as the highest priority tier.

## D. Users & Roles rulings (v3.1)
- **68 users**, emails on **name@saviesahome.com**.
- **Four access tiers:** Read+Write+Edit / Read+Write / View / Scan (station-only).
- **Three visibility rules:** designers → own orders only; AI/AID/Pune heads → their designers' orders; **Monesh → all B2C + all B2B** (the one cross-channel exception).
- Floor operators are scoped to **Station Scan only**.

## E. Stakeholder comment that overrides sheet text
**OTIF:** publish **Overall + B2C/B2B only** — "further breaking of OTIF report serves no purpose" (Anand Laghate). Implement as a three-row OTIF trend widget (Overall / B2C / B2B) with current month + Apr–Jun average + the three individual months, mirroring the PO Dashboard Vendor-OTIF convention. **Do not** build store-level OTIF. Record this so it isn't re-litigated.
