# Design QA — Posgram measured-pupil revision

## Source and state

- Visual source: `C:/Users/LENOVO/Downloads/screencapture-sim-dev-posgram-id-instansi-461-kesiapan-tka-2026-10-07-09_01_29.png`, 1920 × 1963 pixels.
- Current requirements: `C:/Users/LENOVO/.codex/attachments/4036ffc8-9c00-49c2-9a50-33cc7a800d9e/Pasted text.txt`.
- Implementation: local Vite preview, `http://127.0.0.1:4173/`.
- Desktop evidence: `qa-evidence/desktop-pretest.png`, 1920 × 2475 pixels; CSS viewport 1920 × 1080, deviceScaleFactor 1.
- Mobile evidence: `qa-evidence/mobile-pretest.png`, 390 × 3732 pixels; CSS viewport 390 × 900, deviceScaleFactor 1.
- Also tested 768, 1024, and 1440 CSS pixel widths; no document horizontal overflow.
- Default state: Pretest / Semua Paket / TA 2026–2027 / Matematika subtopic filter.
- Both source and desktop evidence use the same 1920px content density. Full-page heights differ intentionally because the requested class/group breakdown, available-data metrics, and filtered subtopic section are different from the old screenshot. Height differences are not interpreted as cloning defects.

## Full and focused comparison

The original visual source and first desktop/mobile captures were opened in a single comparison tool result. Revised desktop/mobile evidence and focused crops were then inspected together after fixes. The existing purple primary color, thin borders, white cards, soft lavender readiness card, rounded components, subtle shadows, and compact row presentation are retained. Section hierarchy and copy intentionally follow the latest brief, overriding the original screenshot's coverage and navigation semantics.

Focused evidence: `qa-evidence/hero-detail.png` and `qa-evidence/classes-detail.png`. These confirm the 44% readiness, basis of 11 measured pupils, known-population distribution, class counts of 4/1/0, limited-data status for 6B, missing readiness for 6C, and separated unassigned group. Further evidence covers post-test, limited subtopic, no-data subject, mapping dialog, and tablet layout.

## Fidelity surfaces

- Typography: existing Inter stack, weights, title hierarchy, and compact supporting text retained. No overlapping text found in inspected desktop/mobile crops. Measured-pupil basis is visible beside the gauge; limited readiness values use less emphasis.
- Spacing/layout: class → subject → filtered subtopic → operational status order confirmed. Section gaps restored after moving the priority card. Mobile table displays status beside readiness; unassigned-group content wraps into two readable rows.
- Colors/tokens: existing Posgram purple/lavender palette and thin gray borders retained. Amber indicates limited/unassigned information; neutral gray indicates missing data. Distribution retains the existing semantic colors.
- Assets: supplied screenshot logo reused; standard Phosphor UI icons retained. Gauge and bars are data visualizations. No generated imagery or replacement branding added.
- Copy/content: no target-population denominators, coverage percentages, or coverage status labels in the dashboard or inspected dialogs. Readiness has measured-pupil context. Distribution percentages explicitly use measured pupils. No-data results show —, while genuine zero-valued measurements remain valid.

## Comparison history and fixes

1. P2: mobile document expanded to 498px at a 390px viewport. A positioned screen-reader-only table label escaped its scrolling container. Fixed the positioning context and made the table adapt to mobile width. Re-capture at 390px confirms document width equals viewport width.
2. P2: mobile status column was offscreen, hiding the low-sample warning; the unassigned group also compressed its text into a narrow column. Moved the status below the readiness within mobile table cells and corrected the unassigned flex bases. Revised mobile capture shows both warnings without horizontal scrolling.
3. P2: moved subject/priority sections touched with no gap. Restored the existing 18px section rhythm. Revised desktop capture confirms spacing.
4. Missing favicon caused a 404 console entry. Added the existing supplied logo as favicon. Final browser checks report no console/page errors.

## Interaction and data checks

