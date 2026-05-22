import mongoose from "mongoose"

const AlumnoSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  dni: {
    type: String,
    required: true
  },

  libro: String,

  folio: String,

  ultimoAnio: String,

  fecha: String,

  estado: {
    type: String,
    default: "Pendiente"
  },

  carpeta: {
    type: String,
    default: "-"
  },

  seleccionado: {
    type: Boolean,
    default: false
  },

  // ===== MATRÍCULA =====

  curso: {
    type: String,
    default: ""
  },

  turno: {
    type: String,
    default: ""
  },

  fechaNacimiento: {
    type: String,
    default: ""
  },

  edadJunio: {
    type: Number,
    default: 0
  },

  pendientes: {
    type: String,
    default: ""
  },

  condicion: {
    type: String,
    default: ""
  },

  recursante: {
    type: Boolean,
    default: false
  }

})

export default mongoose.model("Alumno", AlumnoSchema)