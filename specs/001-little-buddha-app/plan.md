# Implementation Plan: Little Buddha App Core MVP

**Branch**: `001-little-buddha-app` | **Date**: 2026-03-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-little-buddha-app/spec.md`

## Summary

A cross-platform educational mobile app (Little Buddha) built with Expo/React Native to teach Buddhism to kids and young adults. Features age-appropriate stories with audio delivery. The backend will utilize the **Firebase ecosystem** (Auth, Firestore, Cloud Functions, and Firebase Storage) for seamless real-time data flow and simplified infrastructure.

## Technical Context

**Language/Version**: TypeScript (Expo/React Native for mobile, Node.js for Firebase Functions)
**Primary Dependencies**: Expo, React Native, Firebase CLI, `@react-native-firebase/*`, GitHub Actions, Fastlane
**Storage**: Cloud Firestore (NoSQL), Firebase Cloud Storage (Audio)
**Testing**: Detox (Mobile E2E), Playwright (Backend/Rules testing), Jest (Unit)
**Target Platform**: iOS, Android, Firebase
**Project Type**: Mobile App + Firebase Backend
**Performance Goals**: Data retrieval < 300ms, Audio playback initiation < 1s
**Constraints**: Utilize `firebase.json` and Firebase Emulators for infrastructure config instead of raw IaC tools for simplicity.
**Scale/Scope**: MVP for educational content delivery with age-based filtering

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates: Cross-Platform Native Feel, Direct API Integration, E2E Testing (Playwright/Detox), Component-Driven UI, Strict Typing]

PASS. Architecture rigorously enforces cross-platform capability (Expo), strict validation (via Firebase Security Rules and TS), and the exact testing frameworks mandated by the constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-little-buddha-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (will require regeneration)
```

### Source Code (repository root)

```text
firebase/               # Firebase Backend
├── functions/          # Cloud Functions (Custom user creation triggers, syncs)
│   ├── src/
│   └── package.json
├── firestore.rules     # Database Security Rules
├── storage.rules       # Storage Security Rules
└── firebase.json       # Project configuration

mobile/                 # Mobile application
├── src/
│   ├── components/     # React Native reusable UI
│   ├── screens/        # Application screens
│   ├── services/       # Firebase Client integrations
│   └── theme/
├── e2e/                # Detox mobile tests
└── fastlane/           # App Store deployment configuration
```

**Structure Decision**: Selected a "Mobile + Firebase" structure. The `api/` folder is replaced by `firebase/` which contains functions, rules, and deployment config.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
