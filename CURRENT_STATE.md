# CURRENT STATE: read this first

_Last updated: November 3, 2026_

## What's live
- **Master build: Chef Kitchen Recognition 11.4** (build ID `CHEF-KITCHEN-RECOGNITION-11.4`, parent `HOUSE-BACKBONE-COMMISSIONING-11.3`).
- It came from the Drive file `OPEN_THIS_LIVING_OBSERVATORY_CHEF_KITCHEN_RECOGNITION_11_4.html`
  (31,465,005 bytes, sha256 `ec7774c3360a184e5f575ad88e3e287298c0f66348efedcf432e699fc7d1279b`, last changed Sept 10, 2026).
- Commit 1 is that file split into parts with **no behavior changes**. It was checked side by side with the original: same 15 buttons and the same panels, no new errors, and the 3-D house renders.
- Commit 2 fixes the phone layout:
  - All 15 bottom buttons now show on a phone (3-column grid; before, 9 were hidden in a scroll area).
  - On a phone, only one panel is open at a time, and panels sit above the buttons.
  - A model that fails to load no longer stops everything. The rest keeps working, and asking again (ENTER PROPERTY / EXIT PROPERTY / LOAD DÉCOR) retries it.

## How to change the version
Edit `js/core/version.js` only. Every label, title and build ID reads from there.

## What's next (in order)
1. **Merge the ATC route from build 10.1** (`ATC_ACCESS_CONSTRUCTION_10_1`): garage-to-ATC route and access construction.
2. **Merge North Survey 0.2** (`CANDIDATE_10_0_CHILD_NORTH_BOUNDARY_SURVEY_LAUNCH_0_2`): the NORTH SEARCH three-point camera sweep.
3. **Merge Welfare / Hub 1.1** (`CANDIDATE_10_0_CHILD_WELFARE_REPAIR_GATE_1_1`): Equipment Room Hub, House-vs-ATC diagnostic, and the ITMO messaging steps 0.4 to 1.1. In that file these are ten patches stacked on top of each other. They should be folded into the main code, not stacked again.
4. Split `js/app/main.js` further: house, ATC, kitchen, panels and loader in separate files.

Do one merge per commit and test on a phone after each.

## Known issues
- `js/app/main.js` is still about 185 KB in one file.
- The internal chassis contract still says `11.2-atc-fax-ding-email-orientation` (left as is; it's a data-contract version, not the build label).
- The header sub-line still says "Candidate 11.3 protected" (descriptive text from the original).
- Saved state lives in each browser's localStorage. It doesn't follow you between devices or between old builds.
- The 3-D models total about 39 MB, so the first load on a phone is slow.

## Builds that exist elsewhere and are NOT here yet
Joseph has these outside this Drive folder. They should be found and compared before anything is called "newest":
- **11.4H** (quarantined), **11.4I** (frozen pending lineage reconciliation), **11.4J** (abandoned, not a parent). All three are named in the Continuity Ledger, Sept 14, 2026.
- **AVERY AV06**
- The Gate 9.0 work (Marcus Reed and Elias Mercer visual recovery).

## Rules of thumb
- One master, here. Don't start a new "OPEN_THIS_…html" file.
- Every change is a commit with a plain sentence saying what and why.
- Old builds are kept as history; they don't become current just because they're newer.
