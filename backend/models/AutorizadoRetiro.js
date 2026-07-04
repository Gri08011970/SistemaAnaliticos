import mongoose from "mongoose";

const autorizadoRetiroSchema = new mongoose.Schema(
  {
    alumnoId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    curso: {
      type: String,
      required: true,
    },

    apellidoNombre: {
      type: String,
      required: true,
    },

    dniAlumno: {
      type: String,
      default: "",
    },

    adultoAutorizado: {
      type: String,
      required: true,
    },

    vinculo: {
      type: String,
      required: true,
    },

    vinculoOtro: {
      type: String,
      default: "",
    },

    dniAdultoResponsable: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AutorizadoRetiro",
  autorizadoRetiroSchema
);