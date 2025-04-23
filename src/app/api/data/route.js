
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



// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { checkPermission } from "@/lib/check-permissions";
// import { campoPrisma } from "@/lib/prisma-mapper";

// const prisma = new PrismaClient();

// export async function GET(req) {
//   const session = await getServerSession(authOptions);
//   const role = session?.user?.role;

//   if (!session) {
//     return NextResponse.json({ message: "No autenticado" }, { status: 401 });
//   }

//   const { searchParams } = new URL(req.url);
//   const table = searchParams.get("table");
//   const field = searchParams.get("field"); // campo de ordenación, ej: numero_expediente
//   const rawPivot = searchParams.get("pivot"); // valor pivot
//   const direction = searchParams.get("direction") || "initial"; // up, down, initial
//   const limit = parseInt(searchParams.get("limit")) || 50;

//   if (!table || !field) {
//     return NextResponse.json({ message: "Parámetros incompletos" }, { status: 400 });
//   }

//   const hasPermission = checkPermission({ role, resource: table, action: "read" });
//   if (!hasPermission) {
//     return NextResponse.json({ message: "No autorizado" }, { status: 403 });
//   }

//   const allowedTables = Object.keys(campoPrisma);
//   if (!allowedTables.includes(table)) {
//     return NextResponse.json({ message: "Tabla no permitida" }, { status: 400 });
//   }

//   const prismaField = campoPrisma[table]?.[field];
//   if (!prismaField) {
//     return NextResponse.json({ message: "Campo no permitido" }, { status: 400 });
//   }
  
//   const fieldName = prismaField.campo;
//   const fieldType = prismaField.tipo;
  
//   let pivot;
//   if (fieldType === "int") {
//     pivot = parseInt(rawPivot, 10);
//     if (isNaN(pivot)) {
//       return NextResponse.json({ message: "Valor pivot no válido para campo numérico" }, { status: 400 });
//     }
//   } else {
//     pivot = rawPivot?.trim();
//     if (!pivot) {
//       return NextResponse.json({ message: "Valor pivot no válido para campo texto" }, { status: 400 });
//     }
//   }

  
//   let data = [];

//   try {
//     if (direction === "initial") {
//       const anteriores = await prisma[table].findMany({
//         where: { [fieldName]: { lt: pivot } },
//         orderBy: { [fieldName]: "desc" },
//         take: Math.floor(limit / 2),
//       });
  
//       const siguientes = await prisma[table].findMany({
//         where: { [fieldName]: { gte: pivot } },
//         orderBy: { [fieldName]: "asc" },
//         take: Math.ceil(limit / 2),
//       });
  
//       data = [...anteriores.reverse(), ...siguientes];
  
//     } else if (direction === "up") {
//       const anteriores = await prisma[table].findMany({
//         where: { [fieldName]: { lt: pivot } },
//         orderBy: { [fieldName]: "desc" },
//         take: limit,
//       });
//       data = anteriores.reverse();
  
//     } else if (direction === "down") {
//       data = await prisma[table].findMany({
//         where: { [fieldName]: { gt: pivot } },
//         orderBy: { [fieldName]: "asc" },
//         take: limit,
//       });
//     }

//     console.log("Registros devueltos:", data);

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error al consultar tabla:", error);
//     return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
//   }
// }
