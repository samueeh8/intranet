
"use client";

import { useEffect, useRef, useState } from "react";
import { filtrosDisponiblesPorTabla } from "@/lib/table-filters";
import "./gestion.css";

export default function GestionPage() {
  const [tableName, setTableName] = useState("");
  const [action, setAction] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [selectedValue, setSelectedValue] = useState("");


  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const limit = 50;

  useEffect(() => {
    setAvailableTables(["proyectos", "cartas", "clientes"]);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const bottomReached =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

      if (bottomReached && !loading && hasMore) {
        fetchData(offset + limit);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, offset]);
  
  const handleConsultar = () => {
    const valor = inputRef.current?.value?.trim();
    if (!selectedField || !valor) return;
  
    const nuevoFiltro = { [selectedField]: valor };
  
    setFilters(nuevoFiltro);
    setOffset(0);
    setData([]);

    setTimeout(() => {
      fetchData(0, nuevoFiltro);
    }, 0);
  };
  

  const fetchData = async (start, filtroActual = filters) => {
    if (!tableName) return;
  
    setLoading(true);
    const params = new URLSearchParams({ table: tableName, limit, offset: start });
  
    Object.entries(filtroActual).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
  
    const res = await fetch(`/api/data?${params.toString()}`);
    const json = await res.json();
  
    if (Array.isArray(json)) {
      setData((prev) => [...prev, ...json]);
      setOffset(start);
      setHasMore(json.length === limit);
    } else {
      setHasMore(false);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="gestion-container">
      <h1 className="gestion-title">Gestión de datos</h1>

      <div className="gestion-select-group">
        <label>Acción:</label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">Selecciona una acción</option>
          <option value="consultar">Consultar</option>
          <option value="crear">Crear nuevo registro</option>
        </select>
      </div>

      <div className="gestion-select-group">
        <label>Tabla:</label>
        <select value={tableName} onChange={(e) => setTableName(e.target.value)}>
          <option value="">Selecciona una tabla</option>
          {availableTables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      {action === "consultar" && tableName && (
        <div className="gestion-filtros">
            <h4>Filtros:</h4>

            <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            >
            <option value="">Selecciona un campo</option>
            {(filtrosDisponiblesPorTabla[tableName] || []).map((campo) => (
                <option key={campo.name} value={campo.name}>
                {campo.label}
                </option>
            ))}
            </select>

            {selectedField && (
            <input
                ref={inputRef}
                type="text"
                placeholder={`Valor para ${selectedField}`}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
            />
            )}

            <button
            className="gestion-btn"
            onClick={() => {
                setFilters({ [selectedField]: inputRef.current?.value });
                handleConsultar();
              }}
              disabled={!selectedField || !selectedValue}
            >
            Consultar
            </button>
        </div>
        )}



      <div className="gestion-scroll-wrapper" ref={containerRef}>
        {data.length > 0 && (
          <table className="modern-table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row?.NumeroRegistro || `${index}-${Math.random()}`}>
                  {Object.entries(row).map(([key, val]) => (
                    <td key={key}>{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {loading && <p className="loading-msg">Cargando más...</p>}
      </div>
    </div>
  );
}