- Browser: stage/period/package filters, category explanation, method explanation, subject filter, low-data unranked subtopic, missing-data em dash, pupil search/mapping, mobile navigation, and dialog closing passed.
- Mapping Nadia to 6A increases that class's measured count from 4 to 5 while preserving overall readiness and measured count. Unassigned pupils decrease from 10 to 9 and unassigned measured pupils from 6 to 5.
- Nine aggregation tests passed, including independence from an unvalidated roster denominator, equal pupil/competence weighting, invalid-data exclusion, zero versus missing-data distinction, and operations/filter consistency.
- Browser results: `qa-evidence/interaction-results.json`.
- Production build passed.

## Remaining limits

- This is a dummy-data prototype. The 1–2 pupil limited-data threshold is a documented simulation assumption, not a statistical representativeness guarantee.
- P3: the provided logo is a screenshot crop; a transparent original brand asset would improve its header integration. Its use is unchanged from the existing prototype.
- No backend persistence or production API integration was requested.

final result: passed

## Fixed top bar update

The 54px top bar is now fixed at viewport top with a matching body offset. Browser checks at 1920px and 390px confirmed its y position remains 0 after scrolling 600px, initial content begins below it, and no horizontal overflow occurs. Updated initial captures and inspected scrolled captures: `qa-evidence/desktop-fixed-topbar.png`, `qa-evidence/mobile-fixed-topbar.png`. Existing typography, spacing, color, assets, and copy remain consistent. Production build passed.

final result: passed

## Header text cleanup

Removed the visible stage label and the entire metadata row below filters (period range, stage-only note, simulation badge). Retained the accessible stage group name, toggle controls, package filter, and year filter. Browser-rendered desktop/mobile evidence inspected together: `qa-evidence/desktop-clean-header.png` and `qa-evidence/mobile-clean-header.png`. Confirmed a 20px gap before readiness cards, no document horizontal overflow, and preserved typography/color/component styles. Build passed.

final result: passed

## Measured status distribution and class table revision

Latest brief: `C:/Users/LENOVO/.codex/attachments/1d2c9d52-3199-4781-9124-dc6a7a3e896b/Pasted text.txt`. The user explicitly selected separate simulated assessment marks to retain the requested default 5/6/0 distribution at the new 65/85 boundaries. Existing competency-based readiness values remain computed from their original source.

Source comparison: previous prototype header capture `qa-evidence/desktop-clean-header.png` was viewed together with new focused hero/class captures and mobile implementation. After aligning score ranges directly below status names and making the administrative divider dashed, re-opened `hero-detail.png`, `classes-detail.png`, and `distribution-empty.png` together. Latest desktop full capture is 1920 × 2418; mobile is 390 × 3600 at deviceScaleFactor 1. Intentional section copy/table restructuring follows the latest brief.

- Typography/copy: Kondisi Kesiapan Murid has the 11-pupil basis directly beneath its title. Status names precede secondary score bands; pupil counts are primary and percentages secondary. Range, count, percentage, and proportion bars all agree with the authorized assessment fixtures. Existing Inter hierarchy retained.
- Layout/spacing: class table has exactly four visible columns: Kelas / Kelompok, Total Murid, Murid Terukur, Kesiapan. Counts are 5/4, 5/1, 5/0, with readiness 42%, 58%, —. Data terbatas is secondary text under 58%, not another column. The unassigned group follows a dashed divider with an amber surface and mapping CTA. All four columns remain visible on mobile.
- Colors/assets: original purple controls/cards/icons and semantic status colors retained. No new image assets. The administrative group uses the existing amber treatment.
- Data correctness: total group counts are actual registered members, not school target coverage. Unassigned readiness is calculated (44% with current fixtures) rather than hardcoded to the illustrative 45%. Mapping changes group totals/measurements while preserving the overall measured aggregate.
- Empty state: requested heading and helper render without misleading 0% bars; confirmed in a browser-rendered isolated instance of the same distribution component.

