export default function BotonesHerramientasMatricula({
  verPlanillaPrevias,
  setVerPlanillaPrevias,
  setMateriaExamen,
  setAnioExamen,
  setTurnoExamen,
  mostrarRelevamiento,
  setMostrarRelevamiento,
  verRecursantes,
  setVerRecursantes,
  imprimirRecursantes,
  estilos,
}) {
  const estiloContenedor = {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "18px",
    marginBottom: "18px",
  };

  const estiloBoton = {
    ...estilos.botonImprimir,
    flex: "0 1 210px",
  };

  return (
    <div style={estiloContenedor}>
      <button
        type="button"
        style={estiloBoton}
        onClick={() => {
          setVerPlanillaPrevias(!verPlanillaPrevias);
          setMateriaExamen("");
          setAnioExamen("");
          setTurnoExamen("");
        }}
      >
        📝{" "}
        {verPlanillaPrevias
          ? "Ocultar Planilla Previas"
          : "Ver Planilla Previas"}
      </button>

      <button
        type="button"
        style={estiloBoton}
        onClick={() =>
          setMostrarRelevamiento(!mostrarRelevamiento)
        }
      >
        {mostrarRelevamiento
          ? "📊 Ocultar relevamiento"
          : "📊 Mostrar relevamiento"}
      </button>

      <button
        type="button"
        style={estiloBoton}
        onClick={() =>
          setVerRecursantes(!verRecursantes)
        }
      >
        🔁{" "}
        {verRecursantes
          ? "Ocultar recursantes"
          : "Ver recursantes"}
      </button>

      {verRecursantes && (
        <button
          type="button"
          style={{
            ...estiloBoton,
            backgroundColor: "#f5f0fb",
            border: "2px solid #d4c3e7",
            color: "#5e3f78",
          }}
          onClick={imprimirRecursantes}
        >
          🖨️ Imprimir recursantes
        </button>
      )}
    </div>
  );
} 