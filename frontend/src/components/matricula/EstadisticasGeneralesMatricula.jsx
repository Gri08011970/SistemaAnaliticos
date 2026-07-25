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

  const indicadores = [
    {
      titulo: "TOTAL",
      valor: totalGeneral,
    },
    {
      titulo: "TM",
      valor: totalManana,
    },
    {
      titulo: "TT",
      valor: totalTarde,
    },
    {
      titulo: "BÁSICO",
      valor: cicloBasico,
    },
    {
      titulo: "SUPERIOR",
      valor: cicloSuperior,
    },
  ];

  return (
    <div style={bloqueEstadisticas}>
      {indicadores.map((item) => (
        <div key={item.titulo} style={tarjetaEstadistica}>
          <strong
            style={{
              display: "block",
              margin: 0,
              fontSize: "20px",
              lineHeight: 1,
              fontWeight: 700,
              color: "#1e3a5f",
            }}
          >
            {item.valor}
          </strong>

          <span
            style={{
              display: "block",
              marginTop: "4px",
              fontSize: "10px",
              lineHeight: 1,
              fontWeight: 700,
              color: "#7a8491",
              letterSpacing: "0.45px",
            }}
          >
            {item.titulo}
          </span>
        </div>
      ))}
    </div>
  );
}