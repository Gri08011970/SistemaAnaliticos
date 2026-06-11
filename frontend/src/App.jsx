import { useEffect, useState } from "react"
import axios from "axios"

import Busqueda from "./components/Busqueda"
import TablaEstudiantes from "./components/TablaEstudiantes"
import Estadisticas from "./components/Estadisticas"
import FormularioNuevo from "./components/FormularioNuevo"
import PlanillaElevacion from "./components/PlanillaElevacion"
import ImportarExcel from "./components/ImportarExcel"
import Login from "./components/Login"
import Matricula from "./components/Matricula"
import PortadaInstitucional from "./components/PortadaInstitucional"

export default function App() {
  const [dniBusqueda, setDniBusqueda] = useState("")
  const [apellidoBusqueda, setApellidoBusqueda] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [estudiantes, setEstudiantes] = useState([])
  const [alumnoEditando, setAlumnoEditando] = useState(null)
  const [modoImprimirLista, setModoImprimirLista] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState("inicio")
  const [logueado, setLogueado] = useState(false)
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [mostrarPortada, setMostrarPortada] = useState(true)
  const [alumnosMatricula, setAlumnosMatricula] = useState([])
  const [mostrarDespedida, setMostrarDespedida] = useState(false)

  useEffect(() => {
    obtenerAlumnos()
  }, [])

  async function obtenerAlumnos() {
    try {
      const respuesta = await axios.get("/alumnos")
      setEstudiantes(Array.isArray(respuesta.data) ? respuesta.data : [])
    } catch (error) {
      console.log(error)
    }
  }

  async function importarEstudiantes(alumnosImportados) {
    try {
      await axios.post("/alumnos/importar", {
        alumnos: alumnosImportados
      })

      obtenerAlumnos()
      setSeccionActiva("lista")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    obtenerMatricula()
  }, [])

  async function obtenerMatricula() {
    try {
      const respuesta = await axios.get("/api/matricula")
      setAlumnosMatricula(Array.isArray(respuesta.data) ? respuesta.data : [])
    } catch (error) {
      console.log(error)
    }
  }

  async function agregarEstudiante(nuevoEstudiante) {
    try {
      await axios.post("/alumnos", nuevoEstudiante)
      obtenerAlumnos()
      setSeccionActiva("lista")
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.mensaje)
        return
      }

      console.log(error)
      alert("Error al guardar el pedido")
    }
  }

  async function actualizarEstudianteEditado(id, datosActualizados) {
    try {
      await axios.put(`/alumnos/${id}`, datosActualizados)

      obtenerAlumnos()
      setAlumnoEditando(null)
      setSeccionActiva("lista")
    } catch (error) {
      console.log(error)
    }
  }

  async function actualizarEstado(id, nuevoEstado) {
    try {
      await axios.put(`/alumnos/${id}`, {
        estado: nuevoEstado
      })

      obtenerAlumnos()
    } catch (error) {
      console.log(error)
    }
  }

  async function actualizarCarpeta(id, nuevaCarpeta) {
    try {
      await axios.put(`/alumnos/${id}`, {
        carpeta: nuevaCarpeta
      })

      obtenerAlumnos()
    } catch (error) {
      console.log(error)
    }
  }

  async function eliminarEstudiante(id) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este pedido de analítico?\n\nEsta acción no se puede deshacer."
    )

    if (!confirmar) return

    try {
      await axios.delete(`/alumnos/${id}`)

      setEstudiantes((anteriores) =>
        anteriores.filter((alumno) => alumno._id !== id)
      )
    } catch (error) {
      console.log(error)
      console.log(error.response)

      alert(
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        error.message
      )
    }
  }

  function editarEstudiante(alumno) {
    setAlumnoEditando(alumno)
    setSeccionActiva("formulario")
  }

  function seleccionarAlumno(id) {
    const estudiantesActualizados = estudiantes.map((alumno) => {
      if (alumno._id === id) {
        return {
          ...alumno,
          seleccionado: !alumno.seleccionado
        }
      }

      return alumno
    })

    setEstudiantes(estudiantesActualizados)
  }

  function generarPlanillaElevacion() {
    const listaEstudiantes = Array.isArray(estudiantes) ? estudiantes : []

    const seleccionados = listaEstudiantes.filter(
      (alumno) => alumno.seleccionado
    )

    if (seleccionados.length === 0) {
      alert("Seleccioná al menos un alumno para generar la planilla.")
      return
    }

    setSeccionActiva("eleve")
  }



  const estudiantesPorPeriodo = estudiantes.filter((alumno) => {
    let fechaAlumno = ""

    if (alumno.fechaCarga) {
      fechaAlumno = alumno.fechaCarga.slice(0, 10)
    } else if (alumno.fecha) {
      const partes = alumno.fecha.split("/")
      fechaAlumno = `${partes[2]}-${partes[1]}-${partes[0]}`
    }

    if (!fechaAlumno) return false

    return (
      (!fechaDesde || fechaAlumno >= fechaDesde) &&
      (!fechaHasta || fechaAlumno <= fechaHasta)
    )
  })

  if (mostrarPortada) {
    return (
      <PortadaInstitucional
        entrar={() => setMostrarPortada(false)}
      />
    )
  }

  const cursosManana = ["1°1°", "1°2°", "2°1°", "2°2°", "3°1°", "3°2°", "4°1°", "4°2°", "5°1°", "5°2°", "6°1°"]

  const cursosTarde = ["1°3°", "1°4°", "2°3°", "2°4°", "3°3°", "3°4°", "4°3°", "4°4°", "5°3°", "5°4°", "6°2°"]

  function contarPorSexo(curso, turno, sexo) {
    return alumnosMatricula.filter(
      (alumno) =>
        alumno.curso === curso &&
        alumno.turno === turno &&
        alumno.sexo === sexo
    ).length
  }

  function filaParteDiario(curso, turno) {
    const mujeres = contarPorSexo(curso, turno, "Mujer")
    const varones = contarPorSexo(curso, turno, "Varón")

    return {
      curso,
      mujeres,
      varones,
      total: mujeres + varones
    }
  }

  function totalParteDiario(cursos, turno) {
    return cursos.reduce(
      (acumulador, curso) => {
        const fila = filaParteDiario(curso, turno)

        return {
          mujeres: acumulador.mujeres + fila.mujeres,
          varones: acumulador.varones + fila.varones,
          total: acumulador.total + fila.total
        }
      },
      { mujeres: 0, varones: 0, total: 0 }
    )
  }

  function esCicloBasico(curso) {
    return curso.startsWith("1") || curso.startsWith("2") || curso.startsWith("3")
  }

  function esCicloSuperior(curso) {
    return curso.startsWith("4") || curso.startsWith("5") || curso.startsWith("6")
  }


  return (
    <div
      style={{
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
        position: "relative"
      }}
    >

      <button
        style={botonSalir}
        onClick={() => setMostrarDespedida(true)}
      >
        🚪 Cerrar sesión
      </button>
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        {seccionActiva !== "inicio" &&
          seccionActiva !== "parteDiario" && (
            <>
              <h1 style={{ color: "#1e3a5f", marginBottom: "5px" }}>
                {seccionActiva === "matricula"
                  ? "Gestión de Matrícula"
                  : "Gestión de pedidos de Analíticos"}
              </h1>

              <p
                style={{
                  color: "#666",
                  marginBottom: "30px"
                }}
              >
                Escuela Educación Secundaria N°140 "Florencio Molina Campos"
              </p>
            </>
          )}


        {seccionActiva === "inicio" && (

          <div style={contenedorInicio}>
            <div style={tarjetaInicio}>
              <h3>Gestión de pedidos de analíticos</h3>
              <p>Carga, seguimiento, estados y planilla de eleve.</p>

              <button
                style={botonMenu}
                onClick={() => setSeccionActiva("nuevo")}
              >
                Entrar
              </button>
            </div>

            <div style={tarjetaInicio}>
              <h3>Gestión de Matrícula</h3>
              <p>Cursos, turnos, estudiantes, previas y movimientos.</p>

              <button
                style={botonMenu}
                onClick={() => setSeccionActiva("matricula")}
              >
                Entrar
              </button>
            </div>

            <div style={tarjetaInicio}>
              <h3>📋 Parte Diario Automático</h3>
              <p>
                Matrícula por turno, curso, sexo y totales institucionales.
              </p>

              <button
                style={botonMenu}
                onClick={() => setSeccionActiva("parteDiario")}
              >
                Ver parte
              </button>
            </div>
          </div>
        )}


        {seccionActiva !== "inicio" && (
          <>
            {seccionActiva !== "matricula" && seccionActiva !== "parteDiario" && (
              <>
                <Busqueda
                  dniBusqueda={dniBusqueda}
                  setDniBusqueda={setDniBusqueda}
                  apellidoBusqueda={apellidoBusqueda}
                  setApellidoBusqueda={setApellidoBusqueda}
                  irATabla={() => setSeccionActiva("lista")}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "25px",
                    marginBottom: "20px"
                  }}
                >
                  <button onClick={() => setSeccionActiva("formulario")} style={botonMenu}>
                    Nuevo Pedido de Analítico
                  </button>

                  <button
                    onClick={() => {
                      setDniBusqueda("")
                      setApellidoBusqueda("")
                      setEstadoFiltro("Todos")
                      setSeccionActiva("lista")
                    }}
                    style={botonMenu}
                  >
                    Ver Lista Completa
                  </button>

                  <button onClick={generarPlanillaElevacion} style={botonMenu}>
                    Planilla de Eleve
                  </button>

                  <button onClick={() => setSeccionActiva("estadisticas")} style={botonMenu}>
                    Estadísticas
                  </button>

                  <button onClick={() => setSeccionActiva("inicio")} style={botonVolver}>
                    Volver al inicio
                  </button>
                </div>
              </>
            )}

            {(seccionActiva === "matricula" || seccionActiva === "parteDiario") && (
              <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setSeccionActiva("inicio")} style={botonMenu}>
                  Volver al inicio
                </button>
              </div>
            )}

            <h2
              style={{
                textAlign: "center",
                color: "#1e3a5f",
                marginBottom: "5px"
              }}
            >
              E.E.S. N° 140 "Florencio Molina Campos"
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "25px"
              }}
            >
              Matrícula institucional actualizada automáticamente
            </p>

            {seccionActiva === "parteDiario" && (
              <div style={parteDiario}>
                <h2 style={tituloParteDiario}>📋 Parte Diario Automático</h2>

                <div style={grillaParteDiario}>
                  <div>
                    <h3 style={subtituloParte}>Turno Mañana</h3>

                    <table style={tablaParte}>
                      <thead>
                        <tr>
                          <th style={celdaParteTitulo}>Curso</th>
                          <th style={celdaParteTitulo}>Mujeres</th>
                          <th style={celdaParteTitulo}>Varones</th>
                          <th style={celdaParteTitulo}>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cursosManana.map((curso) => {
                          const fila = filaParteDiario(curso, "Mañana")

                          return (
                            <tr key={curso}>
                              <td style={celdaParte}>{fila.curso}</td>
                              <td style={celdaParte}>{fila.mujeres}</td>
                              <td style={celdaParte}>{fila.varones}</td>
                              <td style={celdaParteNegrita}>{fila.total}</td>
                            </tr>
                          )
                        })}
                        <tr style={filaTotalBasico}>
                          <td style={celdaParteNegrita}>TOTAL CICLO BÁSICO</td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosManana.filter(esCicloBasico), "Mañana").mujeres}
                          </td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosManana.filter(esCicloBasico), "Mañana").varones}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosManana.filter(esCicloBasico), "Mañana").total}
                          </td>
                        </tr>

                        <tr style={filaTotalSuperior}>
                          <td style={celdaParteNegrita}>TOTAL CICLO SUPERIOR</td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosManana.filter(esCicloSuperior), "Mañana").mujeres}
                          </td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosManana.filter(esCicloSuperior), "Mañana").varones}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosManana.filter(esCicloSuperior), "Mañana").total}
                          </td>
                        </tr>

                        <tr style={filaTotalTurno}>
                          <td style={celdaParteTotal}>TOTAL TURNO MAÑANA</td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosManana, "Mañana").mujeres}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosManana, "Mañana").varones}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosManana, "Mañana").total}
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 style={subtituloParte}>Turno Tarde</h3>

                    <table style={tablaParte}>
                      <thead>
                        <tr>
                          <th style={celdaParteTitulo}>Curso</th>
                          <th style={celdaParteTitulo}>Mujeres</th>
                          <th style={celdaParteTitulo}>Varones</th>
                          <th style={celdaParteTitulo}>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cursosTarde.map((curso) => {
                          const fila = filaParteDiario(curso, "Tarde")

                          return (
                            <tr key={curso}>
                              <td style={celdaParte}>{fila.curso}</td>
                              <td style={celdaParte}>{fila.mujeres}</td>
                              <td style={celdaParte}>{fila.varones}</td>
                              <td style={celdaParteNegrita}>{fila.total}</td>
                            </tr>
                          )
                        })}

                        <tr style={filaTotalBasico}>
                          <td style={celdaParteNegrita}>TOTAL CICLO BÁSICO</td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosTarde.filter(esCicloBasico), "Tarde").mujeres}
                          </td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosTarde.filter(esCicloBasico), "Tarde").varones}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosTarde.filter(esCicloBasico), "Tarde").total}
                          </td>
                        </tr>

                        <tr style={filaTotalSuperior}>
                          <td style={celdaParteNegrita}>TOTAL CICLO SUPERIOR</td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosTarde.filter(esCicloSuperior), "Tarde").mujeres}
                          </td>
                          <td style={celdaParteNegrita}>
                            {totalParteDiario(cursosTarde.filter(esCicloSuperior), "Tarde").varones}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosTarde.filter(esCicloSuperior), "Tarde").total}
                          </td>
                        </tr>

                        <tr style={filaTotalTurno}>
                          <td style={celdaParteTotal}>TOTAL TURNO TARDE</td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosTarde, "Tarde").mujeres}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosTarde, "Tarde").varones}
                          </td>
                          <td style={celdaParteTotal}>
                            {totalParteDiario(cursosTarde, "Tarde").total}
                          </td>
                        </tr>


                      </tbody>
                    </table>
                    <div
                      style={{
                        marginTop: "20px",
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}
                    >
                      <table style={{ ...tablaParte, width: "100%" }}>
                        <tbody>
                          <tr
                            style={{
                              backgroundColor: "#1e3a5f",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px"
                            }}
                          >
                            <td style={{ padding: "14px" }}>
                              TOTAL GENERAL ESCUELA
                            </td>

                            <td style={{ padding: "14px", textAlign: "center" }}>
                              {totalParteDiario(cursosManana, "Mañana").mujeres +
                                totalParteDiario(cursosTarde, "Tarde").mujeres}
                            </td>

                            <td style={{ padding: "14px", textAlign: "center" }}>
                              {totalParteDiario(cursosManana, "Mañana").varones +
                                totalParteDiario(cursosTarde, "Tarde").varones}
                            </td>

                            <td style={{ padding: "14px", textAlign: "center" }}>
                              {totalParteDiario(cursosManana, "Mañana").total +
                                totalParteDiario(cursosTarde, "Tarde").total}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                  </div>
                </div>
              </div>
            )}

            {seccionActiva === "formulario" && (
              <>
                <ImportarExcel importarEstudiantes={importarEstudiantes} />

                <FormularioNuevo
                  agregarEstudiante={agregarEstudiante}
                  actualizarEstudianteEditado={actualizarEstudianteEditado}
                  alumnoEditando={alumnoEditando}
                  setAlumnoEditando={setAlumnoEditando}
                />
              </>
            )}

            {seccionActiva === "lista" && (
              <TablaEstudiantes
                dniBusqueda={dniBusqueda}
                apellidoBusqueda={apellidoBusqueda}
                estadoFiltro={estadoFiltro}
                setEstadoFiltro={setEstadoFiltro}
                estudiantes={estudiantes}
                actualizarEstado={actualizarEstado}
                actualizarCarpeta={actualizarCarpeta}
                eliminarEstudiante={eliminarEstudiante}
                editarEstudiante={editarEstudiante}
                seleccionarAlumno={seleccionarAlumno}
                modoImprimirLista={modoImprimirLista}
                setModoImprimirLista={setModoImprimirLista}
                fechaDesde={fechaDesde}
                setFechaDesde={setFechaDesde}
                fechaHasta={fechaHasta}
                setFechaHasta={setFechaHasta}
                estudiantesPorPeriodo={estudiantesPorPeriodo}
              />
            )}

            {seccionActiva === "eleve" && (
              <PlanillaElevacion estudiantes={estudiantes} />
            )}

            {seccionActiva === "estadisticas" && (
              <Estadisticas estudiantes={estudiantes} />
            )}

            {seccionActiva === "matricula" && (
              <Matricula />
            )}
          </>
        )}

      </div>
      {
        mostrarDespedida && (
          <div style={fondoModal}>
            <div style={modalDespedida}>

              <h2 style={{ color: "#1e3a5f" }}>
                👋 Hasta pronto
              </h2>

              <p>
                Gracias por utilizar el Sistema de Gestión Institucional
              </p>

              <h3 style={{ color: "#1e3a5f" }}>
                E.E.S. N° 140
              </h3>

              <p>
                "Florencio Molina Campos"
              </p>

              <p
                style={{
                  fontStyle: "italic",
                  marginTop: "20px",
                  color: "#555"
                }}
              >
                Educar es dejar huellas en el corazón de quienes aprenden.
              </p>

              <div style={{ marginTop: "25px" }}>

                <button
                  style={botonVolverModal}
                  onClick={() => setMostrarDespedida(false)}
                >
                  Continuar trabajando
                </button>

                <button
                  style={botonSalirModal}
                  onClick={() => {
                    setMostrarDespedida(false)
                    setMostrarPortada(true)
                  }}
                >
                  Salir del sistema
                </button>

              </div>

            </div>
          </div>
        )
      }

    </div>
  )
}

