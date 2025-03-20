// import NextAuth from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
// import { PrismaClient } from "@prisma/client";
// import { unstable_update } from "next-auth/react";

// const prisma = new PrismaClient();

// async function refreshSession() {
//     const event = new Event("visibilitychange");
//     document.dispatchEvent(event);
//   }
  

// export const authOptions = {
//   providers: [
//     AzureADProvider({
//       clientId: process.env.AZURE_AD_CLIENT_ID,
//       clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
//       tenantId: process.env.AZURE_AD_TENANT_ID,
//     }),
//   ],
//   callbacks: {
//     async session({ session }) {
//       if (session.user.email) {
//         // Buscar si el usuario ya existe en la tabla Usuario
//         let usuario = await prisma.usuario.findUnique({
//           where: { email: session.user.email },
//           include: { Trabajadores: true },
//         });

//         // Si el usuario no existe, buscar al trabajador en la tabla Trabajadores
//         if (!usuario) {
//           let trabajador = await prisma.trabajadores.findUnique({
//             where: { email: session.user.email },
//           });

//           if (!trabajador) {
//             // Si el trabajador no existe, denegar el login
//             throw new Error("No estás registrado como trabajador en la empresa.");
//           }

//           // Si el trabajador existe, crear el usuario y enlazarlo
//           usuario = await prisma.usuario.create({
//             data: {
//               email: session.user.email,
//               role: "trabajador",
//             },
//           });

//           await refreshSession();

//         }

//         // Agregar datos a la sesión
//         session.user.role = usuario.role;
//         session.user.nombre = usuario.Trabajadores?.Nombre || "Sin nombre";
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };












// import NextAuth from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const authOptions = {
//   providers: [
//     AzureADProvider({
//       clientId: process.env.AZURE_AD_CLIENT_ID,
//       clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
//       tenantId: process.env.AZURE_AD_TENANT_ID,
//     }),
//   ],
//   callbacks: {
//     async session({ session }) {
//       if (session.user.email) {
//         // 🔹 Buscar si el usuario YA existe en la tabla Usuario
//         let dbUser = await prisma.usuario.findUnique({
//           where: { email: session.user.email },
//           include: { Trabajadores: true }, // Relación con la tabla Trabajadores
//         });

//         // 🔹 Si NO existe en Usuarios, verificamos si está en Trabajadores
//         if (!dbUser) {
//           const trabajador = await prisma.trabajadores.findUnique({
//             where: { email: session.user.email },
//           });

//           // 🔹 Si el trabajador existe, creamos su usuario
//           if (trabajador) {
//             dbUser = await prisma.usuario.create({
//               data: {
//                 email: session.user.email,
//                 role: "trabajador",
//                 Trabajadores: {
//                   connect: { email: trabajador.email }, // Relacionar con el trabajador
//                 },
//               },
//               include: { Trabajadores: true },
//             });
//           } else {
//             // 🚫 Si no existe en Trabajadores, negar el acceso
//             return null;
//           }
//         }

//         // 🔹 Asegurar que la sesión tenga el nombre del trabajador
//         session.user.role = dbUser.role;
//         session.user.nombre = dbUser.Trabajadores?.Nombre || "Sin nombre";
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };















import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user.email) {
        // Buscar si el usuario ya existe en la tabla Usuario
        let usuario = await prisma.usuario.findUnique({
          where: { email: session.user.email },
          include: { Trabajadores: true },
        });

        // Si el usuario no existe, buscar al trabajador en la tabla Trabajadores
        if (!usuario) {
          let trabajador = await prisma.trabajadores.findUnique({
            where: { email: session.user.email },
          });

          if (!trabajador) {
            // Si el trabajador no existe, denegar el login
            throw new Error("No estás registrado como trabajador en la empresa.");
          }

          // Si el trabajador existe, crear el usuario y enlazarlo correctamente
          usuario = await prisma.usuario.create({
            data: {
              email: session.user.email,
              role: "trabajador",
            },
            include: { Trabajadores: true },
          });
        }

        // Agregar datos a la sesión
        session.user.role = usuario.role;
        session.user.nombre = usuario.Trabajadores?.Nombre || "Sin nombre";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
