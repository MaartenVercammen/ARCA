---
feature: spec-driven-setup
artifact: glossary
status: approved
updated_stage: grilling
---

# Glossary

| Term                               | Definition                                                                                                                         |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| Spec-Driven Development (SDD)      | A workflow where specifications (OpenAPI contracts, Gherkin scenarios) are written and approved before any implementation begins.  |
| Feature Factory                    | A sequential workflow (grilling → spec → plan → scaffold → TDD → review → PR handoff) that enforces SDD gates.                     |
| OpenAPI / Contract-First           | Authoring an OpenAPI YAML spec for an API endpoint before writing the server or client code.                                       |
| BDD (Behaviour-Driven Development) | Writing human-readable Gherkin scenarios (Given/When/Then) that drive automated acceptance tests.                                  |
| Gherkin                            | A plain-English DSL used to describe feature behaviour in `.feature` files.                                                        |
| Cucumber JVM                       | Java implementation of the Cucumber BDD framework; executes `.feature` files via JUnit 5 step definitions.                         |
| Cucumber.js                        | JavaScript/TypeScript implementation of Cucumber; executes `.feature` files in Node/Angular projects.                              |
| Step Definition                    | Code that maps a Gherkin step to an executable test action.                                                                        |
| Midtier                            | The Spring Boot backend module (`midtier/ARCA-mt`).                                                                                |
| Frontend                           | The Angular application (`frontend/ARCA-fe`).                                                                                      |
| api-specs/                         | Directory (`midtier/api-specs/`) holding hand-authored OpenAPI YAML files that serve as the contract between frontend and midtier. |
| .factory/                          | Workspace directory (`docs/.factory/`) holding all Feature Factory artifacts per feature.                                          |
