import { useState } from "react"

export default function Estadisticas({ estudiantes = [] }) {
  const [mostrar, setMostrar] = useState(true)
  const lista = Array.isArray(estudiantes) ? estudiantes : []

  const datos = [
    { titulo: "Total", numero: lista.length, icono: "📄" },
    { titulo: "Pendientes", numero: lista.filter(a => a.estado === "Pendiente").length, icono: "⏳" },
    { titulo: "En Jefatura", numero: lista.filter(a => a.estado === "En Jefatura").length, icono: "🏢" },
    { titulo: "Para entregar", numero: lista.filter(a => a.estado === "Para entregar").length, icono: "📬" },
    { titulo: "Entregados", numero: lista.filter(a => a.estado === "Entregado").length, icono: "✅" }
  ]

  return (
    <div style={contenedor}>
      <button onClick={() => setMostrar(!mostrar)} className="boton-sistema boton-secundario">
        {mostrar ? "Ocultar estadísticas" : "Ver estadísticas"}
      </button>

      {mostrar && (
        <div style={grilla}>
          {datos.map((item) => (
            <div key={item.titulo} style={tarjeta} className="tarjeta-inicio">
              <div style={icono}>{item.icono}</div>
              <h3 style={titulo}>{item.titulo}</h3>
              <p style={numero}>{item.numero}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const contenedor = {
  marginTop: "25px",
  textAlign: "center"
}

const grilla = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "22px"
}

const tarjeta = {
  backgroundColor: "#f8fbfc",
  border: "2px solid #b9d6df",
  borderRadius: "18px",
  padding: "12px 12px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.14)",
  textAlign: "center"
}

const icono = {
  fontSize: "24px",
  marginBottom: "8px"
}

const titulo = {
  color: "#5f5a73",
  margin: "0 0 10px 0"
}

const numero = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1e3a5f",
  margin: 0
}