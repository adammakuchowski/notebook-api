import {
  NextFunction,
  Request,
  Response
} from 'express'

import {logger} from '../../app'
import {
  getNoteById,
  createNewNote,
  findAllNotes,
  deleteNoteById,
  softDeleteNoteById,
  editNoteById
} from '../services/noteService'
import {
  CreateNoteBody,
  EditNoteBody
} from '../types/note'

export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id} = req.params
    const note = await getNoteById(id)

    res
      .status(200)
      .json(note)
  } catch (error: unknown) {
    logger.error(`[getNote] error: ${(error as Error).message}`)

    next(error)
  }
}

export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allNotes = await findAllNotes()

    res
      .status(200)
      .json(allNotes)
  } catch (error: unknown) {
    logger.error(`[getAllNotes] error: ${(error as Error).message}`)

    next(error)
  }
}

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {title, text, userId}: CreateNoteBody = req.body

    const newNoteData = await createNewNote({title, text, userId})
    logger.info('[createNote] new note successfully created')

    res
      .status(201)
      .json(newNoteData)
  } catch (error: unknown) {
    logger.error(`[createNote] error: ${(error as Error).message}`)

    next(error)
  }
}

export const editNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id, title, text, userId}: EditNoteBody = req.body
    const result = await editNoteById({id, title, text, userId})

    logger.info(`[editNote] note id:${id} successfully edited`)

    res
      .status(200)
      .json(result)
  } catch (error: unknown) {
    logger.error(`[editNote] error: ${(error as Error).message}`)

    next(error)
  }
}

export const softDeleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id} = req.params
    const result = await softDeleteNoteById(id)

    logger.info(`[softDeleteNote] note id:${id} successfully soft deleted`)

    res
      .status(200)
      .json(result)
  } catch (error: unknown) {
    logger.error(`[softDeleteNote] error: ${(error as Error).message}`)

    next(error)
  }
}

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {id} = req.params
    const result = await deleteNoteById(id)

    logger.info(`[deleteNote] note id:${id} successfully deleted`)

    if (result) {
      res
        .status(204)
        .end()

      return
    }

    res
      .status(404)
      .json({error: 'Note not found'})
  } catch (error: unknown) {
    logger.error(`[deleteNote] error: ${(error as Error).message}`)

    next(error)
  }
}