Browser checks passed at 1920, 1440, 1024, 768, and 390px; no page overflow or console errors. Stage/period/package and subject filters, category info, limited/empty states, and mapping passed. Eleven meaningful data tests passed, including exact category boundary cases, distinct assessment marks, equal package weighting for statuses, and registered totals after mapping. Final production build passed.

No actionable P0/P1/P2 findings remain for this revision. Existing prototype limitations (dummy data and session-only mapping) remain.

final result: passed

## Inline score-band labels

Moved the score bands beside their category names with an 8px gap and baseline alignment, preserving their smaller muted typography. Compared the previous `hero-detail.png` against the new `inline-score-bands-1920.png` and `inline-score-bands-390.png` together. Browser checks at 1920, 390, and 320px confirm all three bands remain on the category-name line without page overflow. Counts, percentages, bars, colors, and category wording are preserved. Build passed.

final result: passed

## Available-data text cleanup

Removed the heading-side stage note and the multiple-assessment helper paragraph from Data yang Tersedia. Browser evidence inspected together: `desktop-available-data-clean.png` and `mobile-available-data-clean.png`. All three metric cards, typography, tokens, and section spacing remain intact; desktop/mobile document widths have no overflow. Production build passed.

final result: passed

## Dashboard footer note removal

Removed the requested simulation/stage-separation text and its accompanying info icon. Retained the existing calculation-info link. Desktop/mobile footer screenshots (`desktop-footer-clean.png`, `mobile-footer-clean.png`) were inspected together; alignment, typography, and spacing remain consistent. Browser checks and production build passed.

final result: passed

## Active and upcoming assessment accordion

Revised the existing Status Pelaksanaan Asesmen section while retaining all four summary cards and their existing colors, spacing, counts, and interactions. The nested accordion is collapsed by default and displays only its header, chevron, and filtered session count. Expanding reveals ongoing and scheduled future sessions, with ongoing first and upcoming dates ascending. Completed, unscheduled, cancelled, and expired entries are excluded. Rows use thin dividers rather than individual cards; badges distinguish Berlangsung and Akan datang. The expanded empty state uses the exact requested copy.

Inspected focused desktop/mobile captures together: `assessment-collapsed-desktop.png`, `assessment-expanded-desktop.png`, `assessment-collapsed-mobile.png`, `assessment-expanded-mobile.png`, and `assessment-empty-desktop.png`. Final expanded captures disable transition animations so the chevron shows its settled orientation. Typography, purple tokens, white surfaces, border treatment, icon system, and responsive summary layout remain consistent with the existing dashboard. The default scope contains three qualifying sessions; packet and period filters update the count and list. Dates use the existing 7 October 2026 demo snapshot.

Lihat Detail opens the full Riwayat & Status Asesmen view at `#/asesmen`, including completed and unscheduled entries. Inspected `assessment-history-desktop.png` and `assessment-history-mobile.png`; mobile keeps table scrolling inside its container without document overflow. Verified return navigation on desktop/mobile and all 30 default history entries, including 17 completed, 10 unscheduled, one ongoing, and two upcoming sessions.

Sixteen data tests passed, covering aggregation, score boundaries, session exclusion, inclusive date boundaries, chronological ordering, filtered scopes, summary/history agreement, and Indonesian date formatting. Full browser interaction checks passed at 1920, 1440, 1024, 768, and 390px, including accordion click/keyboard toggling, collapsed/expanded/empty states, history navigation, and existing dashboard controls. No console/page errors or document overflow. Production build passed.

No actionable P0/P1/P2 findings remain for this revision.

final result: passed

## Distribution footnote removal

Removed the requested proportional-percentage footnote from Kondisi Kesiapan Murid. Inspected `distribution-no-footnote-1920.png` and `distribution-no-footnote-390.png` together. The measured-pupil basis, inline score bands, counts, percentages, and three bars remain intact. Typography, colors, and section spacing remain consistent; desktop/mobile browser checks confirm the text is absent and there is no page overflow.

