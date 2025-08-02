
import React, { useState } from 'react';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    setConfirmed(false);

    if (!studentId.trim()) {
      setLoading(false);
      setError('الرجاء إدخال رقم الهوية');
      return;
    }

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbySNGXpPxOpI81HEPiMBPCQj33sgsAfManFaUon3Sh0BUNQtArp9QC6x8_T-0g7D2DRyQ/exec?student_id=' + studentId
      );
      const data = await response.json();

      if (data.error) {
        setError('لم يتم العثور على الطالب');
      } else {
        setResult(data);
        setConfirmed(data.confirmed);
        console.log("📋 رقم النموذج:", data.exam_num);
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    }

    setLoading(false);
  };

  const handleConfirm = async () => {
    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbySNGXpPxOpI81HEPiMBPCQj33sgsAfManFaUon3Sh0BUNQtArp9QC6x8_T-0g7D2DRyQ/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `student_id=${studentId}`,
        }
      );
      setConfirmed(true);
    } catch (err) {
      alert('حدث خطأ أثناء تأكيد الوصول');
    }
  };

  return (
    <div className="App">
      <h1>🔍 فحص معلومات الإمتحان</h1>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="أدخل رقم الهوية"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button type="submit">إفحص</button>
          </form>

          {error && <p className="error">{error}</p>}

          {result && (
            <div className="result">
              <h2>📘 {result.exam_name}</h2>
              <p>👤 اسم الطالب: {result.student_name}</p>
              <p>🏫 القاعة/الصف: {result.exam_class}</p>
              <p>📝 رقم النموذج: {result.exam_num}</p>

              {!confirmed ? (
                <button onClick={handleConfirm} style={{ marginTop: '1rem' }}>
                  ✅ أنا أؤكد الحضور
                </button>
              ) : (
                <p style={{ color: 'green', marginTop: '1rem' }}>
                  ✅ تم تأكيد الحضور بنجاح!
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
