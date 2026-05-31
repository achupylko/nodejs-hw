import { Router } from 'express';
import { getNoteById, getNotes } from '../controllers/notesController';

const router = Router();

router.get('/notes', getNotes);

router.get('/notes/:noteId', getNoteById);

export default router;
