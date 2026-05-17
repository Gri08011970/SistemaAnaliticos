import { useEffect, useRef, useState } from "react"

import Busqueda from "./components/Busqueda"
import Botones from "./components/Botones"
import TablaEstudiantes from "./components/TablaEstudiantes"
import Estadisticas from "./components/Estadisticas"
import FormularioNuevo from "./components/FormularioNuevo"
import PlanillaElevacion from "./components/PlanillaElevacion"

export default function App() {
  const [dniBusqueda, setDniBusqueda] = useState("")
  const [apellidoBusqueda, setApellidoBusqueda] = useState("")

  const estudiantesIniciales = [
    {
      nombre: "Pérez Ana",
      dni: "40111222",
      estado: "Para entregar",
      carpeta: "Carpeta 2",
      seleccionado: false
    },
    {
      nombre: "Gómez Luis",
      dni: "39888777",
      estado: "En Jefatura",
      carpeta: "Carpeta 1",
      seleccionado: false
    },
    {
      nombre: "Martínez Carla",
      dni: "41222333",
      estado: "Pendiente",
      carpeta: "---",
      seleccionado: false
    }
  ]

  const [estudiantes, setEstudiantes] = useState(() => {
    const datosGuardados = localStorage.getItem("estudiantes")

    if (datosGuardados) {
      return JSON.parse(datosGuardados)
    }

    return estudiantesIniciales
  })

  useEffect(() => {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes))
  }, [estudiantes])

  const formularioRef = useRef(null)
  const tablaRef = useRef(null)

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

  function agregarEstudiante(nuevoEstudiante) {
    setEstudiantes([
      ...estudiantes,
      nuevoEstudiante
    ])
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

  function eliminarEstudiante(dni) {
    const estudiantesFiltrados = estudiantes.filter(
      (alumno) => alumno.dni !== dni
    )

    setEstudiantes(estudiantesFiltrados)
  }
  function generarPlanillaElevacion() {
  const seleccionados = estudiantes.filter(
    (alumno) => alumno.seleccionado
  )

  if (seleccionados.length === 0) {
    alert("Seleccioná al menos un alumno para generar la planilla.")
    return
  }

  console.log("Alumnos seleccionados:", seleccionados)
  alert("Planilla de elevación preparada. Próximo paso: diseñarla en pantalla.")
}

  function seleccionarAlumno(dni) {
    const estudiantesActualizados = estudiantes.map((alumno) => {
      if (alumno.dni === dni) {
        return {
          ...alumno,
          seleccionado: !alumno.seleccionado
        }
      }

      return alumno
    })

    setEstudiantes(estudiantesActualizados)
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

        <Estadisticas
          estudiantes={estudiantes}
        />

        <div ref={formularioRef}>
          <FormularioNuevo
            agregarEstudiante={agregarEstudiante}
          />
        </div>

        <div ref={tablaRef}>
          <TablaEstudiantes
            dniBusqueda={dniBusqueda}
            apellidoBusqueda={apellidoBusqueda}
            estudiantes={estudiantes}
            actualizarEstado={actualizarEstado}
            actualizarCarpeta={actualizarCarpeta}
            eliminarEstudiante={eliminarEstudiante}
            seleccionarAlumno={seleccionarAlumno}
          />
        </div>
        <PlanillaElevacion
           estudiantes={estudiantes}
        />
      </div>
    </div>
  )
}