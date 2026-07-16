export default function ArchivoLegajoMatrizMatricula({
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
  return (
  <div
    style={{
      ...estilos.bloqueHerramienta,
      padding:
        !anioLegajoFiltro && !libroMatrizFiltro
          ? "14px 18px"
          : "18px",
    }}
  >
    <h3
      style={{
        color: "#1e3a5f",
        margin: "0 0 10px",
        fontSize: "20px",
        lineHeight: "1.2",
      }}
    >
      📦 Legajos y matriz para archivo
    </h3>

    {!anioLegajoFiltro && !libroMatrizFiltro ? (
      <p
        style={{
          margin: 0,
          color: "#665d70",
          fontSize: "16px",
        }}
      >
        Seleccioná un año de legajo o un libro matriz.
      </p>
    ) : (
      <>
        {anioLegajoFiltro && (
          <div
            style={{
              marginBottom: libroMatrizFiltro ? "18px" : 0,
            }}
          >
            <p style={{ margin: "6px 0" }}>
              Año de legajo:{" "}
              <strong>{anioLegajoFiltro}</strong>
            </p>

            <p style={{ margin: "6px 0 12px" }}>
              Legajos faltantes:{" "}
              <strong>
                {
                  obtenerLegajosFaltantes(
                    anioLegajoFiltro,
                  ).length
                }
              </strong>
            </p>

            <button
              style={{
                ...estilos.botonImprimir,
                minWidth: "150px",
              }}
              onClick={() =>
                setMostrarLegajosArchivo(
                  !mostrarLegajosArchivo,
                )
              }
            >
              {mostrarLegajosArchivo
                ? "Ocultar legajos"
                : "Ver legajos"}
            </button>

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
          </div>
        )}

        {libroMatrizFiltro && (
          <div style={estilos.detalleCurso}>
            <h3
              style={{
                color: "#1e3a5f",
                marginTop: 0,
              }}
            >
              📖 Listado de matriz - Libro{" "}
              {libroMatrizFiltro}
            </h3>

            <p>
              Cantidad de registros del libro{" "}
              {libroMatrizFiltro}:{" "}
              {alumnosPorMatriz.length}
            </p>

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
        )}

        {libroMatrizFiltro && (
          <div
            style={{
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px solid #cfd8dc",
            }}
          >
            <p style={{ margin: "6px 0" }}>
              Libro matriz:{" "}
              <strong>{libroMatrizFiltro}</strong>
            </p>

            <p style={{ margin: "6px 0 12px" }}>
              Folios faltantes:{" "}
              <strong>
                {
                  obtenerFoliosFaltantes(
                    libroMatrizFiltro,
                  ).length
                }
              </strong>
            </p>

            <button
              style={{
                ...estilos.botonImprimir,
                minWidth: "150px",
              }}
              onClick={() =>
                setMostrarMatrizArchivo(
                  !mostrarMatrizArchivo,
                )
              }
            >
              {mostrarMatrizArchivo
                ? "Ocultar folios"
                : "Ver folios"}
            </button>

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
          </div>
        )}
      </>
    )}
  </div>
);
}
