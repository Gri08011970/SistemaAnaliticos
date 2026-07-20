import { useState } from "react";

export default function ResumenAsignaturas({ estadisticasPorAsignatura }) {
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const imprimirResumenAsignaturas = () => {
    const contenido = document.getElementById(
      "resumen-asignaturas-imprimir",
    )?.innerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

    if (!ventana) return;

    ventana.document.write(`
      <html>
        <head>
          <title>Resumen por asignatura</title>

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

            .grid-asignaturas {
              display: grid !important;
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 10px !important;
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

  const prioridadEstado = {
    "🔴 Intervención pedagógica prioritaria": 4,
    "🟠 Requiere intervención": 3,
    "🟡 Observar": 2,
    "🟢 Excelente": 1,
    "⚪ Pendiente de carga": 0,
  };

  const asignaturasOrdenadas = [...estadisticasPorAsignatura].sort((a, b) => {
    const diferenciaPrioridad =
      (prioridadEstado[b.estado] || 0) - (prioridadEstado[a.estado] || 0);

    if (diferenciaPrioridad !== 0) {
      return diferenciaPrioridad;
    }

    if ((b.aplazos || 0) !== (a.aplazos || 0)) {
      return (b.aplazos || 0) - (a.aplazos || 0);
    }

    if ((b.ted || 0) !== (a.ted || 0)) {
      return (b.ted || 0) - (a.ted || 0);
    }

    if ((b.tep || 0) !== (a.tep || 0)) {
      return (b.tep || 0) - (a.tep || 0);
    }

    return (a.indice || 0) - (b.indice || 0);
  });

  return (
    <div
      id="resumen-asignaturas-imprimir"
      style={{
        margin: "16px 0",
        padding: "12px",
        border: "2px solid #bcd7e3",
        boxShadow: "0 5px 14px rgba(44, 84, 116, 0.10)",
        borderRadius: "14px",
        background: "#f9fcff",
      }}
    >
      <button
        type="button"
        onClick={() => setMostrarResumen((valorActual) => !valorActual)}
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
        <span>📚 Resumen por asignatura</span>
        <span>{mostrarResumen ? "▲" : "▼"}</span>
      </button>

      {mostrarResumen && (
        <>
          <div
            className="grid-asignaturas"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "8px",
              marginTop: "10px",
              paddingTop: "4px",
              borderTop: "6px solid #5d86b0",
            }}
          >
            {asignaturasOrdenadas.map((item) => {
              const totalCargados = item.totalCargados || 0;
              const tea = item.tea || 0;
              const tep = item.tep || 0;
              const ted = item.ted || 0;
              
              const porcentajeAvanzada =
                totalCargados > 0
                  ? Math.round((tea / totalCargados) * 100)
                  : 0;

              const porcentajeAcompanamiento =
                totalCargados > 0
                  ? Math.round(((tep + ted) / totalCargados) * 100)
                  : 0;

              const esPrioritaria = item.estado.includes("prioritaria");
              const requiereIntervencion = item.estado.includes(
                "Requiere intervención",
              );
              const observar = item.estado.includes("Observar");
              const excelente = item.estado.includes("Excelente");

              const mayoriaSinTEA =
                tep + ted >= Math.floor(totalCargados / 2) + 1;

              let fondoEstado = "#eef1f4";
              let colorEstado = "#667085";
              let bordeEstado = "#d8dee6";

              if (esPrioritaria) {
                fondoEstado = "#ffd1d1";
                colorEstado = "#b71c1c";
                bordeEstado = "#ef9a9a";
              } else if (requiereIntervencion) {
                fondoEstado = "#ffe0c2";
                colorEstado = "#a94700";
                bordeEstado = "#f4b183";
              } else if (observar) {
                fondoEstado = "#fff1b8";
                colorEstado = "#856400";
                bordeEstado = "#e8cd68";
              } else if (excelente) {
                fondoEstado = "#d9f5d6";
                colorEstado = "#2e7d32";
                bordeEstado = "#9fd69a";
              }

              return (
                <div
                  key={item.asignatura}
                  style={{
                    border: esPrioritaria
                      ? "2px solid #ef9a9a"
                      : "1px solid #d7e5ec",
                    borderRadius: "12px",
                    padding: "8px",
                    background: "white",
                    boxShadow: esPrioritaria
                      ? "0 4px 10px rgba(183, 28, 28, 0.14)"
                      : "0 2px 6px rgba(0,0,0,.05)",
                    minHeight: "118px",
                  }}
                >
                  <div
                    style={{
                      minHeight: "29px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "12px",
                      marginBottom: "6px",
                      lineHeight: "1.15",
                      color: "#43506f",
                      textAlign: "center",
                    }}
                  >
                    {item.asignatura}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    <span title="Trayectoria educativa avanzada">🔵 {tea}</span>
                    <span title="Trayectoria educativa en proceso">🟢 {tep}</span>
                    <span title="Trayectoria educativa discontinua">🔴 {ted}</span>
                  </div>

                  {totalCargados === 0 ? (
                    <>
                      <div
                        style={{
                          marginTop: "10px",
                          textAlign: "center",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#7a8494",
                        }}
                      >
                        —
                      </div>

                      <div
                        style={{
                          marginTop: "6px",
                          textAlign: "center",
                          padding: "7px 4px",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "11px",
                          background: "#f1f3f5",
                          color: "#667085",
                        }}
                      >
                        ⚪ Pendiente de carga
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          marginTop: "9px",
                          textAlign: "center",
                          padding: esPrioritaria ? "10px 7px" : "8px 6px",
                          borderRadius: "10px",
                          border: `1px solid ${bordeEstado}`,
                          fontWeight: 800,
                          fontSize: esPrioritaria ? "12px" : "11px",
                          lineHeight: "1.35",
                          background: fondoEstado,
                          color: colorEstado,
                          minHeight: esPrioritaria ? "54px" : "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.estado}
                      </div>

                      {(ted > 0 || mayoriaSinTEA) && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "5px",
                            marginTop: "8px",
                          }}
                        >
                          {ted > 0 && (
                            <span
                              style={{
                                padding: "3px 7px",
                                borderRadius: "999px",
                                background: "#fff0f0",
                                border: "1px solid #efc3c3",
                                fontSize: "9px",
                                fontWeight: 700,
                                color: "#a23b3b",
                                whiteSpace: "nowrap",
                              }}
                            >
                              🔴 TED {ted}
                            </span>
                          )}

                          {mayoriaSinTEA && (
                            <span
                              style={{
                                padding: "3px 7px",
                                borderRadius: "999px",
                                background: "#eef5ff",
                                border: "1px solid #cddff2",
                                fontSize: "9px",
                                fontWeight: 700,
                                color: "#49647f",
                                textAlign: "center",
                              }}
                            >
                              👥 Mayoría TEP/TED
                            </span>
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          marginTop: "8px",
                          padding: "7px",
                          borderRadius: "10px",
                          background: "#fafbfc",
                          border: "1px solid #e3e8ef",
                        }}
                      >
                        <div
                          role="img"
                          aria-label={`${porcentajeAvanzada}% con trayectoria consolidada y ${porcentajeAcompanamiento}% que requiere acompañamiento`}
                          style={{
                            width: "100%",
                            height: "18px",
                            display: "flex",
                            overflow: "hidden",
                            borderRadius: "999px",
                            border: "1px solid #d5dde6",
                            background: "#edf2f7",
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,.12)",
                          }}
                        >
                          <div
                            title={`Trayectoria consolidada: ${porcentajeAvanzada}%`}
                            style={{
                              width: `${porcentajeAvanzada}%`,
                              minWidth: porcentajeAvanzada > 0 ? "4px" : 0,
                              background:
                                "linear-gradient(90deg, #64B5F6, #1E88E5)",
                              color: "white",
                              fontSize: "9px",
                              fontWeight: 700,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              transition: "width .3s ease",
                            }}
                          >
                            {porcentajeAvanzada >= 18
                              ? `${porcentajeAvanzada}%`
                              : ""}
                          </div>

                          <div
                            title={`Requiere acompañamiento: ${porcentajeAcompanamiento}%`}
                            style={{
                              width: `${porcentajeAcompanamiento}%`,
                              minWidth:
                                porcentajeAcompanamiento > 0 ? "4px" : 0,
                              background:
                                "linear-gradient(90deg, #A569BD, #7D3C98)",
                              color: "white",
                              fontSize: "9px",
                              fontWeight: 700,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              transition: "width .3s ease",
                            }}
                          >
                            {porcentajeAcompanamiento >= 18
                              ? `${porcentajeAcompanamiento}%`
                              : ""}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={imprimirResumenAsignaturas}
              style={{
                marginTop: "12px",
                padding: "8px 14px",
                borderRadius: "9px",
                border: "1px solid #c8d5e5",
                background: "#f8f9fc",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🖨️ Imprimir resumen por asignatura
            </button> 
          </div>
        </>
      )}
    </div>
  );
}