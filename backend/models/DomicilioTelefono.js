import mongoose from "mongoose";

const contactoSchema = new mongoose.Schema(
  {
    nombreResponsable: {
      type: String,
      default: "",
      trim: true,
    },

    vinculo: {
      type: String,
      enum: [
        "MADRE",
        "PADRE",
        "TUTOR",
        "ABUELA",
        "ABUELO",
        "HERMANO",
        "HERMANA",
        "TIA",
        "TIO",
        "OTRO",
      ],
      default: "MADRE",
    },

    vinculoOtro: {
      type: String,
      default: "",
      trim: true,
    },

    telefono: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  },
);

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

    /*
     * Nuevo formato:
     * permite guardar varios teléfonos/contactos
     * asociados al mismo estudiante.
     */
    contactos: {
      type: [contactoSchema],
      default: [],
    },

    /*
     * Campos históricos.
     *
     * Se conservan temporalmente para mantener
     * compatibilidad con los registros ya guardados.
     */
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
  },
);

export default mongoose.model(
  "DomicilioTelefono",
  domicilioTelefonoSchema,
);