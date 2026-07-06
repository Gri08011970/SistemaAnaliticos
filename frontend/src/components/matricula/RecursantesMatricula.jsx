export default function RecursantesMatricula({
  verRecursantes,
  alumnosRecursantes,
  formatearDNI,
  estilos,
}) {
  if (!verRecursantes) return null;

  return (
    <div style={estilos.detalleCurso}>
      <h3 style={{ color: "#1e3a5f" }}>
        🔁 Estudiantes recursantes
      </h3>

      <p>
        Total de recursantes: {alumnosRecursantes.length}
      </p>

      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.celda}>Apellido y Nombre</th>
            <th style={estilos.celda}>DNI</th>
            <th style={estilos.celda}>Curso</th>
            <th style={estilos.celda}>Turno</th>
            <th style={estilos.celda}>Legajo</th>
          </tr>
        </thead>

        <tbody>
          {alumnosRecursantes.map((alumno) => (
            <tr key={alumno._id}>
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
  );
}