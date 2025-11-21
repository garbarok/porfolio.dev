---
title: "¿Cómo Mejorar las Respuestas de IA con Prompts de Ejemplo Único y Colocación de Contexto?"
description: "¿Luchando con respuestas vagas de la IA? Aprende cómo los prompts con ejemplos únicos y la ubicación inteligente del contexto pueden forzar a los modelos a darte resultados mejores y más precisos. ¡Empieza ahora! ★"
pubDate: 2025-11-21
image:
  url: "https://res.cloudinary.com/dl0qx4iof/image/upload/blog/ai-prompt-engineering-tips.png"
  alt: "AI prompt engineering concept - illustration of a person interacting with a large language model"
relatedSlug: "ai-prompt-engineering-tips"
tags: ["ia", "prompt-engineering", "buenas-practicas"]
---

Sacar el máximo provecho de los Grandes Modelos de Lenguaje (LLMs) es un arte y una ciencia. Si bien son increíblemente poderosos, la calidad de la salida está directamente ligada a la calidad de la entrada. Dos técnicas simples pero poderosas que puedes usar para mejorar tus resultados son los **Prompts con Ejemplo Único (One-Shot Prompting)** y la **Colocación Estratégica del Contexto (Context Placement)**.

Este artículo te guiará sobre cómo usar estos métodos para obtener respuestas más confiables y precisas de la IA.

Para obtener mejores respuestas de IA, concéntrate en dos técnicas clave de ingeniería de prompts: los Prompts con Ejemplo Único y la Colocación Estratégica del Contexto. Los Prompts con Ejemplo Único implican proporcionar un ejemplo de alta calidad para guiar al modelo, mientras que la Colocación del Contexto asegura que la información crítica esté al principio o al final de tu prompt, evitando que se pierda en contextos más largos.


## ¿Qué son los Prompts con Ejemplo Único y Cómo Funcionan?

Una de las técnicas de prompting más efectivas se llama **prompt con ejemplo único**, que simplemente significa proporcionar un único ejemplo de alta calidad en tu prompt. Esto aprovecha la capacidad del modelo para generalizar a partir de datos mínimos.

Piensa en ello como programar en pareja con un compañero de trabajo. Podrías decir: "Mira este ejemplo anterior para ver cómo hemos hecho esto, y ahora crea esta cosa nueva basándote en eso".

El prompt con ejemplo único es eficiente porque no intentas tener en cuenta todos los casos extremos. Es más confiable que un prompt sin ejemplo (zero-shot) porque le da al modelo un patrón claro a seguir. Esto es especialmente útil para patrones simples o transformaciones directas.

La efectividad del prompting con ejemplo único radica en su capacidad para reducir significativamente la ambigüedad. Al presentar un par concreto de entrada-salida, no solo estás dando instrucciones; le estás mostrando al modelo *exactamente* lo que esperas. Esto es particularmente potente para tareas que requieren un formato, tono o una transformación de datos específicos, donde las instrucciones verbales por sí solas podrían estar abiertas a interpretación. Actúa como un ancla fuerte, guiando la generación del modelo hacia el resultado deseado y minimizando las posibilidades de respuestas irrelevantes o con formato incorrecto.

### Ejemplo: Análisis de Sentimiento

Supongamos que deseas clasificar las reseñas de clientes como positivas, negativas o neutrales. Un prompt con ejemplo único puede enseñar eficazmente al modelo esta tarea de clasificación.

**Prompt:**

> Eres un experto en análisis de sentimiento. Clasifica la siguiente reseña de cliente en una de tres categorías: "Positiva", "Negativa" o "Neutra".
>
> **Ejemplo:**
> **Reseña:** "El producto llegó rápidamente, pero el embalaje estaba dañado. El artículo en sí funciona perfectamente."
> **Sentimiento:** "Neutra"
>
> Ahora, clasifica el sentimiento de esta reseña:
>
> **Reseña a Clasificar:** "¡Esta actualización de software es terrible! Rompió la mitad de mis funciones y ahora es increíblemente lenta."


### Cómo Usar Prompts con Ejemplo Único

- **Elige tu ejemplo cuidadosamente:** Establece el patrón para el modelo.
- **Elige un ejemplo representativo:** No uses un caso extremo.
- **Incluye todos los elementos que deseas en la salida.**
- **Combina con instrucciones explícitas** para cualquier claridad adicional.
- **No lo compliques demasiado:** El modelo generalizará el patrón.

### Ejemplo: Refactorización de Código

Aquí tienes un prompt con ejemplo único para refactorizar un fragmento de código JavaScript de la sintaxis basada en promesas a async/await.

**Prompt:**

> Eres un desarrollador experto en JavaScript. Refactoriza la siguiente función para usar la sintaxis `async/await` manteniendo la lógica idéntica.
>
> **Ejemplo:**
> **Código Original:**
>
> ```javascript
> function fetchData(url) {
>   return fetch(url)
>     .then((response) => {
>       if (!response.ok) {
>         throw new Error("La respuesta de la red no fue correcta");
>       }
>       return response.json();
>     })
>     .then((data) => {
>       console.log("Datos recibidos:", data);
>       return data;
>     })
>     .catch((error) => {
>       console.error("Error en fetch:", error);
>       throw error;
>     });
> }
> ```
>
> **Código Refactorizado:**
>
> ```javascript
> async function fetchData(url) {
>   try {
>     const response = await fetch(url);
>     if (!response.ok) {
>       throw new Error("La respuesta de la red no fue correcta");
>     }
>     const data = await response.json();
>     console.log("Datos recibidos:", data);
>     return data;
>   } catch (error) {
>     console.error("Error en fetch:", error);
>     throw error;
>   }
> }
> ```
>
> Ahora, refactoriza esta función:
>
> **Función a Refactorizar:**
>
> ```javascript
> function getUser(id) {
>   return database.findUser(id).then((user) => {
>     return getPermissions(user.role).then((permissions) => {
>       user.permissions = permissions;
>       return user;
>     });
>   });
> }
> ```

