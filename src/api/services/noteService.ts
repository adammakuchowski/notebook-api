import {Document} from 'mongoose'

import NoteModel from '../../db/models/noteModel'
import {EditNote, NoteData} from '../types/note'

export const getNoteById = async (_id: string): Promise<NoteData | null> => {
  const note = await NoteModel.findOne({
    _id,
    deletedAt: {$eq: null}
  }).lean()

  return note
}

export const createNewNote = async ({title, text}: NoteData): Promise<Document> => {
  const newNoteModel = new NoteModel({title, text})
  const newNote = await newNoteModel.save()

  return newNote
}

export const findAllNotes = async (): Promise<NoteData[]> => {
  const allNotes = await NoteModel.find({
    deletedAt: {$eq: null}
  }).limit(100).lean()

  return allNotes
}

export const editNoteById = async ({id, title, text}: EditNote): Promise<Document | null> => {
  const result = await NoteModel.findByIdAndUpdate({
    _id: id
  }, {
    $set: {
      title,
      text
    }
  }, {
    new: true,
    lean: true
  })

  return result
}

export const softDeleteNoteById = async (_id: string): Promise<Document | null> => {
  const currentDate = new Date()
  const result = await NoteModel.findByIdAndUpdate({
    _id
  }, {
    $set: {
      deletedAt: currentDate
    }
  }, {
    new: true,
    lean: true
  })

  return result
}

export const deleteNoteById = async (_id: string): Promise<Document | null> => {
  const result = await NoteModel.findByIdAndDelete({_id})

  return result
}
