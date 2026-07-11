import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import preceptora11 from "../assets/preceptores/preceptor_1_1.jpg";
import {
  cursosManana,
  cursosTarde,
  asignaturas,
  aniosMateria,
  materiasPorAnio,
} from "./matricula/matriculaConstants";
import BuscadorGeneralMatricula from "./matricula/BuscadorGeneralMatricula";
import TurnosCursosMatricula from "./matricula/TurnosCursosMatricula";
import FichaEstudianteMatricula from "./matricula/FichaEstudianteMatricula";
import BotonesHerramientasMatricula from "./matricula/BotonesHerramientasMatricula";
import RelevamientoInspeccionMatricula from "./matricula/RelevamientoInspeccionMatricula";
import FiltrosLegajoMatrizMatricula from "./matricula/FiltrosLegajoMatrizMatricula";
import ArchivoLegajoMatrizMatricula from "./matricula/ArchivoLegajoMatrizMatricula";
import PlanillaPreviasMatricula from "./matricula/PlanillaPreviasMatricula";
import ListadoLegajosMatricula from "./matricula/ListadoLegajosMatricula";
import RecursantesMatricula from "./matricula/RecursantesMatricula";
import AccionesCursoMatricula from "./matricula/AccionesCursoMatricula";
import EstadisticasCursoMatricula from "./matricula/EstadisticasCursoMatricula";
import FormularioAlumnoMatricula from "./matricula/FormularioAlumnoMatricula";
import MovimientoMatricula from "./matricula/MovimientoMatricula";
import SeguimientoPedagogico from "./matricula/SeguimientoPedagogico/SeguimientoPedagogico";
import {
  calcularEdadAl30Junio,
  formatearFecha,
  formatearDNI,
  limpiarDNI,
  normalizarTexto,
  obtenerPreviasValidas,
  contarPrevias,
  tieneSobreedad,
} from "./matricula/matriculaUtils";
import { imprimirCurso } from "./matricula/impresiones/imprimirCurso";
import { imprimirPlanillaPrevias } from "./matricula/impresiones/imprimirPrevias";
import { imprimirRecursantes } from "./matricula/impresiones/imprimirRecursantes";
import { imprimirDocumentacion } from "./matricula/impresiones/imprimirDocumentacion";
import { obtenerEstadisticasCurso } from "./matricula/estadisticas/obtenerEstadisticasCurso";
import { obtenerAlertas } from "./matricula/estadisticas/obtenerAlertas";
import { obtenerEdadesCurso } from "./matricula/estadisticas/obtenerEdadesCurso";
import { obtenerEstadisticasDocumentacion } from "./matricula/estadisticas/obtenerEstadisticasDocumentacion";
import DocumentacionMatricula from "./matricula/DocumentacionMatricula";
import { obtenerEstadisticasGenerales } from "./matricula/estadisticas/obtenerEstadisticasGenerales";
import { obtenerRelevamientoInspeccion } from "./matricula/estadisticas/obtenerRelevamientoInspeccion";
import {
  obtenerLegajosFaltantes,
  obtenerFoliosFaltantes,
} from "./matricula/legajos/legajoMatrizUtils";
import AlertasInstitucionalesMatricula from "./matricula/AlertasInstitucionalesMatricula";
import EstadisticasGeneralesMatricula from "./matricula/EstadisticasGeneralesMatricula";
import EdadesCursoMatricula from "./matricula/EdadesCursoMatricula";

