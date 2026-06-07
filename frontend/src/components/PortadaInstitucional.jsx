import { useState } from "react"
import { proyectosEscuela } from "../assets/escuela140/proyectos"

export default function PortadaInstitucional({ entrar }) {
  const [textoAbierto, setTextoAbierto] = useState(null)

  function obtenerBoton(proyecto) {
    const texto = `${proyecto.titulo} ${proyecto.imagen}`.toLowerCase()

    if (texto.includes("florencio") || texto.includes("molina")) {
      return proyecto.titulo?.toLowerCase().includes("obra")
        ? "Sus obras"
        : "Su historia"
    }

    return "Los protagonistas dicen"
  }

  function obtenerTexto(proyecto) {
    const texto = `${proyecto.titulo} ${proyecto.imagen}`.toLowerCase()

    if (texto.includes("florencio") || texto.includes("molina")) {
      if (proyecto.titulo?.toLowerCase().includes("obra")) {
        return {
          titulo: "Obras de Florencio Molina Campos",
          contenido:
            "Florencio Molina Campos retrató con humor, ternura y mirada popular la vida del campo argentino. Sus obras muestran gauchos, paisajes rurales, costumbres, escenas cotidianas y personajes entrañables, con un estilo muy reconocible por sus colores, gestos exagerados y gran expresividad."
        }
      }

      return {
        titulo: "Florencio Molina Campos",
        contenido:
          "Florencio Molina Campos fue un artista argentino reconocido por representar la vida rural, las tradiciones gauchescas y la identidad popular de nuestro país. Su obra forma parte de la memoria cultural argentina y permite acercar a los estudiantes a nuestras raíces, costumbres e historia."
      }
    }

    return {
      titulo: proyecto.titulo,
      contenido:
        "Espacio reservado para incorporar la voz de los estudiantes y docentes protagonistas de esta intervención artística. Aquí podremos sumar relatos, experiencias, aprendizajes y recuerdos sobre cómo nació y se realizó este proyecto."
    }
  }

  function abrirTexto(proyecto) {
    setTextoAbierto(obtenerTexto(proyecto))
  }

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
          <div key={index} style={tarjeta} className="tarjeta-proyecto">
            <img
              src={`/escuela140/${proyecto.imagen}`}
              alt={proyecto.titulo}
              style={imagen}
              className="imagen-proyecto"
            />

            <div style={texto}>
              <h3>{proyecto.titulo}</h3>
              <p>{proyecto.descripcion}</p>

              <button
                style={botonRelato}
                className="boton-relato"
                onClick={() => abrirTexto(proyecto)}
              >
                {obtenerBoton(proyecto)}
              </button>
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

      {textoAbierto && (
        <div style={fondoModal}>
          <div style={modal}>
            <h2>{textoAbierto.titulo}</h2>
            <p>{textoAbierto.contenido}</p>

            <button
              style={botonCerrar}
              onClick={() => setTextoAbierto(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .tarjeta-proyecto {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }

          .tarjeta-proyecto:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.18);
          }

          .imagen-proyecto {
            transition: transform 0.35s ease;
          }

          .tarjeta-proyecto:hover .imagen-proyecto {
            transform: scale(1.05);
          }

          .boton-relato {
            transition: background 0.25s ease, transform 0.2s ease;
          }

          .boton-relato:hover {
            background: #115e59;
            transform: scale(1.03);
          }
        `}
      </style>
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
  backgroundImage: "url('/escuela140/dia_mujer.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
  position: "relative"
}

const capa = {
  position: "absolute",
  top: "50px",
  left: "16px",
  background: "rgba(255,255,255,0.60)",
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
  color: "#1e3a5f",
  textAlign: "center"
}

const botonRelato = {
  marginTop: "10px",
  padding: "9px 16px",
  border: "none",
  borderRadius: "999px",
  background: "#0f766e",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
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

const fondoModal = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
}

const modal = {
  background: "white",
  color: "#1e3a5f",
  padding: "26px",
  borderRadius: "20px",
  maxWidth: "520px",
  width: "90%",
  boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  textAlign: "center",
  lineHeight: "1.6"
}

const botonCerrar = {
  marginTop: "18px",
  padding: "10px 22px",
  border: "none",
  borderRadius: "999px",
  background: "#1e3a5f",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
}