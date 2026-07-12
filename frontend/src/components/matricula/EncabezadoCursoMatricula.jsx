import AccionesCursoMatricula from "./AccionesCursoMatricula";
import EstadisticasCursoMatricula from "./EstadisticasCursoMatricula";
import EdadesCursoMatricula from "./EdadesCursoMatricula";

export default function EncabezadoCursoMatricula({
  esAdmin,
  cursoSeleccionado,
  setCursoSeleccionado,
  alumnosDelCurso,
  alumnosFiltrados,
  ordenCurso,
  imprimirCurso,
  verEstadisticasCurso,
  setVerEstadisticasCurso,
  exportarExcel,
  importarReporteOficial,
  estadisticasCurso,
  edadesDelCurso,
  estilos,
}) {
  const {
    botonVolver,
    botonImprimir,
    bloqueEstadisticas,
    tarjetaEstadistica,
    bloqueEdades,
    grillaEdades,
    tarjetaEdad,
  } = estilos;

  return (
    <>
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
        exportarExcel={() =>
          exportarExcel({
            alumnosDelCurso,
            cursoSeleccionado,
          })
        }
        importarReporteOficial={(evento) =>
          importarReporteOficial({
            evento,
            esAdmin,
            cursoSeleccionado,
          })
        }
        estilos={{
          botonVolver,
          botonImprimir,
        }}
      />

      <div id="curso-imprimir">
        <h3 style={{ color: "#1e3a5f" }}>
          Curso: {cursoSeleccionado.curso} - Turno{" "}
          {cursoSeleccionado.turno}
        </h3>

        <p>
          Cantidad de estudiantes:{" "}
          <strong>{alumnosDelCurso.length}</strong>
        </p>

        <EstadisticasCursoMatricula
          verEstadisticasCurso={verEstadisticasCurso}
          totalEstudiantes={estadisticasCurso.totalEstudiantes}
          totalProm={estadisticasCurso.totalProm}
          porcentajeProm={estadisticasCurso.porcentajeProm}
          totalRec={estadisticasCurso.totalRec}
          porcentajeRec={estadisticasCurso.porcentajeRec}
          totalIngresantes={estadisticasCurso.totalIngresantes}
          totalReinscriptos={estadisticasCurso.totalReinscriptos}
          totalConPrevias={estadisticasCurso.totalConPrevias}
          totalSobreedad={estadisticasCurso.totalSobreedad}
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
    </>
  );
}