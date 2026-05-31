import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
} from '../controllers/notesController';

const router = Router();

router.get('/notes', getNotes);
router.post('/notes', createNote);
router.get('/notes/:noteId', getNoteById);
router.delete('/notes/:noteId', deleteNote);

export default router;
