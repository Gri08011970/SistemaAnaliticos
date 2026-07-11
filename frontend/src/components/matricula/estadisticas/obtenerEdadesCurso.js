import { calcularEdadAl30Junio } from "../matriculaUtils";

export function obtenerEdadesCurso(alumnosDelCurso = []) {
  return alumnosDelCurso.reduce((contador, alumno) => {
    const edad = calcularEdadAl30Junio(alumno.fechaNacimiento);

    if (edad === "-") return contador;

    contador[edad] = (contador[edad] || 0) + 1;

    return contador;
  }, {});
}