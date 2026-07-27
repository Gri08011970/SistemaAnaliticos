import mongoose from "mongoose";

import FotiaPeriodo from "../models/FotiaPeriodo.js";
import FotiaDocente from "../models/FotiaDocente.js";
import FotiaInscripcion from "../models/FotiaInscripcion.js";
import MatriculaAlumno from "../models/MatriculaAlumno.js";

// =====================================================
// UTILIDADES INTERNAS
// =====================================================

const crearError = (mensaje, status = 500) => {
  const error = new Error(mensaje);
  error.status = status;

  return error;
};

const obtenerMateriaPendiente = (alumno, materiaPendienteId) =>
  alumno.materiasPendientes.find(
    (materia) => String(materia._id) === String(materiaPendienteId),
  );

// =====================================================
// PERÍODOS
// =====================================================

export const listarPeriodos = async () => {
  return FotiaPeriodo.find({
    activo: true,
  }).sort({
    cicloLectivo: -1,
    fechaInicio: -1,
  });
};

export const obtenerPeriodoPorId = async (periodoId) => {
  const periodo = await FotiaPeriodo.findById(periodoId);

  if (!periodo) {
    throw crearError("El período de FOTIA no fue encontrado", 404);
  }

  return periodo;
};

export const crearPeriodo = async (datosPeriodo) => {
  const {
    nombre,
    cicloLectivo,
    fechaInicio,
    fechaFin,
    estado = "Planificado",
    descripcion = "",
    observaciones = "",
  } = datosPeriodo;

  if (!nombre || !cicloLectivo || !fechaInicio || !fechaFin) {
    throw crearError("Nombre, ciclo lectivo y fechas son obligatorios", 400);
  }

  if (fechaFin < fechaInicio) {
    throw crearError(
      "La fecha de finalización no puede ser anterior a la fecha de inicio",
      400,
    );
  }

  const nuevoPeriodo = new FotiaPeriodo({
    nombre,
    cicloLectivo,
    fechaInicio,
    fechaFin,
    estado,
    descripcion,
    observaciones,
  });

  await nuevoPeriodo.save();

  return nuevoPeriodo;
};

export const actualizarPeriodo = async (periodoId, cambios) => {
  const periodo = await FotiaPeriodo.findById(periodoId);

  if (!periodo) {
    throw crearError("El período de FOTIA no fue encontrado", 404);
  }

  const datosPermitidos = [
    "nombre",
    "cicloLectivo",
    "fechaInicio",
    "fechaFin",
    "estado",
    "descripcion",
    "observaciones",
    "activo",
  ];

  datosPermitidos.forEach((campo) => {
    if (cambios[campo] !== undefined) {
      periodo[campo] = cambios[campo];
    }
  });

  if (
    periodo.fechaInicio &&
    periodo.fechaFin &&
    periodo.fechaFin < periodo.fechaInicio
  ) {
    throw crearError(
      "La fecha de finalización no puede ser anterior a la fecha de inicio",
      400,
    );
  }

  await periodo.save();

  return periodo;
};

// =====================================================
// DOCENTES
// =====================================================

export const listarDocentes = async ({ incluirInactivos = false } = {}) => {
  const filtros = incluirInactivos
    ? {}
    : {
        activo: true,
      };

  return FotiaDocente.find(filtros).sort({
    apellido: 1,
    nombre: 1,
  });
};

export const obtenerDocentePorId = async (docenteId) => {
  const docente = await FotiaDocente.findById(docenteId);

  if (!docente) {
    throw crearError("El docente de FOTIA no fue encontrado", 404);
  }

  return docente;
};

export const crearDocente = async (datosDocente) => {
  const {
    apellido,
    nombre,
    dni = "",
    cargo = "",
    areas = [],
    email = "",
    telefono = "",
    observaciones = "",
  } = datosDocente;

  if (!apellido || !nombre) {
    throw crearError(
      "El apellido y el nombre del docente son obligatorios",
      400,
    );
  }

  const nuevoDocente = new FotiaDocente({
    apellido,
    nombre,
    dni,
    cargo,
    areas,
    email,
    telefono,
    observaciones,
  });

  await nuevoDocente.save();

  return nuevoDocente;
};

export const actualizarDocente = async (docenteId, cambios) => {
  const docente = await FotiaDocente.findById(docenteId);

  if (!docente) {
    throw crearError("El docente de FOTIA no fue encontrado", 404);
  }

  const datosPermitidos = [
    "apellido",
    "nombre",
    "dni",
    "cargo",
    "areas",
    "email",
    "telefono",
    "observaciones",
    "activo",
  ];

  datosPermitidos.forEach((campo) => {
    if (cambios[campo] !== undefined) {
      docente[campo] = cambios[campo];
    }
  });

  await docente.save();

  return docente;
};

// =====================================================
// INSCRIPCIONES AL FORTALECIMIENTO
// =====================================================

