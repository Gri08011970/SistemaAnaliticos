export default function ArchivoLegajoMatrizMatricula({
  modo,
  anioLegajoFiltro,
  libroMatrizFiltro,
  mostrarLegajosArchivo,
  setMostrarLegajosArchivo,
  mostrarMatrizArchivo,
  setMostrarMatrizArchivo,
  obtenerLegajosFaltantes,
  obtenerFoliosFaltantes,
  alumnosPorMatriz,
  formatearDNI,
  estilos,
}) {
  const esLegajos = modo === "legajos";
  const esMatriz = modo === "matriz";

  const estiloAccionSecundaria = {
    padding: "8px 14px",
    minHeight: "42px",
    border: "1px solid #c8d6e2",
    borderRadius: "10px",
    background: "#f4f7f9",
    color: "#445b6e",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  };

  if (esLegajos && !anioLegajoFiltro) {
    return null;
  }

  if (esMatriz && !libroMatrizFiltro) {
    return null;
  }
 const imprimirListadoMatriz = () => {
  if (!libroMatrizFiltro || alumnosPorMatriz.length === 0) {
    window.alert("No hay registros del libro matriz para imprimir.");
    return;
  }

  const fechaEmision = new Date().toLocaleDateString("es-AR");

  const filas = alumnosPorMatriz
    .map((alumno) => {
      const legajo =
        alumno.legajoNumero && alumno.legajoAnio
          ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
          : "—";

      return `
        <tr>
          <td>${alumno.folioMatriz || alumno.libroMatriz || "—"}</td>
          <td>${alumno.apellido || ""}, ${alumno.nombre || ""}</td>
          <td>${formatearDNI(alumno.dni) || "—"}</td>
          <td>${alumno.curso || "—"}</td>
          <td>${alumno.turno || "—"}</td>
          <td>${legajo}</td>
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

        <title>Libro matriz ${libroMatrizFiltro}</title>

        <style>
          @page {
            size: A4 landscape;
            margin: 11mm;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #243b53;
            font-size: 10px;
          }

          header {
            text-align: center;
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 2px solid #6f879d;
          }

          h1 {
            margin: 0;
            color: #1e3a5f;
            font-size: 20px;
          }

          .escuela {
            margin: 0 0 5px;
            font-weight: 700;
          }

          .datos {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 12px;
            padding: 8px 10px;
            border: 1px solid #c6d4de;
            background: #f7fafc;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            display: table-header-group;
          }

          th,
          td {
            border: 1px solid #aebfca;
            padding: 6px;
            text-align: center;
          }

          th {
            background: #eaf1f5;
            color: #294d6b;
          }

          tr {
            break-inside: avoid;
          }
        </style>
      </head>

      <body>
        <header>
          <p class="escuela">
            Escuela de Educación Secundaria N.º 140
            “Florencio Molina Campos”
          </p>

          <h1>Libro matriz ${libroMatrizFiltro}</h1>
        </header>

        <div class="datos">
          <span>
            Registros:
            <strong>${alumnosPorMatriz.length}</strong>
          </span>

          <span>
            Folios faltantes:
            <strong>
              ${obtenerFoliosFaltantes(libroMatrizFiltro).length}
            </strong>
          </span>

          <span>
            Fecha:
            <strong>${fechaEmision}</strong>
          </span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Libro / Folio</th>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              <th>Curso</th>
              <th>Turno</th>
              <th>Legajo</th>
            </tr>
          </thead>

          <tbody>
            ${filas}
          </tbody>
        </table>
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
    <div
      style={{
        ...estilos.bloqueHerramienta,
        padding: "18px",
      }}
    >
      {/* ======================================================
          LEGAJOS
         ====================================================== */}

      {esLegajos && (
        <>
          <h3
            style={{
              color: "#1e3a5f",
              margin: "0 0 12px",
              fontSize: "20px",
              lineHeight: "1.2",
            }}
          >
            📦 Control de legajos para archivo
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
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
                  marginBottom: "4px",
                }}
              >
                Año de legajo: {anioLegajoFiltro}
              </strong>

              <span
                style={{
                  color: "#607080",
                  fontSize: "14px",
                }}
              >
                {
                  obtenerLegajosFaltantes(
                    anioLegajoFiltro,
                  ).length
                }{" "}
                legajos faltantes
              </span>
            </div>

            <button
              type="button"
              style={{
                ...estiloAccionSecundaria,
                minWidth: "170px",
              }}
              onClick={() =>
                setMostrarLegajosArchivo(
                  !mostrarLegajosArchivo,
                )
              }
            >
              {mostrarLegajosArchivo
                ? "Ocultar legajos faltantes"
                : "Ver legajos faltantes"}
            </button>
          </div>

          {mostrarLegajosArchivo && (
            <div style={estilos.cajaArchivo}>
              {obtenerLegajosFaltantes(
                anioLegajoFiltro,
              ).length === 0 ? (
                <p style={{ margin: 0 }}>
                  No hay legajos faltantes.
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  {obtenerLegajosFaltantes(
                    anioLegajoFiltro,
                  )
                    .map(
                      (numero) =>
                        `${numero}/${anioLegajoFiltro}`,
                    )
                    .join(" - ")}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* ======================================================
          LIBRO MATRIZ
         ====================================================== */}

      {esMatriz && (
        <>
          <h3
            style={{
              color: "#1e3a5f",
              margin: "0 0 12px",
              fontSize: "20px",
              lineHeight: "1.2",
            }}
          >
            📖 Listado de matriz - Libro {libroMatrizFiltro}
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
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
                  marginBottom: "4px",
                }}
              >
                Libro matriz: {libroMatrizFiltro}
              </strong>

              <span
                style={{
                  display: "block",
                  color: "#607080",
                  fontSize: "14px",
                  marginBottom: "3px",
                }}
              >
                {alumnosPorMatriz.length} registros
              </span>

              <span
                style={{
                  color: "#607080",
                  fontSize: "14px",
                }}
              >
                {
                  obtenerFoliosFaltantes(
                    libroMatrizFiltro,
                  ).length
                }{" "}
                folios faltantes
              </span>
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
                  ...estiloAccionSecundaria,
                  minWidth: "120px",
                  opacity:
                    alumnosPorMatriz.length === 0 ? 0.55 : 1,
                  cursor:
                    alumnosPorMatriz.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={imprimirListadoMatriz}
                disabled={alumnosPorMatriz.length === 0}
              >
                🖨️ Imprimir
              </button>

              <button
                type="button"
                style={{
                  ...estiloAccionSecundaria,
                  minWidth: "180px",
                }}
                onClick={() =>
                  setMostrarMatrizArchivo(
                    !mostrarMatrizArchivo,
                  )
                }
              >
                {mostrarMatrizArchivo
                  ? "Ocultar folios faltantes"
                  : "Ver folios faltantes"}
              </button>
            </div>
          </div>

          {mostrarMatrizArchivo && (
            <div style={estilos.cajaArchivo}>
              {obtenerFoliosFaltantes(
                libroMatrizFiltro,
              ).length === 0 ? (
                <p style={{ margin: 0 }}>
                  No hay folios faltantes.
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  {obtenerFoliosFaltantes(
                    libroMatrizFiltro,
                  ).join(" - ")}
                </p>
              )}
            </div>
          )}

          <div style={estilos.detalleCurso}>
            <div className="tabla-scroll-mobile">
              <table style={estilos.tabla}>
                <thead>
                  <tr>
                    <th style={estilos.celda}>
                      Libro/Folio
                    </th>

                    <th style={estilos.celda}>
                      Apellido y Nombre
                    </th>

                    <th style={estilos.celda}>
                      DNI
                    </th>

                    <th style={estilos.celda}>
                      Curso
                    </th>

                    <th style={estilos.celda}>
                      Turno
                    </th>

                    <th style={estilos.celda}>
                      Legajo
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosPorMatriz.map((alumno) => (
                    <tr key={alumno._id}>
                      <td style={estilos.celda}>
                        {alumno.folioMatriz ||
                          alumno.libroMatriz ||
                          "-"}
                      </td>

                      <td style={estilos.celda}>
                        {alumno.apellido},{" "}
                        {alumno.nombre}
                      </td>

                      <td style={estilos.celda}>
                        {formatearDNI(alumno.dni)}
                      </td>

                      <td style={estilos.celda}>
                        {alumno.curso}
                      </td>

                      <td style={estilos.celda}>
                        {alumno.turno}
                      </td>

                      <td style={estilos.celda}>
                        {alumno.legajoNumero &&
                        alumno.legajoAnio
                          ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}