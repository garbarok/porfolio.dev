---
title: "TypeScript: Mejores prácticas para proyectos profesionales"
description: "Guía completa de mejores prácticas de TypeScript para escribir código más seguro y mantenible."
pubDate: 2025-10-25
author: "Óscar Gallego"
tags: ["typescript", "javascript", "best practices"]
draft: false
relatedSlug: "typescript-best-practices"
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/typescript-best-practices.png"
  alt: "Escudo de seguridad de tipos de TypeScript protegiendo el código de bugs"
---

Hace 2 años, heredé un proyecto con 80,000 líneas de JavaScript puro, lo que resultó en **47 bugs en producción en 3 meses**. Después de migrar a TypeScript con una configuración estricta, ese número se redujo a solo **3 bugs en 6 meses**.

TypeScript no es solo "JavaScript con tipos". Es un potente sistema de prevención de errores que ofrece valor desde el primer día.

## El Poder de un `tsconfig.json` Estricto

La mayoría de los desarrolladores no activan todos los flags estrictos, lo cual es un error costoso. Un `tsconfig.json` bien configurado es tu primera línea de defensa.

### Flags de Estrictez Fundamentales

Estas son las configuraciones fundamentales para un setup robusto.

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

### Prevención de Errores Mejorada

Ve más allá de lo básico para atrapar más problemas potenciales en tiempo de compilación.

```json
{
  "compilerOptions": {
    // ... flags fundamentales
    "noUncheckedIndexedAccess": true,    // 🔥 Crítico
    "noImplicitOverride": true,           // Evita bugs en herencia
    "noImplicitReturns": true,            // Fuerza returns explícitos
    "noFallthroughCasesInSwitch": true,   // Atrapa bugs en switch
    "noUnusedLocals": true,               // Limpia código muerto
    "noUnusedParameters": true,           // Detecta parámetros no usados
    "exactOptionalPropertyTypes": true,   // Diferencia undefined de ausente
    "noPropertyAccessFromIndexSignature": true // Fuerza notación de corchetes
  }
}
```

### Configuración para Proyectos Modernos

Asegura la compatibilidad con herramientas modernas como Vite, Astro y Next.js.

```json
{
  "compilerOptions": {
    // ... otros flags
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

### El Flag que Cambia el Juego: `noUncheckedIndexedAccess`

Sin este flag, se asume que acceder a un índice de un array siempre es seguro, lo cual es una fuente común de errores en tiempo de ejecución.

> Con `noUncheckedIndexedAccess: false` (el valor por defecto), `users[10]` tiene el tipo `string`, lo cual es una mentira.
> Con `noUncheckedIndexedAccess: true`, `users[10]` tiene el tipo `string | undefined`, lo cual es la verdad.

Este simple flag me obligó a añadir verificaciones adecuadas y descubrió **23 bugs potenciales** en un proyecto existente.

## `type` vs. `interface`: La Guía Definitiva

Este es un punto común de confusión. Aquí tienes una guía clara sobre cuándo usar cada uno.

### Cuándo Usar `type`

Usa `type` para definir primitivos, uniones y formas complejas.

- **Uniones y Primitivos:**
  ```typescript
  type Status = 'idle' | 'loading' | 'success' | 'error';
  type ID = string | number;
  ```
- **Tipos de Función:**
  ```typescript
  type ClickHandler = (event: MouseEvent) => void;
  ```
- **Formas Complejas (Intersecciones, Mapped Types):**
  ```typescript
  type APIResponse<T> = { data: T; status: number; } & { success: boolean; };
  type ReadOnly<T> = { readonly [K in keyof T]: T[K]; };
  ```

### Cuándo Usar `interface`

Usa `interface` para definir estructuras de objetos que están destinadas a ser extendidas.

- **APIs de Librerías Públicas:** El "declaration merging" permite a los usuarios extender tus interfaces.
  ```typescript
  // Código de tu librería
  export interface PluginConfig {
    name: string;
  }
  // Código del usuario
  declare module 'my-lib' {
    interface PluginConfig {
      customOption?: boolean;
    }
  }
  ```
- **Programación Orientada a Objetos:** Cuando se usan clases y herencia.
  ```typescript
  interface Animal {
    makeSound(): void;
  }
  class Dog implements Animal {
    makeSound() { console.log('Guau!'); }
  }
  ```

## Utility Types Avanzados que Debes Dominar

### `Awaited<T>`

Desenvuelve el tipo de una `Promise`. Esencial para inferir el tipo de retorno de funciones asíncronas.

```typescript
async function fetchUser() {
  return { id: '1', name: 'Alice' };
}
type User = Awaited<ReturnType<typeof fetchUser>>;
// User es { id: string; name: string }
```

### `Parameters<T>` y `ReturnType<T>`

Extrae los tipos de los parámetros y del retorno de una función, perfecto para crear wrappers o decoradores.

```typescript
function createUser(name: string, age: number) { /* ... */ }
type CreateUserParams = Parameters<typeof createUser>; // [string, number]
```

### `Extract<T, U>` y `Exclude<T, U>`

Filtra tipos de una unión basándose en una condición.

```typescript
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string };

// Extrae solo el evento de click
type MouseEvent = Extract<Event, { x: number }>;
```

## Técnicas Avanzadas de Type Narrowing

### Type Guards Definidos por el Usuario

Crea una función que devuelve un booleano para señalar un tipo a TypeScript.

```typescript
function isCat(animal: Animal): animal is Cat {
  return animal.type === 'cat';
}
```

### Uniones Discriminadas

Usa una propiedad común (como `status` o `type`) para crear una máquina de estados que TypeScript pueda seguir.

```typescript
type LoadingState =
  | { status: 'loading' }
  | { status: 'success'; data: string };

function handleState(state: LoadingState) {
  if (state.status === 'success') {
    console.log(state.data); // TS sabe que `data` existe
  }
}
```

### La Palabra Clave `asserts`

Crea una función que lanza un error si una condición de tipo no se cumple, afirmando el tipo para el resto del bloque de código.

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('No es un string');
  }
}
```

## Conclusión: TypeScript es una Inversión

Después de 5 años usando TypeScript en entornos de producción, los resultados son claros:
- **Bugs en runtime:** Reducidos en un 85%.
- **Tiempo de refactorización:** 60% más rápido gracias a la seguridad de tipos.
- **Onboarding de desarrolladores:** 40% más rápido porque el código se autodocumenta.

Cada hora invertida en configurar tipos correctamente ahorra diez horas de depuración futura.