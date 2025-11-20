---
title: "Tests Pass Locally, Fail on Vercel? Here's Why"
description: "Understanding why your Next.js tests work perfectly on your machine but mysteriously fail on Vercel's CI environment - and how to fix it."
pubDate: 2025-11-20
author: "Óscar Gallego"
tags: ["nextjs", "vercel", "testing", "ci-cd", "vitest", "react"]
draft: false
relatedSlug: "tests-localmente-fallan-vercel"
image:
  url: "/projects/snapcompress.webp"
  alt: "Tests failing on Vercel CI environment"
---

## The Problem

```bash
# Local
$ pnpm test
✓ All tests pass (181 passed)

# Vercel
❌ Build failed
Error: actImplementation is not a function
```

Same code. Same dependencies. Different results.

**Stack**: Next.js 16, React 19, Vitest, Vercel
**Time wasted**: 4 hours chasing wrong problem
**Root cause**: Misunderstanding Vercel's CI environment

---

## What I Thought It Was

"React 19 compatibility issue with Testing Library!"

So I created:
- ❌ 125-line patch script for React internals
- ❌ Custom Vite plugin for module resolution
- ❌ Mock files and import redirects

All failed on Vercel. All unnecessary.

---

## The Real Problem

### Your Machine ≠ Vercel's CI

**Local Development:**
- Fast SSD, direct I/O
- Dedicated CPU/memory
- React loads in development mode
- Consistent environment

**Vercel CI:**
- Networked storage (slower I/O)
- Shared container resources
- May default to production mode
- Cold starts every build

**Result:** Operations take 5-10x longer on Vercel.

---

## The Actual Issues

### Issue 1: Environment Mode

Vercel wasn't loading React in test mode by default.

**The Fix:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',

    // ← Forces React test mode
    env: {
      NODE_ENV: 'test',
    },
  },
})
```

**Why this matters:**
- React's development build includes test utilities
- Production build strips them out
- Without `NODE_ENV: 'test'`, React loads incorrectly on Vercel

### Issue 2: Resource Constraints

CI containers are slower. Operations that seem instant locally timeout on Vercel.

**The Fix:**

```typescript
// CI-aware timeout configuration
const TIMEOUT = process.env.CI ? 10000 : 5000

it('resource-intensive test', async () => {
  // test code
}, TIMEOUT)
```

**Real-world example:**

```typescript
// Creating a 100MB test file
const largeFile = createMockImageFile(
  'large.jpg',
  100 * 1024 * 1024,
  'image/jpeg'
)

// Local: ~500ms
// Vercel CI: ~6-7 seconds (!)
```

---

## Minimal Working Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,

    // Critical for Vercel CI
    env: {
      NODE_ENV: 'test',
    },

    // Global timeout with CI awareness
    testTimeout: process.env.CI ? 10000 : 5000,
  },
})
```

### Environment-Aware Test Timeouts

```typescript
// test-config.ts
export const TEST_TIMEOUTS = {
  FAST: process.env.CI ? 5000 : 2000,
  MEDIUM: process.env.CI ? 10000 : 5000,
  SLOW: process.env.CI ? 30000 : 15000,
}

// In your tests
import { TEST_TIMEOUTS } from './test-config'

describe('Feature', () => {
  it('fast operation', async () => {
    // Quick unit test
  }, TEST_TIMEOUTS.FAST)

  it('file I/O operation', async () => {
    // File processing, small data
  }, TEST_TIMEOUTS.MEDIUM)

  it('complex operation', async () => {
    // Large files, network, heavy processing
  }, TEST_TIMEOUTS.SLOW)
})
```

---

## Quick Diagnostic Checklist

When tests fail on Vercel but pass locally:

1. ✅ **Check if `NODE_ENV: 'test'` is set** in vitest.config
2. ✅ **Look at Vercel build logs** for slow tests
3. ✅ **Add explicit timeouts** to resource-intensive tests
4. ✅ **Use environment-aware configuration**
5. ✅ **Mock expensive operations** (file I/O, large data)
6. ❌ **Don't assume it's library compatibility**

### Common Patterns

```typescript
// ❌ Assumes local environment
it('test', async () => {
  await heavyOperation()
})

// ✅ Accounts for CI differences
it('test', async () => {
  await heavyOperation()
}, process.env.CI ? 15000 : 5000)
```

```typescript
// ❌ Creating real 100MB files
const largeFile = createRealFile(100 * 1024 * 1024)

// ✅ Use lightweight mocks
const largeFile = createMockFile({ size: 100 * 1024 * 1024 })
```

---

## Key Lessons

### 1. Vercel CI ≠ Your MacBook

Design tests with CI in mind from the start:
- Containerized builds
- Shared resources
- Slower I/O
- Different defaults

### 2. Configure Explicitly

Don't rely on default behavior. Set:
- `NODE_ENV` explicitly
- Timeouts for slow operations
- Environment-aware configs

### 3. Error Messages Can Mislead

`actImplementation is not a function` wasn't about React compatibility - it was about React loading in the wrong mode due to environment misconfiguration.

### 4. Design for CI from the Start

Write tests knowing they'll run on slower infrastructure. Account for:
- Cold container starts
- Networked storage
- Resource throttling
- Shared CPU/memory

---

## Understanding Vercel's Build Environment

### What Makes It Different

**Containerized Builds:**
- Each build runs in an isolated container
- Containers share infrastructure resources
- I/O is networked, not local

**Cold Starts:**
- Containers spin up fresh for each build
- No warm filesystem cache
- Dependencies downloaded every time

**Resource Limits:**
- CPU/memory throttling
- Shared infrastructure
- Different performance characteristics

**Environment Variables:**
- Different defaults than your local `.env`
- `NODE_ENV` might not be what you expect
- Need explicit configuration

---

## Bottom Line

Vercel's CI is:
- **Slower** than your local machine (5-10x)
- **Different** in how it runs Node.js
- **Needs explicit configuration** to work properly

**Configure for it. Don't fight it.**

The error message pointed to React.
The problem was Vercel's environment.
The solution was understanding the difference.

---

## Related Resources

- [Vitest Environment Configuration](https://vitest.dev/config/#environment)
- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [Next.js Testing Best Practices](https://nextjs.org/docs/testing)

---

*Have you dealt with Vercel CI issues? Share your experience in the comments!*
