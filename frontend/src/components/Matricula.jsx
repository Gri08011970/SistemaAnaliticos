import { useEffect, useState } from "react";
import axios from "axios";
import preceptora11 from "../assets/preceptores/preceptor_1_1.jpg";
import {
  cursosManana,
  cursosTarde,
  asignaturas,
  aniosMateria,  
} from "./matricula/matriculaConstants";
import BuscadorGeneralMatricula from "./matricula/BuscadorGeneralMatricula";
import FichaEstudianteMatricula from "./matricula/FichaEstudianteMatricula";
import {
  calcularEdadAl30Junio,
  formatearFecha,
  formatearDNI,
  limpiarDNI,
  tieneSobreedad,
} from "./matricula/matriculaUtils";
import { imprimirCurso } from "./matricula/impresiones/imprimirCurso";
import { imprimirPlanillaPrevias } from "./matricula/impresiones/imprimirPrevias";
import { imprimirRecursantes } from "./matricula/impresiones/imprimirRecursantes";
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
import {
  obtenerAlumnosDelCurso,
  filtrarAlumnosDelCurso,
} from "./matricula/filtros/alumnosCursoUtils";
import {
  obtenerAlumnosParaExamen,
  obtenerAniosLegajoDisponibles,
  obtenerLibrosMatrizDisponibles,
  obtenerAlumnosPorLegajo,
  obtenerAlumnosPorMatriz,
  obtenerAlumnosRecursantes,
} from "./matricula/herramientas/obtenerDatosHerramientas";
import {
  contarAlumnosPorCurso,
  buscarAlumnosMatricula,
  buscarPedidosAnaliticos,
} from "./matricula/filtros/busquedaMatriculaUtils";
import { exportarMatriculaExcel } from "./matricula/excel/exportarMatriculaExcel";
import { importarReporte } from "./matricula/excel/importarReporteOficial";
import DetalleCursoMatricula from "./matricula/DetalleCursoMatricula";
import EncabezadoCursoMatricula from "./matricula/EncabezadoCursoMatricula";
import GestionAlumnoCursoMatricula from "./matricula/GestionAlumnoCursoMatricula";
import HerramientasGestionMatricula from "./matricula/HerramientasGestionMatricula";

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
  const alumnosDelCurso = obtenerAlumnosDelCurso({
    alumnosMatricula,
    cursoSeleccionado,
    ordenCurso,
  });

  const alumnosFiltrados = filtrarAlumnosDelCurso({
    alumnosDelCurso,
    filtroPrevia,
    filtroAnioPrevia,
    filtroAvanzado,
  });

  const estadisticasCurso = obtenerEstadisticasCurso(alumnosDelCurso);

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

  const alumnosEncontrados = buscarAlumnosMatricula({
    alumnosMatricula,
    busqueda: busquedaAlumno,
  });

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

  const alumnosParaExamen = obtenerAlumnosParaExamen({
    alumnosMatricula,
    materiaExamen,
    anioExamen,
    turnoExamen,
  });

  const aniosLegajoDisponibles =
    obtenerAniosLegajoDisponibles(alumnosMatricula);

  const librosMatrizDisponibles =
    obtenerLibrosMatrizDisponibles(alumnosMatricula);

  const alumnosPorLegajo = obtenerAlumnosPorLegajo({
    alumnosMatricula,
    anioLegajoFiltro,
  });

  const alumnosPorMatriz = obtenerAlumnosPorMatriz({
    alumnosMatricula,
    libroMatrizFiltro,
  });

  const alumnosRecursantes = obtenerAlumnosRecursantes(alumnosMatricula);

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

  const pedidosAnaliticosEncontrados = buscarPedidosAnaliticos({
    pedidosAnaliticos,
    busqueda: busquedaAlumno,
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
          <HerramientasGestionMatricula
            alumnosMatricula={alumnosMatricula}
            verSeguimientoPedagogico={verSeguimientoPedagogico}
            setVerSeguimientoPedagogico={setVerSeguimientoPedagogico}
            verPlanillaPrevias={verPlanillaPrevias}
            setVerPlanillaPrevias={setVerPlanillaPrevias}
            materiaExamen={materiaExamen}
            setMateriaExamen={setMateriaExamen}
            anioExamen={anioExamen}
            setAnioExamen={setAnioExamen}
            turnoExamen={turnoExamen}
            setTurnoExamen={setTurnoExamen}
            asignaturas={asignaturas}
            aniosMateria={aniosMateria}
            alumnosParaExamen={alumnosParaExamen}
            imprimirPlanillaPrevias={imprimirPlanillaPrevias}
            cerrarPlanillaPrevias={cerrarPlanillaPrevias}
            mostrarRelevamiento={mostrarRelevamiento}
            setMostrarRelevamiento={setMostrarRelevamiento}
            anioRelevamiento={anioRelevamiento}
            setAnioRelevamiento={setAnioRelevamiento}
            relevamientoInspeccion={relevamientoInspeccion}
            verRecursantes={verRecursantes}
            setVerRecursantes={setVerRecursantes}
            alumnosRecursantes={alumnosRecursantes}
            imprimirRecursantes={() => imprimirRecursantes(alumnosRecursantes)}
            anioLegajoFiltro={anioLegajoFiltro}
            setAnioLegajoFiltro={setAnioLegajoFiltro}
            libroMatrizFiltro={libroMatrizFiltro}
            setLibroMatrizFiltro={setLibroMatrizFiltro}
            aniosLegajoDisponibles={aniosLegajoDisponibles}
            librosMatrizDisponibles={librosMatrizDisponibles}
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
            alumnosPorLegajo={alumnosPorLegajo}
            alumnosPorMatriz={alumnosPorMatriz}
            cursosManana={cursosManana}
            cursosTarde={cursosTarde}
            mostrarTurnoManana={mostrarTurnoManana}
            setMostrarTurnoManana={setMostrarTurnoManana}
            mostrarTurnoTarde={mostrarTurnoTarde}
            setMostrarTurnoTarde={setMostrarTurnoTarde}
            fotosPreceptores={fotosPreceptores}
            contarAlumnos={(curso, turno) =>
              contarAlumnosPorCurso({
                alumnosMatricula,
                curso,
                turno,
              })
            }
            setCursoSeleccionado={setCursoSeleccionado}
            formatearDNI={formatearDNI}
            estilos={{
              tituloFicha,
              panelHerramientas,
              botonImprimir,
              bloqueHerramienta,
              inputAlumno,
              detalleCurso,
              mensajeNoEncontrado,
              tabla,
              celda,
              botonVolver,
              contenedorTurnos,
              bloqueTurno,
              tituloTurno,
              grillaCursos,
              tarjetaCurso, 
              textoCantidad,
              botonCurso,
            }}
          />
        </>
      )}

      {cursoSeleccionado && (
        <div style={detalleCurso} className="area-impresion">
          <EncabezadoCursoMatricula
            esAdmin={esAdmin}
            cursoSeleccionado={cursoSeleccionado}
            setCursoSeleccionado={setCursoSeleccionado}
            alumnosDelCurso={alumnosDelCurso}
            alumnosFiltrados={alumnosFiltrados}
            ordenCurso={ordenCurso}
            imprimirCurso={imprimirCurso}
            verEstadisticasCurso={verEstadisticasCurso}
            setVerEstadisticasCurso={setVerEstadisticasCurso}
            exportarExcel={exportarMatriculaExcel}
            importarReporteOficial={({ evento, esAdmin, cursoSeleccionado }) =>
              importarReporte({
                evento,
                esAdmin,
                cursoSeleccionado,
                obtenerMatricula,
              })
            }
            estadisticasCurso={estadisticasCurso}
            edadesDelCurso={edadesDelCurso}
            estilos={{
              botonVolver,
              botonImprimir,
              bloqueEstadisticas,
              tarjetaEstadistica,
              bloqueEdades,
              grillaEdades,
              tarjetaEdad,
            }}
          />
          <GestionAlumnoCursoMatricula
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
              formularioAlumno,
              inputAlumno,
              bloquePrevias,
              botonAgregarPrevia,
              listaPreviasInline,
              chipPrevia,
              botonEliminar,
              botonAgregar,
              botonVolver,
              bloqueMovimiento,
            }}
          />

          <DetalleCursoMatricula
            esAdmin={esAdmin}
            alumnosDelCurso={alumnosDelCurso}
            alumnosFiltrados={alumnosFiltrados}
            ordenCurso={ordenCurso}
            setOrdenCurso={setOrdenCurso}
            filtroAvanzado={filtroAvanzado}
            setFiltroAvanzado={setFiltroAvanzado}
            setFiltroPrevia={setFiltroPrevia}
            setFiltroAnioPrevia={setFiltroAnioPrevia}
            formatearDNI={formatearDNI}
            formatearFecha={formatearFecha}
            calcularEdadAl30Junio={calcularEdadAl30Junio}
            tieneSobreedad={tieneSobreedad}
            editarAlumno={editarAlumno}
            prepararMovimiento={prepararMovimiento}
            eliminarAlumnoMatricula={eliminarAlumnoMatricula}
            estilos={{
              botonVolver,
              inputAlumno,
              tablaResponsive,
              tabla,
              celda,
              alertaSobreedad,
              botonEditar,
              botonMover,
              botonEliminar,
            }}
          />
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
  borderTop: "6px solid #5d86b0",
};

const celda = {
  border: "2px solid #ddd",
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
