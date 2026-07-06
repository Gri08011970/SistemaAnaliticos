export default function ListadoLegajosMatricula({
  anioLegajoFiltro,
  alumnosPorLegajo,
  formatearDNI,
  estilos,
}) {
  if (!anioLegajoFiltro) return null;

  return (
    <div style={estilos.detalleCurso}>
      <h3 style={{ color: "#1e3a5f" }}>
        🧾 Listado de legajos {anioLegajoFiltro}
      </h3>

      <p>
        Cantidad de legajos {anioLegajoFiltro}:{" "}
        {alumnosPorLegajo.length}
      </p>

      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.celda}>Legajo</th>
            <th style={estilos.celda}>Apellido y Nombre</th>
            <th style={estilos.celda}>DNI</th>
            <th style={estilos.celda}>Curso</th>
            <th style={estilos.celda}>Turno</th>
          </tr>
        </thead>

        <tbody>
          {alumnosPorLegajo.map((alumno) => (
            <tr key={alumno._id}>
              <td style={estilos.celda}>
                {alumno.legajoNumero && alumno.legajoAnio
                  ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                  : "-"}
              </td>

              <td style={estilos.celda}>
                {alumno.apellido}, {alumno.nombre}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}