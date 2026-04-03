---
description: "Task list for Little Buddha Web SPA Application"
---

# Tasks: Little Buddha Web SPA

**Input**: Design documents from `/specs/002-web-spa-app/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [X] T001 Initialize Vite + React + TypeScript project in web/ directory.
- [X] T002 Install Firebase JS SDK and React Router dependencies.
- [X] T003 [P] Create global CSS design system (index.css) matching the mobile app's theme.

---

## Phase 2: Core Infrastructure

- [X] T004 Create Firebase SDK initialization module (web/src/firebase.ts) with emulator support.
- [X] T005 Create shared TypeScript interfaces (web/src/types.ts).
- [X] T006 Create AuthContext provider (web/src/context/AuthContext.tsx).
- [X] T007 Create ProtectedRoute component (web/src/components/ProtectedRoute.tsx).

---

## Phase 3: User Story 1 - Authentication (P1)

- [X] T008 Create auth service (web/src/services/authService.ts).
- [X] T009 Create LoginPage (web/src/pages/LoginPage.tsx).
- [X] T010 Create RegisterPage (web/src/pages/RegisterPage.tsx).

---

## Phase 4: User Story 2 - Lesson Discovery (P1)

- [X] T011 Create lesson service (web/src/services/lessonService.ts).
- [X] T012 Create LessonCard component (web/src/components/LessonCard.tsx).
- [X] T013 Create HomePage (web/src/pages/HomePage.tsx).

---

## Phase 5: User Story 3 - Lesson Detail & Audio (P2)

- [X] T014 Create AudioPlayer component (web/src/components/AudioPlayer.tsx).
- [X] T015 Create LessonDetailPage (web/src/pages/LessonDetailPage.tsx).

---

## Phase 6: App Shell & Routing

- [X] T016 Create App.tsx with React Router, auth guards, and layout.
- [X] T017 Create main.tsx entry point.

---

## Phase 7: Polish & Verification

- [X] T018 Build production bundle and verify static output.
- [X] T019 [P] Test against Firebase Emulators in browser.
