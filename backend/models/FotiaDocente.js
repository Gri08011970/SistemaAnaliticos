import mongoose from "mongoose";

const fotiaDocenteSchema = new mongoose.Schema(
  {
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

    dni: {
      type: String,
      default: "",
      trim: true,
    },

    cargo: {
      type: String,
      default: "",
      trim: true,
    },

    areas: [
      {
        type: String,
        trim: true,
      },
    ],

    email: {
      type: String,
      default: "",
      trim: true,
    },

    telefono: {
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
  }
);

export default mongoose.model(
  "FotiaDocente",
  fotiaDocenteSchema
);