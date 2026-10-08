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

## Beranda design 1 — initial comparison, 8 October 2026

Source: C:/Users/LENOVO/.codex/generated_images/01a11433-292b-78b2-a56d-9a65b687cd7e/exec-e2a09776-e80a-49ee-ad33-3c5095fb2467.png (1487×1058). Desktop implementation: qa-evidence/home-asiq-1487.png, same 1487×1058 CSS viewport, deviceScaleFactor 1. Both were opened together in the same comparison input. Image placeholders are intentional per explicit user instruction; the supplied product shell remains unchanged. Duplicate breadcrumb text in the generated mock is simplified to one Beranda label.

Initial typography comparison found [P2] smaller hero heading/body/button widths than the source. Fixed desktop hero heading from 36 to 38px, body from 17 to 18px with the same 27px leading, and CTA horizontal padding from 23 to 30px. Compared the revised desktop capture against the same source: focal hierarchy, two-line headline, approximate source proportions, exact UX copy, 450px hero, slide controls, and invitation row align. Minor pixel offsets are P3, not blocking.

[P2] Tablet composition: qa-evidence/home-tablet-before-834.png shows excessive narrow-copy wrapping while the placeholder consumes too much width, plus a compressed invitation description next to its CTA. Fix: favor the copy column at tablet widths and explicitly move the invitation CTA onto the next row when needed. Mobile capture home-asiq-390.png has readable stacked content and working controls; no document overflow.

final result: blocked

## Beranda design 1 — final verification, 8 October 2026

Source truth: C:/Users/LENOVO/.codex/generated_images/01a11433-292b-78b2-a56d-9a65b687cd7e/exec-e2a09776-e80a-49ee-ad33-3c5095fb2467.png. Source pixels 1487×1058. Implementation: qa-evidence/home-asiq-1487.png at 1487×1058 CSS pixels, deviceScaleFactor 1, default ASIQ slide, administrator presentation context, dialog closed. No density resampling needed. Source and final implementation were opened together with original image detail for visual comparison. Desktop source text/controls are readable at that scale, so separate crops were unnecessary for the copy/CTA review.

Comparison history: desktop heading/body/action sizes were corrected after the initial typography finding. The tablet P2 was corrected by giving the copy a larger grid track (2.2fr/0.8fr), narrowing its horizontal padding, and allowing the invitation description to span the row with the CTA beneath. Opened qa-evidence/home-tablet-before-834.png and revised qa-evidence/home-asiq-834.png together: the headline now uses three lines instead of four, actions share one row, and the invitation title/description have readable space. No outstanding P0/P1/P2 issues.

Required fidelity surfaces:
- Typography: existing Inter family, strong 38px desktop hero heading, 18px body/27px leading, two-line primary headline, 16px action labels; mobile/tablet scale and exact supplied copy preserved. Minor generated-mock glyph/line differences are P3.
- Spacing/layout: same 54px fixed shell, 246px desktop sidebar, 34px main gutter, 450px desktop carousel, copy/visual grouping, centered selectors, 15px border radii, quieter invitation utility. Mobile stacks the slot/copy and preserves manual controls; tablet proportions corrected as above. Duplicate Beranda breadcrumb in the mock is deliberately reduced to one label.
- Colors/tokens: reused Posgram purple, pale lavender hero, white utility/buttons, thin existing borders, muted text, and Phosphor outline icons. No new visual language or fabricated decorative UI.
- Images: supplied logo retained; hero illustrations are deliberately replaced by clearly labeled placeholders at the user's explicit request. No generated or fake replacement art. Configured real assets render with object-fit contain; configuration path is documented.
- Copy/content: both product headlines/descriptions/CTAs and dashboard highlights follow the brief. Invitation utility and dialog include requested institution context and writing. No join-instansi CTA, duplicate destination cards, or unsupported statistics.

Additional evidence: home-dashboard-1487.png, home-asiq-390.png, home-dashboard-390.png, home-invite-empty-390.png, and home-share-fixture-390.png. Empty code state and the selectable share-message dialog were directly inspected; supplied mock does not specify dialog/mobile composition, so those reuse the established component design system. Share fixture is test-only and not the default homepage state.

Browser checks passed for widths 1487/1440/1024/834/768/390/320: direct and sidebar Beranda routing, active navigation, both slides, chevrons, keyboard slide tabs, dashboard CTA, ASIQ unavailable/configured-link states, dialog opening/closing/focus, default missing code, supplied-code clipboard feedback, native share/fallback/cancellation, denied clipboard feedback, no automatic sharing, permission-hidden UI and permission revocation, asset replacement, Back and reload. No browser console errors, failed responses, or document overflow. Existing full dashboard and class-page browser checks also passed after shared Modal extraction. Final production build passed; no backend, auth, API, or membership logic was added.

