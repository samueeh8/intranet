


"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import "./page.module.recuperar-contrasena.css";

export default function RecuperarContrasena() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, step: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Se ha enviado un código a tu correo electrónico.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Error al solicitar restablecimiento");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, step: 2 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Código verificado. Establece una nueva contraseña.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("");
      setMessage("");
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/recuperar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword, step: 3 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Contraseña restablecida. Ya puedes iniciar sesión.");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(err.message || "Error al establecer nueva contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Recuperar Contraseña</h1>

      {step === 1 && (
        <form onSubmit={handleRequestReset} className="form">
          <div className="inputGroup">
            <input
              placeholder="example@asenjo.net"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
          </div>
          <button type="submit" disabled={loading} className="submitBtn">
            {loading ? "Enviando..." : "Solicitar código"}
          </button>
          <div className="linkWrapper">
            <Link href="/" className="link">
              Volver a inicio de sesión
            </Link>
           </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="form">
          <div className="inputGroup">
            <input
              placeholder="Código de verificación"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="input"
            />
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
          </div>

          <button type="submit" disabled={loading} className="submitBtn">
            {loading ? "Verificando..." : "Verificar código"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSetNewPassword} className="form">
          <div className="inputGroup">
            <input
              placeholder="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="inputGroup">
            <input
              placeholder="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input"
            />
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
          </div>
          <button type="submit" disabled={loading} className="submitBtn">
            {loading ? "Guardando..." : "Confirmar"}
          </button>
          <div className="linkWrapper">
            <Link href="/" className="link">
              Volver a inicio de sesión
            </Link>
           </div>
        </form>
      )}
    </div>
  );
}
