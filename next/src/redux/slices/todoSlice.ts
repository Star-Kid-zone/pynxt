// /redux/slices/noteSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Note {
  id: number
  note_id: string
  note_title: string
  note_content: string
  created_on?: string
}

interface NotesState {
  notes: Note[]
}

const initialState: NotesState = {
  notes: [],
}

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload)
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const idx = state.notes.findIndex((note) => note.note_id === action.payload.note_id)
      if (idx !== -1) {
        state.notes[idx] = action.payload
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.note_id !== action.payload)
    },
  },
})

export const { setNotes, addNote, updateNote, deleteNote } = noteSlice.actions
export default noteSlice.reducer
