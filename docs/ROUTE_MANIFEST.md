# Public route manifest — JFA-10

Route | Purpose | Sensitive input
---|---|---
/ | General landing page | None
/about | Organizational overview | None
/stories | Story program information; no intake | None
/records | Records program information; no filing | None
/principles | Civic principles | None
/initiatives | Validated public informational initiative directory | None
/initiatives/[slug] | Approved public informational initiative detail | None
/get-involved | Safe public participation information | None
/privacy | Interim privacy disclosure | None
/terms | Interim information/terms boundary | None
/design-system | UI reference | None
/health | Stateless liveness | None

Core navigation links only to implemented pages. Missing routes receive an accessible 404 page. Unexpected render errors receive an accessible recovery page. CMS routes require their later work packages and must not be labeled operational.
