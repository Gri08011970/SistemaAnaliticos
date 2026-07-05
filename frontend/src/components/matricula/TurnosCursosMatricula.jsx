export default function TurnosCursosMatricula({
  cursosManana,
  cursosTarde,
  mostrarTurnoManana,
  setMostrarTurnoManana,
  mostrarTurnoTarde,
  setMostrarTurnoTarde,
  fotosPreceptores,
  contarAlumnos,
  setCursoSeleccionado,
  estilos,
}) {
  const renderTurno = ({ titulo, turno, cursos, abierto, setAbierto }) => (
    <div style={estilos.bloqueTurno}>
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          ...estilos.tituloTurno,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>📚 {titulo}</span>

        <span style={{ fontSize: "18px" }}>{abierto ? "▼" : "▶"}</span>
      </div>

      {abierto && (
        <div style={estilos.grillaCursos}>
          {cursos.map((curso) => (
            <div
              key={curso}
              style={{
                ...estilos.tarjetaCurso,
                backgroundImage: fotosPreceptores[`${curso}-${turno}`]
                  ? `linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.50)), url(${fotosPreceptores[`${curso}-${turno}`]})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h4>{curso}</h4>

              <p style={estilos.textoCantidad}>
                {contarAlumnos(curso, turno)} estudiantes
              </p>

              <button
                style={estilos.botonCurso}
                onClick={() => setCursoSeleccionado({ curso, turno })}
              >
                Ver curso
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={estilos.contenedorTurnos}>
      {renderTurno({
        titulo: "Turno Mañana",
        turno: "Mañana",
        cursos: cursosManana,
        abierto: mostrarTurnoManana,
        setAbierto: setMostrarTurnoManana,
      })}

      {renderTurno({
        titulo: "Turno Tarde",
        turno: "Tarde",
        cursos: cursosTarde,
        abierto: mostrarTurnoTarde,
        setAbierto: setMostrarTurnoTarde,
      })}
    </div>
  );
}