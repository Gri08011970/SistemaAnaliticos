export default function FiltrosLegajoMatrizMatricula({
  anioLegajoFiltro,
  setAnioLegajoFiltro,
  libroMatrizFiltro,
  setLibroMatrizFiltro,
  aniosLegajoDisponibles,
  librosMatrizDisponibles,
  estilos,
}) {
  return (
    <div style={estilos.bloqueHerramienta}>
      <h3 style={{ color: "#1e3a5f" }}>
        🧾 Legajos y matriz por año / libro
      </h3>

      <select  className="select-responsive"
        style={estilos.inputAlumno}
        value={anioLegajoFiltro}
        onChange={(e) => setAnioLegajoFiltro(e.target.value)}
      >
        <option value="">Seleccionar año de legajo</option>

        {aniosLegajoDisponibles.map((anio) => (
          <option key={anio} value={anio}>
            {anio}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select  className="select-responsive"
        style={estilos.inputAlumno}
        value={libroMatrizFiltro}
        onChange={(e) => setLibroMatrizFiltro(e.target.value)}
      >
        <option value="">Seleccionar libro matriz</option>

        {librosMatrizDisponibles.map((libro) => (
          <option key={libro} value={libro}>
            Libro {libro}
          </option>
        ))}
      </select>
    </div>
  );
}