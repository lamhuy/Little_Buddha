# Quickstart (Firebase Edition)

This document provides instructions for spinning up the local development environment for the Little Buddha Application using Firebase.

## Prerequisites
- Node.js (v18+)
- Java 11+ (Required by Firebase Emulator Suite)
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Studio Emulator

## Backend (Firebase Emulators)

1. Verify Firebase CLI login:
   ```bash
   firebase login
   ```
2. Navigate to the backend directory (once created in implementation):
   ```bash
   cd firebase
   npm install
   ```
3. Start the entire Firebase Local Emulator Suite (Auth, Firestore, Storage):
   ```bash
   npm run serve
   ```
   *The emulator UI typically runs on http://localhost:4000*

## Mobile Application

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   npm install
   ```
2. Create mapping files (`google-services.json` / `GoogleService-Info.plist`) by registering apps in the Firebase Console (development config), and place them in the correct directories for Expo auto-linking.
3. Start the Expo development server, instructing the `@react-native-firebase` SDK to point to the local emulator:
   ```bash
   npx expo start
   ```
4. Press `i` to open in the iOS simulator, or `a` to open in the Android emulator.

## Running Tests

- **Rules Tests (Playwright/Jest)**: Test security rules against the emulator without launching an app.
- **Mobile Tests (Detox)**: Run E2E tests against the UI while the backend emulator runs locally.
