/*
 * ============================================================
 * UTILIDADES PARA NORMALIZACIÓN Y COMPARACIÓN DE TEXTOS
 * ============================================================
 *
 * Este archivo reúne funciones generales para limpiar y comparar
 * textos provenientes de formularios, archivos Excel, MongoDB
 * u otras fuentes.
 *
 * Centralizamos estas funciones para evitar tener distintas
 * normalizaciones repartidas por el sistema.
 * ============================================================
 */

/**
 * Elimina tildes y signos diacríticos.
 *
 * Ejemplo:
 * "Matemática" → "Matematica"
 */
export function quitarAcentos(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Convierte un texto a una forma estable para comparaciones.
 *
 * Ejemplos:
 *
 * "  Introducción a la Física  "
 * → "introduccion a la fisica"
 *
 * "Arte-Leng. Danza"
 * → "arte leng danza"
 */
export function normalizarTexto(valor = "") {
  return quitarAcentos(valor)
    .toLowerCase()
    .replace(/[.,;:()[\]{}]/g, " ")
    .replace(/[-_/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Compara dos textos después de normalizarlos.
 */
export function compararTextos(valorA = "", valorB = "") {
  const textoA = normalizarTexto(valorA);
  const textoB = normalizarTexto(valorB);

  if (!textoA || !textoB) {
    return false;
  }

  return textoA === textoB;
}

/**
 * Indica si un texto normalizado contiene otro.
 *
 * Esta función debe utilizarse con cuidado en nombres de
 * asignaturas, porque una coincidencia parcial no siempre implica
 * equivalencia pedagógica.
 */
export function textoContiene(texto = "", busqueda = "") {
  const textoNormalizado = normalizarTexto(texto);
  const busquedaNormalizada = normalizarTexto(busqueda);

  if (!textoNormalizado || !busquedaNormalizada) {
    return false;
  }

  return textoNormalizado.includes(busquedaNormalizada);
}