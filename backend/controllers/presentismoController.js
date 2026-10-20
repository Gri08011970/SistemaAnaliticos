import {
  guardarPresentismoMensual,
  obtenerPresentismoMensual,
} from "../services/presentismoService.js";

const responderError = (res, error) => {
  console.error(
    "Error en Presentismo:",
    error,
  );

  res.status(error.status || 500).json({
    mensaje:
      error.message ||
      "Ocurrió un error en Presentismo.",
  });
};

// =====================================================
// GET - CONSULTAR PERÍODO
// =====================================================

export const obtenerPresentismoController = async (
  req,
  res,
) => {
  try {
    const { mes, anio } = req.query;

    const presentismo =
      await obtenerPresentismoMensual(
        mes,
        anio,
      );

    res.json({
      presentismo,
    });
  } catch (error) {
    responderError(res, error);
  }
};

// =====================================================
// POST - GUARDAR / ACTUALIZAR
// =====================================================

export const guardarPresentismoController = async (
  req,
  res,
) => {
  try {
    const resultado =
      await guardarPresentismoMensual(
        req.body,
      );

    res.json(resultado);
  } catch (error) {
    responderError(res, error);
  }
};