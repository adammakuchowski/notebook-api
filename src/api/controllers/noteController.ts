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
  softDeleteNoteById
} from '../services/noteService'
import {
  CreateNoteBody
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
  } catch (error: any) {
    logger.error(`[getNote] error: ${error.message}`)

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
  } catch (error: any) {
    logger.error(`[getAllNotes] error: ${error.message}`)

    next(error)
  }
}

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const noteData: CreateNoteBody = req.body

  try {
    const newNoteData = await createNewNote(noteData)
    logger.info('[createNote] new note successfully created')

    res
      .status(201)
      .json(newNoteData)
  } catch (error: any) {
    logger.error(`[createNote] error: ${error.message}`)

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
  } catch (error: any) {
    logger.error(`[softDeleteNote] error: ${error.message}`)

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
  } catch (error: any) {
    logger.error(`[deleteNote] error: ${error.message}`)

    next(error)
  }
}
