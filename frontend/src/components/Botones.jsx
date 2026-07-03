export default function Botones({
  irAFormulario,
  verListaCompleta,
  generarPlanillaElevacion,
  esAdmin,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginTop: "30px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => esAdmin && irAFormulario()}
        disabled={!esAdmin}
        title={
          esAdmin
            ? "Nuevo pedido de analítico"
            : "Solo el administrador puede crear pedidos"
        }
        style={{
          ...estiloBoton,
          opacity: esAdmin ? 1 : 0.45,
          cursor: esAdmin ? "pointer" : "not-allowed",
        }}
      >
        Nuevo Analítico
      </button>

      <button onClick={verListaCompleta} style={estiloBoton}>
        Ver lista completa
      </button>

      <button onClick={generarPlanillaElevacion} style={estiloBoton}>
        Planilla de eleve
      </button>
    </div>
  );
}

const estiloBoton = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
};
