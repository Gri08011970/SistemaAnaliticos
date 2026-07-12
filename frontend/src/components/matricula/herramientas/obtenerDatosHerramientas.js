export function obtenerAlumnosParaExamen({
  alumnosMatricula = [],
  materiaExamen = "",
  anioExamen = "",
  turnoExamen = "",
}) {
  return alumnosMatricula.filter((alumno) => {
    const coincideTurno =
      !turnoExamen || alumno.turno === turnoExamen;

    const poseePrevia = alumno.materiasPendientes?.some((previa) => {
      if (
        !previa.asignatura ||
        previa.asignatura === "----------"
      ) {
        return false;
      }

      const coincideMateria =
        !materiaExamen ||
        previa.asignatura === materiaExamen;

      const coincideAnio =
        !anioExamen ||
        previa.anio === anioExamen;

      return coincideMateria && coincideAnio;
    });

    return coincideTurno && poseePrevia;
  });
}

export function obtenerAniosLegajoDisponibles(
  alumnosMatricula = [],
) {
  return [
    ...new Set(
      alumnosMatricula
        .map((alumno) => alumno.legajoAnio)
        .filter(Boolean),
    ),
  ].sort((a, b) => Number(b) - Number(a));
}

export function obtenerLibrosMatrizDisponibles(
  alumnosMatricula = [],
) {
  return [
    ...new Set(
      alumnosMatricula
        .map((alumno) => {
          const matriz = String(
            alumno.folioMatriz ||
              alumno.libroMatriz ||
              "",
          ).trim();

          return matriz.includes("/")
            ? matriz.split("/")[0]
            : alumno.libroMatriz;
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => Number(a) - Number(b));
}

export function obtenerAlumnosPorLegajo({
  alumnosMatricula = [],
  anioLegajoFiltro = "",
}) {
  if (!anioLegajoFiltro) return [];

  return alumnosMatricula
    .filter(
      (alumno) =>
        String(alumno.legajoAnio) ===
        String(anioLegajoFiltro),
    )
    .sort(
      (a, b) =>
        Number(a.legajoNumero || 0) -
        Number(b.legajoNumero || 0),
    );
}

export function obtenerAlumnosPorMatriz({
  alumnosMatricula = [],
  libroMatrizFiltro = "",
}) {
  if (!libroMatrizFiltro) return [];

  return alumnosMatricula
    .filter((alumno) => {
      const valor = String(
        alumno.folioMatriz ||
          alumno.libroMatriz ||
          "",
      ).trim();

      const libro = valor.includes("/")
        ? valor.split("/")[0]
        : alumno.libroMatriz;

      return (
        String(libro) ===
        String(libroMatrizFiltro)
      );
    })
    .sort((a, b) => {
      const obtenerFolio = (alumno) => {
        const valor = String(
          alumno.folioMatriz ||
            alumno.libroMatriz ||
            "",
        ).trim();

        const partes = valor.split("/");

        return Number(partes[1] || 999999);
      };

      return obtenerFolio(a) - obtenerFolio(b);
    });
}

export function obtenerAlumnosRecursantes(
  alumnosMatricula = [],
) {
  return alumnosMatricula
    .filter(
      (alumno) =>
        alumno.condicionFinal === "Rec",
    )
    .sort((a, b) => {
      const cursoA = a.curso || "";
      const cursoB = b.curso || "";

      if (cursoA !== cursoB) {
        return cursoA.localeCompare(cursoB, "es");
      }

      return `${a.apellido || ""} ${
        a.nombre || ""
      }`.localeCompare(
        `${b.apellido || ""} ${b.nombre || ""}`,
        "es",
        { sensitivity: "base" },
      );
    });
}