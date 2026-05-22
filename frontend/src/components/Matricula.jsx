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

  const [previaSeleccionada, setPreviaSeleccionada] = useState("")
  const [anioPrevia, setAnioPrevia] = useState("")
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
      console.log(error)
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

  function contarAlumnos(curso, turno) {
    return alumnosMatricula.filter(
      (alumno) =>
        alumno.curso === curso &&
        alumno.turno === turno &&
        alumno.estadoMatricula === "Activo"
    ).length
  }

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
      "Apellido y Nombre":
        `${alumno.apellido || ""}, ${alumno.nombre || ""}`,

      "DNI": alumno.dni || "",

      "Fecha nacimiento":
        alumno.fechaNacimiento || "",

      "Edad":
        calcularEdadAl30Junio(alumno.fechaNacimiento),

      "Previas":
        alumno.previas
          ?.map((p) => `${p.materia} (${p.anio})`)
          .join(", ") || "",

      "Condición":
        alumno.condicion || "",

      "Curso":
        cursoSeleccionado || "",

      "Turno":
        turnoSeleccionado || ""
    }))

    const hoja = XLSX.utils.json_to_sheet(datos)

    const libro = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      "Matrícula"
    )

    const excelBuffer =
      XLSX.write(libro, {
        bookType: "xlsx",
        type: "array"
      })

    const archivo = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    )

    saveAs(
      archivo,
      `Matricula_${cursoSeleccionado}.xlsx`
    )
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

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "#1e3a5f" }}>Gestión de Matrícula</h2>

      <p style={{ color: "#666" }}>
        Organización por turno, año y sección.
      </p>

      {!cursoSeleccionado && (
        <div style={contenedorTurnos}>
          <div style={bloqueTurno}>
            <h3 style={tituloTurno}>Turno Mañana</h3>

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
          </div>

          <div style={bloqueTurno}>
            <h3 style={tituloTurno}>Turno Tarde</h3>

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
          </div>
        </div>
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
              onClick={exportarExcel}
            >
              Exportar Excel
            </button>

            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={importarReporteOficial}
            />
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
                  <div key={index}>
                    • {previa.asignatura} (
                    {previa.anio})
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

              {alumnosDelCurso.map(
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
  backgroundColor: "#f4f6f8",
  padding: "25px",
  borderRadius: "15px"
}

const tituloTurno = {
  color: "#1e3a5f",
  marginBottom: "20px"
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