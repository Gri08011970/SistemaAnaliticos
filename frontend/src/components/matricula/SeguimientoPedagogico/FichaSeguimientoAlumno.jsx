import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  obtenerAsignaturasPorCurso,
  COLORES_SEGUIMIENTO,
} from "./seguimientoConstants";

import InformeInstitucional from "./InformeInstitucional.jsx";

import {
  analizarTrayectoria,
  PERIODOS_ANALISIS_TRAYECTORIA,
  ETIQUETAS_PERIODOS_ANALISIS,
} from "./analizadorTrayectoria";

const periodos = [
  { clave: "mayo", etiqueta: "Mayo" },
  { clave: "primerCuat", etiqueta: "1° Cuat." },
  { clave: "octubre", etiqueta: "Octubre" },
  { clave: "segundoCuat", etiqueta: "2° Cuat." },
  { clave: "diciembre", etiqueta: "Dic." },
  { clave: "febrero", etiqueta: "Feb." },
  { clave: "marzo", etiqueta: "Mar." },
  { clave: "final", etiqueta: "Final" },
];

const colorConceptual = (conceptual) => {
  return (
    COLORES_SEGUIMIENTO[conceptual]?.fondoClaro ||
    COLORES_SEGUIMIENTO["-"].fondoClaro
  );
};

