import { useEffect, useState } from "react"

export default function FormularioNuevo({
  agregarEstudiante,
  actualizarEstudianteEditado,
  alumnoEditando,
  setAlumnoEditando,
  cancelarFormulario
}) {
  const [nombre, setNombre] = useState("")
  const [dni, setDni] = useState("")
  const [libro, setLibro] = useState("")
  const [folio, setFolio] = useState("")
  const [fecha, setFecha] = useState("")
  const [ultimoAnio, setUltimoAnio] = useState("") 

  useEffect(() => {
    if (alumnoEditando) {
      setNombre(alumnoEditando.nombre || "")
      setDni(alumnoEditando.dni || "")
      setLibro(alumnoEditando.libro || "")
      setFolio(alumnoEditando.folio || "")
      setUltimoAnio(alumnoEditando.ultimoAnio || "")
      setFecha("")
    }
  }, [alumnoEditando])

  function manejarEnvio() {
        if (fecha) {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      const fechaIngresada = new Date(fecha)
      fechaIngresada.setHours(0, 0, 0, 0)

      if (fechaIngresada > hoy) {
        alert("La fecha del pedido no puede ser posterior al día de hoy.")
        return
      }
    }
    const nuevoEstudiante = {
      nombre,
      dni,
      libro,
      folio,
      fecha: fecha
        ? fecha.split("-").reverse().join("/")
        : alumnoEditando?.fecha || "",
      ultimoAnio,
      estado: alumnoEditando?.estado || "Pendiente",
      carpeta: alumnoEditando?.carpeta || "---",
      seleccionado: alumnoEditando?.seleccionado || false,

      fechaCarga:
        alumnoEditando?.fechaCarga ||
        new Date().toISOString()
    }

    if (alumnoEditando) {
      actualizarEstudianteEditado(alumnoEditando._id, nuevoEstudiante)
    } else {
      agregarEstudiante(nuevoEstudiante)
    }

    setNombre("")
    setDni("")
    setLibro("")
    setFolio("")
    setFecha("")
    setUltimoAnio("")
    setAlumnoEditando(null)
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
      <h2 style={{ color: "#1e3a5f" }}>
        {alumnoEditando
          ? "Editar analítico"
          : "Cargar nuevo pedido de analítico"}
      </h2>

      <input
        type="text"
        placeholder="Apellido y Nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        style={estiloInput}
      />

      <input
        type="text"
        placeholder="DNI"
        value={dni}
        onChange={(evento) => setDni(evento.target.value)}
        style={estiloInput}
      />

      <input
        type="text"
        placeholder="Libro"
        value={libro}
        onChange={(evento) => setLibro(evento.target.value)}
        style={estiloInput}
      />

      <input
        type="text"
        placeholder="Folio"
        value={folio}
        onChange={(evento) => setFolio(evento.target.value)}
        style={estiloInput}
      />

      <select
        value={ultimoAnio}
        onChange={(evento) => setUltimoAnio(evento.target.value)}
        style={estiloInput}
      >
        <option value="">Último año cursado</option>
        <option value="1°">1°</option>
        <option value="2°">2°</option>
        <option value="3°">3°</option>
        <option value="4°">4°</option>
        <option value="5°">5°</option>
        <option value="6°">6°</option>
      </select>

      <input
        type="date"
        value={fecha}
        onChange={(evento) => setFecha(evento.target.value)}
        style={estiloInput}
      />

      <div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "10px"
  }}
>
  <button
    onClick={cancelarFormulario} 
    style={botonCancelar}
  >
    ← Volver
  </button>

  <button
    onClick={manejarEnvio}
    style={botonGuardar}
  >
    {alumnoEditando
      ? "Guardar cambios"
      : "Guardar pedido"}
  </button>
</div>
    </div>
  )
}

const estiloInput = {
  width: "360px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px"
}

const botonGuardar = {
  backgroundColor: "#4d76ac",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  width: "250px"
}
const botonCancelar = {
  backgroundColor: "#eef5f7",
  color: "#2d5568",
  border: "1px solid #b8d4db",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  width: "140px",
  fontWeight: "600",
  transition: "0.2s"
}