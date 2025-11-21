# Project Overview

This is a personal portfolio website built with [Astro](https://astro.build/) and styled with [Tailwind CSS](https://tailwindcss.com/). The project is structured to showcase professional experience, projects, and a blog. It includes internationalization (i18n) for English and Spanish.

## Building and Running

### Prerequisites

*   Node.js and npm (or a compatible package manager like pnpm or yarn)

### Key Commands

*   **Install dependencies:**
    ```bash
    pnpm install
    ```
*   **Run the development server:**
    ```bash
    pnpm run dev
    ```
*   **Build the project for production:**
    ```bash
    pnpm run build
    ```
*   **Preview the production build:**
    ```bash
    pnpm run preview
    ```
*   **Check for broken image links:**
    ```bash
    pnpm run check:images
    ```

## Development Conventions

*   **Framework:** The project uses the Astro framework. Components are written as `.astro` files.
*   **Styling:** Tailwind CSS is used for styling. Utility classes are preferred.
*   **Content:** The blog content is written in Markdown (`.md`) and is located in the `src/content/blog` directory.
*   **Internationalization:** The `src/i18n` directory contains the logic for translating the site. JSON files for each language are in `src/i18n/locales`.
*   **Linting and Formatting:** The project uses Prettier for code formatting.

---

## Guía para Escribir Artículos Optimizados para Featured Snippets

Para maximizar la visibilidad de futuros artículos del blog y aumentar la probabilidad de que aparezcan como "featured snippets" en Google, sigue estas directrices. La estrategia se centra en identificar preguntas clave y responderlas de forma directa y estructurada.

### 1. Identifica la Pregunta Principal Primero

Antes de escribir, define la pregunta principal que tu artículo va a responder. El título del artículo a menudo debería reflejar esta pregunta.

- **Mal Ejemplo:** "Notas sobre JavaScript"
- **Buen Ejemplo:** "¿Cuáles son los errores más comunes en JavaScript para principiantes?"

### 2. Coloca la Respuesta al Principio

Crea un bloque de respuesta directa (el "Snippet Package") y colócalo justo después de la introducción. Este bloque debe responder a la pregunta principal de forma concisa.

### 3. Formatea la Respuesta para Google

Usa formatos que Google pueda analizar fácilmente.

#### a. Para Preguntas de Definición ("¿Qué es...?")
- **Formato:** Párrafo.
- **Estructura:**
  - Escribe una respuesta directa de 40-60 palabras.
  - La primera frase debe ser una definición clara y completa.
  - **Ejemplo:**
    > **¿Qué es Astro?**
    > Astro es un framework web moderno para construir sitios rápidos y centrados en el contenido. Su característica principal es la arquitectura de "cero JavaScript por defecto", que prioriza el envío de HTML y reduce drásticamente los tiempos de carga.

#### b. Para Preguntas de Proceso o Listas ("¿Cómo...", "Cuáles son...")
- **Formato:** Lista numerada o con viñetas.
- **Estructura:**
  - Un párrafo introductorio que resume la solución.
  - Una lista de 5-8 pasos o puntos clave.
  - Cada punto debe ser claro, conciso y empezar con un verbo de acción si es un paso.
  - **Ejemplo:**
    > **¿Cómo optimizar imágenes para la web?**
    > Para optimizar imágenes, debes reducir su tamaño de archivo sin sacrificar demasiada calidad. Sigue estos pasos:
    > 1.  **Elige el formato correcto:** Usa JPEG para fotos y PNG para gráficos con transparencias.
    > 2.  **Comprime la imagen:** Utiliza herramientas como Squoosh o ImageOptim.
    > 3.  **Implementa lazy loading:** Carga las imágenes solo cuando se van a mostrar en la pantalla.

#### c. Para Preguntas de Comparación ("... vs. ...")
- **Formato:** Tabla (Markdown).
- **Estructura:**
  - Un párrafo introductorio con la conclusión principal.
  - Una tabla que compare las características clave.
  - **Ejemplo:**
    > **¿Cuándo usar `type` vs `interface`?**
    > La regla general es usar `interface` para objetos que pueden ser extendidos y `type` para todo lo demás.
    >
    > | Característica | `interface` | `type` |
    > | --- | --- | --- |
    > | Extensión | ✅ Soportado | ❌ No Soportado |
    > | Uniones | ❌ No Soportado | ✅ Soportado |

### 4. Usa Preguntas como Encabezados

Estructura tu artículo usando preguntas en los encabezados (`##` o `<h3>`). Esto ayuda a Google a entender la estructura de tu contenido y puede generar snippets adicionales.

- **Mal Ejemplo:** `## Configuración`
- **Buen Ejemplo:** `## ¿Cómo se configura el entorno de desarrollo?`

Siguiendo estas pautas, cada nuevo artículo tendrá una base sólida de SEO para competir por la posición cero en Google.
