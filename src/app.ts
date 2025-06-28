import Fastify from 'fastify';
import { AppDataSource } from './dbConnection';
import { profileRoutes }  from './routes/profile.route';
import { contractRoutes } from './routes/contract.route';
import { jobRoutes } from './routes/job.route';
import { balanceRoutes } from './routes/balance.route';

const start = async () => {
    const app = Fastify();

    try {
        await AppDataSource.initialize();
        console.log("Database connection established");
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }

    app.register(profileRoutes, { prefix: "/api/v1/profiles" });
    app.register(contractRoutes, { prefix: "/api/v1/contracts" });
    app.register(jobRoutes, { prefix: "/api/v1/jobs" });
    app.register(balanceRoutes, { prefix: "/api/v1/balance" });

    try {
        await app.listen({ port: 3000 });
        console.log('Server is running on http://localhost:3000');
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();
