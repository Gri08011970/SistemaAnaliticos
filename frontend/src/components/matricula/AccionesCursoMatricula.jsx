export default function AccionesCursoMatricula({
  esAdmin,
  setCursoSeleccionado,
  imprimirCurso,
  verEstadisticasCurso,
  setVerEstadisticasCurso,
  exportarExcel,
  importarReporteOficial,
  estilos,
}) {
  const { botonVolver, botonImprimir } = estilos;

  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      <button
        type="button"
        style={botonVolver}
        onClick={() => setCursoSeleccionado(null)}
      >
        ← Volver
      </button>

      <button
        type="button"
        style={botonImprimir}
        onClick={imprimirCurso}
      >
        🖨️ Imprimir curso
      </button>

      <button
        type="button"
        style={botonImprimir}
        onClick={() =>
          setVerEstadisticasCurso(!verEstadisticasCurso)
        }
      >
        {verEstadisticasCurso
          ? "📊 Ocultar estadísticas"
          : "📊 Ver estadísticas"}
      </button>

      <button
        type="button"
        style={botonImprimir}
        onClick={exportarExcel}
      >
        📥 Exportar Excel
      </button>

      {esAdmin && (
        <label
          style={{
            ...botonImprimir,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          📤 Cargar Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={importarReporteOficial}
            style={{ display: "none" }}
          />
        </label>
      )}
    </div>
  );
}