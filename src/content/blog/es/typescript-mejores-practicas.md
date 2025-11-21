---
title: "Buenas Prácticas en TypeScript: Reduce 90% los Bugs"
description: "Un `tsconfig.json` estricto y tipos avanzados redujeron nuestros bugs de 47 a 3. Aprende las buenas prácticas de TypeScript para un código más seguro. ★"
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

## ¿Cuáles son las Mejores Prácticas de TypeScript?

Para escribir código TypeScript robusto y seguro, es fundamental seguir un conjunto de buenas prácticas. Estas se centran en una configuración estricta y el uso avanzado del sistema de tipos para prevenir errores antes de que ocurran.

Las mejores prácticas clave de TypeScript son:
- **Activar el modo estricto:** Habilita todos los flags de `strict` en tu `tsconfig.json` para la máxima seguridad.
- **Usar `noUncheckedIndexedAccess`:** Evita errores de `undefined` al acceder a arrays y objetos.
- **Diferenciar `type` e `interface`:** Usa `type` para uniones y tipos complejos, e `interface` para objetos y APIs públicas que pueden ser extendidas.
- **Dominar los Utility Types:** Utiliza `Awaited`, `Parameters`, `ReturnType`, `Extract` y `Exclude` para manipular tipos de forma avanzada.
- **Aplicar Type Narrowing:** Usa type guards, uniones discriminadas y la palabra clave `asserts` para refinar los tipos y guiar al compilador.

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

## `type` vs. `interface`: ¿Cuál Deberías Usar?

La elección entre `type` e `interface` en TypeScript depende del caso de uso. La regla general es usar `interface` para definir la forma de objetos y para APIs públicas debido a su capacidad de ser extendida, y usar `type` para todo lo demás, como uniones, primitivos o tipos complejos.

Aquí tienes una comparación directa para ayudarte a decidir:

| Característica        | `interface`                                       | `type`                                                 |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| **Ideal para**        | Estructuras de objetos (OOP), APIs públicas       | Uniones, primitivos, tipos complejos, funciones        |
| **Extensión**         | Sí, con `extends` y *declaration merging*         | No directamente; se logra con intersecciones (`&`)     |
| **Declaration Merging** | ✅ Soportado (permite añadir nuevos campos)       | ❌ No soportado (genera un error de duplicado)         |
| **Uniones y Primitivos**| ❌ No se puede usar para `string \| number` o `string` | ✅ Soportado (`type ID = string \| number;`)            |
| **Tuplas**            | ✅ Soportado (con sintaxis de array)              | ✅ Soportado (`type Point = [number, number];`)         |
| **Mapped Types**      | ❌ No se puede usar                               | ✅ Soportado (`type Readonly<T> = ...`)                |

### En Resumen:

- **Usa `interface` cuando:**
  - Defines la "forma" de un objeto o una clase.
  - Quieres que los usuarios de tu API puedan extender la definición (ej. plugins).
- **Usa `type` cuando:**
  - Necesitas definir uniones, tuplas o tipos de función.
  - Necesitas crear tipos complejos usando Mapped Types o condicionales.

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