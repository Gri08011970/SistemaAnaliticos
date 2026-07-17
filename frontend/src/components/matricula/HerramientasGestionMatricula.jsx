import { useState } from "react";

import SeguimientoPedagogico from "./SeguimientoPedagogico/SeguimientoPedagogico";
import BotonesHerramientasMatricula from "./BotonesHerramientasMatricula";
import RelevamientoInspeccionMatricula from "./RelevamientoInspeccionMatricula";
import FiltrosLegajoMatrizMatricula from "./FiltrosLegajoMatrizMatricula";
import ArchivoLegajoMatrizMatricula from "./ArchivoLegajoMatrizMatricula";
import PlanillaPreviasMatricula from "./PlanillaPreviasMatricula";
import ListadoLegajosMatricula from "./ListadoLegajosMatricula";
import RecursantesMatricula from "./RecursantesMatricula";
import TurnosCursosMatricula from "./TurnosCursosMatricula";
import TarjetaModulo from "./TarjetaModulo";

export default function HerramientasGestionMatricula({
  esAdmin,
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
    encabezadoBloque,
    tituloBloque,
  } = estilos;

  const [seccionActiva, setSeccionActiva] = useState("");

  const volverATablero = () => {
    setSeccionActiva("");
  };

  return (
    <div style={panelHerramientas}>
      <div style={encabezadoBloque}>
        <h3 style={tituloBloque}>🛠 Herramientas de gestión</h3>
      </div>

      {!seccionActiva && (
        <>
          <p
            style={{
              margin: "0 0 20px",
              textAlign: "center",
              color: "#665d70",
              fontSize: "17px",
            }}
          >
            Seleccioná el sector en el que necesitás trabajar.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
              width: "100%",
            }}
          >
            <TarjetaModulo
              titulo="🚦 Seguimiento pedagógico"
              descripcion="Carga por asignatura, resumen del curso y ficha individual."
              onEntrar={() => setSeccionActiva("seguimiento")}
              colorBorde="#9bd8cb"
            />

            <TarjetaModulo
              titulo="📋 Herramientas complementarias"
              descripcion="Planilla de previas, relevamiento y estudiantes recursantes."
              onEntrar={() => setSeccionActiva("complementarias")}
              colorBorde="#bdd3e8"
            />

            <TarjetaModulo
              titulo="🧾 Legajos y matriz"
              descripcion="Consulta por año, libro, folios y registros faltantes."
              onEntrar={() => setSeccionActiva("legajos")}
              colorBorde="#a9c3df"
            />

            <TarjetaModulo
              titulo="👥 Cursos y turnos"
              descripcion="Acceso a cursos del turno mañana y del turno tarde."
              onEntrar={() => setSeccionActiva("cursos")}
              colorBorde="#b7ddd7"
            />
          </div>
        </>
      )}

      {seccionActiva === "seguimiento" && (
        <div style={{ width: "100%" }}>
          <button type="button" onClick={volverATablero} style={botonVolver}>
            ← Volver a herramientas
          </button>

          <SeguimientoPedagogico alumnos={alumnosMatricula} esAdmin={esAdmin} />
        </div>
      )}

      {seccionActiva === "complementarias" && (
        <div style={{ width: "100%" }}>
          <button type="button" onClick={volverATablero} style={botonVolver}>
            ← Volver a herramientas
          </button>

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
        </div>
      )}

      {seccionActiva === "legajos" && (
        <div style={{ width: "100%" }}>
          <button type="button" onClick={volverATablero} style={botonVolver}>
            ← Volver a herramientas
          </button>

          <div
            style={{
              borderTop: "6px solid #6d8fb3",
              borderRadius: "16px",
              padding: "20px",
              backgroundColor: "#ffffff",
              boxShadow: "0 7px 18px rgba(30, 58, 95, 0.10)",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                color: "#1e3a5f",
                textAlign: "center",
                fontSize: "25px",
              }}
            >
              🧾 Legajos y matriz
            </h2>

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

            <ArchivoLegajoMatrizMatricula
              anioLegajoFiltro={anioLegajoFiltro}
              libroMatrizFiltro={libroMatrizFiltro}
              mostrarLegajosArchivo={mostrarLegajosArchivo}
              setMostrarLegajosArchivo={setMostrarLegajosArchivo}
              mostrarMatrizArchivo={mostrarMatrizArchivo}
              setMostrarMatrizArchivo={setMostrarMatrizArchivo}
              obtenerLegajosFaltantes={obtenerLegajosFaltantes}
              obtenerFoliosFaltantes={obtenerFoliosFaltantes}
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
                  marginBottom: "16px",
                },
              }}
            />
          </div>
        </div>
      )}

      {seccionActiva === "cursos" && (
        <div style={{ width: "100%" }}>
          <button type="button" onClick={volverATablero} style={botonVolver}>
            ← Volver a herramientas
          </button>

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
      )}
    </div>
  );
}