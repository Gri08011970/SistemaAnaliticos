export default function RelevamientoInspeccionMatricula({
  mostrarRelevamiento,
  setMostrarRelevamiento,
  anioRelevamiento,
  setAnioRelevamiento,
  relevamientoInspeccion,
  estilos,
}) {
  if (!mostrarRelevamiento) return null;

  return (
    <div style={estilos.bloqueHerramienta}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>📊 Relevamiento para Inspección</h3>

        <button
          style={estilos.botonImprimir}
          onClick={() => setMostrarRelevamiento(false)}
        >
          Ocultar
        </button>
      </div>

      <select
        value={anioRelevamiento}
        onChange={(e) => setAnioRelevamiento(e.target.value)}
        style={estilos.inputAlumno}
      >
        <option value="1">1° año</option>
        <option value="2">2° año</option>
        <option value="3">3° año</option>
        <option value="4">4° año</option>
        <option value="5">5° año</option>
        <option value="6">6° año</option>
      </select>

      <div style={{ marginTop: "12px", textAlign: "left", lineHeight: "1.8" }}>
        <p>✅ Promocionaron sin deber materias: <strong>{relevamientoInspeccion.promocionaron}</strong></p>
        <p>📘 Adeudan 1 o 2 materias: <strong>{relevamientoInspeccion.unaODos}</strong></p>
        <p>📙 Adeudan 3 o 4 materias: <strong>{relevamientoInspeccion.tresOCuatro}</strong></p>
        <p>📕 Adeudan 5 o más materias: <strong>{relevamientoInspeccion.cincoOMas}</strong></p>
        <p>⚠️ Adeudan todas las materias: <strong>{relevamientoInspeccion.todas}</strong></p>

        <hr style={{ margin: "12px 0" }} />

        <p>🌎 Extranjeros: <strong>{relevamientoInspeccion.extranjeros}</strong></p>
        <p>Boliviana: <strong>{relevamientoInspeccion.boliviana}</strong></p>
        <p>Paraguaya: <strong>{relevamientoInspeccion.paraguaya}</strong></p>
        <p>Peruana: <strong>{relevamientoInspeccion.peruana}</strong></p>
        <p>Chilena: <strong>{relevamientoInspeccion.chilena}</strong></p>
        <p>Otros: <strong>{relevamientoInspeccion.otros}</strong></p>

        <hr style={{ margin: "12px 0" }} />

        <p>🔁 Recursantes: <strong>{relevamientoInspeccion.recursantes}</strong></p>
        <p>👦 Recursantes varones: <strong>{relevamientoInspeccion.recursantesVarones}</strong></p>
      </div>
    </div>
  );
}