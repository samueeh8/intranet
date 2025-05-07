"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./welcome-page.css";

export default function ClientWelcomePage({ session }) {
    const router = useRouter();
  
  return (
    <div>
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
