import mongoose from "mongoose";

const domicilioTelefonoSchema = new mongoose.Schema(
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

    dni: {
      type: String,
      default: "",
    },

    domicilio: {
      type: String,
      required: true,
    },

    telefono: {
      type: String,
      default: "",
    },

    nombreResponsable: {
      type: String,
     default: "",
    },

    adultoResponsable: {
      type: String,
      enum: ["MADRE", "PADRE", "TUTOR"],
      default: "MADRE",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DomicilioTelefono",
  domicilioTelefonoSchema
);