import express from "express";

import {
  // Períodos
  obtenerPeriodosController,
  obtenerPeriodoController,
  crearPeriodoController,
  actualizarPeriodoController,

  // Docentes
  obtenerDocentesController,
  obtenerDocenteController,
  crearDocenteController,
  actualizarDocenteController,

  // Inscripciones
  obtenerAcreditacionesController,
  obtenerInscripcionesController,
  obtenerInscripcionController,
  incorporarAsignaturaController,
  actualizarInscripcionController,
  retirarAsignaturaController,
  eliminarEstudiantePeriodoController,

  // Acreditación
  acreditarInscripcionController,
} from "../controllers/fotiaController.js";

const router = express.Router();

// ======================================================
// PERÍODOS
// ======================================================

router.get(
  "/periodos",
  obtenerPeriodosController
);

router.get(
  "/periodos/:id",
  obtenerPeriodoController
);

router.post(
  "/periodos",
  crearPeriodoController
);

router.put(
  "/periodos/:id",
  actualizarPeriodoController
);

// ======================================================
// DOCENTES
// ======================================================

router.get(
  "/docentes",
  obtenerDocentesController
);

router.get(
  "/docentes/:id",
  obtenerDocenteController
);

router.post(
  "/docentes",
  crearDocenteController
);

router.put(
  "/docentes/:id",
  actualizarDocenteController
);

// ======================================================
// INSCRIPCIONES AL FORTALECIMIENTO
// ======================================================

// ======================================================
// ACREDITACIONES
// ======================================================

router.get(
  "/acreditaciones",
  obtenerAcreditacionesController,
);
router.get(
  "/inscripciones",
  obtenerInscripcionesController
);

router.get(
  "/inscripciones/:id",
  obtenerInscripcionController
);

router.post(
  "/inscripciones",
  incorporarAsignaturaController
);

router.put(
  "/inscripciones/:id",
  actualizarInscripcionController
);

// Retira la asignatura solamente del fortalecimiento.
// NO elimina la previa institucional.
router.put(
  "/inscripciones/:id/retirar",
  retirarAsignaturaController
);

// Elimina todos los registros de un estudiante dentro
// de un período específico de FOTIA.
// No elimina al estudiante de Matrícula.
router.delete(
  "/periodos/:periodoId/estudiantes/:alumnoId",
  eliminarEstudiantePeriodoController,
);

// ======================================================
// ACREDITACIÓN
// ======================================================

// Esta es la ÚNICA ruta que elimina la previa
// de materiasPendientes.
router.post(
  "/inscripciones/:id/acreditar",
  acreditarInscripcionController
);

export default router;