export default function FichaEstudianteMatricula({
  alumnoSeleccionado,
  formatearDNI,
  calcularEdadAl30Junio,
  setAlumnoSeleccionado,
  estilos,
}) {
  if (!alumnoSeleccionado) return null;

  const previasReales =
    alumnoSeleccionado.materiasPendientes?.filter(
      (previa) => previa.asignatura !== "----------"
    ) || [];

  return (
    <div id="ficha-estudiante" style={estilos.detalleCurso}>
      <div style={estilos.tituloFicha}>
        <h2 style={{ margin: 0 }}>📖 Ficha del estudiante</h2>
      </div>

      <div style={estilos.grillaFicha}>
        <div style={estilos.campoFicha}>
          <strong>Apellido y nombre</strong>
          <br />
          <span style={estilos.nombreFicha}>
            {alumnoSeleccionado.apellido || ""}{" "}
            {alumnoSeleccionado.nombre || ""}
          </span>
        </div>

        <div style={estilos.campoFicha}>
          <strong>DNI</strong>
          <p>{formatearDNI(alumnoSeleccionado.dni)}</p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Curso</strong>
          <p>{alumnoSeleccionado.curso}</p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Turno</strong>
          <p>{alumnoSeleccionado.turno}</p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Legajo</strong>
          <p>
            {alumnoSeleccionado.legajoNumero && alumnoSeleccionado.legajoAnio
              ? `${alumnoSeleccionado.legajoNumero}/${alumnoSeleccionado.legajoAnio}`
              : "Sin cargar"}
          </p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Libro/Folio</strong>
          <p>
            {alumnoSeleccionado.libroMatriz && alumnoSeleccionado.folioMatriz
              ? `${alumnoSeleccionado.libroMatriz}/${alumnoSeleccionado.folioMatriz}`
              : alumnoSeleccionado.folioMatriz
                ? alumnoSeleccionado.folioMatriz
                : alumnoSeleccionado.libroMatriz
                  ? alumnoSeleccionado.libroMatriz
                  : "Sin cargar"}
          </p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Edad</strong>
          <p>
            {alumnoSeleccionado.fechaNacimiento
              ? calcularEdadAl30Junio(alumnoSeleccionado.fechaNacimiento) +
                " años"
              : "Sin cargar"}
          </p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Condición final</strong>
          <p>{alumnoSeleccionado.condicionFinal || "-"}</p>
        </div>

        <div style={estilos.campoFicha}>
          <strong>Previas</strong>
          <p>
            {previasReales.length > 0
              ? previasReales
                  .map((previa) => `${previa.asignatura} (${previa.anio})`)
                  .join(", ")
              : "Ninguna"}
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          style={estilos.botonCerrarFicha}
          onClick={() => setAlumnoSeleccionado(null)}
        >
          Cerrar ficha
        </button>
      </div>
    </div>
  );
}