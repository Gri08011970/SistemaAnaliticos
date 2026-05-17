import { useState } from "react"

export default function FormularioNuevo({
  agregarEstudiante
}) {

  const [nombre, setNombre] = useState("")
  const [dni, setDni] = useState("")

  function manejarEnvio() {

    const nuevoEstudiante = {
      nombre,
      dni,
      estado: "Pendiente",
      carpeta: "---",
      seleccionado: false
    }

    agregarEstudiante(nuevoEstudiante)

    setNombre("")
    setDni("")
  }

  return (
    <div
      style={{
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}
    >

      <h2
        style={{
          color: "#1e3a5f"
        }}
      >
        Cargar nuevo analítico
      </h2>

      <input
        type="text"
        placeholder="Apellido y Nombre"

        value={nombre}

        onChange={(evento) =>
          setNombre(evento.target.value)
        }

        style={estiloInput}
      />

      <input
        type="text"
        placeholder="DNI"

        value={dni}

        onChange={(evento) =>
          setDni(evento.target.value)
        }

        style={estiloInput}
      />

      <button

        onClick={manejarEnvio}

        style={{
          backgroundColor: "#1e3a5f",
          color: "white",
          border: "none",
          padding: "12px",
          borderRadius: "10px",
          cursor: "pointer",
          width: "220px"
        }}
      >
        Guardar Analítico
      </button>

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