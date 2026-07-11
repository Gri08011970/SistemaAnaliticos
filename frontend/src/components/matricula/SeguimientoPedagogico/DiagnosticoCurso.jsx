export default function DiagnosticoCurso({ indice, estadoCurso }) {
  const imprimirDiagnostico = () => {
    const contenido = document.getElementById(
      "diagnostico-curso-imprimir",
    )?.innerHTML;

    if (!contenido) return;

    const ventana = window.open("", "_blank");

    ventana.document.write(`
      <html>
        <head>
          <title>Diagnóstico pedagógico del curso</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 18mm;
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
      id="diagnostico-curso-imprimir"
      style={{
        maxWidth: "520px",
        margin: "20px auto",
        padding: "16px",
        borderRadius: "16px",
        background: "#f9fcff",
        border: "2px solid  #bcd7e3",
        boxShadow:  "0 5px 14px rgba(44, 84, 116, 0.10)",
        textAlign: "center",
      
      }}
    >
      <h4 style={{ margin: "0 0 10px" }}>
        🚦 Diagnóstico pedagógico del curso
      </h4>

      <div
        style={{
          height: "18px",
          borderRadius: "20px",
          background: "#e9eef2",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${indice}%`,
            height: "100%",
            background:
              indice >= 75
                ? "#7ed957"
                : indice >= 50
                  ? "#ffd966"
                  : "#ff6b6b",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        {indice}%
      </div>

      <div
        style={{
          marginTop: "6px",
          fontWeight: 700,
        }}
      >
        {estadoCurso}
      </div>

      <button
        type="button"
        onClick={imprimirDiagnostico}
        style={{
          marginTop: "14px",
          padding: "8px 14px",
          borderRadius: "9px",
          border: "1px solid #c8d5e5",
          background: "#ffffff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        🖨️ Imprimir diagnóstico
      </button>
    </div>
  );
}