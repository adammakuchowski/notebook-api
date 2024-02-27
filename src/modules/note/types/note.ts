export type Note = {
  id: string;
  title: string;
  text: string;
  userId: string;
  deletedAt?: Date;
}

export type CreateNoteBody = Omit<Note, 'id'>

export type NewNoteData = Omit<Note, 'id'>

export type EditNote = Note

export type EditNoteBody = EditNote
