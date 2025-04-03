export const campoPrisma = {
    proyectos: {
      numero_expediente:    { campo: "Numero_Expediente", tipo: "string" },
      promotor:             { campo: "Promotor", tipo: "string" },
      proyecto:             { campo: "Proyecto", tipo: "string" },
      fecha_inicio:         { campo: "Fecha_Inicio", tipo: "string" },
    },
    cartas: {
      numero_expediente:    { campo: "NumeroExpediente", tipo: "string" },
      asunto:               { campo: "Asunto", tipo: "string" },
      destinatario:         { campo: "Destinatario", tipo: "string" },
      empresa:              { campo: "Empresa", tipo: "string" },
      numero_registro:      { campo: "NumeroRegistro", tipo: "int" },
    },
    clientes: {
      nombre:       { campo: "Nombre", tipo: "string" },
      id_cliente:   { campo: "id_cliente", tipo: "int" },
      proyectos:    { campo: "proyectos", tipo: "rel" }, 
    }
  };
  