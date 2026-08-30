export default function BotonesHerramientasMatricula({
  setVerPlanillaPrevias,
  setMateriaExamen,
  setAnioExamen,
  setTurnoExamen,
  setMostrarRelevamiento,
  setVerRecursantes,
}) {
  const estiloContenedor = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    width: "100%",
    maxWidth: "900px",
    margin: "24px auto 18px",
  };

  const estiloTarjeta = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "215px",
    padding: "24px 20px 20px",
    background: "#ffffff",
    border: "2px solid #b9d5ef",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(30, 58, 95, 0.08)",
    textAlign: "center",
  };

  const estiloIcono = {
    fontSize: "34px",
    marginBottom: "8px",
  };

  const estiloTitulo = {
    color: "#123b6d",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 10px",
  };

  const estiloDescripcion = {
    color: "#607080",
    fontSize: "15px",
    lineHeight: "1.5",
    margin: "0 0 20px",
    flex: 1,
  };

  const estiloBotonEntrar = {
    minWidth: "120px",
    padding: "9px 20px",
    border: "none",
    borderRadius: "10px",
    background: "#15978f",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(21, 151, 143, 0.18)",
  };

  return (
    <div style={estiloContenedor}>
      {/* PREVIAS */}
      <div style={estiloTarjeta}>
        <div>
          <div style={estiloIcono}>📋</div>

          <h3 style={estiloTitulo}>
            Planilla de Previas
          </h3>

          <p style={estiloDescripcion}>
            Consultá y generá planillas de examen de asignaturas pendientes.
          </p>
        </div>

        <button
          type="button"
          style={estiloBotonEntrar}
          onClick={() => {
            setVerPlanillaPrevias(true);
            setMateriaExamen("");
            setAnioExamen("");
            setTurnoExamen("");
          }}
        >
          Entrar
        </button>
      </div>

      {/* RELEVAMIENTO */}
      <div style={estiloTarjeta}>
        <div>
          <div style={estiloIcono}>📊</div>

          <h3 style={estiloTitulo}>
            Relevamiento
          </h3>

          <p style={estiloDescripcion}>
            Consultá indicadores institucionales para Inspección y cuadernillo.
          </p>
        </div>

        <button
          type="button"
          style={estiloBotonEntrar}
          onClick={() => {
            setMostrarRelevamiento(true);
          }}
        >
          Entrar
        </button>
      </div>

      {/* RECURSANTES */}
      <div style={estiloTarjeta}>
        <div>
          <div style={estiloIcono}>🔁</div>

          <h3 style={estiloTitulo}>
            Estudiantes recursantes
          </h3>

          <p style={estiloDescripcion}>
            Consultá el listado institucional de estudiantes recursantes.
          </p>
        </div>

        <button
          type="button"
          style={estiloBotonEntrar}
          onClick={() => {
            setVerRecursantes(true);
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}