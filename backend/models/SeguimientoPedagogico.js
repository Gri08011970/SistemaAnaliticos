import mongoose from "mongoose";

const SeguimientoPedagogicoSchema = new mongoose.Schema(
  {
    alumnoId: {
      type: String,
      required: true,
      trim: true,
    },

    curso: {
      type: String,
      required: true,
      trim: true,
    },

    asignatura: {
      type: String,
      required: true,
      trim: true,
    },

    periodo: {
      type: String,
      required: true,
      trim: true,
    },

    conceptual: {
      type: String,
      enum: ["-", "TEA", "TEP", "TED"],
      default: "-",
    },

    nota: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

SeguimientoPedagogicoSchema.index(
  {
    alumnoId: 1,
    curso: 1,
    asignatura: 1,
    periodo: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model(
  "SeguimientoPedagogico",
  SeguimientoPedagogicoSchema,
);