import { useMemo, useState } from "react";

export default function TablaFotia({
  filas = [],
  docentes = [],
  onCambiarEstado,
  onCambiarFecha,
  onCambiarDocente,
  onQuitarDeFotia,
}) {
  const [estudiantesAbiertos, setEstudiantesAbiertos] = useState({});
  const [previasEnEdicion, setPreviasEnEdicion] = useState({});

  const formatearDni = (dni) => {
    const limpio = String(dni || "").replace(/\D/g, "");

    if (!limpio) return "—";

    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const estudiantesAgrupados = useMemo(() => {
    const grupos = new Map();

    filas.forEach((fila) => {
      const clave = fila.alumnoId || fila.dni || fila.estudiante;

      if (!grupos.has(clave)) {
        grupos.set(clave, {
          id: clave,
          estudiante: fila.estudiante,
          cursoActual: fila.cursoActual,
          turno: fila.turno,
          dni: fila.dni,
          previas: [],
        });
      }

      grupos.get(clave).previas.push(fila);
    });

    return Array.from(grupos.values());
  }, [filas]);

  const alternarEstudiante = (estudianteId) => {
    setEstudiantesAbiertos((estadoAnterior) => ({
      ...estadoAnterior,
      [estudianteId]: !estadoAnterior[estudianteId],
    }));
  };

  const alternarEdicion = (filaId) => {
    setPreviasEnEdicion((estadoAnterior) => ({
      ...estadoAnterior,
      [filaId]: !estadoAnterior[filaId],
    }));
  };

  if (!estudiantesAgrupados.length) {
    return (
      <div
        style={{
          marginTop: "24px",
          padding: "28px",
          border: "2px dashed #c8dbea",
          borderRadius: "14px",
          background: "#ffffff",
          textAlign: "center",
          color: "#657585",
        }}
      >
        No se encontraron estudiantes con asignaturas pendientes.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "26px", width: "100%", minWidth: 0 }}>
      <div
        style={{
          marginBottom: "14px",
          color: "#5f6f7f",
          fontSize: "14px",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Mostrando {estudiantesAgrupados.length} estudiante
        {estudiantesAgrupados.length === 1 ? "" : "s"} y {filas.length} previa
        {filas.length === 1 ? "" : "s"}.
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {estudiantesAgrupados.map((estudiante) => {
          const abierto = Boolean(estudiantesAbiertos[estudiante.id]);
          const aprobadas = estudiante.previas.filter(
            (previa) => previa.estado === "Aprobada",
          ).length;

          return (
            <section
              key={estudiante.id}
              style={{
                border: abierto
                  ? "2px solid #79a9d5"
                  : "1px solid #c8dbea",
                borderRadius: "15px",
                background: "#ffffff",
                boxShadow: abierto
                  ? "0 6px 18px rgba(41, 78, 112, 0.12)"
                  : "0 3px 10px rgba(41, 78, 112, 0.06)",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => alternarEstudiante(estudiante.id)}
                aria-expanded={abierto}
                style={{
                  width: "100%",
                  border: "none",
                  background: abierto ? "#eef6fc" : "#ffffff",
                  padding: "16px 18px",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(220px, 1.5fr) minmax(90px, .55fr) minmax(130px, .7fr) minmax(110px, .55fr) auto",
                  gap: "16px",
                  alignItems: "center",
                  textAlign: "left",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#173a63",
                      fontWeight: "800",
                      fontSize: "16px",
                      lineHeight: 1.35,
                    }}
                  >
                    👤 {estudiante.estudiante || "Estudiante sin nombre"}
                  </div>

                  {estudiante.turno && (
                    <div
                      style={{
                        marginTop: "4px",
                        color: "#708090",
                        fontSize: "12px",
                      }}
                    >
                      Turno {estudiante.turno}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    color: "#4b6075",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  {estudiante.cursoActual || "—"}
                </div>

                <div
                  style={{
                    color: "#4b6075",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatearDni(estudiante.dni)}
                </div>

                <div
                  style={{
                    justifySelf: "center",
                    padding: "7px 11px",
                    borderRadius: "999px",
                    background: "#edf5fb",
                    color: "#315f86",
                    fontWeight: "800",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {estudiante.previas.length} previa
                  {estudiante.previas.length === 1 ? "" : "s"}
                </div>

                <div
                  style={{
                    color: "#23628e",
                    fontWeight: "800",
                    whiteSpace: "nowrap",
                    justifySelf: "end",
                  }}
                >
                  {abierto ? "▲ Ocultar" : "▼ Ver asignaturas"}
                </div>
              </button>

              {abierto && (
                <div
                  style={{
                    padding: "0 16px 16px",
                    background: "#f8fbfd",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 4px 12px",
                      color: "#607080",
                      fontSize: "13px",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {aprobadas} aprobada{aprobadas === 1 ? "" : "s"} de{" "}
                    {estudiante.previas.length}
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {estudiante.previas.map((fila) => {
                      const aprobada = fila.estado === "Aprobada";
                      const editando = Boolean(previasEnEdicion[fila.id]);

                      return (
                        <article
                          key={fila.id}
                          style={{
                            border: aprobada
                              ? "1px solid #9bcfb0"
                              : "1px solid #d9e4ec",
                            borderLeft: aprobada
                              ? "5px solid #61ad7d"
                              : "5px solid #e0b34f",
                            borderRadius: "12px",
                            padding: "14px",
                            background: "#ffffff",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "minmax(170px, 1.1fr) minmax(70px, .35fr) minmax(125px, .65fr) minmax(150px, .8fr) minmax(190px, 1fr)",
                              gap: "12px",
                              alignItems: "end",
                            }}
                          >
                            <div>
                              <span style={etiquetaStyle}>Asignatura</span>
                              <strong
                                style={{
                                  display: "block",
                                  color: "#23436d",
                                  fontSize: "15px",
                                  lineHeight: 1.4,
                                }}
                              >
                                {fila.asignatura || "—"}
                              </strong>
                            </div>

                            <div>
                              <span style={etiquetaStyle}>Año</span>
                              <div style={valorStyle}>{fila.anio || "—"}</div>
                            </div>

                            <label>
                              <span style={etiquetaStyle}>Estado</span>
                              <select
                                value={fila.estado || "Pendiente"}
                                disabled={!editando}
                                onChange={(evento) =>
                                  onCambiarEstado?.(fila, evento.target.value)
                                }
                                style={{
                                  ...controlStyle,
                                  border: aprobada
                                    ? "1px solid #8bc6a6"
                                    : "1px solid #e0c37d",
                                  background: !editando
                                    ? "#f1f3f5"
                                    : aprobada
                                      ? "#eaf7ef"
                                      : "#fff8e6",
                                  color: aprobada ? "#25613f" : "#7a5a16",
                                  fontWeight: "800",
                                  cursor: editando ? "pointer" : "not-allowed",
                                }}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobada">Aprobada</option>
                              </select>
                            </label>

                            <label>
                              <span style={etiquetaStyle}>Fecha</span>
                              <input
                                type="date"
                                value={fila.fechaAprobacion || ""}
                                disabled={!editando || !aprobada}
                                onChange={(evento) =>
                                  onCambiarFecha?.(fila, evento.target.value)
                                }
                                style={{
                                  ...controlStyle,
                                  background:
                                    editando && aprobada ? "#ffffff" : "#f1f3f5",
                                  cursor:
                                    editando && aprobada
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                              />
                            </label>

                            <label>
                              <span style={etiquetaStyle}>
                                Docente responsable
                              </span>
                              <select
                                value={fila.docenteResponsableId || ""}
                                disabled={!editando || !aprobada}
                                onChange={(evento) =>
                                  onCambiarDocente?.(fila, evento.target.value)
                                }
                                style={{
                                  ...controlStyle,
                                  background:
                                    editando && aprobada ? "#ffffff" : "#f1f3f5",
                                  cursor:
                                    editando && aprobada
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                              >
                                <option value="">Seleccionar docente</option>

                                {docentes.map((docente) => (
                                  <option
                                    key={
                                      docente._id ||
                                      docente.id ||
                                      docente.nombre
                                    }
                                    value={
                                      docente._id ||
                                      docente.id ||
                                      docente.nombre
                                    }
                                  >
                                    {docente.nombre}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div
                            style={{
                              marginTop: "13px",
                              paddingTop: "12px",
                              borderTop: "1px solid #e2eaf0",
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => alternarEdicion(fila.id)}
                              style={{
                                padding: "9px 14px",
                                border: editando
                                  ? "1px solid #73ad91"
                                  : "1px solid #8fb5d9",
                                borderRadius: "9px",
                                background: editando ? "#eaf7ef" : "#eef6fc",
                                color: editando ? "#25613f" : "#245b84",
                                fontWeight: "800",
                                cursor: "pointer",
                              }}
                            >
                              {editando ? "💾 Finalizar edición" : "✏️ Editar"}
                            </button>

                            <button
                              type="button"
                              onClick={() => onQuitarDeFotia?.(fila)}
                              style={{
                                padding: "9px 14px",
                                border: "1px solid #d7b37a",
                                borderRadius: "9px",
                                background: "#fff8e8",
                                color: "#8a5a16",
                                fontWeight: "800",
                                cursor: "pointer",
                              }}
                            >
                              ✖ Quitar de FOTIA
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p
        style={{
          margin: "14px 0 0",
          color: "#718096",
          fontSize: "13px",
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        Presioná “Editar” para modificar el estado. La fecha y el docente se
        habilitan cuando la asignatura cambia a “Aprobada”.
      </p>
    </div>
  );
}

const etiquetaStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#6b7f92",
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const valorStyle = {
  color: "#4d5f70",
  fontWeight: "700",
  minHeight: "36px",
  display: "flex",
  alignItems: "center",
};

const controlStyle = {
  width: "100%",
  minHeight: "38px",
  padding: "8px 9px",
  borderRadius: "9px",
  border: "1px solid #b8cddd",
  color: "#334e68",
  boxSizing: "border-box",
};