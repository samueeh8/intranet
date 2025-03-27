import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Verificar que el email existe en Trabajadores
    const trabajador = await prisma.trabajadores.findUnique({
      where: { email }
    });

    if (!trabajador) {
      return NextResponse.json(
        { message: "No estás registrado como trabajador en la empresa." },
        { status: 400 }
      );
    }

    // 2. Verificar que no existe ya en la tabla Usuario
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo. Intenta recuperar tu contraseña." },
        { status: 400 }
      );
    }

    // 3. Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Crear el usuario
    await prisma.usuario.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: "trabajador"
      }
    });

    return NextResponse.json({ 
      message: "Usuario registrado correctamente" 
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error al procesar el registro" },
      { status: 500 }
    );
  }
}