<!-- 
Sync Impact Report:
- Version: 1.0.0
- Modified principles:
  - PRINCIPLE_1 -> I. Cross-Platform First (Expo/React Native)
  - PRINCIPLE_2 -> II. Direct API Integration (RESTful)
  - PRINCIPLE_3 -> III. Comprehensive E2E Testing
  - PRINCIPLE_4 -> IV. Component-Driven Mobile UI
  - PRINCIPLE_5 -> V. Strict Typing and Validation
- Added sections: Architecture Constraints, Quality Gates & Workflow
- Removed sections: N/A
- Templates requiring updates: ⚠ Pending verification
- Follow-up TODOs: None.
-->
# Mobile App & API Constitution

## Core Principles

### I. Cross-Platform First (Expo/React Native)
Code MUST be written to support both iOS and Android natively via Expo and React Native. Platform-specific code SHOULD be minimized and cleanly abstracted.

### II. Direct API Integration (RESTful)
The mobile app MUST consume dynamic content exclusively via the unified RESTful Backend API. Direct database access from the mobile client is strictly forbidden.

### III. Comprehensive E2E Testing
All backend APIs MUST be guarded with Playwright E2E tests. The mobile app MUST have critical user flows guarded by Detox E2E tests. Tests MUST pass before merging.

### IV. Component-Driven Mobile UI
The mobile UI MUST be built using reusable, highly-cohesive React Native components. Complex state MUST be separated from presentation components.

### V. Strict Typing and Validation
Both frontend and backend MUST utilize strict typings (e.g., TypeScript) and validate all data payloads at the API boundary to prevent malformed content from reaching the mobile client.

## Architecture Constraints

- **Backend**: RESTful API, stateless authentication, structured JSON responses.
- **Mobile**: Expo managed workflow preferred unless bare workflow is required by native modules.
- **Data Fetching**: Use robust data fetching libraries with caching support.

## Quality Gates & Workflow

- CI/CD pipeline MUST run Playwright tests for API changes.
- CI/CD pipeline MUST run Detox tests for mobile app changes.
- PRs MUST contain a description of the testing performed.

## Governance

Any deviations from Expo-compatible modules MUST be explicitly approved by the technical lead. API breaks MUST be versioned to prevent mobile client breakage.

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
