'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import BookForm from './BookForm'
import BookList from './BookList'

export default function DashboardPage() {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState<{
    _id: string;
    title: string;
    author: string;
    tags: string[];
    status: string;
  } | null>(null)

  const fetchBooks = async () => {
    const res = await axios.get('/books')
    setBooks(res.data)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 My Book Collection</h2>
      <BookForm onSuccess={fetchBooks} editingBook={editingBook} setEditingBook={setEditingBook} />
      <BookList books={books} onEdit={(book) => setEditingBook(book)} onDelete={fetchBooks} />
    </div>
  )
}
