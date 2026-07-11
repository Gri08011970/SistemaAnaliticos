import { useState } from "react";
import {
  obtenerIndicePedagogico,
  obtenerEstadoPorIndice,
} from "./seguimientoResumenUtils";

const PERIODOS = [
  { clave: "mayo", etiqueta: "Mayo" },
  { clave: "primerCuat", etiqueta: "1° Cuatrimestre" },
  { clave: "octubre", etiqueta: "Octubre" },
  { clave: "segundoCuat", etiqueta: "2° Cuatrimestre" },
  { clave: "diciembre", etiqueta: "Diciembre" },
  { clave: "febrero", etiqueta: "Febrero" },
  { clave: "marzo", etiqueta: "Marzo" },
  { clave: "final", etiqueta: "Final" },
];

export default function EvolucionCurso({
  curso,
  alumnosCurso,
  asignaturasResumen,
  seguimiento,
}) {
  const [mostrarEvolucion, setMostrarEvolucion] = useState(false);

  const calcularIndicePeriodo = (periodo) => {
    let tea = 0;
    let tep = 0;
    let ted = 0;

    alumnosCurso.forEach((alumno) => {
      asignaturasResumen.forEach((asignatura) => {
        const clave = `${curso}-${asignatura}-${alumno._id}-${periodo}`;
        const dato = seguimiento[clave] || {};

        if (dato.conceptual === "TEA") tea++;
        if (dato.conceptual === "TEP") tep++;
        if (dato.conceptual === "TED") ted++;
      });
    });

    const totalCargados = tea + tep + ted;
    const indice = obtenerIndicePedagogico({ tea, tep, ted });

    return {
      periodo,
      tea,
      tep,
      ted,
      totalCargados,
      indice,
      estado:
        totalCargados === 0
          ? "⚪ Sin registros"
          : obtenerEstadoPorIndice(indice),
    };
  };

  const evolucion = PERIODOS.map((periodo) => ({
    ...periodo,
    ...calcularIndicePeriodo(periodo.clave),
  }));

  const periodosConDatos = evolucion.filter(
    (item) => item.totalCargados > 0,
  );

  const primerPeriodo = periodosConDatos[0];

  const ultimoPeriodo =
    periodosConDatos.length > 0
      ? periodosConDatos[periodosConDatos.length - 1]
      : null;

  const diferencia =
    primerPeriodo && ultimoPeriodo
      ? ultimoPeriodo.indice - primerPeriodo.indice
      : 0;

  let tendencia = "⚪ Sin datos suficientes";

  if (periodosConDatos.length >= 2) {
    if (diferencia >= 5) {
      tendencia = `📈 Evolución positiva (+${diferencia} puntos)`;
    } else if (diferencia <= -5) {
      tendencia = `📉 Descenso (${diferencia} puntos)`;
    } else {
      tendencia = "➡️ Evolución estable";
    }
  }

  const mejorPeriodo =
    periodosConDatos.length > 0
      ? periodosConDatos.reduce((mejor, actual) =>
          actual.indice > mejor.indice ? actual : mejor,
        )
      : null;

  const periodoMasBajo =
    periodosConDatos.length > 0
      ? periodosConDatos.reduce((menor, actual) =>
          actual.indice < menor.indice ? actual : menor,
        )
      : null;

  let mayorRecuperacion = null;

  for (let i = 1; i < periodosConDatos.length; i++) {
    const anterior = periodosConDatos[i - 1];
    const actual = periodosConDatos[i];
    const recuperacion = actual.indice - anterior.indice;

    if (
      recuperacion > 0 &&
      (!mayorRecuperacion ||
        recuperacion > mayorRecuperacion.diferencia)
    ) {
      mayorRecuperacion = {
        desde: anterior,
        hasta: actual,
        diferencia: recuperacion,
      };
    }
  }

  const imprimirEvolucion = () => {
    const contenido = document.getElementById(
      "evolucion-curso-imprimir",
    )?.innerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

    if (!ventana) return;

    ventana.document.write(`
      <html>
        <head>
          <title>Evolución entre períodos</title>

          <style>
            @page {
              size: A4 landscape;
              margin: 12mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #222;
            }

            button {
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
  };

  return (
    <div
      id="evolucion-curso-imprimir"
      style={{
        margin: "16px 0",
        padding: "12px",
        border: "1px solid #bcd7e3",
        borderRadius: "14px",
        background: "#f9fcff",
        boxShadow: "0 5px 14px rgba(44, 84, 116, 0.10)",
      }}
    >
      <button
        type="button"
        onClick={() => setMostrarEvolucion(!mostrarEvolucion)}
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
        <span>📈 Evolución entre períodos</span>
        <span>{mostrarEvolucion ? "▲" : "▼"}</span>
      </button>

      {mostrarEvolucion && (
        <>
          {/* TENDENCIA GENERAL */}
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              borderRadius: "10px",
              background: "#ffffff",
              border: "1px solid #d7e5ec",
              textAlign: "center",
              fontWeight: "700",
              color: "#43506f",
            }}
          >
            {tendencia}
          </div>

          {/* GRÁFICO DE BARRAS */}
          <div
            style={{
              marginTop: "12px",
              padding: "14px",
              border: "1px solid #d7e5ec",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h4
              style={{
                margin: "0 0 14px",
                textAlign: "center",
                color: "#43506f",
                fontSize: "14px",
              }}
            >
              📊 Evolución del índice pedagógico
            </h4>

            {evolucion.map((item) => (
              <div
                key={`barra-${item.clave}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "115px 1fr 48px",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "9px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#43506f",
                    textAlign: "right",
                  }}
                >
                  {item.etiqueta}
                </div>

                <div
                  style={{
                    height: "18px",
                    borderRadius: "10px",
                    background: "#e9eef2",
                    overflow: "hidden",
                    border: "1px solid #d7e0e6",
                  }}
                >
                  {item.totalCargados > 0 && (
                    <div
                      style={{
                        width: `${item.indice}%`,
                        height: "100%",
                        borderRadius: "10px",
                        background:
                          item.indice >= 70
                            ? "#7ed957"
                            : item.indice >= 40
                              ? "#ffd966"
                              : "#ff8a8a",
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color:
                      item.totalCargados === 0
                        ? "#98a2b3"
                        : "#43506f",
                  }}
                >
                  {item.totalCargados === 0
                    ? "—"
                    : `${item.indice}%`}
                </div>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
                marginTop: "12px",
                paddingTop: "10px",
                borderTop: "1px solid #e4e7ec",
                fontSize: "10.5px",
                color: "#667085",
              }}
            >
              <span>🟢 70% o más</span>
              <span>🟡 Entre 40% y 69%</span>
              <span>🔴 Menos de 40%</span>
              <span>⚪ Sin registros</span>
            </div>
          </div>

          {/* INTERPRETACIÓN AUTOMÁTICA */}
          <div
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              border: "1px solid #d7e5ec",
              borderRadius: "12px",
              background: "#f9fcff",
              color: "#43506f",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px",
                fontSize: "14px",
              }}
            >
              🧠 Interpretación de la evolución
            </h4>

            {periodosConDatos.length < 2 ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#667085",
                }}
              >
                Se necesitan registros en al menos dos períodos para
                analizar la evolución del curso.
              </p>
            ) : (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              >
                {mejorPeriodo && (
                  <li>
                    🟢 El índice más alto se registró en{" "}
                    <strong>{mejorPeriodo.etiqueta}</strong>, con{" "}
                    <strong>{mejorPeriodo.indice}%</strong>.
                  </li>
                )}

                {periodoMasBajo && (
                  <li>
                    🟡 El índice más bajo se registró en{" "}
                    <strong>{periodoMasBajo.etiqueta}</strong>, con{" "}
                    <strong>{periodoMasBajo.indice}%</strong>.
                  </li>
                )}

                {mayorRecuperacion && (
                  <li>
                    📈 La mayor recuperación fue entre{" "}
                    <strong>{mayorRecuperacion.desde.etiqueta}</strong>{" "}
                    y{" "}
                    <strong>{mayorRecuperacion.hasta.etiqueta}</strong>:{" "}
                    <strong>
                      +{mayorRecuperacion.diferencia} puntos
                    </strong>
                    .
                  </li>
                )}

                <li>
                  {diferencia > 0
                    ? `📈 El último período registrado supera al primero por ${diferencia} puntos.`
                    : diferencia < 0
                      ? `📉 El último período registrado se encuentra ${Math.abs(
                          diferencia,
                        )} puntos por debajo del primero.`
                      : "➡️ El último período mantiene el mismo índice que el primero."}
                </li>
              </ul>
            )}
          </div>

          {/* TARJETAS DE CADA PERÍODO */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {evolucion.map((item) => (
              <div
                key={item.clave}
                style={{
                  padding: "10px",
                  border: "1px solid #d7e5ec",
                  borderRadius: "10px",
                  background: "#ffffff",
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#43506f",
                    minHeight: "30px",
                  }}
                >
                  {item.etiqueta}
                </div>

                {item.totalCargados === 0 ? (
                  <>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#7a8494",
                      }}
                    >
                      —
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "11px",
                        color: "#667085",
                      }}
                    >
                      ⚪ Sin registros
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#43506f",
                      }}
                    >
                      {item.indice}%
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {item.estado}
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "10px",
                        color: "#667085",
                      }}
                    >
                      {item.totalCargados} registros
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* BOTÓN DE IMPRESIÓN */}
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={imprimirEvolucion}
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
              🖨️ Imprimir evolución
            </button>
          </div>
        </>
      )}
    </div>
  );
}