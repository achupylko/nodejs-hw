import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getNotes);
router.post('/notes', createNote);
router.get('/notes/:noteId', getNoteById);
router.delete('/notes/:noteId', deleteNote);
router.patch('/notes/:noteId', updateNote);

export default router;
