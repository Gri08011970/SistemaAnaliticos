import mongoose from "mongoose";

const fotiaInscripcionSchema = new mongoose.Schema(
  {
    // Período de FOTIA al que pertenece
    periodoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FotiaPeriodo",
      required: true,
      index: true,
    },

    // Estudiante
    alumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatriculaAlumno",
      required: true,
      index: true,
    },

    apellido: {
      type: String,
      required: true,
      trim: true,
    },

    nombre: {
      type: String,
      default: "",
      trim: true,
    },

    curso: {
      type: String,
      required: true,
      trim: true,
    },

    turno: {
      type: String,
      default: "",
      trim: true,
    },

    // Origen de la asignatura incorporada a FOTIA:
    // puede ser una previa institucional o una materia del año en curso.
    tipoOrigen: {
      type: String,
      enum: ["Previa", "En curso"],
      required: true,
      default: "Previa",
    },

    // Sólo se completa cuando la intervención corresponde a una previa.
    // Para materias del año en curso queda en null.
    materiaPendienteId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    asignatura: {
      type: String,
      required: true,
      trim: true,
    },

    anio: {
      type: String,
      default: "",
      trim: true,
    },

    // Docente responsable
    docenteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FotiaDocente",
      default: null,
    },

    docenteNombre: {
      type: String,
      default: "",
      trim: true,
    },

    // Seguimiento del proceso
    estado: {
      type: String,
      enum: [
        "Incorporada",
        "En proceso",
        "Acreditada",
        "Suspendida",
        "Finalizada sin acreditar",
         "Objetivo alcanzado",
      ],
      default: "Incorporada",
    },

    fechaIncorporacion: {
      type: String,
      required: true,
    },

    fechaAcreditacion: {
      type: String,
      default: "",
    },

    fechaObjetivoAlcanzado: {
      type: String,
      default: "",
    },

    motivoIncorporacion: {
      type: String,
      default: "",
      trim: true,
    },

    observaciones: {
      type: String,
      default: "",
      trim: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Evita duplicar la misma asignatura del mismo estudiante
// dentro del mismo período.
fotiaInscripcionSchema.index(
  {
    periodoId: 1,
    alumnoId: 1,
    tipoOrigen: 1,
    asignatura: 1,
    anio: 1,
  },
  {
    unique: true, 
  },
);

export default mongoose.model("FotiaInscripcion", fotiaInscripcionSchema);
