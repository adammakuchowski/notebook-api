export type NoteData = {
  title: string;
  text: string;
  deletedAt?: Date;
}

export type CreateNoteBody = NoteData

export type EditNote = NoteData & {
  id: string;
}

export type EditNoteBody = EditNote
