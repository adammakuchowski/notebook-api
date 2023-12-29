export type NoteData = {
  title: string;
  text: string;
}

export type CreateNoteBody = NoteData

export type GetNoteBody = {
  noteId: string;
}
