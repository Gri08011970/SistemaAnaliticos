import { useState } from "react";

export default function ResumenAsignaturas({ estadisticasPorAsignatura }) {
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const imprimirResumenAsignaturas = () => {
    const contenido = document.getElementById(
      "resumen-asignaturas-imprimir",
    )?.innerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

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

  return (
    <div
      id="resumen-asignaturas-imprimir"
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
        onClick={() => setMostrarResumen(!mostrarResumen)}
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
              borderTop: "6px solid #5d86b0",
            }}
          >
            {estadisticasPorAsignatura.map((item) => (
              <div
                key={item.asignatura}
                style={{
                  border: "1px solid #d7e5ec",
                  borderRadius: "12px",
                  padding: "8px",
                  background: "white",
                  boxShadow: "0 2px 6px rgba(0,0,0,.05)",
                  minHeight: "118px",
                  
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "12px",
                    marginBottom: "6px",
                    lineHeight: "1.15",
                    color: "#43506f",
                   
                  }}
                >
                  {item.asignatura}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                     
                  }}
                >
                  <span>🟢 {item.tea}</span>
                  <span>🟡 {item.tep}</span>
                  <span>🔴 {item.ted}</span>
                </div>

                {item.totalCargados === 0 ? (
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
                        padding: "4px",
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
                        marginTop: "8px",
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#6b7280",
                        fontWeight: 600,
                      }}
                    >
                      Índice
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#43506f",
                      }}
                    >
                      {item.indice}%
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        textAlign: "center",
                        padding: "4px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "11px",
                        background:
                          item.estado === "🟢 Excelente"
                            ? "#eef8ee"
                            : item.estado === "🟡 Observar"
                              ? "#fff8df"
                              : "#ffeaea",
                        color:
                          item.estado === "🟢 Excelente"
                            ? "#2f7d32"
                            : item.estado === "🟡 Observar"
                              ? "#8a6d00"
                              : "#b42318",
                      }}
                    >
                      {item.estado}
                    </div>
                  </>
                )}
              </div>
            ))}
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
                fontWeight: "600",
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