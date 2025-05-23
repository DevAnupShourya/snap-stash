import { CategoryModel } from '@/models/category.models.js';
import { Hono } from 'hono';

const categoryServer = new Hono()
    .get('/', async (c) => {
        const category = await CategoryModel.find();
        console.log(`Category : `)
        console.log(category)
        console.log(`Category : `)
        return c.text('Category GET', 200)
    })

export default categoryServer;