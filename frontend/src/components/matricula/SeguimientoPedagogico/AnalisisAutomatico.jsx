export default function AnalisisAutomatico({
  fechaAnalisis,
  alumnosCurso,
  asignaturasResumen,
  periodoSeleccionado,
  observacionesSistema,
}) {
  const imprimirAnalisis = () => {
    const contenido = document.getElementById(
      "analisis-automatico-imprimir",
    )?.innerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

    ventana.document.write(`
      <html>
        <head>
          <title>Análisis automático del curso</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 16mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #222;
            }

            h4 {
              text-align: center;
              font-size: 18px;
              margin-bottom: 10px;
            }

            ul {
              padding-left: 22px;
              line-height: 1.5;
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
      id="analisis-automatico-imprimir"
      style={{
        maxWidth: "680px",
        margin: "18px auto",
        padding: "12px 16px",
        borderRadius: "16px",
        background: "#ffffff",
        border: "2px solid #bcd7e3",
        boxShadow: "0 5px 14px rgba(44, 84, 116, 0.10)",
        textAlign: "left",
      }}
    >
      <h4
        style={{
          marginTop: 0,
          marginBottom: "8px",
          textAlign: "center",
          color: "#43506f",
        }}
      >
        🧠 Análisis automático del curso
      </h4>

      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#6b7280",
          marginTop: 0,
          marginBottom: "14px",
          lineHeight: "1.35",
        }}
      >
        Emitido automáticamente: <strong>{fechaAnalisis} hs</strong>
        <br />
        Datos analizados:
        <strong> {alumnosCurso.length}</strong> estudiantes ·
        <strong> {asignaturasResumen.length}</strong> asignaturas · Período{" "}
        <strong>{periodoSeleccionado}</strong>
      </p>

      {observacionesSistema.fortalezas.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <strong style={{ fontSize: "13px" }}>
            🟢 Fortalezas detectadas
          </strong>

          <ul
            style={{
              marginTop: "6px",
              marginBottom: "8px",
              paddingLeft: "18px",
              fontSize: "12px",
              lineHeight: "1.35",
            }}
          >
            {observacionesSistema.fortalezas.map((texto, index) => (
              <li key={index}>{texto}</li>
            ))}
          </ul>
        </div>
      )}

      {observacionesSistema.pendientes.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <strong style={{ fontSize: "13px" }}>
            🟡 Aspectos a completar o seguir
          </strong>

          <ul
            style={{
              marginTop: "6px",
              marginBottom: "8px",
              paddingLeft: "18px",
              fontSize: "12px",
              lineHeight: "1.35",
            }}
          >
            {observacionesSistema.pendientes.map((texto, index) => (
              <li key={index}>{texto}</li>
            ))}
          </ul>
        </div>
      )}

      {observacionesSistema.recomendaciones.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <strong style={{ fontSize: "13px" }}>
            📌 Recomendación institucional
          </strong>

          <ul
            style={{
              marginTop: "6px",
              marginBottom: "8px",
              paddingLeft: "18px",
              fontSize: "12px",
              lineHeight: "1.35",
            }}
          >
            {observacionesSistema.recomendaciones.map((texto, index) => (
              <li key={index}>{texto}</li>
            ))}
          </ul>
        </div>
      )}

      <p
        style={{
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid #d7e5ec",
          fontSize: "10.5px",
          color: "#6b7280",
          textAlign: "center",
          lineHeight: "1.35",
        }}
      >
        Diagnóstico generado automáticamente por el Sistema de Seguimiento
        Pedagógico.
        <br />
        <strong>E.E.S. N.º 140</strong>
        <br />
        Este informe constituye un apoyo para el análisis pedagógico
        institucional y no reemplaza la valoración profesional del equipo
        docente y directivo.
      </p>

      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={imprimirAnalisis}
          style={{
            marginTop: "10px",
            padding: "8px 14px",
            borderRadius: "9px",
            border: "1px solid #c8d5e5",
            background: "#f8f9fc",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🖨️ Imprimir análisis
        </button>
      </div>
    </div>
  );
}
