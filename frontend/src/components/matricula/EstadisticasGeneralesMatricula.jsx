export default function EstadisticasGeneralesMatricula({
  mostrar,
  totalGeneral,
  totalManana,
  totalTarde,
  cicloBasico,
  cicloSuperior,
  estilos,
}) {
  if (!mostrar) return null;

  const { bloqueEstadisticas, tarjetaEstadistica } = estilos;

  return (
    <div style={bloqueEstadisticas}>
      <div style={tarjetaEstadistica}>
        <h3>Total general</h3>
        <p>{totalGeneral}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3>Turno mañana</h3>
        <p>{totalManana}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3>Turno tarde</h3>
        <p>{totalTarde}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3>Ciclo básico</h3>
        <p>{cicloBasico}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3>Ciclo superior</h3>
        <p>{cicloSuperior}</p>
      </div>
    </div>
  );
}