export default function PlanillaElevacion({
  estudiantes
}) {

  const seleccionados = estudiantes.filter(
    (alumno) => alumno.seleccionado
  )

  if (seleccionados.length === 0) {
    return null
  }

  return (
    <div
      style={{
        marginTop: "50px",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >

      <h2
        style={{
          color: "#1e3a5f",
          marginBottom: "10px"
        }}
      >
        Planilla de Elevación
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "30px"
        }}
      >
        Escuela Educación Secundaria N°140
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr
            style={{
              backgroundColor: "#1e3a5f",
              color: "white"
            }}
          >

            <th style={estiloCelda}>
              Apellido y Nombre
            </th>

            <th style={estiloCelda}>
              DNI
            </th>

            <th style={estiloCelda}>
              Estado
            </th>

            <th style={estiloCelda}>
              Carpeta
            </th>

          </tr>

        </thead>

        <tbody>

          {seleccionados.map((alumno) => (

            <tr key={alumno.dni}>

              <td style={estiloCelda}>
                {alumno.nombre}
              </td>

              <td style={estiloCelda}>
                {alumno.dni}
              </td>

              <td style={estiloCelda}>
                {alumno.estado}
              </td>

              <td style={estiloCelda}>
                {alumno.carpeta}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}

const estiloCelda = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left"
}