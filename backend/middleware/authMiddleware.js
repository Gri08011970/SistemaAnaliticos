import jwt from "jsonwebtoken";

export const verificarToken = (
  req,
  res,
  next,
) => {
  try {
    const encabezado =
      req.headers.authorization || "";

    const [tipo, token] =
      encabezado.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({
        mensaje:
          "No autorizado. Falta el token de acceso.",
      });
    }

    const datos = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    req.usuario = {
      usuarioId: datos.usuarioId,
      usuario: datos.usuario,
      rol: datos.rol,
      alumnoId: datos.alumnoId || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje:
        "La sesión no es válida o ha vencido.",
    });
  }
};

export const soloEstudiante = (
  req,
  res,
  next,
) => {
  if (req.usuario?.rol !== "estudiante") {
    return res.status(403).json({
      mensaje:
        "Esta sección es exclusiva para estudiantes.",
    });
  }

  if (!req.usuario.alumnoId) {
    return res.status(403).json({
      mensaje:
        "La cuenta no está vinculada a un estudiante de Matrícula.",
    });
  }

  next();
};