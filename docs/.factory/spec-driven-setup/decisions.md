---
feature: spec-driven-setup
artifact: decisions
status: active
updated_stage: implementation
---

# Decisions Log — Spec-Driven Development Setup

## 2026-10-29 — Grilling: Shared Understanding Confirmed

Agreed to implement all three SDD pillars:

- Contract-First OpenAPI YAML in `midtier/api-specs/`
- Cucumber JVM (midtier) + Cucumber.js (frontend) BDD frameworks
- Feature Factory workspace at `docs/.factory/`
- CI enforcement via GitHub Actions

## 2026-10-29 — Specification Rejected (first draft)

**Reason:** Structural setup details (dependencies, file locations, CI config) were written as Gherkin scenarios. These
belong in project documentation, not in a behavioural specification.

**Action:** Moved structural info to `docs/spec-driven-development.md`. Specification revised to contain only
behavioural Gherkin scenarios.

## 2026-10-29 — Specification Approved

Approved specification covering:

- User Management API scenarios (list, create, update roles) with role-based access
- Login scenarios (successful redirect, failed login error message)

## 2026-10-29 — Plan Approved

Approved 6-task plan:

1. Project documentation (`docs/spec-driven-development.md`, `docs/.factory/README.md`)
2. OpenAPI YAML (`midtier/api-specs/user-management.yaml`)
3. Cucumber JVM wiring + sample feature (midtier)
4. Cucumber.js wiring + sample feature (frontend)
5. CI update (GitHub Actions `yarn test:bdd` step)
6. Decisions log
