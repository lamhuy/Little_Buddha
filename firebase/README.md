# Little Buddha — Firebase Backend 🪷

The Firebase backend for the **Little Buddha** mindfulness app for children. This project powers authentication, data storage, media hosting, and serverless functions for the mobile and web clients.

## Architecture Overview

```
firebase/
├── functions/              # Cloud Functions & admin scripts
│   ├── src/
│   │   └── index.ts        # Cloud Function source (TypeScript)
│   ├── index.js             # Compiled Cloud Function (auto-generated)
│   ├── seed-lessons.js      # Seeds lesson content, audio & images
│   ├── create-user.js       # Creates test user in emulator & production
│   ├── stories.md           # Story references for lesson content
│   └── package.json         # Functions dependencies
├── tests/
│   └── rules.spec.ts       # Firestore security rules unit tests
├── firestore.rules          # Firestore security rules
├── storage.rules            # Cloud Storage security rules
├── firebase.json            # Emulator & service configuration
└── package.json             # Root dev dependencies & scripts
```

## Services Used

| Service | Purpose | Emulator Port |
|---------|---------|:------------:|
| **Firebase Auth** | Email/password authentication | `9099` |
| **Cloud Firestore** | User profiles & lesson documents | `8080` |
| **Cloud Storage** | Lesson audio (MP3) & illustrations (JPG) | `9199` |
| **Cloud Functions** | `onUserCreated` — auto-provisions user profile | `5001` |
| **Emulator UI** | Visual dashboard for all emulated services | `4000` |

## Prerequisites

- **Node.js** v18+ (v20 recommended)
- **Java** JDK 21+ (required by Firebase Emulator Suite)
- **Firebase CLI** — install globally:
  ```bash
  npm install -g firebase-tools
  ```
- **Firebase Login** — authenticate with the project:
  ```bash
  firebase login
  ```

## Getting Started

### 1. Install Dependencies

```bash
# Root firebase dependencies (testing, etc.)
cd firebase
npm install

# Cloud Functions dependencies
cd functions
npm install
```

### 2. Service Account Key (for production seeding)

The seed and create-user scripts write to **both** the local emulator and production Firestore/Storage. To access production, you need a service account key:

