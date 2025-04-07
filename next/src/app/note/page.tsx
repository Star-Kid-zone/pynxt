/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setNotes, addNote, updateNote as updateNoteSlice, deleteNote as deleteNoteSlice } from "@/redux/slices/todoSlice"
import { FaEdit, FaPlus, FaSignOutAlt, FaSpinner, FaTrash } from "react-icons/fa"
import Head from 'next/head'
import { useRouter } from "next/navigation";

type NoteForm = {
  note_title: string
  note_content: string
}

export default function NotesPage() {
  const notes = useSelector((state: RootState) => state.todo.notes)
  const dispatch = useDispatch()
  const router = useRouter();

  const [form, setForm] = useState<NoteForm>({ note_title: "", note_content: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await api.get("/notes/notes/")
      dispatch(setNotes(res.data.data ))
    } catch (err: any) {
      console.error("Error fetching notes:", err)
      setError("Failed to load notes")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notes/notes/${id}/`)
      dispatch(deleteNoteSlice(id))
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleEdit = (note: any) => {
    setForm({ note_title: note.note_title, note_content: note.note_content })
    setEditingId(note.note_id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!form.note_title.trim() || !form.note_content.trim()) {
      alert("Both fields are required.")
      return
    }

    try {
      if (editingId) {
        const res = await api.put(`/notes/notes/${editingId}/`, form)
        console.log(res.data)
        dispatch(updateNoteSlice(res.data.data[0]))
      } else {
        const res = await api.post("/notes/notes/", form)
        dispatch(addNote(res.data.data[0]))
      }
      resetForm()
    } catch (err) {
      console.error("Submit error:", err)
    }
  }

  const resetForm = () => {
    setForm({ note_title: "", note_content: "" })
    setEditingId(null)
    setShowModal(false)
  }

  const handleOpenModal = () => {
    resetForm()
    setShowModal(true)
  }

  const confirmDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleLogout = () =>{
    localStorage.clear()
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");

  }


  return (
    <>
      <Head>
        <title>My Notes | My App</title>
        <meta name="description" content="View, create, and manage your personal notes all in one place on My App." />
        <meta name="keywords" content="notes, todo, tasks, my notes app" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Your Name" />
        <meta property="og:title" content="My Notes | My App" />
        <meta property="og:description" content="Access your notes and stay organized with My App." />
        <meta property="og:url" content="https://yourdomain.com/notes" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="My App" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Notes | My App" />
        <meta name="twitter:description" content="Access your notes and stay organized with My App." />
      </Head>
    <div className="container mx-auto px-4 py-8 bg-black text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 My Notes</h1>
        <button
          onClick={handleOpenModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Note
        </button>
        <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
    >
      <FaSignOutAlt className="mr-2" /> Logout
    </button>
      </div>
  
      {loading ? (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-800 border border-red-600 text-red-300 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-zinc-900 rounded-lg shadow-md">
          {notes?.length > 0 ? (
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-zinc-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {note.note_title}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300 max-w-xs truncate">
                      {note.note_content}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">
                      {formatDate(note.created_on)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300 flex gap-3">
                      <button onClick={() => handleEdit(note)} className="text-blue-400 hover:text-blue-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => confirmDelete(note.note_id)} className="text-red-400 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-zinc-400">No notes found. Create your first note!</div>
          )}
        </div>
      )}
  
      {/* Mobile View */}
      <div className="md:hidden mt-8 space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-zinc-900 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{note.note_title}</h3>
            <p className="text-zinc-300 mt-2">{note.note_content}</p>
            <div className="text-sm text-zinc-500 mt-2">Created: {formatDate(note.created_on)}</div>
            <div className="flex space-x-4 mt-4">
              <button onClick={() => handleEdit(note)} className="flex items-center text-blue-400 hover:text-blue-600 text-sm">
                <FaEdit className="mr-1" /> Edit
              </button>
              <button onClick={() => confirmDelete(note.note_id)} className="flex items-center text-red-400 hover:text-red-600 text-sm">
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
  
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Note" : "Add New Note"}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="note_title" className="block text-sm font-medium text-zinc-400 mb-1">
                  Title
                </label>
                <input
                  id="note_title"
                  placeholder="Enter note title"
                  value={form.note_title}
                  onChange={(e) => setForm({ ...form, note_title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div>
                <label htmlFor="note_content" className="block text-sm font-medium text-zinc-400 mb-1">
                  Content
                </label>
                <textarea
                  id="note_content"
                  placeholder="Enter note content"
                  rows={4}
                  value={form.note_content}
                  onChange={(e) => setForm({ ...form, note_content: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
  
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingId ? "Update Note" : "Create Note"}
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-zinc-300 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
  
}

