"use client";

import { useEffect, useRef, useState } from "react";
import { formatLabels } from "@/lib/table-filters";
import { showedFields } from "@/lib/showed-fields";
import { campoPrisma } from "@/lib/prisma-mapper";
import CustomDatePicker from "@/components/DatePicker/CustomDatePicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [multiFilters, setMultiFilters] = useState([{ campo: "", valor: "" }]);
  const [nuevoRegistro, setNuevoRegistro] = useState({});
  const [rangosFechas, setRangosFechas] = useState({});

  const headRef = useRef(null);
  const firstRowRef = useRef(null);

  const camposFechaForzados = ["Fecha_Visado", "Fecha_Inicio"];
  const containerRef = useRef(null);
  const limit = 50;

  useEffect(() => {
    const syncColumnWidths = () => {
      if (!headRef.current || !firstRowRef.current) return;
  
      const headCells = headRef.current.querySelectorAll("th");
      const bodyCells = firstRowRef.current.querySelectorAll("td");
  
      if (headCells.length !== bodyCells.length) return;
  
      bodyCells.forEach((cell, index) => {
        const width = cell.getBoundingClientRect().width + "px";
        headCells[index].style.width = width;
      });
    };
  
    // Ejecutar tras render
    syncColumnWidths();
  
    // Re-sincronizar en resize
    window.addEventListener("resize", syncColumnWidths);
    return () => window.removeEventListener("resize", syncColumnWidths);
  }, [data, tableName]);  
  

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

  const handleConsultar = () => {
    const filtrosValidos = {};
    multiFilters.forEach(({ campo, valor }) => {
      if (campo && valor) filtrosValidos[campo] = valor.trim();
    });

    setFilters(filtrosValidos);
    setOffset(0);
    setData([]);
    setTimeout(() => fetchData(0, filtrosValidos), 0);
  };

  const handleChangeCampo = (index, value) => {
    const newFilters = [...multiFilters];
    newFilters[index].campo = value;
    setMultiFilters(newFilters);
  };

  const handleChangeValor = (index, value) => {
    const newFilters = [...multiFilters];
    newFilters[index].valor = value;
    setMultiFilters(newFilters);
  };

  const handleAddFiltro = () => {
    setMultiFilters([...multiFilters, { campo: "", valor: "" }]);
  };

  const handleRemoveFiltro = (index) => {
    const newFilters = [...multiFilters];
    newFilters.splice(index, 1);
    setMultiFilters(newFilters);
  };


  const handleCrearRegistro = async () => {
    if (!tableName) return;
  
    try {
      const datosConvertidos = { ...nuevoRegistro };
  
      const camposInt = ["N__Cliente", "id_cliente", "columna", "valda", "pasillo", "NumeroCliente", "NumeroRegistro", "Grupo"];
      const camposFloat = ["numero_viviendas"];
      const camposFecha = ["Fecha", "Fecha_Visado", "Fecha_Inicio"];
      const camposExcluir = ["id", "NumeroRegistro", "id_carta", "id_cliente"];

      for (const campo of camposExcluir) {
        delete datosConvertidos[campo];
      }
  
      for (const campo of camposInt) {
        if (datosConvertidos[campo] !== undefined && datosConvertidos[campo] !== "") {
          datosConvertidos[campo] = parseInt(datosConvertidos[campo], 10);
        }
      }
  
      for (const campo of camposFloat) {
        if (datosConvertidos[campo] !== undefined && datosConvertidos[campo] !== "") {
          datosConvertidos[campo] = parseFloat(datosConvertidos[campo]);
        }
      }

      for (const campo of camposFecha) {
        if (datosConvertidos[campo]) {
          datosConvertidos[campo] = new Date(datosConvertidos[campo]).toISOString();
        }
      }

      const res = await fetch(`/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table: tableName, data: datosConvertidos }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert("✅ Registro creado correctamente");
        setNuevoRegistro({});
      } else {
        alert(`❌ Error: ${result.message || "No se pudo crear el registro."}`);
      }
    } catch (error) {
      console.error("Error al crear registro:", error);
      alert("Error al enviar los datos al servidor.");
    }
  };
  
  

  const puedeConsultar = action && tableName;

  const obtenerCamposEditables = (tabla) => {
    const campos = campoPrisma[tabla] || {};
    return Object.entries(campos).filter(([nombre, config]) => {
      const esID = /^id_/.test(nombre.toLowerCase()) || nombre.toLowerCase().endsWith("_id");
      const esRelacion = config.tipo === "rel";
      return !esID && !esRelacion;
    });
  };

  const obtenerLabelBonito = (tabla, campo) => {
    const lista = formatLabels[tabla] || [];
    const item = lista.find((f) => f.name === campo);
    return item?.label || campo;
  };
  


  return (
    <div className="gestion-container">
      <h1 className="gestion-title">Gestión de datos</h1>

      <div className="gestion-filtros">
        <label>Acción :</label>
        <select  value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">Selecciona una acción</option>
          <option value="consultar">Consultar</option>
          <option value="crear">Nuevo registro</option>
        </select>
      </div>

      <div className="gestion-filtros">
        <label>Tabla :</label>
        <select  value={tableName} onChange={(e) => setTableName(e.target.value)}>
          <option value="">Selecciona una tabla</option>
          {availableTables.map((table) => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      {action === "consultar" && tableName && (
        <>
          {multiFilters.map((filtro, index) => (
            <div className="gestion-filtros" key={index}>
              <label>{`Filtro ${index + 1}:`}</label>

              <select
                
                value={filtro.campo}
                onChange={(e) => handleChangeCampo(index, e.target.value)}
              >
                <option value="">Selecciona un campo</option>
                {(showedFields[tableName] || []).map(({ campo, label }) => (
                  <option key={campo} value={campo}>
                    {label}
                  </option>
                ))}

              </select>

              {campoPrisma[tableName]?.[filtro.campo]?.tipo === "date" ? (
                <CustomDatePicker
                selected={rangosFechas[index]?.[0] || null}
                onChange={(fechaSeleccionada) => {
                  let actualizados = [...multiFilters];
              
                  if (!Array.isArray(fechaSeleccionada)) {
                    setRangosFechas({ ...rangosFechas, [index]: [fechaSeleccionada] });
                    actualizados[index].valor = JSON.stringify([fechaSeleccionada]);
                  } else {
                    setRangosFechas({ ...rangosFechas, [index]: fechaSeleccionada });
                    actualizados[index].valor = JSON.stringify(fechaSeleccionada);
                  }
              
                  setMultiFilters(actualizados);
                }}
                startDate={rangosFechas[index]?.[0] || null}
                endDate={rangosFechas[index]?.[1] || null}
                selectsRange={true}
              />
              
              ) : (
                <input
                  type="text"
                  placeholder="valor"
                  
                  value={filtro.valor}
                  onChange={(e) => handleChangeValor(index, e.target.value)}
                />
              )}

              {multiFilters.length > 1 && (
                <button
                  type="button"
                  className="gestion-btn-small"
                  onClick={() => handleRemoveFiltro(index)}
                >
                  -
                </button>
              )}
            </div>
          ))}

          <div className="gestion-filtros">
            <button
              type="button"
              className="gestion-btn-small gestion-btn-add"
              onClick={handleAddFiltro}
            >
              +
            </button>
          </div>
        </>
      )}

      {action === "crear" && tableName && (
        <div className="crear-registro-wrapper">
          <h3>Nuevo registro</h3>

          <div className="campos-container">
          {obtenerCamposEditables(tableName).map(([key, { campo }]) => (
            <div key={key} className="campo-item">
              <label>{obtenerLabelBonito(tableName, campo)}</label>

              {campoPrisma[tableName]?.[campo]?.tipo === "date"  || camposFechaForzados.includes(campo) ? (
                <CustomDatePicker
                  selected={nuevoRegistro[campo] ? new Date(nuevoRegistro[campo]) : null}
                  onChange={(fechaSeleccionada) =>
                    setNuevoRegistro((prev) => ({
                      ...prev,
                      [campo]: fechaSeleccionada,
                    }))
                  }
                />
                ) : (
                <input
                  type="text"
                  value={nuevoRegistro[campo] || ""}
                  onChange={(e) =>
                    setNuevoRegistro({ ...nuevoRegistro, [campo]: e.target.value })
                  }
                />
              )}
            </div>
          ))}

          </div>

          <button className="gestion-btn" onClick={handleCrearRegistro}>
            Guardar registro
          </button>
        </div>
      )}

      {action === "consultar" && (
        <button
          className="gestion-btn"
          onClick={handleConsultar}
          disabled={!puedeConsultar}
        >
          Consultar
        </button>
      )}


      {data.length > 0 && (
        <div className="gestion-scroll-wrapper">
          {/* Cabecera fija */}
          <table className="users-table users-table-head">
            <thead ref={headRef}>
              <tr>
                {showedFields[tableName]?.map(({ label }) => (
                  <th key={label}>
                    <div className="cell-content cell-header">{label}</div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>

          {/* Cuerpo scrolleable */}
          <div className="gestion-table-body-container" ref={containerRef}>
            <table className="users-table users-table-body">
              <tbody>
                {data.map((row, index) => (
                  <tr key={`row-${index}`} ref={index === 0 ? firstRowRef : null}>
                    {showedFields[tableName]?.map(({ campo }) => (
                      <td key={campo}>
                        <div className="cell-content">
                          {campoPrisma[tableName]?.[campo]?.tipo === "date" || camposFechaForzados.includes(campo)
                            ? new Date(row[campo]).toLocaleDateString("es-ES")
                            : String(row[campo] ?? "")}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="loading-msg">Cargando más...</p>}
          </div>
        </div>
      )}
    </div>
  );
}
