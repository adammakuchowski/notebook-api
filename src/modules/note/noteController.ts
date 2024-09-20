import {NextFunction, Response} from 'express'

import {logger} from '../../app'
import {NoteService} from './services/noteService'
import {CreateNoteBody, EditNoteBody} from './types'
import {AuthRequest} from '../../modules/user/types'
import {sendBadRequest} from '../utils/responseUtils'
import {Container} from 'typedi/Container'

export class NoteController {
  private readonly noteService

  constructor() {
    this.noteService = Container.get(NoteService)
  }

  async getNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {id} = req.params
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const note = await this.noteService.getNoteById(id, userId)

      console.log(userId)

      res.status(200).json(note)
    } catch (error: unknown) {
      logger.error(`[getNote] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async getAllNotes(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const allNotes = await this.noteService.findAllNotes(userId)

      res.status(200).json(allNotes)
    } catch (error: unknown) {
      logger.error(`[getAllNotes] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async createNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {title, text}: CreateNoteBody = req.body
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const newNoteData = await this.noteService.createNewNote({title, text, userId})
      logger.info('[createNote] new note successfully created')

      res.status(201).json(newNoteData)
    } catch (error: unknown) {
      logger.error(`[createNote] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async editNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {id, title, text}: EditNoteBody = req.body
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const result = await this.noteService.editNoteById({id, title, text, userId})

      logger.info(`[editNote] note id:${id} successfully edited`)

      res.status(200).json(result)
    } catch (error: unknown) {
      logger.error(`[editNote] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async deleteNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {id} = req.params
      const result = await this.noteService.softDeleteNoteById(id)

      logger.info(`[deleteNote] note id:${id} successfully deleted`)

      if (result) {
        res.status(204).end()

        return
      }

      res.status(404).json({error: 'Note not found'})
    } catch (error: unknown) {
      logger.error(`[deleteNote] error: ${(error as Error).message}`)

      next(error)
    }
  }
}
