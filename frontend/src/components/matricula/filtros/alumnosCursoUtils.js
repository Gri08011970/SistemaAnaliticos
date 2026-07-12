import {
  obtenerPreviasValidas,
  tieneSobreedad,
} from "../matriculaUtils";

function obtenerValorMatriz(alumno) {
  const valor = String(
    alumno.folioMatriz || alumno.libroMatriz || "",
  ).trim();

  if (!valor || valor === "-") {
    return {
      libro: 999999,
      folio: 999999,
    };
  }

  const [libro, folio] = valor.split("/");

  return {
    libro: Number(libro || 999999),
    folio: Number(folio || 999999),
  };
}

export function obtenerAlumnosDelCurso({
  alumnosMatricula = [],
  cursoSeleccionado,
  ordenCurso = "apellido",
}) {
  if (!cursoSeleccionado) return [];

  return alumnosMatricula
    .filter(
      (alumno) =>
        alumno.curso === cursoSeleccionado.curso &&
        alumno.turno === cursoSeleccionado.turno &&
        alumno.estadoMatricula === "Activo",
    )
    .sort((a, b) => {
      if (ordenCurso === "legajo") {
        const anioA = Number(a.legajoAnio || 0);
        const anioB = Number(b.legajoAnio || 0);

        if (anioA !== anioB) {
          return anioB - anioA;
        }

        const numeroA = Number(a.legajoNumero || 0);
        const numeroB = Number(b.legajoNumero || 0);

        return numeroA - numeroB;
      }

      if (ordenCurso === "matriz") {
        const matrizA = obtenerValorMatriz(a);
        const matrizB = obtenerValorMatriz(b);

        if (matrizA.libro !== matrizB.libro) {
          return matrizA.libro - matrizB.libro;
        }

        return matrizA.folio - matrizB.folio;
      }

      return `${a.apellido || ""} ${a.nombre || ""}`.localeCompare(
        `${b.apellido || ""} ${b.nombre || ""}`,
        "es",
        { sensitivity: "base" },
      );
    });
}

export function filtrarAlumnosDelCurso({
  alumnosDelCurso = [],
  filtroPrevia = "",
  filtroAnioPrevia = "",
  filtroAvanzado = "todos",
}) {
  return alumnosDelCurso.filter((alumno) => {
    const previasReales = obtenerPreviasValidas(alumno);

    const coincidePrevia =
      !filtroPrevia && !filtroAnioPrevia
        ? true
        : previasReales.some((previa) => {
            const coincideMateria =
              !filtroPrevia ||
              previa.asignatura === filtroPrevia;

            const coincideAnio =
              !filtroAnioPrevia ||
              previa.anio === filtroAnioPrevia;

            return coincideMateria && coincideAnio;
          });

    if (!coincidePrevia) return false;

    if (filtroAvanzado === "todos") return true;

    if (filtroAvanzado === "prom") {
      return alumno.condicionFinal === "Prom";
    }

    if (filtroAvanzado === "rec") {
      return alumno.condicionFinal === "Rec";
    }

    if (filtroAvanzado === "ingresante") {
      return alumno.condicionFinal === "Ingresante";
    }

    if (filtroAvanzado === "reinscripto") {
      return alumno.condicionFinal === "Reinscripto";
    }

    if (filtroAvanzado === "previas") {
      return previasReales.length > 0;
    }

    if (filtroAvanzado === "sinLegajo") {
      return !alumno.legajoNumero || !alumno.legajoAnio;
    }

    if (filtroAvanzado === "sobreedad") {
      return tieneSobreedad(alumno);
    }

    return true;
  });
}