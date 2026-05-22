import React, { useState, useEffect } from 'react';
import { checkHealth } from './api';

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Проверяем соединение с бэкендом
    checkHealth()
      .then((response) => {
        setServerStatus('Connected ✅');
        setMessage(response.data.message);
      })
      .catch((error) => {
        setServerStatus('Disconnected ❌');
        setMessage(error.message);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📋 Task Manager</h1>
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Backend Status:</h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{serverStatus}</p>
        {message && <p>Response: {message}</p>}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <p>✅ Backend работает на порту 5000</p>
        <p>📡 Проверка связи: <code>/api/health</code></p>
      </div>
    </div>
  );
}

export default App;
