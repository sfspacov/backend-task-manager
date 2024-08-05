import { SwaggerOptions } from 'swagger-ui-express';

const swaggerOptions: SwaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager',
            version: '1.0.0',
            description: 'API documentation for my Task Manager',
        },
        servers: [
            {
                url: 'http://localhost:2000',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs (adjust if necessary)
};

export default swaggerOptions;
