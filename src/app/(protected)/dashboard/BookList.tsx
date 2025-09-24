'use client';
import { Dispatch, SetStateAction } from 'react';
// import type { Book } from './BookForm';
import api from '@/lib/api';

export type Book = {
  _id: string;
  title: string;
  author: string;
  status: 'Want to Read' | 'Reading' | 'Completed';
  tags: string[];
};

type Props = {
  books: Book[];
  onEdit: Dispatch<SetStateAction<Book | null>>;
  onChanged: () => void;
};

export default function BookList({ books, onEdit, onChanged }: Props) {
  const deleteBook = async (id: string) => {
    await api.delete(`/books/${id}`);
    onChanged();
  };
  const updateStatus = async (id: string, status: Book['status']) => {
    await api.patch(`/books/${id}`, { status });
    onChanged();
  };
  return (
    <ul className="space-y-3">
      {books.map((book) => (
        <li key={book._id} className="border rounded p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <p className="text-sm">Tags: {book.tags.join(', ') || '—'}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={book.status}
                onChange={(e) => updateStatus(book._id, e.target.value as Book['status'])}
                className="border rounded p-2"
                title="Change status"
              >
                <option value="Want to Read">📖 Want to Read</option>
                <option value="Reading">📘 Reading</option>
                <option value="Completed">✅ Completed</option>
              </select>
              <button onClick={() => onEdit(book)} className="text-blue-600">Edit</button>
              <button onClick={() => deleteBook(book._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
