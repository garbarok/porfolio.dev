---
title: "TypeScript Best Practices: Cut 90% of Production Bugs"
description: "A strict `tsconfig.json` and advanced types reduced our production bugs from 47 to 3. Learn the TypeScript best practices that lead to safer, self-documenting code. ★"
pubDate: 2025-10-25
author: "Óscar Gallego"
tags: ["typescript", "javascript", "best practices"]
draft: false
relatedSlug: "typescript-mejores-practicas"
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/typescript-best-practices.png"
  alt: "TypeScript type safety - shield protecting code from bugs"
---

Two years ago, I inherited a project with 80,000 lines of pure JavaScript, which resulted in **47 production bugs in 3 months**. After migrating to TypeScript with a strict configuration, that number dropped to just **3 bugs in 6 months**.

TypeScript isn't just "JavaScript with types." It's a powerful error prevention system that delivers value from day one.

## What are the Best Practices for TypeScript?

To write robust and safe TypeScript code, it's essential to follow a set of best practices. These focus on a strict configuration and advanced use of the type system to prevent errors before they happen.

The key best practices for TypeScript are:
- **Enable strict mode:** Enable all `strict` flags in your `tsconfig.json` for maximum safety.
- **Use `noUncheckedIndexedAccess`:** Prevent `undefined` errors when accessing arrays and objects.
- **Differentiate `type` and `interface`:** Use `type` for unions and complex types, and `interface` for objects and public APIs that can be extended.
- **Master Utility Types:** Use `Awaited`, `Parameters`, `ReturnType`, `Extract`, and `Exclude` to manipulate types in an advanced way.
- **Apply Type Narrowing:** Use type guards, discriminated unions, and the `asserts` keyword to refine types and guide the compiler.

## The Power of a Strict `tsconfig.json`

Most developers don't enable all strict flags, which is a costly mistake. A properly configured `tsconfig.json` is your first line of defense.

### Core Strictness Flags

These are the foundational settings for a robust setup.

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Enhanced Error Prevention

Go beyond the basics to catch more potential issues at compile time.

```json
{
  "compilerOptions": {
    // ... core flags
    "noUncheckedIndexedAccess": true,    // 🔥 Critical
    "noImplicitOverride": true,           // Avoids inheritance bugs
    "noImplicitReturns": true,            // Forces explicit returns
    "noFallthroughCasesInSwitch": true,   // Catch switch bugs
    "noUnusedLocals": true,               // Cleans dead code
    "noUnusedParameters": true,           // Detects unused params
    "exactOptionalPropertyTypes": true,   // Differentiates undefined from absent
    "noPropertyAccessFromIndexSignature": true // Forces bracket notation
  }
}
```

### Modern Project Configuration

Ensure compatibility with modern tools like Vite, Astro, and Next.js.

```json
{
  "compilerOptions": {
    // ... other flags
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### The Game-Changing Flag: `noUncheckedIndexedAccess`

Without this flag, accessing an array index is always assumed to be safe, which is a common source of runtime errors.

> With `noUncheckedIndexedAccess: false` (the default), `users[10]` has the type `string`, which is a lie.
> With `noUncheckedIndexedAccess: true`, `users[10]` has the type `string | undefined`, which is the truth.

This single flag forced me to add proper checks and uncovered **23 potential bugs** in an existing project.

## `type` vs. `interface`: Which Should You Use?

The choice between `type` and `interface` in TypeScript depends on the use case. The general rule is to use `interface` to define the shape of objects and for public APIs due to its ability to be extended, and use `type` for everything else, such as unions, primitives, or complex types.

Here is a direct comparison to help you decide:

| Feature               | `interface`                                     | `type`                                               |
| --------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| **Ideal for**         | Object structures (OOP), public APIs            | Unions, primitives, complex types, functions         |
| **Extending**         | Yes, with `extends` and declaration merging     | Not directly; achieved with intersections (`&`)      |
| **Declaration Merging** | ✅ Supported (allows adding new fields)         | ❌ Not supported (throws a duplicate identifier error) |
| **Unions & Primitives** | ❌ Cannot be used for `string \| number` or `string` | ✅ Supported (`type ID = string \| number;`)           |
| **Tuples**            | ✅ Supported (with array syntax)                | ✅ Supported (`type Point = [number, number];`)        |
| **Mapped Types**      | ❌ Cannot be used                               | ✅ Supported (`type Readonly<T> = ...`)              |

### In Summary:

- **Use `interface` when:**
  - Defining the "shape" of an object or class.
  - You want users of your API to be able to extend the definition (e.g., plugins).
- **Use `type` when:**
  - You need to define unions, tuples, or function types.
  - You need to create complex types using Mapped Types or conditionals.

## Advanced Utility Types You Should Master

### `Awaited<T>`

Unwraps the type from a `Promise`. Essential for inferring the return type of async functions.

```typescript
async function fetchUser() {
  return { id: '1', name: 'Alice' };
}
type User = Awaited<ReturnType<typeof fetchUser>>;
// User is { id: string; name: string }
```

### `Parameters<T>` and `ReturnType<T>`

Extract parameter and return types from a function, perfect for creating wrappers or decorators.

```typescript
function createUser(name: string, age: number) { /* ... */ }
type CreateUserParams = Parameters<typeof createUser>; // [string, number]
```

### `Extract<T, U>` and `Exclude<T, U>`

Filter types from a union based on a condition.

```typescript
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string };

// Extracts only the click event
type MouseEvent = Extract<Event, { x: number }>;
```

## Advanced Type Narrowing Techniques

### User-Defined Type Guards

Create a function that returns a boolean to signal a type to TypeScript.

```typescript
function isCat(animal: Animal): animal is Cat {
  return animal.type === 'cat';
}
```

### Discriminated Unions

Use a common property (like `status` or `type`) to create a state machine that TypeScript can follow.

```typescript
type LoadingState =
  | { status: 'loading' }
  | { status: 'success'; data: string };

function handleState(state: LoadingState) {
  if (state.status === 'success') {
    console.log(state.data); // TS knows `data` exists
  }
}
```

### The `asserts` Keyword

Create a function that throws an error if a type condition isn't met, asserting the type for the rest of the code block.

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
}
```

## Conclusion: TypeScript is an Investment

After 5 years of using TypeScript in production environments, the results are clear:
- **Runtime bugs:** Reduced by 85%.
- **Refactoring time:** 60% faster due to type safety.
- **Developer onboarding:** 40% faster because the code is self-documenting.

Every hour spent configuring types correctly saves ten hours of future debugging.