final result: passed

## Measured readiness interpretation

Source visual truth: existing card captures `qa-evidence/readiness-before-status-1920.png` and `qa-evidence/readiness-before-status-390.png`. Compared them together with `readiness-status-1920.png` and `readiness-status-390.png` in the same inspection. CSS viewports are 1920x1000 and 390x1000, deviceScaleFactor 1; focused source and implementation crops are respectively 695x339 and 354x286 pixels, with no density normalization needed. The latest full dashboard evidence is `desktop-pretest.png` and `mobile-pretest.png`; existing full-dashboard interaction checks confirm the section hierarchy and responsive behavior remain intact. New copy/status details follow the user's explicit revision, rather than the prior card's generic sentence.

Required fidelity surfaces:
- Fonts/typography: retained Inter, original 44% focal size, title weight, and gauge label. Status is secondary emphasis, followed by the measured-pupil basis. Copy wraps naturally at 390px and 320px without truncation.
- Spacing/layout: card dimensions, gauge position/size, footer divider, and surrounding layout remain consistent with the source. Badge occupies the former generic-copy space, with a 12px contextual gap. Tooltip overlays the page without changing layout. No document overflow at 1920, 1440, 1024, 768, 390, or 320px.
- Colors/tokens: purple gauge and lavender surface remain; low/medium statuses use existing soft amber badge tokens, and high readiness uses existing green. No aggressive warning colors introduced.
- Assets/icons: existing Phosphor notebook, target, and info icons retained. Logo and raster assets unchanged.
- Copy/content: 44% displays Kesiapan Rendah, with the 11-pupil basis directly beneath it. Removed the generic readiness-scope sentence and avoided another duplicate explanation. Footer disclaimer retained verbatim. Tooltip and click dialog include all three requested names, thresholds, and descriptive paragraphs with dividers and readable line breaks.

Additional evidence inspected: `readiness-tooltip-1920.png`, `readiness-tooltip-390.png`, `readiness-category-dialog-mobile.png`, `readiness-empty-mobile.png`, `readiness-category-64.png`, `readiness-category-85.png`, and `readiness-status-320.png`. Empty state shows an em dash, the exact requested heading/helper, and no readiness status. A valid zero with measured pupils still displays 0% and Kesiapan Rendah.

Validation: 17 data tests passed, including exact 63/64/84/85 boundaries, fractional interval continuity, and invalid-value handling. Focused browser tests passed for hover/focus/click/Escape, category descriptions, empty state, valid zero, footer retention, and no console errors. Full existing dashboard checks passed, including filters, distribution, mapping, classes, subject priorities, assessment accordion, and history navigation. Production build passed.

No actionable P0/P1/P2 findings; no visual fix iteration was needed after the first source/implementation comparison. Implementation checklist complete: dynamic badge, contextual copy, accessible category information, empty-state handling, responsive verification.

final result: passed

## Measured-readiness disclaimer removal

Removed the requested footer disclaimer, its info icon, and footer divider from Kesiapan Murid Terukur. Latest user instruction supersedes the earlier footer requirement. Inspected `readiness-no-disclaimer-1920.png` and `readiness-no-disclaimer-390.png` together. The 44% gauge, Kesiapan Rendah badge, measured-pupil basis, and category info control remain intact. Existing typography, purple/amber colors, and card padding remain consistent. Desktop/mobile browser checks confirm removal and no page overflow. Updated the existing browser check to reflect the new footer requirement.

final result: passed

## Readiness tooltip ranges and gauge label cleanup

