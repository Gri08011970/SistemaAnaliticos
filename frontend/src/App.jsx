import { useEffect, useState } from "react"
import axios from "axios"

import Busqueda from "./components/Busqueda"
import TablaEstudiantes from "./components/TablaEstudiantes"
import Estadisticas from "./components/Estadisticas"
import FormularioNuevo from "./components/FormularioNuevo"
import PlanillaElevacion from "./components/PlanillaElevacion"
import ImportarExcel from "./components/ImportarExcel"
import Login from "./components/Login"

export default function App() {
  const [dniBusqueda, setDniBusqueda] = useState("")
  const [apellidoBusqueda, setApellidoBusqueda] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [estudiantes, setEstudiantes] = useState([])
  const [alumnoEditando, setAlumnoEditando] = useState(null)
  const [modoImprimirLista, setModoImprimirLista] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState("formulario")
  const [logueado, setLogueado] = useState(false)

  useEffect(() => {
    obtenerAlumnos()
  }, [])

  async function obtenerAlumnos() {
    try {
      const respuesta = await axios.get("/alumnos")
      setEstudiantes(respuesta.data)
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

  async function agregarEstudiante(nuevoEstudiante) {
    try {
      await axios.post("/alumnos", nuevoEstudiante)
      obtenerAlumnos()
      setSeccionActiva("lista")
    } catch (error) {
      console.log(error)
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
    try {
      await axios.delete(`/alumnos/${id}`)
      obtenerAlumnos()
    } catch (error) {
      console.log(error)
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
    const seleccionados = estudiantes.filter(
      (alumno) => alumno.seleccionado
    )

    if (seleccionados.length === 0) {
      alert("Seleccioná al menos un alumno para generar la planilla.")
      return
    }

    setSeccionActiva("eleve")
  }

  if (!logueado) {
    return <Login setLogueado={setLogueado} />
  }

  return (
    <div
      style={{
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1
          style={{
            color: "#1e3a5f",
            marginBottom: "5px"
          }}
        >
          Sistema de Gestión de pedidos de Analíticos
        </h1> <br />

        <p
          style={{
            color: "#666",
            marginBottom: "30px"
          }}
        >
          Escuela Educación Secundaria N°140 "Florencio Molina Campos"
        </p>

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
          <button
            onClick={() => setSeccionActiva("formulario")}
            style={botonMenu}
          >
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

          <button
            onClick={generarPlanillaElevacion}
            style={botonMenu}
          >
            Planilla de Eleve
          </button>

          <button
            onClick={() => setSeccionActiva("estadisticas")}
            style={botonMenu}
          >
            Estadísticas
          </button>
        </div>

        {seccionActiva === "formulario" && (
          <>
            <ImportarExcel
              importarEstudiantes={importarEstudiantes}
            />

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
          />
        )}

        {seccionActiva === "eleve" && (
          <PlanillaElevacion
            estudiantes={estudiantes}
          />
        )}

        {seccionActiva === "estadisticas" && (
          <Estadisticas
            estudiantes={estudiantes}
          />
        )}
      </div>
    </div>
  )
}

const botonMenu = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
}