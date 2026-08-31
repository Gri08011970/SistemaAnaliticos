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

function obtenerNombreCompletoFotia(alumno) {
  const apellido = String(alumno.apellido || "").trim();
  const nombre = String(alumno.nombre || "").trim();

  // Caso normal
  if (apellido && nombre) {
    return {
      apellido,
      nombre,
    };
  }

  // Caso de Matrícula:
  // todo el nombre quedó guardado en "apellido"
  if (apellido && !nombre) {
    return {
      apellido,
      nombre: "",
    };
  }

  const apellidoNombre = String(alumno.apellidoNombre || "").trim();

  if (!apellidoNombre) {
    return {
      apellido: "Sin apellido",
      nombre: "Sin nombre",
    };
  }

  const partes = apellidoNombre.split(",").map((parte) => parte.trim());

  if (partes.length === 2) {
    return {
      apellido: partes[0],
      nombre: partes[1],
    };
  }

  return {
    apellido: apellidoNombre,
    nombre: "",
  };
}
const obtenerMateriaPendiente = (alumno, materiaPendienteId) =>
  alumno.materiasPendientes.find(
    (materia) => String(materia._id) === String(materiaPendienteId),
  );
const esAsignaturaFotiaValida = (valor = "") => {
  const asignatura = String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const valoresInvalidos = [
    "",
    "-",
    "----------",
    "---------",
    "--------",
    "ninguna",
    "sin previas",
    "sin previa",
    "no posee",
  ];

  return !valoresInvalidos.includes(asignatura);
};
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

// =====================================================
// LISTADO DE ACREDITACIONES
// =====================================================

