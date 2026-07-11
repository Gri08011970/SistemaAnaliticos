import {
  obtenerPreviasValidas,
  tieneSobreedad,
} from "../matriculaUtils";

export function obtenerAlertas(alumnosMatricula = []) {
  const alumnosSinLegajo = alumnosMatricula.filter(
    (alumno) => !alumno.legajoNumero || !alumno.legajoAnio,
  );

  const alumnosSinFechaNacimiento = alumnosMatricula.filter(
    (alumno) => !alumno.fechaNacimiento,
  );

  const alumnosConPrevias = alumnosMatricula.filter(
    (alumno) => obtenerPreviasValidas(alumno).length > 0,
  );

  const alumnosConSobreedad = alumnosMatricula.filter((alumno) =>
    tieneSobreedad(alumno),
  );

  return {
    alumnosSinLegajo,
    alumnosSinFechaNacimiento,
    alumnosConPrevias,
    alumnosConSobreedad,
  };
}