import React, { useState } from 'react';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    if (!studentId.trim()) {
      setError('אנא הזן תעודת זהות');
      return;
    }

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbxy3kEicrc9NPcxZyk2n4yIm4-RYYkgf8Jx_3-zBMWREjsxAzvx8wxWL9yB-b85TIFq/exec?student_id=${studentId}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('שגיאה בחיבור לשרת');
    }
  };

  return (
    <div className="App">
      <h1>בדיקת כיתה ביום הבגרות 🎓</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="הזן תעודת זהות"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit">בדוק</button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <p>👤 שם: {result.student_name}</p>
          <p>🏫 כיתה/חדר: {result.exam_class}</p>
        </div>
      )}
    </div>
  );
}

export default App;
