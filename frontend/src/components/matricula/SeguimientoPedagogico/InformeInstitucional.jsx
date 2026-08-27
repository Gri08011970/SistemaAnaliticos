/*
 * ============================================================
 * INFORME INSTITUCIONAL
 * ============================================================
 *
 * Presenta la situación pedagógica del estudiante a partir
 * de la información ya disponible en el sistema.
 *
 * El informe organiza evidencias institucionales.
 * No reemplaza la valoración profesional del equipo docente.
 *
 * ============================================================
 */

import IntervencionesInstitucionales from "./IntervencionesInstitucionales";

function obtenerTextoSeguro(valor, textoAlternativo = "Sin información") {
  if (valor === null || valor === undefined || valor === "") {
    return textoAlternativo;
  }

  return valor;
}

function obtenerListaSegura(valor) {
  return Array.isArray(valor) ? valor : [];
}

function obtenerNombreAsignatura(item) {
  if (typeof item === "string") {
    return item;
  }

  return (
    item?.asignatura ||
    item?.nombre ||
    item?.materia ||
    item?.nombreAsignatura ||
    item?.espacioCurricular ||
    ""
  );
}

function obtenerAnioAsignatura(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  return (
    item.anio || item.año || item.anioAsignatura || item.añoAsignatura || ""
  );
}

function obtenerEstadoActual(item) {
  return item?.conceptual || item?.estadoActual || item?.estado || "";
}

