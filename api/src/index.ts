import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';
import 'dotenv/config';

import { ENV } from '@/utils/env.js'
import taskServer from '@/controllers/task.controller.js';
import categoryServer from '@/controllers/category.controller.js';
import { connectDB } from '@/lib/db.js';

const app = new Hono();
const PORT = Number(ENV.SERVER_PORT) || 3001;

app.use('*', logger());
app.use('*', cors());
connectDB();

app.get('/api/status', (c) => {
  return c.text('All OK. API Running + Database Connected.', 200)
});

app.route('/api/category', categoryServer);
app.route('/api/task', taskServer);

app.notFound((c) => {
  return c.text(`404! This url(\`${c.req.path}\`) not found`, 404)
})

app.onError((err, c) => {
  console.error(`Error on \`${c.req.path}\` : `)
  console.error(err);

  return c.text(`Error! Something wen wrong on url(\`${c.req.path}\`)....`, 404)
})


serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`🚀 API is running on http://localhost:${info.port}`)
})
