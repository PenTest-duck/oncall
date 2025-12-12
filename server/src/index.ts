import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

const route = app
  // GET endpoint - simple greeting
  .get('/hello', (c) => {
    return c.json({
      message: 'Hello from Hono RPC!',
      timestamp: new Date().toISOString(),
    })
  })
  // GET endpoint with validated query parameters
  .get(
    '/greet',
    zValidator(
      'query',
      z.object({
        name: z.string(),
      })
    ),
    (c) => {
      const { name } = c.req.valid('query')
      return c.json({
        greeting: `Hello, ${name}!`,
      })
    }
  )
  // POST endpoint with validated JSON body
  .post(
    '/echo',
    zValidator(
      'json',
      z.object({
        message: z.string(),
      })
    ),
    (c) => {
      const { message } = c.req.valid('json')
      return c.json({
        received: message,
        echoed: true,
        timestamp: new Date().toISOString(),
      })
    }
  )
  // POST endpoint for calculations with full validation
  .post(
    '/calculate',
    zValidator(
      'json',
      z.object({
        a: z.number(),
        b: z.number(),
        operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      })
    ),
    (c) => {
      const { a, b, operation } = c.req.valid('json')

      let result: number
      switch (operation) {
        case 'add':
          result = a + b
          break
        case 'subtract':
          result = a - b
          break
        case 'multiply':
          result = a * b
          break
        case 'divide':
          result = b !== 0 ? a / b : NaN
          break
      }

      return c.json({ a, b, operation, result })
    }
  )

// Export the type from the chained routes for RPC
export type AppType = typeof route

export default app