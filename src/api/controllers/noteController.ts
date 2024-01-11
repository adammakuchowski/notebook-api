import {
  NextFunction,
  Request,
  Response
} from 'express'

import {logger} from '../../app'
import {
  getNoteById,
  createNewNote,
  findAllNotes
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
    logger.info('[createNote] new data sample successfully created')

    res
      .status(201)
      .json(newNoteData)
  } catch (error: any) {
    logger.error(`[createNote] error: ${error.message}`)

    next(error)
  }
}
