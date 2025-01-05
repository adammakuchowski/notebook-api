import {NoteModel} from '../../db/models/noteModel'
import {Repository} from '../types'
import {NewNoteData, Note} from './types'

export class NoteRepository implements Repository<Note> {
  async findById(id: string): Promise<Note | null> {
    const note = await NoteModel.findOne({
      _id: id,
      deletedAt: {$eq: null},
    }).lean()

    return note
  }

  async findAll(filter: Record<string, unknown>, includeDeleted = false): Promise<Note[]> {
    const query = {
      ...filter,
      ...(includeDeleted ? {} : { deletedAt: { $eq: null } })
    };
  
    const notes = await NoteModel.find(query)
      .limit(100)
      .lean();
  
    return notes;
  }
  
  async create(noteData: NewNoteData): Promise<Note> {
    const newNote = new NoteModel(noteData)
    await newNote.save()

    return newNote
  }

  async update(
    id: string,
    noteDelta: Record<string, unknown>,
  ): Promise<Note | null> {
    const result = await NoteModel.findByIdAndUpdate(id, noteDelta)

    return result
  }

  async softDelete(ids: string[]): Promise<boolean> {
    const result = await NoteModel.updateMany(
      {
        _id: {$in: ids},
      },
      {
        deletedAt: new Date(),
      },
    )

    return result.acknowledged
  }
}
