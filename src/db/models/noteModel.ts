import mongoose from 'mongoose'

import {NoteData} from '../../api/types/note'

const noteDataSchema = new mongoose.Schema<NoteData>({
  title: {type: String, required: true},
  text: {type: String}
})

const NoteDataModel = mongoose.model<NoteData>('NoteData', noteDataSchema)

export default NoteDataModel
