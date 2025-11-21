---
title: "Ingeniería de Prompts: Mejores Respuestas de IA con Ejemplos Únicos"
description: "¿Luchando con respuestas vagas de la IA? Aprende cómo los prompts con ejemplos únicos y la ubicación inteligente del contexto pueden forzar a los modelos a darte resultados mejores y más precisos. ¡Empieza ahora! ★"
pubDate: "Nov 21 2025"
relatedSlug: "consejos-ingenieria-prompts-ai"
tags: ["ia", "prompt-engineering", "buenas-practicas"]
---

Sacar el máximo provecho de los Grandes Modelos de Lenguaje (LLMs) es un arte y una ciencia. Si bien son increíblemente poderosos, la calidad de la salida está directamente ligada a la calidad de la entrada. Dos técnicas simples pero poderosas que puedes usar para mejorar tus resultados son los **Prompts con Ejemplo Único (One-Shot Prompting)** y la **Colocación Estratégica del Contexto (Context Placement)**.

Este artículo te guiará sobre cómo usar estos métodos para obtener respuestas más confiables y precisas de la IA.

## Prompts con Ejemplo Único: El Poder de un Ejemplo

Una de las técnicas de prompting más efectivas se llama **prompt con ejemplo único**, que simplemente significa proporcionar un único ejemplo de alta calidad en tu prompt. Esto aprovecha la capacidad del modelo para generalizar a partir de datos mínimos.

Piensa en ello como programar en pareja con un compañero de trabajo. Podrías decir: "Mira este ejemplo anterior para ver cómo hemos hecho esto, y ahora crea esta cosa nueva basándote en eso".

El prompt con ejemplo único es eficiente porque no intentas tener en cuenta todos los casos extremos. Es más confiable que un prompt sin ejemplo (zero-shot) porque le da al modelo un patrón claro a seguir. Esto es especialmente útil para patrones simples o transformaciones directas.

### Cómo Usar Prompts con Ejemplo Único

-   **Elige tu ejemplo cuidadosamente:** Establece el patrón para el modelo.
-   **Elige un ejemplo representativo:** No uses un caso extremo.
-   **Incluye todos los elementos que deseas en la salida.**
-   **Combina con instrucciones explícitas** para cualquier claridad adicional.
-   **No lo compliques demasiado:** El modelo generalizará el patrón.

### Ejemplo: Refactorización de Código

Aquí tienes un prompt con ejemplo único para refactorizar un fragmento de código JavaScript de la sintaxis basada en promesas a async/await.

**Prompt:**

> Eres un desarrollador experto en JavaScript. Refactoriza la siguiente función para usar la sintaxis `async/await` manteniendo la lógica idéntica.
>
> **Ejemplo:**
> **Código Original:**
> ```javascript
> function fetchData(url) {
>   return fetch(url)
>     .then(response => {
>       if (!response.ok) {
>         throw new Error('La respuesta de la red no fue correcta');
>       }
>       return response.json();
>     })
>     .then(data => {
>       console.log('Datos recibidos:', data);
>       return data;
>     })
>     .catch(error => {
>       console.error('Error en fetch:', error);
>       throw error;
>     });
> }
> ```
> **Código Refactorizado:**
> ```javascript
> async function fetchData(url) {
>   try {
>     const response = await fetch(url);
>     if (!response.ok) {
>       throw new Error('La respuesta de la red no fue correcta');
>     }
>     const data = await response.json();
>     console.log('Datos recibidos:', data);
>     return data;
>   } catch (error) {
>     console.error('Error en fetch:', error);
>     throw error;
>   }
> }
> ```
>
> Ahora, refactoriza esta función:
>
> **Función a Refactorizar:**
> ```javascript
> function getUser(id) {
>   return database.findUser(id)
>     .then(user => {
>       return getPermissions(user.role)
>         .then(permissions => {
>           user.permissions = permissions;
>           return user;
>         });
>     });
> }
> ```

## Aplicación Práctica: Extracción de Datos

Los prompts con ejemplo único son increíblemente potentes para la extracción de datos estructurados. Al mostrarle al modelo un ejemplo del texto de entrada y la salida JSON deseada, puedes entrenarlo para realizar tareas complejas de extracción de información.

Aquí tienes un ejemplo de un prompt con ejemplo único para extraer datos estructurados de un bloque de texto:

**Prompt:**

> Eres un especialista en extracción de datos. Tu tarea es extraer información específica del mensaje de un usuario y formatearla como un objeto JSON.
>
> **EJEMPLO:**
> **Texto:** "Hola, me gustaría reservar un vuelo para dos adultos desde Nueva York (JFK) a Los Ángeles (LAX) el 25 de diciembre de 2025. Preferiría un vuelo por la mañana con Delta."
>
> **Salida JSON:**
> ```json
> {
>   "intent": "reservar_vuelo",
>   "pasajeros": {
>     "adultos": 2,
>     "niños": 0
>   },
>   "origen": {
>     "ciudad": "Nueva York",
>     "codigo_aeropuerto": "JFK"
>   },
>   "destino": {
>     "ciudad": "Los Ángeles",
>     "codigo_aeropuerto": "LAX"
>   },
>   "fecha": "2025-12-25",
>   "preferencias": {
>     "hora_del_dia": "mañana",
>     "aerolinea": "Delta"
>   }
> }
> ```
>
> ---
>
> **TU TAREA:** Extrae la información relevante del siguiente texto y formatéala como un objeto JSON, siguiendo la estructura del ejemplo.
>
> **Texto a Procesar:** "Hola, ¿puedes encontrarme un hotel en el centro de Austin para 3 noches, con check-in el 10 de marzo de 2026? Necesito una habitación con una cama king-size y Wi-Fi gratis."

## Colocación del Contexto: No Te Pierdas en el Medio

A medida que las ventanas de contexto para los LLMs se hacen más grandes, necesitamos ser conscientes de cómo estructuramos ese contexto. Un estudio fascinante, ["Lost in the Middle: How Language Models Use Long Contexts"](https://arxiv.org/abs/2307.03172), encontró que los modelos funcionan mejor cuando la información más crítica se coloca al **principio** o al **final** de la ventana de contexto.

El estudio reveló que cuando la información importante estaba enterrada en medio de un contexto largo, el rendimiento del modelo disminuía significativamente. En algunos casos, funcionaba peor que si no tuviera ningún contexto. Esto significa que los detalles cruciales pueden literalmente "perderse" en un mar de información.

### Puntos Clave para la Colocación del Contexto:

-   **Empieza de Cero:** Cuando sea posible, inicia un nuevo chat para mantener el contexto enfocado.
-   **Prioriza la Información Crítica:** Coloca las instrucciones, datos o preguntas más importantes al principio de tu prompt.
-   **Añade, No Mezcles:** Si surge información nueva e importante, añádela al final del prompt en lugar de insertarla en el medio.
-   **El Medio es para lo Menos Importante:** La información menos importante y suplementaria debe ocupar el medio de tu contexto.

Al ser estratégico con la ubicación de la información, puedes asegurarte de que el modelo preste atención a lo que más importa.

## Conclusión

Para mejorar tus interacciones con la IA, recuerda estas dos estrategias clave:

1.  **Usa Prompts con Ejemplo Único:** Proporciona un ejemplo claro para guiar al modelo hacia el formato y estilo de salida deseados.
2.  **Domina la Colocación del Contexto:** Coloca tu información más crítica al principio o al final de tu prompt para asegurarte de que no se pierda.

Al incorporar estas técnicas simples, podrás generar respuestas más precisas, relevantes y útiles de cualquier LLM.
