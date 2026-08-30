export default function ListadoLegajosMatricula({
  anioLegajoFiltro,
  alumnosPorLegajo,
  formatearDNI,
  estilos,
}) {
  if (!anioLegajoFiltro) return null;

  const imprimirListadoLegajos = () => {
    if (alumnosPorLegajo.length === 0) {
      window.alert(
        `No hay legajos registrados para el año ${anioLegajoFiltro}.`,
      );
      return;
    }

    const fechaEmision = new Date().toLocaleDateString("es-AR");

    const alumnosOrdenados = [...alumnosPorLegajo].sort((alumnoA, alumnoB) => {
      const numeroA = Number(alumnoA.legajoNumero);
      const numeroB = Number(alumnoB.legajoNumero);

      if (
        !Number.isNaN(numeroA) &&
        !Number.isNaN(numeroB) &&
        numeroA !== numeroB
      ) {
        return numeroA - numeroB;
      }

      const comparacionApellido = String(alumnoA.apellido || "").localeCompare(
        String(alumnoB.apellido || ""),
        "es",
        {
          sensitivity: "base",
        },
      );

      if (comparacionApellido !== 0) {
        return comparacionApellido;
      }

      return String(alumnoA.nombre || "").localeCompare(
        String(alumnoB.nombre || ""),
        "es",
        {
          sensitivity: "base",
        },
      );
    });

    const filas = alumnosOrdenados
      .map((alumno, indice) => {
        const legajo =
          alumno.legajoNumero && alumno.legajoAnio
            ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
            : "—";

        const nombreCompleto = [alumno.apellido, alumno.nombre]
          .filter(Boolean)
          .join(", ");

        const matriz =
          String(alumno.folioMatriz || alumno.libroMatriz || "").trim() || "—";

        return `
          <tr>
            <td class="numero">${indice + 1}</td>
            <td class="legajo">${legajo}</td>
            <td class="estudiante">${nombreCompleto || "—"}</td>
            <td>${formatearDNI(alumno.dni) || "—"}</td>
            <td>${alumno.curso || "—"}</td>
            <td>${alumno.turno || "—"}</td>
            <td>${matriz}</td>
          </tr>
        `;
      })
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

          <title>Listado de Legajos y Matriz</title>

          <style>
            @page {
              size: A4 landscape;
              margin: 11mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #243b53;
              background: #ffffff;
              font-size: 10px;
            }

            .encabezado {
              text-align: center;
              margin-bottom: 12px;
              padding-bottom: 9px;
              border-bottom: 2px solid #6f879d;
            }

            .escuela {
              margin: 0 0 4px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.03em;
            }

            h1 {
              margin: 0;
              color: #1e3a5f;
              font-size: 20px;
            }

            .subtitulo {
              margin: 5px 0 0;
              color: #607080;
              font-size: 10px;
            }

            .datos-generales {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 16px;
              margin-bottom: 11px;
              padding: 7px 9px;
              border: 1px solid #c6d4de;
              border-radius: 5px;
              background: #f7fafc;
              font-size: 10px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }

            thead {
              display: table-header-group;
            }

            tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            th,
            td {
              border: 1px solid #aebfca;
              padding: 6px 5px;
              vertical-align: middle;
            }

            th {
              background: #eaf1f5;
              color: #294d6b;
              font-size: 9px;
              text-align: center;
            }

            td {
              font-size: 9px;
              text-align: center;
            }

            td.numero {
              width: 34px;
            }

            td.legajo {
              font-weight: 700;
              color: #1e3a5f;
            }

            td.estudiante {
              text-align: left;
              font-weight: 700;
            }

            th:nth-child(1) {
              width: 4%;
            }

            th:nth-child(2) {
              width: 11%;
            }

            th:nth-child(3) {
              width: 28%;
            }

            th:nth-child(4) {
              width: 14%;
            }

            th:nth-child(5) {
              width: 10%;
            }

            th:nth-child(6) {
              width: 11%;
            }

            th:nth-child(7) {
              width: 22%;
            }

            .pie {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              margin-top: 10px;
              padding-top: 7px;
              border-top: 1px solid #c8d5df;
              color: #667085;
              font-size: 9px;
            }
          </style>
        </head>

        <body>
          <header class="encabezado">
            <p class="escuela">
              Escuela de Educación Secundaria N.º 140
              “Florencio Molina Campos”
            </p>

            <h1>Listado de Legajos y Matriz</h1>

            <p class="subtitulo">
              Registro institucional para archivo y consulta
            </p>
          </header>

          <div class="datos-generales">
            <span>
              Año de legajo:
              <strong>${anioLegajoFiltro}</strong>
            </span>

            <span>
              Cantidad de registros:
              <strong>${alumnosOrdenados.length}</strong>
            </span>

            <span>
              Fecha de emisión:
              <strong>${fechaEmision}</strong>
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>N.º</th>
                <th>Legajo</th>
                <th>Apellido y nombre</th>
                <th>DNI</th>
                <th>Curso</th>
                <th>Turno</th>
                <th>Libro / Folio matriz</th>
              </tr>
            </thead>

            <tbody>
              ${filas}
            </tbody>
          </table>

          <footer class="pie">
            <span>
              Total de registros impresos:
              <strong>${alumnosOrdenados.length}</strong>
            </span>

            <span>
              Documento generado por el Sistema de Gestión Institucional.
            </span>
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
    <div style={estilos.detalleCurso}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#1e3a5f",
          }}
        >
          🧾 Listado de legajos {anioLegajoFiltro}
        </h3>

        <button
          type="button"
          onClick={imprimirListadoLegajos}
          disabled={alumnosPorLegajo.length === 0}
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
            opacity: alumnosPorLegajo.length === 0 ? 0.55 : 1,
            cursor: alumnosPorLegajo.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          🖨️ Imprimir
        </button>
      </div>

      <p>
        Cantidad de legajos {anioLegajoFiltro}:{" "}
        <strong>{alumnosPorLegajo.length}</strong>
      </p>

      {alumnosPorLegajo.length === 0 ? (
        <div
          style={{
            marginTop: "12px",
            padding: "18px",
            border: "1px dashed #c7d7e3",
            borderRadius: "10px",
            background: "#fafcfd",
            color: "#607080",
            textAlign: "center",
          }}
        >
          No hay legajos registrados para el año seleccionado.
        </div>
      ) : (
        <div className="tabla-scroll-mobile">
          <table style={estilos.tabla}>
            <thead>
              <tr>
                <th style={estilos.celda}>Legajo</th>
                <th style={estilos.celda}>Apellido y Nombre</th>
                <th style={estilos.celda}>DNI</th>
                <th style={estilos.celda}>Curso</th>
                <th style={estilos.celda}>Turno</th>
                <th style={estilos.celda}>Libro / Folio matriz</th>
              </tr>
            </thead>

            <tbody>
              {alumnosPorLegajo.map((alumno) => (
                <tr key={alumno._id}>
                  <td style={estilos.celda}>
                    {alumno.legajoNumero && alumno.legajoAnio
                      ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                      : "—"}
                  </td>

                  <td style={estilos.celda}>
                    {alumno.apellido}, {alumno.nombre}
                  </td>

                  <td style={estilos.celda}>{formatearDNI(alumno.dni)}</td>

                  <td style={estilos.celda}>{alumno.curso || "—"}</td>

                  <td style={estilos.celda}>{alumno.turno || "—"}</td>

                  <td style={estilos.celda}>
                    {String(
                      alumno.folioMatriz || alumno.libroMatriz || "",
                    ).trim() || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
