# Phase 0: Research & Architecture Decisions (Firebase)

## Unknown 1: Auth Custom Claims & Initialization

**Context**: Users need an age tier attribute calculated from the `birth_year` provided during registration, similar to how AWS Cognito triggers injected claims into the JWT.

**Decision**: We will use a **Firebase Auth triggers (Cloud Functions)** (`functions.auth.user().onCreate`). When a user signs up, the mobile app writes their profile data (including `birth_year`) to a `/users/{uid}` document in Firestore. The Firebase SDK automatically securely associates this write with the user context.

**Rationale**: Firebase natively relies on Firestore logic and custom claims. Instead of forcing a token refresh on the client immediately to evaluate age logic, the simplest flow is to store `birthYear` in the user's Firestore Document, and have the mobile client read this document via the React Native Firebase SDK on app load.

## Technology Best Practices

### Firebase Client vs HTTP API
**Decision**: Use `@react-native-firebase/firestore` and `@react-native-firebase/auth` directly within the mobile app, configuring strict **Firebase Security Rules** to restrict access, rather than wrapping database calls in HTTP functions.
**Rationale**: This is the idiomatic, most performant way to use Firebase. It provides offline caching, real-time updates, and significantly reduces boilerplate backend code.

### Audio Delivery
**Decision**: Store audio files in Firebase Cloud Storage. Use the React Native SDK to retrieve secure download URLs and stream them via `expo-av`. Firebase Cloud Storage handles CDN distribution securely via its global edge networks.

### CI/CD and Testing
**Decision**: GitHub Actions will trigger `firebase deploy`. For testing rules and backend logic locally, the **Firebase Local Emulator Suite** will be used in tandem with Playwright for fast integrations without hitting the cloud network.
