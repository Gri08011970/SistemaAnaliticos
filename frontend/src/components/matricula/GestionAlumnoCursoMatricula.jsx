import FormularioAlumnoMatricula from "./FormularioAlumnoMatricula";
import MovimientoMatricula from "./MovimientoMatricula";

export default function GestionAlumnoCursoMatricula({
  esAdmin,

  nuevoAlumno,
  setNuevoAlumno,

  previaSeleccionada,
  setPreviaSeleccionada,

  anioPrevia,
  setAnioPrevia,

  asignaturas,
  aniosMateria,

  agregarPrevia,
  eliminarPrevia,

  guardarAlumnoMatricula,
  limpiarFormulario,

  guardando,
  alumnoEditando,

  alumnoMoviendo,
  nuevoCurso,
  setNuevoCurso,
  nuevoTurno,
  setNuevoTurno,

  cursosManana,
  cursosTarde,

  moverAlumno,
  setAlumnoMoviendo,

  estilos,
}) {
  const {
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
  } = estilos;

  return (
    <>
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
    </>
  );
}