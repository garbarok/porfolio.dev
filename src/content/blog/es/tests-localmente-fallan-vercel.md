---
title: "¿Tests Pasan Localmente pero Fallan en Vercel? Aquí el Por Qué"
description: "Entendiendo por qué tus tests de Next.js funcionan perfectamente en tu máquina pero fallan misteriosamente en el entorno CI de Vercel - y cómo solucionarlo."
pubDate: 2025-11-20
author: "Óscar Gallego"
tags: ["nextjs", "vercel", "testing", "ci-cd", "vitest", "react"]
draft: false
relatedSlug: "tests-pass-locally-fail-vercel"
image:
  url: "/projects/snapcompress.webp"
  alt: "Tests fallando en el entorno CI de Vercel"
---

## El Problema

```bash
# Local
$ pnpm test
✓ Todos los tests pasan (181 pasados)

# Vercel
❌ Build fallido
Error: actImplementation is not a function
```

Mismo código. Mismas dependencias. Resultados diferentes.

**Stack**: Next.js 16, React 19, Vitest, Vercel
**Tiempo perdido**: 4 horas persiguiendo el problema equivocado
**Causa raíz**: Malentendido del entorno CI de Vercel

---

## Lo Que Pensé Que Era

"¡Problema de compatibilidad de React 19 con Testing Library!"

Así que creé:
- ❌ Script de parcheo de 125 líneas para internals de React
- ❌ Plugin de Vite personalizado para resolución de módulos
- ❌ Archivos mock y redirecciones de imports

Todo falló en Vercel. Todo innecesario.

---

## El Problema Real

### Tu Máquina ≠ CI de Vercel

**Desarrollo Local:**
- SSD rápido, I/O directo
- CPU/memoria dedicada
- React se carga en modo desarrollo
- Entorno consistente

**CI de Vercel:**
- Almacenamiento en red (I/O más lento)
- Recursos de contenedor compartidos
- Puede usar modo producción por defecto
- Arranques en frío en cada build

**Resultado:** Las operaciones tardan 5-10x más en Vercel.

---

## Los Problemas Reales

### Problema 1: Modo de Entorno

Vercel no estaba cargando React en modo test por defecto.

**La Solución:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',

    // ← Fuerza el modo test de React
    env: {
      NODE_ENV: 'test',
    },
  },
})
```

**Por qué importa:**
- El build de desarrollo de React incluye utilidades de test
- El build de producción las elimina
- Sin `NODE_ENV: 'test'`, React se carga incorrectamente en Vercel

### Problema 2: Restricciones de Recursos

Los contenedores CI son más lentos. Operaciones que parecen instantáneas localmente hacen timeout en Vercel.

**La Solución:**

```typescript
// Configuración de timeout consciente del CI
const TIMEOUT = process.env.CI ? 10000 : 5000

it('test intensivo en recursos', async () => {
  // código del test
}, TIMEOUT)
```

**Ejemplo del mundo real:**

```typescript
// Creando un archivo de test de 100MB
const largeFile = createMockImageFile(
  'large.jpg',
  100 * 1024 * 1024,
  'image/jpeg'
)

// Local: ~500ms
// Vercel CI: ~6-7 segundos (!)
```

---

## Configuración Mínima Funcional

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

    // Crítico para CI de Vercel
    env: {
      NODE_ENV: 'test',
    },

    // Timeout global con conciencia de CI
    testTimeout: process.env.CI ? 10000 : 5000,
  },
})
```

### Timeouts de Test Conscientes del Entorno

```typescript
// test-config.ts
export const TEST_TIMEOUTS = {
  FAST: process.env.CI ? 5000 : 2000,
  MEDIUM: process.env.CI ? 10000 : 5000,
  SLOW: process.env.CI ? 30000 : 15000,
}

// En tus tests
import { TEST_TIMEOUTS } from './test-config'

describe('Feature', () => {
  it('operación rápida', async () => {
    // Test unitario rápido
  }, TEST_TIMEOUTS.FAST)

  it('operación de I/O de archivos', async () => {
    // Procesamiento de archivos, datos pequeños
  }, TEST_TIMEOUTS.MEDIUM)

  it('operación compleja', async () => {
    // Archivos grandes, red, procesamiento pesado
  }, TEST_TIMEOUTS.SLOW)
})
```

---

## Checklist de Diagnóstico Rápido

Cuando los tests fallan en Vercel pero pasan localmente:

1. ✅ **Verifica si `NODE_ENV: 'test'` está configurado** en vitest.config
2. ✅ **Revisa los logs de build de Vercel** para tests lentos
3. ✅ **Añade timeouts explícitos** a tests intensivos en recursos
4. ✅ **Usa configuración consciente del entorno**
5. ✅ **Mockea operaciones costosas** (I/O de archivos, datos grandes)
6. ❌ **No asumas que es compatibilidad de librerías**

### Patrones Comunes

```typescript
// ❌ Asume entorno local
it('test', async () => {
  await heavyOperation()
})

// ✅ Considera diferencias de CI
it('test', async () => {
  await heavyOperation()
}, process.env.CI ? 15000 : 5000)
```

```typescript
// ❌ Creando archivos reales de 100MB
const largeFile = createRealFile(100 * 1024 * 1024)

// ✅ Usa mocks ligeros
const largeFile = createMockFile({ size: 100 * 1024 * 1024 })
```

---

## Lecciones Clave

### 1. CI de Vercel ≠ Tu MacBook

Diseña tests con CI en mente desde el principio:
- Builds containerizados
- Recursos compartidos
- I/O más lento
- Defaults diferentes

### 2. Configura Explícitamente

No confíes en el comportamiento por defecto. Configura:
- `NODE_ENV` explícitamente
- Timeouts para operaciones lentas
- Configuraciones conscientes del entorno

### 3. Los Mensajes de Error Pueden Engañar

`actImplementation is not a function` no era sobre compatibilidad de React - era sobre React cargándose en el modo incorrecto debido a mala configuración del entorno.

### 4. Diseña para CI Desde el Inicio

Escribe tests sabiendo que se ejecutarán en infraestructura más lenta. Considera:
- Arranques en frío de contenedores
- Almacenamiento en red
- Throttling de recursos
- CPU/memoria compartida

---

## Entendiendo el Entorno de Build de Vercel

### Qué lo Hace Diferente

**Builds Containerizados:**
- Cada build se ejecuta en un contenedor aislado
- Los contenedores comparten recursos de infraestructura
- El I/O es en red, no local

**Arranques en Frío:**
- Los contenedores se inician frescos en cada build
- Sin caché de filesystem caliente
- Dependencias descargadas cada vez

**Límites de Recursos:**
- Throttling de CPU/memoria
- Infraestructura compartida
- Características de rendimiento diferentes

**Variables de Entorno:**
- Defaults diferentes a tu `.env` local
- `NODE_ENV` puede no ser lo que esperas
- Necesita configuración explícita

---

## Conclusión

El CI de Vercel es:
- **Más lento** que tu máquina local (5-10x)
- **Diferente** en cómo ejecuta Node.js
- **Necesita configuración explícita** para funcionar correctamente

**Configúralo. No luches contra él.**

El mensaje de error apuntaba a React.
El problema era el entorno de Vercel.
La solución era entender la diferencia.

---

## Recursos Relacionados

- [Configuración de Entorno de Vitest](https://vitest.dev/config/#environment)
- [Configuración de Build de Vercel](https://vercel.com/docs/build-step)
- [Mejores Prácticas de Testing en Next.js](https://nextjs.org/docs/testing)

---

*¿Has tenido problemas con CI de Vercel? ¡Comparte tu experiencia en los comentarios!*
