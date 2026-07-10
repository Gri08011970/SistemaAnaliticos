import { useState } from "react";
import PanelAnalisisCurso from "./PanelAnalisisCurso";
import {
  obtenerIndicePedagogico,
  obtenerEstadoPorIndice,
  obtenerEstadoAsignatura,
  obtenerColorEstado,
} from "./seguimientoResumenUtils";
import DiagnosticoCurso from "./DiagnosticoCurso";
import AnalisisAutomatico from "./AnalisisAutomatico";
import TarjetasEstadisticas from "./TarjetasEstadisticas";
import ResumenAsignaturas from "./ResumenAsignaturas";
import ResumenEstudiantes from "./ResumenEstudiantes";

function obtenerAsignaturasPorCurso(curso) {
  if (curso.startsWith("1°")) {
    return [
      "Prácticas del Lenguaje",
      "Matemática",
      "Ciencias Sociales",
      "Ciencias Naturales",
      "Inglés",
      "Educación Artística",
      "Educación Física",
      "Construcción de Ciudadanía",
    ];
  }

  if (curso.startsWith("2°") || curso.startsWith("3°")) {
    return [
      "Prácticas del Lenguaje",
      "Matemática",
      "Historia",
      "Geografía",
      "Biología",
      "Fisicoquímica",
      "Inglés",
      "Educación Artística",
      "Educación Física",
      "Construcción de Ciudadanía",
    ];
  }

  if (curso.startsWith("4°")) {
    return [
      "Literatura",
      "Matemática Ciclo Superior",
      "Historia",
      "Geografía",
      "Biología",
      "Introducción a la Física",
      "Introducción a la Química",
      "NTICX",
      "Salud y Adolescencia",
      "Inglés",
      "Educación Física",
      "Producción y Análisis de Imágenes",
    ];
  }

  if (curso.startsWith("5°")) {
    return [
      "Literatura",
      "Matemática Ciclo Superior",
      "Historia",
      "Geografía",
      "Política y Ciudadanía",
      "Inglés",
      "Educación Física",
      "Imagen y Nuevos Medios",
      "Art. Leng. Danza",
    ];
  }

  if (curso.startsWith("6°")) {
    return [
      "Literatura",
      "Matemática Ciclo Superior",
      "Historia",
      "Geografía",
      "Inglés",
      "Educación Física",
      "Imagen y Procedimientos Constructivos",
      "Art. Leng. Danza",
    ];
  }

  return [];
}

