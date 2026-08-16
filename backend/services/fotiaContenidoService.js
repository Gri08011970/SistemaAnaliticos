import FotiaContenido from "../models/FotiaContenido.js";
import FotiaInscripcion from "../models/FotiaInscripcion.js";

// =====================================================
// OBTENER ESPACIOS DEL DOCENTE
// =====================================================

export const listarEspaciosDocente = async ({
  docenteId,
} = {}) => {
  if (!docenteId) {
    const error = new Error(
      "No se recibió el docente vinculado."
    );
    error.status = 400;
    throw error;
  }

  const inscripciones =
    await FotiaInscripcion.find({
      docenteId,
      activo: true,
    })
      .populate(
        "periodoId",
        "nombre cicloLectivo fechaInicio fechaFin estado"
      )
      .sort({
        asignatura: 1,
        curso: 1,
      });

  const mapa = new Map();

  for (const inscripcion of inscripciones) {
    const periodoId =
      inscripcion.periodoId?._id?.toString() ||
      inscripcion.periodoId?.toString() ||
      "";

    const asignatura =
      inscripcion.asignatura || "";

    const curso =
      inscripcion.curso || "";

    const clave =
      `${periodoId}-${asignatura}-${curso}`;

    if (!mapa.has(clave)) {
      mapa.set(clave, {
        periodoId:
          inscripcion.periodoId || null,

        asignatura,

        curso,

        docenteId:
          inscripcion.docenteId,

        cantidadEstudiantes: 0,
      });
    }

    mapa.get(clave).cantidadEstudiantes += 1;
  }

  return Array.from(mapa.values());
};

// =====================================================
// OBTENER O CREAR AULA
// =====================================================

export const obtenerOCrearContenidoAula = async ({
  periodoId,
  docenteId,
  asignatura,
  curso = "",
}) => {
  if (!periodoId) {
    const error = new Error(
      "El período es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  if (!docenteId) {
    const error = new Error(
      "El docente es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  if (!asignatura?.trim()) {
    const error = new Error(
      "La asignatura es obligatoria."
    );
    error.status = 400;
    throw error;
  }

  const asignaturaLimpia =
    asignatura.trim();

  const cursoLimpio =
    curso?.trim() || "";

  const contenido =
    await FotiaContenido.findOneAndUpdate(
      {
        periodoId,
        docenteId,
        asignatura: asignaturaLimpia,
        curso: cursoLimpio,
      },
      {
        $setOnInsert: {
          periodoId,
          docenteId,
          asignatura: asignaturaLimpia,
          curso: cursoLimpio,
          publicado: false,
          activo: true,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

  return contenido;
};

// =====================================================
// GUARDAR MENSAJE DEL DOCENTE
// =====================================================

export const guardarMensajeDocente = async ({
  contenidoId,
  docenteId,
  texto = "",
  audioUrl = "",
  audioNombreArchivo = "",
}) => {
  const contenido =
    await FotiaContenido.findOne({
      _id: contenidoId,
      docenteId,
      activo: true,
    });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla."
    );
    error.status = 404;
    throw error;
  }

  contenido.mensajeDocente = {
    texto: texto || "",
    audioUrl: audioUrl || "",
    audioNombreArchivo:
      audioNombreArchivo || "",
    actualizadoEn: new Date(),
  };

  await contenido.save();

  return contenido;
};

// =====================================================
// CREAR UNIDAD
// =====================================================

export const crearUnidad = async ({
  contenidoId,
  docenteId,
  titulo,
  descripcion = "",
}) => {
  if (!titulo?.trim()) {
    const error = new Error(
      "El título de la unidad es obligatorio."
    );
    error.status = 400;
    throw error;
  }

  const contenido =
    await FotiaContenido.findOne({
      _id: contenidoId,
      docenteId,
      activo: true,
    });

  if (!contenido) {
    const error = new Error(
      "No se encontró el aula o no tenés permiso para modificarla."
    );
    error.status = 404;
    throw error;
  }

  const orden =
    contenido.unidades.length + 1;

  contenido.unidades.push({
    titulo: titulo.trim(),
    descripcion:
      descripcion?.trim() || "",
    orden,
    activo: true,
  });

  await contenido.save();

  return contenido;
};

// =====================================================
// PUBLICAR / DESPUBLICAR AULA
// =====================================================

export const cambiarEstadoPublicacionAula =
  async ({
    contenidoId,
    docenteId,
    publicado,
  }) => {
    const contenido =
      await FotiaContenido.findOne({
        _id: contenidoId,
        docenteId,
        activo: true, 
      });

    if (!contenido) {
      const error = new Error(
        "No se encontró el aula o no tenés permiso para modificarla."
      );
      error.status = 404;
      throw error;
    }

    contenido.publicado =
      Boolean(publicado);

    await contenido.save();

    return contenido;
  };