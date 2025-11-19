import { useState } from 'react';

const ShareCase = ({ cases }) => {
  const [selectedCase, setSelectedCase] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleShare = async () => {
    if (!selectedCase || !recipient) return alert("Select case and recipient");
    // Call API to share case
    alert(`Case ${selectedCase} shared with ${recipient}`);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-4">
      <h2 className="text-xl font-bold mb-4">Share Case</h2>

      <label className="block mb-2">Select Case</label>
      <select
        value={selectedCase}
        onChange={(e) => setSelectedCase(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">--Select Case--</option>
        {cases.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>

      <label className="block mb-2">Recipient (Client or Advocate Email)</label>
      <input
        type="text"
        placeholder="Enter recipient email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2">Message (optional)</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <button
        onClick={handleShare}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Share Case
      </button>
    </div>
  );
};

export default ShareCase;