export default function ResumenCurso({ curso, alumnos }) {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mayo");
  const [mostrarPanelAnalisis, setMostrarPanelAnalisis] = useState(false);

  const alumnosCurso = alumnos.filter((a) => a.curso === curso);
  const asignaturasResumen = obtenerAsignaturasPorCurso(curso);

  const seguimiento = JSON.parse(
    localStorage.getItem("seguimientoPedagogico") || "{}",
  );

  const obtenerDato = (alumnoId, asignatura) => {
    const clave = `${curso}-${asignatura}-${alumnoId}-${periodoSeleccionado}`;
    return seguimiento[clave] || {};
  };

  const calcularEstadisticas = () => {
    let tea = 0;
    let tep = 0;
    let ted = 0;
    let totalCargados = 0;
    let puntos = 0;

    alumnosCurso.forEach((alumno) => {
      asignaturasResumen.forEach((asignatura) => {
        const dato = obtenerDato(alumno._id, asignatura);

        if (dato.conceptual === "TEA") {
          tea++;
          puntos += 3;
        }

        if (dato.conceptual === "TEP") {
          tep++;
          puntos += 2;
        }

        if (dato.conceptual === "TED") {
          ted++;
          puntos += 1;
        }

        if (dato.conceptual) totalCargados++;
      });
    });

    const indice = obtenerIndicePedagogico({ tea, tep, ted });
    const estadoCurso = obtenerEstadoPorIndice(indice);

    return { tea, tep, ted, totalCargados, indice, estadoCurso };
  };

  const estadisticas = calcularEstadisticas();

 const calcularEstadisticasPorAsignatura = () => {
  return asignaturasResumen.map((asignatura) => {
    let tea = 0;
    let tep = 0;
    let ted = 0;

    alumnosCurso.forEach((alumno) => {
      const dato = obtenerDato(alumno._id, asignatura);

      if (dato.conceptual === "TEA") tea++;
      if (dato.conceptual === "TEP") tep++;
      if (dato.conceptual === "TED") ted++;
    });

    const totalCargados = tea + tep + ted;

    const indice = obtenerIndicePedagogico({
      tea,
      tep,
      ted,
    });

    const estado =
      totalCargados === 0
        ? "⚪ Pendiente de carga"
        : obtenerEstadoAsignatura(indice);

    return {
      asignatura,
      tea,
      tep,
      ted,
      totalCargados,
      indice,
      estado,
    };
  });
};

  const estadisticasPorAsignatura = calcularEstadisticasPorAsignatura();

  const generarObservaciones = () => {
    const fortalezas = [];
    const pendientes = [];
    const recomendaciones = [];

    estadisticasPorAsignatura.forEach((item) => {
      const total = item.tea + item.tep + item.ted;

      if (total === 0) {
        pendientes.push(
          `🟡 ${item.asignatura} aún no posee registros cargados para este período.`,
        );
      } else if (item.indice >= 85) {
        fortalezas.push(
          `🟢 ${item.asignatura} presenta una evolución favorable.`,
        );
      } else if (item.indice >= 60) {
        pendientes.push(
          `🟡 ${item.asignatura} requiere seguimiento durante el período.`,
        );
      } else {
        recomendaciones.push(
          `🔴 ${item.asignatura} requiere intervención pedagógica prioritaria.`,
        );
      }
    });

    const materiasSinCarga = estadisticasPorAsignatura.filter(
      (item) => item.tea + item.tep + item.ted === 0,
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
  const observacionesSistema = generarObservaciones();
  const fechaAnalisis = new Date().toLocaleString("es-AR");

  const colorCelda = (conceptual) => {
    if (conceptual === "TEA") return "#d9f5d6";
    if (conceptual === "TEP") return "#fff1b8";
    if (conceptual === "TED") return "#ffd1d1";
    return "#ffffff";
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
        onVolver={() => setMostrarPanelAnalisis(false)}
      />
    );
  }
  return (
    <div
      id="resumen-curso-imprimir"
      style={{
        border: "1px solid #cfe3ea",
        borderRadius: "16px",
        padding: "20px",
        background: "white",
        margin: "24px auto",
        maxWidth: "1120px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <h3>📊 Resumen del curso</h3>

      <p>
        Curso: <strong>{curso}</strong>
      </p>

      <div style={{ margin: "16px 0" }}>
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
      <button
        type="button"
        onClick={() => setMostrarPanelAnalisis(true)}
        style={{
          padding: "10px 16px",
          marginRight: "10px",
          borderRadius: "10px",
          border: "1px solid #c8d5e5",
          background: "#f8f9fc",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        📈 Ver análisis y estadísticas
      </button>

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

                  body {
                    font-family: Arial, sans-serif;
                    color: #222;
                  }

                  table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                  }

                  th, td {
                    border: 1px solid #999;
                    padding: 4px;
                    text-align: center;
                  }

                  th {
                    background: #eef3f7;
                    font-weight: bold;
                  }

                  button, select {
                    display: none;
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
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid #c8d5e5",
          background: "#f8f9fc",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        🖨️ Imprimir resumen
      </button>

      <p style={{ marginTop: "20px", color: "#666" }}>
        Mostrando resumen del período: <strong>{periodoSeleccionado}</strong>
        <br />
        Estudiantes del curso: <strong>{alumnosCurso.length}</strong>
      </p>

      <div
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
