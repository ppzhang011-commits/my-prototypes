# Teacher Desktop Prototype — Design QA

## Scope

This QA covers only the four confirmed first-level screens after the 2026-10-19 product-baseline update:

1. Student Club home
2. Club application review list
3. Club credit review list
4. Configuration landing page

Review details, decision dialogs, category-management details, and credit-rule editing are intentionally absent.

## Evidence

- Desktop viewport: 1920 × 934
- Narrow desktop viewport: 1280 × 800
- Screenshots:
  - `qa-home.png`
  - `qa-application-list.png`
  - `qa-credit-list.png`
  - `qa-config.png`
  - `qa-home-1280.png`
- Reference: the supplied 2.0 desktop screenshots for the platform shell, task entry, list, and configuration patterns.

## Verification results

- Four first-level pages render and navigate correctly.
- The home page includes the four confirmed task entries: operating analysis, application review, credit review, and configuration. Operating analysis remains an entry only in this round.
- No second-level detail, modal, or rule-editing components remain.
- The three list pages use semester-specific data and working primary/advanced filters.
- The home list separates club origin, join availability, and operating status instead of merging them into one state.
- All visible list language was reviewed from the teacher's point of view: abstract labels such as `运行状态`, `加入状态`, and `校验提醒` were replaced with the concrete questions and situations teachers need to understand.
- Application review surfaces category routing context, planned capacity, venue needs, submission method, and validation reminders.
- Credit review separates claimed hours, leader-recognized hours, and system-suggested credits; leader applications correctly skip self-review.
- Configuration contains the three confirmed entries: semester plan, club category and review, and credit rules.
- Configuration is visually quieter than review work.
- The default review filter is `待审核` without showing a misleading reset action.
- 1280 px desktop width has no document-level horizontal overflow; the data table scrolls within its own frame when needed.
- All inspected buttons have an accessible name.
- All inspected inputs and selects have a label or `aria-label`.
- Production build passed.
- Sites packaging tests passed: 4/4.
- Browser console errors: none.

## Visual findings

- The fixed header, dual sidebar, white work surface, compact filters, and dense table treatment follow the supplied 2.0 visual language.
- Spacing, control height, table-row rhythm, action hierarchy, and status tags are consistent across the four currently implemented screens; the confirmed fifth screen, analysis report, has not yet been designed or evaluated.
- The final typography scale uses 20px page titles, 14px primary controls/task buttons, 13px table and utility text, and 11px task-count badges.
- Demo data is deliberately realistic enough to exercise filtering and table density, but remains non-normative product data.
- No dashboard cards, decorative metrics, large marketing copy, gradients, or other AI-demo patterns were introduced.
- Mobile is intentionally not evaluated because teacher mobile is a separate terminal and is outside the current teacher-desktop scope.

## Remaining limitation

The source screenshots exist only as conversation attachments, not local files, so a pixel-level side-by-side comparison artifact is not available. Standalone visual, interaction, narrow-desktop, accessibility-baseline, build, and console checks are complete.

## Final result

pass with source-comparison limitation
