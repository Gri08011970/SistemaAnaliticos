export default function Busqueda({
  dniBusqueda,
  setDniBusqueda,
  apellidoBusqueda,
  setApellidoBusqueda,
  irATabla
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

        <button
          onClick={irATabla}
          style={estiloBoton}
        >
          Ver
        </button>
      </div>
    </div>
  )
}

const estiloInput = {
  width: "300px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px"
}

const estiloBoton = {
  width: "100px",
  backgroundColor: "#0b0c0e",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer"
}