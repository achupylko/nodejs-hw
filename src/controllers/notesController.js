import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (request, response) => {
  const { page = 1, perPage = 10, tag, search } = request.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find({ userId: request.user._id });

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

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  response.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: request.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
};

export const createNote = async (request, response) => {
  const note = await Note.create({
    ...request.body,
    userId: request.user._id,
  });
  response.status(201).json(note);
};

export const deleteNote = async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: request.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
};

export const updateNote = async (request, response) => {
  const { noteId } = request.params;
  const note = await Note.findByIdAndUpdate(
    { _id: noteId, userId: request.user._id },
    request.body,
    {
      returnDocument: 'after',
    },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
};
