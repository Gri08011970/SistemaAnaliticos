export default function BotonesHerramientasMatricula({
  setVerPlanillaPrevias,
  setMateriaExamen,
  setAnioExamen,
  setTurnoExamen,
  setMostrarRelevamiento,
  setVerRecursantes,
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
          setVerPlanillaPrevias(true);
          setMateriaExamen("");
          setAnioExamen("");
          setTurnoExamen("");
        }}
      >
        📝 Ver Previas
      </button>

      <button
        type="button"
        style={estiloBoton}
        onClick={() => {
          setMostrarRelevamiento(true);
        }}
      >
        📊 Mostrar relevamiento
      </button>

      <button
        type="button"
        style={estiloBoton}
        onClick={() => {
          setVerRecursantes(true);
        }}
      >
        🔁 Ver recursantes
      </button>
    </div>
  );
}