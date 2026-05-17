export default function TablaEstudiantes({
  dniBusqueda,
  apellidoBusqueda,
  estudiantes,
  actualizarEstado,
  actualizarCarpeta,
  eliminarEstudiante,
  seleccionarAlumno
}) {
  const estudiantesFiltrados = estudiantes.filter((alumno) => {
    const coincideDni = alumno.dni.includes(dniBusqueda)

    const coincideApellido = alumno.nombre
      .toLowerCase()
      .includes(apellidoBusqueda.toLowerCase())

    return coincideDni && coincideApellido
  })

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "#1e3a5f", marginBottom: "20px" }}>
        Últimos analíticos cargados
      </h2>

      {estudiantesFiltrados.length === 0 && (
        <p style={mensajeNoEncontrado}>
          No se encontró ningún alumno con ese DNI o apellido.
        </p>
      )}

      <table style={estiloTabla}>
        <thead>
          <tr style={encabezadoTabla}>
            <th style={estiloCelda}>Seleccionar</th>
            <th style={estiloCelda}>Apellido y Nombre</th>
            <th style={estiloCelda}>DNI</th>
            <th style={estiloCelda}>Estado</th>
            <th style={estiloCelda}>Carpeta</th>
            <th style={estiloCelda}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {estudiantesFiltrados.map((alumno) => (
            <tr key={alumno.dni}>
              <td style={estiloCelda}>
                <input
                  type="checkbox"
                  checked={alumno.seleccionado}
                  onChange={() => seleccionarAlumno(alumno.dni)}
                />
              </td>

              <td style={estiloCelda}>{alumno.nombre}</td>

              <td style={estiloCelda}>{alumno.dni}</td>

              <td style={estiloCelda}>
                <select
                  value={alumno.estado}
                  onChange={(evento) =>
                    actualizarEstado(alumno.dni, evento.target.value)
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    color: obtenerColorEstado(alumno.estado),
                    fontWeight: "bold"
                  }}
                >
                  <option>Pendiente</option>
                  <option>En Jefatura</option>
                  <option>Para entregar</option>
                  <option>Entregado</option>
                </select>
              </td>

              <td style={estiloCelda}>
                <input
                  type="text"
                  value={alumno.carpeta}
                  onChange={(evento) =>
                    actualizarCarpeta(alumno.dni, evento.target.value)
                  }
                  style={estiloInputCarpeta}
                />
              </td>

              <td style={estiloCelda}>
                <button
                  onClick={() => eliminarEstudiante(alumno.dni)}
                  style={botonEliminar}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const estiloTabla = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "white"
}

const encabezadoTabla = {
  backgroundColor: "#1e3a5f",
  color: "white"
}

const estiloCelda = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left"
}

const mensajeNoEncontrado = {
  backgroundColor: "#fff3cd",
  padding: "12px",
  borderRadius: "10px",
  color: "#856404",
  marginBottom: "15px"
}

const estiloInputCarpeta = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "120px"
}

const botonEliminar = {
  backgroundColor: "#c62828",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
}

function obtenerColorEstado(estado) {
  if (estado === "Pendiente") {
    return "#d4a017"
  }

  if (estado === "Para entregar") {
    return "green"
  }

  if (estado === "En Jefatura") {
    return "#1e3a5f"
  }

  return "black"
}