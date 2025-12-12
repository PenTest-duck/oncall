Create an AI forward-deployed engineer platform where PMs can talk to users and we have an ElevenLabs agent (called Oscar) listen in to the conversation and builds UI mockups.

These mockups will be HTML. I will create the ElevenLabs agent (with tools for Linear tickets) on the ElevenLabs platform so don't worry about that.

I need you to create the backend infrastructure with an API endpoint that will be able to generate either a single, or 4 variants of single-HTML code that can be displayed in an iframe in the frontend.

The frontend app should just be a prototype demo that allows the user to click start meeting, then the elevenlabs voice agent starts listening, the user (PM) does the conversation with the client, maybe the client brings up a feature they want to see, it can edit a base HTML (i could just statically load this from like a /public folder) and then the voice agent issues tool calling to the backend.

The frontend looks like left hand side call transcript and tools history (you may want to use ElevenLabs UI shadcn for this). And then right hand side (2/3rds of the page, perhaps like a square) is the canvas where it will display the base HTML at the start, but as the agent generates either single or 4 variants it shows the single or quadrants as iframes.

We're gonna use ElevenLabs Agents SDK on the frontend to call the conversational voice agent straight up fromn the frontend.

Elevenlabs React SDK documentation: https://elevenlabs.io/docs/agents-platform/libraries/react
ElevenLabs UI documentation: https://ui.elevenlabs.io/docs/components

The existing skeleton tech stack is:
  - React
  - TailwindCSS + ShadCN (feel free to install new components with bunx --bun shadcn@latest add <component>)
  - Hono
  - Bun

Use minimalistic simple yet beautiful elegant web design (using shadcn and tailwind)!
Write modular clean code!
Anything you're unsure, ask me!
