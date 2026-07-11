export function calcularEdadAl30Junio(fechaNacimiento) {
  if (!fechaNacimiento) return "-";

  const nacimiento = new Date(fechaNacimiento);
  const anioActual = new Date().getFullYear();
  const fechaCorte = new Date(anioActual, 5, 30);

  let edad = fechaCorte.getFullYear() - nacimiento.getFullYear();

  const cumpleEsteAnio = new Date(
    anioActual,
    nacimiento.getMonth(),
    nacimiento.getDate(),
  );

  if (cumpleEsteAnio > fechaCorte) {
    edad--;
  }

  return edad;
}

export function formatearFecha(fecha) {
  if (!fecha) return "-";

  const [anio, mes, dia] = fecha.split("-");

  return `${dia}-${mes}-${anio}`;
}

export function formatearDNI(dni) {
  if (!dni) return "";

  return dni
    .toString()
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function limpiarDNI(dni) {
  if (!dni) return "";

  return dni.toString().replace(/\D/g, "");
}

export function normalizarTexto(texto) {
  return (
    texto
      ?.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim() || ""
  );
}

export function obtenerPreviasValidas(alumno) {
  return (alumno?.materiasPendientes || []).filter(
    (previa) => previa.asignatura && previa.asignatura !== "----------",
  );
}

export function contarPrevias(alumno) {
  return obtenerPreviasValidas(alumno).length;
}

export function tieneSobreedad(alumno) {
  if (!alumno?.fechaNacimiento || !alumno?.curso) return false;

  const edad = calcularEdadAl30Junio(alumno.fechaNacimiento);
  const anioCurso = Number(alumno.curso.charAt(0));

  const edadesEsperadas = {
    1: 12,
    2: 13,
    3: 14,
    4: 15,
    5: 16,
    6: 17,
  };

  return edad > edadesEsperadas[anioCurso];
}