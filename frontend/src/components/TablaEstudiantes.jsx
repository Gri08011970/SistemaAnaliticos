import { useState } from "react"

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
  seleccionarAlumno,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  estudiantesPorPeriodo
}) {

  const [mostrarPeriodo, setMostrarPeriodo] = useState(false)

  function formatearDNI(dni) {
    if (!dni) return ""

    return dni
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  function limpiarDNI(dni) {
    if (!dni) return ""

    return dni
      .toString()
      .replace(/\D/g, "")
  }

  const listaEstudiantes = Array.isArray(estudiantes) ? estudiantes : []

  const estudiantesFiltrados = listaEstudiantes
    .filter((alumno) => {
      const dniAlumno = limpiarDNI(alumno.dni)
      const dniBuscado = limpiarDNI(dniBusqueda)

      const coincideDni = dniAlumno.includes(dniBuscado)

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

  function imprimirLista(listaParaImprimir = estudiantesFiltrados) {
    const filas = listaParaImprimir.map((alumno, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${alumno.nombre || ""}</td>
      <td>${formatearDNI(alumno.dni) || ""}</td>
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

    ventana.onload = () => {
       ventana.focus()
       ventana.print()
  }


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
        onClick={() => imprimirLista()}
        style={botonImprimirLista}
      >
        Imprimir lista filtrada
      </button>

      <div style={bloquePeriodo}>
        <button
          style={botonImprimirLista}
          onClick={() => setMostrarPeriodo(!mostrarPeriodo)}
        >
          🗓️ {mostrarPeriodo ? "Ocultar impresión por fecha" : "Imprimir por fecha de carga"}
        </button>

        {mostrarPeriodo && ( 
          <>
            <h3>🗓️ Imprimir pedidos por fecha de carga</h3>

            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              style={inputPeriodo}
            />

            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              style={inputPeriodo}
            />

            <p>
              Pedidos encontrados: {estudiantesPorPeriodo.length}
            </p>

            <button
              style={botonImprimirLista}
              onClick={() => imprimirLista(estudiantesPorPeriodo)}
            >
              🖨️ Imprimir período
            </button>
          </>
        )}
      </div>

      {estudiantesFiltrados.length === 0 && (
        <p style={mensajeNoEncontrado}>
          No se encontró ningún alumno con ese DNI o apellido.
        </p>
      )}

      <table
        style={{
          ...estiloTabla,
          tableLayout: "fixed",
          width: "100%"
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#1e3a5f",
              color: "white"
            }}
          >
            {!modoImprimirLista && (
              <th style={{ ...estiloCelda, width: "40px" }}>
                ✓
              </th>
            )}

            <th style={{ ...estiloCelda, width: "235px" }}>
              Apellido y Nombre
            </th>

            <th style={{ ...estiloCelda, width: "80px" }}>
              DNI
            </th>

            <th style={{ ...estiloCelda, width: "35px" }}>
              Libro
            </th>

            <th style={{ ...estiloCelda, width: "35px" }}>
              Folio
            </th>

            <th style={{ ...estiloCelda, width: "45px" }}>
              Últ.
              <br />
              año
            </th>

            <th style={{ ...estiloCelda, width: "70px" }}>
              Fecha
            </th>

            <th style={{ ...estiloCelda, width: "105px" }}>
              Estado
            </th>

            <th style={{ ...estiloCelda, width: "45px" }}>
              Carp.
            </th>

            {!modoImprimirLista && (
              <th style={{ ...estiloCelda, width: "85px" }}>
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {estudiantesFiltrados.map((alumno, index) => (
            <tr
              key={alumno._id}
              style={{
                backgroundColor: index % 2 === 0
                  ? "#ffffff"
                  : "#f8fbfc"
              }}
            >

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
                {formatearDNI(alumno.dni)}
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
                    padding: "5px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    color: obtenerColorEstado(alumno.estado),
                    fontWeight: "bold",
                    fontSize: "12px",
                    width: "100%"
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
                <td
                  style={{
                    ...estiloCelda,
                    whiteSpace: "nowrap"
                  }}
                >
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
  width: "32px",
  padding: "4px",
  border: "none",
  backgroundColor: "transparent",
  textAlign: "center",
  fontWeight: "bold",
  color: "#1e3a5f"
}

const columnaChica = {
  width: "60px"
}

const botonEditar = {
  backgroundColor: "#dbe7f5",
  color: "#1e3a5f",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "4px"
}

const botonEliminar = {
  backgroundColor: "#f7dede",
  color: "#8b2e2e",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
}

const botonImprimirLista = {
  backgroundColor: "#4cb3aa",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px",
  fontWeight: "bold"
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
const bloquePeriodo = {
  marginTop: "20px",
  marginBottom: "20px",
  padding: "18px",
  border: "1px solid #c7d2fe",
  borderRadius: "16px",
  backgroundColor: "#f8fbff",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "center"
}

const inputPeriodo = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "220px"
}