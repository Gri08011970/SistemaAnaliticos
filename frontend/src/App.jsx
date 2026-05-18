import { useEffect, useRef, useState } from "react"
import axios from "axios"

import Busqueda from "./components/Busqueda"
import Botones from "./components/Botones"
import TablaEstudiantes from "./components/TablaEstudiantes"
import Estadisticas from "./components/Estadisticas"
import FormularioNuevo from "./components/FormularioNuevo"
import PlanillaElevacion from "./components/PlanillaElevacion"

export default function App() {
  const [dniBusqueda, setDniBusqueda] = useState("")
  const [apellidoBusqueda, setApellidoBusqueda] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [estudiantes, setEstudiantes] = useState([])
  const [alumnoEditando, setAlumnoEditando] = useState(null)

  const formularioRef = useRef(null)
  const tablaRef = useRef(null)
  const planillaRef = useRef(null)

  useEffect(() => {
    obtenerAlumnos()
  }, [])

  async function obtenerAlumnos() {
    try {
      const respuesta = await axios.get("http://localhost:3001/alumnos")
      setEstudiantes(respuesta.data)
    } catch (error) {
      console.log(error)
    }
  }

  function irAFormulario() {
    formularioRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function irATabla() {
    tablaRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function verListaCompleta() {
    setDniBusqueda("")
    setApellidoBusqueda("")
    tablaRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function agregarEstudiante(nuevoEstudiante) {
    try {
      await axios.post("http://localhost:3001/alumnos", nuevoEstudiante)
      obtenerAlumnos()
    } catch (error) {
      console.log(error)
    }
  }

  async function actualizarEstudianteEditado(id, datosActualizados) {
    try {
      await axios.put(
        `http://localhost:3001/alumnos/${id}`,
        datosActualizados
      )

      obtenerAlumnos()
      setAlumnoEditando(null)
    } catch (error) {
      console.log(error)
    }
  }

  function actualizarEstado(dni, nuevoEstado) {
    const estudiantesActualizados = estudiantes.map((alumno) => {
      if (alumno.dni === dni) {
        return {
          ...alumno,
          estado: nuevoEstado
        }
      }

      return alumno
    })

    setEstudiantes(estudiantesActualizados)
  }

  function actualizarCarpeta(dni, nuevaCarpeta) {
    const estudiantesActualizados = estudiantes.map((alumno) => {
      if (alumno.dni === dni) {
        return {
          ...alumno,
          carpeta: nuevaCarpeta
        }
      }

      return alumno
    })

    setEstudiantes(estudiantesActualizados)
  }

  async function eliminarEstudiante(id) {
    try {
      await axios.delete(`http://localhost:3001/alumnos/${id}`)

      obtenerAlumnos()
    } catch (error) {
      console.log(error)
    }
  }

  function editarEstudiante(alumno) {
    setAlumnoEditando(alumno)

    formularioRef.current?.scrollIntoView({
      behavior: "smooth"
    })
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

    planillaRef.current?.scrollIntoView({ behavior: "smooth" })
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
          Sistema de Gestión de Analíticos
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
          irATabla={irATabla}
        />

        <Botones
          irAFormulario={irAFormulario}
          verListaCompleta={verListaCompleta}
          generarPlanillaElevacion={generarPlanillaElevacion}
        />

        <Estadisticas estudiantes={estudiantes} />

        <div ref={formularioRef}>
          <FormularioNuevo
            agregarEstudiante={agregarEstudiante}
            actualizarEstudianteEditado={actualizarEstudianteEditado}
            alumnoEditando={alumnoEditando}
            setAlumnoEditando={setAlumnoEditando}
          />
        </div>

        <div ref={tablaRef}>
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
          />
        </div>

        <div ref={planillaRef}>
          <PlanillaElevacion estudiantes={estudiantes} />
        </div>
      </div>
    </div>
  )
}