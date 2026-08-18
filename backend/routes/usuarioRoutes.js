import express from "express";

import { obtenerUsuariosController } from "../controllers/usuarioController.js";

import {
  verificarToken,
  soloAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// LISTAR USUARIOS
// ======================================================

router.get(
  "/",
  verificarToken,
  soloAdmin,
  obtenerUsuariosController,
);

export default router;