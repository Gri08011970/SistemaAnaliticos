import mongoose from "mongoose"

const matriculaAlumnoSchema = new mongoose.Schema({

  apellido: String,
  nombre: String,
  dni: String,

  legajoNumero: String,
  legajoAnio: String,

  nacionalidad: {
  type: String,
  default: ""
},

sexo: {
  type: String,
  default: ""
},

  libroMatriz: String,
  folioMatriz: String,

  curso: String,
  turno: String,

  estadoInscripcion: String,
  recursante: {
    type: Boolean,
    default: false
  },

  fechaNacimiento: String,

  materiasPendientes: [
    {
      asignatura: String,
      anio: String
    }
  ],

  condicionFinal: {
    type: String,
    default: ""
  },

  estadoMatricula: {
    type: String,
    default: "Activo"
  },

  movimientos: [
    {
      tipo: String,
      fecha: String,
      detalle: String,
      cursoAnterior: String,
      turnoAnterior: String,
      cursoNuevo: String,
      turnoNuevo: String
    }
  ],
  dniFisico: {
  type: String,
  default: "NO"
},
partidaNacimiento: {
  type: String,
  default: "NO"
},
analiticoParcial: {
  type: String,
  default: "-----"
},
observacionDocumentacion: {
  type: String,
  default: ""
},


})

export default mongoose.model("MatriculaAlumno", matriculaAlumnoSchema)