import mongoose from 'mongoose'

import {NoteData} from '../../api/types/note'

const noteDataSchema = new mongoose.Schema<NoteData>({
  title: {type: String, required: true},
  text: {type: String},
  userId: {type: String, required: true},
  deletedAt: {type: Date}
}, {
  timestamps: true
})

const NoteDataModel = mongoose.model<NoteData>('NoteData', noteDataSchema, 'notes')

export default NoteDataModel
