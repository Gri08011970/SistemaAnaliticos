import { useEffect, useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export default function Matricula() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [alumnosMatricula, setAlumnosMatricula] = useState([])

  const [alumnoEditando, setAlumnoEditando] = useState(null)

  const [alumnoMoviendo, setAlumnoMoviendo] = useState(null)
  const [nuevoCurso, setNuevoCurso] = useState("")
  const [nuevoTurno, setNuevoTurno] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [verEstadisticasGeneral, setVerEstadisticasGeneral] = useState(true)
  const [verEstadisticasCurso, setVerEstadisticasCurso] = useState(false)
  const [mostrarTurnoManana, setMostrarTurnoManana] = useState(false)
  const [mostrarTurnoTarde, setMostrarTurnoTarde] = useState(false)
  const [filtroPrevia, setFiltroPrevia] = useState("")
  const [filtroAnioPrevia, setFiltroAnioPrevia] = useState("")
  const [previaSeleccionada, setPreviaSeleccionada] = useState("")
  const [anioPrevia, setAnioPrevia] = useState("")
  const [verPlanillaPrevias, setVerPlanillaPrevias] = useState(false)
  const [materiaExamen, setMateriaExamen] = useState("")
  const [anioExamen, setAnioExamen] = useState("")

  const [nuevoAlumno, setNuevoAlumno] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    fechaNacimiento: "",
    materiasPendientes: [],
    condicionFinal: ""
  })

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

  function editarAlumno(alumno) {
    setAlumnoEditando(alumno)

    setNuevoAlumno({
      apellido: alumno.apellido || "",
      nombre: alumno.nombre || "",
      dni: alumno.dni || "",
      fechaNacimiento: alumno.fechaNacimiento || "",
      materiasPendientes: Array.isArray(alumno.materiasPendientes)
        ? alumno.materiasPendientes
        : [],
      condicionFinal: alumno.condicionFinal || ""
    })
  }

  function limpiarFormulario() {
    setNuevoAlumno({
      apellido: "",
      nombre: "",
      dni: "",
      fechaNacimiento: "",
      condicionFinal: "",
      materiasPendientes: []
    })

    setMateriaPrevia("")
    setAnioPrevia("")

    setEditandoId(null)
  }

  function prepararMovimiento(alumno) {
    setAlumnoMoviendo(alumno)
    setNuevoCurso(alumno.curso)
    setNuevoTurno(alumno.turno)
  }
  async function moverAlumno() {
    if (!alumnoMoviendo) return

    try {
      await axios.put(
        `/api/matricula/${alumnoMoviendo._id}`,
        {
          ...alumnoMoviendo,
          curso: nuevoCurso,
          turno: nuevoTurno
        }
      )

      setAlumnoMoviendo(null)
      obtenerMatricula()
    } catch (error) {
      console.log(error)
    }
  }

  function agregarPrevia() {
    if (!previaSeleccionada || !anioPrevia) return

    const nuevaPrevia = {
      asignatura: previaSeleccionada,
      anio: anioPrevia
    }

    setNuevoAlumno({
      ...nuevoAlumno,
      materiasPendientes: [
        ...nuevoAlumno.materiasPendientes,
        nuevaPrevia
      ]
    })

    setPreviaSeleccionada("")
    setAnioPrevia("")
  }

  async function guardarAlumnoMatricula() {
    if (guardando) return

    setGuardando(true)

    try {
      const alumnoAGuardar = {
        ...nuevoAlumno,
        curso: cursoSeleccionado.curso,
        turno: cursoSeleccionado.turno,
        estadoMatricula: "Activo"
      }

      if (alumnoEditando) {
        await axios.put(`/api/matricula/${alumnoEditando._id}`, alumnoAGuardar)
        setAlumnoEditando(null)
      } else {
        await axios.post("/api/matricula", alumnoAGuardar)
      }

      setNuevoAlumno({
        apellido: "",
        nombre: "",
        dni: "",
        fechaNacimiento: "",
        materiasPendientes: [],
        condicionFinal: ""
      })

      obtenerMatricula()
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.mensaje)
        return
      }

      console.log(error)
      alert("Error al guardar estudiante")

    } finally {
      setGuardando(false)
    }
  }

  const cursosManana = [
    "1°1°", "1°2°",
    "2°1°", "2°2°",
    "3°1°", "3°2°",
    "4°1°", "4°2°",
    "5°1°", "5°2°",
    "6°1°", "6°2°"
  ]

  const cursosTarde = [
    "1°3°", "1°4°",
    "2°3°", "2°4°",
    "3°3°", "3°4°",
    "4°3°", "4°4°",
    "5°3°", "5°4°",
    "6°3°", "6°4°"
  ]

  const asignaturas = [
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Educación Artística",
    "Educación Física",
    "Inglés",
    "Matemática",
    "Prácticas del Lenguaje",
    "Construcción de Ciudadanía",
    "Biología",
    "Fisicoquímica",
    "Geografía",
    "Historia",
    "Literatura",
    "Matemática Ciclo Superior",
    "NTICX",
    "Salud y Adolescencia",
    "Introducción a la Física",
    "Introducción a la Química",
    "Política y Ciudadanía",
    "Producción y Análisis de Imágenes",
    "Imagen y Nuevos Medios",
    "Imagen y Procedimientos Constructivos"
  ]

  const aniosMateria = [
    "1°",
    "2°",
    "3°",
    "4°",
    "5°",
    "6°"
  ]

  const alumnosDelCurso = cursoSeleccionado
    ? alumnosMatricula
      .filter((alumno) =>
        alumno.curso === cursoSeleccionado.curso &&
        alumno.turno === cursoSeleccionado.turno &&
        alumno.estadoMatricula === "Activo"
      )
      .sort((a, b) =>
        `${a.apellido} ${a.nombre}`.localeCompare(
          `${b.apellido} ${b.nombre}`,
          "es",
          { sensitivity: "base" }
        )
      )
    : []

  const alumnosFiltrados = alumnosDelCurso.filter((alumno) => {

    if (!filtroPrevia && !filtroAnioPrevia) {
      return true
    }

    return alumno.materiasPendientes?.some((previa) => {

      const coincideMateria =
        !filtroPrevia ||
        previa.asignatura === filtroPrevia

      const coincideAnio =
        !filtroAnioPrevia ||
        previa.anio === filtroAnioPrevia

      return coincideMateria && coincideAnio
    })
  })

  function contarAlumnos(curso, turno) {
    return alumnosMatricula.filter(
      (alumno) =>
        alumno.curso === curso &&
        alumno.turno === turno &&
        alumno.estadoMatricula === "Activo"
    ).length
  }

  const totalEstudiantes = alumnosDelCurso.length

  const totalProm = alumnosDelCurso.filter(
    alumno => alumno.condicionFinal === "Prom"
  ).length

  const totalRec = alumnosDelCurso.filter(
    alumno => alumno.condicionFinal === "Rec"
  ).length

  const totalConPrevias = alumnosDelCurso.filter(
    alumno => alumno.materiasPendientes?.length > 0
  ).length

  const porcentajeProm =
    totalEstudiantes > 0
      ? ((totalProm / totalEstudiantes) * 100).toFixed(0)
      : 0

  const porcentajeRec =
    totalEstudiantes > 0
      ? ((totalRec / totalEstudiantes) * 100).toFixed(0)
      : 0

  const totalSobreedad = alumnosDelCurso.filter((alumno) => {
    if (!alumno.fechaNacimiento) return false

    const edad = calcularEdadAl30Junio(alumno.fechaNacimiento)

    const anioCurso = Number(cursoSeleccionado.curso.charAt(0))

    const edadesEsperadas = {
      1: 12,
      2: 13,
      3: 14,
      4: 15,
      5: 16,
      6: 17
    }

    return edad > edadesEsperadas[anioCurso]
  }).length

  function calcularEdadAl30Junio(fechaNacimiento) {
    if (!fechaNacimiento) return "-"

    const nacimiento = new Date(fechaNacimiento)
    const anioActual = new Date().getFullYear()
    const fechaCorte = new Date(anioActual, 5, 30)

    let edad = fechaCorte.getFullYear() - nacimiento.getFullYear()

    const cumpleEsteAnio = new Date(
      anioActual,
      nacimiento.getMonth(),
      nacimiento.getDate()
    )

    if (cumpleEsteAnio > fechaCorte) {
      edad--
    }

    return edad
  }

  function formatearFecha(fecha) {
    if (!fecha) return "-"

    const [anio, mes, dia] = fecha.split("-")

    return `${dia}-${mes}-${anio}`
  }

  async function eliminarAlumnoMatricula(id) {
    const confirmar = confirm("¿Eliminar este estudiante de la matrícula?")

    if (!confirmar) return

    try {
      await axios.delete(`/api/matricula/${id}`)
      obtenerMatricula()
    } catch (error) {
      console.log(error)
    }
  }

  function imprimirCurso() {
    window.print()
  }

  function formatearDNI(dni) {
    if (!dni) return ""

    return dni
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }



  function exportarExcel() {
    const datos = alumnosDelCurso.map((alumno) => ({
      "Apellido y Nombre": `${alumno.apellido || ""}, ${alumno.nombre || ""}`,
      "DNI": alumno.dni || "",
      "Fecha nacimiento": formatearFecha(alumno.fechaNacimiento),
      "Edad al 30/06": calcularEdadAl30Junio(alumno.fechaNacimiento),
      "Materias pendientes": Array.isArray(alumno.materiasPendientes)
        ? alumno.materiasPendientes
          .map((previa) => `${previa.asignatura} (${previa.anio})`)
          .join(", ")
        : "",
      "Condición": alumno.condicionFinal || "",
      "Curso": cursoSeleccionado?.curso || "",
      "Turno": cursoSeleccionado?.turno || ""
    }))

    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(libro, hoja, "Matrícula")

    const excelBuffer = XLSX.write(libro, {
      bookType: "xlsx",
      type: "array"
    })

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })

    saveAs(
      archivo,
      `Matricula_${cursoSeleccionado?.curso || "curso"}_${cursoSeleccionado?.turno || "turno"}.xlsx`
    )
  }

  function normalizarTexto(texto) {
    return texto
      ?.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  }

  function calcularCondicionDesdeEstado(estado) {
    const estadoNormalizado = normalizarTexto(estado)

    if (estadoNormalizado.includes("baja")) {
      return "BAJA"
    }

    if (estadoNormalizado.includes("continua mismo ano de estudio")) {
      return "Rec"
    }

    if (estadoNormalizado.includes("ingresante al nivel")) {
      return ""
    }

    return "Prom"
  }

  async function importarReporteOficial(evento) {
    const archivo = evento.target.files[0]
    if (!archivo || !cursoSeleccionado) return

    const datos = await archivo.arrayBuffer()
    const libro = XLSX.read(datos)
    const hoja = libro.Sheets[libro.SheetNames[0]]
    const filas = XLSX.utils.sheet_to_json(hoja, { header: 1, defval: "" })

    const filaEncabezadosIndex = filas.findIndex((fila) =>
      fila.some((celda) => normalizarTexto(celda).includes("nombre estudiante"))
    )

    if (filaEncabezadosIndex === -1) {
      alert("No encontré las columnas del reporte oficial.")
      return
    }

    const encabezados = filas[filaEncabezadosIndex].map(normalizarTexto)

    const indiceEstado = encabezados.findIndex((h) =>
      h.includes("estado inscripcion")
    )

    const indiceNombre = encabezados.findIndex((h) =>
      h.includes("nombre estudiante")
    )

    const indiceDni = encabezados.findIndex((h) =>
      h.includes("documento estudiante")
    )

    let ultimoEstado = ""

    const alumnosParaImportar = filas
      .slice(filaEncabezadosIndex + 1)
      .map((fila) => {
        const estadoFila = fila[indiceEstado] || ultimoEstado
        if (fila[indiceEstado]) ultimoEstado = fila[indiceEstado]

        const condicion = calcularCondicionDesdeEstado(estadoFila)

        if (condicion === "BAJA") return null

        const nombreCompleto = fila[indiceNombre]?.toString().trim()
        const dni = fila[indiceDni]?.toString().replace(/\D/g, "")

        if (!nombreCompleto || !dni) return null

        return {
          apellido: nombreCompleto,
          nombre: "",
          dni,
          curso: cursoSeleccionado.curso,
          turno: cursoSeleccionado.turno,
          fechaNacimiento: "",
          materiasPendientes: [],
          condicionFinal: condicion,
          estadoMatricula: "Activo"
        }
      })
      .filter(Boolean)

    try {
      for (const alumno of alumnosParaImportar) {
        await axios.post("/api/matricula", alumno)
      }

      obtenerMatricula()
      alert(`Se importaron ${alumnosParaImportar.length} estudiantes.`)
    } catch (error) {
      console.log(error)
      alert("Hubo un error al importar el reporte.")
    }

    evento.target.value = ""
  }
  const totalGeneral = alumnosMatricula.length

  const totalManana = alumnosMatricula.filter(
    alumno => alumno.turno === "Mañana"
  ).length

  const totalTarde = alumnosMatricula.filter(
    alumno => alumno.turno === "Tarde"
  ).length

  const cicloBasico = alumnosMatricula.filter(
    alumno =>
      alumno.curso?.startsWith("1°") ||
      alumno.curso?.startsWith("2°") ||
      alumno.curso?.startsWith("3°")
  ).length

  const cicloSuperior = alumnosMatricula.filter(
    alumno =>
      alumno.curso?.startsWith("4°") ||
      alumno.curso?.startsWith("5°") ||
      alumno.curso?.startsWith("6°")
  ).length

  function eliminarPrevia(index) {
    setNuevoAlumno({
      ...nuevoAlumno,
      materiasPendientes: nuevoAlumno.materiasPendientes.filter(
        (_, i) => i !== index
      )
    })
  }

  function obtenerAnioDelCurso(curso) {
    return curso?.charAt(0)
  }

  function tieneSobreedad(alumno) {
    const anio = obtenerAnioDelCurso(alumno.curso)
    const edadEsperada = edadEsperadaPorAnio[anio]
    const edad = calcularEdadAl30Junio(alumno.fechaNacimiento)

    return edad !== "-" && edad > edadEsperada
  }

  const edadesDelCurso = alumnosDelCurso.reduce((contador, alumno) => {
    const edad = calcularEdadAl30Junio(alumno.fechaNacimiento)

    if (edad === "-") return contador

    contador[edad] = (contador[edad] || 0) + 1

    return contador
  }, {})

  const alumnosParaExamen = alumnosMatricula.filter((alumno) =>
    alumno.materiasPendientes?.some((previa) => {
      const coincideMateria =
        !materiaExamen || previa.asignatura === materiaExamen

      const coincideAnio =
        !anioExamen || previa.anio === anioExamen

      return coincideMateria && coincideAnio
    })
  )

  function imprimirPlanillaPrevias() {
    window.print()
  }

  function tieneSobreedad(alumno) {
    if (!alumno.fechaNacimiento || !alumno.curso) return false

    const edad = calcularEdadAl30Junio(alumno.fechaNacimiento)
    const anioCurso = Number(alumno.curso.charAt(0))

    const edadesEsperadas = {
      1: 12,
      2: 13,
      3: 14,
      4: 15,
      5: 16,
      6: 17
    }

    return edad > edadesEsperadas[anioCurso]
  }

  function cerrarPlanillaPrevias() {
    setVerPlanillaPrevias(false)
    setMateriaExamen("")
    setAnioExamen("")
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "#1e3a5f" }}>
        Gestión de Matrícula
      </h2>

      <p style={{ color: "#666" }}>
        Organización por turno, año y sección.
      </p>



      {!cursoSeleccionado && (
        <>
          {verEstadisticasGeneral && (
            <div style={bloqueEstadisticas}>
              <div style={tarjetaEstadistica}>
                <h3>Total general</h3>
                <p>{totalGeneral}</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>turno mañana</h3>
                <p>{totalManana}</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>Turno Tarde</h3>
                <p>{totalTarde}</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>Ciclo básico</h3>
                <p>{cicloBasico}</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>Ciclo superior</h3>
                <p>{cicloSuperior}</p>
              </div>
            </div>
          )}
          <button
            style={botonImprimir}
            onClick={() => {
              setVerPlanillaPrevias(!verPlanillaPrevias)

              setMateriaExamen("")
              setAnioExamen("")
            }}
          >
            📋 Planilla de examen
          </button>
          {verPlanillaPrevias && (
            <div style={detalleCurso}>
              <h3 style={{ color: "#1e3a5f" }}>
                📋 Planilla de examen por previas
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "15px"
                }}
              >
                <select
                  style={inputAlumno}
                  value={materiaExamen}
                  onChange={(e) => setMateriaExamen(e.target.value)}
                >
                  <option value="">Seleccionar asignatura</option>

                  {asignaturas.map((asignatura) => (
                    <option key={asignatura} value={asignatura}>
                      {asignatura}
                    </option>
                  ))}
                </select>

                <select
                  style={inputAlumno}
                  value={anioExamen}
                  onChange={(e) => setAnioExamen(e.target.value)}
                >
                  <option value="">Seleccionar año</option>

                  {aniosMateria.map((anio) => (
                    <option key={anio} value={anio}>
                      {anio}
                    </option>
                  ))}
                </select>
              </div>

              <p>
                Cantidad de estudiantes: {alumnosParaExamen.length}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  marginTop: "10px"
                }}
              >
                <button
                  style={botonImprimir}
                  onClick={imprimirPlanillaPrevias}
                >
                  🖨️ Imprimir planilla
                </button>

                <button
                  style={botonVolver}
                  onClick={cerrarPlanillaPrevias}
                >
                  Cerrar planilla
                </button>
              </div>

              <table style={tabla}>
                <thead>
                  <tr>
                    <th style={celda}>Apellido y Nombre</th>
                    <th style={celda}>DNI</th>
                    <th style={celda}>Curso</th>
                    <th style={celda}>Turno</th>
                    <th style={celda}>Materia</th>
                    <th style={celda}>Año</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosParaExamen.map((alumno) =>
                    alumno.materiasPendientes
                      .filter((previa) => {
                        const coincideMateria =
                          !materiaExamen || previa.asignatura === materiaExamen

                        const coincideAnio =
                          !anioExamen || previa.anio === anioExamen

                        return coincideMateria && coincideAnio
                      })
                      .map((previa, index) => (
                        <tr key={`${alumno._id}-${index}`}>
                          <td style={celda}>
                            {alumno.apellido}, {alumno.nombre}
                          </td>
                          <td style={celda}>{formatearDNI(alumno.dni)}</td>
                          <td style={celda}>{alumno.curso}</td>
                          <td style={celda}>{alumno.turno}</td>
                          <td style={celda}>{previa.asignatura}</td>
                          <td style={celda}>{previa.anio}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div style={contenedorTurnos}>
            <div style={bloqueTurno}>
              <div
                onClick={() => setMostrarTurnoManana(!mostrarTurnoManana)}
                style={{
                  ...tituloTurno,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>📚 Turno Mañana</span>

                <span style={{ fontSize: "18px" }}>
                  {mostrarTurnoManana ? "▼" : "▶"}
                </span>
              </div>
              {mostrarTurnoManana && (
                <div style={grillaCursos}>
                  {cursosManana.map((curso) => (
                    <div key={curso} style={tarjetaCurso}>
                      <h4>{curso}</h4>

                      <p style={textoCantidad}>
                        {contarAlumnos(curso, "Mañana")} estudiantes
                      </p>

                      <button
                        style={botonCurso}
                        onClick={() =>
                          setCursoSeleccionado({
                            curso,
                            turno: "Mañana"
                          })
                        }
                      >
                        Ver curso
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={bloqueTurno}>
              <div
                onClick={() => setMostrarTurnoTarde(!mostrarTurnoTarde)}
                style={{
                  ...tituloTurno,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>📚 Turno Tarde</span>

                <span style={{ fontSize: "18px" }}>
                  {mostrarTurnoTarde ? "▼" : "▶"}
                </span>
              </div>
              {mostrarTurnoTarde && (
                <div style={grillaCursos}>
                  {cursosTarde.map((curso) => (
                    <div key={curso} style={tarjetaCurso}>
                      <h4>{curso}</h4>

                      <p style={textoCantidad}>
                        {contarAlumnos(curso, "Tarde")} estudiantes
                      </p>

                      <button
                        style={botonCurso}
                        onClick={() =>
                          setCursoSeleccionado({
                            curso,
                            turno: "Tarde"
                          })
                        }
                      >
                        Ver curso
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {cursoSeleccionado && (
        <div
          style={detalleCurso}
          className="area-impresion"
        >
          <h3 style={{ color: "#1e3a5f" }}>
            Curso: {cursoSeleccionado.curso} - Turno{" "}
            {cursoSeleccionado.turno}
          </h3>

          <p>
            Cantidad de estudiantes: {alumnosDelCurso.length}
          </p>

          {verEstadisticasCurso && (
            <div style={bloqueEstadisticas}>
              <div style={tarjetaEstadistica}>
                <h3>Total</h3>
                <p>{totalEstudiantes}</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>Prom</h3>
                <p>{totalProm} ({porcentajeProm}%)</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>Rec</h3>
                <p>{totalRec} ({porcentajeRec}%)</p>
              </div>

              <div style={tarjetaEstadistica}>
                <h3>Con previas</h3>
                <p>{totalConPrevias}</p>
              </div>
            </div>
          )}

          {verEstadisticasCurso && (
            <div
              style={{
                ...tarjetaEstadistica,
                maxWidth: "180px",
                margin: "20px auto 10px auto"
              }}
            >
              <h3>Sobreedad</h3>
              <p>{totalSobreedad}</p>
            </div>
          )}

          <div style={bloqueEdades}>
            <h3 style={{ color: "#1e3a5f" }}>
              Edades del curso
            </h3>

            <div style={grillaEdades}>
              {Object.entries(edadesDelCurso)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([edad, cantidad]) => (
                  <div key={edad} style={tarjetaEdad}>
                    <strong>{edad} años</strong>
                    <p>{cantidad}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="no-print">
            <button
              style={botonVolver}
              onClick={() =>
                setCursoSeleccionado(null)
              }
            >
              Volver a todos los cursos
            </button>

            <button
              style={botonImprimir}
              onClick={imprimirCurso}
            >
              🖨️ Imprimir curso
            </button>

            <button
              style={botonImprimir}
              onClick={() =>
                setVerEstadisticasCurso(!verEstadisticasCurso)
              }
            >
              📊 Estadísticas
            </button>

            <button
              style={botonImprimir}
              onClick={exportarExcel}
            >
              Exportar Excel
            </button>

            <div
              style={{
                marginTop: "10px",
                marginBottom: "15px"
              }}
            >
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={importarReporteOficial}
              />
            </div>
          </div>
          <div
            style={formularioAlumno}
            className="no-print"
          >
            <input
              placeholder="Apellido"
              style={inputAlumno}
              value={nuevoAlumno.apellido}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  apellido: e.target.value
                })
              }
            />

            <input
              placeholder="Nombre"
              style={inputAlumno}
              value={nuevoAlumno.nombre}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  nombre: e.target.value
                })
              }
            />

            <input
              placeholder="DNI"
              style={inputAlumno}
              value={nuevoAlumno.dni}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  dni: e.target.value
                })
              }
            />

            <input
              type="date"
              style={inputAlumno}
              value={nuevoAlumno.fechaNacimiento}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  fechaNacimiento: e.target.value
                })
              }
            />

            <div style={bloquePrevias}>
              <select
                style={inputAlumno}
                value={previaSeleccionada}
                onChange={(e) =>
                  setPreviaSeleccionada(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Asignatura
                </option>

                {asignaturas.map(
                  (asignatura) => (
                    <option
                      key={asignatura}
                      value={asignatura}
                    >
                      {asignatura}
                    </option>
                  )
                )}
              </select>

              <select
                style={inputAlumno}
                value={anioPrevia}
                onChange={(e) =>
                  setAnioPrevia(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Año
                </option>

                {aniosMateria.map((anio) => (
                  <option
                    key={anio}
                    value={anio}
                  >
                    {anio}
                  </option>
                ))}
              </select>

              <button
                type="button"
                style={botonAgregarPrevia}
                onClick={agregarPrevia}
              >
                Agregar previa
              </button>
            </div>

            <div style={{ marginTop: "8px" }}>
              {nuevoAlumno.materiasPendientes.map(
                (previa, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "5px"
                    }}
                  >
                    <span>
                      • {previa.asignatura} ({previa.anio})
                    </span>

                    <button
                      type="button"
                      onClick={() => eliminarPrevia(index)}
                      style={botonEliminar}
                    >
                      🗑️
                    </button>
                  </div>
                )
              )}
            </div>

            <select
              style={inputAlumno}
              value={nuevoAlumno.condicionFinal}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  condicionFinal:
                    e.target.value
                })
              }
            >
              <option value="">
                Prom / Rec
              </option>

              <option value="Prom">
                Prom
              </option>

              <option value="Rec">
                Rec
              </option>
            </select>

            <button
              style={botonAgregar}
              onClick={
                guardarAlumnoMatricula
              }
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : alumnoEditando
                  ? "Guardar cambios"
                  : "Agregar estudiante"}
            </button>
            <button
              style={botonVolver}
              onClick={limpiarFormulario}
            >
              Limpiar formulario
            </button>
          </div>
          {alumnoMoviendo && (
            <div style={bloqueMovimiento}>
              <h4>🔁 Movimiento de matrícula</h4>

              <p>
                {alumnoMoviendo.apellido},{" "}
                {alumnoMoviendo.nombre}
              </p>

              <select
                value={nuevoCurso}
                onChange={(e) =>
                  setNuevoCurso(e.target.value)
                }
                style={inputAlumno}
              >
                {[...cursosManana, ...cursosTarde].map(
                  (curso) => (
                    <option
                      key={curso}
                      value={curso}
                    >
                      {curso}
                    </option>
                  )
                )}
              </select>

              <select
                value={nuevoTurno}
                onChange={(e) =>
                  setNuevoTurno(e.target.value)
                }
                style={inputAlumno}
              >
                <option value="Mañana">
                  Mañana
                </option>

                <option value="Tarde">
                  Tarde
                </option>
              </select>

              <button
                style={botonAgregarPrevia}
                onClick={moverAlumno}
              >
                Mover estudiante
              </button>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px"
            }}
          >
            <select
              style={inputAlumno}
              value={filtroPrevia}
              onChange={(e) =>
                setFiltroPrevia(e.target.value)
              }
            >
              <option value="">
                Filtrar por asignatura
              </option>

              {asignaturas.map((asignatura) => (
                <option
                  key={asignatura}
                  value={asignatura}
                >
                  {asignatura}
                </option>
              ))}
            </select>

            <select
              style={inputAlumno}
              value={filtroAnioPrevia}
              onChange={(e) =>
                setFiltroAnioPrevia(e.target.value)
              }
            >
              <option value="">
                Filtrar por año
              </option>

              {aniosMateria.map((anio) => (
                <option
                  key={anio}
                  value={anio}
                >
                  {anio}
                </option>
              ))}
            </select>

            <button
              style={botonVolver}
              onClick={() => {
                setFiltroPrevia("")
                setFiltroAnioPrevia("")
              }}
            >
              Limpiar filtros
            </button>
          </div>
          <table style={tabla}>
            <thead>
              <tr>
                <th style={{ ...celda, width: "220px" }}>
                  Apellido y Nombre
                </th>

                <th style={celda}>
                  DNI
                </th>

                <th style={{ ...celda, width: "95px" }}>
                  Fecha nacimiento
                </th>

                <th style={{ ...celda, width: "55px" }}>
                  Edad
                </th>

                <th style={{ ...celda, width: "240px" }}>
                  Pendientes
                </th>

                <th style={{ ...celda, width: "65px" }}>
                  Cond.
                </th>

                <th style={{ ...celda, width: "140px" }}>
                  Acciones
                </th>

              </tr>
            </thead>

            <tbody>
              {alumnosDelCurso.length ===
                0 && (
                  <tr>
                    <td
                      style={celda}
                      colSpan="8"
                    >
                      Todavía no hay
                      estudiantes cargados
                      en este curso.
                    </td>
                  </tr>
                )}

              {alumnosFiltrados.map(
                (alumno) => (
                  <tr key={alumno._id}>
                    <td style={celda}>
                      {alumno.apellido},{" "}
                      {alumno.nombre}
                    </td>

                    <td style={celda}>
                      {formatearDNI(alumno.dni)}
                    </td>

                    <td style={celda}>
                      {formatearFecha(
                        alumno.fechaNacimiento
                      )}
                    </td>

                    <td style={celda}>
                      {calcularEdadAl30Junio(
                        alumno.fechaNacimiento
                      )}

                      {tieneSobreedad(alumno) && (
                        <span style={alertaSobreedad}>
                          ⚠️
                        </span>
                      )}
                    </td>

                    <td style={celda}>
                      {Array.isArray(
                        alumno.materiasPendientes
                      )
                        ? alumno.materiasPendientes
                          .map(
                            (previa) =>
                              `${previa.asignatura} (${previa.anio})`
                          )
                          .join(", ")
                        : ""}
                    </td>

                    <td style={celda}>
                      {
                        alumno.condicionFinal
                      }
                    </td>


                    <td
                      style={{
                        ...celda,
                        whiteSpace: "nowrap"
                      }}
                      className="no-print"
                    >
                      <button
                        style={botonEditar}
                        onClick={() => editarAlumno(alumno)}
                      >
                        ✏️
                      </button>

                      <button
                        style={botonMover}
                        onClick={() => prepararMovimiento(alumno)}
                      >
                        🔁
                      </button>

                      <button
                        style={botonEliminar}
                        onClick={() => eliminarAlumnoMatricula(alumno._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

        </div>
      )}
    </div>
  )
}

const contenedorTurnos = {
  display: "flex",
  flexDirection: "column",
  gap: "35px",
  marginTop: "25px"
}

const bloqueTurno = {
  backgroundColor: "#eef7f6",
  border: "2px solid #c7e3df",
  padding: "32px",
  borderRadius: "26px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  marginBottom: "45px"
}

const tituloTurno = {
  color: "#0f766e",
  marginBottom: "28px",
  fontSize: "24px",
  textAlign: "center",
  fontWeight: "bold"
}

const grillaCursos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "15px"
}

const tarjetaCurso = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
  textAlign: "center"
}

const textoCantidad = {
  color: "#666",
  fontSize: "14px"
}

const botonCurso = {
  backgroundColor: "#0f766e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
}

const detalleCurso = {
  marginTop: "35px",
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.08)"
}

const botonVolver = {
  backgroundColor: "#e9f5f5",
  color: "#1e5f5c",
  border: "1px solid #cfd8e3",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px",
  fontWeight: "bold"
}

const formularioAlumno = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "10px",
  marginBottom: "20px",
  marginTop: "20px",
  alignItems: "center"
}

const inputAlumno = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "0",
  width: "100%"
}

const botonAgregar = {
  backgroundColor: "#4cb3aa",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  gridColumn: "4 / 5"
}

const tabla = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px"
}

const celda = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  fontSize: "13px"
}
const bloquePrevias = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr auto",
  gap: "8px",
  alignItems: "center",
  gridColumn: "1 / 4"
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
  fontWeight: "bold",
  marginRight: "4px"
}
const botonAgregarPrevia = {
  backgroundColor: "#e9eef5",
  color: "#1e3a5f",
  border: "1px solid #cfd8e3",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  padding: "10px"
}
const botonImprimir = {
  backgroundColor: "#e9eef5",
  color: "#1e3a5f",
  border: "1px solid #cfd8e3",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  marginLeft: "8px",
  marginBottom: "15px"
}

const botonMover = {
  backgroundColor: "#eef5ee",
  color: "#2f6b3f",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "4px"
}

const bloqueMovimiento = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "12px",
  padding: "15px",
  marginBottom: "20px"
}
const bloqueEstadisticas = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginTop: "20px",
  marginBottom: "20px"
}

const tarjetaEstadistica = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "16px",
  padding: "18px",
  textAlign: "center",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
}
const alertaSobreedad = {
  marginLeft: "6px",
  fontSize: "13px"
}
const bloqueEdades = {
  marginTop: "20px",
  marginBottom: "15px",
  textAlign: "center"
}

const grillaEdades = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
  gap: "10px",
  marginTop: "10px"
}

const tarjetaEdad = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "14px",
  padding: "12px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
}