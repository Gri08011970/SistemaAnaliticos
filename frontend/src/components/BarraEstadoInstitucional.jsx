export default function BarraEstadoInstitucional({
  totalGeneral,
  totalManana,
  totalTarde,
  cicloBasico,
  cicloSuperior,
  sinLegajo,
  sinFechaNacimiento,
  conPrevias,
  sobreedad,
}) {
  const indicadoresGenerales = [
    { etiqueta: "Total", valor: totalGeneral },
    { etiqueta: "TM", valor: totalManana },
    { etiqueta: "TT", valor: totalTarde },
    { etiqueta: "Básico", valor: cicloBasico },
    { etiqueta: "Superior", valor: cicloSuperior },
  ];

  const alertas = [
    { etiqueta: "Sin legajo", valor: sinLegajo },
    { etiqueta: "Sin fecha", valor: sinFechaNacimiento },
    { etiqueta: "Previas", valor: conPrevias },
    { etiqueta: "Sobreedad", valor: sobreedad },
  ];

  const estilos = {
    contenedor: {
      width: "100%",
      marginTop: "8px",
      marginBottom: "26px",
      padding: "11px 14px",
      borderTop: "1px solid #dfe7ed",
      borderBottom: "1px solid #dfe7ed",
      boxSizing: "border-box",
    },

    contenido: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      columnGap: "16px",
      rowGap: "8px",
    },

    grupo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "16px",
    },

    indicador: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: "5px",
      whiteSpace: "nowrap",
    },

    valor: {
      fontSize: "16px",
      lineHeight: 1,
      fontWeight: 700,
      color: "#1e3a5f",
    },

    valorAlerta: {
      fontSize: "16px",
      lineHeight: 1,
      fontWeight: 700,
      color: "#a25f20",
    },

    etiqueta: {
      fontSize: "11px",
      lineHeight: 1,
      fontWeight: 500,
      color: "#687481",
    },

    punto: {
      color: "#aeb8c1",
      fontSize: "13px",
      lineHeight: 1,
    },
  };

  return (
    <section
      style={estilos.contenedor}
      aria-label="Estado institucional de matrícula"
    >
      <div style={estilos.contenido}>
        <div style={estilos.grupo}>
          {indicadoresGenerales.map((indicador) => (
            <span key={indicador.etiqueta} style={estilos.indicador}>
              <strong style={estilos.valor}>
                {indicador.valor ?? 0}
              </strong>

              <span style={estilos.etiqueta}>
                {indicador.etiqueta}
              </span>
            </span>
          ))}
        </div>

        <span style={estilos.punto} aria-hidden="true">
          •
        </span>

        <div style={estilos.grupo}>
          {alertas.map((indicador) => (
            <span key={indicador.etiqueta} style={estilos.indicador}>
              <strong style={estilos.valorAlerta}>
                {indicador.valor ?? 0}
              </strong>

              <span style={estilos.etiqueta}>
                {indicador.etiqueta}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}