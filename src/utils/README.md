# Utilidades del Blog

Este directorio contiene funciones de utilidad reutilizables para el blog, inspiradas en [Astroplate](https://github.com/zeon-studio/astroplate).

## 📚 Funciones Disponibles

### `formatDate(date: Date): string`

Formatea una fecha al formato español.

```typescript
import { formatDate } from '@/utils/blog';

const date = new Date('2024-01-15');
formatDate(date); // "15 de enero de 2024"
```

### `calculateReadingTime(content: string, wordsPerMinute?: number): number`

Calcula el tiempo estimado de lectura basado en el conteo de palabras.

```typescript
import { calculateReadingTime } from '@/utils/blog';

const content = "Tu contenido aquí...";
calculateReadingTime(content); // 5 (minutos)
calculateReadingTime(content, 250); // 4 (minutos a 250 wpm)
```

### `slugify(text: string): string`

Convierte texto a un slug URL-friendly.

```typescript
import { slugify } from '@/utils/blog';

slugify("Por qué Astro 5 es Increíble!"); // "por-que-astro-5-es-increible"
slugify("React & Vue.js"); // "react-and-vue-js"
```

**Características:**
- Convierte a minúsculas
- Reemplaza espacios con guiones
- Convierte `&` a `and`
- Elimina caracteres especiales
- Elimina guiones duplicados

### `plainify(content: string): string`

Extrae texto plano de contenido HTML o Markdown.

```typescript
import { plainify } from '@/utils/blog';

const markdown = "# Título\n\nEste es **negrita** y *cursiva*.";
plainify(markdown); // "Título Este es negrita y cursiva."

const html = "<h1>Título</h1><p>Párrafo</p>";
plainify(html); // "Título Párrafo"
```

**Útil para:**
- Meta descriptions SEO
- Extractos de artículos
- Búsqueda de texto

### `humanize(str: string): string`

Convierte strings técnicos en texto legible.

```typescript
import { humanize } from '@/utils/blog';

humanize("hello_world"); // "Hello world"
humanize("  some-text  "); // "Some text"
humanize("api_endpoint"); // "Api endpoint"
```

### `titleify(str: string): string`

Convierte strings en títulos con capitalización correcta.

```typescript
import { titleify } from '@/utils/blog';

titleify("hello_world"); // "Hello World"
titleify("react-vs-vue"); // "React Vs Vue"
```

### `sortByDate<T>(array: T[]): T[]`

Ordena un array de posts por fecha de publicación (más reciente primero).

```typescript
import { sortByDate } from '@/utils/blog';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sortedPosts = sortByDate(posts);
// Posts ordenados: [más reciente, ..., más antiguo]
```

**Tipo genérico:**
```typescript
T extends { data: { pubDate: Date } }
```

## 🎯 Casos de Uso

### Crear URLs dinámicas para tags

```typescript
import { slugify } from '@/utils/blog';

const tags = ["JavaScript", "Type Script", "Node.js"];
tags.map(tag => `/blog/tags/${slugify(tag)}`);
// ["/blog/tags/javascript", "/blog/tags/type-script", "/blog/tags/node-js"]
```

### Meta description SEO

```typescript
import { plainify } from '@/utils/blog';

const post = await getEntry('blog', 'my-post');
const metaDescription = plainify(post.body).slice(0, 160);
```

### Lista de posts recientes

```typescript
import { sortByDate } from '@/utils/blog';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const recentPosts = sortByDate(allPosts).slice(0, 5);
```

### Títulos desde nombres de archivo

```typescript
import { titleify } from '@/utils/blog';

const filename = "my-awesome-post";
const title = titleify(filename); // "My Awesome Post"
```

## 🔗 Referencias

- Inspirado por [Astroplate](https://github.com/zeon-studio/astroplate/tree/main/src/lib/utils)
- Compatible con Astro 5 Content Collections
- TypeScript con tipos completos
