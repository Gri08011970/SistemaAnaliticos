import {
  contarPrevias,
  obtenerPreviasValidas,
} from "../matriculaUtils";

const CANTIDAD_MATERIAS_POR_ANIO = {
  1: 8,
  2: 10,
  3: 10,
  4: 11,
  5: 11,
};

function obtenerNumeroAnio(valor) {
  return Number(
    String(valor || "")
      .replace("°", "")
      .trim(),
  );
}

function debeTodasLasMaterias(alumno) {
  const previasValidas = obtenerPreviasValidas(alumno);
  const resumenPorAnio = {};

  previasValidas.forEach((previa) => {
    const anioPrevia = obtenerNumeroAnio(previa.anio);

    if (!anioPrevia) return;

    resumenPorAnio[anioPrevia] =
      (resumenPorAnio[anioPrevia] || 0) + 1;
  });

  return Object.entries(resumenPorAnio).some(
    ([anioPrevia, cantidadAdeudada]) => {
      const totalMaterias =
        CANTIDAD_MATERIAS_POR_ANIO[Number(anioPrevia)];

      return (
        totalMaterias &&
        cantidadAdeudada >= totalMaterias
      );
    },
  );
}

export function obtenerRelevamientoInspeccion(
  alumnosMatricula = [],
  anio,
) {
  const alumnosDelAnio = alumnosMatricula.filter((alumno) =>
    alumno.curso?.startsWith(String(anio)),
  );

  const resumen = {
    promocionaron: 0,
    unaODos: 0,
    tresOCuatro: 0,
    cincoOMas: 0,
    todas: 0,

    extranjeros: 0,
    boliviana: 0,
    paraguaya: 0,
    peruana: 0,
    chilena: 0,
    otros: 0,

    recursantes: 0,
    recursantesVarones: 0,
  };

  alumnosDelAnio.forEach((alumno) => {
    const cantidad = contarPrevias(alumno);

    if (debeTodasLasMaterias(alumno)) {
      resumen.todas++;
    } else if (cantidad === 0) {
      resumen.promocionaron++;
    } else if (cantidad <= 2) {
      resumen.unaODos++;
    } else if (cantidad <= 4) {
      resumen.tresOCuatro++;
    } else {
      resumen.cincoOMas++;
    }

    if (alumno.condicionFinal === "Rec") {
      resumen.recursantes++;

      if (alumno.sexo === "Varón") {
        resumen.recursantesVarones++;
      }
    }

    const nacionalidad = alumno.nacionalidad || "";

    if (nacionalidad && nacionalidad !== "Argentina") {
      resumen.extranjeros++;
    }

    if (nacionalidad === "Boliviana") resumen.boliviana++;
    if (nacionalidad === "Paraguaya") resumen.paraguaya++;
    if (nacionalidad === "Peruana") resumen.peruana++;
    if (nacionalidad === "Chilena") resumen.chilena++;
    if (nacionalidad === "Otros") resumen.otros++;
  });

  return resumen;
}