import express from "express";

import {
  obtenerUsuariosController,
  crearUsuarioController,
} from "../controllers/usuarioController.js";

import {
  verificarToken,
  soloAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  verificarToken,
  soloAdmin,
  obtenerUsuariosController,
);

router.post(
  "/",
  verificarToken,
  soloAdmin,
  crearUsuarioController,
);

export default router;