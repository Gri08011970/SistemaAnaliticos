import mongoose from "mongoose"

const alumnoSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  dni: {
    type: String,
    required: true
  },

  libro: {
    type: String,
    default: ""
  },

  folio: {
    type: String,
    default: ""
  },

  ultimoAnio: {
  type: String,
  default: ""
 },

  fecha: {
  type: String,
  default: ""
 },

  estado: {
    type: String,
    default: "Pendiente"
  },

  carpeta: {
    type: String,
    default: "---"
  },

  seleccionado: {
    type: Boolean,
    default: false
  }

})

const Alumno = mongoose.model("Alumno", alumnoSchema)

export default Alumno