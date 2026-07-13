import { useState } from "react"
import { proyectosEscuela } from "../assets/escuela140/proyectos"

export default function PortadaInstitucional({ entrar }) {
  const [textoAbierto, setTextoAbierto] = useState(null)

  function obtenerBoton(proyecto) {
    if (proyecto.boton) return proyecto.boton

    const texto = `${proyecto.titulo} ${proyecto.imagen}`.toLowerCase()

    if (texto.includes("florencio") || texto.includes("molina")) {
      return texto.includes("obra") ? "Sus obras" : "Su historia"
    }

    return "Los protagonistas dicen"
  }

  const selloInstitucional =
    "La escuela también educa a través de sus paredes, de sus obras y de las voces de quienes la habitan."

  const relatos = {
    obras_molina: {
      titulo: "Obras de Florencio Molina Campos",
      subtitulo: "El arte que dio identidad a nuestra escuela.",
      contenido: [
        "Florencio Molina Campos retrató con humor, ternura y mirada popular la vida del campo argentino. Sus obras muestran gauchos, paisajes rurales, costumbres, escenas cotidianas y personajes entrañables.",
        "Su estilo es profundamente reconocible: colores intensos, gestos exagerados, miradas expresivas y una forma única de contar la identidad criolla desde el arte.",
        "Acercar sus obras a la escuela es también acercar a los estudiantes a una parte de nuestra memoria cultural, nuestras raíces y nuestras formas de mirar el país."
      ]
    },

    historia_molina: {
      titulo: "Florencio Molina Campos",
      subtitulo: "El artista que da nombre a nuestra escuela.",
      contenido: [
        "Florencio Molina Campos fue un artista argentino reconocido por representar la vida rural, las tradiciones gauchescas y la identidad popular de nuestro país.",
        "Su obra forma parte de la memoria cultural argentina y permite acercar a los estudiantes a nuestras raíces, costumbres e historia.",
        "Que nuestra escuela lleve su nombre es una invitación permanente a valorar el arte, la identidad nacional y la mirada sensible sobre la vida cotidiana de nuestro pueblo."
      ]
    },

    mesas_inclusivas: {
      titulo: "Mesas inclusivas",
      subtitulo: "Cuando el espacio también aprende a cuidar.",
      contenido: [
        "Las mesas inclusivas nacieron de una necesidad concreta: hacer de la escuela un lugar más accesible, más cómodo y más justo para estudiantes usuarias de silla de ruedas.",
        "Pero la comunidad educativa decidió ir más allá de la adaptación funcional. Las mesas fueron intervenidas artísticamente, convirtiendo una respuesta pedagógica y material en una expresión de cuidado, inclusión y belleza.",
        "Cada mesa recuerda que la inclusión no es solamente una palabra: es una decisión cotidiana que transforma los espacios para que todas y todos puedan habitarlos con dignidad."
      ]
    },

    memoria: {
      titulo: "Memoria, Verdad y Justicia",
      subtitulo: "El Nunca Más como compromiso cotidiano.",
      contenido: [
        "Cada pañuelo blanco representa una historia que nunca dejó de buscar la verdad.",
        "Esta intervención artística invita a las nuevas generaciones a mantener viva la memoria, defender los derechos humanos y comprender que el Nunca Más no pertenece solamente al pasado.",
        "En la escuela, la memoria se enseña, se conversa, se representa y se cuida. Porque educar también es construir ciudadanía democrática, justicia y compromiso colectivo."
      ]
    },

    ni_una_menos: {
      titulo: "Nuestra voz",
      subtitulo: "Ni Una Menos también se aprende en la escuela.",
      contenido: [
        "Cuando una escuela dice Ni Una Menos, enseña mucho más que un contenido.",
        "Enseña a construir vínculos basados en el respeto, la igualdad y el cuidado. Enseña que ninguna forma de violencia tiene lugar dentro ni fuera de la escuela.",
        "Esta intervención nació de las voces de estudiantes que eligieron transformar el arte en un mensaje colectivo: una voz compartida para mirar, pensar, sentir y decir."
      ]
    },

    dia_mujer: {
      titulo: "Día Internacional de la Mujer",
      subtitulo: "Una intervención para mirar, nombrar y transformar.",
      contenido: [
        "Esta producción colectiva invita a visibilizar historias, luchas, derechos y voces de mujeres que abrieron caminos.",
        "Desde la escuela, el arte permite construir conciencia, acompañar procesos de reflexión y fortalecer una mirada respetuosa e igualitaria.",
        "Cada imagen, cada color y cada palabra forman parte de una pedagogía del cuidado y de la memoria."
      ]
    },

    paredes_voz: {
      titulo: "Celebración de la voz humana",
      subtitulo: "Las paredes dicen.",
      cita: true,
      contenido: [
        "Cuando es verdadera, cuando nace de la necesidad de decir, a la voz humana no hay quien la pare. Si le niegan la boca, ella habla por las manos, o por los ojos, o por los poros, o por donde sea. Porque todos, toditos, tenemos algo que decir a los demás, alguna cosa que merece ser por los demás celebrada o perdonada."
      ],
      autor: "Eduardo Galeano, El libro de los abrazos."
    },

    paredes_manos: {
      titulo: "Las manos también hablan",
      subtitulo: "Las paredes dicen.",
      cita: true,
      contenido: [
        "Tenían las manos atadas, o esposadas, y sin embargo los dedos danzaban, volaban, dibujaban palabras. Los presos estaban encapuchados; pero inclinándose alcanzaban a ver algo, alguito, por abajo. Aunque hablar estaba prohibido, ellos conversaban con las manos.",
        "Pinio Ungerfeld me enseñó el alfabeto de los dedos, que en prisión aprendió sin profesor:",
        "—Algunos teníamos mala letra—me dijo—. Otros eran unos artistas de la caligrafía."
      ],
      autor: "Eduardo Galeano, El libro de los abrazos."
    },

    puertas: {
      titulo: "Puertas que cuentan historias",
      subtitulo: "Cuando lo cotidiano se vuelve expresión.",
      contenido: [
        "Las puertas intervenidas por estudiantes transforman espacios de paso en lugares de encuentro con la creatividad, la identidad y la pertenencia.",
        "Cada intervención recuerda que la escuela también se construye con símbolos, colores, relatos y huellas compartidas.",
        "Abrir una puerta puede ser también abrir una historia."
      ]
    },

    malvinas: {
      titulo: "Malvinas",
      subtitulo: "Memoria, soberanía e identidad.",
      contenido: [
        "Las producciones sobre Malvinas permiten trabajar la memoria, la soberanía y el reconocimiento a quienes fueron parte de nuestra historia reciente.",
        "Desde el arte, la escuela acompaña la construcción de una mirada respetuosa, sensible y comprometida con la identidad nacional.",
        "Recordar Malvinas es también seguir preguntándonos por la patria, la memoria y el lugar que ocupa la escuela en esa transmisión."
      ]
    },

    banos_inclusivos: {
      titulo: "Baños inclusivos",
      subtitulo: "El arte también transforma los espacios comunes.",
      contenido: [
        "La intervención artística de los baños resignifica un espacio cotidiano de la escuela y lo convierte en una experiencia visual, cuidada y compartida.",
        "Inspirada en el arte geométrico, esta propuesta suma color, diseño y pertenencia a lugares que también forman parte de la vida escolar.",
        "Cuando los estudiantes intervienen su escuela, dejan huellas de identidad en los espacios que habitan todos los días."
      ]
    },

    generico: {
      titulo: "Los protagonistas dicen",
      subtitulo: "Voces de la comunidad educativa.",
      contenido: [
        "Espacio reservado para incorporar la voz de estudiantes y docentes protagonistas de esta intervención artística.",
        "Aquí podremos sumar relatos, experiencias, aprendizajes y recuerdos sobre cómo nació y se realizó este proyecto."
      ]
    }
  }

  function obtenerTexto(proyecto) {
    const titulo = proyecto.titulo?.toLowerCase() || ""
    const imagen = proyecto.imagen?.toLowerCase() || ""
    const texto = `${titulo} ${imagen}`

    if (proyecto.texto && relatos[proyecto.texto]) {
      return relatos[proyecto.texto]
    }

    if (texto.includes("mesas_inclusivas")) return relatos.mesas_inclusivas
    if (texto.includes("memoria") || texto.includes("abuelas")) return relatos.memoria
    if (texto.includes("ni_una_menos")) return relatos.ni_una_menos
    if (texto.includes("dia_mujer")) return relatos.dia_mujer
    if (texto.includes("las_paredes_dicen1")) return relatos.paredes_voz
    if (texto.includes("las_paredes_dicen2")) return relatos.paredes_manos
    if (texto.includes("puertas")) return relatos.puertas
    if (texto.includes("malvinas")) return relatos.malvinas
    if (texto.includes("baño") || texto.includes("bano")) return relatos.banos_inclusivos

    if (texto.includes("florencio") || texto.includes("molina")) {
      return texto.includes("obra") ? relatos.obras_molina : relatos.historia_molina
    }

    return {
      ...relatos.generico,
      titulo: proyecto.titulo || relatos.generico.titulo
    }
  }

  function abrirTexto(proyecto) {
    setTextoAbierto(obtenerTexto(proyecto))
  }

  return (
    <div className="hero-institucional" style={contenedorPortada}>
      <section style={hero}>
        <div className="hero-texto" style={capa}>
          <h1 style={tituloPrincipal}>Escuela de Educación Secundaria N° 140</h1>

          <h2 style={subtitulo}>"Florencio Molina Campos"</h2>

          <p style={bajada}>Sistema de Gestión Institucional</p>
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

            <div style={textoTarjeta}>
              <h3 style={tituloTarjeta}>{proyecto.titulo}</h3>
              <p style={descripcionTarjeta}>{proyecto.descripcion}</p>

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

      <div style={contenedorBotonEntrar}>
        <button style={botonEntrar} onClick={entrar}>
          Ingresar al sistema
        </button>
      </div>

      {textoAbierto && (
        <div style={fondoModal}>
          <div style={modal}>
            <p style={selloModal}>{selloInstitucional}</p>

            <h2 style={tituloModal}>{textoAbierto.titulo}</h2>

            {textoAbierto.subtitulo && (
              <p style={subtituloModal}>{textoAbierto.subtitulo}</p>
            )}

            <div style={lineaDecorativa}></div>

            <div style={contenidoModal}>
              {textoAbierto.contenido.map((parrafo, index) => (
                <p
                  key={index}
                  style={textoAbierto.cita ? parrafoCita : parrafoModal}
                >
                  {textoAbierto.cita ? `“${parrafo}”` : parrafo}
                </p>
              ))}

              {textoAbierto.autor && (
                <p style={autorModal}>— {textoAbierto.autor}</p>
              )}
            </div>

            <button style={botonCerrar} onClick={() => setTextoAbierto(null)}>
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
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(1px)",
  color: "#1e3a5f",
  padding: "9px 13px",
  borderRadius: "12px",
  textAlign: "left",
  maxWidth: "310px",
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
  maxWidth: "280px",
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

const textoTarjeta = {
  padding: "14px",
  color: "#1e3a5f",
  textAlign: "center"
}

const tituloTarjeta = {
  margin: "0 0 8px 0",
  fontSize: "18px"
}

const descripcionTarjeta = {
  margin: 0,
  minHeight: "62px",
  fontSize: "14px",
  lineHeight: "1.35",
  color: "#506070"
}

const botonRelato = {
  marginTop: "12px",
  padding: "9px 16px",
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
  background: "rgba(0,0,0,0.48)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px"
}

const modal = {
  background: "linear-gradient(180deg, #ffffff, #f8fbfc)",
  color: "#1e3a5f",
  padding: "30px",
  borderRadius: "24px",
  maxWidth: "680px",
  width: "92%",
  maxHeight: "88vh",
  overflowY: "auto",
  boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
  textAlign: "center",
  lineHeight: "1.6",
  border: "1px solid rgba(15, 118, 110, 0.16)"
}

const selloModal = {
  margin: "0 auto 14px auto",
  maxWidth: "560px",
  fontSize: "13px",
  color: "#6b7f89",
  fontStyle: "italic"
}

const tituloModal = {
  margin: "0",
  fontSize: "26px",
  color: "#1e3a5f"
}

const subtituloModal = {
  margin: "6px 0 0 0",
  color: "#0f766e",
  fontWeight: "bold",
  fontSize: "15px"
}

const lineaDecorativa = {
  width: "80px",
  height: "3px",
  background: "#0f766e",
  borderRadius: "999px",
  margin: "18px auto"
}

const contenidoModal = {
  textAlign: "left",
  color: "#2f4050"
}

const parrafoModal = {
  margin: "0 0 13px 0",
  fontSize: "16px"
}

const parrafoCita = {
  margin: "0 0 14px 0",
  fontSize: "17px",
  fontStyle: "italic",
  color: "#1e3a5f"
}

const autorModal = {
  marginTop: "12px",
  textAlign: "right",
  fontWeight: "bold",
  color: "#0f766e"
}

const botonCerrar = {
  marginTop: "20px",
  padding: "10px 24px",
  border: "none",
  borderRadius: "999px",
  background: "#1e3a5f",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
}

const contenedorBotonEntrar = {
  display: "flex",
  justifyContent: "center",
  marginTop: "22px"
}

const botonEntrar = {
  padding: "12px 28px",
  border: "2px solid #c7dde3",
  borderRadius: "999px",
  background: "linear-gradient(90deg,#7c4fb3,#9565cb)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transform: "translateY(-3px)",
  boxShadow:"0 14px 30px rgba(124,79,179,.35)",
}