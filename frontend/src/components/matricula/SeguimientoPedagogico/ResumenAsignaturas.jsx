export default function ResumenAsignaturas({ estadisticasPorAsignatura }) {
  return (
    <div
      style={{
        margin: "16px 0",
        padding: "12px",
        border: "1px solid #cfe3ea",
        borderRadius: "14px",
        background: "#f9fcff",
      }}
    >
      <h4 style={{ margin: "0 0 12px", fontSize: "16px" }}>
        📚 Resumen por asignatura
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "8px",
        }}
      >
        {estadisticasPorAsignatura.map((item) => (
          <div
            key={item.asignatura}
            style={{
              border: "1px solid #d7e5ec",
              borderRadius: "12px",
              padding: "8px",
              background: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,.05)",
              minHeight: "118px",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "12px",
                marginBottom: "6px",
                lineHeight: "1.15",
                color: "#43506f",
              }}
            >
              {item.asignatura}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <span>🟢 {item.tea}</span>
              <span>🟡 {item.tep}</span>
              <span>🔴 {item.ted}</span>
            </div>

            <div
              style={{
                marginTop: "8px",
                textAlign: "center",
                fontSize: "11px",
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              Índice
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: "#43506f",
              }}
            >
              {item.indice}%
            </div>

            <div
              style={{
                marginTop: "6px",
                textAlign: "center",
                padding: "4px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "11px",
                background:
                  item.estado === "🟢 Excelente"
                    ? "#eef8ee"
                    : item.estado === "🟡 Observar"
                      ? "#fff8df"
                      : "#ffeaea",
                color:
                  item.estado === "🟢 Excelente"
                    ? "#2f7d32"
                    : item.estado === "🟡 Observar"
                      ? "#8a6d00"
                      : "#b42318",
              }}
            >
              {item.estado}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}