Updated the shared readiness category guide (hover tooltip and click dialog) to use the exact range copy: Nilai < 65, Nilai 65–84, Nilai ≥ 85. Aligned the dynamic low/medium boundary to 65 so the badge agrees with its explanation. Removed the secondary label beneath the gauge percentage. Compared `readiness-no-disclaimer-1920.png` and `readiness-no-disclaimer-390.png` with the new `readiness-status-1920.png` and `readiness-status-390.png`; inspected `readiness-category-dialog-mobile.png`. Existing typography, gauge size, card spacing, purple/amber/green palette, icons, status names, and measured-pupil context are retained. Twelve data tests passed, including revised boundaries. Focused browser checks passed at 1920, 390, and 320px, including hover/click/focus/Escape, empty and valid-zero states, label absence, and exact range wording; no page overflow or console errors.

final result: passed

## Submaterial detail available-data chip removal

Removed the Ada data chip from shared submaterial detail rows. Scores and pupil counts remain visible; limited/empty data badges still convey their applicable states. Inspected `submaterial-no-available-chip-1920.png` and `submaterial-no-available-chip-390.png` together: existing modal typography, colors, spacing, icons, and responsive layout are retained. Desktop/mobile browser checks confirm the available-data chip is absent, the default 40% score remains, and the nutrition detail retains Data terbatas.

final result: passed

## Dependent dashboard filters and custom period

Source visual truth: existing filter toolbar in `qa-evidence/desktop-clean-header.png` (1920x900) and `mobile-clean-header.png` (390x900). These earlier captures also contain card copy subsequently changed by authorized revisions; comparison for this task targets the filter controls and surrounding header rhythm. Compared source and implementation together with `filters-default-1920.png` (1920x2315) and `filters-default-390.png` (390x3443), at deviceScaleFactor 1. Full implementation capture viewports are 1920x1080 and 390x1080; no density rescaling was used during browser capture. Focused implementation evidence: `filters-toolbar-1920.png`, `filters-toolbar-390.png`, `filters-toolbar-active-1920.png`, and `filters-toolbar-active-390.png`.

Required fidelity surfaces:
- Fonts/typography: existing Inter controls, readable 13px select copy, original stage-toggle hierarchy, and native dropdown/date inputs are retained. Labels scale their width to content, with a character-width fallback for browsers without field-sizing support.
- Spacing/layout: 43px controls, existing 10px gaps, rounded borders, and icon sizing remain. All four filters sit horizontally with the stage controls at desktop width; narrow layouts wrap without shrinking controls. Mobile default filters form two rows. Long active package/range labels use additional rows when needed.
- Colors/tokens: original white controls and purple icons remain. Active choices receive a subtle lavender surface/border using existing palette values. Existing dashboard gauge, distributions, cards, and operational colors are retained.
- Assets/icons: existing Phosphor funnel/book/notebook/calendar/chevron icons are reused; no new raster assets or logo changes.
- Copy/content: defaults are Semua Kategori, Semua Mapel, Semua Paket, TA 2026/2027. Options derive from the category/subject package catalog. Custom period uses the requested start/end labels and compact Indonesian range. The requested global empty heading/helper appear verbatim. Previously removed notes/chips remain absent.

Comparison history: the first mobile date-picker capture revealed the popover was positioned against the document instead of the filter toolbar (P2). Fixed the relative anchor on the mobile toolbar, preserving a full-width inline popover. Reduced unnecessary control width with field-sizing so defaults wrap into two neat rows. Re-captured and inspected `filters-date-picker-390.png`; the popover now appears immediately below the toolbar without page overflow. Added a browser assertion for its exact anchor. Final screenshots disable finite transitions so empty-state progress bars are captured at their settled zero width rather than during animation.

Additional states inspected: `filters-active-390.png`, `filters-date-picker-390.png`, and `filters-empty-390.png`. Default values remain 44%, 11 pupils, 5/6/0 distribution, 12 analyzed assessments, and 13/1/4/10 operational summaries. All analytics and operational history use the same scope. Custom ranges include endpoints and overlapping dated sessions; undated unscheduled entries are excluded. Package/subject children reset only when invalid. The local priority subject selection falls back to a subject within the global filter scope.

