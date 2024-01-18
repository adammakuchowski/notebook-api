export type NoteData = {
  title: string;
  text: string;
  deletedAt?: Date;
}

export type CreateNoteBody = NoteData
