import { useState } from "react"

export default function Estadisticas({
  estudiantes
}) {
  const [mostrar, setMostrar] = useState(false)

  const pendientes = estudiantes.filter(
    (alumno) => alumno.estado === "Pendiente"
  ).length

  const jefatura = estudiantes.filter(
    (alumno) => alumno.estado === "En Jefatura"
  ).length

  const paraEntregar = estudiantes.filter(
    (alumno) => alumno.estado === "Para entregar"
  ).length

  const entregados = estudiantes.filter(
    (alumno) => alumno.estado === "Entregado"
  ).length

  return (
    <div style={{ marginTop: "25px" }}>
      <button
        onClick={() => setMostrar(!mostrar)}
        style={boton}
      >
        {mostrar ? "Ocultar estadísticas" : "Ver estadísticas"}
      </button>

      {mostrar && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap"
          }}
        >
          <div style={tarjeta}>
            <h3>Pendientes</h3>
            <p style={numero}>{pendientes}</p>
          </div>

          <div style={tarjeta}>
            <h3>En Jefatura</h3>
            <p style={numero}>{jefatura}</p>
          </div>

          <div style={tarjeta}>
            <h3>Para entregar</h3>
            <p style={numero}>{paraEntregar}</p>
          </div>

          <div style={tarjeta}>
            <h3>Entregados</h3>
            <p style={numero}>{entregados}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const boton = {
  backgroundColor: "#e9eef5",
  color: "#1e3a5f",
  border: "1px solid #cfd8e3",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
}

const tarjeta = {
  backgroundColor: "white",
  borderRadius: "15px",
  padding: "20px",
  minWidth: "200px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
}

const numero = {
  fontSize: "35px",
  fontWeight: "bold",
  color: "#1e3a5f"
}