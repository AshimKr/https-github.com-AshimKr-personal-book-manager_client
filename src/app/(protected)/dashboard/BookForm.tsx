'use client';
import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';

type BookStatus = 'Want to Read' | 'Reading' | 'Completed';

type Book = {
  _id?: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
};

type Props = {
  editingBook: Book | null;
  setEditingBook: (b: Book | null) => void;
  onSaved: () => void;
};

const EMPTY_BOOK: Book = {
  title: '',
  author: '',
  tags: [],
  status: 'Want to Read',
};

export default function BookForm({ editingBook, setEditingBook, onSaved }: Props) {
  const [form, setForm] = useState<Book>(EMPTY_BOOK);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = useMemo(() => Boolean(form._id), [form._id]);

  // Populate form when editing an existing book
  useEffect(() => {
    if (editingBook) {
      setForm({
        _id: editingBook._id,
        title: editingBook.title ?? '',
        author: editingBook.author ?? '',
        tags: Array.isArray(editingBook.tags) ? editingBook.tags : [],
        status: editingBook.status ?? 'Want to Read',
      });
      setTagsInput((editingBook.tags ?? []).join(', '));
    } else {
      setForm(EMPTY_BOOK);
      setTagsInput('');
    }
  }, [editingBook]);

  const parseTags = (raw: string) =>
    raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const payload: Book = {
        ...form,
        tags: parseTags(tagsInput),
      };

      if (payload._id) {
        await api.put(`/books/${payload._id}`, payload);
      } else {
        await api.post('/books', payload);
      }

      // reset after success
      setForm(EMPTY_BOOK);
      setTagsInput('');
      setEditingBook(null);
      onSaved();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong while saving the book.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_BOOK);
    setTagsInput('');
    setEditingBook(null);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        required
      />

      <input
        className="w-full p-2 border rounded"
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
        required
      />

      <input
        className="w-full p-2 border rounded"
        placeholder="Tags (comma separated)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        onBlur={() => {
          setTagsInput(parseTags(tagsInput).join(', '));
        }}
      />

      <select
        className="w-full p-2 border rounded"
        value={form.status}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, status: e.target.value as BookStatus }))
        }
      >
        <option value="Want to Read">📖 Want to Read</option>
        <option value="Reading">📘 Reading</option>
        <option value="Completed">✅ Completed</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={saving || !form.title.trim() || !form.author.trim()}
        >
          {saving ? 'Saving…' : isEdit ? 'Update Book' : 'Add Book'}
        </button>

        {isEdit && (
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