export const listarInscripciones = async ({
  periodoId,
  alumnoId,
  docenteId,
  estado,
  activo,
} = {}) => {
  const filtros = {};

  if (periodoId) {
    filtros.periodoId = periodoId;
  }

  if (alumnoId) {
    filtros.alumnoId = alumnoId;
  }

  if (docenteId) {
    filtros.docenteId = docenteId;
  }

  if (estado) {
    filtros.estado = estado;
  }

  if (activo !== undefined) {
    filtros.activo = activo;
  }

  return FotiaInscripcion.find(filtros)
    .populate("periodoId", "nombre cicloLectivo fechaInicio fechaFin estado")
    .populate("docenteId", "apellido nombre cargo areas activo")
    .sort({
      apellido: 1,
      nombre: 1,
      asignatura: 1,
    });
};

export const obtenerInscripcionPorId = async (inscripcionId) => {
  const inscripcion = await FotiaInscripcion.findById(inscripcionId)
    .populate("periodoId")
    .populate("docenteId");

  if (!inscripcion) {
    throw crearError("La inscripción de FOTIA no fue encontrada", 404);
  }

  return inscripcion;
};

// Incorpora una materia concreta del estudiante a un período.
// No modifica materiasPendientes de Matrícula.
export const incorporarAsignaturaAFotia = async (datosInscripcion) => {
  const {
    periodoId,
    alumnoId,
    materiaPendienteId,
    docenteId = null,
    fechaIncorporacion,
    motivoIncorporacion = "",
    observaciones = "",
  } = datosInscripcion;

  if (!periodoId || !alumnoId || !materiaPendienteId || !fechaIncorporacion) {
    throw crearError(
      "Período, estudiante, asignatura y fecha de incorporación son obligatorios",
      400,
    );
  }

  const periodo = await FotiaPeriodo.findById(periodoId);

  if (!periodo || !periodo.activo) {
    throw crearError("El período de FOTIA no existe o no está disponible", 404);
  }

  if (periodo.estado === "Cerrado") {
    throw crearError(
      "No se pueden incorporar estudiantes a un período cerrado",
      400,
    );
  }

  const alumno = await MatriculaAlumno.findById(alumnoId);

  if (!alumno) {
    throw crearError("El estudiante de Matrícula no fue encontrado", 404);
  }

  const materiaPendiente = obtenerMateriaPendiente(alumno, materiaPendienteId);

  if (!materiaPendiente) {
    throw crearError(
      "La asignatura seleccionada no figura entre las previas del estudiante",
      404,
    );
  }

  let docente = null;

  if (docenteId) {
    docente = await FotiaDocente.findById(docenteId);

    if (!docente || !docente.activo) {
      throw crearError(
        "El docente seleccionado no existe o no está activo",
        404,
      );
    }
  }

  const inscripcionExistente = await FotiaInscripcion.findOne({
    periodoId,
    alumnoId,
    materiaPendienteId,
  });

  if (inscripcionExistente) {
    if (!inscripcionExistente.activo) {
      inscripcionExistente.activo = true;
      inscripcionExistente.estado = "Incorporada";
      inscripcionExistente.fechaIncorporacion = fechaIncorporacion;
      inscripcionExistente.motivoIncorporacion = motivoIncorporacion;
      inscripcionExistente.observaciones = observaciones;

      if (docente) {
        inscripcionExistente.docenteId = docente._id;
        inscripcionExistente.docenteNombre = `${docente.apellido} ${docente.nombre}`;
      }

      await inscripcionExistente.save();

      return inscripcionExistente;
    }

    throw crearError(
      "Esta asignatura ya está incorporada al período seleccionado",
      409,
    );
  }

  const apellidoLimpio = String(alumno.apellido || "").trim();

  const nombreLimpio = String(alumno.nombre || "").trim();

  const nombreValido =
    nombreLimpio && nombreLimpio.toLowerCase() !== "sin nombre";

  const nuevaInscripcion = new FotiaInscripcion({
    periodoId: periodo._id,

    alumnoId: alumno._id,

    apellido: apellidoLimpio || "Sin apellido",

    nombre: nombreValido ? nombreLimpio : "",

    curso: alumno.curso || "Sin curso",

    turno: alumno.turno || "",

    materiaPendienteId: materiaPendiente._id,
    asignatura: materiaPendiente.asignatura,
    anio: materiaPendiente.anio,

    docenteId: docente?._id || null,
    docenteNombre: docente ? `${docente.apellido} ${docente.nombre}` : "",

    estado: "Incorporada",
    fechaIncorporacion,
    motivoIncorporacion,
    observaciones,
    activo: true,
  });

  try {
    await nuevaInscripcion.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw crearError(
        "Esta asignatura ya fue incorporada a ese período de FOTIA",
        409,
      );
    }

    if (error?.name === "ValidationError") {
      throw crearError(
        "No se pudo guardar la inscripción porque faltan datos obligatorios del estudiante.",
        400,
      );
    }

    throw error;
  }

  return nuevaInscripcion;
};

