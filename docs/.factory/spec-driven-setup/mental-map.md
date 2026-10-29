---
feature: spec-driven-setup
artifact: mental-map
status: approved
updated_stage: grilling
---

# Mental Map — Spec-Driven Development Setup

## Goal

Make the ARCA monorepo fully Spec-Driven Development ready by wiring three complementary pillars:

1. **Contract-First API** — OpenAPI YAML authored before implementation
2. **BDD Acceptance Tests** — Gherkin `.feature` files drive automated tests in both midtier and frontend
3. **Feature Factory Workflow** — Structured gates (spec → plan → TDD → review) enforced for every future feature

---

## Pillar 1 — Contract-First API (OpenAPI)

- Location: `midtier/api-specs/`
- Starter file: `user-management.yaml` covering existing user-management endpoints
- springdoc-openapi already present in `pom.xml` — Swagger UI available at runtime
- Workflow: author/update YAML → review → implement → validate against spec in CI

---

## Pillar 2 — BDD: Midtier (Cucumber JVM)

- Add `cucumber-spring`, `cucumber-junit-platform-engine` dependencies to `pom.xml`
- Feature files: `src/test/resources/features/`
- Step definitions: `src/test/java/.../cucumber/`
- Sample scenario: user-management (list users, add user, update role)
- Runner: JUnit 5 `@Suite` + `@SelectClasspathResource("features")`

---

## Pillar 3 — BDD: Frontend (Cucumber.js)

- Add `@cucumber/cucumber`, `@cucumber/html-formatter` dev dependencies
- Feature files: `src/features/`
- Step definitions: `src/features/step-definitions/`
- Sample scenario: login screen (valid login, invalid login)
- NPM script: `test:bdd` runs cucumber-js

---

## Pillar 4 — Feature Factory Workspace

- Location: `docs/.factory/<feature-name>/`
- Artifacts per feature: `glossary.md`, `mental-map.md`, `specification.md`, `plan.md`, `decisions.md`,
  `retrospective.md`
- README at `docs/.factory/README.md` explains the workflow

---

## CI Integration

- GitHub Actions workflow (`docker-image.yml` or new `spec-checks.yml`) updated to:
    - Run `mvn test` (includes Cucumber JVM scenarios)
    - Run `npm run test:bdd` (Cucumber.js scenarios)
    - Validate OpenAPI spec presence (lint step)

---

## Decisions Made

| Decision          | Choice                   | Rationale                                   |
|-------------------|--------------------------|---------------------------------------------|
| OpenAPI location  | `midtier/api-specs/`     | Close to backend; springdoc already present |
| Midtier BDD       | Cucumber JVM             | Industry standard; integrates with JUnit 5  |
| Frontend BDD      | Cucumber.js + Jasmine    | Consistent Gherkin across stack             |
| Sample features   | Yes (both tiers)         | Immediately usable pattern for the team     |
| CI                | Update existing workflow | Enforce spec checks on every PR             |
| Factory workspace | `docs/.factory/`         | Keeps root clean                            |
