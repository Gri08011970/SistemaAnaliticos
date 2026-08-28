import mongoose from "mongoose";

const seguimientoSchema = new mongoose.Schema(
  {
    fecha: {
      type: String,
      default: "",
    },

    participantes: {
      type: String,
      default: "",
    },

    avances: {
      type: String,
      default: "",
    },

    dificultades: {
      type: String,
      default: "",
    },

    nuevosAcuerdos: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const acompanamientoInstitucionalSchema =
  new mongoose.Schema(
    {
      alumnoId: {
        type: String,
        required: true,
        trim: true,
      },

      periodo: {
        type: String,
        required: true,
        trim: true,
      },

      curso: {
        type: String,
        default: "",
        trim: true,
      },

      lecturaCompartida: {
        type: String,
        default: "",
      },

      fortalezasObservadas: {
        type: String,
        default: "",
      },

      saberesPrioritarios: {
        type: Map,
        of: String,
        default: {},
      },

      acuerdosPedagogicos: {
        type: [String],
        default: [],
      },

      otroAcuerdo: {
        type: String,
        default: "",
      },

      accionesImplementar: {
        type: String,
        default: "",
      },

      responsables: {
        docentes: {
          type: String,
          default: "",
        },

        equipoConduccion: {
          type: String,
          default: "",
        },

        equipoFotiaForte: {
          type: String,
          default: "",
        },

        otrosActores: {
          type: String,
          default: "",
        },

        fechaRevision: {
          type: String,
          default: "",
        },
      },

      seguimientos: {
        type: [seguimientoSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );

/*
 * Un estudiante puede tener un registro distinto
 * para cada período institucional.
 */
acompanamientoInstitucionalSchema.index(
  {
    alumnoId: 1,
    periodo: 1,
  },
  {
    unique: true,
  },
);

const AcompanamientoInstitucional =
  mongoose.model(
    "AcompanamientoInstitucional",
    acompanamientoInstitucionalSchema,
  );

export default AcompanamientoInstitucional;