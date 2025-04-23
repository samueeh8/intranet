
"use client";

import { useEffect, useRef, useState } from "react";
import { filtrosDisponiblesPorTabla } from "@/lib/table-filters";
import { showedFields } from "@/lib/showed-fields";
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
  
    const nuevoFiltro = (selectedField && valor) ? { [selectedField]: valor } : {};
  
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

      <div className="gestion-filtros">
        <label>Acción :</label>
        <select className="gestion-input" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">Selecciona una acción</option>
          <option value="consultar">Consultar</option>
          <option value="crear">Nuevo registro</option>
        </select>
      </div>

      <div className="gestion-filtros">
        <label>Tabla :</label>
        <select className="gestion-input" value={tableName} onChange={(e) => setTableName(e.target.value)}>
          <option value="">Selecciona una tabla</option>
          {availableTables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      {action === "consultar" && tableName && (
        <div className="gestion-filtros">
            <label>Filtros :</label>
            <select
            className="gestion-input"
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
                className="gestion-input"
                ref={inputRef}
                type="text"
                placeholder={`${
                  (filtrosDisponiblesPorTabla[tableName] || []).find(c => c.name === selectedField)?.label || selectedField
                }`}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
            />
            )}
        </div>
        )}
        <button
          className="gestion-btn"
          onClick={() => {
              handleConsultar();
            }}
          >
          Consultar
        </button>



      <div className="gestion-scroll-wrapper" ref={containerRef}>
        {data.length > 0 && (
          <table className="users-table">
            <thead>
              <tr>
                {showedFields[tableName]?.map(({ label }, i) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={`row-${index}`}>
                  {showedFields[tableName]?.map(({ campo }) => (
                    <td key={campo}>
                      {typeof row[campo] === "object" && row[campo] !== null
                        ? JSON.stringify(row[campo])
                        : String(row[campo] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {loading && <p className="loading-msg">Cargando más...</p>}
      </div>
      {data.length > 0 && <div className="table-end" />}
    </div>
  );
}
