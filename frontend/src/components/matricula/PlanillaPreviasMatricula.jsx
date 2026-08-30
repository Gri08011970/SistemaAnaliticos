export default function PlanillaPreviasMatricula({
  verPlanillaPrevias,
  materiaExamen,
  setMateriaExamen,
  anioExamen,
  setAnioExamen,
  turnoExamen,
  setTurnoExamen,
  asignaturas,
  aniosMateria,
  alumnosParaExamen,
  formatearDNI,
  imprimirPlanillaPrevias,
  cerrarPlanillaPrevias,
  estilos,
}) {
  if (!verPlanillaPrevias) return null;

  return (
    <div style={estilos.detalleCurso}>
      <h3
        style={{
          color: "#1e3a5f",
          textAlign: "center",
        }}
      >
        📋 Planilla de examen: PREVIAS
      </h3>

      <div
        className="filtros-previas-responsive"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <select
          className="select-previas-responsive"
          style={estilos.inputAlumno}
          value={materiaExamen}
          onChange={(e) => setMateriaExamen(e.target.value)}
        >
          <option value="">Seleccionar asignatura</option>

          {asignaturas.map((asignatura) => (
            <option key={asignatura} value={asignatura}>
              {asignatura}
            </option>
          ))}
        </select>

        <select
          className="select-previas-responsive"
          style={estilos.inputAlumno}
          value={anioExamen}
          onChange={(e) => setAnioExamen(e.target.value)}
        >
          <option value="">Seleccionar año</option>

          {aniosMateria.map((anio) => (
            <option key={anio} value={anio}>
              {anio}
            </option>
          ))}
        </select>

        <select
          className="select-previas-responsive"
          style={estilos.inputAlumno}
          value={turnoExamen}
          onChange={(e) => setTurnoExamen(e.target.value)}
        >
          <option value="">Todos los turnos</option>
          <option value="Mañana">Turno Mañana</option>
          <option value="Tarde">Turno Tarde</option>
        </select>
      </div>

      <div id="planilla-previas-imprimir">
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            margin: "18px 0 16px",
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
              Resultados de la planilla
            </strong>

            <span
              style={{
                color: "#607080",
                fontSize: "14px",
              }}
            >
              {alumnosParaExamen.length} estudiantes encontrados
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
                padding: "8px 14px",
                minWidth: "135px",
                minHeight: "42px",
                border: "1px solid #c8d6e2",
                borderRadius: "10px",
                background: "#f4f7f9",
                color: "#445b6e",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onClick={imprimirPlanillaPrevias}
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
              onClick={cerrarPlanillaPrevias}
            >
              Ocultar
            </button>
          </div>
        </div>

        <p
          className="solo-print"
          style={{
            textAlign: "center",
            marginBottom: "14px",
          }}
        >
          Cantidad de estudiantes: {alumnosParaExamen.length}
        </p>

        {alumnosParaExamen.length === 0 && (
          <p style={estilos.mensajeNoEncontrado}>
            No hay estudiantes para esa materia, año y turno.
          </p>
        )}

        <table style={estilos.tabla}>
          <thead>
            <tr>
              <th style={estilos.celda}>Apellido y Nombre</th>
              <th style={estilos.celda}>DNI</th>
              <th style={estilos.celda}>Curso</th>
              <th style={estilos.celda}>Turno</th>
              <th style={estilos.celda}>Materia</th>
              <th style={estilos.celda}>Año</th>
            </tr>
          </thead>

          <tbody>
            {alumnosParaExamen.map((alumno) =>
              alumno.materiasPendientes
                .filter((previa) => {
                  if (previa.asignatura === "----------") return false;

                  const coincideMateria =
                    !materiaExamen || previa.asignatura === materiaExamen;

                  const coincideAnio =
                    !anioExamen || previa.anio === anioExamen;

                  return coincideMateria && coincideAnio;
                })
                .map((previa, index) => (
                  <tr key={`${alumno._id}-${index}`}>
                    <td style={estilos.celda}>
                      {alumno.apellido}, {alumno.nombre}
                    </td>

                    <td style={estilos.celda}>{formatearDNI(alumno.dni)}</td>

                    <td style={estilos.celda}>{alumno.curso}</td>

                    <td style={estilos.celda}>{alumno.turno}</td>

                    <td style={estilos.celda}>{previa.asignatura}</td>

                    <td style={estilos.celda}>{previa.anio}</td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
