---
feature: spec-driven-setup
artifact: plan
status: pending-approval
updated_stage: planning
---

# Plan — Spec-Driven Development Setup

## Language Adapter

| Property                 | Value                                                                          |
|--------------------------|--------------------------------------------------------------------------------|
| Midtier language         | Java 25 / Spring Boot 4                                                        |
| Midtier test command     | `mvn --batch-mode --no-transfer-progress verify` (run from `midtier/ARCA-mt/`) |
| Midtier build command    | `mvn --batch-mode --no-transfer-progress package -DskipTests`                  |
| Frontend language        | TypeScript / Angular 21                                                        |
| Frontend package manager | Yarn 1.22                                                                      |
| Frontend test command    | `yarn test --watch=false` (Vitest, run from `frontend/ARCA-fe/`)               |
| Frontend BDD command     | `yarn test:bdd` (Cucumber.js, run from `frontend/ARCA-fe/`)                    |
| Frontend build command   | `yarn build`                                                                   |

---

## Tasks

### Task 1 — Project documentation (`docs/spec-driven-development.md`)

Create a human-readable guide explaining the SDD workflow, directory conventions, and how to use each pillar.

**Files created:**

- `docs/spec-driven-development.md`
- `docs/.factory/README.md`

---

### Task 2 — Contract-First OpenAPI (`midtier/api-specs/`)

Create the `midtier/api-specs/` directory and a hand-authored `user-management.yaml` covering all five user-management
endpoints with Bearer JWT security.

**Files created:**

- `midtier/api-specs/user-management.yaml`

---

### Task 3 — Cucumber JVM wiring (midtier)

Add Cucumber JVM dependencies to `pom.xml`, create the feature file directory, a JUnit 5 suite runner, and step
definitions for the User Management scenarios from the specification.

**Files modified:**

- `midtier/ARCA-mt/pom.xml` — add `cucumber-spring`, `cucumber-junit-platform-engine`, `cucumber-java`

**Files created:**

- `midtier/ARCA-mt/src/test/resources/features/user-management.feature`
- `midtier/ARCA-mt/src/test/java/dev/emvee/arcamt/cucumber/CucumberIT.java` (suite runner)
- `midtier/ARCA-mt/src/test/java/dev/emvee/arcamt/cucumber/UserManagementStepDefs.java`
- `midtier/ARCA-mt/src/test/java/dev/emvee/arcamt/cucumber/CucumberSpringConfig.java`

---

### Task 4 — Cucumber.js wiring (frontend)

Add `@cucumber/cucumber` to `package.json` devDependencies, add a `test:bdd` script, create the features directory, a
sample login feature file, and step definitions using Vitest assertions.

**Files modified:**

- `frontend/ARCA-fe/package.json` — add `@cucumber/cucumber`, `test:bdd` script

**Files created:**

- `frontend/ARCA-fe/cucumber.js` (Cucumber.js config)
- `frontend/ARCA-fe/src/features/login.feature`
- `frontend/ARCA-fe/src/features/step-definitions/login.steps.ts`

---

### Task 5 — CI update

Add a `yarn test:bdd` step to the `frontend` job in the existing GitHub Actions workflow. Midtier Cucumber tests run
automatically via `mvn verify` (no change needed there).

**Files modified:**

- `.github/workflows/docker-image.yml`

---

### Task 6 — Feature Factory decisions log

Record the approved specification and plan in `decisions.md`.

**Files created:**

- `docs/.factory/spec-driven-setup/decisions.md`
