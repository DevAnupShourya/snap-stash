import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';
import 'dotenv/config';

import { ENV } from '@/utils/env.js'
import taskServer from '@/controllers/task.controller.js';
import categoryServer from '@/controllers/category.controller.js';
import { authServer, requireAuth } from '@/controllers/auth.controller.js';
import { connectDB } from '@/lib/db.js';

const app = new Hono();
const PORT = Number(ENV.SERVER_PORT) || 3001;

app
  .use('*', logger((info) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] : ${info}`)
  }))
  .use('*', cors({
    origin: (origin) => {
      // * Allow these origins
      const allowedOrigins = [
        'http://localhost:5173',  // Vite dev server
        'https://snap-stash-swart.vercel.app', // Production domain
      ];

      return allowedOrigins.includes(origin || '') ? origin : null;
    },
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }))
  .use('/api/category/*', requireAuth)
  .use('/api/task/*', requireAuth)

  .get('/api/status', (c) => {
    return c.text('All OK. API Running + Database Connected.', 200)
  })

  .route('/api/auth', authServer)
  .route('/api/category', categoryServer)
  .route('/api/task', taskServer)

  .notFound((c) => {
    return c.text(`404! This url(\`${c.req.path}\`) not found`, 404)
  })

  .onError((err, c) => {
    console.error(`Error on \`${c.req.path}\` : `)
    console.error(err);

    return c.text(`Error! Something wen wrong on url(\`${c.req.path}\`)....`, 500)
  })

let dbConnection = await connectDB();
serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`API live on http://localhost:${info.port} and db connection ${dbConnection}`)
})
