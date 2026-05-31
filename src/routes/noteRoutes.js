import { Router } from 'express';
import {
  createNote,
  getNoteById,
  getNotes,
} from '../controllers/notesController';

const router = Router();

router.get('/notes', getNotes);
router.post('/notes', createNote);
router.get('/notes/:noteId', getNoteById);

export default router;
