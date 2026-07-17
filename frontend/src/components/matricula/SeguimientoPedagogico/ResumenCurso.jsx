import { useEffect, useState } from "react";
import PanelAnalisisCurso from "./PanelAnalisisCurso";
import {
  obtenerIndicePedagogico,
  obtenerEstadoPorIndice,
  obtenerEstadoAsignatura,
} from "./seguimientoResumenUtils";
import {
  obtenerAsignaturasPorCurso,
  COLORES_SEGUIMIENTO,
} from "./seguimientoConstants";

export default function ResumenCurso({ curso, alumnos }) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mayo");
  const [mostrarPanelAnalisis, setMostrarPanelAnalisis] = useState(false);

  const alumnosCurso = alumnos
    .filter((alumno) => alumno.curso === curso)
    .sort((a, b) => {
      const comparacionApellido = (a.apellido || "").localeCompare(
        b.apellido || "",
        "es",
        { sensitivity: "base" },
      );

      if (comparacionApellido !== 0) {
        return comparacionApellido;
      }

      return (a.nombre || "").localeCompare(b.nombre || "", "es", {
        sensitivity: "base",
      });
    });

  const asignaturasResumen = obtenerAsignaturasPorCurso(curso);

  const [seguimiento, setSeguimiento] = useState({});
  const [cargandoSeguimiento, setCargandoSeguimiento] = useState(false);
  const [errorSeguimiento, setErrorSeguimiento] = useState("");

  const obtenerDato = (alumnoId, asignatura) => {
    const clave = `${curso}-${asignatura}-${alumnoId}-${periodoSeleccionado}`;
    return seguimiento[clave] || {};
  };

  const calcularEstadisticas = () => {
    let tea = 0;
    let tep = 0;
    let ted = 0;
    let totalCargados = 0;

    alumnosCurso.forEach((alumno) => {
      asignaturasResumen.forEach((asignatura) => {
        const dato = obtenerDato(alumno._id, asignatura);

        if (dato.conceptual === "TEA") {
          tea++;
        }

        if (dato.conceptual === "TEP") {
          tep++;
        }

        if (dato.conceptual === "TED") {
          ted++;
        }

        if (dato.conceptual) {
          totalCargados++;
        }
      });
    });

    const indice = obtenerIndicePedagogico({
      tea,
      tep,
      ted,
    });

    const estadoCurso = obtenerEstadoPorIndice(indice);

    return {
      tea,
      tep,
      ted,
      totalCargados,
      indice,
      estadoCurso,
    };
  };

  useEffect(() => {
    async function obtenerSeguimientoDesdeMongo() {
      if (!curso) {
        setSeguimiento({});
        return;
      }

      try {
        setCargandoSeguimiento(true);
        setErrorSeguimiento("");

        const parametros = new URLSearchParams({
          curso,
        });

        const respuesta = await fetch(
          `/api/seguimiento?${parametros.toString()}`,
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el seguimiento pedagógico");
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
        console.error("Error al cargar el resumen desde MongoDB:", error);

        setErrorSeguimiento("No se pudieron cargar los datos compartidos.");
      } finally {
        setCargandoSeguimiento(false);
      }
    }

    obtenerSeguimientoDesdeMongo();
  }, [curso]);

  const estadisticas = calcularEstadisticas();

 const calcularEstadisticasPorAsignatura = () => {
  return asignaturasResumen.map((asignatura) => {
    let tea = 0;
    let tep = 0;
    let ted = 0;
    let aplazos = 0;

    alumnosCurso.forEach((alumno) => {
      const dato = obtenerDato(
        alumno._id,
        asignatura,
      );

      if (dato.conceptual === "TEA") tea++;
      if (dato.conceptual === "TEP") tep++;
      if (dato.conceptual === "TED") ted++;

      const notaNumerica = Number(dato.nota);

      const tieneNota =
        dato.nota !== "" &&
        dato.nota !== null &&
        dato.nota !== undefined &&
        !Number.isNaN(notaNumerica);

      if (
        tieneNota &&
        notaNumerica >= 1 &&
        notaNumerica <= 3
      ) {
        aplazos++;
      }
    });

    const totalCargados = tea + tep + ted;

    const indice = obtenerIndicePedagogico({
      tea,
      tep,
      ted,
    });

    const estado = obtenerEstadoAsignatura({
      indice,
      tea,
      tep,
      ted,
      aplazos,
      totalCargados,
    });

    return {
      asignatura,
      tea,
      tep,
      ted,
      aplazos,
      totalCargados,
      indice,
      estado,
    };
  });
};

const estadisticasPorAsignatura =
  calcularEstadisticasPorAsignatura();

const generarObservaciones = () => {
  const fortalezas = [];
  const pendientes = [];
  const recomendaciones = [];

  estadisticasPorAsignatura.forEach((item) => {
    if (item.totalCargados === 0) {
      pendientes.push(
        `⚪ ${item.asignatura} aún no posee registros cargados para este período.`,
      );

      return;
    }

    if (
      item.estado.includes(
        "Intervención pedagógica prioritaria",
      )
    ) {
      recomendaciones.push(
        `🔴 ${item.asignatura} requiere intervención pedagógica prioritaria. ` +
          `Registra ${item.tep} trayectoria(s) en proceso, ` +
          `${item.ted} trayectoria(s) discontinua(s)` +
          `${
            item.aplazos > 0
              ? ` y ${item.aplazos} aplazo(s).`
              : "."
          }`,
      );

      return;
    }

    if (item.estado.includes("Requiere intervención")) {
      recomendaciones.push(
        `🟠 ${item.asignatura} requiere acciones de intervención y acompañamiento. ` +
          `Registra ${item.tep} trayectoria(s) en proceso, ` +
          `${item.ted} trayectoria(s) discontinua(s)` +
          `${
            item.aplazos > 0
              ? ` y ${item.aplazos} aplazo(s).`
              : "."
          }`,
      );

      return;
    }

    if (item.estado.includes("Observar")) {
      pendientes.push(
        `🟡 ${item.asignatura} requiere seguimiento durante el período. ` +
          `Registra ${item.tep} trayectoria(s) en proceso, ` +
          `${item.ted} trayectoria(s) discontinua(s)` +
          `${
            item.aplazos > 0
              ? ` y ${item.aplazos} aplazo(s).`
              : "."
          }`,
      );

      return;
    }

    fortalezas.push(
      `🟢 ${item.asignatura} presenta una evolución favorable.`,
    );
  });

  const materiasSinCarga =
    estadisticasPorAsignatura.filter(
      (item) => item.totalCargados === 0,
    ).length;

  if (materiasSinCarga > 0) {
    recomendaciones.push(
      "📌 Se recomienda completar la carga de las asignaturas pendientes antes del cierre del período.",
    );
  }

  return {
    fortalezas,
    pendientes,
    recomendaciones,
  };
};

const observacionesSistema =
  generarObservaciones();
  
  const fechaAnalisis = new Date().toLocaleString("es-AR");

  const colorCelda = (conceptual) => {
    return (
      COLORES_SEGUIMIENTO[conceptual]?.fondoClaro ||
      COLORES_SEGUIMIENTO["-"].fondoClaro
    );
  };

  if (mostrarPanelAnalisis) {
    return (
      <PanelAnalisisCurso
        estadisticas={estadisticas}
        fechaAnalisis={fechaAnalisis}
        alumnosCurso={alumnosCurso}
        asignaturasResumen={asignaturasResumen}
        periodoSeleccionado={periodoSeleccionado}
        observacionesSistema={observacionesSistema}
        estadisticasPorAsignatura={estadisticasPorAsignatura}
        obtenerDato={obtenerDato}
        seguimiento={seguimiento}
        onVolver={() => setMostrarPanelAnalisis(false)}
      />
    );
  }
  return (
    <div
      id="resumen-curso-imprimir"
      style={{
        border: "3px solid #cfe3ea",
        borderRadius: "18px",
        padding: "20px",
        background: "#ffffff",
        margin: "24px auto",
        maxWidth: "1120px",
        boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
        borderTop: "6px solid #5d86b0",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto 18px",
          padding: "18px 20px",
          border: "1px solid #bdd9e4",
          borderTop: "6px solid #5d86b0",
          borderRadius: "16px",
          background: "#f9fcff",
          boxShadow: "0 6px 18px rgba(44, 84, 116, 0.12)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: "0 0 14px",
            color: "#43506f",
          }}
        >
          📊 Resumen del curso
        </h3>

        <p style={{ margin: "0 0 14px" }}>
          Curso: <strong>{curso}</strong>
        </p>

        <div>
          <label>Período:&nbsp;</label>

          <select
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          >
            <option value="mayo">Mayo</option>
            <option value="primerCuat">1° Cuatrimestre</option>
            <option value="octubre">Octubre</option>
            <option value="segundoCuat">2° Cuatrimestre</option>
            <option value="diciembre">Diciembre</option>
            <option value="febrero">Febrero</option>
            <option value="marzo">Marzo</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setMostrarPanelAnalisis(true)}
        style={{
          padding: "12px 20px",
          marginRight: "10px",
          borderRadius: "12px",
          border: "1px solid #c8d5e5",
          background: "#f4f8ff",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,.10)",
        }}
      >
        📈 Panel de análisis
      </button>

      {cargandoSeguimiento && (
        <p
          style={{
            color: "#5d6d7e",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          Cargando resumen compartido...
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
            fontSize: "13px",
          }}
        >
          {errorSeguimiento}
        </p>
      )}

      <button
        onClick={() => {
          const contenido = document.getElementById(
            "resumen-curso-imprimir",
          ).innerHTML;
          const ventana = window.open("", "_blank");

          ventana.document.write(`
  <html>
    <head>
      <title>Resumen del curso</title>

      <style>
        @page {
          size: A4 landscape;
          margin: 8mm;
        }

        html,
        body {
          height: auto !important;
          overflow: visible !important;
        }

        body {
          font-family: Arial, sans-serif;
          color: #222;
          margin: 0;
        }

        .contenedor-tabla-resumen {
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          overflow: visible !important;
          position: static !important;
          border: none !important;
          border-radius: 0 !important;
        }

        .contenedor-tabla-resumen table {
          width: 100% !important;
          height: auto !important;
          min-width: 100% !important;
          overflow: visible !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
        }

        table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 9px;
        }

        thead {
          display: table-header-group;
        }

        tbody {
          display: table-row-group;
        }

        tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        th,
        td {
          border: 1px solid #999 !important;
          padding: 4px;
          text-align: center;
          position: static !important;
        }

        th {
          background: #eef3f7 !important;
          font-weight: bold;
        }

        button,
        select {
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
          ventana.focus();
          ventana.print();
          ventana.close();
        }}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          border: "1px solid #c8d5e5",
          background: "#f8f9fc",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        🖨️ Imprimir informe
      </button>

      <p style={{ marginTop: "20px", color: "#666" }}>
        Mostrando resumen del período: <strong>{periodoSeleccionado}</strong>
        <br />
        Estudiantes del curso: <strong>{alumnosCurso.length}</strong>
      </p>

      <div
        className="contenedor-tabla-resumen"
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "620px",
          overflow: "auto",
          marginTop: "22px",
          border: "3px solid #5e88b3",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <table
          style={{
            width: "max-content",
            minWidth: "100%",
            marginTop: 0,
            borderCollapse: "separate",
            borderSpacing: 0,
            border: "none",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "155px",
                  minWidth: "155px",
                  border: "1px solid #9fb8c9",
                  borderRight: "3px solid #5f91b2",
                  padding: "6px 4px",
                  background: "#f5f7fa",
                  fontSize: "11px",
                  lineHeight: "1.1",
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 50,
                }}
              >
                Alumno
              </th>

              {asignaturasResumen.map((asignatura) => (
                <th
                  key={asignatura}
                  style={{
                    width: "68px",
                    minWidth: "68px",
                    maxWidth: "68px",
                    border: "2px solid #7a9fc4",

                    padding: "6px 3px",
                    background: "#f5f7fa",
                    fontSize: "10.5px",
                    lineHeight: "1.15",
                    fontWeight: "700",
                    wordBreak: "break-word",
                    position: "sticky",
                    top: 0,
                    zIndex: 40,
                  }}
                >
                  {asignatura}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {alumnosCurso.map((alumno, index) => {
              const filaMarcada = (index + 1) % 5 === 0;

              return (
                <tr
                  key={alumno._id || alumno.dni}
                  style={{
                    background: filaMarcada ? "#f8fbfd" : "#ffffff",
                  }}
                >
                  <td
                    style={{
                      borderLeft: "1px solid #cfd8dc",
                      borderRight: "3px solid #5f91b2",
                      borderTop: "1px solid #d9e3e8",
                      borderBottom: filaMarcada
                        ? "3px solid #7fa6c2"
                        : "1px solid #d9e3e8",
                      padding: "5px 6px",
                      fontSize: "11px",
                      lineHeight: "1.15",
                      fontWeight: "500",
                      color: "#3f4f67",
                      textAlign: "left",
                      verticalAlign: "middle",
                      wordBreak: "break-word",
                      position: "sticky",
                      left: 0,
                      zIndex: 20,
                      background: filaMarcada ? "#f8fbfd" : "#ffffff",
                    }}
                  >
                    {alumno.apellido}, {alumno.nombre}
                  </td>

                  {asignaturasResumen.map((asignatura) => {
                    const dato = obtenerDato(alumno._id, asignatura);

                    return (
                      <td
                        key={asignatura}
                        style={{
                          width: "68px",
                          minWidth: "68px",
                          maxWidth: "68px",
                          borderTop: "1px solid #d9e3e8",
                          borderLeft: "1px solid #d9e3e8",
                          borderRight: "3px solid #5d86b0",
                          borderBottom: filaMarcada
                            ? "3px solid #7fa6c2"
                            : "1px solid #d9e3e8",
                          padding: "4px 3px",
                          textAlign: "center",
                          verticalAlign: "middle",
                          background: colorCelda(dato.conceptual),
                          fontSize: "10px",
                          lineHeight: "1.1",
                          fontWeight: "700",
                        }}
                      >
                        {dato.conceptual ? (
                          <span>
                            {dato.conceptual}
                            {dato.nota ? ` ${dato.nota}` : ""}
                          </span>
                        ) : (
                          <span style={{ color: "#777" }}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
