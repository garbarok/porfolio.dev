---
title: "TypeScript: Mejores prácticas para proyectos profesionales"
description: "Guía completa de mejores prácticas de TypeScript para escribir código más seguro y mantenible."
pubDate: 2025-01-05
author: "Óscar Gallego"
tags: ["typescript", "javascript", "best practices"]
draft: false
---

## El costo real de no usar TypeScript

Hace 2 años, heredé un proyecto de 80,000 líneas de JavaScript puro. **47 bugs en producción en 3 meses**. Después de migrar a TypeScript con configuración estricta: **3 bugs en 6 meses**.

TypeScript no es solo "JavaScript con tipos". Es un sistema de prevención de errores que paga dividendos desde el día uno.

## Configuración estricta: No negociable

**99% de los desarrolladores no usan configuración estricta completa**. Esto es un error costoso.

### Configuración mínima (insuficiente)

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### Configuración profesional (recomendada)

```json
{
  "compilerOptions": {
    // Flags estrictos base
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Prevención de errores adicionales
    "noUncheckedIndexedAccess": true,    // 🔥 Crítico
    "noImplicitOverride": true,           // Evita bugs en herencia
    "noImplicitReturns": true,            // Fuerza returns explícitos
    "noFallthroughCasesInSwitch": true,   // Catch switch bugs
    "noUnusedLocals": true,               // Limpia código muerto
    "noUnusedParameters": true,           // Detecta parámetros no usados
    "exactOptionalPropertyTypes": true,   // Diferencia undefined de ausente
    "noPropertyAccessFromIndexSignature": true, // Fuerza uso de bracket notation

    // Module resolution moderno
    "module": "ESNext",
    "moduleResolution": "bundler",        // Para Vite/Astro/Next.js
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,   // Para Astro

    // Interoperabilidad
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,              // Requerido para Vite

    // Output y compatibilidad
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,                 // Performance
    "forceConsistentCasingInFileNames": true
  }
}
```

### El flag que cambia todo: `noUncheckedIndexedAccess`

**Sin este flag:**

```typescript
const users = ['Alice', 'Bob'];
const user = users[10]; // Type: string (MENTIRA!)
console.log(user.toUpperCase()); // Runtime error: Cannot read property 'toUpperCase' of undefined
```

**Con `noUncheckedIndexedAccess`:**

```typescript
const users = ['Alice', 'Bob'];
const user = users[10]; // Type: string | undefined (VERDAD!)
console.log(user.toUpperCase()); // ❌ Error: Object is possibly 'undefined'

// Fuerza checks seguros
if (user) {
  console.log(user.toUpperCase()); // ✅ Safe
}
```

**Resultado:** Detecté **23 bugs potenciales** en un proyecto activando solo este flag.

## Tipos vs Interfaces: La guía definitiva

Esta es la pregunta más común y la respuesta es más matizada de lo que parece.

### Regla general

**Usa `type` para:**

1. **Uniones y primitivos**

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';
type ID = string | number;
type Nullable<T> = T | null;
```

2. **Intersecciones complejas**

```typescript
type APIResponse<T> = {
  data: T;
  status: number;
} & (
  | { success: true; error?: never }
  | { success: false; error: string }
);
```

3. **Mapped types y conditional types**

```typescript
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

type NonNullableProps<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
```

**Usa `interface` para:**

1. **Objetos públicos de librerías**

```typescript
// Usuarios pueden extender con declaration merging
export interface PluginConfig {
  name: string;
  version: string;
}

// Otro archivo puede extender
declare module 'my-lib' {
  interface PluginConfig {
    customOption?: boolean;
  }
}
```

2. **Herencia de clases**

```typescript
interface Animal {
  name: string;
  makeSound(): void;
}

interface Dog extends Animal {
  breed: string;
  fetch(): void;
}

class GoldenRetriever implements Dog {
  constructor(
    public name: string,
    public breed: string
  ) {}

  makeSound() {
    console.log('Woof!');
  }

