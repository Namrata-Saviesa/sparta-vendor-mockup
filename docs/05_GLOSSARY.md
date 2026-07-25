# 05 · Glossary & Engine Reference

## Core terminology
| Term | Meaning |
|---|---|
| **PPC** | Production Planning & Control — what Sparta is. |
| **WO** | Work Order (e.g. 0134B, 0374, 0428B, 0503, 0469B). |
| **ECD** | Expected/Estimated Completion Date. **Sparta ECD** = the engine-computed one. |
| **CPM** | Critical Path Method — scheduling basis for Auto Planning. |
| **RDS** | Rate-Determining Step (a.k.a. resource-demand station) — the bottleneck step on a path. |
| **Float** | Working days a path can slip before it becomes critical. |
| **OTIF** | On-Time-In-Full — published Overall + B2C/B2B only (per stakeholder ruling). |
| **Tatkal** | Urgent / rush orders (priority tier 2). |
| **ALP** | Anodized profile family; ALP consolidated cutting-list barcode is a requirement. |
| **PRF Assembly** | A station/process ("PRF Assembly"). |

## Date model (see doc 03)
- **Committed** — contractual, never auto-changed.
- **Revised** — PPC Head only, audit-logged, mandatory reason code.
- **Sparta ECD** — engine-computed.

## Logic rules (engine calculation rules) — Logic A–L
Named calculation rules referenced across screens. Individual letters seen in the record include **A, B, D, G, H, I, J, K, L**. The mockup ties screens back to these; the full definitions live in the vendor requirement document / mockup engine notes. **[verify definitions against live files]**

## Triggers T1–T13 (recalculation events)
Events that fire an engine recalculation. **T13** = the overtime-recalculation trigger (seen explicitly). Full T1–T13 list lives in the requirement doc. **[verify against live files]**

## Process families
Prelam, Postlam, PU Finish, Veneer, ALP Anodized, Solid Wood, Glass, Leather, Savvy Accessories.

## Stations (examples)
Edge Band, PRF Assembly, CNC, Hot Press, Beam Saw. (140 real process/station names exist in `Factory_Tracker_Live.xlsx`.)

## Vendors (real)
Alfa, Rupal, Metis, VMS, Icrotone, Brother.

## Clients (real, examples)
Saakshi Construction, Priyanshu Gurav, GTM Networks, A.R. Hirlekar.

## Channels
- **B2B**, **B2C**, each with sub-sections **AI / AID / Pune** (no "Studio" suffix).

## Shift definitions (Working & Holiday Calendar master)
- General: **09:00–17:30**
- Shift 1: **07:00–15:00**
- Shift 2: **15:00–23:00**

## Access tiers (Users & Roles)
Read+Write+Edit · Read+Write · View · Scan (station-only). 68 users, `name@saviesahome.com`.
