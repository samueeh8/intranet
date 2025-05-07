
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkPermission } from "@/lib/check-permissions";
import { campoPrisma } from "@/lib/prisma-mapper";

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const limit = parseInt(searchParams.get("limit")) || 50;
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!table) {
    return NextResponse.json({ message: "Falta el parámetro 'table'" }, { status: 400 });
  }

  const hasPermission = checkPermission({ role, resource: table, action: "read" });
  if (!hasPermission) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const allowedTables = ["proyectos", "cartas", "clientes"];
  if (!allowedTables.includes(table)) {
    return NextResponse.json({ message: "Tabla no permitida" }, { status: 400 });
  }

  try {
    const mapCampos = campoPrisma[table] || {};
    const where = {};

for (const [key, value] of searchParams.entries()) {
  if (["table", "limit", "offset"].includes(key) || !value) continue;

  const campoInfo = campoPrisma[table]?.[key];
  if (!campoInfo) continue;

  const { campo, tipo } = campoInfo;

  if (tipo === "int") {
    where[campo] = { equals: parseInt(value, 10) };

  } else if (tipo === "date") {
    try {
      const [inicio, fin] = JSON.parse(value || "[]");
  
      if (inicio && !fin) {
        const fecha = new Date(inicio);
        where[campo] = {
          gte: new Date(fecha.setHours(0, 0, 0, 0)),
          lte: new Date(fecha.setHours(23, 59, 59, 999)),
        };
      }
  
      if (inicio && fin) {
        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(fin);
        where[campo] = {
          gte: fechaInicio,
          lte: fechaFin,
        };
      }
    } catch (error) {
      console.warn("Filtro de fecha malformado:", value);
    }
  } else {
    where[campo] = { contains: value };
  }
}


  const campoOrden =
    Object.values(mapCampos).find((campo) => campo.tipo === "int")?.campo ||
    Object.values(mapCampos)[0]?.campo;

  const data = await prisma[table].findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: {
      [campoOrden]: "asc",
    },
  });

  
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al consultar tabla:", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
  
}


export async function POST(req) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const { table, data } = await req.json();

  if (!checkPermission({ role, resource: table, action: "create" })) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const allowedTables = ["proyectos", "cartas", "clientes"];

  if (!allowedTables.includes(table)) {
    return NextResponse.json({ message: "Tabla no permitida" }, { status: 400 });
  }

  try {
    const creado = await prisma[table].create({ data });
    return NextResponse.json(creado);
  } catch (error) {
    console.error("Error al crear registro:", error);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}


