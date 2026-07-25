# Sparta — Project Migration Pack

**Project:** Saviesa "Sparta · Track · Scan · Pack" — PPC (Production Planning & Control) engine, vendor-facing requirement pack + interactive HTML mockup.
**Last known version:** v3.1 (mockup + Handover), with a defined v3.2 scope not yet built.
**Purpose of this pack:** everything a new project folder / team / model needs to pick Sparta up and keep going.

---

## ⚠️ Read this first — what is and isn't in this zip

This pack was assembled **from the project's conversation history**, not from the live files, because the working files were not present in the session that produced it. It therefore contains the **documentation layer** (history, decisions, open items, glossary, next-round scope) but **NOT** the actual deliverable files.

**You must add these files yourself** — drop them into `/source_files_GO_HERE/` to make the pack complete:

| File | What it is | Latest version |
|---|---|---|
| `Sparta_App_Mockup.html` | The interactive single-page mockup (15 screens) | v3.1 |
| `Handover.md` | The live handover doc (changelog + open items) | v3.1 |
| `recommendation.md` | Study of the mockup + v3.2 recommendations | current |
| `Sparta_Requirements_Mapping.md` | Line-by-line map of Sparta.xlsx → screens | current |
| `Sparta_Vendor_Requirement_Document_v2_Colour_Tracked.docx` | 23-page vendor requirement doc | v2 |
| `Sparta.xlsx` | Latest 23-line requirement sheet (+ Comments sheet) | — |
| `Factory_Tracker_Live.xlsx` | Real source data (227 WOs, 1,569 rows, 87 cols) | — |
| `Sparta_Sample_Reports.xlsx` | 25-sheet sample reports workbook | — |

The fastest way to get a **truly complete** zip: send me your latest project zip (the one you upload each round) and I'll bundle the real files together with these docs.

---

## Suggested target folder structure

```
Sparta/
├── mockup/
│   └── Sparta_App_Mockup.html        ← the live artifact
├── docs/
│   ├── Handover.md                   ← keep versioning this every round
│   ├── recommendation.md
│   ├── Sparta_Requirements_Mapping.md
│   └── Sparta_Vendor_Requirement_Document_v2_Colour_Tracked.docx
├── source_data/
│   ├── Factory_Tracker_Live.xlsx     ← real data the mockup is grounded in
│   ├── Sparta.xlsx                   ← requirement sheet
│   └── Sparta_Sample_Reports.xlsx
└── migration/                        ← the contents of THIS pack
    ├── README_MIGRATION.md
    └── docs/
        ├── 01_PROJECT_OVERVIEW.md
        ├── 02_VERSION_HISTORY.md
        ├── 03_DECISIONS_AND_PROTECTED_FEATURES.md
        ├── 04_OPEN_ITEMS.md
        ├── 05_GLOSSARY.md
        └── 06_NEXT_ROUND_v3.2.md
```

## How to resume work (for a person or a downstream model)

1. Read `docs/01_PROJECT_OVERVIEW.md` for what Sparta is and who the stakeholders are.
2. Read the **live** `Handover.md` (v3.1) — it is the source of truth for current state.
3. Cross-check `docs/03_DECISIONS_AND_PROTECTED_FEATURES.md` before changing anything — several features were **deliberately removed** and must not be reintroduced.
4. Pick up scope from `docs/06_NEXT_ROUND_v3.2.md`.
5. Every editing round: view exact current HTML before any edit, validate HTML tag balance + JS syntax (Python/Node checks) after each change, then bump `Handover.md` with a changelog entry and refreshed open items.

## Provenance note

These docs are a faithful reconstruction from the project record. Where a detail (exact demo values, spelling of names, precise thresholds) should be confirmed against the live files, it is flagged inline with **[verify against live file]**. Treat the live `Handover.md` and `Sparta_App_Mockup.html` as authoritative wherever this pack and those files disagree.