export const actualizarInscripcion = async (inscripcionId, cambios) => {
  const inscripcion = await FotiaInscripcion.findById(inscripcionId);

  if (!inscripcion) {
    throw crearError("La inscripción de FOTIA no fue encontrada", 404);
  }

  if (inscripcion.estado === "Acreditada") {
    throw crearError(
      "Una acreditación confirmada no puede modificarse desde la edición común",
      400,
    );
  }

  if (cambios.docenteId !== undefined) {
    if (!cambios.docenteId) {
      inscripcion.docenteId = null;
      inscripcion.docenteNombre = "";
    } else {
      const docente = await FotiaDocente.findById(cambios.docenteId);

      if (!docente || !docente.activo) {
        throw crearError(
          "El docente seleccionado no existe o no está activo",
          404,
        );
      }

      inscripcion.docenteId = docente._id;
      inscripcion.docenteNombre = `${docente.apellido} ${docente.nombre}`;
    }
  }

  const datosPermitidos = [
    "estado",
    "fechaIncorporacion",
    "motivoIncorporacion",
    "observaciones",
    "activo",
  ];

  datosPermitidos.forEach((campo) => {
    if (cambios[campo] !== undefined) {
      inscripcion[campo] = cambios[campo];
    }
  });

  // La acreditación se confirma solamente mediante
  // acreditarInscripcion().
  if (inscripcion.estado === "Acreditada") {
    throw crearError(
      "Para acreditar una asignatura debe utilizarse la confirmación de acreditación",
      400,
    );
  }

  await inscripcion.save();

  return inscripcion;
};

// Retira una asignatura del fortalecimiento actual.
// No elimina la previa institucional.
export const retirarAsignaturaDeFotia = async (
  inscripcionId,
  observacion = "",
) => {
  const inscripcion = await FotiaInscripcion.findById(inscripcionId);

  if (!inscripcion) {
    throw crearError("La inscripción de FOTIA no fue encontrada", 404);
  }

  if (inscripcion.estado === "Acreditada") {
    throw crearError(
      "Una asignatura acreditada no puede retirarse del historial",
      400,
    );
  }

  inscripcion.activo = false;
  inscripcion.estado = "Suspendida";

  if (observacion) {
    inscripcion.observaciones = observacion;
  }

  await inscripcion.save();

  return inscripcion;
};

// =====================================================
// ACREDITACIÓN
// =====================================================

// Confirma la acreditación y elimina únicamente esa materia
// de materiasPendientes del estudiante.
//
// La inscripción de FOTIA permanece guardada como historial.
export const acreditarInscripcion = async (
  inscripcionId,
  { fechaAcreditacion, docenteId, observaciones },
) => {
  if (!fechaAcreditacion) {
    throw crearError("La fecha de acreditación es obligatoria", 400);
  }

  if (!docenteId) {
    throw crearError("El docente responsable es obligatorio", 400);
  }

  const session = await mongoose.startSession();

  try {
    let inscripcionAcreditada;
    let alumnoActualizado;

    await session.withTransaction(async () => {
      const inscripcion =
        await FotiaInscripcion.findById(inscripcionId).session(session);

      if (!inscripcion) {
        throw crearError("La inscripción de FOTIA no fue encontrada", 404);
      }

      if (inscripcion.estado === "Acreditada") {
        throw crearError("Esta asignatura ya fue acreditada", 409);
      }

      const docente = await FotiaDocente.findById(docenteId).session(session);

      if (!docente || !docente.activo) {
        throw crearError(
          "El docente seleccionado no existe o no está activo",
          404,
        );
      }

      const alumno = await MatriculaAlumno.findById(
        inscripcion.alumnoId,
      ).session(session);

      if (!alumno) {
        throw crearError("El estudiante de Matrícula no fue encontrado", 404);
      }

      const materiaPendiente = obtenerMateriaPendiente(
        alumno,
        inscripcion.materiaPendienteId,
      );

      if (!materiaPendiente) {
        throw crearError(
          "La asignatura ya no figura entre las previas del estudiante",
          409,
        );
      }

      inscripcion.estado = "Acreditada";
      inscripcion.fechaAcreditacion = fechaAcreditacion;
      inscripcion.docenteId = docente._id;
      inscripcion.docenteNombre = `${docente.apellido} ${docente.nombre}`;
      inscripcion.activo = true;

      if (observaciones !== undefined) {
        inscripcion.observaciones = observaciones;
      }

      await inscripcion.save({
        session,
      });

      alumno.materiasPendientes = alumno.materiasPendientes.filter(
        (materia) =>
          String(materia._id) !== String(inscripcion.materiaPendienteId),
      );

      alumnoActualizado = await alumno.save({
        session,
      });

      inscripcionAcreditada = inscripcion;
    });

    return {
      mensaje:
        "La asignatura fue acreditada y dejó de figurar como previa institucional",
      inscripcion: inscripcionAcreditada,
      alumno: alumnoActualizado,
    };
  } finally {
    await session.endSession();
  }
};
