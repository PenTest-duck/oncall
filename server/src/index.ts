import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { cors } from "hono/cors";
import { generateHtml, editHtml, vibeCode } from "./lib/gemini";

const app = new Hono();

// Enable CORS for frontend
app.use("/*", cors());

const route = app
  // GET endpoint - simple greeting
  .get("/hello", (c) => {
    return c.json({
      message: "Hello from Hono RPC!",
      timestamp: new Date().toISOString(),
    });
  })
  // GET endpoint with validated query parameters
  .get(
    "/greet",
    zValidator(
      "query",
      z.object({
        name: z.string(),
      })
    ),
    (c) => {
      const { name } = c.req.valid("query");
      return c.json({
        greeting: `Hello, ${name}!`,
      });
    }
  )
  // POST endpoint with validated JSON body
  .post(
    "/echo",
    zValidator(
      "json",
      z.object({
        message: z.string(),
      })
    ),
    (c) => {
      const { message } = c.req.valid("json");
      return c.json({
        received: message,
        echoed: true,
        timestamp: new Date().toISOString(),
      });
    }
  )
  // POST endpoint for calculations with full validation
  .post(
    "/calculate",
    zValidator(
      "json",
      z.object({
        a: z.number(),
        b: z.number(),
        operation: z.enum(["add", "subtract", "multiply", "divide"]),
      })
    ),
    (c) => {
      const { a, b, operation } = c.req.valid("json");

      let result: number;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          result = b !== 0 ? a / b : NaN;
          break;
      }

      return c.json({ a, b, operation, result });
    }
  )
  // POST endpoint to generate HTML mockup(s)
  .post(
    "/generate",
    zValidator(
      "json",
      z.object({
        prompt: z.string().min(1),
        baseHtml: z.string().optional(),
        variants: z.union([z.literal(1), z.literal(4)]).default(1),
      })
    ),
    async (c) => {
      const { prompt, baseHtml, variants } = c.req.valid("json");

      try {
        const html = await generateHtml(prompt, baseHtml, variants);
        return c.json({
          html,
          variants: html.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error generating HTML:", error);
        return c.json(
          {
            error: "Failed to generate HTML",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  // POST endpoint to edit existing HTML
  .post(
    "/edit",
    zValidator(
      "json",
      z.object({
        currentHtml: z.string().min(1),
        instruction: z.string().min(1),
      })
    ),
    async (c) => {
      const { currentHtml, instruction } = c.req.valid("json");

      try {
        const html = await editHtml(currentHtml, instruction);
        return c.json({
          html,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error editing HTML:", error);
        return c.json(
          {
            error: "Failed to edit HTML",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  // POST endpoint for vibe coding - generates complete HTML from a prompt
  .post(
    "/vibe-code",
    zValidator(
      "json",
      z.object({
        prompt: z.string().min(1),
        baseHtml: z.string().optional(),
        variants_count: z.union([z.literal(1), z.literal(4)]).default(1),
      })
    ),
    async (c) => {
      const { prompt, baseHtml, variants_count } = c.req.valid("json");

      try {
        const html = await vibeCode(prompt, baseHtml, variants_count);
        return c.json({
          html,
          variants: html.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error generating vibe code:", error);
        return c.json(
          {
            error: "Failed to generate vibe code",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  );

// Export the type from the chained routes for RPC
export type AppType = typeof route;

export default app;