1. Go to [Firebase Console → Service Accounts](https://console.firebase.google.com/project/little-buddha-ff838/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Save the file as `firebase/functions/serviceAccountKey.json`

> ⚠️ **Never commit `serviceAccountKey.json` to git.** It is already in `.gitignore`.

### 3. Start the Emulator Suite

From the `firebase/` directory:

```bash
npm run serve
```

This builds the Cloud Functions and launches all emulators. Once running, the Emulator UI is available at **http://localhost:4000**.

> **Important:** The emulators must be running before you execute any seed or create-user scripts, otherwise you will get `ECONNREFUSED` errors.

### 4. Seed Lesson Content

With emulators running, open a **separate terminal**:

```bash
cd firebase/functions
node seed-lessons.js
```

This script:
- Splits each lesson into pages (one per paragraph)
- Generates TTS audio via Google Translate for each page
- Generates illustrations via Gemini API (or placeholder fallback)
- Uploads audio & images to **both** emulator and production Storage
- Creates lesson documents in **both** emulator and production Firestore

**Optional:** Set `GEMINI_API_KEY` environment variable for AI-generated illustrations:
```bash
set GEMINI_API_KEY=your_api_key_here   # Windows
export GEMINI_API_KEY=your_api_key_here # macOS/Linux
```

### 5. Create Test User

With emulators running, open a **separate terminal**:

```bash
cd firebase/functions
node create-user.js
```

This creates a test user account in both the emulator Auth and production Auth, and writes the corresponding Firestore profile document.

## Lesson Content

The app serves age-gated mindfulness lessons across three tiers:

### 0–7 Age Tier (10 lessons)

| Lesson ID | Title | Inspired By |
|-----------|-------|-------------|
| `lesson-0-7` | Mindful Breathing for Kids | Original — frog breathing meditation |
| `lesson-0-7-swan` | The Prince and the Wounded Swan | Buddhist tradition — Prince Siddhartha |
| `lesson-0-7-garden` | The Garden of Perpetual Summer | Buddhist tradition — Siddhartha's palace |
| `lesson-0-7-stillwater` | Stillwater the Wise Panda | *Zen Shorts* by Jon J. Muth |
| `lesson-0-7-pebble` | The Magic Pebble Meditation | *A Pebble for Your Pocket* by Thich Nhat Hanh |
| `lesson-0-7-moody` | Moody Cow and the Mind Jar | *Moody Cow Meditates* by Kerry Lee MacLean |
| `lesson-0-7-monkey` | The Brave Monkey King | Mahakapi Jataka (Buddhist tradition) |
| `lesson-0-7-wonder` | The Joy of Wondering | *I Wonder* by Annaka Harris |
| `lesson-0-7-ripples` | Ripples of Kindness | *Each Kindness* by Jacqueline Woodson |
| `lesson-0-7-rabbit` | The Rabbit on the Moon | Sasa Jataka (Buddhist tradition) |

### 8–12 Age Tier (1 lesson)

| Lesson ID | Title |
|-----------|-------|
| `lesson-8-12` | Finding Your Inner Focus |

### 13–18 Age Tier (1 lesson)

| Lesson ID | Title |
|-----------|-------|
| `lesson-13-18` | Navigating Teenage Anxiety |

## Security Rules

### Firestore Rules

- **`/users/{userId}`** — Authenticated users can only read/write their own profile
- **`/lessons/{lessonId}`** — Read-only for authenticated users whose age matches the lesson's `targetAgeTier`. No client writes allowed.
- Age is calculated from `birth_year` stored in the user's profile document

### Storage Rules

- **`/audio/*`** — Read-only for authenticated users
- **`/images/*`** — Read-only for authenticated users
- **`/users/{userId}/*`** — Read/write for the owning user only
- Everything else is denied by default

## Cloud Functions

### `onUserCreated`

**Trigger:** `functions.auth.user().onCreate()`

Automatically provisions a Firestore user profile document when a new account is created in Firebase Auth. This prevents the client from needing to perform initialization writes.

**Source:** [`functions/src/index.ts`](functions/src/index.ts)

## Testing

### Security Rules Tests

```bash
# Make sure emulators are running first (npm run serve)
cd firebase
npm test
```

Tests are located in [`tests/rules.spec.ts`](tests/rules.spec.ts) and use `@firebase/rules-unit-testing` to verify:
- Users can read/write their own profile
- Age-gated lesson access is enforced

## Deployment

### Deploy Everything

```bash
firebase deploy
```

### Deploy Individual Services

```bash
firebase deploy --only functions    # Cloud Functions
firebase deploy --only firestore    # Firestore rules
firebase deploy --only storage      # Storage rules
firebase deploy --only hosting      # Web hosting
```

## NPM Scripts

### Root (`firebase/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `serve` | `npm run build && firebase emulators:start` | Build functions & start all emulators |
| `build` | `npm --prefix functions run build` | Compile TypeScript functions |
| `test` | `jest` | Run security rules tests |

### Functions (`firebase/functions/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `npx tsc` | Compile TypeScript to JavaScript |
| `serve` | `npm run build && firebase emulators:start --only functions` | Start functions emulator only |
| `deploy` | `firebase deploy --only functions` | Deploy functions to production |
| `logs` | `firebase functions:log` | View production function logs |

## Troubleshooting

### `ECONNREFUSED 127.0.0.1:9199`

The Firebase emulators are not running. Start them first:

```bash
cd firebase
npm run serve
```

Then run your seed/create-user scripts in a **separate terminal**.

### `Missing serviceAccountKey.json for production!`

You need a service account key to seed production. See [Service Account Key](#2-service-account-key-for-production-seeding) above.

### Java not found or wrong version

The Firebase Emulator Suite requires **Java 21+**. Verify with:

```bash
java -version
```

If missing, download from [Adoptium](https://adoptium.net/).
