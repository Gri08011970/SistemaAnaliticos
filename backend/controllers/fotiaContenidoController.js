import {
  listarEspaciosDocente,
  obtenerOCrearContenidoAula,
  guardarMensajeDocente,
  crearUnidad,
  cambiarEstadoPublicacionAula,
} from "../services/fotiaContenidoService.js";


// =====================================================
// UTILIDAD INTERNA
// =====================================================

const responderError = (res, error) => {
  console.error(
    "Error en contenido FOTIA:",
    error
  );

  res.status(error.status || 500).json({
    mensaje:
      error.message ||
      "Ocurrió un error inesperado en el aula FOTIA",
  });
};


// =====================================================
// PORTAL DOCENTE - MIS ESPACIOS
// =====================================================

export const obtenerMisEspaciosDocenteController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const espacios =
        await listarEspaciosDocente({
          docenteId,
        });

      res.json({
        cantidad: espacios.length,
        espacios,
      });
    } catch (error) {
      responderError(res, error);
    }
  };


// =====================================================
// OBTENER O CREAR AULA
// =====================================================

export const obtenerOCrearAulaDocenteController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        periodoId,
        asignatura,
        curso,
      } = req.body;

      const contenido =
        await obtenerOCrearContenidoAula({
          periodoId,
          docenteId,
          asignatura,
          curso: curso || "",
        });

      res.json({
        mensaje:
          "Aula FOTIA disponible correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };


// =====================================================
// MENSAJE DEL DOCENTE
// =====================================================

export const guardarMensajeDocenteController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        texto,
        audioUrl,
        audioNombreArchivo,
      } = req.body;

      const contenido =
        await guardarMensajeDocente({
          contenidoId: req.params.contenidoId,
          docenteId,
          texto,
          audioUrl,
          audioNombreArchivo,
        });

      res.json({
        mensaje:
          "Mensaje del docente guardado correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };


// =====================================================
// CREAR UNIDAD
// =====================================================

export const crearUnidadController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const {
        titulo,
        descripcion,
      } = req.body;

      const contenido =
        await crearUnidad({
          contenidoId: req.params.contenidoId,
          docenteId,
          titulo,
          descripcion,
        });

      res.status(201).json({
        mensaje:
          "Unidad creada correctamente",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };


// =====================================================
// PUBLICAR / DESPUBLICAR AULA
// =====================================================

export const cambiarPublicacionAulaController =
  async (req, res) => {
    try {
      const docenteId =
        req.usuario?.docenteId;

      const contenido =
        await cambiarEstadoPublicacionAula({
          contenidoId: req.params.contenidoId,
          docenteId,
          publicado: req.body.publicado,
        });

      res.json({
        mensaje: contenido.publicado
          ? "El aula fue publicada correctamente"
          : "El aula volvió al estado borrador",
        contenido,
      });
    } catch (error) {
      responderError(res, error);
    }
  };