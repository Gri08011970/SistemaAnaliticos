import { useState } from "react"

export default function Login({
  setLogueado
}) {
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")

  function ingresar() {
    if (usuario === "admin" && contrasena === "140") {
      setLogueado(true)
      setError("")
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div style={contenedor}>
      <div style={tarjeta}>
        <h1 style={titulo}>Sistema de Gestión de Analíticos</h1>
        <p style={subtitulo}>E.E.S. N° 140</p>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(evento) => setUsuario(evento.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(evento) => setContrasena(evento.target.value)}
          style={input}
        />

        {error && <p style={errorTexto}>{error}</p>}

        <button onClick={ingresar} style={boton}>
          Ingresar
        </button>
      </div>
    </div>
  )
}

const contenedor = {
  minHeight: "100vh",
  backgroundColor: "#f4f6f8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial"
}

const tarjeta = {
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "18px",
  boxShadow: "0 0 15px rgba(0,0,0,0.12)",
  width: "360px",
  display: "flex",
  flexDirection: "column",
  gap: "15px"
}

const titulo = {
  color: "#1e3a5f",
  marginBottom: "0",
   fontSize: "28px",
  lineHeight: "1.1",
  textAlign: "center"
}

const subtitulo = {
  color: "#666",
  marginTop: "0",
  textAlign: "center"
}

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px"
}

const boton = {
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
}

const errorTexto = {
  color: "#c62828",
  fontWeight: "bold"
}