export default function RelevamientoInspeccionMatricula({
  mostrarRelevamiento,
  setMostrarRelevamiento,
  anioRelevamiento,
  setAnioRelevamiento,
  relevamientoInspeccion,
  estilos,
}) {
  if (!mostrarRelevamiento) return null;

  const imprimirRelevamiento = () => {
    const fechaEmision = new Date().toLocaleDateString("es-AR");

    const datosPromocion = [
      {
        concepto: "Promocionaron sin adeudar materias",
        valor: relevamientoInspeccion.promocionaron,
      },
      {
        concepto: "Adeudan 1 o 2 materias",
        valor: relevamientoInspeccion.unaODos,
      },
      {
        concepto: "Adeudan 3 o 4 materias",
        valor: relevamientoInspeccion.tresOCuatro,
      },
      {
        concepto: "Adeudan 5 o más materias",
        valor: relevamientoInspeccion.cincoOMas,
      },
      {
        concepto: "Adeudan todas las materias",
        valor: relevamientoInspeccion.todas,
      },
    ];

    const datosNacionalidad = [
      {
        concepto: "Total de estudiantes extranjeros",
        valor: relevamientoInspeccion.extranjeros,
      },
      {
        concepto: "Nacionalidad boliviana",
        valor: relevamientoInspeccion.boliviana,
      },
      {
        concepto: "Nacionalidad paraguaya",
        valor: relevamientoInspeccion.paraguaya,
      },
      {
        concepto: "Nacionalidad peruana",
        valor: relevamientoInspeccion.peruana,
      },
      {
        concepto: "Nacionalidad chilena",
        valor: relevamientoInspeccion.chilena,
      },
      {
        concepto: "Otras nacionalidades",
        valor: relevamientoInspeccion.otros,
      },
    ];

    const datosRecursantes = [
      {
        concepto: "Total de estudiantes recursantes",
        valor: relevamientoInspeccion.recursantes,
      },
      {
        concepto: "Recursantes varones",
        valor: relevamientoInspeccion.recursantesVarones,
      },
    ];

    const crearFilas = (datos) =>
      datos
        .map(
          (item) => `
            <tr>
              <td>${item.concepto}</td>
              <td class="valor">${item.valor ?? 0}</td>
            </tr>
          `,
        )
        .join("");

    const ventana = window.open("", "_blank");

    if (!ventana) {
      window.alert(
        "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes e intentá nuevamente.",
      );
      return;
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />

          <title>Relevamiento para Inspección</title>

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
              color: #243b53;
              background: #ffffff;
              font-size: 12px;
            }

            .encabezado {
              text-align: center;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 2px solid #6f879d;
            }

            .escuela {
              margin: 0 0 5px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.03em;
            }

            h1 {
              margin: 0;
              font-size: 22px;
              color: #1e3a5f;
            }

            .subtitulo {
              margin: 6px 0 0;
              color: #607080;
              font-size: 11px;
            }

            .datos-generales {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              margin-bottom: 16px;
              font-size: 11px;
            }

            .seccion {
              margin-top: 18px;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .seccion h2 {
              margin: 0 0 8px;
              padding: 8px 10px;
              border: 1px solid #bfd3e1;
              border-radius: 6px 6px 0 0;
              background: #eef5f8;
              color: #294d6b;
              font-size: 14px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              border: 1px solid #b9c9d5;
              padding: 8px 10px;
            }

            th {
              background: #f4f7f9;
              color: #294d6b;
              text-align: left;
            }

            td.valor {
              width: 110px;
              text-align: center;
              font-size: 14px;
              font-weight: 700;
              color: #1e3a5f;
            }

            .pie {
              margin-top: 22px;
              padding-top: 10px;
              border-top: 1px solid #c8d5df;
              color: #667085;
              font-size: 10px;
              text-align: right;
            }
          </style>
        </head>

        <body>
          <header class="encabezado">
            <p class="escuela">
              Escuela de Educación Secundaria N.º 140
              “Florencio Molina Campos”
            </p>

            <h1>Relevamiento para Inspección</h1>

            <p class="subtitulo">
              Información institucional de matrícula
            </p>
          </header>

          <div class="datos-generales">
            <span>
              Año relevado:
              <strong>${anioRelevamiento}° año</strong>
            </span>

            <span>
              Fecha de emisión:
              <strong>${fechaEmision}</strong>
            </span>
          </div>

          <section class="seccion">
            <h2>Situación académica</h2>

            <table>
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Cantidad</th>
                </tr>
              </thead>

              <tbody>
                ${crearFilas(datosPromocion)}
              </tbody>
            </table>
          </section>

          <section class="seccion">
            <h2>Nacionalidades extranjeras</h2>

            <table>
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Cantidad</th>
                </tr>
              </thead>

              <tbody>
                ${crearFilas(datosNacionalidad)}
              </tbody>
            </table>
          </section>

          <section class="seccion">
            <h2>Estudiantes recursantes</h2>

            <table>
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Cantidad</th>
                </tr>
              </thead>

              <tbody>
                ${crearFilas(datosRecursantes)}
              </tbody>
            </table>
          </section>

          <footer class="pie">
            Documento generado por el Sistema de Gestión Institucional.
          </footer>
        </body>
      </html>
    `);

    ventana.document.close();

    ventana.onload = () => {
      ventana.focus();

      window.setTimeout(() => {
        ventana.print();
      }, 250);
    };

    ventana.onafterprint = () => {
      ventana.close();
    };
  };

  return (
  <div style={estilos.bloqueHerramienta}>
    <h3
      style={{
        margin: "0 0 14px",
        color: "#1e3a5f",
        textAlign: "center",
      }}
    >
      📊 Relevamiento para Inspección (Cuadernillo)
    </h3>

    <div
      className="no-print"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        margin: "0 0 16px",
        padding: "14px 16px",
        border: "1px solid #c9dce8",
        borderRadius: "12px",
        background: "#f8fbfd",
      }}
    >
      <div>
        <strong
          style={{
            display: "block",
            color: "#1e3a5f",
            fontSize: "16px",
            marginBottom: "7px",
          }}
        >
          Año del relevamiento
        </strong>

        <select
          value={anioRelevamiento}
          onChange={(evento) =>
            setAnioRelevamiento(evento.target.value)
          }
          style={{
            ...estilos.inputAlumno,
            minWidth: "160px",
          }}
        >
          <option value="1">1° año</option>
          <option value="2">2° año</option>
          <option value="3">3° año</option>
          <option value="4">4° año</option>
          <option value="5">5° año</option>
          <option value="6">6° año</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          style={{
            padding: "8px 14px",
            minWidth: "150px",
            minHeight: "42px",
            border: "1px solid #c8d6e2",
            borderRadius: "10px",
            background: "#f4f7f9",
            color: "#445b6e",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
          }}
          onClick={imprimirRelevamiento}
        >
          🖨️ Imprimir
        </button>

        <button
          type="button"
          style={{
            padding: "8px 14px",
            minWidth: "120px",
            minHeight: "42px",
            border: "1px solid #c8d6e2",
            borderRadius: "10px",
            background: "#f4f7f9",
            color: "#445b6e",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
          }}
          onClick={() => setMostrarRelevamiento(false)}
        >
          Ocultar
        </button>
      </div>
    </div>

    <div
      style={{
        marginTop: "12px",
        textAlign: "left",
        lineHeight: "1.8",
      }}
    >
      <p>
        ✅ Promocionaron sin deber materias:{" "}
        <strong>
          {relevamientoInspeccion.promocionaron}
        </strong>
      </p>

      <p>
        📘 Adeudan 1 o 2 materias:{" "}
        <strong>{relevamientoInspeccion.unaODos}</strong>
      </p>

      <p>
        📙 Adeudan 3 o 4 materias:{" "}
        <strong>
          {relevamientoInspeccion.tresOCuatro}
        </strong>
      </p>

      <p>
        📕 Adeudan 5 o más materias:{" "}
        <strong>{relevamientoInspeccion.cincoOMas}</strong>
      </p>

      <p>
        ⚠️ Adeudan todas las materias:{" "}
        <strong>{relevamientoInspeccion.todas}</strong>
      </p>

      <hr style={{ margin: "12px 0" }} />

      <p>
        🌎 Extranjeros:{" "}
        <strong>{relevamientoInspeccion.extranjeros}</strong>
      </p>

      <p>
        Boliviana:{" "}
        <strong>{relevamientoInspeccion.boliviana}</strong>
      </p>

      <p>
        Paraguaya:{" "}
        <strong>{relevamientoInspeccion.paraguaya}</strong>
      </p>

      <p>
        Peruana:{" "}
        <strong>{relevamientoInspeccion.peruana}</strong>
      </p>

      <p>
        Chilena:{" "}
        <strong>{relevamientoInspeccion.chilena}</strong>
      </p>

      <p>
        Otros:{" "}
        <strong>{relevamientoInspeccion.otros}</strong>
      </p>

      <hr style={{ margin: "12px 0" }} />

      <p>
        🔁 Recursantes:{" "}
        <strong>{relevamientoInspeccion.recursantes}</strong>
      </p>

      <p>
        👦 Recursantes varones:{" "}
        <strong>
          {relevamientoInspeccion.recursantesVarones}
        </strong>
      </p>
    </div>
  </div>
);
}