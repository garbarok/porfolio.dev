---
title: "Prompt Engineering: Better AI Answers with One-Shot Prompts"
description: "Struggling with vague AI answers? Learn how one-shot prompting and smart context placement can force models to give you better, more accurate results. Get started now! ★"
pubDate: "Nov 21 2025"
relatedSlug: "ai-prompt-engineering-tips"
tags: ["ai", "prompt-engineering", "best-practices"]
---

Getting the most out of Large Language Models (LLMs) is an art and a science. While they are incredibly powerful, the quality of the output is directly tied to the quality of the input. Two simple but powerful techniques you can use to improve your results are **One-Shot Prompting** and strategic **Context Placement**.

This article will guide you on how to use these methods to get more reliable and accurate responses from AI.

## One-Shot Prompting: The Power of an Example

One of the most effective prompting techniques is called **one-shot prompting**, which simply means providing a single, high-quality example in your prompt. This leverages the model's ability to generalize from minimal data.

Think of it like pair programming with a coworker. You might say, "Look at this prior example to see how we've done this, and now create this new thing based on that."

One-shot prompting is efficient because you aren't trying to account for every edge case. It's more reliable than a zero-shot (no example) prompt because it gives the model a clear pattern to follow. This is especially useful for simple patterns or straightforward transformations.

### How to Use One-Shot Prompting

-   **Choose your example carefully:** It sets the pattern for the model.
-   **Pick a representative example:** Don't use an edge case.
-   **Include all elements you want in the output.**
-   **Combine with explicit instructions** for any additional clarity.
-   **Don't overcomplicate it:** The model will generalize the pattern.

### Example: Code Refactoring

Here’s a one-shot prompt to refactor a piece of JavaScript code from promise-based syntax to async/await.

**Prompt:**

> You are an expert JavaScript developer. Refactor the following function to use `async/await` syntax while keeping the logic identical.
>
> **Example:**
> **Original Code:**
> ```javascript
> function fetchData(url) {
>   return fetch(url)
>     .then(response => {
>       if (!response.ok) {
>         throw new Error('Network response was not ok');
>       }
>       return response.json();
>     })
>     .then(data => {
>       console.log('Data received:', data);
>       return data;
>     })
>     .catch(error => {
>       console.error('Fetch error:', error);
>       throw error;
>     });
> }
> ```
> **Refactored Code:**
> ```javascript
> async function fetchData(url) {
>   try {
>     const response = await fetch(url);
>     if (!response.ok) {
>       throw new Error('Network response was not ok');
>     }
>     const data = await response.json();
>     console.log('Data received:', data);
>     return data;
>   } catch (error) {
>     console.error('Fetch error:', error);
>     throw error;
>   }
> }
> ```
>
> Now, refactor this function:
>
> **Function to Refactor:**
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

## Practical Application: Data Extraction

One-shot prompting is incredibly powerful for structured data extraction. By showing the model an example of the input text and the desired JSON output, you can train it to perform complex information extraction tasks.

Here is an example of a one-shot prompt to extract structured data from a block of text:

**Prompt:**

> You are a data extraction specialist. Your task is to extract specific information from a user's message and format it as a JSON object.
>
> **EXAMPLE:**
> **Text:** "Hi, I'd like to book a flight for two adults from New York (JFK) to Los Angeles (LAX) on December 25th, 2025. I'd prefer a morning flight on Delta."
>
> **JSON Output:**
> ```json
> {
>   "intent": "book_flight",
>   "passengers": {
>     "adults": 2,
>     "children": 0
>   },
>   "origin": {
>     "city": "New York",
>     "airport_code": "JFK"
>   },
>   "destination": {
>     "city": "Los Angeles",
>     "airport_code": "LAX"
>   },
>   "date": "2025-12-25",
>   "preferences": {
>     "time_of_day": "morning",
>     "airline": "Delta"
>   }
> }
> ```
>
> ---
>
> **YOUR TASK:** Extract the relevant information from the following text and format it as a JSON object, following the example's structure.
>
> **Text to Process:** "Hey, can you find me a hotel in downtown Austin for 3 nights, checking in on March 10th, 2026? I need a room with a king-size bed and free Wi-Fi."

## Context Placement: Don't Get Lost in the Middle

As context windows for LLMs get larger, we need to be mindful of how we structure that context. A fascinating study, ["Lost in the Middle: How Language Models Use Long Contexts"](https://arxiv.org/abs/2307.03172), found that models perform best when the most critical information is placed at the **beginning** or **end** of the context window.

The study revealed that when important information was buried in the middle of a long context, the model's performance dropped significantly. In some cases, it performed worse than if it had no context at all. This means that crucial details can literally get "lost" in a sea of information.

### Key Takeaways for Context Placement:

-   **Start Fresh:** When possible, start a new chat to keep the context focused.
-   **Front-load Critical Info:** Place the most important instructions, data, or questions at the very beginning of your prompt.
-   **Append, Don't In-mix:** If new, important information comes up, add it to the end of the prompt rather than inserting it into the middle.
-   **The Middle is for the Meh:** Less important, supplementary information should occupy the middle of your context.

By being strategic with where you place information, you can ensure the model pays attention to what matters most.

## Conclusion

To improve your interactions with AI, remember these two key strategies:

1.  **Use One-Shot Prompts:** Provide a clear example to guide the model to your desired output format and style.
2.  **Master Context Placement:** Place your most critical information at the beginning or end of your prompt to ensure it doesn't get lost.

By incorporating these simple techniques, you'll be able to generate more accurate, relevant, and useful responses from any LLM.
