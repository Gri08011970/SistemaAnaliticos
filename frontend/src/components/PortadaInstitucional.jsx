import { proyectosEscuela } from "../assets/escuela140/proyectos"

export default function PortadaInstitucional({ entrar }) {
  return (
    <div style={contenedorPortada}>
      <section style={hero}>
        <div style={capa}>
          <h1 style={tituloPrincipal}>
            Escuela de Educación Secundaria N° 140
          </h1>

          <h2 style={subtitulo}>
            "Florencio Molina Campos"
          </h2>

          <p style={bajada}>
            Sistema de Gestión Institucional
          </p>
          
        </div>
      </section>

      <section style={carrusel}>
        {proyectosEscuela.map((proyecto, index) => (
          <div key={index} style={tarjeta}>
            <img
              src={`/src/assets/escuela140/${proyecto.imagen}`}
              alt={proyecto.titulo}
              style={imagen}
            />

            <div style={texto}>
              <h3>{proyecto.titulo}</h3>
              <p>{proyecto.descripcion}</p>
            </div>
          </div>
        ))}
      </section>

      <div style={loginCaja}>
            <h3>Ingresar al sistema</h3>

            <input
              type="text"
              placeholder="Usuario"
              style={inputLogin}
            />

            <input
              type="password"
              placeholder="Contraseña"
              style={inputLogin}
            />

            <button style={botonEntrar} onClick={entrar}>
              Ingresar
            </button>
          </div>
    </div>
  )
}

const contenedorPortada = {
  minHeight: "100vh",
  background: "#f3f6f9",
  padding: "20px"
}

const hero = {
  height: "70vh",
  borderRadius: "24px",
  backgroundImage: "url('/src/assets/escuela140/dia_mujer.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
  position: "relative",
}

const capa = {
  position: "absolute",
  top: "120px",
  left: "16px",
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(1px)",
  color: "#1e3a5f",
  padding: "8px 12px",
  borderRadius: "12px",
  textAlign: "left",
  maxWidth: "300px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.10)"
}

const tituloPrincipal = {
  fontSize: "20px",
  lineHeight: "1.1",
  margin: "0 0 6px 0"
}

const subtitulo = {
  fontSize: "13px",
  margin: "0 0 4px 0"
}

const bajada = {
  fontSize: "11px",
  margin: 0
} 

const botonEntrar = {
  marginTop: "20px",
  padding: "12px 28px",
  border: "none",
  borderRadius: "999px",
  background: "#0f766e",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
}

const carrusel = {
  marginTop: "22px",
  display: "flex",
  gap: "18px",
  overflowX: "auto",
  paddingBottom: "12px"
}

const tarjeta = {
  minWidth: "280px",
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
}

const imagen = {
  width: "100%",
  height: "180px",
  objectFit: "cover"
}

const texto = {
  padding: "14px",
  color: "#1e3a5f"
}
const loginCaja = {
  margin: "18px auto 0 auto",
  background: "white",
  color: "#1e3a5f",
  padding: "16px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "280px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.14)",
  textAlign: "center"
}

const inputLogin = {
  padding: "8px 10px",
  borderRadius: "9px",
  border: "1px solid #ccc",
  fontSize: "13px"
}