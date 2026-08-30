export default function RecursantesMatricula({
  verRecursantes,
  setVerRecursantes,
  alumnosRecursantes,
  formatearDNI,
  imprimirRecursantes,
  estilos,
}) {
  if (!verRecursantes) return null;

  return (
    <div style={estilos.detalleCurso}>
      <h3
        style={{
          color: "#1e3a5f",
          textAlign: "center",
        }}
      >
        🔁 Estudiantes recursantes
      </h3>

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
            Resultados del listado
          </strong>

          <span
            style={{
              color: "#607080",
              fontSize: "14px",
            }}
          >
            {alumnosRecursantes.length} estudiantes encontrados
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
              ...estilos.botonVolver,
              minWidth: "150px",
              minHeight: "42px",
              padding: "8px 14px",
              fontSize: "14px",
              fontWeight: "700",
              borderRadius: "10px",
            }}
            onClick={imprimirRecursantes}
          >
            🖨️ Imprimir
          </button>

          <button
            type="button"
            style={{
              ...estilos.botonVolver,
              minWidth: "120px",
              minHeight: "42px",
              padding: "8px 14px",
              fontSize: "14px",
              fontWeight: "700",
              borderRadius: "10px",
            }}
            onClick={() => setVerRecursantes(false)}
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