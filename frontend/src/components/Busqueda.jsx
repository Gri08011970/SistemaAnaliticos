export default function Busqueda({
  dniBusqueda,
  setDniBusqueda,
  apellidoBusqueda,
  setApellidoBusqueda,
  irATabla,
}) {
  return (
    <div
      className="tarjeta-inicio"
      style={{
        backgroundColor: "#f8fbfc",
        border: "2px solid #b9d6df",
        borderRadius: "18px",
        padding: "25px",
        marginBottom: "25px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3
          style={{
            color: "#1e3a5f",
            marginTop: 0,
            marginBottom: "18px",
          }}
        >
          🔎 Buscar pedido de analítico
        </h3>
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={dniBusqueda}
          onChange={(evento) => setDniBusqueda(evento.target.value)}
          style={estiloInput}
        />

        <input
          type="text"
          placeholder="Buscar por apellido"
          value={apellidoBusqueda}
          onChange={(evento) => setApellidoBusqueda(evento.target.value)}
          style={estiloInput}
        />

        <button onClick={irATabla} style={estiloBoton} className="boton-sistema boton-principal" >
          Ver
        </button>
      </div>
    </div>
  );
}

const estiloInput = {
  width: "300px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const estiloBoton = {
  width: "130px",
  backgroundColor: "#19766f",
  color: "white",
  border: "none",
  padding: "11px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 3px 8px rgba(0,0,0,.12)",
  transition: "all .25s"
}
