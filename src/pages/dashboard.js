import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('https://notes-saas-backend-6.onrender.com/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotes(data.notes || []);
    };

    fetchNotes();
  }, []);

  const createNote = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://notes-saas-backend-6.onrender.com/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newNote }),
    });
    const data = await res.json();
    setNotes((prev) => [...prev, data.note]);
    setNewNote('');
  };

  const isEditor = user?.role === 'editor' || user?.role === 'admin';
  const isViewer = user?.role === 'viewer';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name} ({user?.role})</h1>

      {isEditor && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="New note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border p-2 w-64 mr-2"
          />
          <button onClick={createNote} className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Note
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Notes</h2>
        <ul>
          {notes.map((note) => (
            <li key={note._id} className="border p-2 mb-2 rounded">
              {note.content}
              {/* Optional: Add edit/delete buttons for editors */}
              {isEditor && (
                <span className="text-sm text-gray-500 ml-2">(editable)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
