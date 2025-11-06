import React, { useState } from "react";
import "./Styles/login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!email.trim() || !password) {
      setError('Por favor ingresa email y contraseña.');
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El formato del email no es válido.');
      return;
    }

    // Definición de usuarios válidos (simulación)
    const users = {
      "admin@example.com": { role: "Administrador", id: 1 },
      "usuario@example.com": { role: "Usuario", id: 2 },
      "docente@example.com": { role: "Docente", id: 3 },
      "coordinador@example.com": { role: "Coordinador", id: 4 },
    };

    const user = users[email.toLowerCase()];

    // Verificar existencia de usuario
    if (!user) {
      setError('Usuario no encontrado.');
      return;
    }

    // Contraseña simulada: "1"
    if (password !== "1") {
      setError('Contraseña incorrecta.');
      return;
    }

    // Login exitoso
    const loggedUser = { email, role: user.role, id: user.id };

    if (typeof onLogin === "function") onLogin(loggedUser);

    if (remember) {
      try {
        localStorage.setItem("user", JSON.stringify(loggedUser));
      } catch (err) {
        console.warn("No se pudo escribir localStorage", err);
      }
    }

    alert(`Bienvenido ${user.role}`);
  }

  return (
    <div className="login-bg">
      <div className="login-wrap">
        {/* Avatar */}
        <div className="avatar">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="32" />
            <path
              d="M32 36c6.6 0 12-5.4 12-12S38.6 12 32 12s-12 5.4-12 12 5.4 12 12 12zm0 6c-10.7 0-20 5.5-20 12v4h40v-4c0-6.5-9.3-12-20-12z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <span className="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5z" />
              </svg>
            </span>
            <input
              id="login-email"
              type="email"
              placeholder="Email ID"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="email"
            />
          </div>

          <div className="field">
            <span className="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm3 8H9V7a3 3 0 0 1 6 0v3z" />
              </svg>
            </span>
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-label="password"
            />
          </div>

          <div className="meta">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a className="forgot" href="#forgot">
              Forgot Password?
            </a>
          </div>

          {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

          <button className="btn-login" type="submit">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
