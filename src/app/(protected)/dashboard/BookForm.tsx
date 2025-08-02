'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

export default function BookForm({ onSuccess, editingBook, setEditingBook }) {
  const [form, setForm] = useState({ title: '', author: '', tags: '', status: 'Want to Read' })

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        author: editingBook.author,
        tags: editingBook.tags.join(', '),
        status: editingBook.status
      })
    }
  }, [editingBook])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim())
    }

    if (editingBook) {
      await axios.put(`/books/${editingBook._id}`, payload)
    } else {
      await axios.post('/books', payload)
    }

    setForm({ title: '', author: '', tags: '', status: 'Want to Read' })
    setEditingBook(null)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded" placeholder="Title" required />
      <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full p-2 border rounded" placeholder="Author" required />
      <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full p-2 border rounded" placeholder="Tags (comma separated)" />
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-2 border rounded">
        <option value="Want to Read">📖 Want to Read</option>
        <option value="Reading">📘 Reading</option>
        <option value="ompleted">✅ Completed</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingBook ? 'Update' : 'Add'} Book</button>
    </form>
  )
}
