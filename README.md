# Project Name

> Brief description of what this project does

## Overview

[Add a more detailed description of your project here. What problem does it solve? What are its main features?]

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Hono RPC** - Type-safe API client

### Backend
- **Hono** - Web framework
- **Bun** - Runtime and package manager
- **Zod** - Schema validation
- **TypeScript** - Type safety

## Prerequisites

- [Bun](https://bun.sh) (latest version)
- Node.js 18+ (if not using Bun for client)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
bun install

# Install client dependencies
cd ../client
bun install
```

### Development

1. Start the development server (from `server/` directory):
```bash
cd server
bun run dev
```
The server will run on `http://localhost:3000`

2. Start the client dev server (from `client/` directory):
```bash
cd client
bun run dev
```
The client will run on `http://localhost:5173` (or another port if 5173 is taken)

3. Open your browser and navigate to the client URL

## Project Structure

```
.
├── client/          # Frontend React application
│   ├── src/
│   │   ├── lib/     # API client and utilities
│   │   └── ...
│   └── ...
├── server/          # Backend Hono API
│   ├── src/
│   │   └── index.ts # Main server file
│   └── ...
└── README.md
```

## API Endpoints

[Document your API endpoints here]

Example:
- `GET /hello` - Simple greeting endpoint
- `GET /greet?name={name}` - Greet with name
- `POST /echo` - Echo a message
- `POST /calculate` - Perform calculations

## Type-Safe API Calls

This project uses Hono RPC for end-to-end type safety. The API client is automatically typed based on your server routes:

```typescript
// Example usage
const res = await client.hello.$get()
const data = await res.json() // Fully typed!
```

## Building for Production

### Build Client
```bash
cd client
bun run build
```

### Build Server
[Add server build instructions if applicable]

## Environment Variables

[Document any environment variables needed]

Example:
```bash
# .env
PORT=3000
API_KEY=your-api-key
```

## Scripts

### Server
- `bun run dev` - Start development server with hot reload

### Client
- `bun run dev` - Start Vite dev server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint