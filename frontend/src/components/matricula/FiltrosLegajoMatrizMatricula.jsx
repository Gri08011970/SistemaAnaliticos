export default function FiltrosLegajoMatrizMatricula({
  modo,
  anioLegajoFiltro,
  setAnioLegajoFiltro,
  libroMatrizFiltro,
  setLibroMatrizFiltro,
  aniosLegajoDisponibles,
  librosMatrizDisponibles,
  estilos,
}) {
  const estiloTitulo = {
    color: "#1e3a5f",
    margin: "0 0 14px",
    fontSize: "20px",
    lineHeight: "1.2",
    textAlign: "center",
  };

  const estiloContenedorSelects = {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 420px)",
    gap: "12px",
    alignItems: "center",
    justifyContent: "start",
  };

  const estiloSelect = {
    ...estilos.inputAlumno,
    width: "100%",
    margin: 0,
  };

  const esLegajos = modo === "legajos";
  const esMatriz = modo === "matriz";

  return (
    <div style={estilos.bloqueHerramienta}>
      {esLegajos && (
        <>
          <h3 style={estiloTitulo}>
            🧾 Consulta de legajos por año
          </h3>

          <div style={estiloContenedorSelects}>
            <select
              className="select-responsive"
              style={estiloSelect}
              value={anioLegajoFiltro}
              onChange={(e) =>
                setAnioLegajoFiltro(e.target.value)
              }
            >
              <option value="">
                Seleccionar año de legajo
              </option>

              {aniosLegajoDisponibles.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {esMatriz && (
        <>
          <h3 style={estiloTitulo}>
            📖 Consulta de libro matriz
          </h3>

          <div style={estiloContenedorSelects}>
            <select
              className="select-responsive"
              style={estiloSelect}
              value={libroMatrizFiltro}
              onChange={(e) =>
                setLibroMatrizFiltro(e.target.value)
              }
            >
              <option value="">
                Seleccionar libro matriz
              </option>

              {librosMatrizDisponibles.map((libro) => (
                <option key={libro} value={libro}>
                  Libro {libro}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}