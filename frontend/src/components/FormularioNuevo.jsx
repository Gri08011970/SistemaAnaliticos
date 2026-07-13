import { useEffect, useState } from "react"

export default function FormularioNuevo({
  agregarEstudiante,
  actualizarEstudianteEditado,
  alumnoEditando,
  setAlumnoEditando,
  cancelarFormulario,
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
      fechaCarga: alumnoEditando?.fechaCarga || new Date().toISOString(),
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
    <div className="tarjeta-inicio"  style={contenedorFormulario}>
      <h2 style={tituloFormulario}>
        {alumnoEditando ? "Editar analítico" : "📄 Nuevo pedido de analítico"}
      </h2>

      <div className="formulario-analitico" style={grillaFormulario}>
        <input type="text" placeholder="Apellido y Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={estiloInput} />
        <input type="text" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} style={estiloInput} />
        <input type="text" placeholder="Libro" value={libro} onChange={(e) => setLibro(e.target.value)} style={estiloInput} />
        <input type="text" placeholder="Folio" value={folio} onChange={(e) => setFolio(e.target.value)} style={estiloInput} />

        <select value={ultimoAnio} onChange={(e) => setUltimoAnio(e.target.value)} style={estiloInput}>
          <option value="">Último año cursado</option>
          <option value="1°">1°</option>
          <option value="2°">2°</option>
          <option value="3°">3°</option>
          <option value="4°">4°</option>
          <option value="5°">5°</option>
          <option value="6°">6°</option>
        </select>

        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={estiloInput} />
      </div>

      <div style={contenedorBotones}>
        <button onClick={cancelarFormulario} style={botonCancelar}>
          ← Volver a Analíticos
        </button>

        <button onClick={manejarEnvio} style={botonGuardar}>
          {alumnoEditando ? "Guardar cambios" : "Guardar pedido"}
        </button>
      </div>
    </div>
  )
}

const contenedorFormulario = {
  marginTop: "35px",
  background: "#f8fbfc",
  border: "2px solid #b9d6df",
  borderRadius: "18px",
  padding: "30px",
  boxShadow: "0 10px 24px rgba(22,58,95,.15)",
}

const tituloFormulario = {
  color: "#1e3a5f",
  textAlign: "center",
  marginTop: 0,
  marginBottom: "22px",
}

const grillaFormulario = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(260px, 360px))",
  gap: "16px",
  justifyContent: "center",
}

const estiloInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #b9cbd1",
  fontSize: "16px",
  boxSizing: "border-box",
}

const contenedorBotones = {
  display: "flex",
  gap: "12px",
  marginTop: "22px",
  justifyContent: "center",
  flexWrap: "wrap",
}

const botonGuardar = {
  backgroundColor: "#19766f",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  width: "250px",
  fontWeight: "bold",
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
}