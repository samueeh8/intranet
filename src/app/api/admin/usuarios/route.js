import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { checkPermission } from "@/lib/check-permissions";

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  const hasPermission = checkPermission({
    role,
    resource: "usuarios",
    action: "read",
  });

  if (!hasPermission) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  try {
    const usuarios = await prisma.usuario.findMany({
        include: {
          Roles: true,
          Trabajadores: {
            select: {
              Nombre: true,
              Apellidos: true,
            }
          },
        },
      });
      

    const response = usuarios
    .filter((u) => u.Roles?.nombre !== 'admin') 
    .map((u) => ({
    email: u.email,
    nombre: u.Trabajadores? `${u.Trabajadores.Nombre} ${u.Trabajadores.Apellidos}`.trim() : 'Sin nombre',
    rol: u.Roles?.nombre || 'sin-rol',
  }));


    return NextResponse.json(response);
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
