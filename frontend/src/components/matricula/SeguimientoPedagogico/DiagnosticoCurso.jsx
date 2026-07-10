export default function DiagnosticoCurso({
  indice,
  estadoCurso,
}) {
  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "20px auto",
        padding: "16px",
        borderRadius: "16px",
        background: "#f9fcff",
        border: "1px solid #cfe3ea",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h4 style={{ margin: "0 0 10px" }}>
        🚦 Diagnóstico pedagógico del curso
      </h4>

      <div
        style={{
          height: "18px",
          borderRadius: "20px",
          background: "#e9eef2",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${indice}%`,
            height: "100%",
            background:
              indice >= 75
                ? "#7ed957"
                : indice >= 50
                ? "#ffd966"
                : "#ff6b6b",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        {indice}% 
      </div>

      <div
        style={{
          marginTop: "6px",
          fontWeight: 700,
        }}
      >
        {estadoCurso}
      </div>
    </div>
  );
}