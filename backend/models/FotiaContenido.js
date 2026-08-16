import mongoose from "mongoose";

const recursoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: [
        "texto",
        "pdf",
        "archivo",
        "enlace",
        "audio",
        "video",
        "imagen",
      ],
      required: true,
    },

    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    url: {
      type: String,
      default: "",
      trim: true,
    },

    nombreArchivo: {
      type: String,
      default: "",
      trim: true,
    },

    imprimible: {
      type: Boolean,
      default: false,
    },

    orden: {
      type: Number,
      default: 0,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const actividadSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    consigna: {
      type: String,
      default: "",
      trim: true,
    },

    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },

    fechaEntrega: {
      type: Date,
      default: null,
    },

    recursos: {
      type: [recursoSchema],
      default: [],
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const unidadSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    orden: {
      type: Number,
      default: 0,
    },

    recursos: {
      type: [recursoSchema],
      default: [],
    },

    actividades: {
      type: [actividadSchema],
      default: [],
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const fotiaContenidoSchema =
  new mongoose.Schema(
    {
      periodoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FotiaPeriodo",
        required: true,
      },

      docenteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FotiaDocente",
        required: true,
      },

      asignatura: {
        type: String,
        required: true,
        trim: true,
      },

      curso: {
        type: String,
        default: "",
        trim: true,
      },

      mensajeDocente: {
        texto: {
          type: String,
          default: "",
          trim: true,
        },

        audioUrl: {
          type: String,
          default: "",
          trim: true,
        },

        audioNombreArchivo: {
          type: String,
          default: "",
          trim: true,
        },

        actualizadoEn: {
          type: Date,
          default: null,
        },
      },

      unidades: {
        type: [unidadSchema],
        default: [],
      },

      recursosGenerales: {
        type: [recursoSchema],
        default: [],
      },

      fechasImportantes: [
        {
          titulo: {
            type: String,
            required: true,
          },

          descripcion: {
            type: String,
            default: "",
          },

          fecha: {
            type: Date,
            required: true,
          },
        },
      ],

      publicado: {
        type: Boolean,
        default: false,
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

fotiaContenidoSchema.index(
  {
    periodoId: 1,
    docenteId: 1,
    asignatura: 1,
    curso: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "FotiaContenido",
  fotiaContenidoSchema
);