Implementation checklist complete: selected composition, requested placeholders, shared shell, carousel, permission-aware presentation, working frontend dialogs/actions, responsive states, existing-page regressions, build, visual comparison, and asset configuration documentation. Real ASIQ URL, institutional join code, and authoritative permissions remain consumer-supplied integration values; defaults honestly show unavailable/empty states.

final result: passed

## Beranda latest reference — 8 October 2026

The latest inline user attachment is the source of truth for this revision and supersedes the earlier generated design 1. Reference main-content image: 1182×613 pixels. Compared it with `qa-evidence/home-layout-reference-1182.png`, captured at 1428×1058 CSS viewport/deviceScaleFactor 1 and cropped to x=246, y=54, width=1182, height=613, excluding the preserved application shell. The brief describes a second screenshot, but only one was attached; the alternate slide uses its supplied copy and the same composition. Image slots deliberately remain placeholders, following the user's explicit asset preference. No new mockup or generated image was sent.

Initial finding P2: the alternate slide's content expanded both desktop cards to 508px, placing footer controls and primary actions below the reference's compact composition. Adjusted alternate-slide heading/body sizing, internal padding and chip spacing. Final cards measure 482px including borders at 1428/1440/1920px viewport widths, remain exactly equal in height, and do not change height between slides. The reference is approximately 480px; the small border/line-position differences are P3. All copy is retained. Desktop column ratio is 2.4:1 with a 20px gap; 24px radii, soft lavender/blue gradients, navy headings, purple CTAs, thin borders and Inter/Phosphor styling match the reference's hierarchy.

Inspected final `home-layout-reference-1182.png`, `home-layout-dashboard-1428.png`, `home-layout-asiq-834.png`, `home-layout-asiq-390.png`, `home-layout-dashboard-390.png`, and `home-layout-invite-empty-390.png`. The header's workspace name follows the active context and omits the unexplained dot. ASIQ is the default; dashboard copy and three feature chips appear together on the alternate slide. Invitation media, eyebrow, title, description, full-width CTA and check helper remain in the right card on desktop. Tablet stacks the hero and invitation with a compact horizontal invitation arrangement; mobile stacks all content. No clipped text, image/copy collision, CTA/footer overlap, document overflow, or actionable P0/P1/P2 findings remain. The shared invitation dialog retains established modal styling and keyboard focus handling.

Browser verification passed at 1920/1440/1428/1280/1024/834/768/390/320px for composition, desktop card alignment, stable slide height, manual and keyboard carousel navigation, dashboard CTA, Back/reload, workspace identity, three placeholder/configured-asset slots, reduced motion, and dialog focus/close. Isolated fixtures verified invitation URL distinct from ASIQ, read-only link, empty/loading/error/retry states, prop updates within an open dialog, clipboard success/denial, native sharing/cancellation and selectable-message fallback. Permission absence/revocation removes the invitation card/link/dialog and expands the hero. No automatic sharing, page errors, failed responses or document overflow. Existing full school/class dashboard browser checks and production build passed. No backend, auth, API or membership logic added.

Integration limitation: the repository supplies no real ASIQ/invitation endpoint. Both URLs remain null in the administrator preview, with honest unavailable states. Consumers supply the active workspace, verified permission results, real URLs, state updates and optional retry callback. UI fixtures use example.com solely within browser verification; they never appear in the normal homepage.

Implementation checklist complete: latest two-column reference, exact requested copy, stable accessible carousel, link invitation card/dialog, permission-dependent layout, responsive states, retained placeholders, consumer integration contract, regression checks and build.

final result: passed

## ASIQ slide supplied artwork — 8 October 2026

Replaced only slide 1's placeholder with the user's “Educator Presenting Connected Learning Dashboards.png”. Copied the 1086×1448 RGBA PNG to `public/assets/asiq-educator.png`; file hashes match the original, preserving all artwork, labels and transparency. Added a soft purple/blue gradient with a small warm tint behind the image and a subtle CSS drop shadow. Slide 2 and invitation images remain placeholders. No image generation or image editing was performed.

