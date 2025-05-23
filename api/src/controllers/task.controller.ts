import { Hono } from 'hono';

import { TaskModel } from '@/models/task.models.js';

const taskServer = new Hono()
    .get('/', async (c) => {
        const tasks = await TaskModel.find();
        console.log(`tasks : `)
        console.log(tasks)
        console.log(`tasks : `)
        return c.text('Task GET', 200)
    })

export default taskServer;