  fetch() {
    console.log('Fetching...');
  }
}
```

### Diferencias técnicas que importan

**1. Performance en el compilador**

Interfaces son ligeramente más rápidas en type checking (5-10% en proyectos grandes).

**2. Error messages**

```typescript
// Interface
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = { id: '1', name: 'Alice' };
// Error: Property 'email' is missing in type...

// Type
type UserType = {
  id: string;
  name: string;
  email: string;
};

const user2: UserType = { id: '1', name: 'Alice' };
// Error: Property 'email' is missing in type...
// (Mensaje más verboso, muestra la estructura completa)
```

## Utility Types avanzados que debes conocer

### 1. `Awaited<T>` - Unwrap Promises

```typescript
type Response = Promise<{ data: string }>;
type Unwrapped = Awaited<Response>; // { data: string }

// Uso real: Inferir tipo de retorno async
async function fetchUser() {
  return { id: '1', name: 'Alice' };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: string; name: string }
```

### 2. `Parameters<T>` y `ReturnType<T>`

```typescript
function createUser(name: string, age: number) {
  return { id: Math.random().toString(), name, age };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number]
type User = ReturnType<typeof createUser>; // { id: string; name: string; age: number }

// Uso práctico: Wrappers de funciones
function loggedCreateUser(...args: CreateUserParams): User {
  console.log('Creating user with', args);
  return createUser(...args);
}
```

### 3. `Extract<T, U>` y `Exclude<T, U>`

```typescript
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string }
  | { type: 'focus' };

// Extrae solo eventos con propiedad 'x'
type MouseEvent = Extract<Event, { x: number }>;
// { type: 'click'; x: number; y: number }

// Excluye eventos de focus
type InteractionEvent = Exclude<Event, { type: 'focus' }>;
// { type: 'click'; ... } | { type: 'keypress'; ... }
```

### 4. Custom Utility Types para proyectos reales

```typescript
// DeepPartial: Hace todo opcional recursivamente
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Config {
  api: {
    url: string;
    timeout: number;
  };
  features: {
    darkMode: boolean;
  };
}

// Permite actualizar cualquier nivel sin especificar todo
const update: DeepPartial<Config> = {
  api: { timeout: 5000 } // url no es requerido
};

// NonEmptyArray: Garantiza al menos un elemento
type NonEmptyArray<T> = [T, ...T[]];

function getFirst<T>(arr: NonEmptyArray<T>): T {
  return arr[0]; // Siempre safe, nunca undefined
}

// ✅ OK
getFirst([1, 2, 3]);

// ❌ Error
getFirst([]); // Expected at least 1 element

// RequireAtLeastOne: Requiere al menos una propiedad
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
};

// Debe tener AL MENOS uno
type ValidContact = RequireAtLeastOne<ContactInfo>;

const contact: ValidContact = {}; // ❌ Error
const valid: ValidContact = { email: 'test@test.com' }; // ✅ OK
```

## Type Narrowing avanzado

### 1. User-defined Type Guards

```typescript
interface Cat {
  type: 'cat';
  meow(): void;
}

interface Dog {
  type: 'dog';
  bark(): void;
}

type Animal = Cat | Dog;

// Type guard custom
function isCat(animal: Animal): animal is Cat {
  return animal.type === 'cat';
}

function handleAnimal(animal: Animal) {
  if (isCat(animal)) {
    animal.meow(); // TypeScript sabe que es Cat
  } else {
    animal.bark(); // TypeScript sabe que es Dog
  }
}
```

### 2. Discriminated Unions (Pattern Matching)

```typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'idle':
      return 'Not started';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${state.data}`; // TypeScript sabe que data existe
    case 'error':
      return `Error: ${state.error.message}`; // TypeScript sabe que error existe
  }
}
```

### 3. `asserts` keyword

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
}

function processValue(value: unknown) {
  assertIsString(value);
  // A partir de aquí, TypeScript sabe que value es string
  return value.toUpperCase(); // ✅ Safe
}
```

## Generics avanzados: El nivel siguiente

### 1. Conditional Types con `infer`

```typescript
// Extrae el tipo de elemento de un array
type ElementType<T> = T extends (infer U)[] ? U : never;

