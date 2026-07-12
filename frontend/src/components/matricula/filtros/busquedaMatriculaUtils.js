import {
  limpiarDNI,
  normalizarTexto,
} from "../matriculaUtils";

export function contarAlumnosPorCurso({
  alumnosMatricula = [],
  curso,
  turno,
}) {
  return alumnosMatricula.filter(
    (alumno) =>
      alumno.curso === curso &&
      alumno.turno === turno &&
      alumno.estadoMatricula === "Activo",
  ).length;
}

export function buscarAlumnosMatricula({
  alumnosMatricula = [],
  busqueda = "",
}) {
  const texto = normalizarTexto(busqueda);
  const dniBuscado = limpiarDNI(busqueda);

  if (!texto && !dniBuscado) return [];

  return alumnosMatricula.filter((alumno) => {
    const apellido = normalizarTexto(alumno.apellido);
    const nombre = normalizarTexto(alumno.nombre);

    const nombreCompleto = normalizarTexto(
      `${alumno.apellido || ""} ${alumno.nombre || ""}`,
    );

    const dniAlumno = limpiarDNI(alumno.dni);

    const coincideNombre =
      apellido.includes(texto) ||
      nombre.includes(texto) ||
      nombreCompleto.includes(texto);

    const coincideDni =
      dniBuscado.length > 0 &&
      dniAlumno.includes(dniBuscado);

    return coincideNombre || coincideDni;
  });
}

export function buscarPedidosAnaliticos({
  pedidosAnaliticos = [],
  busqueda = "",
}) {
  const texto = normalizarTexto(busqueda);
  const dniBuscado = limpiarDNI(busqueda);

  if (texto.length <= 2 && dniBuscado.length <= 2) {
    return [];
  }

  return pedidosAnaliticos.filter((pedido) => {
    const nombrePedido = normalizarTexto(pedido.nombre);
    const dniPedido = limpiarDNI(pedido.dni);

    const coincideNombre =
      texto.length > 2 &&
      nombrePedido.includes(texto);

    const coincideDni =
      dniBuscado.length > 2 &&
      dniPedido.includes(dniBuscado);

    return coincideNombre || coincideDni;
  });
}