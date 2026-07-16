export default function FiltrosLegajoMatrizMatricula({
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
  };

  const estiloContenedorSelects = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
    alignItems: "center",
  };

  const estiloSelect = {
    ...estilos.inputAlumno,
    width: "100%",
    margin: 0,
  };

  return (
    <div style={estilos.bloqueHerramienta}>
      <h3 style={estiloTitulo}>
        🧾 Legajos y matriz por año / libro
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
    </div>
  );
}