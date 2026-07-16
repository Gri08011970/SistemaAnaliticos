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

  const estiloTitulo = {
    margin: "0 0 8px",
    fontSize: "18px",
    lineHeight: "1.15",
    color: "#665d70",
  };

  const estiloNumero = {
    margin: 0,
    fontSize: "25px",
    fontWeight: "700",
    color: "#1e3a5f",
  };

  return (
    <div style={bloqueEstadisticas}>
      <div style={tarjetaEstadistica}>
        <h3 style={estiloTitulo}>Total general</h3>
        <p style={estiloNumero}>{totalGeneral}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3 style={estiloTitulo}>Turno mañana</h3>
        <p style={estiloNumero}>{totalManana}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3 style={estiloTitulo}>Turno tarde</h3>
        <p style={estiloNumero}>{totalTarde}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3 style={estiloTitulo}>Ciclo básico</h3>
        <p style={estiloNumero}>{cicloBasico}</p>
      </div>

      <div style={tarjetaEstadistica}>
        <h3 style={estiloTitulo}>Ciclo superior</h3>
        <p style={estiloNumero}>{cicloSuperior}</p>
      </div>
    </div>
  );
}