## ¿Cómo se Aplican los Prompts con Ejemplo Único a la Extracción de Datos?

Los prompts con ejemplo único son increíblemente potentes para la extracción de datos estructurados. Al mostrarle al modelo un ejemplo del texto de entrada y la salida JSON deseada, puedes entrenarlo para realizar tareas complejas de extracción de información.

La ventaja de usar prompts con ejemplo único para la extracción de datos radica en la consistencia y la legibilidad por máquina de la salida. Cuando la IA devuelve datos de manera consistente en un formato estructurado como JSON, resulta trivial analizar esta información programáticamente. Esto permite una integración perfecta con bases de datos, herramientas de análisis u otros flujos de trabajo automatizados, transformando texto no estructurado en datos accionables con alta fiabilidad.

Aquí tienes un ejemplo de un prompt con ejemplo único para extraer datos estructurados de un bloque de texto:

**Prompt:**

> Eres un especialista en extracción de datos. Tu tarea es extraer información específica del mensaje de un usuario y formatearla como un objeto JSON.
>
> **EJEMPLO:**
> **Texto:** "Hola, me gustaría reservar un vuelo para dos adultos desde Nueva York (JFK) a Los Ángeles (LAX) el 25 de diciembre de 2025. Preferiría un vuelo por la mañana con Delta."
>
> **Salida JSON:**
>
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

## ¿Cómo Afecta la Colocación del Contexto a las Respuestas de la IA?

A medida que las ventanas de contexto para los LLMs se hacen más grandes, necesitamos ser conscientes de cómo estructuramos ese contexto. Un estudio fascinante, ["Lost in the Middle: How Language Models Use Long Contexts"](https://arxiv.org/abs/2307.03172), encontró que los modelos funcionan mejor cuando la información más crítica se coloca al **principio** o al **final** de la ventana de contexto.

El estudio reveló que cuando la información importante estaba enterrada en medio de un contexto largo, el rendimiento del modelo disminuía significativamente. En algunos casos, funcionaba peor que si no tuviera ningún contexto. Esto significa que los detalles cruciales pueden literalmente "perderse" en un mar de información. Este fenómeno es particularmente relevante a medida que las ventanas de contexto de los LLM continúan creciendo, lo que facilita la dilución inadvertida de instrucciones o datos críticos dentro de grandes cantidades de texto menos importante. Para los desarrolladores que construyen aplicaciones sobre LLMs, especialmente aquellas que involucran Generación Aumentada por Recuperación (RAG) donde se inyectan documentos externos en el prompt, comprender y mitigar el efecto de "perdido en el medio" es primordial para asegurar que la IA actúe consistentemente sobre la información más relevante.

### Ejemplo: Resumen con Restricciones Específicas

Considera una tarea en la que necesitas resumir un documento extenso, pero con una restricción muy específica: el resumen debe incluir una pieza particular de información (por ejemplo, un código de producto, una fecha clave o el nombre de una persona específica) que podría aparecer solo una vez en medio del texto.

**Colocación de Contexto Ineficaz:**

Si colocas la restricción ("Incluir el código de producto XYZ123 en el resumen") en medio de un documento muy largo, el modelo podría pasarla por alto, lo que resultaría en un resumen que omite este detalle crucial.

**Colocación de Contexto Eficaz:**

Para asegurar que la restricción sea respetada, colócala al principio o al final de tu prompt, claramente separada del documento principal.

**Prompt:**

> **RESTRICCIÓN IMPORTANTE:** Tu resumen DEBE incluir el código de producto "PROD-789".
>
> Resume el siguiente documento en 3-4 oraciones, centrándote en las características y beneficios clave.
>
> [Contenido del Documento Largo Aquí, donde "PROD-789" podría mencionarse una vez en el medio]
>
> Alternativamente, podrías colocar la restricción al final:
>
> Resume el siguiente documento en 3-4 oraciones, centrándote en las características y beneficios clave.
>
> [Contenido del Documento Largo Aquí]
>
> **RESTRICCIÓN IMPORTANTE:** Asegúrate de que el resumen mencione el código de producto "PROD-789".

### ¿Cuáles son los Puntos Clave para una Colocación Efectiva del Contexto?

- **Empieza de Cero:** Cuando sea posible, inicia un nuevo chat para mantener el contexto enfocado.
- **Prioriza la Información Crítica:** Coloca las instrucciones, datos o preguntas más importantes al principio de tu prompt.
- **Añade, No Mezcles:** Si surge información nueva e importante, añádela al final del prompt en lugar de insertarla en el medio.
- **El Medio es para lo Menos Importante:** La información menos importante y suplementaria debe ocupar el medio de tu contexto.

Al ser estratégico con la ubicación de la información, puedes asegurarte de que el modelo preste atención a lo que más importa.

## Conclusión

Para mejorar tus interacciones con la IA, recuerda estas dos estrategias clave:

1.  **Usa Prompts con Ejemplo Único:** Proporciona un ejemplo claro para guiar al modelo hacia el formato y estilo de salida deseados.
2.  **Domina la Colocación del Contexto:** Coloca tu información más crítica al principio o al final de tu prompt para asegurarte de que no se pierda.

Al incorporar estas técnicas simples, podrás generar respuestas más precisas, relevantes y útiles de cualquier LLM.
