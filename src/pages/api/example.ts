import type { APIRoute } from 'astro'
import { checkBotId } from 'botid/server'

export const POST: APIRoute = async ({ request }) => {
  // Verify the request is not from a bot
  const verification = await checkBotId()

  if (verification.isBot) {
    return new Response(
      JSON.stringify({ error: 'Access denied' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  // Your business logic here
  try {
    const body = await request.json()

    // Process the request...
    const result = {
      success: true,
      message: 'Request processed successfully',
      data: body
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
