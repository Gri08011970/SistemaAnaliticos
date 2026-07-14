import { useState } from "react";
import {
  obtenerIndicePedagogico,
  obtenerEstadoPorIndice,
} from "./seguimientoResumenUtils";

export default function ResumenEstudiantes({
  alumnosCurso,
  asignaturasResumen,
  obtenerDato,
}) {
  const [mostrarPanel, setMostrarPanel] = useState(false);

  const [gruposAbiertos, setGruposAbiertos] = useState({
    prioritarios: true,
    seguimiento: false,
    favorables: false,
    sinRegistros: false,
  });

  const resumenEstudiantes = alumnosCurso.map((alumno) => {
    let tea = 0;
    let tep = 0;
    let ted = 0;

    asignaturasResumen.forEach((asignatura) => {
      const dato = obtenerDato(alumno._id, asignatura);

      if (dato.conceptual === "TEA") tea++;
      if (dato.conceptual === "TEP") tep++;
      if (dato.conceptual === "TED") ted++;
    });

    const totalCargados = tea + tep + ted;
    const indice = obtenerIndicePedagogico({ tea, tep, ted });

    const estado =
      totalCargados === 0
        ? "⚪ Sin registros para este período"
        : obtenerEstadoPorIndice(indice);

    return {
      alumno,
      tea,
      tep,
      ted,
      totalCargados,
      indice,
      estado,
    };
  });

  const prioritarios = resumenEstudiantes
    .filter(
      (item) =>
        item.totalCargados > 0 &&
        item.estado.includes("Intervención pedagógica prioritaria"),
    )
    .sort((a, b) => a.indice - b.indice);

  const seguimiento = resumenEstudiantes
    .filter(
      (item) =>
        item.totalCargados > 0 &&
        item.estado.includes("Requiere seguimiento"),
    )
    .sort((a, b) => a.indice - b.indice);

  const favorables = resumenEstudiantes
    .filter(
      (item) =>
        item.totalCargados > 0 &&
        item.estado.includes("Evolución favorable"),
    )
    .sort((a, b) => b.indice - a.indice);

  const sinRegistros = resumenEstudiantes
    .filter((item) => item.totalCargados === 0)
    .sort((a, b) =>
      `${a.alumno.apellido} ${a.alumno.nombre}`.localeCompare(
        `${b.alumno.apellido} ${b.alumno.nombre}`,
        "es",
      ),
    );

  const alternarGrupo = (grupo) => {
    setGruposAbiertos((estadoAnterior) => ({
      ...estadoAnterior,
      [grupo]: !estadoAnterior[grupo],
    }));
  };

  const porcentajeGrupo = (cantidad) => {
    if (alumnosCurso.length === 0) return 0;

    return Math.round((cantidad / alumnosCurso.length) * 100);
  };

  const imprimirResumenEstudiantes = () => {
    const contenido = document.getElementById(
      "resumen-estudiantes-imprimir",
    )?.innerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

    ventana.document.write(`
      <html>
        <head>
          <title>Índice pedagógico por estudiante</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 14mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #222;
            }

            button {
              display: none;
            }

            .grupo-listado {
              display: block !important;
            }

            .grupo-contenido {
              display: block !important;
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
  };

  const renderGrupo = ({
    clave,
    titulo,
    items,
    fondo,
    color,  
  }) => {
    const abierto = gruposAbiertos[clave];

    return (
      <div
        className="grupo-listado"
        style={{
          marginTop: "10px",
          border: "2px solid  #bcd7e3",
          
          boxShadow:  "0 5px 14px rgba(44, 84, 116, 0.10)",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <button
          type="button"
          onClick={() => alternarGrupo(clave)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            border: "none",
            background: fondo,
            color,
            fontWeight: "700",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span>
            {titulo} ({items.length})
          </span>

          <span>{abierto ? "▲" : "▼"}</span>
        </button>

        {abierto && (
          <div className="grupo-contenido">
            <div
              style={{
                padding: "7px 10px",
                background: "#f8fafc",
                borderBottom: "1px solid #e4e7ec",
                fontSize: "11px",
                color: "#667085",
              }}
            >
              Cantidad: <strong>{items.length}</strong>
              {" · "}
              Porcentaje del curso:{" "}
              <strong>{porcentajeGrupo(items.length)}%</strong>
            </div>

            {items.length === 0 ? (
              <div
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  color: "#667085",
                }}
              >
                No hay estudiantes en esta categoría.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.alumno._id || item.alumno.dni}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.8fr 65px 1.2fr",
                    gap: "10px",
                    alignItems: "center",
                    padding: "8px 10px",
                    borderBottom: "1px solid #e4e7ec",
                    fontSize: "12px",
                  }}
                >
                  <strong>
                    {item.alumno.apellido}, {item.alumno.nombre}
                  </strong>

                  <strong>
                    {item.totalCargados === 0 ? "—" : `${item.indice}%`}
                  </strong>

                  <span>{item.estado}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="resumen-estudiantes-imprimir"
      style={{
        margin: "16px 0",
        padding: "12px",
        border: "2px solid  #bcd7e3",
        boxShadow:  "0 5px 14px rgba(44, 84, 116, 0.10)",
        borderRadius: "14px",
        background: "#f9fcff",
      }}
    >
      <button
        type="button"
        onClick={() => setMostrarPanel(!mostrarPanel)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          border: "none",
          borderRadius: "10px",
          background: "#eef5f8",
          color: "#43506f",
          fontSize: "15px",
          fontWeight: "700",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>🧑‍🎓 Índice pedagógico por estudiante</span>
        <span>{mostrarPanel ? "▲" : "▼"}</span>
      </button>

      {mostrarPanel && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <div style={tarjetaResumen("#ffeaea", "#b42318")}>
              🔴 Prioritarios
              <strong>{prioritarios.length}</strong>
            </div>

            <div style={tarjetaResumen("#fff8df", "#8a6d00")}>
              🟡 Seguimiento
              <strong>{seguimiento.length}</strong>
            </div>

            <div style={tarjetaResumen("#eef8ee", "#2f7d32")}>
              🔵 Favorables
              <strong>{favorables.length}</strong>
            </div>

            <div style={tarjetaResumen("#f1f3f5", "#667085")}>
              ⚪ Sin registros
              <strong>{sinRegistros.length}</strong>
            </div>
          </div>

          {renderGrupo({
            clave: "prioritarios",
            titulo: "🔴 Intervención pedagógica prioritaria",
            items: prioritarios,
            fondo: "#ffeaea",
            color: "#b42318",
            borde: "#f4b8b8",
          })}

          {renderGrupo({
            clave: "seguimiento",
            titulo: "🟡 Requiere seguimiento",
            items: seguimiento,
            fondo: "#fff8df",
            color: "#8a6d00",
            borde: "#eadb9b",
          })}

          {renderGrupo({
            clave: "favorables",
            titulo: "🔵 Evolución favorable",
            items: favorables,
            fondo: "#eef8ee",
            color: "#2f7d32",
            borde: "#b9dfbb",
          })}

          {renderGrupo({
            clave: "sinRegistros",
            titulo: "⚪ Sin registros para este período",
            items: sinRegistros,
            fondo: "#f1f3f5",
            color: "#667085",
            borde: "#d0d5dd",
          })}

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={imprimirResumenEstudiantes}
              style={{
                marginTop: "12px",
                padding: "8px 14px",
                borderRadius: "9px",
                border: "1px solid #c8d5e5",
                background: "#f8f9fc",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              🖨️ Imprimir índice por estudiante
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function tarjetaResumen(background, color) {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "9px",
    borderRadius: "10px",
    background,
    color,
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "600",
  };
}