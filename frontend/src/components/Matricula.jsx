import { useEffect, useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import preceptora11 from "../assets/preceptores/preceptor_1_1.jpg"

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
  const [turnoExamen, setTurnoExamen] = useState("")
  const [busquedaAlumno, setBusquedaAlumno] = useState("")
  const [ordenCurso, setOrdenCurso] = useState("apellido")
  const fotosPreceptores = {
    "6°1°-Mañana": preceptora11,
    "5°2°-Mañana": preceptora11,
    "4°3°-Tarde": preceptora11,
    "4°4°-Tarde": preceptora11
  }
  const [anioLegajoFiltro, setAnioLegajoFiltro] = useState("")
  const [verRecursantes, setVerRecursantes] = useState(false)
  const [filtroAvanzado, setFiltroAvanzado] = useState("todos")
  const [alertaActiva, setAlertaActiva] = useState("")
  const [pedidosAnaliticos, setPedidosAnaliticos] = useState([])
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null)
  const [nuevoAlumno, setNuevoAlumno] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    legajoNumero: "",
    legajoAnio: "",
    libroMatriz: "",
    folioMatriz: "",
    fechaNacimiento: "",
    materiasPendientes: [],
    condicionFinal: ""
  })

  useEffect(() => {
    obtenerMatricula()
    obtenerPedidosAnaliticos()
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
      legajoNumero: alumno.legajoNumero || "",
      legajoAnio: alumno.legajoAnio || "",
      libroMatriz: alumno.libroMatriz || "",
      folioMatriz: alumno.folioMatriz || "",
      fechaNacimiento: alumno.fechaNacimiento || "",
      materiasPendientes: Array.isArray(alumno.materiasPendientes)
        ? alumno.materiasPendientes
        : [],
      condicionFinal: alumno.condicionFinal || ""
    })

    setTimeout(() => {
      document
        .getElementById("formulario-matricula")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
    }, 100)
  }

  function limpiarFormulario() {
    setNuevoAlumno({
      apellido: "",
      nombre: "",
      dni: "",
      legajoNumero: "",
      libroMatriz: "",
      folioMatriz: "",
      legajoAnio: "",
      fechaNacimiento: "",
      condicionFinal: "",
      materiasPendientes: []
    })

    setPreviaSeleccionada("")
    setAnioPrevia("")
    setAlumnoEditando(null)

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
    if (!previaSeleccionada) return

    if (previaSeleccionada !== "----------" && !anioPrevia) return

    const nuevaPrevia = {
      asignatura: previaSeleccionada,
      anio: previaSeleccionada === "----------" ? "" : anioPrevia
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
        legajoNumero: "",
        legajoAnio: "",
        libroMatriz: "",
        folioMatriz: "",
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
    "----------",
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
    "Art. Leng. Danza",
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
      .filter(
        (alumno) =>
          alumno.curso === cursoSeleccionado.curso &&
          alumno.turno === cursoSeleccionado.turno &&
          alumno.estadoMatricula === "Activo"
      )
      .sort((a, b) => {

        if (ordenCurso === "legajo") {

          const anioA = Number(a.legajoAnio || 0)
          const anioB = Number(b.legajoAnio || 0)

          if (anioA !== anioB) {
            return anioB - anioA
          }

          const numeroA = Number(a.legajoNumero || 0)
          const numeroB = Number(b.legajoNumero || 0)

          return numeroA - numeroB
        }

        return `${a.apellido} ${a.nombre}`.localeCompare(
          `${b.apellido} ${b.nombre}`,
          "es",
          { sensitivity: "base" }
        )
      })
    : []

  const alumnosFiltrados = alumnosDelCurso.filter((alumno) => {
    const previasReales = Array.isArray(alumno.materiasPendientes)
      ? alumno.materiasPendientes.filter(
        (previa) => previa.asignatura !== "----------"
      )
      : []

    const coincidePrevia =
      !filtroPrevia && !filtroAnioPrevia
        ? true
        : previasReales.some((previa) => {
          const coincideMateria =
            !filtroPrevia || previa.asignatura === filtroPrevia

          const coincideAnio =
            !filtroAnioPrevia || previa.anio === filtroAnioPrevia

          return coincideMateria && coincideAnio
        })

    const coincideAvanzado = (() => {
      if (filtroAvanzado === "todos") return true

      if (filtroAvanzado === "prom")
        return alumno.condicionFinal === "Prom"

      if (filtroAvanzado === "rec")
        return alumno.condicionFinal === "Rec"

      if (filtroAvanzado === "ingresante")
        return alumno.condicionFinal === "Ingresante"

      if (filtroAvanzado === "reinscripto")
        return alumno.condicionFinal === "Reinscripto"

      if (filtroAvanzado === "previas")
        return previasReales.length > 0

      if (filtroAvanzado === "sinLegajo")
        return !alumno.legajoNumero

      if (filtroAvanzado === "sobreedad")
        return calcularSobreedad(alumno)

      return true
    })()

    return coincidePrevia && coincideAvanzado
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

  const totalConPrevias = alumnosDelCurso.filter((alumno) => {
    const previasReales = Array.isArray(alumno.materiasPendientes)
      ? alumno.materiasPendientes.filter(
        (previa) => previa.asignatura !== "----------"
      )
      : []

    return previasReales.length > 0
  }).length

  const porcentajeProm =
    totalEstudiantes > 0
      ? ((totalProm / totalEstudiantes) * 100).toFixed(0)
      : 0

  const porcentajeRec =
    totalEstudiantes > 0
      ? ((totalRec / totalEstudiantes) * 100).toFixed(0)
      : 0

  const totalIngresantes = alumnosDelCurso.filter(
    alumno => alumno.condicionFinal === "Ingresante"
  ).length

  const totalReinscriptos = alumnosDelCurso.filter(
    alumno => alumno.condicionFinal === "Reinscripto"
  ).length

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

  const alumnosEncontrados = alumnosMatricula.filter((alumno) => {
    const texto = busquedaAlumno.toLowerCase()

    return (
      alumno.apellido?.toLowerCase().includes(texto) ||
      alumno.nombre?.toLowerCase().includes(texto) ||
      alumno.dni?.includes(texto)
    )
  })

  function imprimirCurso() {
    if (!cursoSeleccionado) return

    const mostrarLegajo = alumnosFiltrados.some(
      (alumno) => alumno.legajoNumero || alumno.legajoAnio
    )

    const mostrarFechaNacimiento = alumnosFiltrados.some(
      (alumno) => alumno.fechaNacimiento
    )

    const mostrarEdad = mostrarFechaNacimiento

    const mostrarCondicion = alumnosFiltrados.some(
      (alumno) => alumno.condicionFinal
    )

    const mostrarPendientes = alumnosFiltrados.some(
      (alumno) =>
        Array.isArray(alumno.materiasPendientes) &&
        alumno.materiasPendientes.length > 0
    )

    const filas = alumnosFiltrados
      .map(
        (alumno, index) => `
        <tr>
          <td>${index + 1}</td>
          <td class="nombre">${alumno.apellido || ""}, ${alumno.nombre || ""}</td>
          <td>${formatearDNI(alumno.dni)}</td>

          ${mostrarLegajo
            ? `<td>${alumno.legajoNumero && alumno.legajoAnio
              ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
              : ""
            }</td>`
            : ""
          }

          ${mostrarFechaNacimiento
            ? `<td>${alumno.fechaNacimiento ? formatearFecha(alumno.fechaNacimiento) : ""}</td>`
            : ""
          }

          ${mostrarEdad
            ? `<td>${alumno.fechaNacimiento
              ? calcularEdadAl30Junio(alumno.fechaNacimiento)
              : ""
            }</td>`
            : ""
          }

          ${mostrarCondicion
            ? `<td>${alumno.condicionFinal || ""}</td>`
            : ""
          }

          ${mostrarPendientes
            ? `<td>${Array.isArray(alumno.materiasPendientes)
              ? alumno.materiasPendientes
                .map((previa) => `${previa.asignatura} (${previa.anio})`)
                .join(", ")
              : ""
            }</td>`
            : ""
          }
        </tr>
      `
      )
      .join("")

    const ventana = window.open("", "_blank")

    ventana.document.write(`
    <html>
      <head>
        <title>Lista de matrícula por curso</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 28px;
            color: #222;
          }

          h2, h3, p {
            text-align: center;
            margin: 4px 0;
          }

          h2 {
            color: #1e3a5f;
            font-size: 20px;
          }

          h3 {
            font-size: 16px;
            margin-top: 18px;
          }

          .subtitulo {
            font-size: 12px;
            color: #555;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            font-size: 11px;
          }

          th, td {
            border: 1px solid #333;
            padding: 5px;
            text-align: center;
          }

          th {
            background-color: #1e3a5f;
            color: white;
          }

          .nombre {
            text-align: left;
          }

          @page {
            size: landscape;
            margin: 12mm;
          }
        </style>
      </head>

      <body>
        <h2>Escuela Educación Secundaria N°140</h2>
        <p class="subtitulo">"Florencio Molina Campos"</p>

        <h3>
          Lista de matrícula - Curso ${cursoSeleccionado.curso}
          - Turno ${cursoSeleccionado.turno}
        </h3>

        <p>Cantidad de estudiantes: ${alumnosFiltrados.length}</p>

        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Apellido y Nombre</th>
              <th>DNI</th>
              ${mostrarLegajo ? "<th>Legajo</th>" : ""}
              ${mostrarFechaNacimiento ? "<th>Fecha nac.</th>" : ""}
              ${mostrarEdad ? "<th>Edad</th>" : ""}
              ${mostrarCondicion ? "<th>Cond.</th>" : ""}
              ${mostrarPendientes ? "<th>Pendientes</th>" : ""}
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


  function formatearDNI(dni) {
    if (!dni) return ""

    return dni
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  function limpiarDNI(dni) {
    if (!dni) return ""

    return dni.toString().replace(/\D/g, "")
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

  async function obtenerPedidosAnaliticos() {
    try {
      const respuesta = await axios.get("/alumnos")
      console.log("PEDIDOS ANALITICOS")
      console.log(respuesta.data)

      setPedidosAnaliticos(
        Array.isArray(respuesta.data) ? respuesta.data : []
      )
    } catch (error) {
      console.log(error)
    }
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

  const edadesDelCurso = alumnosDelCurso.reduce((contador, alumno) => {
    const edad = calcularEdadAl30Junio(alumno.fechaNacimiento)

    if (edad === "-") return contador

    contador[edad] = (contador[edad] || 0) + 1

    return contador
  }, {})

  function imprimirPlanillaPrevias() {
    const contenido = document.getElementById("planilla-previas-imprimir")

    if (!contenido) return

    const ventana = window.open("", "_blank")

    ventana.document.write(`
    <html>
      <head>
        <title>Planilla de examen por previas</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          h2, h3, p {
            text-align: center;
          }

          h2 {
            color: #1e3a5f;
            margin-bottom: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }

          th, td {
            border: 1px solid #333;
            padding: 6px;
            text-align: center;
          }

          th {
            background-color: #1e3a5f;
            color: white;
          }

          .firmas {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
          }

          .firma {
            width: 40%;
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 8px;
          }
        </style>
      </head>

      <body>
        ${contenido.innerHTML}

        <div class="firmas">
          <div class="firma">Firma docente</div>
          <div class="firma">Firma autoridad</div>
        </div>
      </body>
    </html>
  `)

    ventana.document.close()
    ventana.print()
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
    setTurnoExamen("")
  }

  const alumnosParaExamen = alumnosMatricula.filter((alumno) => {
    const coincideTurno =
      !turnoExamen ||
      alumno.turno === turnoExamen

    return (
      coincideTurno &&
      alumno.materiasPendientes?.some((previa) => {
        if (previa.asignatura === "----------") return false
        const coincideMateria =
          !materiaExamen ||
          previa.asignatura === materiaExamen

        const coincideAnio =
          !anioExamen ||
          previa.anio === anioExamen

        return coincideMateria && coincideAnio
      })
    )
  })

  const aniosLegajoDisponibles = [
    ...new Set(
      alumnosMatricula
        .map((alumno) => alumno.legajoAnio)
        .filter(Boolean)
    )
  ].sort((a, b) => Number(b) - Number(a))

  const alumnosPorLegajo = alumnosMatricula
    .filter((alumno) =>
      anioLegajoFiltro
        ? alumno.legajoAnio === anioLegajoFiltro
        : false
    )
    .sort((a, b) =>
      Number(a.legajoNumero || 0) -
      Number(b.legajoNumero || 0)
    )
  const alumnosRecursantes = alumnosMatricula
    .filter((alumno) => alumno.condicionFinal === "Rec")
    .sort((a, b) => {
      const cursoA = a.curso || ""
      const cursoB = b.curso || ""

      if (cursoA !== cursoB) {
        return cursoA.localeCompare(cursoB, "es")
      }

      return `${a.apellido} ${a.nombre}`.localeCompare(
        `${b.apellido} ${b.nombre}`,
        "es",
        { sensitivity: "base" }
      )
    })

  const alumnosSinLegajo = alumnosMatricula.filter(
    (alumno) => !alumno.legajoNumero || !alumno.legajoAnio
  )

  const alumnosSinFechaNacimiento = alumnosMatricula.filter(
    (alumno) => !alumno.fechaNacimiento
  )

  const alumnosConPrevias = alumnosMatricula.filter((alumno) => {
    const previasReales =
      alumno.materiasPendientes?.filter(
        (previa) => previa.asignatura !== "----------"
      ) || []

    return previasReales.length > 0
  })

  const alumnosConSobreedad = alumnosMatricula.filter(
    (alumno) => tieneSobreedad(alumno)
  )

  const alumnosAlertaActiva =
    alertaActiva === "sinLegajo"
      ? alumnosSinLegajo
      : alertaActiva === "sinFecha"
        ? alumnosSinFechaNacimiento
        : alertaActiva === "previas"
          ? alumnosConPrevias
          : alertaActiva === "sobreedad"
            ? alumnosConSobreedad
            : []

  const pedidosAnaliticosEncontrados = pedidosAnaliticos.filter((pedido) => {
    const texto = normalizarTexto(busquedaAlumno) || ""
    const dniBuscado = limpiarDNI(busquedaAlumno)

    const nombrePedido = normalizarTexto(pedido.nombre) || ""
    const dniPedido = limpiarDNI(pedido.dni)

    const coincideNombre =
      texto.length > 2 && nombrePedido.includes(texto)

    const coincideDni =
      dniBuscado.length > 2 && dniPedido.includes(dniBuscado)

    return coincideNombre || coincideDni
  })

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

          <div style={panelAlertas}>
            <h3 style={{ color: "#1e3a5f", textAlign: "center" }}>
              🚨 Alertas institucionales
            </h3>

            <div style={grillaAlertas}>
              <div style={tarjetaAlerta} onClick={() => setAlertaActiva("sinLegajo")}>
                <strong>Sin legajo</strong>
                <p>{alumnosSinLegajo.length}</p>
              </div>

              <div style={tarjetaAlerta} onClick={() => setAlertaActiva("sinFecha")}>
                <strong>Sin fecha nacimiento</strong>
                <p>{alumnosSinFechaNacimiento.length}</p>
              </div>

              <div style={tarjetaAlerta} onClick={() => setAlertaActiva("previas")}>
                <strong>Con previas</strong>
                <p>{alumnosConPrevias.length}</p>
              </div>

              <div style={tarjetaAlerta} onClick={() => setAlertaActiva("sobreedad")}>
                <strong>Sobreedad</strong>
                <p>{alumnosConSobreedad.length}</p>
              </div>
            </div>
          </div>

          {alertaActiva && (
            <div style={detalleCurso}>
              <h3 style={{ color: "#1e3a5f" }}>
                🚨 Listado de alerta
              </h3>

              <button style={botonVolver} onClick={() => setAlertaActiva("")}>
                Cerrar alerta
              </button>

              <p>Cantidad: {alumnosAlertaActiva.length}</p>

              <table style={tabla}>
                <thead>
                  <tr>
                    <th style={celda}>Apellido y Nombre</th>
                    <th style={celda}>DNI</th>
                    <th style={celda}>Curso</th>
                    <th style={celda}>Turno</th>
                    <th style={celda}>Legajo</th>
                    <th style={celda}>Detalle de alerta</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosAlertaActiva.map((alumno) => (
                    <tr key={alumno._id}>
                      <td style={celda}>
                        {alumno.apellido}, {alumno.nombre}
                      </td>
                      <td style={celda}>{formatearDNI(alumno.dni)}</td>
                      <td style={celda}>{alumno.curso}</td>
                      <td style={celda}>{alumno.turno}</td>
                      <td style={celda}>
                        {alumno.legajoNumero && alumno.legajoAnio
                          ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                          : "-"}
                      </td>
                      <td style={celda}>
                        {alertaActiva === "sinLegajo" && "Falta número o año de legajo"}

                        {alertaActiva === "sinFecha" && "Falta fecha de nacimiento"}

                        {alertaActiva === "previas" &&
                          alumno.materiasPendientes
                            ?.map((previa) => `${previa.asignatura} (${previa.anio})`)
                            .join(", ")}

                        {alertaActiva === "sobreedad" &&
                          `${calcularEdadAl30Junio(alumno.fechaNacimiento)} años`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={bloqueBusquedaGeneral}>
            <h3
  style={{
    color: "#1e3a5f",
    marginBottom: "10px",
    marginTop: "0px"
  }}
>
  🔎 Buscar estudiante
</h3>

            <input
              type="text"
              placeholder="Apellido, nombre o DNI"
              style={bloqueBusquedaGeneral}
              value={busquedaAlumno}
              onChange={(e) => setBusquedaAlumno(e.target.value)}
            />

            {busquedaAlumno && (
              <div style={listaResultadosBusqueda}>

                {alumnosEncontrados.map((alumno) => {
                  const pedidoAnalitico = pedidosAnaliticos.find((pedido) =>
                    limpiarDNI(pedido.dni) === limpiarDNI(alumno.dni)
                  )

                  return (
                    <div key={alumno._id} style={itemResultadoBusqueda}>
                      <div>
                        <strong>
                          {alumno.apellido}, {alumno.nombre}
                        </strong>

                        <p style={{ margin: 0 }}>
                          {alumno.curso} • Turno {alumno.turno}
                        </p>

                        {pedidoAnalitico && (
                          <div style={alertaAnalitico}>
                            📄 Pedido de analítico encontrado
                            <br />
                            Estado: {pedidoAnalitico.estado || "-"}
                            <br />
                            Libro: {pedidoAnalitico.libro || "-"} | Folio: {pedidoAnalitico.folio || "-"} | Carpeta: {pedidoAnalitico.carpeta || "-"}
                          </div>
                        )}
                      </div>

                      <button
                        style={botonEditar}
                        onClick={() => {
                          setCursoSeleccionado({
                            curso: alumno.curso,
                            turno: alumno.turno
                          })
                          editarAlumno(alumno)
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        style={botonMover}
                        onClick={() => {
                          setAlumnoSeleccionado(alumno)

                          setTimeout(() => {
                            document
                              .getElementById("ficha-estudiante")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                              })
                          }, 100)
                        }}
                      >
                        📖
                      </button>
                    </div>
                  )
                })}

                {pedidosAnaliticosEncontrados.map((pedido) => (
                  <div key={pedido._id} style={alertaAnalitico}>
                    📄 Estudiante con pedido de analítico cargado
                    <br />
                    <strong>{pedido.nombre}</strong>
                    <br />
                    DNI: {formatearDNI(pedido.dni)}
                    <br />
                    Estado: {pedido.estado || "-"}
                    <br />
                    Libro: {pedido.libro || "-"} | Folio: {pedido.folio || "-"} | Carpeta: {pedido.carpeta || "-"}
                  </div>
                ))}

                {alumnosEncontrados.length === 0 &&
                  pedidosAnaliticosEncontrados.length === 0 && (
                    <p>No se encontraron estudiantes.</p>
                  )}

              </div>
            )}
          </div>

          {alumnoSeleccionado && (
            <div id="ficha-estudiante" style={detalleCurso}>

              <div style={tituloFicha}>
                <h2 style={{ margin: 0 }}>
                  📖 Ficha del estudiante
                </h2>
              </div>



              <div style={grillaFicha}>

                <div style={campoFicha}>
                  <strong>Apellido y nombre</strong>
                  <br />
                  <span style={nombreFicha}>
                    {alumnoSeleccionado.apellido || ""} {alumnoSeleccionado.nombre || ""}
                  </span>
                </div>

                <div style={campoFicha}>
                  <strong>DNI</strong>
                  <p>{formatearDNI(alumnoSeleccionado.dni)}</p>
                </div>

                <div style={campoFicha}>
                  <strong>Curso</strong>
                  <p>{alumnoSeleccionado.curso}</p>
                </div>

                <div style={campoFicha}>
                  <strong>Turno</strong>
                  <p>{alumnoSeleccionado.turno}</p>
                </div>

                <div style={campoFicha}>
                  <strong>Legajo</strong>
                  <p>
                    {alumnoSeleccionado.legajoNumero &&
                      alumnoSeleccionado.legajoAnio
                      ? `${alumnoSeleccionado.legajoNumero}/${alumnoSeleccionado.legajoAnio}`
                      : "Sin cargar"}
                  </p>
                </div>

                <div style={campoFicha}>
                  <strong>Libro/Folio</strong>
                  <p>
                    {alumnoSeleccionado.libroMatriz || alumnoSeleccionado.folioMatriz
                    ? `${alumnoSeleccionado.libroMatriz || "-"} / ${alumnoSeleccionado.folioMatriz || "-"}`
                    : "Sin cargar"}
                  </p>
                </div>

                <div style={campoFicha}>
                  <strong>Edad</strong>
                  <p>
                    {alumnoSeleccionado.fechaNacimiento
                      ? calcularEdadAl30Junio(
                        alumnoSeleccionado.fechaNacimiento
                      ) + " años"
                      : "Sin cargar"}
                  </p>
                </div>

                <div style={campoFicha}>
                  <strong>Condición final</strong>
                  <p>{alumnoSeleccionado.condicionFinal || "-"}</p>
                </div>

                <div style={campoFicha}>
                  <strong>Previas</strong>
                  <p>
                    {(() => {
                      const previasReales =
                        alumnoSeleccionado.materiasPendientes?.filter(
                          (previa) => previa.asignatura !== "----------"
                        ) || []

                      return previasReales.length > 0
                        ? previasReales
                          .map(
                            (previa) =>
                              `${previa.asignatura} (${previa.anio})`
                          )
                          .join(", ")
                        : "Ninguna"
                    })()}
                  </p>
                </div>

              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
               <button
                 style={botonCerrarFicha}
                 onClick={() => setAlumnoSeleccionado(null)}
            >
                 Cerrar ficha
              </button>
  
 
  
              </div>

            </div>
          )}

          <h3 style={tituloFicha}>
              🛠 Herramientas de gestión
          </h3>
          <div style={panelHerramientas}>
            <div style={bloqueHerramienta}>
              <button
                style={botonImprimir}
                onClick={() => {
                  setVerPlanillaPrevias(!verPlanillaPrevias)
                  setMateriaExamen("")
                  setAnioExamen("")
                  setTurnoExamen("")
                }}
              >
                📋 Planilla de examen
              </button>
            </div>

            <div style={bloqueHerramienta}>
              <h3 style={{ color: "#1e3a5f" }}>
                🧾 Legajos por año
              </h3>

              <select
                style={inputAlumno}
                value={anioLegajoFiltro}
                onChange={(e) => setAnioLegajoFiltro(e.target.value)}
              >
                <option value="">Seleccionar año de legajo</option>

                {aniosLegajoDisponibles.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>

            <div style={bloqueHerramienta}>
              <button
                style={botonImprimir}
                onClick={() => setVerRecursantes(!verRecursantes)}
              >
                🔁 {verRecursantes ? "Ocultar recursantes" : "Ver recursantes"}
              </button>
            </div>
          </div>

          {verPlanillaPrevias && (
            <div style={detalleCurso}>
              <h3 style={{ color: "#1e3a5f" }}>
                📋 Planilla de examen por previas
              </h3>

              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
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

                <select
                  style={inputAlumno}
                  value={turnoExamen}
                  onChange={(e) => setTurnoExamen(e.target.value)}
                >
                  <option value="">Todos los turnos</option>
                  <option value="Mañana">Turno Mañana</option>
                  <option value="Tarde">Turno Tarde</option>
                </select>
              </div>

              <div id="planilla-previas-imprimir">
                <h3 style={{ color: "#1e3a5f" }}>
                  📋 Planilla de examen por previas
                </h3>

                <p>Cantidad de estudiantes: {alumnosParaExamen.length}</p>

                {alumnosParaExamen.length === 0 && (
                  <p style={mensajeNoEncontrado}>
                    No hay estudiantes para esa materia, año y turno.
                  </p>
                )}

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
                          if (previa.asignatura === "----------") return false
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

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  marginTop: "10px"
                }}
              >
                <button style={botonImprimir} onClick={imprimirPlanillaPrevias}>
                  🖨️ Imprimir planilla
                </button>

                <button style={botonVolver} onClick={cerrarPlanillaPrevias}>
                  Cerrar planilla
                </button>
              </div>
            </div>
          )}

          {anioLegajoFiltro && (
            <div style={detalleCurso}>
              <h3 style={{ color: "#1e3a5f" }}>
                🧾 Listado de legajos {anioLegajoFiltro}
              </h3>

              <p>
                Cantidad de legajos {anioLegajoFiltro}: {alumnosPorLegajo.length}
              </p>

              <table style={tabla}>
                <thead>
                  <tr>
                    <th style={celda}>Legajo</th>
                    <th style={celda}>Apellido y Nombre</th>
                    <th style={celda}>DNI</th>
                    <th style={celda}>Curso</th>
                    <th style={celda}>Turno</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosPorLegajo.map((alumno) => (
                    <tr key={alumno._id}>
                      <td style={celda}>
                        {alumno.legajoNumero && alumno.legajoAnio
                          ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                          : "-"}
                      </td>

                      <td style={celda}>
                        {alumno.apellido}, {alumno.nombre}
                      </td>
                      <td style={celda}>{formatearDNI(alumno.dni)}</td>
                      <td style={celda}>{alumno.curso}</td>
                      <td style={celda}>{alumno.turno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {verRecursantes && (
            <div style={detalleCurso}>
              <h3 style={{ color: "#1e3a5f" }}>
                🔁 Estudiantes recursantes
              </h3>

              <p>Total de recursantes: {alumnosRecursantes.length}</p>

              <table style={tabla}>
                <thead>
                  <tr>
                    <th style={celda}>Apellido y Nombre</th>
                    <th style={celda}>DNI</th>
                    <th style={celda}>Curso</th>
                    <th style={celda}>Turno</th>
                    <th style={celda}>Legajo</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosRecursantes.map((alumno) => (
                    <tr key={alumno._id}>
                      <td style={celda}>
                        {alumno.apellido}, {alumno.nombre}
                      </td>
                      <td style={celda}>{formatearDNI(alumno.dni)}</td>
                      <td style={celda}>{alumno.curso}</td>
                      <td style={celda}>{alumno.turno}</td>
                      <td style={celda}>
                        {alumno.legajoNumero && alumno.legajoAnio
                          ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
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
                    <div
                      key={curso}
                      style={{
                        ...tarjetaCurso,
                        backgroundImage: fotosPreceptores[`${curso}-Mañana`]
                          ? `linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.50)), url(${fotosPreceptores[`${curso}-Mañana`]})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
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
                    <div
                      key={curso}
                      style={{
                        ...tarjetaCurso,
                        backgroundImage: fotosPreceptores[`${curso}-Tarde`]
                          ? `linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.50)), url(${fotosPreceptores[`${curso}-Tarde`]})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
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
        <div style={detalleCurso} className="area-impresion">
          <div className="no-print">
            <button style={botonVolver} onClick={() => setCursoSeleccionado(null)}>
              Volver a todos los cursos
            </button>

            <button style={botonImprimir} onClick={imprimirCurso}>
              🖨️ Imprimir curso
            </button>

            <button
              style={botonImprimir}
              onClick={() => setVerEstadisticasCurso(!verEstadisticasCurso)}
            >
              📊 Estadísticas
            </button>

            <button style={botonImprimir} onClick={exportarExcel}>
              Exportar Excel
            </button>

            <label
              style={{
                ...botonImprimir,
                padding: "6px 8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                fontSize: "12px",
                lineHeight: "1.6"
              }}
            >
              📂 Cargar Excel

              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={importarReporteOficial}
                style={{ display: "none" }}
              />
            </label>
          </div>



          <div id="curso-imprimir">
            <h3 style={{ color: "#1e3a5f" }}>
              Curso: {cursoSeleccionado.curso} - Turno {cursoSeleccionado.turno}
            </h3>

            <p>Cantidad de estudiantes: {alumnosDelCurso.length}</p>

            {verEstadisticasCurso && (
              <>
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
                    <h3>Ingresantes</h3>
                    <p>{totalIngresantes}</p>
                  </div>

                  <div style={tarjetaEstadistica}>
                    <h3>Reinscriptos</h3>
                    <p>{totalReinscriptos}</p>
                  </div>

                  <div style={tarjetaEstadistica}>
                    <h3>Con previas</h3>
                    <p>{totalConPrevias}</p>
                  </div>
                </div>

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
              </>
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
          </div>



          <div
            id="formulario-matricula"
            style={formularioAlumno}
            className="no-print"
          >
            <input
              placeholder="Apellido"
              style={inputAlumno}
              value={nuevoAlumno.apellido}
              onChange={(e) =>
                setNuevoAlumno({ ...nuevoAlumno, apellido: e.target.value })
              }
            />

            <input
              placeholder="Nombre"
              style={inputAlumno}
              value={nuevoAlumno.nombre}
              onChange={(e) =>
                setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })
              }
            />

            <input
              placeholder="DNI"
              style={inputAlumno}
              value={nuevoAlumno.dni}
              onChange={(e) =>
                setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })
              }
            />

            <input
              placeholder="N° legajo"
              style={inputAlumno}
              value={nuevoAlumno.legajoNumero}
              onChange={(e) =>
                setNuevoAlumno({ ...nuevoAlumno, legajoNumero: e.target.value })
              }
            />

            <input
              placeholder="Año legajo"
              style={inputAlumno}
              value={nuevoAlumno.legajoAnio}
              onChange={(e) =>
                setNuevoAlumno({ ...nuevoAlumno, legajoAnio: e.target.value })
              }
            />
            <input
              placeholder="Libro matriz"
              style={inputAlumno}
              value={nuevoAlumno.libroMatriz}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  libroMatriz: e.target.value
                })
              }
            />

            <input
              placeholder="Folio matriz"
              style={inputAlumno}
              value={nuevoAlumno.folioMatriz}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  folioMatriz: e.target.value
                })
              }
            />

            <input
              type="date"
              style={inputAlumno}
              value={nuevoAlumno.fechaNacimiento}
              onChange={(e) =>
                setNuevoAlumno({ ...nuevoAlumno, fechaNacimiento: e.target.value })
              }
            />

            <div style={bloquePrevias}>
              <select
                style={inputAlumno}
                value={previaSeleccionada}
                onChange={(e) => setPreviaSeleccionada(e.target.value)}
              >
                <option value="">Asignatura</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura} value={asignatura}>
                    {asignatura}
                  </option>
                ))}
              </select>

              <select
                style={inputAlumno}
                value={anioPrevia}
                onChange={(e) => setAnioPrevia(e.target.value)}
              >
                <option value="">Año</option>
                {aniosMateria.map((anio) => (
                  <option key={anio} value={anio}>
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
              {nuevoAlumno.materiasPendientes.map((previa, index) => (
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
              ))}
            </div>

            <select
              value={nuevoAlumno.condicionFinal}
              onChange={(e) =>
                setNuevoAlumno({
                  ...nuevoAlumno,
                  condicionFinal: e.target.value
                })
              }
            >
              <option value="">Seleccionar condición</option>

              <option value="Ingresante">
                Ingresante al nivel
              </option>

              <option value="Reinscripto">
                Reinscripto
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
              onClick={guardarAlumnoMatricula}
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : alumnoEditando
                  ? "Guardar cambios"
                  : "Agregar estudiante"}
            </button>

            <button style={botonVolver} onClick={limpiarFormulario}>
              Limpiar formulario
            </button>
          </div>

          {alumnoMoviendo && (
            <div id="movimiento-matricula" style={bloqueMovimiento}>
              <h4>🔁 Movimiento de matrícula</h4>

              <p>
                {alumnoMoviendo.apellido}, {alumnoMoviendo.nombre}
              </p>

              <select
                value={nuevoCurso}
                onChange={(e) => setNuevoCurso(e.target.value)}
                style={inputAlumno}
              >
                {[...cursosManana, ...cursosTarde].map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>

              <select
                value={nuevoTurno}
                onChange={(e) => setNuevoTurno(e.target.value)}
                style={inputAlumno}
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>

              <button style={botonAgregarPrevia} onClick={moverAlumno}>
                Mover estudiante
              </button>
              <button
                style={botonVolver}
                onClick={() => setAlumnoMoviendo(null)}
              >
                Cancelar movimiento
              </button>
            </div>
          )}

          <div
            className="no-print"
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px"
            }}
          >
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

          <select
            style={inputAlumno}
            value={ordenCurso}
            onChange={(e) => setOrdenCurso(e.target.value)}
          >
            <option value="apellido">Ordenar por apellido</option>
            <option value="legajo">Ordenar por legajo</option>
          </select>

          <p
            style={{
              marginTop: "12px",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#1e3a5f",
              textAlign: "center"
            }}
          >
            Filtro avanzado
          </p>

          <select
            value={filtroAvanzado}
            onChange={(e) => setFiltroAvanzado(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "12px",
              marginBottom: "12px",
              width: "220px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <option value="todos">Todos</option>
            <option value="prom">Sólo Prom</option>
            <option value="rec">Sólo Rec</option>
            <option value="previas">Con previas</option>
            <option value="sinLegajo">Sin legajo</option>
            <option value="sobreedad">Sobreedad</option>
            <option value="ingresante">
              Ingresantes
            </option>

            <option value="reinscripto">
              Reinscriptos
            </option>
          </select>

          <table style={tabla}>
            <thead>
              <tr>
                <th style={{ ...celda, width: "220px" }}>
                  Apellido y Nombre
                </th>
                <th style={celda}>DNI</th>
                <th style={celda}>Legajo</th>
                <th style={celda}>Libro/Folio</th>
                <th style={{ ...celda, width: "95px" }}>
                  Fecha nacimiento
                </th>
                <th style={{ ...celda, width: "55px" }}>Edad</th>
                <th style={{ ...celda, width: "240px" }}>
                  Pendientes
                </th>
                <th style={{ ...celda, width: "65px" }}>Cond.</th>
                <th style={{ ...celda, width: "140px" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {alumnosDelCurso.length === 0 && (
                <tr>
                  <td style={celda} colSpan="9">
                    Todavía no hay estudiantes cargados en este curso.
                  </td>
                </tr>
              )}

              {alumnosFiltrados.map((alumno) => (
                <tr key={alumno._id}>
                  <td style={celda}>
                    {alumno.apellido}, {alumno.nombre}
                  </td>

                  <td style={celda}>{formatearDNI(alumno.dni)}</td>

                  <td style={celda}>
                    {alumno.legajoNumero && alumno.legajoAnio
                      ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                      : "-"}
                  </td>

                  <td style={celda}>
                    {alumno.libroMatriz && alumno.folioMatriz
                      ? `${alumno.libroMatriz}/${alumno.folioMatriz}`
                      : "-"}
                  </td>

                  <td style={celda}>
                    {formatearFecha(alumno.fechaNacimiento)}
                  </td>

                  <td style={celda}>
                    {calcularEdadAl30Junio(alumno.fechaNacimiento)}
                    {tieneSobreedad(alumno) && (
                      <span style={alertaSobreedad}>⚠️</span>
                    )}
                  </td>

                  <td style={celda}>
                    {Array.isArray(alumno.materiasPendientes)
                      ? alumno.materiasPendientes
                        .map(
                          (previa) =>
                            previa.asignatura === "----------"
                              ? "----------"
                              : `${previa.asignatura} (${previa.anio})`
                        )
                        .join(", ")
                      : ""}
                  </td>

                  <td style={celda}>{alumno.condicionFinal}</td>

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
                      onClick={() => {
                        prepararMovimiento(alumno)

                        setTimeout(() => {
                          document
                            .getElementById("movimiento-matricula")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start"
                            })
                        }, 100)
                      }} 
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
              ))}
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
  padding: "18px 24px",
  borderRadius: "26px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  marginBottom: "22px"
}

const tituloTurno = {
  color: "#0f766e",
  marginBottom: "10px",
  fontSize: "21px",
  textAlign: "center",
  fontWeight: "bold"
}

const grillaCursos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px"
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
  cursor: "pointer",
  transition: "0.2s"
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "22px",
  marginTop: "22px",
  alignItems: "center"
}
const inputAlumno = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "0",
  width: "92%"
}

const botonAgregar = {
  backgroundColor: "#4cb3aa",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  gridColumn: "auto"
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "8px",
  alignItems: "center",
  gridColumn: "1 / -1"
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
const mensajeNoEncontrado = {
  backgroundColor: "#fff3cd",
  padding: "12px",
  borderRadius: "10px",
  color: "#856404",
  marginBottom: "15px",
  textAlign: "center"
}
const bloqueBusquedaGeneral = {
  backgroundColor: "#f8fafc",
  border: "2px solid #cfe3e8",
  borderRadius: "14px",
  padding: "4px",
  marginBottom: "20px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
}

const inputBusquedaPrincipal = {
  width: "90%",
  maxWidth: "500px",
  padding: "10px",
  border: "2px solid #bfd4dc",
  borderRadius: "10px",
  fontSize: "15px"
}

const listaResultadosBusqueda = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
}

const itemResultadoBusqueda = {
  backgroundColor: "white",
  border: "1px solid #dbe4ee",
  borderRadius: "12px",
  padding: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}
const bloqueLegajos = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "18px",
  padding: "20px",
  marginBottom: "25px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
}


const panelHerramientas = {
  backgroundColor: "#ffffff",
  border: "2px solid #c7dde3",
  borderRadius: "18px",
  padding: "14px",
  marginTop: "20px",
  marginBottom: "20px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
}

const bloqueHerramienta = {
  backgroundColor: "#f8fbff",
  border: "1px solid #dbeafe",
  borderRadius: "14px",
  padding: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  textAlign: "center"
}

const panelAlertas = { 
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "20px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
}

const grillaAlertas = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px"
}

const tarjetaAlerta = {
  backgroundColor: "white",
  border: "1px solid #fed7aa",
  borderRadius: "14px",
  padding: "12px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  cursor: "pointer",
  transition: "0.2s",
  transform: "scale(1)"
}
const grillaFicha = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginTop: "20px",
  backgroundColor: "#ffffff",
  border: "2px solid #c7dde3",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
}

const campoFicha = {
  backgroundColor: "#f8fbff",
  border: "1px solid #dbeafe", 
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
}
const tituloFicha = {
  backgroundColor: "#eaf6f8",
  borderLeft: "5px solid #167a7f",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "20px",
  textAlign: "center",
  color: "#1e3a5f"
}
const alertaAnalitico = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fdba74",
  color: "#9a3412",
  padding: "8px",
  borderRadius: "10px",
  fontWeight: "bold",
  marginTop: "8px",
  fontSize: "13px"
}
const botonCerrarFicha = {
  backgroundColor: "#e9f5f5",
  color: "#1e5f5c",
  border: "1px solid #cfd8e3",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer", 
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
} 
const nombreFicha = {
  display: "inline-block",
  marginTop: "6px",
  fontSize: "16px",
  color: "#1e3a5f",
  fontWeight: "bold"
} 