# 01 · Project Overview

## What Sparta is
**Sparta ("Track · Scan · Pack")** is a factory Production Planning & Control (PPC) system for **Saviesa** (Saviesa Home), a company that manufactures **modular furniture, kitchens and interior fit-outs**. The work to date is a **vendor-facing requirement pack**: a 23-page colour-tracked Word requirement document plus an **interactive HTML mockup** (single-page app, 15 screens) that communicates the full system specification to software vendors who will build it.

## The one non-negotiable premise
**Sparta must be the PPC calculation engine.** Smartsheet is only the *current manual reference* and must **not** be the final system. Every screen ties back to named calculation rules (**Logic A–L**) and recalculation events (**Triggers T1–T13**). This framing was stated at the outset and repeated throughout — keep it central.

## Grounded in real data
The mockup is not invented from thin air. It is grounded in a real uploaded file, **`Factory_Tracker_Live.xlsx`**:
- 227 work orders
- 1,569 component rows
- 87 columns
- 140 real process/station names

So the WO numbers (e.g. **0134B, 0374, 0428B, 0503, 0469B**), clients (**Saakshi Construction, Priyanshu Gurav, GTM Networks, A.R. Hirlekar**), vendors (**Alfa, Rupal, Metis, VMS, Icrotone, Brother**), and station/process names used throughout are **real**. Do not replace them with placeholders.

## Stakeholders
- **Anand (Anand Laghate)** — the primary driver/owner. Communicates in terse, list-style instructions without explaining why, and expects the implementer to infer all implementation detail, invent sensible demo data, maintain cross-screen consistency, and update documentation autonomously.
- **Monesh** — has a one-off cross-channel visibility exception (sees all B2C + all B2B).
- **Mary**, **AI/AID/Pune heads** — access-level decisions pending confirmation (see Open Items).
- Floor supervisors named in the roles config: **Ganesh, Sachin, Fender** (spellings to confirm).

## The 15 screens (mockup section IDs)
| # | Screen | Section ID |
|---|---|---|
| 1 | Dashboard (PPC) | `s-dash` |
| 2 | RM Dashboard (Raw Materials) | `s-rm` |
| 3 | PO Dashboard (Purchase Orders) | `s-po` |
| 4 | Rejection Dashboard | `s-rej` |
| 5 | Auto Planning | `s-plan` |
| 6 | Process (family) view | `s-proc` |
| 7 | Order Route & Days | `s-oroute` |
| 8 | Order Detail | `s-order` |
| 9 | Station Load | `s-load` |
| 10 | Priority Control | `s-prio` |
| 11 | Station Scan | `s-scan` |
| 12 | Packing | `s-pack` |
| 13 | Masters & Config | `s-mast` |
| 14 | Report Scheduler (cron) | `s-cron` |
| 15 | Reports | `s-rep` |

## Channels
- **B2B** and **B2C**, with sub-sections **AI / AID / Pune** (note: "Studio" was dropped from these labels in v3.1 — they are just "AI", "AID", "Pune").

## Working style / house rules for edits
- View exact current HTML before any `str_replace`; never edit blind.
- After every significant change, validate **HTML tag balance** and **JS syntax** (Python and Node.js checks), and where useful run jsdom/Playwright functional checks on filters, renderers and modals.
- Invent demo data where needed for realism, but keep it consistent across screens.
- Reconcile cross-screen data (project names, columns) to a single source of truth.
- Bump `Handover.md` every round with a changelog entry + refreshed open items.
