import mongoose from 'mongoose'

import {Note} from '../../modules/note/types/note'

const noteSchema = new mongoose.Schema<Note>({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export const NoteModel = mongoose.model<Note>('Note', noteSchema, 'notes')