export const listarAcreditaciones = async ({
  periodoId,
  alumnoId,
  docenteId,
  tipoOrigen,
  asignatura,
} = {}) => {
  const filtro = {
    estado: "Acreditada",
    activo: true,
  };

  if (periodoId) {
    filtro.periodoId = periodoId;
  }

  if (alumnoId) {
    filtro.alumnoId = alumnoId;
  }

  if (docenteId) {
    filtro.docenteId = docenteId;
  }

  if (tipoOrigen) {
    filtro.tipoOrigen = tipoOrigen;
  }

  if (asignatura) {
    filtro.asignatura = {
      $regex: asignatura,
      $options: "i",
    };
  }

  return FotiaInscripcion.find(filtro).populate("periodoId").sort({
    fechaAcreditacion: -1,
    apellido: 1,
    nombre: 1,
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
    tipoOrigen = "Previa",
    materiaPendienteId,
    asignatura,
    anio,
    docenteId,
    fechaIncorporacion,
    motivoIncorporacion,
    observaciones,
  } = datosInscripcion;

  if (!periodoId || !alumnoId || !fechaIncorporacion) {
    throw crearError(
      "Período, estudiante y fecha de incorporación son obligatorios",
      400,
    );
  }

  if (tipoOrigen === "Previa" && !materiaPendienteId) {
    throw crearError("La asignatura previa seleccionada es obligatoria", 400);
  }

  if (tipoOrigen === "En curso" && !String(asignatura || "").trim()) {
    throw crearError("La asignatura del año en curso es obligatoria", 400);
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

  console.log("ALUMNO FOTIA");
  console.log(alumno);

  if (!alumno) {
    throw crearError("El estudiante de Matrícula no fue encontrado", 404);
  }

  let materiaPendiente = null;

  if (tipoOrigen === "Previa") {
    materiaPendiente = obtenerMateriaPendiente(alumno, materiaPendienteId);

    if (!materiaPendiente) {
      throw crearError(
        "La asignatura seleccionada no figura entre las previas del estudiante",
        404,
      );
    }

    if (!esAsignaturaFotiaValida(materiaPendiente?.asignatura)) {
      throw crearError(
        "El registro seleccionado indica que el estudiante no posee asignaturas previas.",
        400,
      );
    }
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

  const asignaturaBuscada =
    tipoOrigen === "Previa"
      ? materiaPendiente?.asignatura
      : String(asignatura || "").trim();

  const anioBuscado =
    tipoOrigen === "Previa"
      ? String(materiaPendiente?.anio || "").trim()
      : String(anio || "").trim();

  const inscripcionExistente = await FotiaInscripcion.findOne({
    periodoId,
    alumnoId,
    tipoOrigen,
    asignatura: asignaturaBuscada,
    anio: anioBuscado,
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

  const datosNombre = obtenerNombreCompletoFotia(alumno);

  const asignaturaFinal =
    tipoOrigen === "Previa"
      ? materiaPendiente?.asignatura
      : String(asignatura || "").trim();

  const anioFinal =
    tipoOrigen === "Previa"
      ? String(materiaPendiente?.anio || "").trim()
      : String(anio || "").trim();

  if (!esAsignaturaFotiaValida(asignaturaFinal)) {
    throw crearError(
      "La asignatura seleccionada no es válida para FOTIA.",
      400,
    );
  }

  if (!["Previa", "En curso"].includes(tipoOrigen)) {
    throw crearError("El origen de la asignatura no es válido.", 400);
  }

  const nuevaInscripcion = new FotiaInscripcion({
    periodoId: periodo._id,

    alumnoId: alumno._id,

    apellido: datosNombre.apellido,

    nombre: datosNombre.nombre,

    curso: alumno.curso || "Sin curso",

    turno: alumno.turno || "",

    tipoOrigen,

    materiaPendienteId: tipoOrigen === "Previa" ? materiaPendiente?._id : null,

    asignatura: asignaturaFinal,

    anio: anioFinal,

    docenteId: docente?._id || null,

    docenteNombre: docente
      ? `${docente.apellido} ${docente.nombre}`.trim()
      : "",

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
      console.error("DUPLICADO FOTIA EN MONGODB:", {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        mensaje: error.message,
      });

      throw crearError(
        "Esta asignatura ya fue incorporada a ese período de FOTIA",
        409,
      );
    }

    if (error?.name === "ValidationError") {
      console.error(
        "Error de validación al guardar inscripción FOTIA:",
        error.errors,
      );

      throw crearError(
        "No se pudo guardar la inscripción porque faltan datos obligatorios.",
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
      inscripcion.docenteNombre =
        `${docente.apellido} ${docente.nombre}`.trim();
    }
  }

  if (cambios.asignatura !== undefined) {
    const asignaturaLimpia = String(cambios.asignatura || "").trim();

    if (!asignaturaLimpia) {
      throw crearError("La asignatura es obligatoria", 400);
    }

    if (!esAsignaturaFotiaValida(asignaturaLimpia)) {
      throw crearError(
        "La asignatura seleccionada no es válida para FOTIA",
        400,
      );
    }

    inscripcion.asignatura = asignaturaLimpia;
  }

  if (cambios.anio !== undefined) {
    inscripcion.anio = String(cambios.anio || "").trim();
  }

  if (
    cambios.tipoOrigen !== undefined &&
    cambios.tipoOrigen !== inscripcion.tipoOrigen
  ) {
    throw crearError(
      "El origen de la asignatura no puede modificarse desde la edición común. Retirá la inscripción y volvé a incorporarla con el origen correcto.",
      400,
    );
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
// ELIMINACIÓN ADMINISTRATIVA DE UN ESTUDIANTE
// =====================================================

// Elimina todas las inscripciones de un estudiante dentro
// de un período concreto de FOTIA.
//
// Esta acción elimina únicamente los registros del período FOTIA.
// No modifica materiasPendientes de Matrícula.
// Las acreditaciones ya confirmadas no se restauran.
export const eliminarEstudianteDelPeriodoFotia = async (
  periodoId,
  alumnoId,
) => {
  if (!periodoId || !alumnoId) {
    throw crearError("El período y el estudiante son obligatorios", 400);
  }

  const session = await mongoose.startSession();

  try {
    let cantidadEliminada = 0;

    await session.withTransaction(async () => {
      const periodo = await FotiaPeriodo.findById(periodoId).session(session);

      if (!periodo) {
        throw crearError("El período de FOTIA no fue encontrado", 404);
      }

      const inscripciones = await FotiaInscripcion.find({
        periodoId,
        alumnoId,
      }).session(session);

      if (inscripciones.length === 0) {
        throw crearError(
          "El estudiante no posee registros en este período de FOTIA",
          404,
        );
      }

      const resultadoEliminacion = await FotiaInscripcion.deleteMany(
        {
          periodoId,
          alumnoId,
        },
        {
          session,
        },
      );

      cantidadEliminada = resultadoEliminacion.deletedCount || 0;
    });

    return {
      mensaje:
        "El estudiante fue eliminado correctamente del período de FOTIA.",
      cantidadEliminada,
      alumnoId,
      periodoId,
    };
  } finally {
    await session.endSession();
  }
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

      if (inscripcion.tipoOrigen !== "Previa") {
        throw crearError(
          "Esta acción está reservada para acreditaciones FORTE de asignaturas previas.",
          400,
        );
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
        "La asignatura fue acreditada y dejó de figurar como previa institucional.",
      inscripcion: inscripcionAcreditada,
      alumno: alumnoActualizado,
    };

  } finally {
    await session.endSession();
  }
};
  // =====================================================
// FOTIA - OBJETIVO DE ALFABETIZACIÓN ALCANZADO
// =====================================================

// Marca como alcanzado el objetivo de alfabetización.
//
// IMPORTANTE:
// - Sólo admite inscripciones FOTIA de materias "En curso".
// - No acredita asignaturas.
// - No modifica materiasPendientes.
// - No modifica Matrícula.
// - No genera una acreditación FORTE.
export const marcarObjetivoAlcanzado = async (
  inscripcionId,
  { fechaObjetivoAlcanzado, docenteId, observaciones },
) => {
  if (!fechaObjetivoAlcanzado) {
    throw crearError(
      "La fecha en que se alcanzó el objetivo es obligatoria",
      400,
    );
  }

  const inscripcion =
    await FotiaInscripcion.findById(inscripcionId);

  if (!inscripcion) {
    throw crearError(
      "La inscripción FOTIA no fue encontrada",
      404,
    );
  }

  // Seguridad: esta acción jamás puede utilizarse
  // para una asignatura previa de FORTE.
  if (inscripcion.tipoOrigen !== "En curso") {
    throw crearError(
      "Esta acción corresponde únicamente al seguimiento FOTIA.",
      400,
    );
  }

  const asignaturaNormalizada = String(
    inscripcion.asignatura || "",
  )
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  // FOTIA alfabetización trabaja exclusivamente
  // con Prácticas del Lenguaje.
  if (asignaturaNormalizada !== "practicas del lenguaje") {
    throw crearError(
      "El objetivo de alfabetización sólo puede registrarse para Prácticas del Lenguaje.",
      400,
    );
  }

  if (inscripcion.estado === "Objetivo alcanzado") {
    throw crearError(
      "El estudiante ya figura con el objetivo de alfabetización alcanzado.",
      409,
    );
  }

  // El docente es opcional al marcar el objetivo.
  // Si viene informado, verificamos que exista y esté activo.
  if (docenteId) {
    const docente = await FotiaDocente.findById(docenteId);

    if (!docente || !docente.activo) {
      throw crearError(
        "El docente seleccionado no existe o no está activo",
        404,
      );
    }

    inscripcion.docenteId = docente._id;
    inscripcion.docenteNombre =
      `${docente.apellido} ${docente.nombre}`;
  }

  inscripcion.estado = "Objetivo alcanzado";
  inscripcion.fechaObjetivoAlcanzado =
    fechaObjetivoAlcanzado;

  inscripcion.activo = true;

  if (observaciones !== undefined) {
    inscripcion.observaciones = observaciones;
  }

  await inscripcion.save();

  return {
    mensaje:
      "El estudiante alcanzó el objetivo de alfabetización.",
    inscripcion,
  };
}; 
// =====================================================
// FOTIA - REABRIR SEGUIMIENTO DE ALFABETIZACIÓN
// =====================================================

// Reabre una trayectoria FOTIA marcada previamente
// como "Objetivo alcanzado".
//
// IMPORTANTE:
// - No modifica Matrícula.
// - No modifica materiasPendientes.
// - No altera acreditaciones FORTE.
export const reabrirSeguimientoFotia = async (
  inscripcionId,
) => {
  const inscripcion =
    await FotiaInscripcion.findById(inscripcionId);

  if (!inscripcion) {
    throw crearError(
      "La inscripción FOTIA no fue encontrada",
      404,
    );
  }

  if (inscripcion.tipoOrigen !== "En curso") {
    throw crearError(
      "Esta acción corresponde únicamente a trayectorias FOTIA.",
      400,
    );
  }

  const asignaturaNormalizada = String(
    inscripcion.asignatura || "",
  )
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (asignaturaNormalizada !== "practicas del lenguaje") {
    throw crearError(
      "Sólo pueden reabrirse trayectorias FOTIA de Prácticas del Lenguaje.",
      400,
    );
  }

  if (inscripcion.estado !== "Objetivo alcanzado") {
    throw crearError(
      "La trayectoria no se encuentra finalizada como objetivo alcanzado.",
      409,
    );
  }

  inscripcion.estado = "En proceso";
  inscripcion.fechaObjetivoAlcanzado = "";
  inscripcion.activo = true;

  await inscripcion.save();

  return {
    mensaje:
      "El seguimiento FOTIA fue reabierto correctamente.",
    inscripcion,
  };
};