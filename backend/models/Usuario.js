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
      enum: ["admin", "consulta", "estudiante", "docente"],
      default: "consulta",
    },

    alumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatriculaAlumno",
      default: null,
    },

    docenteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FotiaDocente",
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

    debeCambiarPassword: {
      type: Boolean,
      default: false,
    },

    passwordActualizadaEn: {
      type: Date,
      default: null,
    },

    generadoAutomaticamente: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Usuario", usuarioSchema);