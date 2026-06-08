import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Custom validator for ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid noteId format');
  }
  return value;
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number()
      .min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least {#limit}',
      })
      .default(1),

    perPage: Joi.number()
      .min(5)
      .max(20)
      .messages({
        'number.base': 'perPage must be a number',
        'number.min': 'perPage must be at least {#limit}',
        'number.max': 'perPage must be at most {#limit}',
      })
      .default(10),

    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),

    search: Joi.string().allow('').messages({
      'string.base': 'Search must be a string',
    }),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.required': 'noteId is required',
      'string.base': 'noteId must be a string',
    }),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title cannot be empty',
      'any.required': 'Title is required',
    }),

    content: Joi.string()
      .allow('')
      .messages({
        'string.base': 'Content must be a string',
      })
      .default(''),

    tag: Joi.string()
      .valid(...TAGS)
      .default('Todo')
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.required': 'noteId is required',
      'string.base': 'noteId must be a string',
    }),
  }),

  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title cannot be empty',
    }),

    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),

    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
  }).min(1),
};
