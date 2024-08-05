import cors from 'cors';
import express, { Request, Response } from 'express';
import publicRoutes from './routes/publicRoutes';
import protectedRoutes from './routes/protectedRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './config/swaggerOptions';

require('dotenv').config();

const app = express();
const whitelist = [undefined, 'http://localhost:3000', 'http://localhost:2000'];

var corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Swagger setup
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use public routes
app.use('/', publicRoutes);

// Use protected routes
app.use('/', protectedRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