export default function InformeInstitucional({
  informe,
  mostrarDetalleTecnico = false,
}) {
  if (!informe) {
    return (
      <section className="informe-institucional informe-institucional--vacio">
        <h2>Informe institucional</h2>

        <p>Todavía no hay información disponible para mostrar.</p>
      </section>
    );
  }

  const encabezado = informe.encabezado || {};

  const cantidades = informe.detalleTecnico?.cantidades || {};

  const cantidadTEA = Number(
    cantidades.tea || cantidades.cantidadTEA || cantidades.totalTEA || 0,
  );

  const cantidadTEP = Number(
    cantidades.tep || cantidades.cantidadTEP || cantidades.totalTEP || 0,
  );

  const cantidadTED = Number(
    cantidades.ted || cantidades.cantidadTED || cantidades.totalTED || 0,
  );

  const cantidadSinCargar = Number(
    cantidades.sinCargar ||
      cantidades.cantidadSinCargar ||
      cantidades.totalSinCargar ||
      0,
  );

  const antecedentesAcademicos = obtenerListaSegura(
    informe.antecedentesAcademicos?.todas,
  );

  const interpretacionesPedagogicas = obtenerListaSegura(
    informe.interpretacionesPedagogicas,
  );

  const desempenosActuales = obtenerListaSegura(
    informe.detalleTecnico?.situacionActual?.desempenos,
  );

  const asignaturasConDificultad = desempenosActuales.filter(
    (item) =>
      item?.asignatura &&
      (item?.conceptual === "TEP" || item?.conceptual === "TED"),
  );

  const interpretacionesAgrupadas = Object.values(
    interpretacionesPedagogicas.reduce((acumulador, interpretacion) => {
      const clave = [
        interpretacion.titulo || "",
        interpretacion.area || "",
        interpretacion.asignaturaPendiente || "",
        interpretacion.anioPendiente || "",
        interpretacion.estadoActual || "",
        interpretacion.periodo || "",
      ]
        .join("::")
        .toUpperCase();

      if (!acumulador[clave]) {
        acumulador[clave] = {
          ...interpretacion,
          asignaturasActuales: [],
        };
      }

      if (
        interpretacion.asignaturaActual &&
        !acumulador[clave].asignaturasActuales.includes(
          interpretacion.asignaturaActual,
        )
      ) {
        acumulador[clave].asignaturasActuales.push(
          interpretacion.asignaturaActual,
        );
      }

      return acumulador;
    }, {}),
  );
  return (
    <article
      id="informe-institucional-imprimir"
      className="informe-institucional"
    >
      {/* ======================================================
          ENCABEZADO
         ====================================================== */}

      <header className="informe-institucional__encabezado">
        {informe.institucion && (
          <p className="informe-institucional__institucion">
            {informe.institucion}
          </p>
        )}

        <h2 className="informe-institucional__titulo">
          INFORME INSTITUCIONAL DE SEGUIMIENTO PEDAGÓGICO
        </h2>

        <p className="informe-institucional__fecha">
          Fecha de elaboración: {obtenerTextoSeguro(informe.fechaFormateada)}
        </p>
      </header>

      {/* ======================================================
          DATOS DEL ESTUDIANTE
         ====================================================== */}

      <section className="informe-institucional__datos">
        <div className="informe-institucional__dato informe-institucional__dato--principal">
          <span className="informe-institucional__dato-etiqueta">
            Estudiante
          </span>

          <strong className="informe-institucional__dato-valor">
            {obtenerTextoSeguro(
              informe.estudiante?.apellidoNombre ||
                informe.estudiante?.nombreCompleto ||
                informe.estudiante?.nombre ||
                informe.encabezado?.estudiante,
            )}
          </strong>
        </div>

        <div className="informe-institucional__datos-secundarios">
          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">DNI</span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.estudiante?.dni || informe.encabezado?.dni,
              )}
            </strong>
          </div>

          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">Curso</span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.curso ||
                  informe.estudiante?.curso ||
                  informe.encabezado?.curso,
              )}
            </strong>
          </div>

          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">Turno</span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.estudiante?.turno || informe.encabezado?.turno,
              )}
            </strong>
          </div>

          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">
              Período analizado
            </span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.periodo || informe.encabezado?.periodo,
              )}
            </strong>
          </div>
        </div>
      </section>

      {/* ======================================================
          ESTAMOS ACÁ
         ====================================================== */}

      <section className="informe-institucional__seccion">
        <h3>Situación pedagógica actual</h3>

        <p>
          La siguiente información reúne los registros pedagógicos disponibles
          para el período analizado.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <IndicadorSituacion etiqueta="TEA" cantidad={cantidadTEA} />

          <IndicadorSituacion etiqueta="TEP" cantidad={cantidadTEP} />

          <IndicadorSituacion etiqueta="TED" cantidad={cantidadTED} />

          <IndicadorSituacion
            etiqueta="Sin registro"
            cantidad={cantidadSinCargar}
          />
        </div>

        {asignaturasConDificultad.length > 0 && (
          <div style={{ marginTop: "18px" }}>
            <h4>Asignaturas que requieren atención</h4>

            <ul>
              {asignaturasConDificultad.map((item, indice) => (
                <li key={`${item.asignatura}-${indice}`}>
                  <strong>{item.asignatura}</strong>
                  {" — "}
                  {item.conceptual}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ======================================================
          ANTECEDENTES ACADÉMICOS
         ====================================================== */}

      <section className="informe-institucional__seccion">
        <h3>Antecedentes académicos relevantes</h3>

        {antecedentesAcademicos.length > 0 ? (
          <>
            <p>Asignaturas pendientes de acreditación:</p>

            <ul>
              {antecedentesAcademicos.map((pendiente, indice) => {
                const nombre = obtenerNombreAsignatura(pendiente);

                const anio = obtenerAnioAsignatura(pendiente);

                return (
                  <li key={`${nombre}-${anio}-${indice}`}>
                    <strong>{nombre || "Asignatura sin informar"}</strong>

                    {anio ? ` — ${anio} año` : ""}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p>No se registran asignaturas pendientes de acreditación.</p>
        )}
      </section>

      {/* ======================================================
    CONTINUIDADES / RELACIONES PEDAGÓGICAS
   ====================================================== */}

      {interpretacionesAgrupadas.length > 0 && (
        <section className="informe-institucional__seccion">
          <h3>Relaciones entre antecedentes y situación actual</h3>

          <p>
            El sistema detectó las siguientes relaciones que pueden resultar
            relevantes para el análisis pedagógico del equipo.
          </p>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "14px",
            }}
          >
            {interpretacionesAgrupadas.map((interpretacion, indice) => {
              const asignaturasActuales =
                interpretacion.asignaturasActuales || [];

              const tieneVariasAsignaturasActuales =
                asignaturasActuales.length > 1;

              const nombrePendiente =
                interpretacion.asignaturaPendiente || "un espacio previo";

              const anioPendiente = interpretacion.anioPendiente
                ? ` — ${interpretacion.anioPendiente} año`
                : "";

              return (
                <div
                  key={[
                    interpretacion.codigo,
                    interpretacion.area,
                    interpretacion.asignaturaPendiente,
                    interpretacion.anioPendiente,
                    interpretacion.estadoActual,
                    interpretacion.periodo,
                    indice,
                  ]
                    .filter(Boolean)
                    .join("-")}
                  style={{
                    padding: "13px 15px",
                    border: "1px solid #d8e4ec",
                    borderRadius: "10px",
                    background: "#f9fbfc",
                  }}
                >
                  {interpretacion.titulo && (
                    <strong
                      style={{
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      {interpretacion.titulo}
                    </strong>
                  )}

                  {tieneVariasAsignaturasActuales &&
                  interpretacion.estadoActual === "TEP" ? (
                    <>
                      <p
                        style={{
                          margin: "0 0 7px",
                          lineHeight: 1.55,
                        }}
                      >
                        Se registra{" "}
                        <strong>
                          {nombrePendiente}
                          {anioPendiente}
                        </strong>{" "}
                        pendiente de acreditación y, en el período analizado, se
                        observan Trayectorias Educativas en Proceso en:
                      </p>

                      <ul
                        style={{
                          margin: "0 0 7px",
                          paddingLeft: "22px",
                          lineHeight: 1.55,
                        }}
                      >
                        {asignaturasActuales.map((asignatura) => (
                          <li key={`${interpretacion.area}-${asignatura}`}>
                            <strong>{asignatura}</strong>
                          </li>
                        ))}
                      </ul>

                      {interpretacion.interpretacion && (
                        <p
                          style={{
                            margin: 0,
                            lineHeight: 1.55,
                          }}
                        >
                          {interpretacion.interpretacion}
                        </p>
                      )}
                    </>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {obtenerTextoSeguro(
                        interpretacion.descripcion ||
                          interpretacion.interpretacion,
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ======================================================
    FOTIA / FORTE
   ====================================================== */}

      <IntervencionesInstitucionales
        {...(informe.intervencionesInstitucionales || {})}
      />

      {/* ======================================================
    AHORA ACORDAMOS
   ====================================================== */}
      <section
        className="informe-institucional__seccion"
        style={{
          marginTop: "24px",
          padding: "18px",
          border: "2px solid #b9d4ea",
          borderRadius: "14px",
          background: "#f7fbfd",
        }}
      >
        <span
          style={{
            display: "block",
            marginBottom: "5px",
            color: "#607080",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Análisis institucional
        </span>

        <h3 style={{ marginTop: 0 }}>Ahora, ¿cómo seguimos?</h3>

        <p style={{ marginBottom: "18px" }}>
          A partir de la información precedente, el equipo docente y directivo
          podrá analizar la situación, identificar saberes prioritarios y
          acordar estrategias de acompañamiento.
        </p>

        {/* ======================================================
    LECTURA PEDAGÓGICA COMPARTIDA
   ====================================================== */}

        <div
          style={{
            padding: "16px 18px",
            border: "1px solid #d4e3ee",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#315f75",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Lectura pedagógica compartida
            </strong>

            <p
              style={{
                margin: 0,
                color: "#6b7f92",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Espacio destinado a registrar la lectura construida por el equipo
              docente y directivo a partir de la información precedente.
            </p>
          </div>

          <textarea
            rows={5}
            placeholder="Registrar aquí la lectura pedagógica compartida..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              border: "1px solid #cbdbe7",
              borderRadius: "9px",
              background: "#fbfdff",
              color: "#31465a",
              fontSize: "14px",
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>
        {/* ======================================================
    FORTALEZAS OBSERVADAS
   ====================================================== */}

        <div
          style={{
            marginTop: "14px",
            padding: "16px 18px",
            border: "1px solid #d4e3ee",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#315f75",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Fortalezas observadas
            </strong>

            <p
              style={{
                margin: 0,
                color: "#6b7f92",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Registrar avances, capacidades, modos de participación, intereses
              o condiciones favorables que puedan constituirse en puntos de
              apoyo para el acompañamiento pedagógico.
            </p>
          </div>

          <textarea
            rows={4}
            placeholder="Registrar aquí las fortalezas observadas..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              border: "1px solid #cbdbe7",
              borderRadius: "9px",
              background: "#fbfdff",
              color: "#31465a",
              fontSize: "14px",
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        {/* ======================================================
    SABERES / APRENDIZAJES PRIORITARIOS
   ====================================================== */}

        <div
          style={{
            marginTop: "14px",
            padding: "16px 18px",
            border: "1px solid #d4e3ee",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              marginBottom: "12px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#315f75",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Saberes y aprendizajes prioritarios
            </strong>

            <p
              style={{
                margin: 0,
                color: "#6b7f92",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              A partir de las trayectorias actualmente en proceso o
              discontinuas, identificar los saberes que requieren ser retomados,
              fortalecidos o profundizados en cada espacio curricular.
            </p>
          </div>

          {asignaturasConDificultad.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {asignaturasConDificultad.map((item, indice) => (
                <div
                  key={`${item.asignatura}-${item.conceptual}-${indice}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(150px, 0.7fr) minmax(240px, 2fr)",
                    gap: "12px",
                    alignItems: "center",
                    padding: "11px 12px",
                    border: "1px solid #dce6ed",
                    borderRadius: "9px",
                    background: "#fbfdff",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#31465a",
                        fontSize: "14px",
                      }}
                    >
                      {item.asignatura}
                    </strong>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        color:
                          item.conceptual === "TED" ? "#9b4d4d" : "#8a6d2f",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {item.conceptual}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    placeholder={`Saberes/aprendizajes a priorizar en ${item.asignatura}...`}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "9px 11px",
                      border: "1px solid #cbdbe7",
                      borderRadius: "8px",
                      background: "#ffffff",
                      color: "#31465a",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      lineHeight: 1.5,
                      resize: "vertical",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                padding: "12px",
                borderRadius: "8px",
                background: "#f6faf8",
                color: "#607080",
                fontSize: "13px",
              }}
            >
              No se registran actualmente asignaturas con TEP o TED para este
              período.
            </p>
          )}
        </div>

        {/* ======================================================
    ACUERDOS PEDAGÓGICOS
   ====================================================== */}

        <div
          style={{
            marginTop: "14px",
            padding: "16px 18px",
            border: "1px solid #d4e3ee",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              marginBottom: "12px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#315f75",
                fontSize: "15px",
                marginBottom: "4px",
              }}
            >
              Acuerdos pedagógicos
            </strong>

            <p
              style={{
                margin: 0,
                color: "#6b7f92",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Seleccionar las estrategias acordadas por el equipo docente y
              directivo para acompañar la trayectoria del estudiante.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "10px",
            }}
          >
            {[
              "Recuperación de saberes prioritarios",
              "Actividades diferenciadas",
              "Articulación con FOTIA-FORTE",
              "Intensificación dentro del espacio curricular",
              "Seguimiento de asistencia",
              "Comunicación con adulto responsable",
              "Acompañamiento del Equipo de Conducción",
            ].map((acuerdo) => (
              <label
                key={acuerdo}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  padding: "10px 12px",
                  border: "1px solid #dce6ed",
                  borderRadius: "9px",
                  background: "#fbfdff",
                  color: "#40556a",
                  fontSize: "13px",
                  lineHeight: 1.45,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />

                <span>{acuerdo}</span>
              </label>
            ))}
          </div>

          <div
            style={{
              marginTop: "12px",
            }}
          >
            <label
              style={{
                display: "block",
                color: "#40556a",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              Otro acuerdo o estrategia
            </label>

            <input
              type="text"
              placeholder="Registrar otro acuerdo pedagógico..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #cbdbe7",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#31465a",
                fontSize: "13px",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
    ACCIONES A IMPLEMENTAR
   ====================================================== */}

      <div
        style={{
          marginTop: "14px",
          padding: "16px 18px",
          border: "1px solid #d4e3ee",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#315f75",
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            Acciones a implementar
          </strong>

          <p
            style={{
              margin: 0,
              color: "#6b7f92",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Registrar las acciones concretas acordadas para acompañar la
            trayectoria del estudiante, especificando las intervenciones que se
            desarrollarán durante el período de seguimiento.
          </p>
        </div>

        <textarea
          rows={5}
          placeholder="Ej.: diseñar una secuencia breve de recuperación de saberes, ofrecer instancias diferenciadas de trabajo, articular con el equipo de fortalecimiento, realizar seguimiento quincenal..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            border: "1px solid #cbdbe7",
            borderRadius: "9px",
            background: "#fbfdff",
            color: "#31465a",
            fontSize: "14px",
            fontFamily: "inherit",
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>
      {/* ======================================================
    RESPONSABLES Y FECHA DE REVISIÓN
   ====================================================== */}

      <div
        style={{
          marginTop: "14px",
          padding: "16px 18px",
          border: "1px solid #d4e3ee",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#315f75",
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            Responsables y fecha de revisión
          </strong>

          <p
            style={{
              margin: 0,
              color: "#6b7f92",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Identificar los responsables del acompañamiento y establecer una
            fecha para revisar los avances y los acuerdos adoptados.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
            gap: "12px",
          }}
        >
          <CampoCorto
            etiqueta="Docente/s responsable/s"
            placeholder="Nombre/s del/de los docente/s"
          />

          <CampoCorto
            etiqueta="Equipo de Conducción"
            placeholder="Responsable/s del EC"
          />

          <CampoCorto
            etiqueta="Equipo FOTIA-FORTE"
            placeholder="Responsable/s, si corresponde"
          />

          <CampoCorto
            etiqueta="Otros actores"
            placeholder="Preceptoría, EOE, familia, otros"
          />

          <label
            style={{
              display: "grid",
              gap: "6px",
              color: "#40556a",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            Fecha prevista de revisión
            <input
              type="date"
              style={{
                padding: "10px 12px",
                border: "1px solid #cbdbe7",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#31465a",
                fontSize: "13px",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </label>
        </div>
      </div>

      {/* ======================================================
    REGISTRO DE EVOLUCIÓN
   ====================================================== */}

      <div
        style={{
          marginTop: "14px",
          padding: "16px 18px",
          border: "1px solid #d4e3ee",
          borderRadius: "12px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#315f75",
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            Registro de evolución y seguimiento
          </strong>

          <p
            style={{
              margin: 0,
              color: "#6b7f92",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Registrar en las instancias de revisión los avances observados, las
            dificultades que persisten y las decisiones adoptadas para dar
            continuidad al acompañamiento.
          </p>
        </div>

        <div
          style={{
            padding: "14px",
            border: "1px solid #dce6ed",
            borderRadius: "10px",
            background: "#fbfdff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(170px, 0.45fr) minmax(220px, 1fr)",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <label
              style={{
                display: "grid",
                gap: "6px",
                color: "#40556a",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              Fecha de revisión
              <input
                type="date"
                style={{
                  padding: "10px 12px",
                  border: "1px solid #cbdbe7",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#31465a",
                  fontSize: "13px",
                  fontFamily: "inherit",
                }}
              />
            </label>

            <CampoCorto
              etiqueta="Participantes de la revisión"
              placeholder="Docentes, EC y otros participantes"
            />
          </div>

          <label
            style={{
              display: "grid",
              gap: "6px",
              marginBottom: "12px",
              color: "#40556a",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            Avances observados
            <textarea
              rows={3}
              placeholder="Registrar avances observados desde los acuerdos anteriores..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #cbdbe7",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#31465a",
                fontSize: "13px",
                fontFamily: "inherit",
                lineHeight: 1.55,
                resize: "vertical",
              }}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "6px",
              marginBottom: "12px",
              color: "#40556a",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            Dificultades que persisten
            <textarea
              rows={3}
              placeholder="Registrar situaciones que requieren continuidad o revisión..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #cbdbe7",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#31465a",
                fontSize: "13px",
                fontFamily: "inherit",
                lineHeight: 1.55,
                resize: "vertical",
              }}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "6px",
              color: "#40556a",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            Continuidad / nuevos acuerdos
            <textarea
              rows={3}
              placeholder="Registrar qué estrategias se sostienen, modifican o incorporan..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #cbdbe7",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#31465a",
                fontSize: "13px",
                fontFamily: "inherit",
                lineHeight: 1.55,
                resize: "vertical",
              }}
            />
          </label>
        </div>

        <button
          type="button"
          style={{
            marginTop: "12px",
            padding: "9px 14px",
            border: "1px solid #b9d4ea",
            borderRadius: "8px",
            background: "#f4f9fd",
            color: "#315f75",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          + Agregar nueva instancia de seguimiento
        </button>
      </div>

      {/* ======================================================
          ACLARACIÓN PROFESIONAL
         ====================================================== */}

      {informe.aclaracionInstitucional && (
        <aside className="informe-institucional__aclaracion">
          <strong>Aclaración</strong>

          <p>{informe.aclaracionInstitucional}</p>
        </aside>
      )}

      {/* ======================================================
          DETALLE TÉCNICO
         ====================================================== */}

      {mostrarDetalleTecnico && (
        <details className="informe-institucional__detalle-tecnico">
          <summary>Ver detalle técnico</summary>

          <pre>{JSON.stringify(informe.detalleTecnico, null, 2)}</pre>
        </details>
      )}
    </article>
  );
}

function IndicadorSituacion({ etiqueta, cantidad }) {
  return (
    <div
      style={{
        padding: "13px",
        border: "1px solid #d6e2eb",
        borderRadius: "10px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "block",
          color: "#607080",
          fontSize: "11px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {etiqueta}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: "5px",
          color: "#23436d",
          fontSize: "24px",
        }}
      >
        {cantidad}
      </strong>
    </div>
  );
}

function CampoCorto({ etiqueta, placeholder }) {
  return (
    <label
      style={{
        display: "grid",
        gap: "6px",
        color: "#40556a",
        fontSize: "13px",
        fontWeight: "700",
      }}
    >
      {etiqueta}

      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          border: "1px solid #cbdbe7",
          borderRadius: "8px",
          background: "#ffffff",
          color: "#31465a",
          fontSize: "13px",
          fontFamily: "inherit",
          outline: "none",
        }}
      />
    </label>
  );
}
