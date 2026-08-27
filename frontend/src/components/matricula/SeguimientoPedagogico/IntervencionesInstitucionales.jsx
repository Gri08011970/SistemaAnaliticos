import { useMemo, useState } from "react";

function formatearFechaAcreditacion(fecha) {
  if (!fecha) {
    return "";
  }

  const partes = String(fecha).split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;

  return `${dia}/${mes}/${anio}`;
}

const obtenerListaLegible = (valores = []) => {
  const lista = [
    ...new Set(
      valores.map((valor) => String(valor || "").trim()).filter(Boolean),
    ),
  ];

  if (lista.length === 0) return "";
  if (lista.length === 1) return lista[0];
  if (lista.length === 2) return `${lista[0]} y ${lista[1]}`;

  return `${lista.slice(0, -1).join(", ")} y ${lista.at(-1)}`;
};

const normalizarObservaciones = (observaciones = []) =>
  observaciones
    .map((observacion, indice) => {
      if (typeof observacion === "string") {
        const texto = observacion.trim();
        if (!texto) return null;

        return {
          id: `observacion-${indice}`,
          asignatura: "Espacio curricular sin informar",
          docente: "Docente sin informar",
          texto,
          estado: "",
          fecha: "",
          origen: "",
        };
      }

      if (!observacion || typeof observacion !== "object") {
        return null;
      }

      const asignatura = String(
        observacion.asignatura || "Espacio curricular sin informar",
      ).trim();

      const docente = String(
        observacion.docente || "Docente sin informar",
      ).trim();

      const texto = String(observacion.texto || "").trim();

      if (!texto) return null;

      return {
        id: observacion.id || `${asignatura}-${docente}-${indice}`,
        asignatura,
        docente,
        texto,
        estado: String(observacion.estado || "").trim(),
        fecha: String(observacion.fecha || "").trim(),
        origen: String(observacion.origen || "").trim(),
      };
    })
    .filter(Boolean);

const agruparObservacionesPorAsignatura = (observaciones = []) => {
  const grupos = new Map();

  observaciones.forEach((observacion) => {
    const clave = observacion.asignatura.toLocaleLowerCase("es");

    if (!grupos.has(clave)) {
      grupos.set(clave, {
        asignatura: observacion.asignatura,
        docentes: new Set(),
        observaciones: [],
      });
    }

    const grupo = grupos.get(clave);

    if (observacion.docente && observacion.docente !== "Docente sin informar") {
      grupo.docentes.add(observacion.docente);
    }

    grupo.observaciones.push(observacion);
  });

  return [...grupos.values()]
    .map((grupo) => ({
      ...grupo,
      docentes: [...grupo.docentes],
    }))
    .sort((grupoA, grupoB) =>
      grupoA.asignatura.localeCompare(grupoB.asignatura, "es", {
        sensitivity: "base",
      }),
    );
};

const construirSintesisObservaciones = ({
  observaciones = [],
  cantidadEspacios = 0,
}) => {
  if (observaciones.length === 0) return "";

  const cantidadRegistros = observaciones.length;
  const espaciosConObservaciones = new Set(
    observaciones.map((observacion) =>
      observacion.asignatura.toLocaleLowerCase("es"),
    ),
  ).size;

  const cantidadEspaciosTexto =
    cantidadEspacios > 0 ? cantidadEspacios : espaciosConObservaciones;

  const referenciaEspacios =
    cantidadEspaciosTexto === 1
      ? "un espacio curricular"
      : `${cantidadEspaciosTexto} espacios curriculares`;

  const referenciaRegistros =
    cantidadRegistros === 1
      ? "un registro pedagógico"
      : `${cantidadRegistros} registros pedagógicos`;

  return (
    `El estudiante participa en ${referenciaEspacios} de fortalecimiento. ` +
    `El equipo responsable ha incorporado ${referenciaRegistros} que permiten ` +
    "documentar los avances observados, las necesidades de acompañamiento y " +
    "las orientaciones propuestas para la continuidad de su trayectoria educativa."
  );
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  const fechaNormalizada = new Date(fecha);

  if (Number.isNaN(fechaNormalizada.getTime())) {
    return fecha;
  }

  return fechaNormalizada.toLocaleDateString("es-AR");
};

