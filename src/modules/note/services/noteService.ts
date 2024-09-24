import {EditNote, NewNoteData, Note} from '../types'
import {Container} from 'typedi/Container'
import {NoteRepository} from '../noteRepository'

export class NoteService {
  private readonly noteRepository

  constructor() {
    this.noteRepository = Container.get(NoteRepository)
  }

  async getNoteById(_id: string, userId: string): Promise<Note | null> {
    const note = await this.noteRepository.findById(_id)

    return note
  }

  async createNewNote({title, text, userId}: NewNoteData): Promise<Note> {
    const newNote = await this.noteRepository.create({title, text, userId})

    return newNote
  }

  async findAllNotes(userId: string): Promise<Note[]> {
    const allNotes = await this.noteRepository.findAll({userId})

    return allNotes
  }

  async editNoteById({
    id,
    title,
    text,
    userId,
  }: EditNote): Promise<Note | null> {
    const noteDelta = {
      title,
      text,
    }

    const result = await this.noteRepository.update(id, noteDelta)

    return result
  }

  async softDeleteNoteById(_id: string): Promise<boolean> {
    const result =  await this.noteRepository.softDelete([_id])

    return result
  }
}
