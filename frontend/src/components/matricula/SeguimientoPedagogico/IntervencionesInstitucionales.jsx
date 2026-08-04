const obtenerListaLegible = (valores = []) => {
  const lista = [
    ...new Set(
      valores
        .map((valor) => String(valor || "").trim())
        .filter(Boolean),
    ),
  ];

  if (lista.length === 0) return "";
  if (lista.length === 1) return lista[0];
  if (lista.length === 2) return `${lista[0]} y ${lista[1]}`;

  return `${lista.slice(0, -1).join(", ")} y ${lista.at(-1)}`;
};

export default function IntervencionesInstitucionales({ 
  participaFotia = false,
  asignaturasEnFortalecimiento = [],
  asignaturasAcreditadas = [],
  docentesResponsables = [],
  observaciones = [],
  informeEquipoFortalecimiento = "",
  nombrePrograma =  "Programa Institucional de Fortalecimiento de Trayectorias Educativas (FOTIA)",
}) {
  const asignaturasActivasTexto = obtenerListaLegible(
    asignaturasEnFortalecimiento,
  );

  const asignaturasAcreditadasTexto = obtenerListaLegible(
    asignaturasAcreditadas,
  );

  const docentesTexto = obtenerListaLegible(
    docentesResponsables,
  );

  const observacionesLimpias = observaciones
    .map((observacion) =>
      String(observacion || "").trim(),
    )
    .filter(Boolean);
  const informeFortalecimientoLimpio = String(
  informeEquipoFortalecimiento || "",
).trim();  

  const tieneParticipacion =
    participaFotia ||
    asignaturasEnFortalecimiento.length > 0 ||
    asignaturasAcreditadas.length > 0;

  const construirTextoParticipacion = () => {
    if (!tieneParticipacion) {
      return (
        "Al momento de la emisión del presente informe, el estudiante no " +
        "registra participación en dispositivos institucionales de " +
        "fortalecimiento de trayectorias educativas."
      );
    }

    const partes = [];

    if (asignaturasEnFortalecimiento.length > 0) { 
      partes.push(
        `El estudiante participa actualmente en el ${nombrePrograma}, ` +
          `donde fortalece actualmente ${
            asignaturasEnFortalecimiento.length === 1
              ? "el área"
              : "las áreas"
          } de ${asignaturasActivasTexto}` +
          (docentesTexto
            ? ` bajo la orientación pedagógica de ${
                docentesResponsables.length === 1
                  ? "la/el docente"
                  : "las/los docentes"
              } ${docentesTexto}.`
            : "."),
      );
    } else {
      partes.push(
        `El estudiante participó del ${nombrePrograma}.`,
      );
    }

    if (asignaturasAcreditadas.length === 0) {
      partes.push(
        "Al momento de la emisión del presente informe no registra " +
          "acreditaciones dentro del programa.",
      );
    } else if (
      asignaturasEnFortalecimiento.length === 0
    ) {
      partes.push(
        `Ha acreditado satisfactoriamente ${
          asignaturasAcreditadas.length === 1
            ? "el área"
            : "las áreas"
        } de ${asignaturasAcreditadasTexto}.`,
      );
    } else {
      partes.push(
        `Ha acreditado satisfactoriamente ${
          asignaturasAcreditadas.length === 1
            ? "el área"
            : "las áreas"
        } de ${asignaturasAcreditadasTexto}, y continúa participando en ` +
          "las propuestas de fortalecimiento indicadas.",
      );
    }

    return partes.join(" ");
  };

  return (
    <section
      className="intervenciones-institucionales"
      style={{
        marginTop: "26px",
        padding: "22px",
        border: "1px solid #c8ddd8",
        borderRadius: "16px",
        background:
          "linear-gradient(180deg, #f6fbfa 0%, #ffffff 100%)",
        boxShadow:
          "0 5px 16px rgba(40, 82, 78, 0.08)",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
          marginBottom: "18px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "48px",
            height: "48px",
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: "14px",
            background: "#e3f2ee",
            fontSize: "24px",
          }}
        >
          🏫
        </div>

        <div>
          <p
            style={{
              margin: "0 0 4px",
              color: "#667085",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            Acompañamiento institucional
          </p>

          <h3
            style={{
              margin: 0,
              color: "#285e58",
              fontSize: "20px",
              lineHeight: 1.3,
            }}
          >
            Intervenciones institucionales de acompañamiento pedagógico
          </h3>
        </div>
      </header>

      <div
        style={{
          padding: "16px 18px",
          border: "1px solid #d5e6e2",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <h4
          style={{
            margin: "0 0 10px",
            color: "#315f5a",
            fontSize: "15px",
          }}
        >
          Programa institucional de fortalecimiento
        </h4>

        <p
          style={{
            margin: 0,
            color: "#40556a",
            fontSize: "14px",
            lineHeight: 1.75,
            textAlign: "justify",
          }}
        >
          {construirTextoParticipacion()}
        </p>
      </div>

      {tieneParticipacion && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
            gap: "10px",
            marginTop: "14px",
          }}
        >
          <DatoIntervencion
            etiqueta="Áreas en fortalecimiento"
            valor={
              asignaturasActivasTexto ||
              "Sin áreas activas informadas"
            }
          />

          <DatoIntervencion
            etiqueta="Docentes responsables"
            valor={
              docentesTexto ||
              "Sin docente informado"
            }
          />

          <DatoIntervencion
            etiqueta="Áreas acreditadas"
            valor={
              asignaturasAcreditadasTexto ||
              "Sin acreditaciones registradas"
            }
          />
        </div>
      )}

      {informeFortalecimientoLimpio && (
  <div
    style={{
      marginTop: "16px",
      padding: "16px 18px",
      border: "1px solid #d9e3e8",
      borderRadius: "12px",
      background: "#f9fcff",
      breakInside: "avoid",
      pageBreakInside: "avoid",
    }}
  >
    <h4
      style={{
        margin: "0 0 10px",
        color: "#43506f",
        fontSize: "15px",
      }}
    >
      📝 Informe del equipo de fortalecimiento
    </h4>

    <p
      style={{
        margin: 0,
        color: "#4b5563",
        fontSize: "14px",
        lineHeight: 1.7,
        textAlign: "justify",
      }}
    >
      {informeFortalecimientoLimpio}
    </p>
  </div>
)}
    </section>
  );
}

function DatoIntervencion({ etiqueta, valor }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        border: "1px solid #d7e5e1",
        borderRadius: "11px",
        background: "#ffffff",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "5px",
          color: "#708090",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {etiqueta}
      </span>

      <strong
        style={{
          display: "block",
          color: "#315f5a",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        {valor}
      </strong>
    </div>
  );
}