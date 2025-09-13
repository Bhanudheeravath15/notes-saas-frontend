import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const tenant = localStorage.getItem('tenant');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get('https://notes-saas-backend-6.onrender.com/notes', { headers });
      setNotes(res.data);
    } catch (err) {
      setMessage('Failed to fetch notes');
    }
  };

  const createNote = async () => {
    try {
      await axios.post('https://notes-saas-backend-6.onrender.com/notes', { content: newNote }, { headers });
      setNewNote('');
      fetchNotes();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating note');
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://notes-saas-backend-6.onrender.com/notes/${id}`, { headers });
      fetchNotes();
    } catch (err) {
      setMessage('Error deleting note');
    }
  };

  const upgradePlan = async () => {
    try {
      await axios.post(`https://notes-saas-backend-6.onrender.com/tenants/${tenant}/upgrade`, {}, { headers });
      setMessage('Upgraded to Pro!');
      fetchNotes();
    } catch (err) {
      setMessage('Upgrade failed');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <p>Logged in as: <strong>{role}</strong> | Tenant: <strong>{tenant}</strong></p>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <h3>Your Notes</h3>
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            {note.content}
            <button onClick={() => deleteNote(note._id)} style={{ marginLeft: '1rem' }}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Create Note</h3>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Note content"
      />
      <button onClick={createNote}>Add Note</button>

      {/* Show upgrade banner if Free plan and notes >= 3 */}
      {notes.length >= 3 && role === 'Admin' && (
        <div style={{ marginTop: '2rem', background: '#ffe0e0', padding: '1rem' }}>
          <p>You’ve reached the Free plan limit. Upgrade to Pro for unlimited notes.</p>
          <button onClick={upgradePlan}>Upgrade to Pro</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
