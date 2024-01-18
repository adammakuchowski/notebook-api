import {Document} from 'mongoose'

import NoteModel from '../../db/models/noteModel'
import {NoteData} from '../types/note'

export const getNoteById = async (_id: string): Promise<NoteData | null> => {
  const note = await NoteModel.findOne({_id}).lean()

  return note
}

export const createNewNote = async (noteData: NoteData): Promise<Document> => {
  const newNoteModel = new NoteModel(noteData)
  const newNote = await newNoteModel.save()

  return newNote
}

export const findAllNotes = async (): Promise<NoteData[]> => {
  const allNotes = await NoteModel.find({}).limit(100).lean()

  return allNotes
}

export const softDeleteNoteById = async (_id: string): Promise<any> => {
  const currentDate = new Date()
  const result = await NoteModel.findByIdAndUpdate({_id}, {$set: {deletedAt: currentDate}}, {new: true, lean: true})

  return result
}

export const deleteNoteById = async (_id: string): Promise<any> => {
  const result = await NoteModel.findByIdAndDelete({_id})

  return result
}
