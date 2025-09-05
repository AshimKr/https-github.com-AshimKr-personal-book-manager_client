'use client';
import React from 'react';

type Props = {
  status: string;
  onStatusChange: (val: string) => void;
  tag: string;
  onTagChange: (val: string) => void;
};

export default function FilterBar({ status, onStatusChange, tag, onTagChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border rounded p-2 w-full sm:w-auto"
      >
        <option value="">All statuses</option>
        <option value="Want to Read">📖 Want to Read</option>
        <option value="Reading">📘 Reading</option>
        <option value="Completed">✅ Completed</option>
      </select>

      <input
        className="border rounded p-2 w-full sm:w-64"
        placeholder="Filter by tag (e.g. fantasy)"
        value={tag}
        onChange={(e) => onTagChange(e.target.value)}
      />
    </div>
  );
}
