import mongoose from "mongoose";

const filaPresentismoSchema = new mongoose.Schema(
  {
    curso: {
      type: String,
      required: true,
      trim: true,
    },

    anioCurso: {
      type: Number,
      required: true,
    },

    seccion: {
      type: Number,
      required: true,
    },

    turno: {
      type: String,
      enum: ["M", "T"],
      required: true,
    },

    // Foto de la matrícula utilizada para ese período.
    matricula: {
      type: Number,
      required: true,
      min: 0,
    },

    presentesEsperables: {
      type: Number,
      required: true,
      min: 0,
    },

    presentesReales: {
      type: Number,
      default: 0,
      min: 0,
    },

    porcentajePresentismo: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const presentismoMensualSchema = new mongoose.Schema(
  {
    mes: {
      type: String,
      required: true,
      enum: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
    },

    anio: {
      type: Number,
      required: true,
    },

    diasEfectivos: {
      type: Number,
      required: true,
      min: 0,
    },

    filas: {
      type: [filaPresentismoSchema],
      default: [],
    },

    // Totales institucionales guardados como foto del período.
    totalMatricula: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPresentesEsperables: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPresentesReales: {
      type: Number,
      required: true,
      min: 0,
    },

    porcentajeInstitucional: {
      type: Number,
      required: true,
      min: 0,
    },

    cerrado: {
      type: Boolean,
      default: false,
    },

    fechaCierre: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Sólo puede existir un registro por mes/año.
presentismoMensualSchema.index(
  {
    anio: 1,
    mes: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model(
  "PresentismoMensual",
  presentismoMensualSchema,
);