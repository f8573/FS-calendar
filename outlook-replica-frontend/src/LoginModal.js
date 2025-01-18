import React from "react";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLogin, onRegister }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    await onLogin({ username, password });
  }

  async function handleRegister(e) {
    e.preventDefault();
    await onRegister({ username, password });
  }

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Username</label>
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <button className="login-submit" type="submit">
              Log In
            </button>
            <button
              className="login-submit"
              onClick={handleRegister}
              style={{ backgroundColor: "#555" }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
