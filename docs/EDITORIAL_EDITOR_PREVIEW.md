# JFA-13B — Private editor/preview building blocks

This PR adds a reusable **unmounted** client-side editor and an HTML-free React preview for validated structured editorial documents. It has no application route and no anonymous or public save method. The editor supports headings, paragraphs, lists, quotes, and plain/bold/italic spans. It displays media **descriptions only**, not bytes or embedded external frames.

The component accepts an optional `onSave` callback for a future authenticated admin client. Without that callback, the Save control is disabled and explicitly labeled. A future integration **must** re-authenticate, authorize, and validate on the server, use the internal draft writer, enforce CSRF/session protection, and audit the outcome.

The preview uses React text nodes, never `dangerouslySetInnerHTML`, URL rendering, or raw HTML. Changes are local in browser memory until the trusted save handler has successfully completed. No confidentiality or local persistent storage is promised.

**JFA-13 still incomplete.** Remaining: authenticated role-protected authoring shell, database integration tests, media scanning/quarantine/storage, admin preview security tests, and JFA-14 publication controls. The source-controlled roadmap mapping remains null for JFA-13.