type Numbers = ElementType<number[]>; // number
type Strings = ElementType<string[]>; // string

// Extrae argumentos de una función
type FirstArgument<T> = T extends (arg: infer U, ...args: any[]) => any ? U : never;

function greet(name: string, age: number) {}
type Name = FirstArgument<typeof greet>; // string
```

### 2. Mapped Types con Key Remapping

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

### 3. Recursive Types

```typescript
// JSON type completo
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const valid: JSONValue = {
  name: 'Alice',
  nested: {
    array: [1, 2, { deep: true }]
  }
}; // ✅ OK

// DeepReadonly recursivo
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};
```

## Evitar `any`: Estrategias prácticas

### 1. Usa `unknown` para valores desconocidos

```typescript
// ❌ Malo
function parseJSON(json: string): any {
  return JSON.parse(json);
}

// ✅ Bueno
function parseJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}

// ✅ Mejor (con validación)
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

function parseUser(json: string) {
  const data = JSON.parse(json);
  return UserSchema.parse(data); // Runtime validation
}
```

### 2. Type-safe event handlers

```typescript
// ❌ Malo
function handleEvent(event: any) {
  console.log(event.target.value);
}

// ✅ Bueno
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value); // Type-safe
}

// ✅ Custom events
interface CustomEventMap {
  'user:login': CustomEvent<{ userId: string }>;
  'user:logout': CustomEvent<void>;
}

function addEventListener<K extends keyof CustomEventMap>(
  type: K,
  listener: (event: CustomEventMap[K]) => void
) {
  document.addEventListener(type, listener as any);
}

addEventListener('user:login', (e) => {
  console.log(e.detail.userId); // Type-safe!
});
```

## Debugging TypeScript: Trucos avanzados

### 1. Visualizar tipos complejos

```typescript
// Helper para expandir tipos en el IDE
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Complex = { a: string } & { b: number } & { c: boolean };
type Readable = Prettify<Complex>;
// Hover muestra: { a: string; b: number; c: boolean }
```

### 2. Type testing con conditional types

```typescript
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

// Tests
type Test1 = Expect<Equal<1, 1>>; // ✅ OK
type Test2 = Expect<Equal<1, 2>>; // ❌ Error (expected)
```

### 3. Debug type errors con `@ts-expect-error`

```typescript
// Documenta por qué esperas un error
// @ts-expect-error - userId debe ser string, no number
const user = createUser(123);

// Si el código se arregla, este comentario generará un error
// "Unused @ts-expect-error directive"
```

## Casos reales de producción

### API Response Types

```typescript
type APIError = {
  message: string;
  code: string;
  details?: Record<string, string[]>;
};

type APIResult<T> =
  | { success: true; data: T }
  | { success: false; error: APIError };

async function fetchUser(id: string): Promise<APIResult<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Failed to fetch user',
        code: 'FETCH_ERROR',
      },
    };
  }
}

// Uso type-safe
const result = await fetchUser('123');
if (result.success) {
  console.log(result.data.name); // ✅ Type-safe
} else {
  console.error(result.error.message); // ✅ Type-safe
}
```

### Form Validation

```typescript
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof SignupSchema>;
// { email: string; password: string; confirmPassword: string }

function handleSignup(data: SignupForm) {
  const result = SignupSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error.flatten());
    return;
  }
  // result.data es type-safe
}
```

## Conclusión: TypeScript en 2025

Después de 5 años usando TypeScript en producción:

- **Bugs en runtime:** Reducidos en 85%
- **Tiempo de refactoring:** 60% más rápido (gracias a type safety)
- **Onboarding de desarrolladores:** 40% más rápido (código autodocumentado)
- **Confianza en deploys:** De 60% a 95%

TypeScript no es overhead, es inversión. Cada hora configurando types correctamente ahorra 10 horas de debugging futuro.
