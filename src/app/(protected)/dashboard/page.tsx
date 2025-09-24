'use client';
import { useEffect, useMemo, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/api';
import BookForm from './BookForm';
import BookList from './BookList';
type Book = {
  id: string;
  title: string;
  status: string;
  tags: string[];
};
import FilterBar from '@/components/FilterBar';

export default function DashboardPage() {
  useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [status, setStatus] = useState('');
  const [tag, setTag] = useState('');

  const fetchBooks = async () => {
    const res = await api.get('/books');
    setBooks(res.data ?? []);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    return books.filter(b => {
      const statusOk = !status || b.status === status;
      const tagOk = !tag || b.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase());
      return statusOk && tagOk;
    });
  }, [books, status, tag]);

  const total = books.length;
  const completed = books.filter(b => b.status === 'Completed').length;

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">📚 My Book Collection</h2>
        <div className="text-sm text-gray-700">Total: {total} • Completed: {completed}</div>
      </header>

      <BookForm editingBook={editingBook} setEditingBook={setEditingBook} onSaved={fetchBooks} />

      <FilterBar status={status} onStatusChange={setStatus} tag={tag} onTagChange={setTag} />

      <BookList books={filtered} onEdit={setEditingBook} onChanged={fetchBooks} />
    </div>
  );
}
