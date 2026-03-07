# Runtime Microfrontend POC with Next.js + Rspack

A brief guide to implementing **runtime** microfrontends using **Next.js**, **next-rspack**, and **Module Federation**.

---

## Overview

| Piece | Role |
|-------|------|
| **Next.js** | App framework (App Router or Pages) |
| **next-rspack** | Uses Rspack instead of Webpack (Next.js 15.3+) |
| **Module Federation** | Load and share code between apps at **runtime** |
| **Runtime remotes** | Remote URLs decided at runtime (e.g. from API/config), not at build time |

You get: independent deploy of host + remotes, shared dependencies (e.g. React), and dynamic loading of remote entry points.

---

## Prerequisites

- **Node.js** 18+
- **Next.js** >= 15.3.0
- Two apps: one **host**, one or more **remotes**

---

## 1. Next.js + Rspack (both apps)

### Install

```bash
npm install next@latest next-rspack
# or
pnpm add next next-rspack
```

### Enable Rspack

In `next.config.js` or `next.config.ts`:

```ts
import withRspack from 'next-rspack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* your config */
};

export default withRspack(nextConfig);
```

You can then customize Rspack (including Module Federation) via the `webpack` callback in `nextConfig` (see step 3).

---

## 2. Choose Module Federation version

- **MF v1.5** – Built into Rspack, no extra plugin. Use `rspack.container.ModuleFederationPlugin`.
- **MF v2.0** – Extra features (runtime plugins, preload, etc.). Use `@module-federation/enhanced`.

For a POC, either is fine; v2 is better if you want runtime plugins and dynamic remotes helpers.

### Option A: MF v1.5 (built-in)

No extra install. In config you’ll use:

```js
import { rspack } from '@rspack/core';

new rspack.container.ModuleFederationPlugin({ ... })
```

### Option B: MF v2.0 (recommended for runtime remotes)

```bash
npm install @module-federation/enhanced
# Optional: for dynamic remotes at runtime
npm install @module-federation/runtime
```

Config uses:

```js
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
// and optionally @module-federation/runtime for registerRemotes(), loadRemote(), etc.
```

---

## App Router vs Pages Router with @module-federation/runtime

**Yes — `@module-federation/runtime` works with both App Router and Pages Router** when you use **next-rspack** + **@module-federation/enhanced** (the Rspack plugin).

| Aspect | App Router | Pages Router |
|--------|-------------|--------------|
| **@module-federation/runtime** | Supported | Supported |
| **Consumption** | Use in Client Components or layout | Use in pages or `_app` |
| **Loading remotes** | `dynamic(() => import('remote/Button'), { ssr: false })` | Same pattern in any page |
| **registerRemotes()** | Call in a Client Component or in layout (client-side) | Call in `_app` or in a page |

The runtime package is **framework-agnostic**: it only provides APIs (`registerRemotes`, `loadRemote`, etc.). It does not depend on Next.js routing. You call it from whichever part of your app runs on the client (App Router: Client Component or `useEffect` in layout; Pages Router: page or `_app`).

**Important distinction:** The “App Router Not Supported” note in the Module Federation docs refers to **@module-federation/nextjs-mf** (NextFederationPlugin), which is a different, Next-specific plugin that ships its own Webpack config and was built for the Pages Router. Your POC uses **next-rspack** + **@module-federation/enhanced**, so that limitation does not apply.

- **App Router**: Prefer loading remotes in Client Components with `'use client'` and `dynamic(..., { ssr: false })` to avoid hydration/SSR issues. Call `registerRemotes()` in a client component or in a `useEffect` in the root layout.
- **Pages Router**: Use the same `dynamic()` in any page; call `registerRemotes()` in `_app.tsx` or in the page that needs the remote.

---

```
module-federation-poc/
├── apps/
│   ├── host/                 # Next.js app that consumes remotes
│   │   ├── next.config.ts
│   │   ├── module-federation.config.ts   # if using MF v2
│   │   └── src/
│   └── remote/               # Next.js app that exposes components
│       ├── next.config.ts
│       ├── module-federation.config.ts
│       └── src/
└── README-RUNTIME-MF.md      # this file
```

---

## 4. Remote app (exposes a component)

### 4.1 MF v2 style config

Create `module-federation.config.ts` in the **remote** app:

```ts
import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
  name: 'remote_app',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/components/Button.tsx',
    './Widget': './src/components/Widget.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});
```

### 4.2 Wire into Next.js (Rspack)

In the **remote** `next.config.ts`, add the Rspack/Module Federation plugin. With `@module-federation/enhanced`:

```ts
import withRspack from 'next-rspack';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import mfConfig from './module-federation.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.plugins.push(new ModuleFederationPlugin(mfConfig));
    return config;
  },
};

export default withRspack(nextConfig);
```

Run the remote on its own port, e.g. `http://localhost:3001`. The remote entry is typically served at `http://localhost:3001/remoteEntry.js` (or as per your `filename` and Next.js static serving).

---

## 5. Host app (consumes remotes)

### 5.1 Build-time remotes (simple POC)

In the **host** `module-federation.config.ts`:

```ts
import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
  name: 'host_app',
  remotes: {
    remote: 'remote_app@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});
```

Wire the same way in host’s `next.config.ts` (withRspack + ModuleFederationPlugin with this config).

### 5.2 Runtime remotes (dynamic URLs)

For **runtime** microfrontends, remote URLs should not be fixed at build time. Use the **runtime** API to register remotes when the app loads.

1. **Install runtime package** (if using MF v2):

   ```bash
   npm install @module-federation/runtime
   ```