const botonMenu = {
  backgroundColor: "#1c6c6e",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
  transition: "0.2s",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
}

const botonVolver = {
  backgroundColor: "#111312",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
}

const contenedorInicio = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "25px",
  marginTop: "35px"
}

const tarjetaInicio = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  textAlign: "center"
}
const bloquePeriodo = {
  marginTop: "20px",
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
const botonSalir = {
  position: "absolute",
  top: "20px",
  right: "20px",
  backgroundColor: "#5c8d89",
  color: "white",
  border: "none",
  borderRadius: "999px",
  padding: "10px 18px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 3px 6px rgba(0,0,0,0.15)"
}
const fondoModal = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
}
const modalDespedida = {
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "20px",
  width: "500px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
}
const botonVolverModal = {
  backgroundColor: "#dfeceb",
  color: "#1e3a5f",
  border: "none",
  padding: "10px 18px",
  borderRadius: "999px",
  marginRight: "10px",
  cursor: "pointer"
}
const botonSalirModal = {
  backgroundColor: "#5c8d89",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "999px",
  cursor: "pointer"
}
const parteDiario = {
  backgroundColor: "#f7fafb",
  border: "2px solid #c7dde3",
  borderRadius: "20px",
  padding: "22px",
  marginTop: "25px",
  marginBottom: "28px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
}

