"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import "./NavBar.css"; 

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/welcome">
          <img src="/logo.png" alt="Logo de la empresa" className="logo" />
        </Link>

        <div className="nav-menu">
          {session?.user?.role === "admin" && (
            <a className="a" onClick={() => router.push("/admin")}>Panel Admin</a>
          )}
          <a className="a" onClick={() => router.push("/gestion")}>Gestión</a>

          <div className="profile-menu">
            <div className="avatar">
              <User size={38} />
            </div>
            <div className="dropdown">
              <button onClick={() => router.push("/perfil")}>Ver perfil</button>
              <button onClick={() => signOut()}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
