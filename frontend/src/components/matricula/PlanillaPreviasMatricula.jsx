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
      <h3 style={{ color: "#1e3a5f" }}>📋 Planilla de examen: PREVIAS</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <select
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
        <h3 style={{ color: "#1e3a5f" }}>📋 Planilla de examen: PREVIAS</h3>

        <p>Cantidad de estudiantes: {alumnosParaExamen.length}</p>

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

                  const coincideAnio = !anioExamen || previa.anio === anioExamen;

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
                ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <button style={estilos.botonImprimir} onClick={imprimirPlanillaPrevias}>
          🖨️ Imprimir planilla
        </button>

        <button style={estilos.botonVolver} onClick={cerrarPlanillaPrevias}>
          Cerrar planilla
        </button>
      </div>
    </div>
  );
}