import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);

  // Verificar que el usuario esté logueado y tenga rol administrador
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
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
      

    // Limpiar y estructurar la respuesta
    const response = usuarios
    .filter((u) => u.Roles?.nombre !== 'admin') // 👈 aquí filtramos
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
