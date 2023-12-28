import mongoose from 'mongoose'

import {SampleData} from '../../interfaces/types'

const sampleDataSchema = new mongoose.Schema<SampleData>({
  id: { type: String, required: true },
  name: { type: String, required: true },
})

const SampleDataModel = mongoose.model<SampleData>('SampleData', sampleDataSchema)

export default SampleDataModel
