import cors from 'cors';
import express from 'express';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import notesRouter from './routes/notesRoutes.js';

import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware for logging requests
app.use(logger);

// Middleware for JSON parsing
app.use(express.json());

// Allows requests from any sources
app.use(cors());

// Connect the note route group
app.use(notesRouter);

// Middleware for non-existent routes
app.use(notFoundHandler);

// Middleware for error handling
app.use(errorHandler);

// connect to MongoDB
await connectMongoDB();

// server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
