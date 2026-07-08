export default function CeldaSemaforo({
  valor,
  nota,
  onChangeEstado,
  onChangeNota,
}) {
  const colores = {
    "-": "#ececec",
    TEA: "#7ED957",
    TEP: "#FFD966",
    TED: "#FF6B6B",
  };

  const texto = {
    "-": "#666",
    TEA: "#1b5e20",
    TEP: "#8a6d00",
    TED: "#8b0000",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        onClick={onChangeEstado}
        style={{
          width: "58px",
          height: "30px",
          borderRadius: "6px",
          border: "1px solid #cfcfcf",
          background: colores[valor],
          color: texto[valor],
          fontWeight: "bold",
          fontSize: "12px",
          cursor: "pointer",
          transition: "all .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        {valor}
      </button>

      <input
        type="number"
        min="1"
        max="10"
        value={nota}
        onChange={(e) => onChangeNota(e.target.value)}
        style={{
          width: "42px",
          marginTop: "4px",
          textAlign: "center",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "11px",
          padding: "2px",
        }}
      />
    </div>
  );
}