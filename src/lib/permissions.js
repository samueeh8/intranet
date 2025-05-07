// src/lib/permissions.js

export const PERMISSIONS = {
    trabajador: {
      proyectos: ['read'],
    },
    asociado: {
      proyectos: ['read', 'create', 'update'],
      clientes: ['read', 'create', 'update'],
      cartas: ['read', 'create', 'update', 'delete'],
      proveedores: ['read', 'create', 'update'],
      contratos: ['read', 'create'],
    },
    secretaria: {
      proyectos: ['read'],
      clientes: ['read'],
      cartas: ['read', 'create', 'update', 'delete'],
      remitentes: ['read'],
      archivoAdministrativo: ['read'],
    },
    administracion: {
      proyectos: ['read', 'create', 'update'],
      clientes: ['read', 'create', 'update'],
      facturas: ['read', 'create', 'update'],
      contratos: ['read', 'create'],
      proveedores: ['read', 'create'],
      cartas: ['read'],
    },
    admin: {
      '*': ['*'], 
    },
  };
  