export default function FichaSeguimientoAlumno({ alumnos = [] }) {
  const [busqueda, setBusqueda] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [periodoInforme, setPeriodoInforme] = useState("");

  const [seguimiento, setSeguimiento] = useState({});
  const [cargandoSeguimiento, setCargandoSeguimiento] = useState(false);
  const [errorSeguimiento, setErrorSeguimiento] = useState("");
  const [mostrarInformeCompleto, setMostrarInformeCompleto] = useState(false);

  useEffect(() => {
    async function obtenerFichaDesdeMongo() {
      if (!alumnoSeleccionado?._id) {
        setSeguimiento({});
        return;
      }

      try {
        setCargandoSeguimiento(true);
        setErrorSeguimiento("");

        const parametros = new URLSearchParams({
          alumnoId: String(alumnoSeleccionado._id),
        });

        const respuesta = await fetch(
          `/api/seguimiento?${parametros.toString()}`,
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener la ficha de seguimiento");
        }

        const registros = await respuesta.json();
        const datosConvertidos = {};

        registros.forEach((registro) => {
          const clave =
            `${registro.curso}-` +
            `${registro.asignatura}-` +
            `${registro.alumnoId}-` +
            `${registro.periodo}`;

          datosConvertidos[clave] = {
            conceptual: registro.conceptual || "-",
            nota: registro.nota || "",
            mongoId: registro._id,
          };
        });

        setSeguimiento(datosConvertidos);
      } catch (error) {
        console.error("Error al cargar la ficha desde MongoDB:", error);

        setErrorSeguimiento(
          "No se pudieron cargar los datos compartidos del estudiante.",
        );
      } finally {
        setCargandoSeguimiento(false);
      }
    }

    obtenerFichaDesdeMongo();
  }, [alumnoSeleccionado]);

  const resultados = alumnos.filter((a) => {
    const texto = `${a.apellido} ${a.nombre} ${a.dni}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  useEffect(() => {
    if (!mostrarInformeCompleto) return undefined;

    const posicionAnterior = window.scrollY;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape") {
        setMostrarInformeCompleto(false);
      }
    };

    window.addEventListener("keydown", cerrarConEscape);

    requestAnimationFrame(() => {
      const modal = document.getElementById(
        "modal-informe-institucional",
      );

      if (modal) {
        modal.scrollTop = 0;
      }
    });

    return () => {
      window.removeEventListener("keydown", cerrarConEscape);
      document.body.style.overflow = overflowAnterior;

      window.scrollTo({
        top: posicionAnterior,
        behavior: "auto",
      });
    };
  }, [mostrarInformeCompleto]);

  const asignaturas = alumnoSeleccionado
    ? obtenerAsignaturasPorCurso(alumnoSeleccionado.curso)
    : [];

  const resultadoTrayectoria =
    alumnoSeleccionado && periodoInforme
      ? analizarTrayectoria({
          alumno: alumnoSeleccionado,
          seguimiento,
          asignaturas,
          periodo: periodoInforme,
        })
      : null;

  const informeInstitucional = resultadoTrayectoria?.informe || null;

  const obtenerDato = (asignatura, periodo) => {
    const clave = `${alumnoSeleccionado.curso}-${asignatura}-${alumnoSeleccionado._id}-${periodo}`;
    return seguimiento[clave] || {};
  };

  const abrirInformeCompleto = () => {
    if (!periodoInforme) {
      window.alert(
        "Seleccioná un período para ver el informe completo.",
      );
      return;
    }

    if (!informeInstitucional) {
      window.alert(
        "Todavía no hay información suficiente para generar el informe de este período.",
      );
      return;
    }

    setMostrarInformeCompleto(true);
  };

  const imprimirFicha = () => {
    if (!periodoInforme) {
      window.alert(
        "Seleccioná un período antes de imprimir el informe.",
      );
      return;
    }

    const informe = document.getElementById("informe-institucional-imprimir");

    if (!informe) {
      console.error("No se encontró el informe institucional para imprimir.");

      return;
    }

    const ventana = window.open("", "_blank");

    if (!ventana) {
      console.error("No se pudo abrir la ventana de impresión.");

      return;
    }

    const contenido = informe.outerHTML;

    ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />

        <title>
          Informe institucional de seguimiento pedagógico
        </title>

        <style>
          @page {
            size: A4 portrait;
            margin: 14mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #222;
            background: #ffffff;
          }

          .informe-institucional {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
            background: #ffffff;
          }

          .informe-institucional h1,
          .informe-institucional h2,
          .informe-institucional h3 {
            text-align: center;
          }

          .informe-institucional__datos {
            margin: 22px 0;
          }

          .informe-institucional__dato--principal {
            margin-bottom: 14px;
            text-align: center;
          }

          .informe-institucional__datos-secundarios {
            display: grid;
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );
            gap: 14px;
          }

          .informe-institucional__dato {
            display: flex;
            flex-direction: column;
            gap: 5px;
            text-align: center;
          }

          .informe-institucional__dato-etiqueta {
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #667085;
          }

          .informe-institucional__dato-valor {
            font-size: 11pt;
            font-weight: 700;
            color: #25324a;
          }

          .informe-institucional__valoracion {
            margin: 22px 0 28px;
            padding: 16px 18px;
            border: 1px solid #d9e2e8;
            border-radius: 12px;
            background: #f7fafb;
            text-align: center;
          }

          .informe-institucional__valoracion-etiqueta {
            display: block;
            margin-bottom: 6px;
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #5f6b76;
          }

          .informe-institucional__valoracion-texto {
            margin: 0;
            font-size: 11pt;
            font-weight: 600;
            line-height: 1.5;
            color: #30465a;
          }

          .informe-institucional__sintesis-final,
          .informe-institucional__orientacion-final {
            margin-top: 26px;
          }

          .informe-institucional__sintesis-final p,
          .informe-institucional__orientacion-final p {
            margin: 0;
            font-size: 11pt;
            line-height: 1.65;
            text-align: justify;
          }

          .informe-institucional__aclaracion {
            margin-top: 40px;
            padding-top: 22px;
            border-top: 1px solid #d8e1e8;
            text-align: center;
          }

          .informe-institucional__aclaracion p {
            margin: 8px 0 0;
            font-size: 10pt;
            line-height: 1.6;
          }

          button,
          input,
          select,
          .informe-institucional__acciones,
          .informe-institucional__control-catalogo {
            display: none !important;
          }
        </style>
      </head>

      <body>
        ${contenido}
      </body>
    </html>
  `);

    ventana.document.close();

    ventana.onload = () => {
      ventana.focus();
      ventana.print();
      ventana.close();
    };
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <input
          className="buscador-ficha-seguimiento"
          type="text"
          placeholder="Buscar por apellido, nombre o DNI..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setAlumnoSeleccionado(null);
            setPeriodoInforme("");
            setMostrarInformeCompleto(false);
          }}
          style={{
            width: "420px",
            padding: "10px",
            borderRadius: "8px",
            border: "3px solid #cfd8dc",
          }}
        />

        {busqueda !== "" && !alumnoSeleccionado && (
          <div
            style={{
              maxHeight: "220px",
              overflowY: "auto",
              border: "3px solid #d8e3ea",
              borderRadius: "10px",
              marginBottom: "25px",
              marginTop: "15px",
            }}
          >
            {resultados.map((alumno) => (
              <div
                key={alumno._id || alumno.dni}
                onClick={() => {
                  setAlumnoSeleccionado(alumno);
                  setPeriodoInforme("");
                  setMostrarInformeCompleto(false);
                }}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderBottom: "2px solid #ececec",
                }}
              >
                <strong>
                  {alumno.apellido}, {alumno.nombre}
                </strong>
                <br />
                DNI: {alumno.dni} | Curso: {alumno.curso}
              </div>
            ))}
          </div>
        )}
      </div>

      {alumnoSeleccionado && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <label htmlFor="periodo-informe-institucional">
              <strong>Período del informe:</strong>
            </label>

            <select
              id="periodo-informe-institucional"
              value={periodoInforme}
              onChange={(e) => {
                setPeriodoInforme(e.target.value);
                setMostrarInformeCompleto(false);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "2px solid #cfd8dc",
                background: "white",
                fontWeight: "600",
              }}
            >
              <option value="">Seleccionar período</option>

              {PERIODOS_ANALISIS_TRAYECTORIA.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {ETIQUETAS_PERIODOS_ANALISIS[periodo]}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
              gap: "24px",
              alignItems: "start",
              marginTop: "20px",
              marginBottom: "28px",
            }}
          >
            {/* COLUMNA IZQUIERDA: SEGUIMIENTO PEDAGÓGICO */}
            <div
              id="ficha-seguimiento-imprimir"
              className="ficha-seguimiento-imprimir"
              style={{
                border: "2px solid #bcd8ea",
                borderRadius: "12px",
                padding: "18px",
                background: "#f9fcff",
                minWidth: 0,
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                E.E.S 140 - Seguimiento Pedagógico
              </h3>

              <h2>
                {alumnoSeleccionado.apellido}, {alumnoSeleccionado.nombre}
              </h2>

              <p style={{ textAlign: "center" }}>
                <strong>DNI:</strong> {alumnoSeleccionado.dni}
                &nbsp; | &nbsp;
                <strong>Curso:</strong> {alumnoSeleccionado.curso}
              </p>

              {cargandoSeguimiento && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#5d6d7e",
                  }}
                >
                  Cargando ficha compartida...
                </p>
              )}

              {errorSeguimiento && (
                <p
                  style={{
                    background: "#fff3cd",
                    border: "1px solid #f0d98c",
                    borderRadius: "8px",
                    color: "#856404",
                    padding: "9px 12px",
                    textAlign: "center",
                  }}
                >
                  {errorSeguimiento}
                </p>
              )}

              <hr style={{ margin: "20px 0" }} />

              <div className="ficha-seguimiento-desktop">
                {asignaturas.map((asignatura) => (
                  <div key={asignatura}>
                    <h4 className="materia">{asignatura}</h4>

                    <div className="tabla-scroll-mobile">
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "18px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      >
                        <thead>
                          <tr>
                            {periodos.map((periodo) => (
                              <th
                                key={periodo.clave}
                                style={{
                                  border: "2px solid #cfd8dc",
                                  padding: "6px",
                                  background: "#eef3f7",
                                  fontSize: "12px",
                                }}
                              >
                                {periodo.etiqueta}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            {periodos.map((periodo) => {
                              const dato = obtenerDato(
                                asignatura,
                                periodo.clave,
                              );

                              return (
                                <td
                                  key={periodo.clave}
                                  style={{
                                    border: "2px solid #cfd8dc",
                                    padding: "7px",
                                    textAlign: "center",
                                    background: colorConceptual(
                                      dato.conceptual,
                                    ),
                                    fontWeight: "700",
                                    fontSize: "12px",
                                  }}
                                >
                                  {dato.conceptual
                                    ? `${dato.conceptual}${
                                        dato.nota ? ` ${dato.nota}` : ""
                                      }`
                                    : "—"}
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ficha-seguimiento-mobile">
                {asignaturas.map((asignatura) => (
                  <div
                    key={`mobile-${asignatura}`}
                    className="tarjeta-materia-seguimiento"
                  >
                    <h4 className="materia materia-mobile">{asignatura}</h4>

                    <div className="periodos-mobile">
                      {periodos.map((periodo) => {
                        const dato = obtenerDato(asignatura, periodo.clave);

                        return (
                          <div
                            key={`mobile-${asignatura}-${periodo.clave}`}
                            className="fila-periodo-mobile"
                          >
                            <span className="nombre-periodo-mobile">
                              {periodo.etiqueta}
                            </span>

                            <span
                              className="valor-periodo-mobile"
                              style={{
                                background: colorConceptual(dato.conceptual),
                              }}
                            >
                              {dato.conceptual
                                ? `${dato.conceptual}${
                                    dato.nota ? ` ${dato.nota}` : ""
                                  }`
                                : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMNA DERECHA: ACCESO AL INFORME INSTITUCIONAL */}
            <div
              style={{
                minWidth: 0,
                position: "sticky",
                top: "20px",
              }}
            >
              {!cargandoSeguimiento && (
                <section
                  style={{
                    border: "2px solid #b9d7d3",
                    borderRadius: "18px",
                    padding: "26px",
                    background:
                      "linear-gradient(180deg, #f6fbfa 0%, #ffffff 100%)",
                    boxShadow: "0 8px 24px rgba(40, 82, 78, 0.10)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        background: "#e5f3f0",
                        fontSize: "24px",
                      }}
                    >
                      🧠
                    </div>

                    <div>
                      <p
                        style={{
                          margin: "0 0 3px",
                          color: "#64748b",
                          fontSize: "12px",
                          fontWeight: "700",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        Análisis pedagógico
                      </p>

                      <h3
                        style={{
                          margin: 0,
                          color: "#173f3b",
                          fontSize: "21px",
                          lineHeight: 1.25,
                        }}
                      >
                        Centro de análisis institucional
                      </h3>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      border: "1px solid #d7e6e4",
                      borderRadius: "12px",
                      background: "#ffffff",
                      marginBottom: "18px",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        color: "#667085",
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {periodoInforme
                        ? "Valoración institucional"
                        : "Período pendiente de selección"}
                    </span>

                    <strong
                      style={{
                        display: "block",
                        color: "#243b53",
                        fontSize: "17px",
                        lineHeight: 1.45,
                      }}
                    >
                      {periodoInforme
                        ? informeInstitucional?.encabezado?.titulo ||
                          "Informe institucional de seguimiento pedagógico"
                        : "Seleccioná un período para generar el análisis institucional."}
                    </strong>
                  </div>

                  <div style={{ marginBottom: "22px" }}>
                    <h4
                      style={{
                        margin: "0 0 9px",
                        color: "#4b5563",
                        fontSize: "16px",
                      }}
                    >
                      Síntesis
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        color: "#4a5568",
                        fontSize: "15px",
                        lineHeight: 1.65,
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {periodoInforme
                        ? informeInstitucional?.resumen ||
                          "Todavía no hay información suficiente para generar la síntesis de este período."
                        : "Elegí el período institucional que querés analizar antes de abrir el informe completo."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={abrirInformeCompleto}
                    style={{
                      width: "100%",
                      padding: "13px 18px",
                      border: "none",
                      borderRadius: "11px",
                      background: periodoInforme ? "#315f5a" : "#7f9794",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "15px",
                      boxShadow: "0 4px 12px rgba(49, 95, 90, 0.20)",
                    }}
                  >
                    Ver informe institucional completo →
                  </button>

                  <p
                    style={{
                      margin: "13px 0 0",
                      color: "#718096",
                      fontSize: "12px",
                      lineHeight: 1.5,
                      textAlign: "center",
                    }}
                  >
                    {periodoInforme
                      ? "Se abrirá en una vista exclusiva para su lectura."
                      : "Primero seleccioná el período del informe."}
                  </p>
                </section>
              )}

              {!cargandoSeguimiento && resultadoTrayectoria?.error && (
                <p
                  style={{
                    marginTop: "20px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#fff3cd",
                    border: "1px solid #f0d98c",
                    color: "#856404",
                    textAlign: "center",
                  }}
                >
                  {resultadoTrayectoria.error}
                </p>
              )}
            </div>
          </div>

                  {!mostrarInformeCompleto &&
            !cargandoSeguimiento &&
            informeInstitucional && (
              <div aria-hidden="true" style={{ display: "none" }}>
                <InformeInstitucional informe={informeInstitucional} />
              </div>
            )}

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <button
              type="button"
              onClick={imprimirFicha}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid #c8d5e5",
                background: "#f8f9fc",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🖨️ Imprimir ficha
            </button>
          </div>

          {mostrarInformeCompleto &&
            !cargandoSeguimiento &&
            informeInstitucional &&
            createPortal(
              <div
                id="modal-informe-institucional"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-informe"
                onMouseDown={(evento) => {
                  if (evento.target === evento.currentTarget) {
                    setMostrarInformeCompleto(false);
                  }
                }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  overflowY: "auto",
                  padding: "28px 18px",
                  background: "rgba(24, 41, 49, 0.64)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <article
                  style={{
                    width: "min(980px, 100%)",
                    minHeight: "calc(100vh - 56px)",
                    margin: "0 auto",
                    overflow: "hidden",
                    border: "1px solid #d6e3e8",
                    borderRadius: "22px",
                    background: "#ffffff",
                    boxShadow: "0 28px 80px rgba(12, 32, 43, 0.34)",
                  }}
                >
                  <header
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      padding: "18px 26px",
                      borderBottom: "1px solid #dbe5eb",
                      background: "rgba(255, 255, 255, 0.97)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          color: "#6b7280",
                          fontSize: "12px",
                          fontWeight: "700",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Lectura institucional completa
                      </p>

                      <h2
                        id="titulo-modal-informe"
                        style={{
                          margin: 0,
                          color: "#296b65",
                          fontSize: "22px",
                          lineHeight: 1.25,
                        }}
                      >
                        Informe institucional de seguimiento pedagógico
                      </h2>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        type="button"
                        onClick={imprimirFicha}
                        style={{
                          padding: "10px 15px",
                          border: "1px solid #bfd2d9",
                          borderRadius: "10px",
                          background: "#edf6f4",
                          color: "#315f5a",
                          cursor: "pointer",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🖨️ Imprimir
                      </button>

                      <button
                        type="button"
                        onClick={() => setMostrarInformeCompleto(false)}
                        style={{
                          padding: "10px 15px",
                          border: "1px solid #cbd8df",
                          borderRadius: "10px",
                          background: "#f8fafc",
                          color: "#334155",
                          cursor: "pointer",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Cerrar ✕
                      </button>
                    </div>
                  </header>

                  <div
                    style={{
                      padding: "38px 44px 50px",
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%)",
                    }}
                  >
                    <InformeInstitucional informe={informeInstitucional} />
                  </div>
                </article>
              </div>,
              document.body,
            )}
        </>
      )}
    </>
  );
}