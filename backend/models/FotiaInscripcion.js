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
      required: true,
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

    // Materia seleccionada para trabajar
    materiaPendienteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    materiaPendienteId: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("FotiaInscripcion", fotiaInscripcionSchema);
