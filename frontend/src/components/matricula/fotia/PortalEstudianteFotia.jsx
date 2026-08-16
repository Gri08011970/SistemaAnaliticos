import { useEffect, useState } from "react";
import AulaAsignaturaFotia from "./AulaAsignaturaFotia";

export default function PortalEstudianteFotia({
  alumnoId,
  nombreUsuario,
  cerrarSesion,
}) {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarAsignaturas, setMostrarAsignaturas] = useState(false);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tokenUsuario");

    fetch("/api/fotia/mi-espacio/asignaturas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || "No se pudieron cargar tus asignaturas.",
          );
        }

        return datos;
      })
      .then((datos) => {
        setInscripciones(
          Array.isArray(datos.inscripciones) ? datos.inscripciones : [],
        );
      })
      .catch((error) => {
        console.error("Error al cargar asignaturas del estudiante:", error);

        setError(error.message || "No se pudo conectar con el servidor.");

        setInscripciones([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (asignaturaSeleccionada) {
    return (
      <AulaAsignaturaFotia
        inscripcion={asignaturaSeleccionada}
        volver={() => setAsignaturaSeleccionada(null)}
      />
    );
  }

  function obtenerNombreDocente(docente) {
    if (!docente) {
      return "Sin docente asignado";
    }

    const apellido = docente.apellido || "";
    const nombre = docente.nombre || "";

    const nombreCompleto = `${apellido} ${nombre}`.trim();

    return nombreCompleto || "Sin docente asignado";
  }

  function obtenerPeriodo(periodo) {
    if (!periodo) {
      return "Sin período informado";
    }

    if (periodo.nombre && periodo.cicloLectivo) {
      return `${periodo.nombre} - ${periodo.cicloLectivo}`;
    }

    return periodo.nombre || periodo.cicloLectivo || "Sin período informado";
  }

  function obtenerEstado(inscripcion) {
    return inscripcion.estado || "Incorporada";
  }

  function obtenerOrigen(inscripcion) {
    if (inscripcion.tipoOrigen === "Previa") {
      return "Asignatura previa";
    }

    if (inscripcion.tipoOrigen === "En curso") {
      return "Asignatura del año en curso";
    }

    return inscripcion.tipoOrigen || "Fortalecimiento";
  }

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <div style={encabezado}>
          <div>
            <div style={etiqueta}>PORTAL ESTUDIANTIL</div>

            <h1 style={titulo}>📚 Mi espacio FOTIA</h1>

            <p style={subtitulo}>
              Programa Institucional de Fortalecimiento de Trayectorias
              Educativas
            </p>
          </div>

          <div style={tarjetaUsuario}>
            <strong style={nombre}>{nombreUsuario}</strong>

            <span style={insignia}>Estudiante</span>

            <button type="button" onClick={cerrarSesion} style={botonSalir}>
              🚪 Cerrar sesión
            </button>
          </div>
        </div>

        <div style={bienvenida}>
          <div style={iconoBienvenida}>👋</div>

          <div>
            <h2 style={tituloBienvenida}>
              Bienvenido/a a tu espacio de fortalecimiento
            </h2>

            <p style={textoBienvenida}>
              Desde aquí vas a poder consultar las asignaturas en las que
              participás, materiales, actividades, videos, fechas de entrega y
              propuestas de acompañamiento pedagógico.
            </p>
          </div>
        </div>

        <div style={grilla}>
          <div style={tarjeta}>
            <div style={iconoTarjeta}>📚</div>

            <h3 style={tituloTarjeta}>Mis asignaturas</h3>

            <p style={textoTarjeta}>
              Consultá los espacios en los que estás realizando fortalecimiento.
            </p>

            <button
              type="button"
              onClick={() =>
                setMostrarAsignaturas((valorActual) => !valorActual)
              }
              disabled={cargando}
              style={cargando ? botonDeshabilitado : botonActivo}
            >
              {cargando
                ? "Cargando..."
                : mostrarAsignaturas
                  ? "Ocultar asignaturas"
                  : `Ver mis asignaturas (${inscripciones.length})`}
            </button>
          </div>

          <div style={tarjeta}>
            <div style={iconoTarjeta}>📄</div>

            <h3 style={tituloTarjeta}>Materiales</h3>

            <p style={textoTarjeta}>
              Accedé a apuntes, documentos y recursos preparados por tus
              docentes.
            </p>

            <button type="button" disabled style={botonDeshabilitado}>
              Próximamente
            </button>
          </div>

          <div style={tarjeta}>
            <div style={iconoTarjeta}>🎥</div>

            <h3 style={tituloTarjeta}>Videos y explicaciones</h3>

            <p style={textoTarjeta}>
              Encontrá explicaciones y recursos audiovisuales para acompañar tu
              aprendizaje.
            </p>

            <button type="button" disabled style={botonDeshabilitado}>
              Próximamente
            </button>
          </div>

          <div style={tarjeta}>
            <div style={iconoTarjeta}>📝</div>

            <h3 style={tituloTarjeta}>Actividades</h3>

            <p style={textoTarjeta}>
              Revisá las propuestas de trabajo y las fechas de entrega de cada
              asignatura.
            </p>

            <button type="button" disabled style={botonDeshabilitado}>
              Próximamente
            </button>
          </div>
        </div>

        {error && <div style={mensajeError}>⚠️ {error}</div>}

        {mostrarAsignaturas && (
          <section style={seccionAsignaturas}>
            <div style={encabezadoAsignaturas}>
              <div>
                <div style={etiquetaSeccion}>TRAYECTORIA FOTIA</div>

                <h2 style={tituloSeccion}>📚 Mis asignaturas</h2>

                <p style={subtituloSeccion}>
                  Estos son los espacios de fortalecimiento en los que
                  participás actualmente.
                </p>
              </div>

              <div style={contadorAsignaturas}>
                <strong>{inscripciones.length}</strong>

                <span>
                  {inscripciones.length === 1 ? "asignatura" : "asignaturas"}
                </span>
              </div>
            </div>

            {inscripciones.length === 0 ? (
              <div style={sinAsignaturas}>
                <div style={iconoVacio}>📭</div>

                <strong>No tenés asignaturas activas en FOTIA.</strong>

                <span>
                  Cuando seas incorporado/a a un espacio de fortalecimiento,
                  aparecerá acá.
                </span>
              </div>
            ) : (
              <div style={grillaAsignaturas}>
                {inscripciones.map((inscripcion) => (
                  <article key={inscripcion._id} style={tarjetaAsignatura}>
                    <div style={encabezadoTarjetaAsignatura}>
                      <div style={iconoAsignatura}>📘</div>

                      <div>
                        <div style={etiquetaOrigen}>
                          {obtenerOrigen(inscripcion)}
                        </div>

                        <h3 style={nombreAsignatura}>
                          {inscripcion.asignatura || "Asignatura"}
                        </h3>
                      </div>
                    </div>

                    <div style={datosAsignatura}>
                      <div style={filaDato}>
                        <span style={etiquetaDato}>👩‍🏫 Docente</span>

                        <strong style={valorDato}>
                          {obtenerNombreDocente(inscripcion.docenteId)}
                        </strong>
                      </div>

                      <div style={filaDato}>
                        <span style={etiquetaDato}>📅 Período</span>

                        <strong style={valorDato}>
                          {obtenerPeriodo(inscripcion.periodoId)}
                        </strong>
                      </div>

                      <div style={filaDato}>
                        <span style={etiquetaDato}>📌 Estado</span>

                        <span style={insigniaEstado}>
                          {obtenerEstado(inscripcion)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAsignaturaSeleccionada(inscripcion)}
                      style={botonIngresarAsignatura}
                    >
                      Entrar al espacio →
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {alumnoId && (
          <div style={estadoConexion}>
            ✅ Cuenta vinculada correctamente con tu trayectoria escolar.
          </div>
        )}
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f4f8fb 0%, #eef7f4 100%)",
  padding: "32px 20px",
  fontFamily: "Arial, sans-serif",
};

const contenedor = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const encabezado = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "24px",
  marginBottom: "28px",
  flexWrap: "wrap",
};

const etiqueta = {
  fontSize: "12px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#5f7280",
};

const titulo = {
  margin: "6px 0 4px",
  color: "#173f68",
  fontSize: "34px",
};

const subtitulo = {
  margin: 0,
  color: "#5f6f7a",
  fontSize: "15px",
};

const tarjetaUsuario = {
  background: "#ffffff",
  border: "2px solid #c7dde3",
  borderRadius: "18px",
  padding: "14px 18px",
  boxShadow: "0 8px 20px rgba(22,58,95,0.10)",
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  minWidth: "220px",
};

const nombre = {
  color: "#173f68",
};

const insignia = {
  width: "fit-content",
  background: "#f3e8ff",
  color: "#6b21a8",
  borderRadius: "999px",
  padding: "4px 9px",
  fontSize: "12px",
  fontWeight: "800",
};

const botonSalir = {
  marginTop: "4px",
  border: "none",
  background: "#60788a",
  color: "#ffffff",
  borderRadius: "999px",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: "700",
};

const bienvenida = {
  display: "flex",
  gap: "18px",
  alignItems: "center",
  background: "#ffffff",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.08)",
  marginBottom: "26px",
};

const iconoBienvenida = {
  width: "58px",
  height: "58px",
  borderRadius: "16px",
  background: "#e8f4f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  flexShrink: 0,
};

const tituloBienvenida = {
  margin: "0 0 8px",
  color: "#173f68",
  fontSize: "22px",
};

const textoBienvenida = {
  margin: 0,
  color: "#536575",
  lineHeight: 1.6,
};

const grilla = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const tarjeta = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 7px 16px rgba(22,58,95,0.07)",
};

const iconoTarjeta = {
  fontSize: "30px",
  marginBottom: "12px",
};

const tituloTarjeta = {
  margin: "0 0 8px",
  color: "#173f68",
  fontSize: "18px",
};

const textoTarjeta = {
  color: "#5f6f7a",
  lineHeight: 1.5,
  minHeight: "68px",
};

const botonActivo = {
  width: "100%",
  border: "none",
  borderRadius: "999px",
  padding: "9px 12px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};

const botonDeshabilitado = {
  width: "100%",
  border: "none",
  borderRadius: "999px",
  padding: "9px 12px",
  background: "#e5ecef",
  color: "#7b8b94",
  fontWeight: "700",
  cursor: "not-allowed",
};

const mensajeError = {
  marginTop: "20px",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "#fff4f4",
  border: "1px solid #efb6b6",
  color: "#a52a2a",
  fontWeight: "700",
  textAlign: "center",
};

const seccionAsignaturas = {
  marginTop: "26px",
  background: "#ffffff",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.08)",
};

const encabezadoAsignaturas = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
  marginBottom: "22px",
};

const etiquetaSeccion = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#64808a",
};

const tituloSeccion = {
  margin: "5px 0",
  color: "#173f68",
  fontSize: "25px",
};

const subtituloSeccion = {
  margin: 0,
  color: "#5f6f7a",
  lineHeight: 1.5,
};

const contadorAsignaturas = {
  minWidth: "100px",
  padding: "12px 16px",
  borderRadius: "16px",
  background: "#edf7f5",
  border: "1px solid #b9ddd6",
  color: "#0f766e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const sinAsignaturas = {
  padding: "28px",
  borderRadius: "16px",
  background: "#f6f9fa",
  border: "1px dashed #c6d7dd",
  color: "#5f6f7a",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  textAlign: "center",
};

const iconoVacio = {
  fontSize: "34px",
};

const grillaAsignaturas = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const tarjetaAsignatura = {
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "18px",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbfc 100%)",
  boxShadow: "0 6px 14px rgba(22,58,95,0.06)",
};

const encabezadoTarjetaAsignatura = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
};

const iconoAsignatura = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "#e8f4f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
  flexShrink: 0,
};

const etiquetaOrigen = {
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase",
  color: "#6b7f8b",
  marginBottom: "3px",
};

const nombreAsignatura = {
  margin: 0,
  color: "#173f68",
  fontSize: "19px",
};

const datosAsignatura = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "16px",
};

const filaDato = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  paddingBottom: "8px",
  borderBottom: "1px solid #edf2f4",
};

const etiquetaDato = {
  fontSize: "12px",
  color: "#6b7f8b",
  fontWeight: "700",
};

const valorDato = {
  color: "#304d63",
  fontSize: "14px",
};

const insigniaEstado = {
  width: "fit-content",
  background: "#eaf7ef",
  color: "#286440",
  borderRadius: "999px",
  padding: "4px 9px",
  fontSize: "12px",
  fontWeight: "800",
};

const botonIngresarAsignatura = {
  width: "100%",
  border: "none",
  borderRadius: "999px",
  padding: "10px 14px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};

const estadoConexion = {
  marginTop: "22px",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "#eaf7ef",
  border: "1px solid #b8ddc4",
  color: "#286440",
  fontWeight: "700",
  textAlign: "center",
};
