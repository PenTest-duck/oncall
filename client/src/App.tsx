import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { client } from './lib/api'

function App() {
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [echoMessage, setEchoMessage] = useState('')
  const [calcA, setCalcA] = useState('5')
  const [calcB, setCalcB] = useState('3')
  const [calcOp, setCalcOp] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add')

  // Example 1: Simple GET request
  // RPC client provides type-safe access: client.hello.$get()
  const handleHello = async () => {
    setLoading(true)
    try {
      const res = await client.hello.$get()
      const data = await res.json()
      // data is typed: { message: string, timestamp: string }
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Example 2: GET with validated query parameters
  // Zod validation ensures 'name' is required and typed as string
  const handleGreet = async () => {
    if (!name) {
      setResponse('Error: Name is required (validated by Zod)')
      return
    }
    setLoading(true)
    try {
      const res = await client.greet.$get({
        query: { name }, // TypeScript enforces this matches the Zod schema
      })
      const data = await res.json()
      // data is typed: { greeting: string }
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Example 3: POST with validated JSON body
  // Zod validates the request body on the server
  const handleEcho = async () => {
    if (!echoMessage) {
      setResponse('Error: Message is required (validated by Zod)')
      return
    }
    setLoading(true)
    try {
      const res = await client.echo.$post({
        json: { message: echoMessage }, // TypeScript enforces this matches the Zod schema
      })
      const data = await res.json()
      // data is typed: { received: string, echoed: boolean, timestamp: string }
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Example 4: POST calculation with full Zod validation
  // Zod validates: a (number), b (number), operation (enum)
  const handleCalculate = async () => {
    setLoading(true)
    try {
      const a = parseFloat(calcA)
      const b = parseFloat(calcB)

      if (isNaN(a) || isNaN(b)) {
        setResponse('Error: Please enter valid numbers')
        setLoading(false)
        return
      }

      const res = await client.calculate.$post({
        json: { a, b, operation: calcOp }, // Fully typed request body
      })
      const data = await res.json()
      // data is typed: { a: number, b: number, operation: string, result: number }
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hono RPC Demo</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>
        Type-safe API calls with Hono + Zod validation
      </p>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
        {/* Example 1: Simple GET */}
        <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
          <h3>1. Simple GET Request</h3>
          <code style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
            client.hello.$get()
          </code>
          <button onClick={handleHello} disabled={loading}>
            {loading ? 'Loading...' : 'Call /hello'}
          </button>
        </section>

        {/* Example 2: GET with Zod-validated query params */}
        <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
          <h3>2. GET with Zod-Validated Query</h3>
          <code style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
            {'client.greet.$get({ query: { name } })'}
          </code>
          <input
            type="text"
            placeholder="Enter your name (required)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
          />
          <button onClick={handleGreet} disabled={loading}>
            {loading ? 'Loading...' : 'Call /greet'}
          </button>
        </section>

        {/* Example 3: POST with Zod-validated JSON */}
        <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
          <h3>3. POST with Zod-Validated JSON Body</h3>
          <code style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
            {'client.echo.$post({ json: { message } })'}
          </code>
          <input
            type="text"
            placeholder="Enter message (required)"
            value={echoMessage}
            onChange={(e) => setEchoMessage(e.target.value)}
            style={{ marginRight: '10px', padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #555' }}
          />
          <button onClick={handleEcho} disabled={loading}>
            {loading ? 'Loading...' : 'Call /echo'}
          </button>
        </section>

        {/* Example 4: POST calculation */}
        <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #444', borderRadius: '8px' }}>
          <h3>4. POST with Complex Zod Schema</h3>
          <code style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
            {'client.calculate.$post({ json: { a, b, operation } })'}
          </code>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="number"
              placeholder="A"
              value={calcA}
              onChange={(e) => setCalcA(e.target.value)}
              style={{ marginRight: '10px', padding: '8px', width: '80px', borderRadius: '4px', border: '1px solid #555' }}
            />
            <select
              value={calcOp}
              onChange={(e) => setCalcOp(e.target.value as typeof calcOp)}
              style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
            >
              <option value="add">+</option>
              <option value="subtract">-</option>
              <option value="multiply">×</option>
              <option value="divide">÷</option>
            </select>
            <input
              type="number"
              placeholder="B"
              value={calcB}
              onChange={(e) => setCalcB(e.target.value)}
              style={{ marginRight: '10px', padding: '8px', width: '80px', borderRadius: '4px', border: '1px solid #555' }}
            />
            <button onClick={handleCalculate} disabled={loading}>
              {loading ? 'Loading...' : 'Calculate'}
            </button>
          </div>
        </section>

        {/* Response display */}
        {response && (
          <section style={{ marginTop: '20px', padding: '15px', border: '1px solid #4CAF50', borderRadius: '8px' }}>
            <h3>Response (typed!):</h3>
            <pre
              style={{
                backgroundColor: '#1a1a1a',
                padding: '15px',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px',
                color: '#4CAF50',
              }}
            >
              {response}
            </pre>
          </section>
        )}
      </div>
    </>
  )
}

export default App
