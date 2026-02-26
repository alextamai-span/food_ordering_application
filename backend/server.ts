import { buildFastify } from './config/fastify.js';
import { env } from './config/env.js';

// table queries imports
import { 
    guestsTableQuery,
    ordersTableQuery,
    orderItemsTableQuery,
    foodItemsTableQuery
} from './db/tableQueries.js';

// route imports
import registerRoutes from './routes/registerRoute.ts';
import loginRoutes from './routes/loginRoute.ts';
import guestOrderRoutes from './routes/guestOrderRoutes.ts';
import empOrderRoutes from './routes/empOrderRoutes.ts';
import guestMenuRoutes from './routes/guestMenuRoutes.ts';
import empMenuRoutes from './routes/empMenuRoutes.ts';

const initalizeDatabase = async (fastify: any) => {
    try {
        const client = await fastify.pg.connect();

        // Create tables if they don't exist
        await client.query(guestsTableQuery);
        await client.query(ordersTableQuery);
        await client.query(foodItemsTableQuery);
        await client.query(orderItemsTableQuery);

        console.log('Database initialized successfully');
    }
    catch (err) {
        // Database initialization errors
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

const startServer = async () => {
    // Build Fastify instance
    const fastify = buildFastify();

    try {
        // check for server
        fastify.get('/', async () => ({ status: 'online' }));

        // create routes
        await fastify.register(registerRoutes, { prefix: '/register' });
        await fastify.register(loginRoutes, { prefix: '/login' });
        await fastify.register(guestOrderRoutes, { prefix: '/guest/order' });
        await fastify.register(empOrderRoutes, { prefix: '/emp/order' });
        await fastify.register(guestMenuRoutes, { prefix: '/guest/menu' });
        await fastify.register(empMenuRoutes, { prefix: '/emp/menu' });

        // start up plug ins
        await fastify.ready();
        // start up database 
        await initalizeDatabase(fastify);

        // Start the server
        await fastify.listen({ port: env.PORT });
        console.log(`Server listening at http://localhost:${env.PORT}`);
    }
    catch (err) {
        // Server startup errors
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();