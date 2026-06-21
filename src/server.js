import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import authRoutes from './routes/authRoutes.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware for logging requests
app.use(logger);

// Middleware for JSON parsing
app.use(express.json());

// Allows requests from any sources
app.use(cors());

app.use(cookieParser());

// Auth routes
app.use(authRoutes);

// Connect the note route group
app.use(notesRouter);

// Middleware for non-existent routes
app.use(notFoundHandler);

// Error handling from celebrate (validation)
app.use(errors());

// Middleware for error handling
app.use(errorHandler);

// connect to MongoDB
await connectMongoDB();

// server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
