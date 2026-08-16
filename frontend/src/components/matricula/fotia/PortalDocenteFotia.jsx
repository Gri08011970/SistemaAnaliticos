export default function PortalDocenteFotia({
  nombreUsuario,
  cerrarSesion,
}) {
  return (
    <div style={pagina}>
      <div style={contenedor}>
        <header style={encabezado}>
          <div>
            <div style={etiqueta}>
              PORTAL DOCENTE
            </div>

            <h1 style={titulo}>
              👩‍🏫 Mi espacio FOTIA
            </h1>

            <p style={subtitulo}>
              Gestión pedagógica de los espacios de
              fortalecimiento.
            </p>
          </div>

          <div style={tarjetaUsuario}>
            <strong style={nombre}>
              {nombreUsuario}
            </strong>

            <span style={insignia}>
              Docente
            </span>

            <button
              type="button"
              onClick={cerrarSesion}
              style={botonSalir}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </header>

        <section style={bienvenida}>
          <div style={iconoBienvenida}>
            👩‍🏫
          </div>

          <div>
            <h2 style={tituloBienvenida}>
              Bienvenido/a a tu espacio docente
            </h2>

            <p style={textoBienvenida}>
              Desde aquí vas a poder gestionar tus
              asignaturas de FOTIA, preparar materiales,
              compartir videos y proponer actividades para
              tus estudiantes.
            </p>
          </div>
        </section>

        <section style={seccion}>
          <div style={cabeceraSeccion}>
            <div>
              <div style={etiqueta}>
                TRAYECTORIAS FOTIA
              </div>

              <h2 style={tituloSeccion}>
                📚 Mis espacios
              </h2>
            </div>
          </div>

          <div style={estadoPreparando}>
            <div style={iconoPreparando}>✨</div>

            <strong>
              Tu espacio docente está listo.
            </strong>

            <span style={textoPreparando}>
              En el próximo paso vamos a cargar aquí
              únicamente las asignaturas que tenés
              asignadas en FOTIA.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f4f8fb 0%, #eef7f4 100%)",
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
  marginBottom: "20px",
};

const tituloSeccion = {
  margin: "5px 0 0",
  color: "#173f68",
  fontSize: "26px",
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