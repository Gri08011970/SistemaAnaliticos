import mongoose from "mongoose";

const fotiaPeriodoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    cicloLectivo: {
      type: Number,
      required: true,
    },

    fechaInicio: {
      type: String,
      required: true,
    },

    fechaFin: {
      type: String,
      required: true,
    },

    estado: {
      type: String,
      enum: ["Planificado", "Activo", "Cerrado"],
      default: "Planificado",
    },

    descripcion: {
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

export default mongoose.model(
  "FotiaPeriodo",
  fotiaPeriodoSchema,
);