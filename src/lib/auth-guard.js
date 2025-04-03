import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * Protección de páginas server-side.
 * @param {Array<string>} allowedRoles - lista de roles que pueden acceder.
 * @returns session o redirige a /login
 */
export async function requireAuth(allowedRoles = []) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user?.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    redirect("/login");
  }

  return session;
}
