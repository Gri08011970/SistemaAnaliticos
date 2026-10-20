import PresentismoMensual from "../models/PresentismoMensual.js";

const crearError = (mensaje, status = 500) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

// =====================================================
// OBTENER PRESENTISMO POR MES Y AÑO
// =====================================================

export const obtenerPresentismoMensual = async (
  mes,
  anio,
) => {
  if (!mes || !anio) {
    throw crearError(
      "Debe indicar mes y año.",
      400,
    );
  }

  const registro = await PresentismoMensual.findOne({
    mes,
    anio: Number(anio),
  }).lean();

  return registro;
};

// =====================================================
// GUARDAR / ACTUALIZAR PRESENTISMO
// =====================================================

export const guardarPresentismoMensual = async ({
  mes,
  anio,
  diasEfectivos,
  filas = [],
}) => {
  if (!mes || !anio) {
    throw crearError(
      "Debe indicar mes y año.",
      400,
    );
  }

  const dias = Number(diasEfectivos);

  if (
    !Number.isFinite(dias) ||
    dias < 0
  ) {
    throw crearError(
      "La cantidad de días efectivos no es válida.",
      400,
    );
  }

  if (!Array.isArray(filas) || filas.length !== 24) {
    throw crearError(
      "El presentismo debe contener los 24 cursos.",
      400,
    );
  }

  const filasNormalizadas = filas.map((fila) => {
    const matricula = Number(fila.matricula) || 0;
    const reales = Number(fila.presentesReales) || 0;

    const esperables = matricula * dias;

    const porcentaje =
      esperables > 0
        ? (reales / esperables) * 100
        : 0;

    return {
      curso: fila.curso,
      anioCurso: Number(fila.anioCurso),
      seccion: Number(fila.seccion),
      turno: fila.turno,
      matricula,
      presentesEsperables: esperables,
      presentesReales: reales,
      porcentajePresentismo: porcentaje,
    };
  });

  const totalMatricula = filasNormalizadas.reduce(
    (total, fila) => total + fila.matricula,
    0,
  );

  const totalPresentesEsperables =
    filasNormalizadas.reduce(
      (total, fila) =>
        total + fila.presentesEsperables,
      0,
    );

  const totalPresentesReales =
    filasNormalizadas.reduce(
      (total, fila) =>
        total + fila.presentesReales,
      0,
    );

  const porcentajeInstitucional =
    totalPresentesEsperables > 0
      ? (
          totalPresentesReales /
          totalPresentesEsperables
        ) * 100
      : 0;

  const existente =
    await PresentismoMensual.findOne({
      mes,
      anio: Number(anio),
    });

  if (existente?.cerrado) {
    throw crearError(
      "Este período ya está cerrado y no puede modificarse.",
      409,
    );
  }

  const registro =
    await PresentismoMensual.findOneAndUpdate(
      {
        mes,
        anio: Number(anio),
      },
      {
        $set: {
          diasEfectivos: dias,
          filas: filasNormalizadas,
          totalMatricula,
          totalPresentesEsperables,
          totalPresentesReales,
          porcentajeInstitucional,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

  return {
    mensaje: existente
      ? "El presentismo mensual fue actualizado correctamente."
      : "El presentismo mensual fue guardado correctamente.",
    presentismo: registro,
  };
};