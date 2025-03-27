"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import "./welcome-page.css";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <p className="center">Cargando...</p>;

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
            <Link href="/welcome">
                <img src="/logo.png" alt="Logo de la empresa" className="logo" />
            </Link>
            <div className="nav-menu">
                {session?.user?.role === "admin" && (
                    <div className="admin-link">
                        <button onClick={() => router.push("/admin")}>Panel Admin</button>
                    </div>
                )}
                <div className="profile-menu">
                    <div className="avatar">
                        <User size={35} />
                    </div>
                    <div className="dropdown">
                        <button onClick={() => router.push("/perfil")}>Ver perfil</button>
                        <button onClick={() => signOut()}>Cerrar sesión</button>
                    </div>
                </div>
            </div>
        </div>
      </nav>

      <main className="welcomeMain">
        <div className="column2">
            <h1>Bienvenido a la Intranet</h1>
            <p>
            Hola, {session?.user?.nombre} ({session?.user?.role})
            </p>
        </div>
      </main>
    </div>
  );
}
