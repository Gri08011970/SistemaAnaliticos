export default function TablaEstudiantes({
  dniBusqueda,
  apellidoBusqueda,
  estadoFiltro,
  setEstadoFiltro,
  estudiantes,
  actualizarEstado,
  actualizarCarpeta,
  eliminarEstudiante,
  editarEstudiante,
  modoImprimirLista,
  setModoImprimirLista,
  seleccionarAlumno
}) {

  const estudiantesFiltrados = estudiantes
  .filter((alumno) => {

    const coincideApellido =
      alumno.nombre
        .toLowerCase()
        .includes(apellidoBusqueda.toLowerCase())

    const coincideEstado =
      estadoFiltro === "Todos" ||
      alumno.estado === estadoFiltro

    return coincideDni && coincideApellido && coincideEstado
  })

  .sort((a, b) =>
    a.nombre.localeCompare(
      b.nombre,
      "es",
      { sensitivity: "base" }
    )
  )
function imprimirLista() {
  const filas = estudiantesFiltrados.map((alumno, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${alumno.nombre || ""}</td>
      <td>${alumno.dni || ""}</td>
      <td>${alumno.libro || ""}</td>
      <td>${alumno.folio || ""}</td>
      <td>${alumno.ultimoAnio || "---"}</td>
      <td>${alumno.fecha || "---"}</td>
      <td>${alumno.estado || ""}</td>
      <td>${alumno.carpeta || "---"}</td>
    </tr>
  `).join("")

  const ventana = window.open("", "_blank")

  ventana.document.write(`
    <html>
      <head>
        <title>Lista de analíticos filtrada</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          h2 {
            text-align: center;
            color: #1e3a5f;
          }

          p {
            text-align: center;
            font-weight: bold;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th, td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
          }

          th {
            background-color: #1e3a5f;
            color: white;
          }
        </style>
      </head>

      <body>
        <h2>Lista de analíticos</h2>
        <p>Filtro aplicado: ${estadoFiltro}</p>

        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              <th>Libro</th>
              <th>Folio</th>
              <th>Último año</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Carpeta</th>
            </tr>
          </thead>

          <tbody>
            ${filas}
          </tbody>
        </table>
      </body>
    </html>
  `)

  ventana.document.close()
  ventana.print()
}

return (
    <div
      className="lista-impresion"
      style={{ marginTop: "40px" }}
    >

      <h2 style={{ color: "#1e3a5f", marginBottom: "20px" }}>
        Últimos analíticos cargados
      </h2>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{
            marginRight: "10px",
            color: "#1e3a5f",
            fontWeight: "bold"
          }}
        >
          Filtrar por estado:
        </label>

        <select
          value={estadoFiltro}
          onChange={(evento) => setEstadoFiltro(evento.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        >
          <option>Todos</option>
          <option>Pendiente</option>
          <option>En Jefatura</option>
          <option>Para entregar</option>
          <option>Entregado</option>
        </select>
      </div>

      <button
        onClick={imprimirLista}
        style={botonImprimirLista}
      >
        Imprimir lista filtrada
      </button>

      {estudiantesFiltrados.length === 0 && (
        <p style={mensajeNoEncontrado}>
          No se encontró ningún alumno con ese DNI o apellido.
        </p>
      )}

      <table style={estiloTabla}>
        <thead>
          <tr
            style={{
              backgroundColor: "#1e3a5f",
              color: "white"
            }}
          >
            {!modoImprimirLista && (
              <th style={estiloCelda}>Seleccionar</th>
            )}
            <th style={estiloCelda}>Apellido y Nombre</th>
            <th style={estiloCelda}>DNI</th>

            <th style={{ ...estiloCelda, ...columnaChica }}>
              Libro
            </th>

            <th style={{ ...estiloCelda, ...columnaChica }}>
              Folio
            </th>

            <th style={{ ...estiloCelda, ...columnaChica }}>
              Último año
            </th>

            <th style={{ ...estiloCelda, ...columnaChica }}>
              Fecha
            </th>

            <th style={estiloCelda}>Estado</th>
            <th style={estiloCelda}>Carpeta</th>
            {!modoImprimirLista && (
              <th style={estiloCelda}>Acciones</th>
            )}

          </tr>
        </thead>

        <tbody>
          {estudiantesFiltrados.map((alumno) => (
            <tr key={alumno._id}>

              {!modoImprimirLista && (
                <td style={estiloCelda}>
                  <input
                    type="checkbox"
                    checked={alumno.seleccionado}
                    onChange={() => seleccionarAlumno(alumno._id)}
                  />
                </td>
              )}

              <td style={estiloCelda}>
                {alumno.nombre}
              </td>

              <td style={estiloCelda}>
                {alumno.dni}
              </td>

              <td style={estiloCelda}>
                {alumno.libro}
              </td>

              <td style={estiloCelda}>
                {alumno.folio}
              </td>

              <td style={estiloCelda}>
                {alumno.ultimoAnio ? alumno.ultimoAnio : "---"}
              </td>

              <td style={estiloCelda}>
                {alumno.fecha ? alumno.fecha : "---"}
              </td>

              <td style={estiloCelda}>
                <select
                  value={alumno.estado}
                  onChange={(evento) =>
                    actualizarEstado(alumno._id, evento.target.value)
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
                    actualizarCarpeta(alumno._id, evento.target.value)
                  }
                  style={estiloInputCarpeta}
                />
              </td>

              {!modoImprimirLista && (
                <td style={estiloCelda}>
                  <button
                    onClick={() => editarEstudiante(alumno)}
                    style={botonEditar}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => eliminarEstudiante(alumno._id)}
                    style={botonEliminar}
                  >
                    🗑️
                  </button>
                </td>
              )}
            
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

const estiloCelda = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  fontSize: "14px"
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
  width: "70px"
}

const columnaChica = {
  width: "60px"
}

const botonEliminar = {
  backgroundColor: "#c62828",
  color: "white",
  border: "none",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px"
}

const botonEditar = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  marginBottom: "4px"
}

const botonImprimirLista = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px"
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