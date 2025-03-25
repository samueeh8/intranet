import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"; // npm install nodemailer

const prisma = new PrismaClient();

// Configuración de transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER, // smtp.gmail.com
  port: parseInt(process.env.EMAIL_PORT || '465'), // 465
  secure: process.env.EMAIL_SECURE === 'true', // true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verificación SMTP (opcional)
transporter.verify((error, success) => {
  if (error) {
    console.log("Error de verificación SMTP:", error);
  } else {
    console.log("Servidor SMTP listo para enviar emails");
  }
});

// Simulación de almacenamiento temporal (debería ir en BBDD en producción)
const resetCodes = {};

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, step, code, newPassword } = data;
    
    // Paso 1: Solicitud de recuperación
    if (step === 1) {
      // Verificar que el correo existe
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });
      
      if (!usuario) {
        return NextResponse.json(
          { message: "No existe ninguna cuenta con este correo" },
          { status: 404 }
        );
      }
      
      // Generar código aleatorio
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Guardar código (en producción usar base de datos con expiración)
      resetCodes[email] = {
        code: resetCode,
        expires: Date.now() + 15 * 60 * 1000 // 15 minutos
      };
      
      // Enviar correo con código
      await transporter.sendMail({
        from: `"Intranet" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperación de contraseña",
        text: `Tu código de recuperación es: ${resetCode}`,
        html: `<p>Tu código de recuperación es: <strong>${resetCode}</strong></p>`,
      });
      
      return NextResponse.json({ 
        message: "Código enviado correctamente" 
      });
    }
    
    // Paso 2: Verificación de código
    else if (step === 2) {
      const resetData = resetCodes[email];
      
      if (!resetData) {
        return NextResponse.json(
          { message: "Solicita un nuevo código de recuperación" },
          { status: 400 }
        );
      }
      
      if (Date.now() > resetData.expires) {
        delete resetCodes[email];
        return NextResponse.json(
          { message: "El código ha expirado. Solicita uno nuevo" },
          { status: 400 }
        );
      }
      
      if (resetData.code !== code) {
        return NextResponse.json(
          { message: "Código incorrecto" },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ 
        message: "Código verificado correctamente" 
      });
    }
    
    // Paso 3: Cambio de contraseña
    else if (step === 3) {
      const resetData = resetCodes[email];
      
      if (!resetData || Date.now() > resetData.expires || resetData.code !== code) {
        return NextResponse.json(
          { message: "Sesión inválida o expirada. Inicia el proceso de nuevo" },
          { status: 400 }
        );
      }
      
      // Cambiar contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await prisma.usuario.update({
        where: { email },
        data: { password_hash: hashedPassword }
      });
      
      // Eliminar código usado
      delete resetCodes[email];
      
      return NextResponse.json({ 
        message: "Contraseña actualizada correctamente" 
      });
    }
    
    return NextResponse.json(
      { message: "Solicitud inválida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}