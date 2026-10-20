import express from "express";

import {
  guardarPresentismoController,
  obtenerPresentismoController,
} from "../controllers/presentismoController.js";

import {
  verificarToken,
  soloAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Consultar un período.
// Los usuarios autenticados pueden verlo.
router.get(
  "/",
  verificarToken,
  obtenerPresentismoController,
);

// Guardar o modificar.
// Sólo administración.
router.post(
  "/",
  verificarToken,
  soloAdmin,
  guardarPresentismoController,
);

export default router;