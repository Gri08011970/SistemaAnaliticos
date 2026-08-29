import { imprimirDocumentacion } from "./impresiones/imprimirDocumentacion";

export default function DocumentacionMatricula({
  esAdmin,
  volverInicio,
  alumnosDocumentacion,
  totalDocumentacion,
  dniFisicoCompletos,
  partidasCompletas,
  analiticosCompletos,
  busquedaDocumentacion,
  setBusquedaDocumentacion,
  cursoDocumentacion,
  setCursoDocumentacion,
  turnoDocumentacion,
  setTurnoDocumentacion,
  cursosManana,
  cursosTarde,
  actualizarDocumentacion,
  formatearDNI,
  estilos,
}) {
  const {
    detalleCurso,
    botonVolver,
    tarjetaResumen,
    inputAlumno,
    botonImprimir,
    tabla,
    celda,
  } = estilos;

  const tablaContenedor = {
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "65vh",

    borderRadius: "14px",
    border: "1px solid #d6e4ea",
    backgroundColor: "white",
  };

  const celdaEncabezadoFija = {
    ...celda,
    position: "sticky",
    top: 0,
    zIndex: 3,

    background: "#eaf3f1",
    color: "#1e3a5f",
    fontWeight: "700",

    boxShadow: "0 1px 0 #cfdedb",
  };

  return (
    <div style={detalleCurso}>
      <button style={botonVolver} onClick={volverInicio}>
        Volver al inicio
      </button>

      <h2 style={{ color: "#1e3a5f", textAlign: "center" }}>
        📁 Documentación
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <div style={tarjetaResumen}>
          Total alumnos
          <br />
          <strong>{totalDocumentacion}</strong>
        </div>

        <div style={tarjetaResumen}>
          DNI físico
          <br />
          <strong>{dniFisicoCompletos}</strong>
        </div>

        <div style={tarjetaResumen}>
          Partidas
          <br />
          <strong>{partidasCompletas}</strong>
        </div>

        <div style={tarjetaResumen}>
          Analíticos
          <br />
          <strong>{analiticosCompletos}</strong>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "15px",
        }}
      >
        <input
          style={inputAlumno}
          placeholder="Buscar por apellido, nombre o DNI"
          value={busquedaDocumentacion}
          onChange={(e) => setBusquedaDocumentacion(e.target.value)}
        />

        <select
          style={inputAlumno}
          value={cursoDocumentacion}
          onChange={(e) => setCursoDocumentacion(e.target.value)}
        >
          <option value="">Todos los cursos</option>

          {[...cursosManana, ...cursosTarde].map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>

        <select
          style={inputAlumno}
          value={turnoDocumentacion}
          onChange={(e) => setTurnoDocumentacion(e.target.value)}
        >
          <option value="">Ambos turnos</option>
          <option value="Mañana">Turno Mañana</option>
          <option value="Tarde">Turno Tarde</option>
        </select>
      </div>

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
          style={{
            ...botonImprimir,
            minWidth: "220px",
            padding: "10px 18px",
            fontSize: "15px",
            fontWeight: "700",
          }}
          onClick={() => imprimirDocumentacion(alumnosDocumentacion)}
        >
          🖨️ Imprimir documentación
        </button>
      </div>

      <div style={tablaContenedor}>
        <table style={tabla}>
          <thead>
            <tr>
              <th style={celdaEncabezadoFija}>Curso</th>
              <th style={celdaEncabezadoFija}>Apellido y Nombre</th>
              <th style={celdaEncabezadoFija}>DNI</th>
              <th style={celdaEncabezadoFija}>Legajo</th>
              <th style={celdaEncabezadoFija}>DNI Físico</th>
              <th style={celdaEncabezadoFija}>Partida Nac.</th>
              <th style={celdaEncabezadoFija}>Analítico Parcial</th>
              <th style={celdaEncabezadoFija}>Observaciones</th>
            </tr>
          </thead>

          <tbody>
            {alumnosDocumentacion.map((alumno) => (
              <tr key={alumno._id}>
                <td style={celda}>{alumno.curso}</td>

                <td style={celda}>
                  {alumno.apellido}, {alumno.nombre}
                </td>

                <td style={celda}>{formatearDNI(alumno.dni)}</td>

                <td style={celda}>
                  {alumno.legajoNumero && alumno.legajoAnio
                    ? `${alumno.legajoNumero}/${alumno.legajoAnio}`
                    : "-"}
                </td>

                <td style={celda}>
                  <select
                    disabled={!esAdmin}
                    defaultValue={alumno.dniFisico || "NO"}
                    onChange={(e) =>
                      actualizarDocumentacion(
                        alumno,
                        "dniFisico",
                        e.target.value,
                      )
                    }
                  >
                    <option value="NO">🟥 NO</option>
                    <option value="SI">🟩 SÍ</option>
                  </select>
                </td>

                <td style={celda}>
                  <select
                    disabled={!esAdmin}
                    defaultValue={alumno.partidaNacimiento || "NO"}
                    onChange={(e) =>
                      actualizarDocumentacion(
                        alumno,
                        "partidaNacimiento",
                        e.target.value,
                      )
                    }
                  >
                    <option value="NO">🟥 NO</option>
                    <option value="SI">🟩 SÍ</option>
                  </select>
                </td>

                <td style={celda}>
                  <select
                    disabled={!esAdmin}
                    defaultValue={alumno.analiticoParcial || "-----"}
                    onChange={(e) =>
                      actualizarDocumentacion(
                        alumno,
                        "analiticoParcial",
                        e.target.value,
                      )
                    }
                  >
                    <option value="-----">⚪ -----</option>
                    <option value="SI">🟩 SÍ</option>
                    <option value="Debe">🟨 Debe</option>
                  </select>
                </td>

                <td style={celda}>
                  <input
                    disabled={!esAdmin}
                    style={{
                      ...inputAlumno,
                      width: "160px",
                    }}
                    placeholder="📝 Observación"
                    defaultValue={
                      alumno.observacionDocumentacion || ""
                    }
                    onBlur={(e) =>
                      actualizarDocumentacion(
                        alumno,
                        "observacionDocumentacion",
                        e.target.value,
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}