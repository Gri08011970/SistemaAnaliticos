export default function GestionDocentesFotia({
  docentesFotia = [],
  onVolver,
}) {
  return (
    <div
      style={{
        border: "2px solid #b9d4ea",
        borderRadius: "16px",
        padding: "28px",
        background: "#ffffff",
        boxShadow: "0 5px 16px rgba(41,78,112,.08)",
      }}
    >
      <button
        type="button"
        onClick={onVolver}
        style={{
          padding: "9px 16px",
          border: "1px solid #bfd4df",
          borderRadius: "9px",
          background: "#f3f8fa",
          color: "#315f6f",
          cursor: "pointer",
          fontWeight: "700",
          marginBottom: "24px",
        }}
      >
        ← Volver al menú FOTIA
      </button>

      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <p
          style={{
            margin: 0,
            color: "#6b7f92",
            fontWeight: "700",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          FOTIA
        </p>

        <h2
          style={{
            margin: "8px 0",
            color: "#23436d",
            fontSize: "30px",
          }}
        >
          👩‍🏫 Docentes responsables
        </h2>

        <p
          style={{
            color: "#607080",
            fontSize: "16px",
          }}
        >
          Administración de docentes responsables del fortalecimiento.
        </p>
      </div>

      <div
        style={{
          border: "2px dashed #bfd7ec",
          borderRadius: "14px",
          padding: "30px",
          textAlign: "center",
          background: "#fafcff",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#23436d",
          }}
        >
          Próxima etapa
        </h3>

        <p
          style={{
            color: "#667788",
            lineHeight: 1.6,
          }}
        >
          Desde este módulo se administrarán los docentes responsables del
          fortalecimiento, su estado, asignaturas y futuras asignaciones a las
          intervenciones de FOTIA.
        </p>

        <div
          style={{
            marginTop: "28px",
            fontSize: "18px",
            fontWeight: "700",
            color: "#148c84",
          }}
        >
          Docentes registrados: {docentesFotia.length}
        </div>
      </div>
    </div>
  );
}