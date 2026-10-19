# Public route manifest — JFA-10

Route | Purpose | Sensitive input
---|---|---
/ | General landing page | None
/about | Organizational overview | None
/stories | Story program information; no intake | None
/records | Records program information; no filing | None
/principles | Civic principles | None
/initiatives | Validated public informational initiative directory | None
/initiatives/[slug] | Approved public informational initiative detail | None\n/articles?slug={slug} | Current reviewed published editorial article | Validated slug only
/get-involved | Safe public participation information | None
/privacy | Interim privacy disclosure | None
/terms | Interim information/terms boundary | None
/design-system | UI reference | None
/health | Stateless liveness | None

Core navigation links only to implemented pages. Missing routes receive an accessible 404 page. Unexpected render errors receive an accessible recovery page. The editorial article route fails closed until the draft and workflow schema are deployed and approved content is actually published. It never accepts intake, testimony or user-supplied allegations.