export default function IntervencionesInstitucionales({
  participaFotia = false,
  registraAntecedentesFotia = false,
  asignaturasEnFortalecimiento = [],
  asignaturasAcreditadas = [],
  acreditacionesDetalladas = [],
  docentesResponsables = [],
  observaciones = [],
  informeEquipoFortalecimiento = "",
  nombrePrograma = "Programa Institucional de Fortalecimiento de Trayectorias Educativas (FOTIA)",
}) {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const asignaturasActivasTexto = obtenerListaLegible(
    asignaturasEnFortalecimiento,
  );

  const asignaturasAcreditadasTexto = obtenerListaLegible(
    asignaturasAcreditadas,
  );

  const docentesTexto = obtenerListaLegible(docentesResponsables);

  const observacionesNormalizadas = useMemo(
    () => normalizarObservaciones(observaciones),
    [observaciones],
  );

  const observacionesAgrupadas = useMemo(
    () => agruparObservacionesPorAsignatura(observacionesNormalizadas),
    [observacionesNormalizadas],
  );

  const informeFortalecimientoLimpio =
    typeof informeEquipoFortalecimiento === "string"
      ? informeEquipoFortalecimiento.trim()
      : "";

  const sintesisObservaciones = useMemo(
    () =>
      construirSintesisObservaciones({
        observaciones: observacionesNormalizadas,
        cantidadEspacios:
          asignaturasEnFortalecimiento.length + asignaturasAcreditadas.length,
      }),
    [
      observacionesNormalizadas,
      asignaturasEnFortalecimiento.length,
      asignaturasAcreditadas.length,
    ],
  );

  const tieneParticipacionActual =
    participaFotia === true || asignaturasEnFortalecimiento.length > 0;

  const informeVisible = tieneParticipacionActual
    ? sintesisObservaciones || informeFortalecimientoLimpio
    : "";

  const construirTextoParticipacion = () => {
    if (!tieneParticipacionActual) {
      if (registraAntecedentesFotia) {
        return (
          "Al momento de la emisión del presente informe, el estudiante no " +
          "registra participación activa en dispositivos institucionales de " +
          "fortalecimiento de trayectorias educativas. Existen antecedentes " +
          "de registros institucionales previos vinculados al programa."
        );
      }

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
            asignaturasEnFortalecimiento.length === 1 ? "el área" : "las áreas"
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
      partes.push(`El estudiante participó del ${nombrePrograma}.`);
    }

    if (asignaturasAcreditadas.length === 0) {
      partes.push(
        "Al momento de la emisión del presente informe no registra " +
          "acreditaciones dentro del programa.",
      );
    } else if (asignaturasEnFortalecimiento.length === 0) {
      partes.push(
        `Ha acreditado satisfactoriamente ${
          asignaturasAcreditadas.length === 1 ? "el área" : "las áreas"
        } de ${asignaturasAcreditadasTexto}.`,
      );
    } else {
      partes.push(
        `Ha acreditado satisfactoriamente ${
          asignaturasAcreditadas.length === 1 ? "el área" : "las áreas"
        } de ${asignaturasAcreditadasTexto}, y continúa participando en ` +
          "las propuestas de fortalecimiento indicadas.",
      );
    }

    return partes.join(" ");
  };
  console.log(
    "INTERVENCIONES · asignaturasAcreditadas:",
    asignaturasAcreditadas,
  );

  console.log(
    "INTERVENCIONES · acreditaciones detalladas:",
    acreditacionesDetalladas,
  );

  return (
    <section
      className="intervenciones-institucionales"
      style={{
        marginTop: "26px",
        padding: "22px",
        border: "1px solid #c8ddd8",
        borderRadius: "16px",
        background: "linear-gradient(180deg, #f6fbfa 0%, #ffffff 100%)",
        boxShadow: "0 5px 16px rgba(40, 82, 78, 0.08)",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <style>
        {`
          @media print {
            .intervenciones-institucionales__boton-detalle,
            .intervenciones-institucionales__detalle {
              display: none !important;
            }

            .intervenciones-institucionales {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>

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

      {/* ======================================================
          ANTECEDENTES DE ACREDITACIÓN EN FORTALECIMIENTO
         ====================================================== */}

      {asignaturasAcreditadas.length > 0 && (
        <div
          style={{
            marginTop: "14px",
            padding: "16px 18px",
            border: "1px solid #cfe4dc",
            borderRadius: "12px",
            background: "#f7fbf9",
            breakInside: "avoid",
            pageBreakInside: "avoid",
          }}
        >
          <h4
            style={{
              margin: "0 0 10px",
              color: "#285e58",
              fontSize: "15px",
            }}
          >
            Antecedentes de acreditación en fortalecimiento
          </h4>

          <p
            style={{
              margin: "0 0 10px",
              color: "#40556a",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            El estudiante registra antecedentes de participación en el programa
            institucional de fortalecimiento, con{" "}
            <strong>
              {asignaturasAcreditadas.length}{" "}
              {asignaturasAcreditadas.length === 1
                ? "asignatura acreditada"
                : "asignaturas acreditadas"}
            </strong>
            .
          </p>

          <ul
            style={{
              margin: 0,
              paddingLeft: "22px",
              color: "#40556a",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            {acreditacionesDetalladas.map((acreditacion, index) => {
              const asignatura =
                acreditacion.asignatura || "Asignatura sin especificar";

              const docente =
                acreditacion.docenteNombre || "Docente no informado";

              const fecha = formatearFechaAcreditacion(
                acreditacion.fechaAcreditacion,
              );

              return (
                <li
                  key={
                    acreditacion._id ||
                    `${asignatura}-${acreditacion.fechaAcreditacion || ""}-${index}`
                  }
                  style={{
                    marginBottom:
                      index < acreditacionesDetalladas.length - 1 ? "7px" : 0,
                  }}
                >
                  <strong>{asignatura}</strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "2px",
                      color: "#607080",
                      fontSize: "13px",
                    }}
                  >
                    Docente responsable: {docente}
                    {fecha ? ` · Acreditada: ${fecha}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tieneParticipacionActual && (
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
            valor={asignaturasActivasTexto || "Sin áreas activas informadas"}
          />

          <DatoIntervencion
            etiqueta="Docentes responsables"
            valor={docentesTexto || "Sin docente informado"}
          />

          <DatoIntervencion
            etiqueta="Áreas acreditadas"
            valor={
              asignaturasAcreditadasTexto || "Sin acreditaciones registradas"
            }
          />
        </div>
      )}

      {informeVisible && (
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
            {informeVisible}
          </p>

          {observacionesAgrupadas.length > 0 && (
            <button
              type="button"
              className="intervenciones-institucionales__boton-detalle"
              onClick={() =>
                setMostrarDetalle((estadoAnterior) => !estadoAnterior)
              }
              aria-expanded={mostrarDetalle}
              style={{
                width: "100%",
                marginTop: "14px",
                padding: "10px 14px",
                border: "1px solid #b9d5cf",
                borderRadius: "9px",
                background: mostrarDetalle ? "#e4f3ef" : "#ffffff",
                color: "#285e58",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {mostrarDetalle
                ? "▲ Ocultar intervenciones por asignatura"
                : `📚 Ver intervenciones por asignatura (${observacionesAgrupadas.length})`}
            </button>
          )}

          {mostrarDetalle && observacionesAgrupadas.length > 0 && (
            <div
              className="intervenciones-institucionales__detalle"
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "14px",
              }}
            >
              {observacionesAgrupadas.map((grupo) => (
                <DetalleAsignatura key={grupo.asignatura} grupo={grupo} />
              ))}
            </div>
          )}
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

function DetalleAsignatura({ grupo }) {
  const docentesTexto =
    obtenerListaLegible(grupo.docentes) || "Docente sin informar";

  return (
    <article
      style={{
        overflow: "hidden",
        border: "1px solid #cfddd9",
        borderRadius: "11px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          padding: "11px 14px",
          borderBottom: "1px solid #dbe7e3",
          background: "#edf7f4",
        }}
      >
        <strong
          style={{
            display: "block",
            color: "#285e58",
            fontSize: "14px",
          }}
        >
          📘 {grupo.asignatura}
        </strong>

        <span
          style={{
            display: "block",
            marginTop: "4px",
            color: "#607080",
            fontSize: "12px",
          }}
        >
          Docente responsable: {docentesTexto}
        </span>
      </div>

      <div style={{ display: "grid" }}>
        {grupo.observaciones.map((observacion, indice) => {
          const fechaFormateada = formatearFecha(observacion.fecha);

          return (
            <div
              key={observacion.id}
              style={{
                padding: "13px 14px",
                borderTop: indice === 0 ? "none" : "1px solid #e5ece9",
              }}
            >
              {(observacion.estado || fechaFormateada) && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "7px",
                  }}
                >
                  {observacion.estado && (
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "999px",
                        background: "#eef4ff",
                        color: "#365d8d",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {observacion.estado}
                    </span>
                  )}

                  {fechaFormateada && (
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "999px",
                        background: "#f5f6f7",
                        color: "#667085",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      📅 {fechaFormateada}
                    </span>
                  )}
                </div>
              )}

              <p
                style={{
                  margin: 0,
                  color: "#4b5563",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  textAlign: "justify",
                }}
              >
                {observacion.texto}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
