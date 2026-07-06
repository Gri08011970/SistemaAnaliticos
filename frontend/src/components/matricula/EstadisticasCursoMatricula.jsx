export default function EstadisticasCursoMatricula({
  verEstadisticasCurso,
  totalEstudiantes,
  totalProm,
  porcentajeProm,
  totalRec,
  porcentajeRec,
  totalIngresantes,
  totalReinscriptos,
  totalConPrevias,
  totalSobreedad,
  estilos,
}) {
  if (!verEstadisticasCurso) return null;

  return (
    <>
      <div style={estilos.bloqueEstadisticas}>
        <div style={estilos.tarjetaEstadistica}>
          <h3>Total</h3>
          <p>{totalEstudiantes}</p>
        </div>

        <div style={estilos.tarjetaEstadistica}>
          <h3>Prom</h3>
          <p>
            {totalProm} ({porcentajeProm}%)
          </p>
        </div>

        <div style={estilos.tarjetaEstadistica}>
          <h3>Rec</h3>
          <p>
            {totalRec} ({porcentajeRec}%)
          </p>
        </div>

        <div style={estilos.tarjetaEstadistica}>
          <h3>Ingresantes</h3>
          <p>{totalIngresantes}</p>
        </div>

        <div style={estilos.tarjetaEstadistica}>
          <h3>Reinscriptos</h3>
          <p>{totalReinscriptos}</p>
        </div>

        <div style={estilos.tarjetaEstadistica}>
          <h3>Con previas</h3>
          <p>{totalConPrevias}</p>
        </div>
      </div>

      <div
        style={{
          ...estilos.tarjetaEstadistica,
          maxWidth: "180px",
          margin: "20px auto 10px auto",
        }}
      >
        <h3>Sobreedad</h3>
        <p>{totalSobreedad}</p>
      </div>
    </>
  );
}