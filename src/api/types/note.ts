export type NoteData = {
  id: string;
  title: string;
  text: string;
  userId: string;
  deletedAt?: Date;
}

export type CreateNoteBody = Omit<NoteData, 'id'>

export type NewNoteData = Omit<NoteData, 'id'>

export type EditNote = NoteData

export type EditNoteBody = EditNote
