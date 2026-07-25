# 04 · Open Items (outstanding as of v3.1)

Carried in the live `Handover.md` §5. Reconstructed here; **confirm against the live file**, which is authoritative.

## Must-fix / decisions needed
- [x] **Rebuild Priority Control (screen #10)** to the 4-tier Job Flow Priority model + critical-path override; cascade labels into Station Scan. *(Implemented in v3.2 mockup round.)*
- [x] **Confirm "Misc outranks Tatkal"** ordering — confirmed by Anand; Misc remains the highest priority tier.
- [ ] **Resolve the week-basis inconsistency** — Bottleneck heatmap = 7-day/700% vs Station Load = 6-day/600%. Pick one before vendors code two definitions.

## Users & Roles (from v3.1)
- [ ] Real names/emails for the **14 floor operators**, the **Order Processing POC**, and the **Operations Team** (currently role-based placeholders).
- [ ] Confirm default access level of **View** for AI/AID/Pune heads and **Mary**.
- [ ] Confirm spelling of **Ganesh, Sachin, Fender** (supervisors).

## Assumptions to confirm (from v3.0)
- [ ] Confirm **"Half Day"** duration assumption (fixed 4h vs variable).
- [ ] Confirm **automatic queue re-sequencing** replaces the removed manual order-selection step for OT/Half Day.
- [ ] Replace **invented vendor current-month lead-time** figures with real data.
- [ ] Confirm the **5-band load % thresholds** company-wide.

## Data / consistency
- [ ] **Reference vs Project residue:** the Dashboard's "Expected vs committed" table may still show a `Reference (REF-XXXX)` column while v2.8–v2.9 removed Reference elsewhere. Align — pending the open decision on whether Reference ever returns.
- [ ] **Demo-data breadth:** most screens are driven by the same ~12 WOs; new "Ongoing jobs" and "Job bank" widgets will look empty. Seed 8–10 skeleton WOs (WO, channel, client, designer, status only) for list realism.
- [ ] **1-year data retention** (Sparta.xlsx row 3) deserves a visible **Data Retention & Archive** Masters tile so the policy is a stated requirement, not an assumption.

> **[verify against live file]** — the exact wording and section numbers of these items live in `Handover.md` v3.1. This list is a working copy for migration; reconcile on arrival.
