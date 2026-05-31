import createHttpError from 'http-errors';
import { Note } from '../models/note';

export const getNotes = async (request, response) => {
  const notes = await Note.find();
  response.status(200).json(notes);
};

export const getNoteById = async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
};

export const createNote = async (request, response) => {
  const note = await Note.create(request.body);
  response.status(201).json(note);
};
