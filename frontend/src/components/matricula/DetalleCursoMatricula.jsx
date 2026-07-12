export default function DetalleCursoMatricula({
  esAdmin,
  alumnosDelCurso,
  alumnosFiltrados,
  ordenCurso,
  setOrdenCurso,
  filtroAvanzado,
  setFiltroAvanzado,
  setFiltroPrevia,
  setFiltroAnioPrevia,
  formatearDNI,
  formatearFecha,
  calcularEdadAl30Junio,
  tieneSobreedad,
  editarAlumno,
  prepararMovimiento,
  eliminarAlumnoMatricula,
  estilos,
}) {
  const {
    botonVolver,
    inputAlumno,
    tablaResponsive,
    tabla,
    celda,
    alertaSobreedad,
    botonEditar,
    botonMover,
    botonEliminar,
  } = estilos;

  return (
    <>
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <button
          type="button"
          style={botonVolver}
          onClick={() => {
            setFiltroPrevia("");
            setFiltroAnioPrevia("");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      <select
        style={inputAlumno}
        value={ordenCurso}
        onChange={(e) => setOrdenCurso(e.target.value)}
      >
        <option value="apellido">Ordenar por apellido</option>
        <option value="legajo">Ordenar por legajo</option>
        <option value="matriz">Ordenar por Libro/Folio</option>
      </select>

      <p
        style={{
          marginTop: "12px",
          marginBottom: "5px",
          fontWeight: "bold",
          color: "#1e3a5f",
          textAlign: "center",
        }}
      >
        Filtro avanzado
      </p>

      <select
        value={filtroAvanzado}
        onChange={(e) => setFiltroAvanzado(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "12px",
          marginBottom: "12px",
          width: "220px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <option value="todos">Todos</option>
        <option value="prom">Sólo Prom</option>
        <option value="rec">Sólo Rec</option>
        <option value="previas">Con previas</option>
        <option value="sinLegajo">Sin legajo</option>
        <option value="sobreedad">Sobreedad</option>
        <option value="ingresante">Ingresantes</option>
        <option value="reinscripto">Reinscriptos</option>
      </select>

      <div style={tablaResponsive}>
        <table style={tabla}>
          <thead>
            <tr>
              <th style={{ ...celda, width: "280px" }}>
                Apellido y Nombre
              </th>

              <th style={celda}>DNI</th>
              <th style={celda}>Legajo</th>
              <th style={celda}>Nacionalidad</th>
              <th style={celda}>Sexo</th>
              <th style={celda}>Libro/Folio</th>

              <th style={{ ...celda, width: "95px" }}>
                Fecha nacimiento
              </th>

              <th style={{ ...celda, width: "55px" }}>
                Edad
              </th>

              <th style={{ ...celda, width: "240px" }}>
                Pendientes
              </th>

              <th style={{ ...celda, width: "65px" }}>
                Cond.
              </th>

              <th style={{ ...celda, width: "140px" }}>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {alumnosDelCurso.length === 0 && (
              <tr>
                <td style={celda} colSpan="11">
                  Todavía no hay estudiantes cargados en este curso.
                </td>
              </tr>
            )}

            {alumnosFiltrados.map((alumno) => (
              <tr
                key={alumno._id}
                style={{
                  backgroundColor:
                    alumno.sexo === "Varón"
                      ? "#eeeeee"
                      : "white",
                }}
              >
                <td style={celda}>
                  {alumno.apellido}, {alumno.nombre}
                </td>

                <td style={celda}>
                  {formatearDNI(alumno.dni)}
                </td>

                <td style={celda}>
                  {alumno.legajoNumero && alumno.legajoAnio
                    ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                    : "-"}
                </td>

                <td style={celda}>
                  {String(alumno.nacionalidad || "-")}
                </td>

                <td style={celda}>
                  {String(alumno.sexo || "-")}
                </td>

                <td style={celda}>
                  {alumno.libroMatriz && alumno.folioMatriz
                    ? `${alumno.libroMatriz}/${alumno.folioMatriz}`
                    : alumno.folioMatriz
                      ? alumno.folioMatriz
                      : alumno.libroMatriz
                        ? alumno.libroMatriz
                        : "-"}
                </td>

                <td style={celda}>
                  {formatearFecha(alumno.fechaNacimiento)}
                </td>

                <td style={celda}>
                  {calcularEdadAl30Junio(
                    alumno.fechaNacimiento,
                  )}

                  {tieneSobreedad(alumno) && (
                    <span style={alertaSobreedad}>⚠️</span>
                  )}
                </td>

                <td style={celda}>
                  {Array.isArray(alumno.materiasPendientes)
                    ? alumno.materiasPendientes
                        .map((previa) =>
                          previa.asignatura === "----------"
                            ? "----------"
                            : `${previa.asignatura} (${previa.anio})`,
                        )
                        .join(", ")
                    : ""}
                </td>

                <td style={celda}>
                  {alumno.condicionFinal}
                </td>

                <td
                  style={{
                    ...celda,
                    whiteSpace: "nowrap",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      ...botonEditar,
                      opacity: esAdmin ? 1 : 0.45,
                      cursor: esAdmin
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() =>
                      esAdmin && editarAlumno(alumno)
                    }
                    title={
                      esAdmin
                        ? "Editar estudiante"
                        : "Solo el administrador puede editar"
                    }
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    style={{
                      ...botonMover,
                      opacity: esAdmin ? 1 : 0.45,
                      cursor: esAdmin
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() => {
                      if (!esAdmin) return;

                      prepararMovimiento(alumno);

                      setTimeout(() => {
                        document
                          .getElementById(
                            "movimiento-matricula",
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 100);
                    }}
                    title={
                      esAdmin
                        ? "Mover estudiante"
                        : "Solo el administrador puede mover estudiantes"
                    }
                  >
                    🔁
                  </button>

                  <button
                    type="button"
                    style={{
                      ...botonEliminar,
                      opacity: esAdmin ? 1 : 0.45,
                      cursor: esAdmin
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() =>
                      esAdmin &&
                      eliminarAlumnoMatricula(alumno._id)
                    }
                    title={
                      esAdmin
                        ? "Eliminar estudiante"
                        : "Solo el administrador puede eliminar"
                    }
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}