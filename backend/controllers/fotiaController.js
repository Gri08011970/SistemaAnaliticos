import {
  listarPeriodos,
  obtenerPeriodoPorId,
  crearPeriodo,
  actualizarPeriodo,

  listarDocentes,
  obtenerDocentePorId,
  crearDocente,
  actualizarDocente,

  listarInscripciones,
  obtenerInscripcionPorId,
  incorporarAsignaturaAFotia,
  actualizarInscripcion,
  retirarAsignaturaDeFotia,
  listarAcreditaciones,
  acreditarInscripcion,
} from "../services/fotiaService.js";

// =====================================================
// UTILIDAD INTERNA
// =====================================================

const responderError = (res, error) => {
  console.error("Error en FOTIA:", error);

  res.status(error.status || 500).json({
    mensaje:
      error.message ||
      "Ocurrió un error inesperado en FOTIA",
  });
};

// =====================================================
// PERÍODOS
// =====================================================

export const obtenerPeriodosController = async (
  req,
  res,
) => {
  try {
    const periodos = await listarPeriodos();

    res.json(periodos);
  } catch (error) {
    responderError(res, error);
  }
};

export const obtenerPeriodoController = async (
  req,
  res,
) => {
  try {
    const periodo = await obtenerPeriodoPorId(
      req.params.id,
    );

    res.json(periodo);
  } catch (error) {
    responderError(res, error);
  }
};

export const crearPeriodoController = async (
  req,
  res,
) => {
  try {
    const periodo = await crearPeriodo(req.body);

    res.status(201).json({
      mensaje:
        "Período de FOTIA creado correctamente",
      periodo,
    });
  } catch (error) {
    responderError(res, error);
  }
};

export const actualizarPeriodoController = async (
  req,
  res,
) => {
  try {
    const periodo = await actualizarPeriodo(
      req.params.id,
      req.body,
    );

    res.json({
      mensaje:
        "Período de FOTIA actualizado correctamente",
      periodo,
    });
  } catch (error) {
    responderError(res, error);
  }
};

// =====================================================
// DOCENTES
// =====================================================

export const obtenerDocentesController = async (
  req,
  res,
) => {
  try {
    const incluirInactivos =
      req.query.incluirInactivos === "true";

    const docentes = await listarDocentes({
      incluirInactivos,
    });

    res.json(docentes);
  } catch (error) {
    responderError(res, error);
  }
};

export const obtenerDocenteController = async (
  req,
  res,
) => {
  try {
    const docente = await obtenerDocentePorId(
      req.params.id,
    );

    res.json(docente);
  } catch (error) {
    responderError(res, error);
  }
};

export const crearDocenteController = async (
  req,
  res,
) => {
  try {
    const docente = await crearDocente(req.body);

    res.status(201).json({
      mensaje:
        "Docente de FOTIA creado correctamente",
      docente,
    });
  } catch (error) {
    responderError(res, error);
  }
};

export const actualizarDocenteController = async (
  req,
  res,
) => {
  try {
    const docente = await actualizarDocente(
      req.params.id,
      req.body,
    );

    res.json({
      mensaje:
        "Docente de FOTIA actualizado correctamente",
      docente,
    });
  } catch (error) {
    responderError(res, error);
  }
};

// =====================================================
// INSCRIPCIONES
// =====================================================

export const obtenerInscripcionesController = async (
  req,
  res,
) => {
  try {
    const activo =
      req.query.activo === undefined
        ? undefined
        : req.query.activo === "true";

    const inscripciones = await listarInscripciones({
      periodoId: req.query.periodoId,
      alumnoId: req.query.alumnoId,
      docenteId: req.query.docenteId,
      estado: req.query.estado,
      activo,
    });

    res.json(inscripciones);
  } catch (error) {
    responderError(res, error);
  }
};

export const obtenerInscripcionController = async (
  req,
  res,
) => {
  try {
    const inscripcion = await obtenerInscripcionPorId(
      req.params.id,
    );

    res.json(inscripcion);
  } catch (error) {
    responderError(res, error);
  }
};

export const incorporarAsignaturaController = async (
  req,
  res,
) => {
  try {
    const inscripcion =
      await incorporarAsignaturaAFotia(req.body);

    res.status(201).json({
      mensaje:
        "La asignatura fue incorporada a FOTIA correctamente",
      inscripcion,
    });
  } catch (error) {
    responderError(res, error);
  }
};

export const actualizarInscripcionController = async (
  req,
  res,
) => {
  try {
    const inscripcion = await actualizarInscripcion(
      req.params.id,
      req.body,
    );

    res.json({
      mensaje:
        "La inscripción de FOTIA fue actualizada correctamente",
      inscripcion,
    });
  } catch (error) {
    responderError(res, error);
  }
};

export const retirarAsignaturaController = async (
  req,
  res,
) => {
  try {
    const inscripcion =
      await retirarAsignaturaDeFotia(
        req.params.id,
        req.body.observacion || "",
      );

    res.json({
      mensaje:
        "La asignatura fue retirada únicamente de FOTIA y continúa registrada como previa institucional",
      inscripcion,
    });
  } catch (error) {
    responderError(res, error);
  }
};

// =====================================================
// ACREDITACIONES
// =====================================================

export const obtenerAcreditacionesController = async (
  req,
  res,
) => {
  try {
    const acreditaciones = await listarAcreditaciones({
      periodoId: req.query.periodoId,
      alumnoId: req.query.alumnoId,
      docenteId: req.query.docenteId,
      tipoOrigen: req.query.tipoOrigen,
      asignatura: req.query.asignatura,
    });

    res.json(acreditaciones);
  } catch (error) {
    responderError(res, error);
  }
};
// =====================================================
// ACREDITACIÓN
// =====================================================

export const acreditarInscripcionController = async (
  req,
  res,
) => {
  try {
    const resultado = await acreditarInscripcion(
      req.params.id,
      {
        fechaAcreditacion:
          req.body.fechaAcreditacion,
        docenteId: req.body.docenteId,
        observaciones:
          req.body.observaciones,
      },
    );

    res.json(resultado);
  } catch (error) {
    responderError(res, error);
  }
};