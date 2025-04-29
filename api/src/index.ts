import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';

const app = new Hono()
const PORT = Number(process.env.PORT) || 3001;

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`🚀 API is running on http://localhost:${info.port}`)
})
