export default function AlertasInstitucionalesMatricula({
  alertaActiva,
  setAlertaActiva,
  alumnosSinLegajo,
  alumnosSinFechaNacimiento,
  alumnosConPrevias,
  alumnosConSobreedad,
  alumnosAlertaActiva,
  formatearDNI,
  calcularEdadAl30Junio,
  estilos,
}) {
  const {
    panelAlertas,
    grillaAlertas,
    tarjetaAlerta,
    detalleCurso,
    botonVolver,
    tabla,
    celda,
  } = estilos;

  const estiloTituloPanel = {
    color: "#1e3a5f",
    textAlign: "center",
    margin: "0 0 12px",
    fontSize: "21px",
    lineHeight: "1.2",
  };

  const estiloNombreAlerta = {
    color: "#665d70",
    fontSize: "17px",
    lineHeight: "1.15",
  };

  const estiloCantidadAlerta = {
    margin: "5px 0 0",
    color: "#665d70",
    fontSize: "18px",
    lineHeight: "1",
  };

  return (
    <>
      <div style={panelAlertas}>
        <h3 style={estiloTituloPanel}>
          🚨 Alertas institucionales
        </h3>

        <div style={grillaAlertas}>
          <div
            style={tarjetaAlerta}
            onClick={() => setAlertaActiva("sinLegajo")}
          >
            <strong style={estiloNombreAlerta}>
              Sin legajo
            </strong>

            <p style={estiloCantidadAlerta}>
              {alumnosSinLegajo.length}
            </p>
          </div>

          <div
            style={tarjetaAlerta}
            onClick={() => setAlertaActiva("sinFecha")}
          >
            <strong style={estiloNombreAlerta}>
              Sin fecha nacimiento
            </strong>

            <p style={estiloCantidadAlerta}>
              {alumnosSinFechaNacimiento.length}
            </p>
          </div>

          <div
            style={tarjetaAlerta}
            onClick={() => setAlertaActiva("previas")}
          >
            <strong style={estiloNombreAlerta}>
              Con previas
            </strong>

            <p style={estiloCantidadAlerta}>
              {alumnosConPrevias.length}
            </p>
          </div>

          <div
            style={tarjetaAlerta}
            onClick={() => setAlertaActiva("sobreedad")}
          >
            <strong style={estiloNombreAlerta}>
              Sobreedad
            </strong>

            <p style={estiloCantidadAlerta}>
              {alumnosConSobreedad.length}
            </p>
          </div>
        </div>
      </div>

      {alertaActiva && (
        <div style={detalleCurso}>
          <h3 style={{ color: "#1e3a5f" }}>
            🚨 Listado de alerta
          </h3>

          <button
            type="button"
            style={botonVolver}
            onClick={() => setAlertaActiva("")}
          >
            Cerrar alerta
          </button>

          <p>
            Cantidad:{" "}
            <strong>{alumnosAlertaActiva.length}</strong>
          </p>

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
              {alumnosAlertaActiva.map((alumno) => {
                const previasReales =
                  alumno.materiasPendientes?.filter(
                    (previa) =>
                      previa.asignatura &&
                      previa.asignatura !== "----------",
                  ) || [];

                return (
                  <tr key={alumno._id}>
                    <td style={celda}>
                      {alumno.apellido}, {alumno.nombre}
                    </td>

                    <td style={celda}>
                      {formatearDNI(alumno.dni)}
                    </td>

                    <td style={celda}>
                      {alumno.curso}
                    </td>

                    <td style={celda}>
                      {alumno.turno}
                    </td>

                    <td style={celda}>
                      {alumno.legajoNumero &&
                      alumno.legajoAnio
                        ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                        : "-"}
                    </td>

                    <td style={celda}>
                      {alertaActiva === "sinLegajo" &&
                        "Falta número o año de legajo"}

                      {alertaActiva === "sinFecha" &&
                        "Falta fecha de nacimiento"}

                      {alertaActiva === "previas" &&
                        previasReales
                          .map(
                            (previa) =>
                              `${previa.asignatura} (${previa.anio})`,
                          )
                          .join(", ")}

                      {alertaActiva === "sobreedad" &&
                        `${calcularEdadAl30Junio(
                          alumno.fechaNacimiento,
                        )} años`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}