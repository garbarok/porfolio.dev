import { initBotId } from 'botid/client/core'

export function init() {
  initBotId({
    protect: [
      // Example protected endpoint
      {
        path: '/api/example',
        method: 'POST',
      },
      // Add more API endpoints you want to protect here
      // {
      //   path: '/api/contact',
      //   method: 'POST',
      // },
    ],
  })
}

// Initialize on page load
init()
