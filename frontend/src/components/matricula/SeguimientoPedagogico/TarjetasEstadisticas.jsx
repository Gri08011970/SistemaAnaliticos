export default function TarjetasEstadisticas({ estadisticas }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "14px",
        margin: "20px 0",
        flexWrap: "wrap",
       
      }}
    >
      <div style={tarjetaEstadistica("#d9f5d6")}>
        🟢 TEA: <strong>{estadisticas.tea}</strong>
      </div>

      <div style={tarjetaEstadistica("#fff1b8")}>
        🟡 TEP: <strong>{estadisticas.tep}</strong>
      </div>

      <div style={tarjetaEstadistica("#ffd1d1")}>
        🔴 TED: <strong>{estadisticas.ted}</strong>
      </div>

      <div style={tarjetaEstadistica("#eef3f7")}>
        📌 Cargados: <strong>{estadisticas.totalCargados}</strong>
      </div>

      <div style={tarjetaEstadistica("#eef3f7")}>
        📈 Índice: <strong>{estadisticas.indice}%</strong>
      </div>
    </div>
  );
}

function tarjetaEstadistica(color) {
  return {
    padding: "10px 16px",
    borderRadius: "10px",
    background: color,
    
    fontWeight: "600",
    border: "2px solid  #bcd7e3",
    boxShadow:  "0 5px 14px rgba(44, 84, 116, 0.10)",
  };
}