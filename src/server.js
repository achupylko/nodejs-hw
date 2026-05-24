import express from 'express';
import cors from 'cors';

import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ?? 3000;

// Allows requests from any sources
app.use(cors());

app.get('/notes', (response, request) => {
  response.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (response, request) => {
  const { noteId } = request.params;
  response.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
