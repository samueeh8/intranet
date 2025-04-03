'use client';

import { useState, useEffect } from 'react';
import './admin-page.css';

export default function ClientAdminPage({ session }) {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/admin/usuarios');
      if (!res.ok) {
        console.error("Error al obtener usuarios:", res.status);
        setUsuarios([]);
        return;
      }
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setUsuarios([]);
    }
  };

  return (
    <div className="admin-container">
      <h1 className='admin-title'>Panel de Administración</h1>
      <h3 style={{margin: '1rem'}}>Lista de usuarios</h3>

      <label htmlFor="filtroRol" className="filtro-label">Filtrar por rol:</label>
      <select
        id="filtroRol"
        value={filtroRol}
        onChange={(e) => setFiltroRol(e.target.value)}
        className="filtro-select"
      >
        <option value="">Todos</option>
        <option value="trabajador">Trabajador</option>
        <option value="asociado">Asociado</option>
        <option value="secretaria">Secretaria</option>
        <option value="administracion">Administración</option>
      </select>

      <table className='users-table'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(usuarios) &&
            usuarios
              .filter((u) => !filtroRol || u.rol === filtroRol)
              .map((usuario) => (
                <tr key={usuario.email}>
                  <td>{usuario.email}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.rol}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
