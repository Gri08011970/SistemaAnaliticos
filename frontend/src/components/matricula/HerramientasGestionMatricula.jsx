import SeguimientoPedagogico from "./SeguimientoPedagogico/SeguimientoPedagogico";
import BotonesHerramientasMatricula from "./BotonesHerramientasMatricula";
import RelevamientoInspeccionMatricula from "./RelevamientoInspeccionMatricula";
import FiltrosLegajoMatrizMatricula from "./FiltrosLegajoMatrizMatricula";
import ArchivoLegajoMatrizMatricula from "./ArchivoLegajoMatrizMatricula";
import PlanillaPreviasMatricula from "./PlanillaPreviasMatricula";
import ListadoLegajosMatricula from "./ListadoLegajosMatricula";
import RecursantesMatricula from "./RecursantesMatricula";
import TurnosCursosMatricula from "./TurnosCursosMatricula";

export default function HerramientasGestionMatricula({
  alumnosMatricula,

  verSeguimientoPedagogico,
  setVerSeguimientoPedagogico,

  verPlanillaPrevias,
  setVerPlanillaPrevias,

  materiaExamen,
  setMateriaExamen,

  anioExamen,
  setAnioExamen,

  turnoExamen,
  setTurnoExamen,

  asignaturas,
  aniosMateria,

  alumnosParaExamen,
  imprimirPlanillaPrevias,
  cerrarPlanillaPrevias,

  mostrarRelevamiento,
  setMostrarRelevamiento,

  anioRelevamiento,
  setAnioRelevamiento,

  relevamientoInspeccion,

  verRecursantes,
  setVerRecursantes,

  alumnosRecursantes,
  imprimirRecursantes,

  anioLegajoFiltro,
  setAnioLegajoFiltro,

  libroMatrizFiltro,
  setLibroMatrizFiltro,

  aniosLegajoDisponibles,
  librosMatrizDisponibles,

  mostrarLegajosArchivo,
  setMostrarLegajosArchivo,

  mostrarMatrizArchivo,
  setMostrarMatrizArchivo,

  obtenerLegajosFaltantes,
  obtenerFoliosFaltantes,

  alumnosPorLegajo,
  alumnosPorMatriz,

  cursosManana,
  cursosTarde,

  mostrarTurnoManana,
  setMostrarTurnoManana,

  mostrarTurnoTarde,
  setMostrarTurnoTarde,

  fotosPreceptores,
  contarAlumnos,
  setCursoSeleccionado,

  formatearDNI,

  estilos,
}) {
  const {
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
  } = estilos;

  return (
    <>
      <h3 style={tituloFicha}>
        🛠 Herramientas de gestión
      </h3>

      <div style={panelHerramientas}>
        <button
          type="button"
          style={botonImprimir}
          onClick={() =>
            setVerSeguimientoPedagogico(
              !verSeguimientoPedagogico,
            )
          }
        >
          🚦 Seguimiento Pedagógico
        </button>

        {verSeguimientoPedagogico && (
          <div
            style={{
              margin: "24px 0 36px",
              padding: "24px",
              border: "2px solid #bdd9e4",
              borderRadius: "18px",
              background: "#ffffff",
              boxShadow:
                "0 8px 24px rgba(49, 92, 126, 0.12)",
            }}
          >
            <SeguimientoPedagogico
              alumnos={alumnosMatricula}
            />
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
          imprimirRecursantes={imprimirRecursantes}
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
          aniosLegajoDisponibles={
            aniosLegajoDisponibles
          }
          librosMatrizDisponibles={
            librosMatrizDisponibles
          }
          estilos={{
            bloqueHerramienta,
            inputAlumno,
          }}
        />

        <ArchivoLegajoMatrizMatricula
          anioLegajoFiltro={anioLegajoFiltro}
          libroMatrizFiltro={libroMatrizFiltro}
          mostrarLegajosArchivo={mostrarLegajosArchivo}
          setMostrarLegajosArchivo={
            setMostrarLegajosArchivo
          }
          mostrarMatrizArchivo={mostrarMatrizArchivo}
          setMostrarMatrizArchivo={
            setMostrarMatrizArchivo
          }
          obtenerLegajosFaltantes={
            obtenerLegajosFaltantes
          }
          obtenerFoliosFaltantes={
            obtenerFoliosFaltantes
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
          imprimirPlanillaPrevias={
            imprimirPlanillaPrevias
          }
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
          setMostrarTurnoManana={
            setMostrarTurnoManana
          }
          mostrarTurnoTarde={mostrarTurnoTarde}
          setMostrarTurnoTarde={
            setMostrarTurnoTarde
          }
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
  );
}