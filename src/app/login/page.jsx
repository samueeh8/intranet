

"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [activeForm, setActiveForm] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // const router = useRouter();

  // useEffect(() => {
  //   if (session) {
  //     router.push("/welcome");
  //   }
  // }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      });
      if (result.error) setError(result.error);
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setRegisterData({ email: "", password: "", confirmPassword: "" });
      setActiveForm("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className={styles.centerText}><p>Cargando...</p></div>;
  }

  // if (session) {
  //   return (
  //     <div className={styles.centerText}>
  //       <h1>Bienvenido a la Intranet</h1>
  //       <p>
  //         Hola, {session.user.nombre} ({session.user.role})
  //       </p>
  //       <button className={styles.logoutButton} onClick={() => signOut()}>
  //         Cerrar sesión
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Intranet Corporativa</h1>

      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveForm("login")}
          className={`${styles.tab} ${
            activeForm === "login" ? styles.loginTabActive : styles.loginTabInactive
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setActiveForm("register")}
          className={`${styles.tab} ${
            activeForm === "register" ? styles.registerTabActive : styles.registerTabInactive
          }`}
        >
          Registrarse
        </button>
      </div>

      {activeForm === "login" && (
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="example@asenjo.net"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            className={styles.input}
          />
          </div>
          <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Contraseña"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          <div className={styles.forgotPasswordWrapper}>
            <Link href="/recuperar-contrasena" className={styles.link}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      )}

      {activeForm === "register" && (
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="example@asenjo.net"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
              required
              className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      )}
    </div>
  );
}
