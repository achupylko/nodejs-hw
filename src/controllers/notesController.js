import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (request, response) => {
  const { tag, search } = request.query;

  const notesQuery = Note.find();

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const notes = await notesQuery.exec();

  response.status(200).json({
    notes,
  });
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

export const deleteNote = async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
};

export const updateNote = async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findByIdAndUpdate(noteId, request.body, {
    returnDocument: 'after',
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
};