Compared the supplied artwork with `qa-evidence/home-educator-1428.png`, `home-educator-390.png`, and `home-educator-320.png`. The whole composition remains visible using object-fit contain; the transparent background blends into the existing lavender hero. Initial desktop spacing placed the illustration too close to the next/previous controls, so it was raised by 12px on desktop. Final image bounds clear the controls, text remains unobstructed, and desktop card heights stay equal at 482px. Mobile places the image beneath the CTA with a 240px display height; the complete illustration remains visible and clear of the footer. No outstanding P0/P1/P2 findings.

Focused browser verification passed at 1920/1428/834/390/320px for actual asset loading, equal desktop card heights, unchanged height during carousel switching, visible image after returning to slide 1, clear image/control spacing, and no document overflow or page errors. Browser font loading is explicitly settled before comparing measurements, avoiding transient font-swap readings. Production build passed. Existing copy, routes, invitation logic and dashboard data were unchanged. Local preview remains available.

final result: passed

## ASIQ replacement artwork enlarged and bottom-right aligned — 8 October 2026

Replaced slide 1's image with the user's latest “Interactive Learning Dashboard with Teacher and Analytics.png” at `public/assets/asiq-learning-dashboard.png`. The original 1086×1448 transparent PNG is preserved byte-for-byte; the superseded asset was removed. Retained the soft gradient and shadow. Desktop/tablet artwork now anchors to the card's bottom-right edge instead of floating centrally in the visual track. At the 1428px viewport, its rendered artwork grows from approximately 293×390px to 370×493px. The card remains 482px tall; only transparent outer padding extends above the clipped card area. The visible artwork remains intact.

Moved desktop carousel navigation into the copy-side footer, preserving its position on both slides and clearing the enlarged illustration. Mobile uses a 320px visual area (300px at the narrowest breakpoint), aligned to the content's right edge beneath the copy, with separate space for footer controls. Existing text, gradients, other image placeholders, routes and invitation behavior remain unchanged.

Compared the supplied artwork with `qa-evidence/home-anchored-1428.png` and `home-anchored-390.png`. The image is visibly larger, the table meets the bottom-right area on desktop, and copy/CTA remain clearly readable. Browser checks passed at 1920/1428/1024/834/768/390/320px for actual asset loading, bottom-right anchoring on desktop/tablet, clear copy/control bounds, stable height across slide changes, returning to slide 1, no horizontal overflow, and no page errors. Desktop card heights remain equal. Production build and whitespace checks passed. No outstanding P0/P1/P2 findings. Local preview remains running.

final result: passed

## Centered carousel navigation — 8 October 2026

Reordered only the existing navigation controls to previous chevron, slide indicators, next chevron. The group is centered at the carousel bottom at every breakpoint with 14px gaps. Preserved existing control sizes, colors, icons, bottom offsets, handlers and keyboard behavior. Removed the old copy-side and breakpoint horizontal offsets. Copy, artwork, gradient, slide layout and all other carousel elements remain unchanged.

Browser checks passed at 1428/834/390/320px for exact control order, center alignment within 1px, 14px spacing, both chevrons, indicator selection and keyboard navigation. Inspected home-centered-navigation-1428-0.png and home-centered-navigation-390-0.png: controls are readable and accessible, with the existing foreground treatment retained where the desktop right chevron overlays the edge of the unchanged illustration. No page errors or document overflow. Production build passed.

final result: passed
## Supplied slide 2 readiness artwork — 8 October 2026

Added the user's Post-Test Readiness Dashboard (1).png as public/assets/readiness-dashboard.png. The 1448×1086 transparent original is preserved byte-for-byte and shown without cropping in the second slide's visual column. Added a subtle purple shadow and a 220px mobile image height. Retained the purple headline gradient, centered chevron/indicator navigation, copy, chips, CTA and slide 1 artwork. Only the invitation media remains a placeholder.

Compared the supplied artwork with home-readiness-image-1428.png and home-readiness-image-390.png. The complete graphic remains visible, with adequate separation from the copy and navigation. Browser verification passed at 1920/1428/834/390px; at 320px, repeated the check after all font weights and page glyphs were loaded to avoid a transient font-swap measurement. The asset loads, slide heights match, controls work, and no copy/image collision or document overflow remains. Production build passed. No backend or dashboard data changes. No outstanding P0/P1/P2 findings.

final result: passed
## Bold feature chips with rounded corners — 8 October 2026

Updated the three dashboard-slide chips with 700-weight text, 11px labels, pill radii, comfortable padding, and purple 16px Phosphor duotone icons: ChartLineUp, UsersThree, and Target. Retained the labels and responsive wrapping. Compared home-bold-chips-1428.png and home-bold-chips-390.png with the previous readiness-slide captures: emphasis is stronger, icons remain consistent with the existing library, and mobile wraps into three clear rows without clipping.

