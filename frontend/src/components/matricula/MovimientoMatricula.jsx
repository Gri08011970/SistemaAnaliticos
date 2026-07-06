export default function MovimientoMatricula({
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
  if (!alumnoMoviendo) return null;

  return (
    <div id="movimiento-matricula" style={estilos.bloqueMovimiento}>
      <h4>🔁 Movimiento de matrícula</h4>

      <p>
        {alumnoMoviendo.apellido}, {alumnoMoviendo.nombre}
      </p>

      <select
        value={nuevoCurso}
        onChange={(e) => setNuevoCurso(e.target.value)}
        style={estilos.inputAlumno}
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
        style={estilos.inputAlumno}
      >
        <option value="Mañana">Mañana</option>
        <option value="Tarde">Tarde</option>
      </select>

      <button
        style={estilos.botonAgregarPrevia}
        onClick={moverAlumno}
      >
        Mover estudiante
      </button>

      <button
        style={estilos.botonVolver}
        onClick={() => setAlumnoMoviendo(null)}
      >
        Cancelar movimiento
      </button>
    </div>
  );
}