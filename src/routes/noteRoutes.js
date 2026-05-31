import { Router } from 'express';
import { getnoteById, getNotes } from '../controllers/notesController';

const router = Router();

router.get('/notes', getNotes);

router.get('/notes/:noteId', getnoteById);

export default router;
