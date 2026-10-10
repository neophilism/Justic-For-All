# ADR-0001: Core platform is an independent public coordination shell

- **Status:** Accepted as the planning architecture, subject to future reviewed ADR supersession.
- **Date:** 2026-10-10
- **Context:** Several civic initiatives and generic engines have separate sensitive data stores, security responsibilities, and release schedules.
- **Decision:** Core owns public navigation, approved editorial content, initiative metadata, scoped site accounts/consents, public status projections, and integration adapters. Independent testimony, FOIA, case workflow, public registry, and archive systems own their domain data. Integrate via signed, versioned interfaces rather than cross-database joins.
- **Consequences:** A downstream outage must not make the public site unsafe or prevent access to approved static resources. Unverified module endpoints display unavailable states; never suggest that a demo is an active filing/submission service. E2EESA is assessed per flow and implemented profile; it is not a blanket repository label.
- **Alternatives rejected:** One all-powerful shared database; exposing internal provider endpoints or keys in public JS; re-implementing the generic secure-intake engine inside this repository.
- **Follow-ups:** JFA-02 dependency census, JFA-04 OpenAPI contract, JFA-08 threat and E2EESA evidence register.
