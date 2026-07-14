import { COLORES_SEGUIMIENTO } from "./seguimientoConstants";

export default function CeldaSemaforo({
  valor,
  nota,
  onChangeEstado,
  onChangeNota,
}) {

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
          background: COLORES_SEGUIMIENTO[valor]?.fondo,
          color: COLORES_SEGUIMIENTO[valor]?.texto,
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