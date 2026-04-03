---
description: "Task list for Little Buddha App Core MVP (Firebase Edition)"
---

# Tasks: Little Buddha App Core MVP (Firebase)

**Input**: Design documents from `/specs/001-little-buddha-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.ts, research.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Initialize Firebase project in firebase/ via `firebase init` (Functions, Firestore, Storage, Emulators).
- [ ] T002 Update Expo project in mobile/ to install `@react-native-firebase/app`, `auth`, `firestore`, `storage`.
- [ ] T003 [P] Configure CI/CD GitHub Actions for Firebase Deploy in .github/workflows/firebase.yml.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Define strict Firebase Security Rules for Firestore in firebase/firestore.rules.
- [ ] T005 [P] Define strict Firebase Security Rules for Storage in firebase/storage.rules.
- [ ] T006 Initialize Firebase app config in mobile/src/services/firebaseConfig.ts pointing to local emulators in dev.

---

## Phase 3: User Story 1 - User Authentication & Onboarding (Priority: P1)

- [ ] T007 [P] [US1] Create Playwright tests for Firebase Security Rules using `@firebase/rules-unit-testing` in firebase/tests/rules.spec.ts.
- [ ] T008 [US1] Implement Firebase Auth Service API client in mobile/src/api/authService.ts (using `@react-native-firebase/auth`).
- [ ] T009 [US1] Create Cloud Function `onUserCreated` to automatically sync Registration data to Firestore `users/{uid}` in firebase/functions/src/index.ts.
- [ ] T010 [US1] Update `RegistrationScreen.tsx` and `AuthScreens.tsx` to use the Firebase auth service.

---

## Phase 4: User Story 2 - Age-Appropriate Content Discovery (Priority: P1)

- [ ] T011 [P] [US2] Update rule tests to verify the `targetAgeTier` read access enforcement in firebase/tests/rules.spec.ts.
- [ ] T012 [US2] Implement Lesson API client mapping to `firestore().collection('lessons')` in mobile/src/api/lessonService.ts.
- [ ] T013 [US2] Update `LessonList.tsx` to read directly from the lesson service.

---

## Phase 5: User Story 3 - Story Consumption & Discussion (Priority: P2)

- [ ] T014 [US3] Implement Cloud Storage retrieval logic in the lesson service to map `audioRef` to a playable URL.
- [ ] T015 [US3] Update `AudioPlayer.tsx` to handle secure Firebase download URLs.

## Phase 6: Polish

- [ ] T016 [P] Finish UI styling tweaks and test against the Expo simulator.
