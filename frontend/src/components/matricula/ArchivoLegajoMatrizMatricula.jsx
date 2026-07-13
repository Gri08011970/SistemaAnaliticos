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
    <div style={estilos.bloqueHerramienta}>
      <h3 style={{ color: "#1e3a5f" }}>📦 Legajos y matriz para archivo</h3>

      {!anioLegajoFiltro && !libroMatrizFiltro ? (
        <p>Seleccioná un año de legajo o un libro matriz.</p>
      ) : (
        <>
          {anioLegajoFiltro && (
            <>
              <p>
                Año de legajo: <strong>{anioLegajoFiltro}</strong>
              </p>

              <p>
                Legajos faltantes:{" "}
                <strong>{obtenerLegajosFaltantes(anioLegajoFiltro).length}</strong>
              </p>

              <button
                style={estilos.botonImprimir}
                onClick={() => setMostrarLegajosArchivo(!mostrarLegajosArchivo)}
              >
                {mostrarLegajosArchivo ? "Ocultar legajos" : "Ver legajos"}
              </button>

              {mostrarLegajosArchivo && (
                <div style={estilos.cajaArchivo}>
                  {obtenerLegajosFaltantes(anioLegajoFiltro).length === 0 ? (
                    <p>No hay legajos faltantes.</p>
                  ) : (
                    <p>
                      {obtenerLegajosFaltantes(anioLegajoFiltro)
                        .map((numero) => `${numero}/${anioLegajoFiltro}`)
                        .join(" - ")}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {libroMatrizFiltro && (
            <div style={estilos.detalleCurso}>
              <h3 style={{ color: "#1e3a5f" }}>
                📖 Listado de matriz - Libro {libroMatrizFiltro}
              </h3>

              <p>
                Cantidad de registros del libro {libroMatrizFiltro}:{" "}
                {alumnosPorMatriz.length}
              </p>
            <div className="tabla-scroll-mobile">
              <table style={estilos.tabla}>
                <thead>
                  <tr>
                    <th style={estilos.celda}>Libro/Folio</th>
                    <th style={estilos.celda}>Apellido y Nombre</th>
                    <th style={estilos.celda}>DNI</th>
                    <th style={estilos.celda}>Curso</th>
                    <th style={estilos.celda}>Turno</th>
                    <th style={estilos.celda}>Legajo</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosPorMatriz.map((alumno) => (
                    <tr key={alumno._id}>
                      <td style={estilos.celda}>
                        {alumno.folioMatriz || alumno.libroMatriz || "-"}
                      </td>

                      <td style={estilos.celda}>
                        {alumno.apellido}, {alumno.nombre}
                      </td>

                      <td style={estilos.celda}>{formatearDNI(alumno.dni)}</td>
                      <td style={estilos.celda}>{alumno.curso}</td>
                      <td style={estilos.celda}>{alumno.turno}</td>

                      <td style={estilos.celda}>
                        {alumno.legajoNumero && alumno.legajoAnio
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
            <>
              <hr />

              <p>
                Libro matriz: <strong>{libroMatrizFiltro}</strong>
              </p>

              <p>
                Folios faltantes:{" "}
                <strong>{obtenerFoliosFaltantes(libroMatrizFiltro).length}</strong>
              </p>

              <button
                style={estilos.botonImprimir}
                onClick={() => setMostrarMatrizArchivo(!mostrarMatrizArchivo)}
              >
                {mostrarMatrizArchivo ? "Ocultar folios" : "Ver folios"}
              </button>

              {mostrarMatrizArchivo && (
                <div style={estilos.cajaArchivo}>
                  {obtenerFoliosFaltantes(libroMatrizFiltro).length === 0 ? (
                    <p>No hay folios faltantes.</p>
                  ) : (
                    <p>
                      {obtenerFoliosFaltantes(libroMatrizFiltro).join(" - ")}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}