Validation: 22 data tests passed, including child-reset semantics, shared scope, stable package membership, date boundaries/overlap, empty combinations, aggregation, and category thresholds. Browser checks passed at 1920, 1440, 1024, 768, 390, and 320px for defaults, dependencies, all sections, full history, date validation/application, range labels, empty results, and academic-year restoration. Existing full dashboard checks passed, including mapping and assessment accordion navigation. No console/page errors or document overflow. Final production build passed.

Implementation checklist complete. No actionable P0/P1/P2 findings remain after the mobile popover fix.

final result: passed

## Class drill-down pupil status terminology

Revised the existing class-detail entry point opened from a class name; it remains the same modal shell rather than a separate route. Source visual truth: `qa-evidence/class-detail-before-1920.png` and `class-detail-before-390.png`. Compared them together with `class-detail-after-1920.png` and `class-detail-after-390.png`, at the same 1920x1080 and 390x1080 CSS viewports with deviceScaleFactor 1. Modal widths remain 640px and 366px respectively. Increased content height follows the explicitly requested distribution and five-column pupil table; the existing 85vh scroll limit and sticky close/header remain.

Required fidelity surfaces:
- Fonts/typography: retained Inter, original 32px purple class aggregate, section-title weights, secondary copy, and badge hierarchy. Mobile table uses existing small UI sizes to keep all five columns readable at 390px; 320px retains limited scrolling inside the table container.
- Spacing/layout: original modal radius, shell width, body padding, dividers, and close control retained. Distribution uses existing row anatomy and bars; the pupil list becomes the requested table with filter/sort controls. No new dashboard section or class route was added.
- Colors/tokens: original purple aggregate/icon treatment remains. Pendampingan and Penguatan use gentle existing amber treatments, Pengayaan green, and Belum Terukur neutral gray. No aggressive red warning was introduced.
- Assets/icons: existing Phosphor users/target/check/info/funnel/chevrons/arrow icons reused; no raster assets changed.
- Copy/content: class pupil statuses are exclusively Pendampingan, Penguatan, Pengayaan, and the missing-data state Belum Terukur. Thresholds are <64, 64 to below 85, and >=85, shared by its distribution and pupil table. Tooltip and helper match the brief. Aggregate interpretation labels appear only in the class summary, never in individual statuses. The existing dashboard's previously requested 65/85 distribution remains outside this scoped revision.

Data correctness: class drill-down retains the same competency-based pupil readiness already shown in its prior detail; both pupil status and class distribution use that value. The class average continues to agree with the dashboard class row. Missing/invalid values are excluded from the mean and distribution denominator; valid zero remains measured. Assessment counts use distinct assessment IDs. Default 6A pretest is computed as four measured pupils in Pendampingan, with Dimas Belum Terukur; illustrative distribution counts were not hardcoded. Its post-test distribution is 0/4/1. Fractional values near a boundary retain enough displayed precision to avoid implying another status through rounding.

Comparison history: the first implementation inspection found a redundant sorting chevron and the pupil status/action columns initially outside the mobile viewport (P2). Removed the duplicate chevron and adjusted mobile column proportions so all five columns are visible at 390px. Re-captured and inspected `class-detail-after-390.png` against its source; table status/action remain accessible and no document overflow occurs. At 320px, scrolling stays inside the table. Additional evidence: `class-detail-empty-390.png`, `class-status-boundaries.png`, `class-status-tooltip-390.png`, and `class-pupil-detail-390.png`.

Validation: 27 data tests passed, including exact 63/64/84/85 cases, fractional boundary continuity, valid zero, invalid/missing results, equal pupil weighting, distinct assessment counts, per-class scope, sorting, and unchanged aggregate values. Browser checks passed at 1920, 390, and 320px for class summaries, distribution proportions, requested table columns/statuses, all status filters, sorting with missing pupils last, pupil actions/return preserving filters, tooltip hover/click/Escape, pre/post scope, and fully unmeasured classes. No console/page errors or document overflow. Final production build passed.

