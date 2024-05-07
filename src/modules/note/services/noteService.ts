import {Document} from 'mongoose'

import {NoteModel} from '../../../db/models/noteModel'
import {EditNote, NewNoteData, Note} from '../types/note'
import {noteProjection} from '../constatns'

export const getNoteById = async (
  _id: string,
  userId: string,
): Promise<Note | null> => {
  const note = await NoteModel.findOne(
    {
      _id,
      userId,
      deletedAt: {$eq: null},
    },
    noteProjection,
  ).lean()

  return note
}

export const createNewNote = async ({
  title,
  text,
  userId,
}: NewNoteData): Promise<Document> => {
  const newNoteModel = new NoteModel({title, text, userId})
  const newNote = await newNoteModel.save()

  return newNote
}

export const findAllNotes = async (userId: string): Promise<Note[]> => {
  const allNotes = await NoteModel.find(
    {
      userId,
      deletedAt: {$eq: null},
    },
    noteProjection,
  )
    .limit(100)
    .lean()

  return allNotes
}

export const editNoteById = async ({
  id,
  title,
  text,
  userId,
}: EditNote): Promise<Note | null> => {
  const result = await NoteModel.findByIdAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      $set: {
        title,
        text,
      },
    },
    {
      new: true,
      lean: true,
    },
  )

  return result
}

export const softDeleteNoteById = async (
  _id: string,
  userId: string,
): Promise<Note | null> => {
  const currentDate = new Date()
  const result = await NoteModel.findByIdAndUpdate(
    {
      _id,
      userId,
    },
    {
      $set: {
        deletedAt: currentDate,
      },
    },
    {
      new: true,
      lean: true,
    },
  )

  return result
}

export const deleteNoteById = async (_id: string): Promise<Document | null> => {
  const result = await NoteModel.findByIdAndDelete({_id})

  return result
}
