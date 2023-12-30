import {
  NextFunction,
  Request,
  Response
} from 'express'

import {getNoteById, createNewNote} from '../services/noteService'
import {logger} from '../../app'
import {CreateNoteBody, GetNoteBody} from '../types/note'

export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {noteId}: GetNoteBody = req.body
    const note = await getNoteById(noteId)

    res
      .status(200)
      .json(note)
  } catch (error: any) {
    logger.error(`[getNote] error: ${error.message}`)

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
