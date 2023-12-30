import {Document} from 'mongoose'

import NoteModel from '../../db/models/noteModel'
import {NoteData} from '../types/note'

export const getNoteById = async (noteId: string): Promise<Document> => {
  return {}
}

export const createNewNote = async (noteData: NoteData): Promise<Document> => {
  const newNoteModel = new NoteModel(noteData)
  const newNote = await newNoteModel.save()

  return newNote
}
