import { useEffect, useState } from "react";
import GestionAulaDocenteFotia from "./GestionAulaDocenteFotia";

export default function PortalDocenteFotia({ nombreUsuario, cerrarSesion }) {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tokenUsuario");

    fetch("/api/fotia/mi-espacio-docente", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || "No se pudieron cargar tus espacios FOTIA.",
          );
        }

        return datos;
      })
      .then((datos) => {
        setEspacios(Array.isArray(datos.espacios) ? datos.espacios : []);
      })
      .catch((error) => {
        console.error("Error al cargar espacios del docente:", error);

        setError(error.message || "No se pudo conectar con el servidor.");

        setEspacios([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (espacioSeleccionado) {
    return (
      <GestionAulaDocenteFotia
        espacio={espacioSeleccionado}
        volver={() => setEspacioSeleccionado(null)}
      />
    );
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

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <header style={encabezado}>
          <div>
            <div style={etiqueta}>PORTAL DOCENTE</div>

            <h1 style={titulo}>👩‍🏫 Mi espacio FOTIA</h1>

            <p style={subtitulo}>
              Gestión pedagógica de los espacios de fortalecimiento.
            </p>
          </div>

          <div style={tarjetaUsuario}>
            <strong style={nombre}>{nombreUsuario}</strong>

            <span style={insignia}>Docente</span>

            <button type="button" onClick={cerrarSesion} style={botonSalir}>
              🚪 Cerrar sesión
            </button>
          </div>
        </header>

        <section style={bienvenida}>
          <div style={iconoBienvenida}>👩‍🏫</div>

          <div>
            <h2 style={tituloBienvenida}>Bienvenido/a a tu espacio docente</h2>

            <p style={textoBienvenida}>
              Desde aquí vas a poder gestionar tus asignaturas de FOTIA,
              preparar materiales, compartir videos y proponer actividades para
              tus estudiantes.
            </p>
          </div>
        </section>

        <section style={seccion}>
          <div style={cabeceraSeccion}>
            <div>
              <div style={etiqueta}>TRAYECTORIAS FOTIA</div>

              <h2 style={tituloSeccion}>📚 Mis espacios</h2>

              <p style={textoSeccion}>
                Estos son los espacios de fortalecimiento que tenés asignados
                actualmente.
              </p>
            </div>

            {!cargando && !error && (
              <div style={contador}>
                <strong style={numeroContador}>{espacios.length}</strong>

                <span>{espacios.length === 1 ? "espacio" : "espacios"}</span>
              </div>
            )}
          </div>

          {cargando && (
            <div style={estadoPreparando}>
              <div style={iconoPreparando}>⏳</div>

              <strong>Cargando tus espacios...</strong>
            </div>
          )}

          {error && <div style={mensajeError}>⚠️ {error}</div>}

          {!cargando && !error && espacios.length === 0 && (
            <div style={estadoPreparando}>
              <div style={iconoPreparando}>📭</div>

              <strong>No tenés espacios FOTIA asignados.</strong>

              <span style={textoPreparando}>
                Cuando seas asignado/a como docente de una materia, aparecerá
                automáticamente acá.
              </span>
            </div>
          )}

          {!cargando && !error && espacios.length > 0 && (
            <div style={grillaEspacios}>
              {espacios.map((espacio, indice) => (
                <article
                  key={`${espacio.asignatura}-${espacio.curso}-${indice}`}
                  style={tarjetaEspacio}
                >
                  <div style={cabeceraTarjeta}>
                    <div style={iconoAsignatura}>📘</div>

                    <div>
                      <div style={etiquetaMateria}>
                        ESPACIO DE FORTALECIMIENTO
                      </div>

                      <h3 style={nombreAsignatura}>{espacio.asignatura}</h3>
                    </div>
                  </div>

                  <div style={datosEspacio}>
                    <div style={filaDato}>
                      <span style={etiquetaDato}>🏫 Curso</span>

                      <strong style={valorDato}>
                        {espacio.curso || "Sin curso"}
                      </strong>
                    </div>

                    <div style={filaDato}>
                      <span style={etiquetaDato}>👥 Estudiantes</span>

                      <strong style={valorDato}>
                        {espacio.cantidadEstudiantes}
                      </strong>
                    </div>

                    <div style={filaDato}>
                      <span style={etiquetaDato}>📅 Período</span>

                      <strong style={valorDato}>
                        {obtenerPeriodo(espacio.periodoId)}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={botonGestionar}
                    onClick={() => setEspacioSeleccionado(espacio)}
                  >
                    Gestionar aula →
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
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
  background: "#e0f2fe",
  color: "#075985",
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

const seccion = {
  background: "#ffffff",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.08)",
};

const cabeceraSeccion = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "22px",
};

const tituloSeccion = {
  margin: "5px 0",
  color: "#173f68",
  fontSize: "26px",
};

const textoSeccion = {
  margin: 0,
  color: "#637782",
};

const contador = {
  minWidth: "95px",
  background: "#edf7f5",
  border: "1px solid #b9ddd6",
  borderRadius: "16px",
  padding: "10px 16px",
  color: "#0f766e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const numeroContador = {
  fontSize: "22px",
};

const estadoPreparando = {
  border: "1px dashed #aacbd4",
  borderRadius: "16px",
  background: "#f7fbfc",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "8px",
  color: "#31556c",
};

const iconoPreparando = {
  fontSize: "30px",
};

const textoPreparando = {
  color: "#637782",
  lineHeight: 1.5,
  maxWidth: "600px",
};

const mensajeError = {
  padding: "14px 18px",
  borderRadius: "14px",
  background: "#fff4f4",
  border: "1px solid #efb6b6",
  color: "#a52a2a",
  fontWeight: "700",
  textAlign: "center",
};

const grillaEspacios = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
};

const tarjetaEspacio = {
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbfc 100%)",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 7px 16px rgba(22,58,95,0.07)",
};

const cabeceraTarjeta = {
  display: "flex",
  gap: "13px",
  alignItems: "center",
  marginBottom: "18px",
};

const iconoAsignatura = {
  width: "52px",
  height: "52px",
  borderRadius: "15px",
  background: "#e8f4f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  flexShrink: 0,
};

const etiquetaMateria = {
  fontSize: "10px",
  letterSpacing: "0.8px",
  color: "#647c88",
  fontWeight: "800",
};

const nombreAsignatura = {
  margin: "4px 0 0",
  color: "#173f68",
  fontSize: "22px",
};

const datosEspacio = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "18px",
};

const filaDato = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  paddingBottom: "9px",
  borderBottom: "1px solid #edf2f4",
};

const etiquetaDato = {
  color: "#6b7f8b",
  fontSize: "13px",
};

const valorDato = {
  color: "#304d63",
  textAlign: "right",
};

const botonGestionar = {
  width: "100%",
  border: "none",
  borderRadius: "999px",
  padding: "10px 14px",
  background: "#0f766e",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};