2. **Register remotes at runtime** (e.g. in root layout or a provider):

   ```ts
   import { registerRemotes } from '@module-federation/runtime';

   // e.g. from env, API, or config
   const remoteUrl = process.env.NEXT_PUBLIC_REMOTE_URL || 'http://localhost:3001/remoteEntry.js';

   registerRemotes([
     { name: 'remote_app', entry: remoteUrl },
   ]);
   ```

3. **Load the remote component** with a dynamic import aligned with the remote’s `exposes`:

   ```tsx
   import dynamic from 'next/dynamic';

   const RemoteButton = dynamic(
     () => import('remote_app/Button').then((m) => m.default),
     { ssr: false, loading: () => <p>Loading remote...</p> }
   );

   export default function Page() {
     return (
       <div>
         <h1>Host</h1>
         <RemoteButton />
       </div>
     );
   }
   ```

For MF v2 + Rspack, the remote name and exposed module path must match what you defined in the remote’s `module-federation.config.ts` (e.g. `remote_app` and `./Button` → `remote_app/Button`).

---

## 6. Run the POC

1. **Start the remote** (port 3001):

   ```bash
   cd apps/remote && npm run dev
   ```

2. **Start the host** (port 3000):

   ```bash
   cd apps/host && npm run dev
   ```

3. Open the host (e.g. `http://localhost:3000`). It should load the remote component from the remote app at runtime.

---

## 7. Important notes

- **CORS**: Remote must allow the host origin (e.g. via `next.config` headers or server).
- **Shared deps**: Keep `react` / `react-dom` (and other shared libs) as `singleton: true` and version-aligned to avoid duplicate React instances.
- **SSR**: Using `dynamic(..., { ssr: false })` avoids many SSR/hydration issues with remotes in Next.js; enable SSR for remotes only if you follow Module Federation’s SSR patterns (e.g. streaming, manifest).
- **Runtime vs build-time**: For true runtime microfrontends, avoid hardcoding remote URLs in the host’s build config; use `registerRemotes()` (or equivalent) with URLs from env/API/config.

---

## 8. References

- [Rspack – Module Federation](https://rspack.rs/guide/features/module-federation)
- [Rspack – Next.js](https://rspack.rs/guide/tech/next)
- [Module Federation – Rspack plugin](https://module-federation.io/guide/build-plugins/plugins-rspack)
- [Module Federation – Dynamic remote](https://module-federation.io/practice/frameworks/modern/dynamic-remote) (concept for runtime remotes)
- Next.js example: [with-rspack](https://github.com/vercel/next.js/tree/canary/examples/with-rspack)

---

## Quick start checklist

- [ ] Next.js >= 15.3, install `next-rspack`, wrap config with `withRspack()`
- [ ] Install `@module-federation/enhanced` (and optionally `@module-federation/runtime`)
- [ ] Remote: create `module-federation.config.ts` with `name`, `exposes`, `shared`
- [ ] Remote: add `ModuleFederationPlugin(mfConfig)` in `next.config` `webpack` callback
- [ ] Host: same plugin with `remotes` pointing to remote entry URL (or use runtime `registerRemotes`)
- [ ] Host: load remote with `dynamic(() => import('remote_app/Button'))` (and `ssr: false` if needed)
- [ ] Run remote then host; ensure CORS and shared dependency versions are aligned

---

## Commands to create the host app

Run these from the repo root (`module-federation-poc`).

### 1. Create the Next.js app (host)

```bash
cd "c:\Users\prkopergaonkar\Desktop\D.tec olympics\module-federation-poc"
mkdir apps
cd apps
npx create-next-app@latest host --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

When prompted:

- **Would you like to use Turbopack?** → No (we use Rspack instead).
- Accept defaults for the rest.

### 2. Install Rspack and Module Federation (host)

```bash
cd host
npm install next-rspack @module-federation/enhanced @module-federation/runtime
```

### 3. Enable Rspack and Module Federation in the host

**Replace** the contents of `next.config.ts` with:

```ts
import withRspack from 'next-rspack';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import mfConfig from './module-federation.config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.plugins = config.plugins || [];
    config.plugins.push(new ModuleFederationPlugin(mfConfig));
    return config;
  },
};

export default withRspack(nextConfig);
```

### 4. Create host Module Federation config

Create `apps/host/module-federation.config.ts`:

```ts
import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
  name: 'host_app',
  remotes: {
    remote_app: 'remote_app@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});
```

(Change the URL when your remote runs on a different port.)

### 5. Add a page that loads the remote (after remote exists)

Example in `apps/host/src/app/page.tsx`:

```tsx
import dynamic from 'next/dynamic';

const RemoteButton = dynamic(
  () => import('remote_app/Button').then((m) => m.default),
  { ssr: false, loading: () => <p>Loading remote...</p> }
);

export default function Home() {
  return (
    <main>
      <h1>Host app</h1>
      <RemoteButton />
    </main>
  );
}
```

### 6. Run the host

```bash
cd apps/host
npm run dev
```

Host runs at http://localhost:3000. Start the **remote** app first (e.g. on port 3001) so the host can load its components.

---

### One-liner summary (after `apps` exists)

```bash
cd "c:\Users\prkopergaonkar\Desktop\D.tec olympics\module-federation-poc\apps"
npx create-next-app@latest host --typescript --tailwind --eslint --app --src-dir --no-import-alias
cd host
npm install next-rspack @module-federation/enhanced @module-federation/runtime
```

Then add `next.config.ts`, `module-federation.config.ts`, and the page that uses the remote as above.
