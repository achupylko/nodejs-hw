import { Router } from 'express';
import { Note } from '../models/note';

const router = Router();

router.get('/notes', async (request, response) => {
  const notes = await Note.find();
  response.status(200).json(notes);
});

router.get('/notes/:noteId', async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findById(noteId);
  if (!note) {
    return response.status(404).json({ message: 'Note not found' });
  }
  response.status(200).json(note);
});

export default router;
