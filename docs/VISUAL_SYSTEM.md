# Justice For All visual system (JFA-09)

Implementation package: `packages/ui/src/index.tsx`. Shared accessible CSS tokens and component styles: `apps/web/app/styles.css`. Browser preview: `/design-system` from the local Next app. No production domain currently guaranteed.

Components: `Panel` and `Notice` are semantic presentation primitives; `AvailabilityText` is a word-based status (not color-only); `TextField` supplies a visible `label` and linked helper text; `ActionButton` preserves native button controls. The reference page contains a **disabled** form control, specifically labeled a nonoperational example. No testimony or email is collected.

### Accessibility evidence

- Contrast checked programmatically for high-volume text, link and primary-action color pairs against their default surfaces (WCAG normal text 4.5:1 baseline).
- Keyboard focus rings visible; native buttons and inputs have at least 44px minimum targets (some text links still require later JFA-18 comprehensive hit target audit).
- Responsive type and container grids, reduced motion and forced-colors fallbacks.
- Semantic headings, notices, status labels and empty/disabled states.
- This is not a claim of WCAG 2.2 AA certification. Manual screen-reader/keyboard/mobile testing and later active-account form validations remain JFA-18 acceptance requirements.

### Guardrails

UI components never grant permissions, create subscription interest, route sensitive intake, or assert live module state. Future features must implement real handlers and test unauthorized paths rather than rendering deceptive working buttons. Avoid using project colors to imply political affiliation.
