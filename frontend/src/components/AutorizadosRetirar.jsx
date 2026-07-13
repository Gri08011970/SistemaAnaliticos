import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"

export default function AutorizadosRetirar({ volverInicio, esAdmin }) {
  const [registros, setRegistros] = useState([])
  const [alumnosMatricula, setAlumnosMatricula] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState("")
  const [borradores, setBorradores] = useState({})
  const [alumnosDesplegados, setAlumnosDesplegados] = useState({})

  useEffect(() => {
    obtenerRegistros()
    obtenerMatricula()
  }, [])

  async function obtenerRegistros() {
    try {
      const respuesta = await axios.get("/api/autorizados")
      setRegistros(Array.isArray(respuesta.data) ? respuesta.data : [])
    } catch (error) {
      console.log(error)
      alert("Error al obtener autorizados")
    }
  }

  async function obtenerMatricula() {
    try {
      const respuesta = await axios.get("/api/matricula")
      setAlumnosMatricula(Array.isArray(respuesta.data) ? respuesta.data : [])
    } catch (error) {
      console.log(error)
      alert("Error al obtener la matrícula")
    }
  }

  const alumnosActivos = useMemo(() => {
    return alumnosMatricula
      .filter((alumno) => alumno.estadoMatricula !== "Baja")
      .sort((a, b) => {
        const cursoA = a.curso || ""
        const cursoB = b.curso || ""

        if (cursoA !== cursoB) {
          return cursoA.localeCompare(cursoB, "es", { numeric: true })
        }

        return `${a.apellido || ""} ${a.nombre || ""}`.localeCompare(
          `${b.apellido || ""} ${b.nombre || ""}`,
          "es",
          { sensitivity: "base" }
        )
      })
  }, [alumnosMatricula])

  const cursosDisponibles = useMemo(() => {
    return [...new Set(alumnosActivos.map((alumno) => alumno.curso).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
  }, [alumnosActivos])

  const alumnosDelCurso = useMemo(() => {
    return alumnosActivos.filter((alumno) => alumno.curso === cursoSeleccionado)
  }, [alumnosActivos, cursoSeleccionado])

  const registrosPorAlumno = useMemo(() => {
    const mapa = {}

    registros.forEach((registro) => {
      if (!registro.alumnoId) return

      if (!mapa[registro.alumnoId]) {
        mapa[registro.alumnoId] = []
      }

      mapa[registro.alumnoId].push(registro)
    })

    return mapa
  }, [registros])

  function nombreCompletoAlumno(alumno) {
    return `${alumno.apellido || ""} ${alumno.nombre || ""}`.trim()
  }

  function formatearDNI(dni) {
    if (!dni) return ""

    return dni
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  function obtenerBorrador(alumno) {
    return {
      adultoAutorizado: borradores[alumno._id]?.adultoAutorizado ?? "",
      vinculo: borradores[alumno._id]?.vinculo ?? "Hno/a",
      vinculoOtro: borradores[alumno._id]?.vinculoOtro ?? "",
      dniAdultoResponsable:
        borradores[alumno._id]?.dniAdultoResponsable ?? ""
    }
  }

  function cambiarBorrador(alumnoId, campo, valor) {
    setBorradores((previo) => ({
      ...previo,
      [alumnoId]: {
        ...previo[alumnoId],
        [campo]: valor
      }
    }))
  }

  function seleccionarCurso(curso) {
    setCursoSeleccionado(curso)
    setAlumnosDesplegados({})
  }

  function alternarDesplegado(alumnoId) {
    setAlumnosDesplegados((previo) => ({
      ...previo,
      [alumnoId]: !previo[alumnoId]
    }))
  }

  function textoVinculo(registro) {
    return registro.vinculo === "Otro"
      ? registro.vinculoOtro || "Otro"
      : registro.vinculo || ""
  }

  async function guardarAlumno(alumno) {
    if (!esAdmin) {
      alert("Solo el administrador puede guardar cambios.")
      return
    }

    const borrador = obtenerBorrador(alumno)

    if (!borrador.adultoAutorizado || !borrador.dniAdultoResponsable) {
      alert("Completá adulto autorizado y DNI.")
      return
    }

    const datos = {
      alumnoId: alumno._id,
      curso: alumno.curso || "",
      apellidoNombre: nombreCompletoAlumno(alumno),
      dniAlumno: alumno.dni || "",
      adultoAutorizado: borrador.adultoAutorizado,
      vinculo: borrador.vinculo,
      vinculoOtro: borrador.vinculo === "Otro" ? borrador.vinculoOtro : "",
      dniAdultoResponsable: borrador.dniAdultoResponsable
    }

    try {
      await axios.post("/api/autorizados", datos)

      setBorradores((previo) => ({
        ...previo,
        [alumno._id]: {
          adultoAutorizado: "",
          vinculo: "Hno/a",
          vinculoOtro: "",
          dniAdultoResponsable: ""
        }
      }))

      obtenerRegistros()
    } catch (error) {
      console.log(error)
      alert("Error al guardar el registro")
    }
  }

  async function eliminarRegistro(id) {
    if (!esAdmin) return

    const confirmar = window.confirm("¿Eliminar este autorizado?")
    if (!confirmar) return

    try {
      await axios.delete(`/api/autorizados/${id}`)
      obtenerRegistros()
    } catch (error) {
      console.log(error)
      alert("Error al eliminar el registro")
    }
  }

  function imprimirListado() {
    const alumnosParaImprimir = cursoSeleccionado
      ? alumnosDelCurso
      : alumnosActivos

    const filas = alumnosParaImprimir
      .map((alumno) => {
        const autorizadosAlumno = registrosPorAlumno[alumno._id] || []

        const autorizadosHTML =
          autorizadosAlumno.length > 0
            ? autorizadosAlumno
                .map(
                  (registro) => `
                    <div class="autorizado">
                      <strong>${registro.adultoAutorizado || ""}</strong>
                      <span>${textoVinculo(registro)}</span>
                      <span>DNI: ${formatearDNI(registro.dniAdultoResponsable) || ""}</span>
                    </div>
                  `
                )
                .join("")
            : `<span class="sin-datos">Sin autorizados cargados</span>`

        return `
          <tr>
            <td>${alumno.curso || ""}</td>
            <td>${nombreCompletoAlumno(alumno)}</td>
            <td>${formatearDNI(alumno.dni) || ""}</td>
            <td>${autorizadosHTML}</td>
          </tr>
        `
      })
      .join("")

    const ventana = window.open("", "_blank")

    ventana.document.write(`
      <html>
        <head>
          <title>Autorizados a retirar</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            h2, p {
              text-align: center;
            }

            h2 {
              color: #1e3a5f;
              margin-bottom: 4px;
            }

            .fecha {
              text-align: right;
              color: #555;
              font-size: 13px;
              margin-top: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }

            th, td {
              border: 1px solid #444;
              padding: 8px;
              vertical-align: top;
            }

            th {
              background: #1e3a5f;
              color: white;
              text-align: center;
            }

            .autorizado {
              display: grid;
              grid-template-columns: 1.3fr 0.8fr 1fr;
              gap: 8px;
              border-bottom: 1px solid #ddd;
              padding: 4px 0;
            }

            .autorizado:last-child {
              border-bottom: none;
            }

            .sin-datos {
              color: #777;
              font-style: italic;
            }
          </style>
        </head>

        <body>
          <h2>Autorizados a retirar estudiantes</h2>
          <p>E.E.S. N° 140 "Florencio Molina Campos"</p>
          <p>${cursoSeleccionado ? `Curso: ${cursoSeleccionado}` : "Todos los cursos"}</p>
          <p class="fecha">Fecha de impresión: ${new Date().toLocaleString("es-AR")}</p>

          <table>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Apellido y Nombre</th>
                <th>DNI estudiante</th>
                <th>Autorizados</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </body>
      </html>
    `)

    ventana.document.close()
    ventana.print()
  }

  function exportarPlantillaExcel() {
    if (!cursoSeleccionado) {
      alert("Primero seleccioná un curso.")
      return
    }

    const datos = alumnosDelCurso.map((alumno) => ({
      Curso: alumno.curso || "",
      "Apellido y Nombre": nombreCompletoAlumno(alumno),
      "DNI estudiante": alumno.dni || "",
      "Adulto autorizado": "",
      Vínculo: "Hno/a",
      "Vínculo otro": "",
      "DNI adulto responsable": ""
    }))

    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(libro, hoja, "Autorizados")
    XLSX.writeFile(libro, `Autorizados_${cursoSeleccionado}.xlsx`)
  }

  async function importarExcel(evento) {
    if (!esAdmin) {
      alert("Solo el administrador puede importar.")
      return
    }

    const archivo = evento.target.files[0]
    if (!archivo) return

    try {
      const datos = await archivo.arrayBuffer()
      const libro = XLSX.read(datos)
      const hoja = libro.Sheets[libro.SheetNames[0]]
      const filas = XLSX.utils.sheet_to_json(hoja, { defval: "" })

      for (const fila of filas) {
        const dniFila = String(fila["DNI estudiante"] || "").replace(/\D/g, "")
        const alumno = alumnosActivos.find(
          (item) => String(item.dni || "").replace(/\D/g, "") === dniFila
        )

        if (!alumno) continue

        const adultoAutorizado = fila["Adulto autorizado"] || ""
        const dniAdultoResponsable = fila["DNI adulto responsable"] || ""

        if (!adultoAutorizado || !dniAdultoResponsable) continue

        await axios.post("/api/autorizados", {
          alumnoId: alumno._id,
          curso: alumno.curso || fila.Curso || "",
          apellidoNombre: nombreCompletoAlumno(alumno),
          dniAlumno: alumno.dni || "",
          adultoAutorizado,
          vinculo: fila.Vínculo || "Hno/a",
          vinculoOtro: fila["Vínculo otro"] || "",
          dniAdultoResponsable
        })
      }

      await obtenerRegistros()
      alert("Archivo importado correctamente.")
    } catch (error) {
      console.log(error)
      alert("Error al importar el archivo.")
    }

    evento.target.value = ""
  }

  const totalCurso = alumnosDelCurso.length
  const completosCurso = alumnosDelCurso.filter((alumno) => {
    return (registrosPorAlumno[alumno._id] || []).length > 0
  }).length

  return (
    <div className="tarjeta-inicio" style={contenedor}>
      <button
        className="boton-sistema boton-volver"
        style={botonVolver}
        onClick={volverInicio}
      >
        Volver al inicio
      </button>

      <h2 style={titulo}>👥 Autorizados a retirar</h2>

      <p style={subtitulo}>
        Registro de adultos autorizados a retirar estudiantes.
      </p>

      <div style={selectorCurso}>
        <select
          style={inputGrande}
          value={cursoSeleccionado}
          onChange={(e) => seleccionarCurso(e.target.value)}
        >
          <option value="">Seleccionar curso</option>
          {cursosDisponibles.map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>

        {cursoSeleccionado && (
          <div style={progreso}>
            Curso {cursoSeleccionado}: {completosCurso} de {totalCurso} con autorizados
          </div>
        )}
      </div>

      <div style={botonera}>
        <button
          className="boton-sistema boton-imprimir"
          style={botonImprimir}
          onClick={imprimirListado}
        >
          🖨️ Imprimir
        </button>

        <button
          className="boton-sistema boton-secundario"
          style={botonSecundario}
          onClick={exportarPlantillaExcel}
        >
          📤 Exportar Excel
        </button>

        <label className="boton-sistema boton-secundario" style={botonSecundario}>
          📥 Importar Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={importarExcel}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <h3 style={subtituloTabla}>
        {cursoSeleccionado
          ? `Cargando autorizados de ${cursoSeleccionado}`
          : "Seleccioná un curso para cargar alumno por alumno"}
      </h3>

      <div style={tablaContenedor}>
        <table style={tabla}>
          <thead>
            <tr style={encabezado}>
              <th style={celda}>Alumno</th>
              <th style={celda}>DNI</th>
              <th style={celda}>Adulto autorizado</th>
              <th style={celda}>Vínculo</th>
              <th style={celda}>DNI adulto</th>
              <th style={celda}>Acciones</th>
              <th style={celda}>Cargados</th>
            </tr>
          </thead>

          <tbody>
            {cursoSeleccionado &&
              alumnosDelCurso.map((alumno) => {
                const borrador = obtenerBorrador(alumno)
                const registrosAlumno = registrosPorAlumno[alumno._id] || []

                return (
                  <tr key={alumno._id} className="fila-tabla">
                    <td style={celdaNombre}>{nombreCompletoAlumno(alumno)}</td>
                    <td style={celda}>{formatearDNI(alumno.dni)}</td>

                    <td style={celda}>
                      <input
                        style={inputTabla}
                        value={borrador.adultoAutorizado}
                        onChange={(e) =>
                          cambiarBorrador(alumno._id, "adultoAutorizado", e.target.value)
                        }
                        disabled={!esAdmin}
                        placeholder="Nombre y apellido"
                      />
                    </td>

                    <td style={celda}>
                      <select
                        style={inputTabla}
                        value={borrador.vinculo}
                        onChange={(e) =>
                          cambiarBorrador(alumno._id, "vinculo", e.target.value)
                        }
                        disabled={!esAdmin}
                      >
                        <option value="Hno/a">Hno/a</option>
                        <option value="Tío/a">Tío/a</option>
                        <option value="Abuelo/a">Abuelo/a</option>
                        <option value="Madrastra">Madrastra</option>
                        <option value="Padrastro">Padrastro</option>
                        <option value="Otro">Otro</option>
                      </select>

                      {borrador.vinculo === "Otro" && (
                        <input
                          style={{ ...inputTabla, marginTop: "6px" }}
                          value={borrador.vinculoOtro}
                          onChange={(e) =>
                            cambiarBorrador(alumno._id, "vinculoOtro", e.target.value)
                          }
                          disabled={!esAdmin}
                          placeholder="Especificar"
                        />
                      )}
                    </td>

                    <td style={celda}>
                      <input
                        style={inputTabla}
                        value={borrador.dniAdultoResponsable}
                        onChange={(e) =>
                          cambiarBorrador(
                            alumno._id,
                            "dniAdultoResponsable",
                            e.target.value
                          )
                        }
                        disabled={!esAdmin}
                        placeholder="DNI adulto"
                        autoComplete="off"
                      />
                    </td>

                    <td style={celda}>
                      <button
                        className="boton-accion"
                        style={{
                          ...botonGuardarFila,
                          opacity: esAdmin ? 1 : 0.45,
                          cursor: esAdmin ? "pointer" : "not-allowed"
                        }}
                        disabled={!esAdmin}
                        onClick={() => guardarAlumno(alumno)}
                        title="Guardar autorizado"
                      >
                        💾
                      </button>
                    </td>

                    <td style={celdaCargados}>
                      {registrosAlumno.length === 0 && (
                        <span style={sinAutorizados}>—</span>
                      )}

                      {registrosAlumno.length > 0 && (
                        <>
                          <button
                            style={botonDesplegar}
                            onClick={() => alternarDesplegado(alumno._id)}
                            title="Ver autorizados cargados"
                          >
                            {alumnosDesplegados[alumno._id] ? "▲" : "▼"}{" "}
                            {registrosAlumno.length}{" "}
                            {registrosAlumno.length === 1
                              ? "autorizado"
                              : "autorizados"}
                          </button>

                          {alumnosDesplegados[alumno._id] && (
                            <div style={contenedorAutorizados}>
                              {registrosAlumno.map((registro) => (
                                <div key={registro._id} style={tarjetaAutorizado}>
                                  <div style={nombreAutorizado}>
                                    {registro.adultoAutorizado}
                                  </div>

                                  <div>
                                    <strong>Vínculo:</strong>{" "}
                                    {textoVinculo(registro)}
                                  </div>

                                  <div>
                                    <strong>DNI:</strong>{" "}
                                    {formatearDNI(registro.dniAdultoResponsable)}
                                  </div>

                                  {esAdmin && (
                                    <button
                                      style={botonEliminarMini}
                                      onClick={() => eliminarRegistro(registro._id)}
                                      title="Eliminar autorizado"
                                    >
                                      🗑️ Eliminar
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}

            {!cursoSeleccionado && (
              <tr>
                <td style={celda} colSpan="7">
                  Seleccioná un curso para ver la lista completa de estudiantes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const contenedor = {
  marginTop: "40px",
  background: "#f8fbfc",
  border: "2px solid #b9d6df",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 10px 24px rgba(22,58,95,.15)"
}

const titulo = {
  color: "#1e3a5f",
  textAlign: "center",
  marginTop: 0
}

const subtitulo = {
  textAlign: "center",
  color: "#5f6f7a",
  marginBottom: "22px"
}

const selectorCurso = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "18px"
}

const inputGrande = {
  padding: "11px",
  borderRadius: "10px",
  border: "1px solid #b9cbd1",
  fontSize: "14px",
  backgroundColor: "white",
  width: "260px"
}

const progreso = {
  backgroundColor: "#eef5f7",
  border: "1px solid #b9d6df",
  color: "#1e3a5f",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: "bold"
}

const botonera = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  flexWrap: "wrap",
  marginBottom: "18px"
}

const botonSecundario = {
  backgroundColor: "#eef5f7",
  color: "#1e3a5f",
  border: "1px solid #c7dde3",
  cursor: "pointer"
}

const botonImprimir = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none"
}

const subtituloTabla = {
  color: "#5f6f7a",
  textAlign: "center",
  marginBottom: "14px"
}

const tablaContenedor = {
  overflowX: "auto",
  borderRadius: "14px",
  border: "1px solid #d6e4ea",
  backgroundColor: "white"
}

const tabla = {
  width: "100%",
  borderCollapse: "collapse"
}

const encabezado = {
  backgroundColor: "#1e3a5f",
  color: "white"
}

const celda = {
  border: "1px solid #dbe4ee",
  padding: "8px",
  textAlign: "center",
  fontSize: "13px"
}

const celdaNombre = {
  ...celda,
  minWidth: "190px",
  fontWeight: "600",
  color: "#4f4a68"
}

const inputTabla = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #c7dde3",
  fontSize: "13px"
}

const botonGuardarFila = {
  backgroundColor: "#e8f4f1",
  color: "#0f766e",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer"
}

const celdaCargados = {
  ...celda,
  minWidth: "220px",
  textAlign: "left"
}

const botonDesplegar = {
  backgroundColor: "#eef5f7",
  color: "#1e3a5f",
  border: "1px solid #c7dde3",
  borderRadius: "999px",
  padding: "7px 12px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%"
}

const contenedorAutorizados = {
  marginTop: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}

const tarjetaAutorizado = {
  backgroundColor: "white",
  border: "1px solid #d6e4ea",
  borderRadius: "12px",
  padding: "8px",
  color: "#4f4a68",
  boxShadow: "0 3px 8px rgba(22,58,95,.08)"
}

const nombreAutorizado = {
  color: "#1e3a5f",
  fontWeight: "bold",
  marginBottom: "4px"
}

const sinAutorizados = {
  color: "#777",
  fontStyle: "italic"
}

const botonEliminarMini = {
  backgroundColor: "#f7dede",
  color: "#8b2e2e",
  border: "none",
  borderRadius: "999px",
  cursor: "pointer",
  padding: "5px 8px",
  marginTop: "6px"
}

const botonVolver = {
  backgroundColor: "#9e7ac0",
  color: "white",
  border: "none",
  marginBottom: "12px"
}
