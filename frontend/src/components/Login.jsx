import { useState } from "react"

export default function Login({
  setLogueado
}) {
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")

  function ingresar() {
  const usuarios = [
    { usuario: "gri", password: "140", rol: "consulta" },
    { usuario: "grichu", password: "140", rol: "admin" }
  ]

  const usuarioEncontrado = usuarios.find(
    (u) =>
      u.usuario === usuario.trim().toLowerCase() &&
      u.password === contrasena.trim()
  )

  if (usuarioEncontrado) {
    localStorage.setItem("rolUsuario", usuarioEncontrado.rol)
    localStorage.setItem("usuario", usuarioEncontrado.usuario)
    setLogueado(true)
    setError("")
  } else {
    setError("Usuario o contraseña incorrectos")
  }
}
  return (
    <div style={contenedor}>
      <div style={tarjeta}>
        <h1 style={titulo}>Sistema de Gestión de pedidos de Analíticos</h1>
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
  background: "linear-gradient(135deg, #e8f4f1, #f4f6f8, #dcefeb)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial"
}

const tarjeta = {
  backgroundColor: "rgba(255,255,255,0.92)",
  padding: "38px",
  borderRadius: "24px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  width: "380px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  border: "1px solid #c7dde3"
}

const titulo = {
  color: "#1e3a5f",
  marginBottom: "0",
  fontSize: "27px",
  lineHeight: "1.1",
  textAlign: "center"
}

const subtitulo = {
  color: "#0f766e",
  marginTop: "0",
  textAlign: "center",
  fontWeight: "bold"
}

const input = {
  padding: "13px",
  borderRadius: "12px",
  border: "1px solid #b9cbd1",
  fontSize: "15px",
  outlineColor: "#0f766e"
}

const boton = {
  backgroundColor: "#0f766e",
  color: "white",
  border: "none",
  padding: "13px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
}

const errorTexto = {
  color: "#c62828",
  fontWeight: "bold",
  textAlign: "center"
}