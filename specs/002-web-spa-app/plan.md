# Implementation Plan: Little Buddha Web Application

**Branch**: `002-web-spa-app` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-web-spa-app/spec.md`

## Summary

A single-page web application (SPA) built with Vite + React + TypeScript that mirrors the mobile app's functionality: Firebase Authentication, age-tiered lesson discovery, and audio playback. Deployable as a static site to any hosting provider (Firebase Hosting, Netlify, etc.). Shares the same Firebase backend (Auth, Firestore, Cloud Storage) as the mobile app.

## Technical Context

**Language/Version**: TypeScript (React 19 for web)
**Framework**: Vite (SPA mode, static output)
**Primary Dependencies**: React, React Router, Firebase JS SDK (`firebase`), Vite
**Storage**: Cloud Firestore (NoSQL), Firebase Cloud Storage (Audio) — shared with mobile
**Testing**: Browser-based manual verification against Firebase Emulators
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
**Project Type**: Static SPA Web Application
**Performance Goals**: Page interactive < 3s, audio playback initiation < 2s
**Constraints**: No SSR — purely client-side rendering. Uses Firebase JS SDK (not `@react-native-firebase`).

## Project Structure

### Source Code (repository root)

```text
web/                        # Web application
├── index.html              # Vite entry HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Router + auth-guarded layout
    ├── index.css           # Global styles + design system
    ├── firebase.ts         # Firebase JS SDK init + emulator config
    ├── types.ts            # Shared TypeScript interfaces
    ├── context/
    │   └── AuthContext.tsx  # Auth state provider
    ├── services/
    │   ├── authService.ts  # Firebase Auth operations
    │   └── lessonService.ts # Firestore lesson queries
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── HomePage.tsx
    │   └── LessonDetailPage.tsx
    └── components/
        ├── AudioPlayer.tsx
        ├── LessonCard.tsx
        └── ProtectedRoute.tsx
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| None | N/A | N/A |
