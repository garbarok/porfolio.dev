# BotID Integration Guide

This project uses Vercel's BotID to protect API endpoints from bot traffic.

## What is BotID?

BotID is Vercel's bot protection service that helps distinguish between legitimate users and automated bots by running JavaScript challenges and analyzing request patterns.

## How It Works

1. **Client-side**: The BotID script runs on page load and attaches special headers to protected API requests
2. **Server-side**: The `checkBotId()` function verifies these headers and classifies the request
3. **Vercel Proxy**: The `vercel.json` configuration routes BotID traffic through Vercel's API

## Files Overview

### `vercel.json`
Contains rewrites and headers for BotID proxy endpoints. These routes handle the communication with Vercel's bot protection service.

### `src/scripts/botid.ts`
Client-side initialization that:
- Imports and initializes BotID
- Defines which API endpoints to protect
- Runs automatically on page load

### `src/pages/api/example.ts`
Example API endpoint showing how to implement server-side bot checking.

## Adding Protection to a New API Endpoint

### Step 1: Add Client-Side Protection

Edit `src/scripts/botid.ts` and add your endpoint:

```typescript
initBotId({
  protect: [
    {
      path: '/api/your-new-endpoint',
      method: 'POST', // or 'GET', 'PUT', etc.
    },
  ],
})
```

### Step 2: Add Server-Side Check

In your API route file (e.g., `src/pages/api/your-new-endpoint.ts`):

```typescript
import type { APIRoute } from 'astro'
import { checkBotId } from 'botid/server'

export const POST: APIRoute = async ({ request }) => {
  // Check if the request is from a bot
  const verification = await checkBotId()

  if (verification.isBot) {
    return new Response(
      JSON.stringify({ error: 'Access denied' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // Your business logic here
  const body = await request.json()

  // Process request...

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
```

## Important Notes

⚠️ **Both steps are required!** If you only add server-side checking without client-side protection, `checkBotId()` will fail because the special headers won't be attached.

### Local Development

In local development, `checkBotId()` always returns `isBot: false` by default. To test bot protection behavior locally, you can configure `developmentOptions`:

```typescript
const verification = await checkBotId({
  developmentOptions: {
    isBot: true // Force bot detection in development
  }
})
```

### Testing

**Don't test with curl or direct browser navigation** - BotID requires JavaScript to run. Instead:

1. Start your dev server: `npm run dev`
2. Open your application in a browser
3. Use the browser's Console to make a fetch request:

```javascript
fetch('/api/example', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ test: 'data' })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Production Behavior

In production on Vercel:
- BotID actively runs JavaScript challenges
- Suspicious requests are blocked
- Legitimate users pass through seamlessly
- Direct API calls without JavaScript will be blocked

## Troubleshooting

### "Access denied" errors for legitimate users

1. Verify the endpoint is listed in `src/scripts/botid.ts`
2. Check that the path and method match exactly
3. Ensure requests come from the same domain (not CORS requests)

### `checkBotId()` failing

1. Confirm client-side protection is configured in `botid.ts`
2. Verify `vercel.json` is properly deployed
3. Check that the BotID script is loaded in the page (inspect Network tab)

## Further Reading

- [Vercel BotID Documentation](https://vercel.com/docs/security/bot-protection)
- [BotID npm package](https://www.npmjs.com/package/botid)
