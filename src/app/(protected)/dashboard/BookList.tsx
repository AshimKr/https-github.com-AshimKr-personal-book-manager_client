'use client'

import axios from '@/lib/axios'

type Book = {
  _id: string;
  title: string;
  author: string;
  status: string;
  tags: string[];
};

type BookListProps = {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: () => void;
};

export default function BookList({ books, onEdit, onDelete }: BookListProps) {
  const deleteBook = async (id: string) => {
    await axios.delete(`/books/${id}`)
    onDelete()
  }

  if (books.length === 0) return <p>No books added yet.</p>

  return (
    <ul className="space-y-4">
      {books.map((book) => (
        <li key={book._id} className="border p-4 rounded shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <p className="text-sm">Status: {book.status}</p>
              <p className="text-sm">Tags: {book.tags.join(', ')}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => onEdit(book)} className="text-blue-600">Edit</button>
              <button onClick={() => deleteBook(book._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
