# Little Buddha — Web App 🪷

A React + TypeScript single-page application built with [Vite](https://vite.dev). Serves as the web client for the Little Buddha mindfulness app, connecting to Firebase for authentication, lesson data, and media.

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** — dev server & build tool
- **React Router v7** — client-side routing
- **Firebase SDK** — Auth, Firestore, Storage

## Prerequisites

- **Node.js** v18+
- **Firebase Emulator Suite** running (see [`firebase/README.md`](../firebase/README.md))

## Getting Started

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Start the Firebase Emulators

The web app connects to Firebase services. For local development, start the emulators first in a **separate terminal**:

```bash
cd firebase
npm run serve
```

This starts Auth (`:9099`), Firestore (`:8080`), Storage (`:9199`), and the Emulator UI (`:4000`).

### 3. Run in Development Mode

```bash
npm run dev
```

Vite starts a local dev server with **Hot Module Replacement (HMR)** — changes to your code are reflected instantly in the browser without a full reload.

The app will be available at **http://localhost:5173** (default Vite port).

### 4. Build for Production

```bash
npm run build
```

This runs the TypeScript compiler (`tsc -b`) followed by `vite build`. The production bundle is output to `../firebase/dist/`, ready for deployment via Firebase Hosting.

### 5. Preview the Production Build

```bash
npm run preview
```

Serves the production build locally so you can verify it before deploying.

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start Vite dev server with HMR |
| `build` | `tsc -b && vite build` | Type-check & build for production |
| `preview` | `vite preview` | Locally preview the production build |
| `lint` | `eslint .` | Run ESLint across the project |

## Project Structure

```
web/
├── public/                  # Static assets (served as-is)
├── src/
│   ├── assets/              # Images, icons, etc.
│   ├── components/          # Reusable React components
│   ├── context/             # React context providers
│   ├── pages/               # Route-level page components
│   ├── services/            # Firebase service wrappers
│   ├── firebase.ts          # Firebase SDK initialization
│   ├── types.ts             # Shared TypeScript types
│   ├── App.tsx              # Root component & routing
│   ├── App.css              # App-level styles
│   ├── index.css            # Global styles & design tokens
│   └── main.tsx             # Entry point
├── index.html               # HTML shell
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript project references
├── tsconfig.app.json        # App TypeScript config
├── tsconfig.node.json       # Node/Vite TypeScript config
└── eslint.config.js         # ESLint configuration
```

## Build Output

The Vite build is configured to output to `../firebase/dist/` so that `firebase deploy --only hosting` serves the web app directly. This is set in [`vite.config.ts`](vite.config.ts):

```ts
build: {
  outDir: '../firebase/dist',
  emptyOutDir: true,
}
```

## Deployment

After building, deploy from the `firebase/` directory:

```bash
cd ../firebase
firebase deploy --only hosting
```

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // Or for stricter rules:
      // tseslint.configs.strictTypeChecked,
      // tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules.
