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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <button
        style={estilos.botonImprimir}
        onClick={() => {
          setVerPlanillaPrevias(!verPlanillaPrevias);
          setMateriaExamen("");
          setAnioExamen("");
          setTurnoExamen("");
        }}
      >
        📝 Ver Planilla Previas
      </button>

      <button
        style={estilos.botonImprimir}
        onClick={() => setMostrarRelevamiento(!mostrarRelevamiento)}
      >
        {mostrarRelevamiento
          ? "📊 Ocultar relevamiento"
          : "📊 Mostrar relevamiento"}
      </button>

      <button
        style={estilos.botonImprimir}
        onClick={() => setVerRecursantes(!verRecursantes)}
      >
        🔁 {verRecursantes ? "Ocultar recursantes" : "Ver recursantes"}
      </button>

      {verRecursantes && (
        <button style={estilos.botonImprimir} onClick={imprimirRecursantes}>
          🖨️ Imprimir recursantes
        </button>
      )}
    </div>
  );
}