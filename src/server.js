import cors from 'cors';
import express from 'express';
import pino from 'pino-http';

import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware for JSON parsing
app.use(express.json());

// Allows requests from any sources
app.use(cors());

// Middleware for logging requests
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get('/notes', (request, response) => {
  response.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (request, response) => {
  const { noteId } = request.params;
  response.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware for non-existent routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware for error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
