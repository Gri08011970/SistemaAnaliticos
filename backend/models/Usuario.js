import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    nombre: {
      type: String,
      required: true,
    },

    rol: {
      type: String,
      enum: ["admin", "consulta", "estudiante"],
      default: "consulta",
    },

    alumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatriculaAlumno",
      default: null,
    },

    ultimoAcceso: {
      type: Date,
      default: null,
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
  "Usuario",
  usuarioSchema,
);