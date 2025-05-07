// SOLUCION CON PASSWORD


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inicialización de Prisma
const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 1. Buscar el usuario en la tabla Usuario
          const usuario = await prisma.usuario.findUnique({
            where: { email: credentials.email },
            include: { Trabajadores: true, Roles: true }
          });

          // 2. Si no existe, rechazar
          if (!usuario) {
            throw new Error("No hay ninguna cuenta con este correo. Regístrate primero.");
          }

          // 3. Verificar la contraseña
          const passwordValid = await bcrypt.compare(
            credentials.password, 
            usuario.password_hash
          );

          if (!passwordValid) {
            throw new Error("Contraseña incorrecta");
          }

          // 4. Devolver los datos del usuario para la sesión
          return {
            id: usuario.Trabajadores?.id_trabajador.toString() || "0",
            email: usuario.email,
            nombre: usuario.Trabajadores?.Nombre || "Sin nombre",
            role: usuario.Roles?.nombre || "sin-rol"
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          throw new Error(error.message || "Error durante el inicio de sesión");
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nombre = user.nombre;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.nombre = token.nombre;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "un-secreto-seguro-para-firmar-tokens",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

