import React, { useState } from 'react';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle normal signup
  const handleRegister = async () => {
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }
      const data = await response.json();
      setMessage(`Signup successful! Token: ${data.token}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Handle login with default account
  const handleDefaultLogin = async () => {
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/auth/default', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to login with default account');
      }
      const data = await response.json();
      setMessage(`Default user logged in! Token: ${data.token}`);
      // Optionally store the token in localStorage or sessionStorage
      // localStorage.setItem('token', data.token);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <div style={styles.formGroup}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={handleRegister} style={styles.button}>
        Sign Up
      </button>

      <hr style={{ margin: '20px 0' }} />

      <button onClick={handleDefaultLogin} style={styles.button}>
        Login with Default Account
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// Example inline styling
const styles = {
  container: {
    width: '400px',
    margin: '50px auto',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  message: {
    marginTop: '20px',
    color: 'green',
  },
};