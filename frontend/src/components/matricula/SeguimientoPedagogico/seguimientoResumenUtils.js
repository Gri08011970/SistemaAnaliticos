export function obtenerIndicePedagogico({ tea, tep, ted }) {
 const totalCargados = tea + tep + ted;
const puntos = tea * 3 + tep * 2 + ted;

if (totalCargados === 0) return 0;

return Math.round((puntos / (totalCargados * 3)) * 100);
  
}


const UMBRAL_ROJO = 40;
const UMBRAL_VERDE = 70;

export function obtenerEstadoPorIndice(indice) {
  if (indice < UMBRAL_ROJO)
    return "🔴 Intervención pedagógica prioritaria";

  if (indice < UMBRAL_VERDE)
    return "🟡 Requiere seguimiento";

  return "🟢 Evolución favorable";
}

export function obtenerEstadoAsignatura({
  indice = 0,
  tea = 0,
  tep = 0,
  ted = 0,
  aplazos = 0,
  totalCargados = 0,
}) {
  const total =
    totalCargados || tea + tep + ted;

  if (total === 0) {
    return "⚪ Pendiente de carga";
  }

  const debajoDeTrayectoriaAvanzada = tep + ted;
  const mitadMasUno = Math.floor(total / 2) + 1;

  const porcentajeTED = (ted / total) * 100;
  const porcentajeTEP = (tep / total) * 100;

  const mayoriaDebajo =
    debajoDeTrayectoriaAvanzada >= mitadMasUno;

  const variosAplazos =
    aplazos >= 3;

  /*
   * 🔴 INTERVENCIÓN PRIORITARIA
   *
   * - La mitad más uno está en TEP o TED y existen
   *   varios TED o aplazos.
   * - Un cuarto o más del grupo está en TED.
   * - Hay una cantidad especialmente alta de aplazos.
   */
  if (
    (mayoriaDebajo && (ted >= 3 || variosAplazos)) ||
    porcentajeTED >= 25 ||
    aplazos >= 5
  ) {
    return "🔴 Intervención pedagógica prioritaria";
  }

  /*
   * 🟠 INTERVENCIÓN
   *
   * - La mitad más uno no está en TEA.
   * - Hay una proporción significativa de TED.
   * - Existen aplazos que requieren acciones concretas.
   */
  if (
    mayoriaDebajo ||
    porcentajeTED >= 15 ||
    aplazos >= 3
  ) {
    return "🟠 Requiere intervención";
  }

  /*
   * 🟡 OBSERVAR
   *
   * - El índice todavía es bajo.
   * - Hay una proporción considerable de estudiantes
   *   en proceso.
   * - Aparecen algunos TED o aplazos.
   */
  if (
    indice < UMBRAL_VERDE ||
    porcentajeTEP >= 35 ||
    ted >= 2 ||
    aplazos >= 1
  ) {
    return "🟡 Observar";
  }

  return "🟢 Excelente";
}

export function obtenerColorEstado(estado) {
  if (estado.includes("🟢")) {
    return {
      background: "#d9f5d6",
      color: "#2e7d32",
    };
  }

  if (estado.includes("🟡")) {
    return {
      background: "#fff1b8",
      color: "#996c00",
    };
  }

  return {
    background: "#ffd1d1",
    color: "#b71c1c",
  };
}