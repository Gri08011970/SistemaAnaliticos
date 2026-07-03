import { useState } from "react"
import loginFondo from "../assets/escuela140/login_fondo11.png"

export default function Login({ setLogueado }) {
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")

  async function ingresar() {
    try {
      const respuesta = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          password: contrasena
        })
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setError(datos.mensaje || "Usuario o contraseña incorrectos")
        return
      }

      localStorage.setItem("rolUsuario", datos.rol)
      localStorage.setItem("usuario", datos.usuario)
      localStorage.setItem("nombreUsuario", datos.nombre)
      localStorage.setItem("ultimoAcceso", datos.ultimoAcceso)

      setLogueado(true)
      setError("")
    } catch (error) {
      console.log(error)
      setError("Error al conectar con el servidor")
    }
  }

  return (
    <div style={contenedor}>
      <div style={tarjeta}>
        <h1 style={titulo}>Bienvenidos</h1>
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
  backgroundImage: `linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${loginFondo})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "7%",
  paddingLeft: "5%",
  fontFamily: "Arial"
}

const tarjeta = {
  backgroundColor: "rgba(255,255,255,0.96)",
  padding: "34px",
  borderRadius: "24px",
  boxShadow: "0 20px 60px rgba(30,58,95,.18)",
  width: "380px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  border: "2px solid #c7dde3",
  backdropFilter: "blur(4px)" 
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