Browser checks passed at 1428/834/390/320px for all three chips, bold weight, pill radii, icon sizes, CTA/footer separation, no document overflow and no page errors. Production build passed. No outstanding P0/P1/P2 findings.

final result: passed
## Invitation collaboration visual built in code — 8 October 2026

Replaced the invitation-media placeholder with InvitationVisual.jsx, as explicitly requested. Native React/CSS/SVG composition uses the existing Phosphor library: a purple/blue community hub, teacher/member/invite nodes, curved dotted connections and a link badge, on a pale gradient with soft shadows. No fabricated names, metrics or status text. All children are decorative; a single image-role label describes the illustration. Preserved the existing media heights, invitation card copy and CTA, permission handling, and dialog. Supplied custom images remain supported; missing/failed assets fall back to the coded illustration.

Inspected home-invitation-code-1428.png and home-invitation-code-390.png: hierarchy and spacing align with the existing card, the central icon is the focal point, and all nodes fit without clipping. Browser verification passed at 1920/1428/834/390/320px for visible illustration, contained node bounds, absence of placeholder/extra controls, usable invitation dialog, no overflow and no page errors. Build passed. No outstanding P0/P1/P2 findings. No mockup or generated image sent to the user.

final result: passed

## Slide 2 replacement with floating ornaments — 8 October 2026

Replaced slide 2 with the supplied Post-Test Readiness Dashboard (2).png at public/assets/readiness-dashboard-v2.png. Source and copied asset have identical SHA-256 hashes. ReadinessVisual.jsx keeps the square transparent image intact and adds four decorative native CSS/SVG widgets: a trend chart, recommendation list, bar chart and education icon. Soft white/lavender containers, shadows and a background glow match the existing carousel. The ornaments float by 6px with a slight rotation over staggered 6.8–8.2 second cycles; the central image stays static. Inactive-slide animations pause, and prefers-reduced-motion disables them.

Production build passed. Browser checks passed at 1920/1428/1280/1024/834/768/390/320px for the correct loaded image, four ornaments, stable slide height, separation from copy/navigation, no horizontal overflow and no page errors. Additional checks at the start, midpoint and end of the animations confirmed the ornaments remain inside the carousel and clear of copy/navigation on six desktop/mobile sizes. Keyboard navigation, actual movement, inactive pause and reduced-motion behavior passed. Inspected home-readiness-motion-1920.png, home-readiness-motion-1428.png, home-readiness-motion-390.png and home-readiness-motion-320.png against the supplied asset: complete image, gentle ornament hierarchy and usable controls. No dashboard data or backend changes; no mockup sent in chat.

final result: passed

## Invitation institution information — 8 October 2026

Added a compact institution container immediately below “Undang Guru ke Instansi”, before the existing description. Uses the active workspace.name with a purple Phosphor Buildings duotone icon, pale lavender fill, light border and 12px radius. The icon is decorative and long names can wrap. Build and browser layout checks passed at 1920/1428/1380/834/390/320px: correct institution name, heading/container/description order, comfortable spacing, equal desktop card heights, no horizontal overflow and no page errors. The invitation dialog remains usable. Captures: home-invitation-workspace-1428.png and home-invitation-workspace-390.png.

final result: passed

## Carousel autoplay every 3 seconds — 8 October 2026

Added automatic alternation between the two existing slides every 3000ms, preserving the centered chevrons/indicators, transitions and layout. Rotation pauses during mouse hover, focus within the carousel, an open dialog or a hidden document; resuming starts a fresh countdown. Automatic transitions keep the existing live region off. Effect cleanup removes timers and the visibility listener when leaving Beranda.

Build passed. Browser verification with a controlled clock passed at 1428/390/320px: no change at 2999ms, a change at 3000ms, repeated 1→2→1 loops, stable carousel height, hover/focus/dialog/visibility pauses, fresh countdown after resume, arrow/indicator/keyboard controls, and fresh autoplay after route unmount/remount. No horizontal overflow or page errors. Visual styling unchanged; no mockup generated.

final result: passed

## Removed Beranda header institution chip — 8 October 2026

Removed the top-right institution chip and its unused responsive styles. The header keeps its title and description; institution information remains in the invitation card and sidebar. Build passed. Browser checks at 1428/390px confirmed no institution chip in the header, the correct institution name in the invitation card, no horizontal overflow and no page errors.

final result: passed
