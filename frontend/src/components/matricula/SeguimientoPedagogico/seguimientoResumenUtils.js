export function obtenerIndicePedagogico({ tea, tep, ted }) {
  const totalCargados = tea + tep + ted;
  const puntos = tea * 3 + tep * 2 + ted;

  if (totalCargados === 0) return 0;

  return Math.round((puntos / (totalCargados * 3)) * 100);
}

export function obtenerEstadoPorIndice(indice) {
  if (indice < 50) return "🔴 Intervención pedagógica prioritaria";
  if (indice < 75) return "🟡 Requiere seguimiento";
  return "🟢 Evolución favorable";
}

export function obtenerEstadoAsignatura(indice) {
  if (indice < 50) return "🔴 Atención";
  if (indice < 75) return "🟡 Observar";
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