export default function Matricula({ modoDocumentacion = false, volverInicio }) {
  const rolUsuario = localStorage.getItem("rolUsuario") || "consulta";
  const esAdmin = rolUsuario === "admin";
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosMatricula, setAlumnosMatricula] = useState([]);
  const [alumnoEditando, setAlumnoEditando] = useState(null);
  const [alumnoMoviendo, setAlumnoMoviendo] = useState(null);
  const [nuevoCurso, setNuevoCurso] = useState("");
  const [nuevoTurno, setNuevoTurno] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [verEstadisticasGeneral, setVerEstadisticasGeneral] = useState(true);
  const [verEstadisticasCurso, setVerEstadisticasCurso] = useState(false);
  const [mostrarTurnoManana, setMostrarTurnoManana] = useState(false);
  const [mostrarTurnoTarde, setMostrarTurnoTarde] = useState(false);
  const [filtroPrevia, setFiltroPrevia] = useState("");
  const [filtroAnioPrevia, setFiltroAnioPrevia] = useState("");
  const [previaSeleccionada, setPreviaSeleccionada] = useState("");
  const [anioPrevia, setAnioPrevia] = useState("");
  const [verPlanillaPrevias, setVerPlanillaPrevias] = useState(false);
  const [materiaExamen, setMateriaExamen] = useState("");
  const [anioExamen, setAnioExamen] = useState("");
  const [turnoExamen, setTurnoExamen] = useState("");
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [ordenCurso, setOrdenCurso] = useState("apellido");
  const [mostrarRelevamiento, setMostrarRelevamiento] = useState(false);
  const [verSeguimientoPedagogico, setVerSeguimientoPedagogico] =
    useState(false);

  const fotosPreceptores = {
    "6°1°-Mañana": preceptora11,
    "5°2°-Mañana": preceptora11,
    "4°3°-Tarde": preceptora11,
    "4°4°-Tarde": preceptora11,
  };
  const [anioLegajoFiltro, setAnioLegajoFiltro] = useState("");
  const [verRecursantes, setVerRecursantes] = useState(false);
  const [filtroAvanzado, setFiltroAvanzado] = useState("todos");
  const [alertaActiva, setAlertaActiva] = useState("");
  const [pedidosAnaliticos, setPedidosAnaliticos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [anioRelevamiento, setAnioRelevamiento] = useState("1");
  const [mostrarLegajosArchivo, setMostrarLegajosArchivo] = useState(false);
  const [libroMatrizFiltro, setLibroMatrizFiltro] = useState("");
  const [mostrarMatrizArchivo, setMostrarMatrizArchivo] = useState(false);

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
    condicionFinal: "",
    nacionalidad: "",
    sexo: "",
  });

  useEffect(() => {
    obtenerMatricula();
    obtenerPedidosAnaliticos();
  }, []);

  async function obtenerMatricula() {
    try {
      const respuesta = await axios.get("/api/matricula");
      setAlumnosMatricula(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  function editarAlumno(alumno) {
    setAlumnoEditando(alumno);

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
      condicionFinal: alumno.condicionFinal || "",
      nacionalidad: alumno.nacionalidad || "",
      sexo: alumno.sexo || "",
    });

    setTimeout(() => {
      document.getElementById("formulario-matricula")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
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
      materiasPendientes: [],
      nacionalidad: "",
      sexo: "",
    });

    setPreviaSeleccionada("");
    setAnioPrevia("");
    setAlumnoEditando(null);
  }

  function prepararMovimiento(alumno) {
    setAlumnoMoviendo(alumno);
    setNuevoCurso(alumno.curso);
    setNuevoTurno(alumno.turno);
  }
  async function moverAlumno() {
    if (!alumnoMoviendo) return;

    try {
      await axios.put(`/api/matricula/${alumnoMoviendo._id}`, {
        ...alumnoMoviendo,
        curso: nuevoCurso,
        turno: nuevoTurno,
      });

      setAlumnoMoviendo(null);
      obtenerMatricula();
    } catch (error) {
      console.log(error);
    }
  }

  function agregarPrevia() {
    if (!previaSeleccionada) return;

    if (previaSeleccionada !== "----------" && !anioPrevia) return;

    const nuevaPrevia = {
      asignatura: previaSeleccionada,
      anio: previaSeleccionada === "----------" ? "" : anioPrevia,
    };

    setNuevoAlumno({
      ...nuevoAlumno,
      materiasPendientes: [...nuevoAlumno.materiasPendientes, nuevaPrevia],
    });

    setPreviaSeleccionada("");
    setAnioPrevia("");
  }

  async function guardarAlumnoMatricula() {
    if (guardando) return;

    setGuardando(true);

    try {
      const legajoNuevo = `${nuevoAlumno.legajoNumero || ""}/${nuevoAlumno.legajoAnio || ""}`;

      const matrizNueva = String(
        nuevoAlumno.folioMatriz || nuevoAlumno.libroMatriz || "",
      ).trim();

      const legajoRepetido = alumnosMatricula.some((alumno) => {
        if (alumnoEditando && alumno._id === alumnoEditando._id) return false;

        const legajoExistente = `${alumno.legajoNumero || ""}/${alumno.legajoAnio || ""}`;

        return (
          nuevoAlumno.legajoNumero &&
          nuevoAlumno.legajoAnio &&
          legajoExistente === legajoNuevo
        );
      });

      const matrizRepetida = alumnosMatricula.some((alumno) => {
        if (alumnoEditando && alumno._id === alumnoEditando._id) return false;

        const matrizExistente = String(
          alumno.folioMatriz || alumno.libroMatriz || "",
        ).trim();

        return matrizNueva && matrizExistente === matrizNueva;
      });

      if (legajoRepetido) {
        alert("Ya existe un estudiante cargado con ese número/año de legajo.");
        setGuardando(false);
        return;
      }

      if (matrizRepetida) {
        alert("Ya existe un estudiante cargado con ese libro/folio de matriz.");
        setGuardando(false);
        return;
      }

      if (nuevoAlumno.fechaNacimiento) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const fechaNacimiento = new Date(nuevoAlumno.fechaNacimiento);
        fechaNacimiento.setHours(0, 0, 0, 0);

        if (fechaNacimiento > hoy) {
          alert("La fecha de nacimiento no puede ser posterior al día de hoy.");
          setGuardando(false);
          return;
        }
      }

      const alumnoAGuardar = {
        ...nuevoAlumno,
        curso: cursoSeleccionado.curso,
        turno: cursoSeleccionado.turno,
        estadoMatricula: "Activo",
      };

      if (alumnoEditando) {
        await axios.put(`/api/matricula/${alumnoEditando._id}`, alumnoAGuardar);
        setAlumnoEditando(null);
      } else {
        console.log(alumnoAGuardar);
        await axios.post("/api/matricula", alumnoAGuardar);
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
        condicionFinal: "",
        nacionalidad: "",
        sexo: "",
        dniFisico: "",
        partidaNacimiento: "",
        analiticoParcial: "",
        observacionDocumentacion: "",
      });

      obtenerMatricula();
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.mensaje);
        return;
      }

      console.log(error);
      alert("Error al guardar estudiante");
    } finally {
      setGuardando(false);
    }
  }

  async function actualizarDocumentacion(alumno, campo, valor) {
    const alumnoActualizado = {
      ...alumno,
      [campo]: valor,
    };

    try {
      await axios.put(`/api/matricula/${alumno._id}`, alumnoActualizado);
      obtenerMatricula();
    } catch (error) {
      console.log(error);
      alert("Error al guardar documentación");
    }
  }

  const alumnosDelCurso = cursoSeleccionado
    ? alumnosMatricula
        .filter(
          (alumno) =>
            alumno.curso === cursoSeleccionado.curso &&
            alumno.turno === cursoSeleccionado.turno &&
            alumno.estadoMatricula === "Activo",
        )
        .sort((a, b) => {
          if (ordenCurso === "legajo") {
            const anioA = Number(a.legajoAnio || 0);
            const anioB = Number(b.legajoAnio || 0);

            if (anioA !== anioB) return anioB - anioA;

            const numeroA = Number(a.legajoNumero || 0);
            const numeroB = Number(b.legajoNumero || 0);

            return numeroA - numeroB;
          }

          if (ordenCurso === "matriz") {
            const obtenerMatriz = (alumno) => {
              const valor = String(
                alumno.folioMatriz || alumno.libroMatriz || "",
              ).trim();

              if (!valor || valor === "-") {
                return { libro: 999999, folio: 999999 };
              }

              const partes = valor.split("/");

              return {
                libro: Number(partes[0] || 999999),
                folio: Number(partes[1] || 999999),
              };
            };

            const matrizA = obtenerMatriz(a);
            const matrizB = obtenerMatriz(b);

            if (matrizA.libro !== matrizB.libro) {
              return matrizA.libro - matrizB.libro;
            }

            return matrizA.folio - matrizB.folio;
          }

          return `${a.apellido} ${a.nombre}`.localeCompare(
            `${b.apellido} ${b.nombre}`,
            "es",
            { sensitivity: "base" },
          );
        })
    : [];

  const alumnosFiltrados = alumnosDelCurso.filter((alumno) => {
    const previasReales = Array.isArray(alumno.materiasPendientes)
      ? alumno.materiasPendientes.filter(
          (previa) => previa.asignatura !== "----------",
        )
      : [];

    const coincidePrevia =
      !filtroPrevia && !filtroAnioPrevia
        ? true
        : previasReales.some((previa) => {
            const coincideMateria =
              !filtroPrevia || previa.asignatura === filtroPrevia;

            const coincideAnio =
              !filtroAnioPrevia || previa.anio === filtroAnioPrevia;

            return coincideMateria && coincideAnio;
          });

    const coincideAvanzado = (() => {
      if (filtroAvanzado === "todos") return true;

      if (filtroAvanzado === "prom") return alumno.condicionFinal === "Prom";

      if (filtroAvanzado === "rec") return alumno.condicionFinal === "Rec";

      if (filtroAvanzado === "ingresante")
        return alumno.condicionFinal === "Ingresante";

      if (filtroAvanzado === "reinscripto")
        return alumno.condicionFinal === "Reinscripto";

      if (filtroAvanzado === "previas") return previasReales.length > 0;

      if (filtroAvanzado === "sinLegajo") return !alumno.legajoNumero;

      if (filtroAvanzado === "sinLegajo") return !alumno.legajoNumero;

      if (filtroAvanzado === "sobreedad") {
        if (!alumno.fechaNacimiento) return false;

        const edad = calcularEdadAl30Junio(alumno.fechaNacimiento);

        const anioCurso = Number(cursoSeleccionado.curso.charAt(0));

        const edadesEsperadas = {
          1: 12,
          2: 13,
          3: 14,
          4: 15,
          5: 16,
          6: 17,
        };

        return edad > edadesEsperadas[anioCurso];
      }

      return true;
    })();

    return coincidePrevia && coincideAvanzado;
  });
  function contarAlumnos(curso, turno) {
    return alumnosMatricula.filter(
      (alumno) =>
        alumno.curso === curso &&
        alumno.turno === turno &&
        alumno.estadoMatricula === "Activo",
    ).length;
  }

  const {
    totalEstudiantes,
    totalProm,
    totalRec,
    totalConPrevias,
    porcentajeProm,
    porcentajeRec,
    totalIngresantes,
    totalReinscriptos,
    totalSobreedad,
  } = obtenerEstadisticasCurso(alumnosDelCurso);

  async function eliminarAlumnoMatricula(id) {
    const confirmar = confirm("¿Eliminar este estudiante de la matrícula?");

    if (!confirmar) return;

    try {
      await axios.delete(`/api/matricula/${id}`);
      obtenerMatricula();
    } catch (error) {
      console.log(error);
    }
  }

  const alumnosEncontrados = alumnosMatricula.filter((alumno) => {
    const texto = normalizarTexto(busquedaAlumno);
    const dniBuscado = limpiarDNI(busquedaAlumno);
    const dniAlumno = limpiarDNI(alumno.dni);

    const coincideNombre =
      normalizarTexto(alumno.apellido).includes(texto) ||
      normalizarTexto(alumno.nombre).includes(texto) ||
      normalizarTexto(`${alumno.apellido} ${alumno.nombre}`).includes(texto);

    const coincideDni = dniBuscado.length > 0 && dniAlumno.includes(dniBuscado);

    return coincideNombre || coincideDni;
  });

  function exportarExcel() {
    const datos = alumnosDelCurso.map((alumno) => ({
      "Apellido y Nombre": `${alumno.apellido || ""}, ${alumno.nombre || ""}`,
      DNI: alumno.dni || "",
      "Fecha nacimiento": formatearFecha(alumno.fechaNacimiento),
      "Edad al 30/06": calcularEdadAl30Junio(alumno.fechaNacimiento),
      "Materias pendientes": Array.isArray(alumno.materiasPendientes)
        ? alumno.materiasPendientes
            .map((previa) => `${previa.asignatura} (${previa.anio})`)
            .join(", ")
        : "",
      Condición: alumno.condicionFinal || "",
      Curso: cursoSeleccionado?.curso || "",
      Turno: cursoSeleccionado?.turno || "",
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Matrícula");

    const excelBuffer = XLSX.write(libro, {
      bookType: "xlsx",
      type: "array",
    });

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      archivo,
      `Matricula_${cursoSeleccionado?.curso || "curso"}_${cursoSeleccionado?.turno || "turno"}.xlsx`,
    );
  }

  function calcularCondicionDesdeEstado(estado) {
    const estadoNormalizado = normalizarTexto(estado);

    if (estadoNormalizado.includes("baja")) {
      return "BAJA";
    }

    if (estadoNormalizado.includes("continua mismo ano de estudio")) {
      return "Rec";
    }

    if (estadoNormalizado.includes("ingresante al nivel")) {
      return "";
    }

    return "Prom";
  }

  async function importarReporteOficial(evento) {
    if (!esAdmin) {
      alert("Solo el administrador puede importar estudiantes.");
      return;
    }
    const archivo = evento.target.files[0];
    if (!archivo || !cursoSeleccionado) return;

    const datos = await archivo.arrayBuffer();
    const libro = XLSX.read(datos);
    const hoja = libro.Sheets[libro.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json(hoja, { header: 1, defval: "" });

    const filaEncabezadosIndex = filas.findIndex((fila) =>
      fila.some((celda) =>
        normalizarTexto(celda).includes("nombre estudiante"),
      ),
    );

    if (filaEncabezadosIndex === -1) {
      alert("No encontré las columnas del reporte oficial.");
      return;
    }

    const encabezados = filas[filaEncabezadosIndex].map(normalizarTexto);

    const indiceEstado = encabezados.findIndex((h) =>
      h.includes("estado inscripcion"),
    );

    const indiceNombre = encabezados.findIndex((h) =>
      h.includes("nombre estudiante"),
    );

    const indiceDni = encabezados.findIndex((h) =>
      h.includes("documento estudiante"),
    );

    let ultimoEstado = "";

    const alumnosParaImportar = filas
      .slice(filaEncabezadosIndex + 1)
      .map((fila) => {
        const estadoFila = fila[indiceEstado] || ultimoEstado;
        if (fila[indiceEstado]) ultimoEstado = fila[indiceEstado];

        const condicion = calcularCondicionDesdeEstado(estadoFila);

        if (condicion === "BAJA") return null;

        const nombreCompleto = fila[indiceNombre]?.toString().trim();
        const dni = fila[indiceDni]?.toString().replace(/\D/g, "");

        if (!nombreCompleto || !dni) return null;

        return {
          apellido: nombreCompleto,
          nombre: "",
          dni,
          curso: cursoSeleccionado.curso,
          turno: cursoSeleccionado.turno,
          fechaNacimiento: "",
          materiasPendientes: [],
          condicionFinal: condicion,
          estadoMatricula: "Activo",
        };
      })
      .filter(Boolean);

    try {
      for (const alumno of alumnosParaImportar) {
        await axios.post("/api/matricula", alumno);
      }

      obtenerMatricula();
      alert(`Se importaron ${alumnosParaImportar.length} estudiantes.`);
    } catch (error) {
      console.log(error);
      alert("Hubo un error al importar el reporte.");
    }

    evento.target.value = "";
  }

  async function obtenerPedidosAnaliticos() {
    try {
      const respuesta = await axios.get("/alumnos");
      console.log("PEDIDOS ANALITICOS");
      console.log(respuesta.data);

      setPedidosAnaliticos(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(error);
    }
  }
  const { totalGeneral, totalManana, totalTarde, cicloBasico, cicloSuperior } =
    obtenerEstadisticasGenerales(alumnosMatricula);

  function eliminarPrevia(index) {
    setNuevoAlumno({
      ...nuevoAlumno,
      materiasPendientes: nuevoAlumno.materiasPendientes.filter(
        (_, i) => i !== index,
      ),
    });
  }

  function obtenerAnioDelCurso(curso) {
    return curso?.charAt(0);
  }
  const edadesDelCurso = obtenerEdadesCurso(alumnosDelCurso);

  function cerrarPlanillaPrevias() {
    setVerPlanillaPrevias(false);
    setMateriaExamen("");
    setAnioExamen("");
    setTurnoExamen("");
  }

  const alumnosParaExamen = alumnosMatricula.filter((alumno) => {
    const coincideTurno = !turnoExamen || alumno.turno === turnoExamen;

    return (
      coincideTurno &&
      alumno.materiasPendientes?.some((previa) => {
        if (previa.asignatura === "----------") return false;
        const coincideMateria =
          !materiaExamen || previa.asignatura === materiaExamen;

        const coincideAnio = !anioExamen || previa.anio === anioExamen;

        return coincideMateria && coincideAnio;
      })
    );
  });

  const aniosLegajoDisponibles = [
    ...new Set(
      alumnosMatricula.map((alumno) => alumno.legajoAnio).filter(Boolean),
    ),
  ].sort((a, b) => Number(b) - Number(a));

  const librosMatrizDisponibles = [
    ...new Set(
      alumnosMatricula
        .map((alumno) => {
          const matriz = String(
            alumno.folioMatriz || alumno.libroMatriz || "",
          ).trim();
          return matriz.includes("/")
            ? matriz.split("/")[0]
            : alumno.libroMatriz;
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => Number(a) - Number(b));

  const alumnosPorLegajo = alumnosMatricula
    .filter((alumno) =>
      anioLegajoFiltro ? alumno.legajoAnio === anioLegajoFiltro : false,
    )
    .sort((a, b) => Number(a.legajoNumero || 0) - Number(b.legajoNumero || 0));

  const alumnosPorMatriz = alumnosMatricula
    .filter((alumno) => {
      const valor = String(
        alumno.folioMatriz || alumno.libroMatriz || "",
      ).trim();
      const libro = valor.includes("/")
        ? valor.split("/")[0]
        : alumno.libroMatriz;

      return libroMatrizFiltro
        ? String(libro) === String(libroMatrizFiltro)
        : false;
    })
    .sort((a, b) => {
      const obtenerFolio = (alumno) => {
        const valor = String(
          alumno.folioMatriz || alumno.libroMatriz || "",
        ).trim();
        const partes = valor.split("/");
        return Number(partes[1] || 999999);
      };

      return obtenerFolio(a) - obtenerFolio(b);
    });
  const alumnosRecursantes = alumnosMatricula
    .filter((alumno) => alumno.condicionFinal === "Rec")
    .sort((a, b) => {
      const cursoA = a.curso || "";
      const cursoB = b.curso || "";

      if (cursoA !== cursoB) {
        return cursoA.localeCompare(cursoB, "es");
      }

      return `${a.apellido} ${a.nombre}`.localeCompare(
        `${b.apellido} ${b.nombre}`,
        "es",
        { sensitivity: "base" },
      );
    });

  const {
    alumnosSinLegajo,
    alumnosSinFechaNacimiento,
    alumnosConPrevias,
    alumnosConSobreedad,
  } = obtenerAlertas(alumnosMatricula);

  const alumnosAlertaActiva =
    alertaActiva === "sinLegajo"
      ? alumnosSinLegajo
      : alertaActiva === "sinFecha"
        ? alumnosSinFechaNacimiento
        : alertaActiva === "previas"
          ? alumnosConPrevias
          : alertaActiva === "sobreedad"
            ? alumnosConSobreedad
            : [];

  const pedidosAnaliticosEncontrados = pedidosAnaliticos.filter((pedido) => {
    const texto = normalizarTexto(busquedaAlumno) || "";
    const dniBuscado = limpiarDNI(busquedaAlumno);

    const nombrePedido = normalizarTexto(pedido.nombre) || "";
    const dniPedido = limpiarDNI(pedido.dni);

    const coincideNombre = texto.length > 2 && nombrePedido.includes(texto);

    const coincideDni = dniBuscado.length > 2 && dniPedido.includes(dniBuscado);

    return coincideNombre || coincideDni;
  });

  const relevamientoInspeccion = obtenerRelevamientoInspeccion(
    alumnosMatricula,
    Number(anioRelevamiento),
  );

  const [busquedaDocumentacion, setBusquedaDocumentacion] = useState("");
  const [cursoDocumentacion, setCursoDocumentacion] = useState("");
  const [turnoDocumentacion, setTurnoDocumentacion] = useState("");

  const {
    alumnosDocumentacion,
    totalDocumentacion,
    dniFisicoCompletos,
    partidasCompletas,
    analiticosCompletos,
  } = obtenerEstadisticasDocumentacion({
    alumnosMatricula,
    cursoDocumentacion,
    turnoDocumentacion,
    busquedaDocumentacion,
  });

  if (modoDocumentacion) {
    return (
      <DocumentacionMatricula
        esAdmin={esAdmin}
        volverInicio={volverInicio}
        alumnosDocumentacion={alumnosDocumentacion}
        totalDocumentacion={totalDocumentacion}
        dniFisicoCompletos={dniFisicoCompletos}
        partidasCompletas={partidasCompletas}
        analiticosCompletos={analiticosCompletos}
        busquedaDocumentacion={busquedaDocumentacion}
        setBusquedaDocumentacion={setBusquedaDocumentacion}
        cursoDocumentacion={cursoDocumentacion}
        setCursoDocumentacion={setCursoDocumentacion}
        turnoDocumentacion={turnoDocumentacion}
        setTurnoDocumentacion={setTurnoDocumentacion}
        cursosManana={cursosManana}
        cursosTarde={cursosTarde}
        actualizarDocumentacion={actualizarDocumentacion}
        formatearDNI={formatearDNI}
        estilos={{
          detalleCurso,
          botonVolver,
          tarjetaResumen,
          inputAlumno,
          botonImprimir,
          tabla,
          celda,
        }}
      />
    );
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "#1e3a5f" }}>Gestión de Matrícula</h2>

      <p style={{ color: "#666" }}>Organización por turno, año y sección.</p>

      {!cursoSeleccionado && (
        <>
          <EstadisticasGeneralesMatricula
            mostrar={verEstadisticasGeneral}
            totalGeneral={totalGeneral}
            totalManana={totalManana}
            totalTarde={totalTarde}
            cicloBasico={cicloBasico}
            cicloSuperior={cicloSuperior}
            estilos={{
              bloqueEstadisticas,
              tarjetaEstadistica,
            }}
          />

          <AlertasInstitucionalesMatricula
            alertaActiva={alertaActiva}
            setAlertaActiva={setAlertaActiva}
            alumnosSinLegajo={alumnosSinLegajo}
            alumnosSinFechaNacimiento={alumnosSinFechaNacimiento}
            alumnosConPrevias={alumnosConPrevias}
            alumnosConSobreedad={alumnosConSobreedad}
            alumnosAlertaActiva={alumnosAlertaActiva}
            formatearDNI={formatearDNI}
            calcularEdadAl30Junio={calcularEdadAl30Junio}
            estilos={{
              panelAlertas,
              grillaAlertas,
              tarjetaAlerta,
              detalleCurso,
              botonVolver,
              tabla,
              celda,
            }}
          />
          <BuscadorGeneralMatricula
            busquedaAlumno={busquedaAlumno}
            setBusquedaAlumno={setBusquedaAlumno}
            alumnosEncontrados={alumnosEncontrados}
            pedidosAnaliticos={pedidosAnaliticos}
            pedidosAnaliticosEncontrados={pedidosAnaliticosEncontrados}
            limpiarDNI={limpiarDNI}
            formatearDNI={formatearDNI}
            setCursoSeleccionado={setCursoSeleccionado}
            editarAlumno={editarAlumno}
            setAlumnoSeleccionado={setAlumnoSeleccionado}
            estilos={{
              bloqueBusquedaGeneral,
              inputBusquedaPrincipal,
              listaResultadosBusqueda,
              itemResultadoBusqueda,
              alertaAnalitico,
              botonEditar,
              botonMover,
            }}
          />
          <FichaEstudianteMatricula
            alumnoSeleccionado={alumnoSeleccionado}
            formatearDNI={formatearDNI}
            calcularEdadAl30Junio={calcularEdadAl30Junio}
            setAlumnoSeleccionado={setAlumnoSeleccionado}
            estilos={{
              detalleCurso,
              tituloFicha,
              grillaFicha,
              campoFicha,
              nombreFicha,
              botonCerrarFicha,
            }}
          />
          <h3 style={tituloFicha}>🛠 Herramientas de gestión</h3>

          <div style={panelHerramientas}>
            <button
              style={botonImprimir}
              onClick={() =>
                setVerSeguimientoPedagogico(!verSeguimientoPedagogico)
              }
            >
              🚦 Seguimiento Pedagógico
            </button>
            {verSeguimientoPedagogico && (
              <div
                style={{
                  margin: "24px 0",
                  padding: "24px",
                  border: "2px solid  #bdd9e4",
                  borderRadius: "18px",
                  background: "#ffffff",
                  boxShadow: "0 8px 24px rgba(49, 92, 126, 0.12)",
                  marginBottom: "36px",
                }}
              >
                <SeguimientoPedagogico alumnos={alumnosMatricula} />
              </div>
            )}

            <BotonesHerramientasMatricula
              verPlanillaPrevias={verPlanillaPrevias}
              setVerPlanillaPrevias={setVerPlanillaPrevias}
              setMateriaExamen={setMateriaExamen}
              setAnioExamen={setAnioExamen}
              setTurnoExamen={setTurnoExamen}
              mostrarRelevamiento={mostrarRelevamiento}
              setMostrarRelevamiento={setMostrarRelevamiento}
              verRecursantes={verRecursantes}
              setVerRecursantes={setVerRecursantes}
              imprimirRecursantes={() =>
                imprimirRecursantes(alumnosRecursantes)
              }
              estilos={{ botonImprimir }}
            />

            <RelevamientoInspeccionMatricula
              mostrarRelevamiento={mostrarRelevamiento}
              setMostrarRelevamiento={setMostrarRelevamiento}
              anioRelevamiento={anioRelevamiento}
              setAnioRelevamiento={setAnioRelevamiento}
              relevamientoInspeccion={relevamientoInspeccion}
              estilos={{
                bloqueHerramienta,
                botonImprimir,
                inputAlumno,
              }}
            />
            <FiltrosLegajoMatrizMatricula
              anioLegajoFiltro={anioLegajoFiltro}
              setAnioLegajoFiltro={setAnioLegajoFiltro}
              libroMatrizFiltro={libroMatrizFiltro}
              setLibroMatrizFiltro={setLibroMatrizFiltro}
              aniosLegajoDisponibles={aniosLegajoDisponibles}
              librosMatrizDisponibles={librosMatrizDisponibles}
              estilos={{
                bloqueHerramienta,
                inputAlumno,
              }}
            />

            <ArchivoLegajoMatrizMatricula
              anioLegajoFiltro={anioLegajoFiltro}
              libroMatrizFiltro={libroMatrizFiltro}
              mostrarLegajosArchivo={mostrarLegajosArchivo}
              setMostrarLegajosArchivo={setMostrarLegajosArchivo}
              mostrarMatrizArchivo={mostrarMatrizArchivo}
              setMostrarMatrizArchivo={setMostrarMatrizArchivo}
              obtenerLegajosFaltantes={(anio) =>
                obtenerLegajosFaltantes(alumnosMatricula, anio)
              }
              obtenerFoliosFaltantes={(libro) =>
                obtenerFoliosFaltantes(alumnosMatricula, libro)
              }
              alumnosPorMatriz={alumnosPorMatriz}
              formatearDNI={formatearDNI}
              estilos={{
                bloqueHerramienta,
                botonImprimir,
                detalleCurso,
                tabla,
                celda,
                cajaArchivo: {
                  marginTop: "12px",
                  padding: "12px",
                  border: "1px solid #c7dde3",
                  borderRadius: "10px",
                  backgroundColor: "#f7fafb",
                  marginBottom: "36px",
                },
              }}
            />
            <PlanillaPreviasMatricula
              verPlanillaPrevias={verPlanillaPrevias}
              materiaExamen={materiaExamen}
              setMateriaExamen={setMateriaExamen}
              anioExamen={anioExamen}
              setAnioExamen={setAnioExamen}
              turnoExamen={turnoExamen}
              setTurnoExamen={setTurnoExamen}
              asignaturas={asignaturas}
              aniosMateria={aniosMateria}
              alumnosParaExamen={alumnosParaExamen}
              formatearDNI={formatearDNI}
              imprimirPlanillaPrevias={imprimirPlanillaPrevias}
              cerrarPlanillaPrevias={cerrarPlanillaPrevias}
              estilos={{
                detalleCurso,
                inputAlumno,
                mensajeNoEncontrado,
                tabla,
                celda,
                botonImprimir,
                botonVolver,
              }}
            />

            <ListadoLegajosMatricula
              anioLegajoFiltro={anioLegajoFiltro}
              alumnosPorLegajo={alumnosPorLegajo}
              formatearDNI={formatearDNI}
              estilos={{
                detalleCurso,
                tabla,
                celda,
              }}
            />
            <RecursantesMatricula
              verRecursantes={verRecursantes}
              alumnosRecursantes={alumnosRecursantes}
              formatearDNI={formatearDNI}
              estilos={{
                detalleCurso,
                tabla,
                celda,
              }}
            />
            <TurnosCursosMatricula
              cursosManana={cursosManana}
              cursosTarde={cursosTarde}
              mostrarTurnoManana={mostrarTurnoManana}
              setMostrarTurnoManana={setMostrarTurnoManana}
              mostrarTurnoTarde={mostrarTurnoTarde}
              setMostrarTurnoTarde={setMostrarTurnoTarde}
              fotosPreceptores={fotosPreceptores}
              contarAlumnos={contarAlumnos}
              setCursoSeleccionado={setCursoSeleccionado}
              estilos={{
                contenedorTurnos,
                bloqueTurno,
                tituloTurno,
                grillaCursos,
                tarjetaCurso,
                textoCantidad,
                botonCurso,
              }}
            />
          </div>
        </>
      )}

      {cursoSeleccionado && (
        <div style={detalleCurso} className="area-impresion">
          <AccionesCursoMatricula
            esAdmin={esAdmin}
            setCursoSeleccionado={setCursoSeleccionado}
            imprimirCurso={() =>
              imprimirCurso({
                cursoSeleccionado,
                alumnosFiltrados,
                ordenCurso,
              })
            }
            verEstadisticasCurso={verEstadisticasCurso}
            setVerEstadisticasCurso={setVerEstadisticasCurso}
            exportarExcel={exportarExcel}
            importarReporteOficial={importarReporteOficial}
            estilos={{
              botonVolver,
              botonImprimir,
            }}
          />
          <div id="curso-imprimir">
            <h3 style={{ color: "#1e3a5f" }}>
              Curso: {cursoSeleccionado.curso} - Turno {cursoSeleccionado.turno}
            </h3>

            <p>Cantidad de estudiantes: {alumnosDelCurso.length}</p>

            <EstadisticasCursoMatricula
              verEstadisticasCurso={verEstadisticasCurso}
              totalEstudiantes={totalEstudiantes}
              totalProm={totalProm}
              porcentajeProm={porcentajeProm}
              totalRec={totalRec}
              porcentajeRec={porcentajeRec}
              totalIngresantes={totalIngresantes}
              totalReinscriptos={totalReinscriptos}
              totalConPrevias={totalConPrevias}
              totalSobreedad={totalSobreedad}
              estilos={{
                bloqueEstadisticas,
                tarjetaEstadistica,
              }}
            />

            <EdadesCursoMatricula
              edadesDelCurso={edadesDelCurso}
              estilos={{
                bloqueEdades,
                grillaEdades,
                tarjetaEdad,
              }}
            />
          </div>

          <FormularioAlumnoMatricula
            esAdmin={esAdmin}
            nuevoAlumno={nuevoAlumno}
            setNuevoAlumno={setNuevoAlumno}
            previaSeleccionada={previaSeleccionada}
            setPreviaSeleccionada={setPreviaSeleccionada}
            anioPrevia={anioPrevia}
            setAnioPrevia={setAnioPrevia}
            asignaturas={asignaturas}
            aniosMateria={aniosMateria}
            agregarPrevia={agregarPrevia}
            eliminarPrevia={eliminarPrevia}
            guardarAlumnoMatricula={guardarAlumnoMatricula}
            limpiarFormulario={limpiarFormulario}
            guardando={guardando}
            alumnoEditando={alumnoEditando}
            estilos={{
              formularioAlumno,
              inputAlumno,
              bloquePrevias,
              botonAgregarPrevia,
              listaPreviasInline,
              chipPrevia,
              botonEliminar,
              botonAgregar,
              botonVolver,
            }}
          />
          <MovimientoMatricula
            alumnoMoviendo={alumnoMoviendo}
            nuevoCurso={nuevoCurso}
            setNuevoCurso={setNuevoCurso}
            nuevoTurno={nuevoTurno}
            setNuevoTurno={setNuevoTurno}
            cursosManana={cursosManana}
            cursosTarde={cursosTarde}
            moverAlumno={moverAlumno}
            setAlumnoMoviendo={setAlumnoMoviendo}
            estilos={{
              bloqueMovimiento,
              inputAlumno,
              botonAgregarPrevia,
              botonVolver,
            }}
          />
          <div
            className="no-print"
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <button
              style={botonVolver}
              onClick={() => {
                setFiltroPrevia("");
                setFiltroAnioPrevia("");
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
            <option value="matriz">Ordenar por Libro/Folio</option>
          </select>

          <p
            style={{
              marginTop: "12px",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#1e3a5f",
              textAlign: "center",
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
              marginRight: "auto",
            }}
          >
            <option value="todos">Todos</option>
            <option value="prom">Sólo Prom</option>
            <option value="rec">Sólo Rec</option>
            <option value="previas">Con previas</option>
            <option value="sinLegajo">Sin legajo</option>
            <option value="sobreedad">Sobreedad</option>
            <option value="ingresante">Ingresantes</option>

            <option value="reinscripto">Reinscriptos</option>
          </select>

          <div style={tablaResponsive}>
            <table style={tabla}>
              <thead>
                <tr>
                  <th style={{ ...celda, width: "280px" }}>
                    Apellido y Nombre
                  </th>
                  <th style={celda}>DNI</th>
                  <th style={celda}>Legajo</th>

                  <th style={celda}>Nacionalidad</th>
                  <th style={celda}>Sexo</th>
                  <th style={celda}>Libro/Folio</th>
                  <th style={{ ...celda, width: "95px" }}>Fecha nacimiento</th>
                  <th style={{ ...celda, width: "55px" }}>Edad</th>
                  <th style={{ ...celda, width: "240px" }}>Pendientes</th>
                  <th style={{ ...celda, width: "65px" }}>Cond.</th>
                  <th style={{ ...celda, width: "140px" }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {alumnosDelCurso.length === 0 && (
                  <tr>
                    <td style={celda} colSpan="11">
                      Todavía no hay estudiantes cargados en este curso.
                    </td>
                  </tr>
                )}

                {alumnosFiltrados.map((alumno) => (
                  <tr
                    key={alumno._id}
                    style={{
                      backgroundColor:
                        alumno.sexo === "Varón" ? "#eeeeee" : "white",
                    }}
                  >
                    <td style={celda}>
                      {alumno.apellido}, {alumno.nombre}
                    </td>

                    <td style={celda}>{formatearDNI(alumno.dni)}</td>

                    <td style={celda}>
                      {alumno.legajoNumero && alumno.legajoAnio
                        ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                        : "-"}
                    </td>

                    <td style={celda}>{String(alumno.nacionalidad || "-")}</td>

                    <td style={celda}>{String(alumno.sexo || "-")}</td>

                    <td style={celda}>
                      {alumno.libroMatriz && alumno.folioMatriz
                        ? `${alumno.libroMatriz}/${alumno.folioMatriz}`
                        : alumno.folioMatriz
                          ? alumno.folioMatriz
                          : alumno.libroMatriz
                            ? alumno.libroMatriz
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
                            .map((previa) =>
                              previa.asignatura === "----------"
                                ? "----------"
                                : `${previa.asignatura} (${previa.anio})`,
                            )
                            .join(", ")
                        : ""}
                    </td>

                    <td style={celda}>{alumno.condicionFinal}</td>

                    <td
                      style={{
                        ...celda,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        style={{
                          ...botonEditar,
                          opacity: esAdmin ? 1 : 0.45,
                          cursor: esAdmin ? "pointer" : "not-allowed",
                        }}
                        onClick={() => esAdmin && editarAlumno(alumno)}
                        title={
                          esAdmin
                            ? "Editar estudiante"
                            : "Solo el administrador puede editar"
                        }
                      >
                        ✏️
                      </button>

                      <button
                        style={{
                          ...botonMover,
                          opacity: esAdmin ? 1 : 0.45,
                          cursor: esAdmin ? "pointer" : "not-allowed",
                        }}
                        onClick={() => {
                          if (!esAdmin) return;

                          prepararMovimiento(alumno);

                          setTimeout(() => {
                            document
                              .getElementById("movimiento-matricula")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }, 100);
                        }}
                        title={
                          esAdmin
                            ? "Mover estudiante"
                            : "Solo el administrador puede mover estudiantes"
                        }
                      >
                        🔁
                      </button>

                      <button
                        style={{
                          ...botonEliminar,
                          opacity: esAdmin ? 1 : 0.45,
                          cursor: esAdmin ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          esAdmin && eliminarAlumnoMatricula(alumno._id)
                        }
                        title={
                          esAdmin
                            ? "Eliminar estudiante"
                            : "Solo el administrador puede eliminar"
                        }
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const bloqueTurno = {
  backgroundColor: "#eef7f6",
  border: "2px solid #c7e3df",
  padding: "18px 24px",
  borderRadius: "26px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  marginBottom: "22px",
};

const tituloTurno = {
  color: "#0f766e",
  marginBottom: "10px",
  fontSize: "21px",
  textAlign: "center",
  fontWeight: "bold",
};

const grillaCursos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px",
};

const tarjetaCurso = {
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const textoCantidad = {
  color: "#666",
  fontSize: "14px",
};

const botonCurso = {
  backgroundColor: "#0f766e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.2s",
};

const detalleCurso = {
  marginTop: "35px",
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
};

const botonVolver = {
  backgroundColor: "#e9f5f5",
  color: "#1e5f5c",
  border: "1px solid #cfd8e3",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "15px",
  fontWeight: "bold",
};

const formularioAlumno = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "22px",
  marginTop: "22px",
  alignItems: "center",
};
const inputAlumno = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "0",
  width: "92%",
};

const botonAgregar = {
  backgroundColor: "#4cb3aa",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  gridColumn: "auto",
  padding: "8px 20px",
};

const tabla = {
  width: "100%",
  minWidth: "850px",
  borderCollapse: "collapse",
  marginTop: "15px",
};

const celda = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  fontSize: "13px",
};
const bloquePrevias = {
  display: "grid",
  gridTemplateColumns: "2fr 90px 130px 1fr",
  gap: "8px",
  alignItems: "center",
  gridColumn: "1 / 5",
};

const listaPreviasInline = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  alignItems: "center",
  gridColumn: "1 / -1",
  marginTop: "4px",
};

const chipPrevia = {
  backgroundColor: "#eef7f6",
  border: "1px solid #c7e3df",
  borderRadius: "20px",
  padding: "4px 10px",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const botonEditar = {
  backgroundColor: "#dbe7f5",
  color: "#1e3a5f",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "4px",
};

const botonEliminar = {
  backgroundColor: "#f7dede",
  color: "#8b2e2e",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "4px",
};
const botonAgregarPrevia = {
  backgroundColor: "#e9eef5",
  color: "#1e3a5f",
  border: "1px solid #cfd8e3",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  padding: "10px",
};
const botonImprimir = {
  backgroundColor: "#e9eef5",
  color: "#1e3a5f",
  border: "1px solid #cfd8e3",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  marginLeft: "8px",
  marginBottom: "15px",
};

const botonMover = {
  backgroundColor: "#eef5ee",
  color: "#2f6b3f",
  border: "none",
  padding: "6px 8px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "4px",
};

const bloqueMovimiento = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "12px",
  padding: "15px",
  marginBottom: "20px",
};
const bloqueEstadisticas = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginTop: "20px",
  marginBottom: "20px",
};

const tarjetaEstadistica = {
  backgroundColor: "#f8fafc",
  border: "2px solid #dbe4ee",
  borderRadius: "16px",
  padding: "18px",
  textAlign: "center",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
};
const alertaSobreedad = {
  marginLeft: "6px",
  fontSize: "13px",
};
const bloqueEdades = {
  marginTop: "20px",
  marginBottom: "15px",
  textAlign: "center",
};

const grillaEdades = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
  gap: "10px",
  marginTop: "10px",
};

const tarjetaEdad = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "14px",
  padding: "12px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};
const mensajeNoEncontrado = {
  backgroundColor: "#fff3cd",
  padding: "12px",
  borderRadius: "10px",
  color: "#856404",
  marginBottom: "15px",
  textAlign: "center",
};
const bloqueBusquedaGeneral = {
  backgroundColor: "#e9f4f7",
  border: "4px solid #cfe3e8",
  borderRadius: "14px",
  padding: "4px",
  marginBottom: "20px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
};

const inputBusquedaPrincipal = {
  width: "90%",
  maxWidth: "500px",
  padding: "10px",
  border: "3px solid #bfd4dc",
  borderRadius: "10px",
  fontSize: "15px",
};

const listaResultadosBusqueda = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const itemResultadoBusqueda = {
  backgroundColor: "white",
  border: "1px solid #dbe4ee",
  borderRadius: "12px",
  padding: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const bloqueLegajos = {
  backgroundColor: "#f8fafc",
  border: "1px solid #dbe4ee",
  borderRadius: "18px",
  padding: "20px",
  marginBottom: "25px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
};

const panelHerramientas = {
  backgroundColor: "#ffffff",
  border: "3px solid #c7dde3",
  borderRadius: "18px",
  padding: "14px",
  marginTop: "20px",
  marginBottom: "20px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
};

const bloqueHerramienta = {
  backgroundColor: "#f8fbff",
  border: "2px solid #dbeafe",
  borderRadius: "14px",
  padding: "12px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
  textAlign: "center",
};

const panelAlertas = {
  backgroundColor: "#fff7ed",
  border: "2px solid #fed7aa",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "20px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
};

const grillaAlertas = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px",
};

const tarjetaAlerta = {
  backgroundColor: "white",
  border: "2px solid #fed7aa",
  borderRadius: "14px",
  padding: "12px",
  textAlign: "center",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
  cursor: "pointer",
  transition: "0.2s",
  transform: "scale(1)",
};
const grillaFicha = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginTop: "20px",
  backgroundColor: "#ffffff",
  border: "2px solid #c7dde3",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
};

const campoFicha = {
  backgroundColor: "#f8fbff",
  border: "1px solid #dbeafe",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.18)",
};
const tituloFicha = {
  backgroundColor: "#eaf6f8",
  borderLeft: "5px solid #167a7f",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "20px",
  textAlign: "center",
  color: "#1e3a5f",
};
const alertaAnalitico = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fdba74",
  color: "#9a3412",
  padding: "8px",
  borderRadius: "10px",
  fontWeight: "bold",
  marginTop: "8px",
  fontSize: "13px",
};
const botonCerrarFicha = {
  backgroundColor: "#e9f5f5",
  color: "#1e5f5c",
  border: "1px solid #cfd8e3",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
};
const nombreFicha = {
  display: "inline-block",
  marginTop: "6px",
  fontSize: "16px",
  color: "#1e3a5f",
  fontWeight: "bold",
};
const tablaResponsive = {
  width: "100%",
  overflowX: "auto",
};

const contenedorTurnos = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  marginTop: "25px",
};
const tarjetaResumen = {
  backgroundColor: "#f7fafb",
  border: "1px solid #c7dde3",
  borderRadius: "10px",
  padding: "12px",
  textAlign: "center",
  color: "#1e3a5f",
  fontWeight: "bold",
};
