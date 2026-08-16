export default function AulaAsignaturaFotia({
  inscripcion,
  volver,
}) {
  const asignatura =
    inscripcion?.asignatura || "Asignatura";

  const docente = inscripcion?.docenteId
    ? `${inscripcion.docenteId.apellido || ""} ${
        inscripcion.docenteId.nombre || ""
      }`.trim()
    : "Sin docente asignado";

  const periodo = inscripcion?.periodoId
    ? `${
        inscripcion.periodoId.nombre || ""
      } ${
        inscripcion.periodoId.cicloLectivo
          ? `- ${inscripcion.periodoId.cicloLectivo}`
          : ""
      }`.trim()
    : "Sin período informado";

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <button
          type="button"
          onClick={volver}
          style={botonVolver}
        >
          ← Volver a Mis asignaturas
        </button>

        <section style={encabezado}>
          <div style={iconoPrincipal}>
            📘
          </div>

          <div>
            <div style={etiqueta}>
              ESPACIO DE FORTALECIMIENTO
            </div>

            <h1 style={titulo}>
              {asignatura}
            </h1>

            <p style={subtitulo}>
              Tu espacio de acompañamiento,
              materiales y actividades.
            </p>
          </div>
        </section>

        <section style={resumen}>
          <div style={dato}>
            <span style={etiquetaDato}>
              👩‍🏫 Docente
            </span>

            <strong style={valorDato}>
              {docente}
            </strong>
          </div>

          <div style={dato}>
            <span style={etiquetaDato}>
              📅 Período
            </span>

            <strong style={valorDato}>
              {periodo}
            </strong>
          </div>

          <div style={dato}>
            <span style={etiquetaDato}>
              📌 Estado
            </span>

            <strong style={estado}>
              {inscripcion?.estado ||
                "Incorporada"}
            </strong>
          </div>
        </section>

        <section style={grilla}>
          <article style={tarjeta}>
            <div style={iconoTarjeta}>
              📄
            </div>

            <h2 style={tituloTarjeta}>
              Materiales
            </h2>

            <p style={textoTarjeta}>
              Apuntes, guías, documentos y
              recursos preparados para esta
              asignatura.
            </p>

            <button
              type="button"
              disabled
              style={botonDeshabilitado}
            >
              Próximamente
            </button>
          </article>

          <article style={tarjeta}>
            <div style={iconoTarjeta}>
              🎥
            </div>

            <h2 style={tituloTarjeta}>
              Videos y explicaciones
            </h2>

            <p style={textoTarjeta}>
              Explicaciones, videos y recursos
              audiovisuales para acompañar tu
              aprendizaje.
            </p>

            <button
              type="button"
              disabled
              style={botonDeshabilitado}
            >
              Próximamente
            </button>
          </article>

          <article style={tarjeta}>
            <div style={iconoTarjeta}>
              📝
            </div>

            <h2 style={tituloTarjeta}>
              Actividades
            </h2>

            <p style={textoTarjeta}>
              Propuestas de trabajo,
              consignas y actividades de
              fortalecimiento.
            </p>

            <button
              type="button"
              disabled
              style={botonDeshabilitado}
            >
              Próximamente
            </button>
          </article>

          <article style={tarjeta}>
            <div style={iconoTarjeta}>
              📅
            </div>

            <h2 style={tituloTarjeta}>
              Fechas importantes
            </h2>

            <p style={textoTarjeta}>
              Entregas, encuentros y fechas
              relevantes de esta asignatura.
            </p>

            <button
              type="button"
              disabled
              style={botonDeshabilitado}
            >
              Próximamente
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f4f8fb 0%, #eef7f4 100%)",
  padding: "28px 20px",
  fontFamily: "Arial, sans-serif",
};

const contenedor = {
  maxWidth: "1050px",
  margin: "0 auto",
};

const botonVolver = {
  border: "1px solid #bfd5dc",
  background: "#ffffff",
  color: "#31556c",
  borderRadius: "999px",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "700",
  marginBottom: "18px",
};

const encabezado = {
  display: "flex",
  gap: "18px",
  alignItems: "center",
  background: "#ffffff",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  padding: "24px",
  boxShadow:
    "0 10px 24px rgba(22,58,95,0.08)",
  marginBottom: "20px",
};

const iconoPrincipal = {
  width: "70px",
  height: "70px",
  borderRadius: "18px",
  background: "#e8f4f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "34px",
  flexShrink: 0,
};

const etiqueta = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#64808a",
};

const titulo = {
  margin: "5px 0",
  color: "#173f68",
  fontSize: "30px",
};

const subtitulo = {
  margin: 0,
  color: "#5f6f7a",
};

const resumen = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginBottom: "22px",
};

const dato = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const etiquetaDato = {
  fontSize: "12px",
  color: "#6b7f8b",
  fontWeight: "700",
};

const valorDato = {
  color: "#304d63",
};

const estado = {
  width: "fit-content",
  background: "#eaf7ef",
  color: "#286440",
  borderRadius: "999px",
  padding: "4px 9px",
  fontSize: "12px",
};

const grilla = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "18px",
};

const tarjeta = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "22px",
  boxShadow:
    "0 7px 16px rgba(22,58,95,0.07)",
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
  minHeight: "92px",
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