Implementation checklist complete; no actionable P0/P1/P2 findings remain after the mobile-table and sorting fixes.

final result: passed

## Dedicated class dashboard page and class-row chevrons

Moved Kesiapan Kelas from its modal shell to a dedicated local page at `#/kelas/6A` (with the selected class in the route). Shared top bar/sidebar, existing class data/components, status thresholds, tooltip, filtering/sorting, and pupil actions are retained. Added native class-name links plus a chevron in each regular class row's readiness cell, preserving exactly four table data columns. The administrative unassigned row retains mapping behavior.

Source comparison: inspected the prior `class-detail-after-1920.png` alongside `class-page-1920.png` and `class-page-390.png`. Moving from a 640px modal to the full application page is intentional per the latest request. New captures use 1920x1080 and 390x1080 CSS viewports at deviceScaleFactor 1 (full-page images 1920x1131 and 390x1159). Existing white card surface, purple values/icons, semantic badges, thin borders, typography, and internal spacing remain. The new page header/breadcrumb/back button reuse the existing full-page application patterns. No image assets changed.

Focused evidence: inspected `class-row-chevron-1920.png` and `class-row-chevron-390.png` together; chevrons align at row right, score/limited-data copy remains readable, and all four table columns remain visible on mobile. Class-page empty states also remain available. No actionable P0/P1/P2 visual findings were found in the first comparison.

Browser checks passed for class-name/chevron links, keyboard Enter navigation, a dedicated page with no dialog, browser Back/Forward, direct URL reload, invalid-class recovery, return-to-dashboard preserving category/mapel/package/period, shared class data and 64/85 pupil boundaries, tooltip, pupil actions, filtering/sorting, and empty classes. Checked desktop, 390px, and 320px without page errors or document overflow. Full existing dashboard checks also passed at 1920/1440/1024/768/390px, retaining mapping, filter behavior, table data, and assessment history navigation. Production build passed.

Implementation checklist complete: dedicated route, shared shell, accessible row navigation, return button, preserved global filter context, responsive evidence.

final result: passed
## Class dashboard aligned with school dashboard — 7 October 2026

Requested structure implemented on the existing dedicated class route: readiness gauge and class distribution, available-data metrics, pupil list, subject breakdown, and priority subtopics. Reused the school dashboard's card anatomy, purple gauge, semantic badges, metrics, subject tiles, segmented subject selector, priority rows, spacing, and responsive rules. All data and item detail actions are scoped to valid results of pupils in the selected class under the active global filters. Unmeasured pupils remain in the list but are excluded from averages/distribution. Assessment totals count distinct valid assessment IDs; limited subtopics remain unranked.

Compared the school source `filters-default-1920.png` with `class-page-1920.png` (1920×1963 full-page capture, 1920×1080 viewport) and `class-page-390.png` (390×2797 full-page capture, 390×1080 viewport), deviceScaleFactor 1. The added class roster and available-data metrics are intentional scope changes. Desktop overview cards align side by side, followed by three metrics; mobile stacks the same cards while preserving five pupil-table columns. Inspected empty-state captures `class-page-empty-1920.png` and `class-page-empty-390.png`: gauges/subjects show em dashes, all five pupils remain unmeasured, and subtopics have no ranks. No new image assets. No actionable P0/P1/P2 visual discrepancies found.

Validation: 29 data tests passed, including class-only subject/subtopic means, distinct assessment totals, active subject scope in empty classes, and existing 64/85 boundaries. Class browser checks passed at 1920, 390, and 320px for section hierarchy, 6A values (42%, 5 registered pupils, 4 measured pupils, 11 unique assessments), subject switching, limited subtopics, subject/subtopic detail actions, status filters, sorting, pupil detail, empty classes, navigation/reload, and preserved global filters. No browser errors or document overflow. Production build passed.

final result: passed