const tituloParteDiario = {
  color: "#1e3a5f",
  textAlign: "center",
  marginBottom: "20px"
}

const grillaParteDiario = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px"
}

const subtituloParte = {
  backgroundColor: "#e8f4f1",
  borderLeft: "6px solid #0f766e",
  borderRadius: "8px",
  padding: "10px",
  color: "#1e3a5f",
  textAlign: "center"
}

const tablaParte = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 3px 8px rgba(0,0,0,0.06)"
}

const celdaParteTitulo = {
  backgroundColor: "#1e3a5f",
  color: "white",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center"
}

const celdaParte = {
  border: "1px solid #dbe4ee",
  padding: "9px",
  textAlign: "center"
}

const celdaParteNegrita = {
  ...celdaParte,
  fontWeight: "bold",
  backgroundColor: "#eef7f6"
}
const filaTotalBasico = {
  backgroundColor: "#fff7ed",
  fontWeight: "bold",
  borderTop: "3px solid #d97706",
  borderBottom: "2px solid #d97706"
}

const filaTotalSuperior = {
  backgroundColor: "#eef7f6",
  fontWeight: "bold",
  borderTop: "3px solid #0f766e",
  borderBottom: "2px solid #0f766e"
}

const filaTotalTurno = {
  backgroundColor: "#dcefeb",
  fontWeight: "bold",
  boxShadow: "inset 0 3px 0 #1e3a5f, inset 0 -3px 0 #1e3a5f"
}
const celdaParteTotal = {
  ...celdaParte,
  fontWeight: "bold",
  backgroundColor: "#dcefeb",
  fontSize: "15px"
}
