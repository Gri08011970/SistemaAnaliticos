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
  return (
    <div className="no-print">
      <button
        style={estilos.botonVolver}
        onClick={() => setCursoSeleccionado(null)}
      >
        Volver a todos los cursos
      </button>

      <button style={estilos.botonImprimir} onClick={imprimirCurso}>
        🖨️ Imprimir curso
      </button>

      <button
        style={estilos.botonImprimir}
        onClick={() => setVerEstadisticasCurso(!verEstadisticasCurso)}
      >
        📊 Estadísticas
      </button>

      <button style={estilos.botonImprimir} onClick={exportarExcel}>
        Exportar Excel
      </button>

      {esAdmin && (
        <label
          style={{
            ...estilos.botonImprimir,
            display: "inline-block",
            cursor: "pointer",
            fontSize: "12,5px",
            padding: "3px 10px",
          }}
        >
          📁 Cargar Excel
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