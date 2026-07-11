export function obtenerNumerosLegajoPorAnio(
  alumnosMatricula = [],
  anio,
) {
  return alumnosMatricula
    .filter(
      (alumno) =>
        String(alumno.legajoAnio) === String(anio),
    )
    .map((alumno) => Number(alumno.legajoNumero))
    .filter((numero) => !Number.isNaN(numero))
    .sort((a, b) => a - b);
}

export function obtenerLegajosFaltantes(
  alumnosMatricula = [],
  anio,
) {
  const numeros = obtenerNumerosLegajoPorAnio(
    alumnosMatricula,
    anio,
  );

  if (numeros.length === 0) return [];

  const menor = Math.min(...numeros);
  const mayor = Math.max(...numeros);
  const numerosExistentes = new Set(numeros);
  const faltantes = [];

  for (let numero = menor; numero <= mayor; numero++) {
    if (!numerosExistentes.has(numero)) {
      faltantes.push(numero);
    }
  }

  return faltantes;
}

export function obtenerFoliosPorLibro(
  alumnosMatricula = [],
  libro,
) {
  return alumnosMatricula
    .map((alumno) =>
      String(
        alumno.folioMatriz ||
          alumno.libroMatriz ||
          "",
      ).trim(),
    )
    .filter((matriz) => matriz.includes("/"))
    .map((matriz) => {
      const [libroNumero, folioNumero] =
        matriz.split("/");

      return {
        libro: libroNumero,
        folio: Number(folioNumero),
      };
    })
    .filter(
      (item) =>
        String(item.libro) === String(libro) &&
        !Number.isNaN(item.folio) &&
        item.folio > 0,
    )
    .map((item) => item.folio)
    .sort((a, b) => a - b);
}

export function obtenerFoliosFaltantes(
  alumnosMatricula = [],
  libro,
) {
  const folios = obtenerFoliosPorLibro(
    alumnosMatricula,
    libro,
  );

  if (folios.length === 0) return [];

  const menor = Math.min(...folios);
  const mayor = Math.max(...folios);
  const foliosExistentes = new Set(folios);
  const faltantes = [];

  for (let folio = menor; folio <= mayor; folio++) {
    if (!foliosExistentes.has(folio)) {
      faltantes.push(folio);
    }
  }

  return faltantes;
}