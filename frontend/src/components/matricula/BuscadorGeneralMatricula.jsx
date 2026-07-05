export default function BuscadorGeneralMatricula({
  busquedaAlumno,
  setBusquedaAlumno,
  alumnosEncontrados,
  pedidosAnaliticos,
  pedidosAnaliticosEncontrados,
  limpiarDNI,
  formatearDNI,
  setCursoSeleccionado,
  editarAlumno,
  setAlumnoSeleccionado,
  estilos,
}) {
  return (
    <div style={estilos.bloqueBusquedaGeneral}>
      <h3 style={{ color: "#1e3a5f", marginBottom: "10px", marginTop: "0px" }}>
        🔎 Buscar estudiante
      </h3>

      <input
        type="text"
        placeholder="Apellido, nombre o DNI"
        style={estilos.inputBusquedaPrincipal}
        value={busquedaAlumno}
        onChange={(e) => setBusquedaAlumno(e.target.value)}
      />

      {busquedaAlumno && (
        <div style={estilos.listaResultadosBusqueda}>
          {alumnosEncontrados.map((alumno) => {
            const pedidoAnalitico = pedidosAnaliticos.find(
              (pedido) => limpiarDNI(pedido.dni) === limpiarDNI(alumno.dni)
            );

            return (
              <div key={alumno._id} style={estilos.itemResultadoBusqueda}>
                <div>
                  <strong>
                    {alumno.apellido}, {alumno.nombre}
                  </strong>

                  <p style={{ margin: 0 }}>
                    {alumno.curso} • Turno {alumno.turno}
                  </p>

                  {pedidoAnalitico && (
                    <div style={estilos.alertaAnalitico}>
                      📄 Pedido de analítico encontrado
                      <br />
                      Estado: {pedidoAnalitico.estado || "-"}
                      <br />
                      Libro: {pedidoAnalitico.libro || "-"} | Folio:{" "}
                      {pedidoAnalitico.folio || "-"} | Carpeta:{" "}
                      {pedidoAnalitico.carpeta || "-"}
                    </div>
                  )}
                </div>

                <button
                  style={estilos.botonEditar}
                  onClick={() => {
                    setCursoSeleccionado({
                      curso: alumno.curso,
                      turno: alumno.turno,
                    });
                    editarAlumno(alumno);
                  }}
                >
                  ✏️
                </button>

                <button
                  style={estilos.botonMover}
                  onClick={() => {
                    setAlumnoSeleccionado(alumno);

                    setTimeout(() => {
                      document
                        .getElementById("ficha-estudiante")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }, 100);
                  }}
                >
                  📖
                </button>
              </div>
            );
          })}

          {pedidosAnaliticosEncontrados.map((pedido) => (
            <div key={pedido._id} style={estilos.alertaAnalitico}>
              📄 Estudiante con pedido de analítico cargado
              <br />
              <strong>{pedido.nombre}</strong>
              <br />
              DNI: {formatearDNI(pedido.dni)}
              <br />
              Estado: {pedido.estado || "-"}
              <br />
              Libro: {pedido.libro || "-"} | Folio: {pedido.folio || "-"} |
              Carpeta: {pedido.carpeta || "-"}
            </div>
          ))}

          {alumnosEncontrados.length === 0 &&
            pedidosAnaliticosEncontrados.length === 0 && (
              <p>No se encontraron estudiantes.</p>
            )}
        </div>
      )}
    </div>
  );
}