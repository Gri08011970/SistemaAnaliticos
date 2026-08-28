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
 *
 * ============================================================
 */
import { useEffect, useState } from "react";
import IntervencionesInstitucionales from "./IntervencionesInstitucionales";
import "./InformeInstitucional.css";

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

function crearSeguimientoVacio() {
  return {
    fecha: "",
    participantes: "",
    avances: "",
    dificultades: "",
    nuevosAcuerdos: "",
  };
}

function crearAcompanamientoVacio() {
  return {
    lecturaCompartida: "",
    fortalezasObservadas: "",

    saberesPrioritarios: {},

    acuerdosPedagogicos: [],
    otroAcuerdo: "",

    accionesImplementar: "",

    responsables: {
      docentes: "",
      equipoConduccion: "",
      equipoFotiaForte: "",
      otrosActores: "",
      fechaRevision: "",
    },

    seguimientos: [crearSeguimientoVacio()],
  };
}

export default function InformeInstitucional({
  informe,
  mostrarDetalleTecnico = false,
}) {
  const [acompanamiento, setAcompanamiento] = useState(
    crearAcompanamientoVacio,
  );
  const estudianteId =
    informe?.estudiante?._id ||
    informe?.estudiante?.id ||
    informe?.estudiante?.dni ||
    "";
  const [estadoGuardado, setEstadoGuardado] = useState("");

  const periodoAcompanamiento =
    informe?.periodo || informe?.encabezado?.periodo || "";

  const claveAcompanamiento = `${estudianteId}::${periodoAcompanamiento}`;

  useEffect(() => {
    let componenteActivo = true;

    async function cargarAcompanamiento() {
      if (!estudianteId || !periodoAcompanamiento) {
        if (componenteActivo) {
          setAcompanamiento(crearAcompanamientoVacio());
        }

        return;
      }

      try {
        const parametros = new URLSearchParams({
          alumnoId: String(estudianteId),
          periodo: periodoAcompanamiento,
        });

        const respuesta = await fetch(
          `/api/acompanamiento-institucional?${parametros.toString()}`,
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el acompañamiento institucional");
        }

        const datos = await respuesta.json();

        if (!componenteActivo) {
          return;
        }

        if (datos) {
          setAcompanamiento({
            ...crearAcompanamientoVacio(),
            ...datos,
            responsables: {
              ...crearAcompanamientoVacio().responsables,
              ...(datos.responsables || {}),
            },
            seguimientos:
              Array.isArray(datos.seguimientos) && datos.seguimientos.length > 0
                ? datos.seguimientos
                : [crearSeguimientoVacio()],
          });
        } else {
          setAcompanamiento(crearAcompanamientoVacio());
        }
      } catch (error) {
        console.error("Error al cargar acompañamiento institucional:", error);

        if (componenteActivo) {
          setAcompanamiento(crearAcompanamientoVacio());
        }
      }
    }

    cargarAcompanamiento();

    return () => {
      componenteActivo = false;
    };
  }, [estudianteId, periodoAcompanamiento]);

  async function guardarAcompanamiento() {
  if (!estudianteId || !periodoAcompanamiento) {
    return;
  }

  setEstadoGuardado("guardando");

  try {
    const respuesta = await fetch(
      "/api/acompanamiento-institucional",
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          alumnoId: String(estudianteId),
          periodo: periodoAcompanamiento,
          curso:
            informe?.curso ||
            informe?.estudiante?.curso ||
            "",

          ...acompanamiento,
        }),
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo guardar el acompañamiento institucional",
      );
    }

    const datosGuardados = await respuesta.json();

    setAcompanamiento((anterior) => ({
      ...anterior,
      ...datosGuardados,

      responsables: {
        ...anterior.responsables,
        ...(datosGuardados.responsables || {}),
      },

      seguimientos:
        Array.isArray(datosGuardados.seguimientos) &&
        datosGuardados.seguimientos.length > 0
          ? datosGuardados.seguimientos
          : anterior.seguimientos,
    }));

    setEstadoGuardado("guardado");

    setTimeout(() => {
      setEstadoGuardado("");
    }, 3000);
  } catch (error) {
    console.error(
      "Error al guardar acompañamiento institucional:",
      error,
    );

    setEstadoGuardado("error");
  }
}
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

      <section className="informe-institucional__capitulo">
        <header className="informe-institucional__capitulo-encabezado">
          <span className="informe-institucional__capitulo-numero">
            01 · Lectura institucional
          </span>

          <h2 className="informe-institucional__capitulo-titulo">
            Situación de la trayectoria
          </h2>

          <p className="informe-institucional__capitulo-descripcion">
            Síntesis de la situación pedagógica actual, los antecedentes
            académicos y las relaciones relevantes para el análisis
            institucional de la trayectoria.
          </p>
        </header>

        {/* ======================================================
          ESTAMOS ACÁ
         ====================================================== */}

        <section className="informe-institucional__seccion">
          <h3>Situación pedagógica actual</h3>

          <p>
            La siguiente información reúne los registros pedagógicos disponibles
            para el período analizado.
          </p>

          <div className="informe-institucional__indicadores">
            <IndicadorSituacion etiqueta="TEA" cantidad={cantidadTEA} />

            <IndicadorSituacion etiqueta="TEP" cantidad={cantidadTEP} />

            <IndicadorSituacion etiqueta="TED" cantidad={cantidadTED} />

            <IndicadorSituacion
              etiqueta="Sin registro"
              cantidad={cantidadSinCargar}
            />
          </div>

          {asignaturasConDificultad.length > 0 && (
            <div className="informe-institucional__atencion">
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

            <div className="informe-institucional__relaciones">
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
                    className="informe-institucional__relacion"
                  >
                    {interpretacion.titulo && (
                      <strong className="informe-institucional__relacion-titulo">
                        {interpretacion.titulo}
                      </strong>
                    )}

                    {tieneVariasAsignaturasActuales &&
                    interpretacion.estadoActual === "TEP" ? (
                      <>
                        <p className="informe-institucional__relacion-texto">
                          Se registra{" "}
                          <strong>
                            {nombrePendiente}
                            {anioPendiente}
                          </strong>{" "}
                          pendiente de acreditación y, en el período analizado,
                          se observan Trayectorias Educativas en Proceso en:
                        </p>

                        <ul className="informe-institucional__relacion-lista">
                          {asignaturasActuales.map((asignatura) => (
                            <li key={`${interpretacion.area}-${asignatura}`}>
                              <strong>{asignatura}</strong>
                            </li>
                          ))}
                        </ul>

                        {interpretacion.interpretacion && (
                          <p className="informe-institucional__relacion-texto informe-institucional__relacion-texto--final">
                            {interpretacion.interpretacion}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="informe-institucional__relacion-texto">
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
      </section>

      {/* ======================================================
    FOTIA / FORTE
   ====================================================== */}

      <section className="informe-institucional__capitulo informe-institucional__capitulo--pagina-2">
        <div className="informe-institucional__continuidad-impresion">
          <strong>
            {obtenerTextoSeguro(
              informe.estudiante?.apellidoNombre ||
                informe.estudiante?.nombreCompleto ||
                informe.estudiante?.nombre ||
                informe.encabezado?.estudiante,
            )}
          </strong>

          <span>
            {obtenerTextoSeguro(
              informe.curso ||
                informe.estudiante?.curso ||
                informe.encabezado?.curso,
            )}
            {" · "}
            Turno{" "}
            {obtenerTextoSeguro(
              informe.estudiante?.turno || informe.encabezado?.turno,
            )}
            {" · "}
            {obtenerTextoSeguro(informe.periodo || informe.encabezado?.periodo)}
          </span>
        </div>
        <header className="informe-institucional__capitulo-encabezado">
          <span className="informe-institucional__capitulo-numero">
            02 · Acompañamiento institucional
          </span>

          <h2 className="informe-institucional__capitulo-titulo">
            Intervenciones institucionales
          </h2>

          <p className="informe-institucional__capitulo-descripcion">
            Registro de las acciones, dispositivos y antecedentes de
            acompañamiento institucional vinculados a la trayectoria del
            estudiante.
          </p>
        </header>

        <IntervencionesInstitucionales
          {...(informe.intervencionesInstitucionales || {})}
        />
      </section>

      {/* ======================================================
    AHORA ACORDAMOS
   ====================================================== */}
      {/* ======================================================
    CAPÍTULO III · ANÁLISIS Y ACUERDOS
   ====================================================== */}

      <section className="informe-institucional__capitulo">
        <header className="informe-institucional__capitulo-encabezado">
          <span className="informe-institucional__capitulo-numero">
            03 · Análisis y acuerdos
          </span>

          <h2 className="informe-institucional__capitulo-titulo">
            Construcción del acompañamiento pedagógico
          </h2>

          <p className="informe-institucional__capitulo-descripcion">
            Espacio destinado a la lectura compartida de la trayectoria, la
            definición de prioridades y los acuerdos institucionales de
            acompañamiento.
          </p>
        </header>
        {/* ==============================================
        
                  LECTURA PEDAGÓGICA COMPARTIDA 
            ====================================================== */}

        <div className="informe-institucional__campo-trabajo">
          <div className="informe-institucional__campo-encabezado">
            <strong className="informe-institucional__campo-titulo">
              Lectura pedagógica compartida
            </strong>

            <p className="informe-institucional__campo-descripcion">
              Espacio destinado a registrar la lectura construida por el equipo
              docente y directivo a partir de la información precedente.
            </p>
          </div>

          <textarea
            rows={3}
            className="informe-institucional__textarea"
            placeholder="Registrar aquí la lectura pedagógica compartida..."
            value={acompanamiento.lecturaCompartida}
            onChange={(evento) =>
              setAcompanamiento((anterior) => ({
                ...anterior,
                lecturaCompartida: evento.target.value,
              }))
            }
          />
        </div>

       

        {/* ======================================================
    FORTALEZAS OBSERVADAS
   ====================================================== */}

        <div className="informe-institucional__campo-trabajo">
          <div className="informe-institucional__campo-encabezado">
            <strong className="informe-institucional__campo-titulo">
              Fortalezas observadas
            </strong>

            <p className="informe-institucional__campo-descripcion">
              Registrar avances, capacidades, modos de participación, intereses
              o condiciones favorables que puedan constituirse en puntos de
              apoyo para el acompañamiento pedagógico.
            </p>
          </div>

          <textarea
            rows={3}
            className="informe-institucional__textarea"
            placeholder="Registrar aquí las fortalezas observadas..."
            value={acompanamiento.fortalezasObservadas || ""}
            onChange={(e) =>
              setAcompanamiento((anterior) => ({
                ...anterior,
                fortalezasObservadas: e.target.value,
              }))
            }
          />
        </div>

        {/* ======================================================
    SABERES / APRENDIZAJES PRIORITARIOS
   ====================================================== */}

        <div className="informe-institucional__saberes">
          <div className="informe-institucional__campo-encabezado">
            <strong className="informe-institucional__campo-titulo">
              Saberes y aprendizajes prioritarios
            </strong>

            <p className="informe-institucional__campo-descripcion">
              A partir de las trayectorias actualmente en proceso o
              discontinuas, identificar los saberes que requieren ser retomados,
              fortalecidos o profundizados en cada espacio curricular.
            </p>
          </div>

          {asignaturasConDificultad.length > 0 ? (
            <div className="informe-institucional__saberes-lista">
              {asignaturasConDificultad.map((item, indice) => (
                <div
                  key={`${item.asignatura}-${item.conceptual}-${indice}`}
                  className="informe-institucional__saber-fila"
                >
                  <div className="informe-institucional__saber-asignatura">
                    <strong>{item.asignatura}</strong>

                    <span
                      className={
                        item.conceptual === "TED"
                          ? "informe-institucional__saber-estado informe-institucional__saber-estado--ted"
                          : "informe-institucional__saber-estado informe-institucional__saber-estado--tep"
                      }
                    >
                      {item.conceptual}
                    </span>
                  </div>

                  <textarea
                    rows={1}
                    className="informe-institucional__saber-textarea"
                    placeholder={`Saberes/aprendizajes a priorizar en ${item.asignatura}...`}
                    value={
                      acompanamiento.saberesPrioritarios?.[item.asignatura] ||
                      ""
                    }
                    onChange={(e) =>
                      setAcompanamiento((anterior) => ({
                        ...anterior,
                        saberesPrioritarios: {
                          ...(anterior.saberesPrioritarios || {}),
                          [item.asignatura]: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="informe-institucional__saberes-vacio">
              No se registran actualmente asignaturas con TEP o TED para este
              período.
            </p>
          )}
        </div>

        {/* =============================================
                   ACUERDOS PEDAGÓGICOS
        ====================================================== */}
        <div className="informe-institucional__continuidad-impresion informe-institucional__continuidad-impresion--pagina-3">
          <strong>
            {obtenerTextoSeguro(
              informe.estudiante?.apellidoNombre ||
                informe.estudiante?.nombreCompleto ||
                informe.estudiante?.nombre ||
                informe.encabezado?.estudiante,
            )}
          </strong>

          <span>
            {obtenerTextoSeguro(
              informe.curso ||
                informe.estudiante?.curso ||
                informe.encabezado?.curso,
            )}
            {" · "}
            Turno{" "}
            {obtenerTextoSeguro(
              informe.estudiante?.turno || informe.encabezado?.turno,
            )}
            {" · "}
            {obtenerTextoSeguro(informe.periodo || informe.encabezado?.periodo)}
          </span>
        </div>

        <div className="informe-institucional__acuerdos">
          <div className="informe-institucional__campo-encabezado">
            <strong className="informe-institucional__campo-titulo">
              Acuerdos pedagógicos
            </strong>

            <p className="informe-institucional__campo-descripcion">
              Seleccionar las estrategias acordadas por el equipo docente y
              directivo para acompañar la trayectoria del estudiante.
            </p>
          </div>

          <div className="informe-institucional__acuerdos-opciones">
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
                className="informe-institucional__acuerdo-opcion"
              >
                <input
                  type="checkbox"
                  checked={
                    acompanamiento.acuerdosPedagogicos?.includes(acuerdo) ||
                    false
                  }
                  onChange={(e) => {
                    const marcado = e.target.checked;

                    setAcompanamiento((anterior) => {
                      const acuerdosActuales = Array.isArray(
                        anterior.acuerdosPedagogicos,
                      )
                        ? anterior.acuerdosPedagogicos
                        : [];

                      return {
                        ...anterior,

                        acuerdosPedagogicos: marcado
                          ? [...acuerdosActuales, acuerdo]
                          : acuerdosActuales.filter((item) => item !== acuerdo),
                      };
                    });
                  }}
                />
                <span>{acuerdo}</span>
              </label>
            ))}
          </div>

          <div className="informe-institucional__acuerdo-otro">
            <label>Otro acuerdo o estrategia</label>

            <input
              type="text"
              placeholder="Registrar otro acuerdo pedagógico..."
              value={acompanamiento.otroAcuerdo || ""}
              onChange={(e) =>
                setAcompanamiento((anterior) => ({
                  ...anterior,
                  otroAcuerdo: e.target.value,
                }))
              }
            />
          </div>
        </div>

      {/* ======================================================
    ACCIONES A IMPLEMENTAR
   ====================================================== */}

<div className="informe-institucional__campo-trabajo">
  <div className="informe-institucional__campo-encabezado">
    <strong className="informe-institucional__campo-titulo">
      Acciones a implementar
    </strong>

    <p className="informe-institucional__campo-descripcion">
      Registrar las acciones concretas acordadas para acompañar la
      trayectoria del estudiante, especificando las intervenciones que
      se desarrollarán durante el período de seguimiento.
    </p>
  </div>

  <textarea
    rows={3}
    className="informe-institucional__textarea"
    placeholder="Ej.: diseñar una secuencia breve de recuperación de saberes, ofrecer instancias diferenciadas de trabajo, articular con el equipo de fortalecimiento, realizar seguimiento quincenal..."
    value={acompanamiento.accionesImplementar || ""}
    onChange={(e) =>
      setAcompanamiento((anterior) => ({
        ...anterior,
        accionesImplementar: e.target.value,
      }))
    }
  />
</div>

{/* ======================================================
    RESPONSABLES Y FECHA DE REVISIÓN
   ====================================================== */}

<div className="informe-institucional__responsables">
  <div className="informe-institucional__campo-encabezado">
    <strong className="informe-institucional__campo-titulo">
      Responsables y fecha de revisión
    </strong>

    <p className="informe-institucional__campo-descripcion">
      Identificar los responsables del acompañamiento y establecer una
      fecha para revisar los avances y los acuerdos adoptados.
    </p>
  </div>

  <div className="informe-institucional__responsables-grid">
    <CampoCorto
      etiqueta="Docente/s responsable/s"
      placeholder="Nombre/s del/de los docente/s"
      value={acompanamiento.responsables?.docentes || ""}
      onChange={(e) =>
        setAcompanamiento((anterior) => ({
          ...anterior,
          responsables: {
            ...(anterior.responsables || {}),
            docentes: e.target.value,
          },
        }))
      }
    />

    <CampoCorto
      etiqueta="Equipo de Conducción"
      placeholder="Responsable/s del EC"
      value={acompanamiento.responsables?.equipoConduccion || ""}
      onChange={(e) =>
        setAcompanamiento((anterior) => ({
          ...anterior,
          responsables: {
            ...(anterior.responsables || {}),
            equipoConduccion: e.target.value,
          },
        }))
      }
    />

    <CampoCorto
      etiqueta="Equipo FOTIA-FORTE"
      placeholder="Responsable/s, si corresponde"
      value={acompanamiento.responsables?.equipoFotiaForte || ""}
      onChange={(e) =>
        setAcompanamiento((anterior) => ({
          ...anterior,
          responsables: {
            ...(anterior.responsables || {}),
            equipoFotiaForte: e.target.value,
          },
        }))
      }
    />

    <CampoCorto
      etiqueta="Otros actores"
      placeholder="Preceptoría, EOE, familia, otros"
      value={acompanamiento.responsables?.otrosActores || ""}
      onChange={(e) =>
        setAcompanamiento((anterior) => ({
          ...anterior,
          responsables: {
            ...(anterior.responsables || {}),
            otrosActores: e.target.value,
          },
        }))
      }
    />

    <label className="informe-institucional__campo-corto">
      <span>Fecha prevista de revisión</span>

      <input
        type="date"
        value={acompanamiento.responsables?.fechaRevision || ""}
        onChange={(e) =>
          setAcompanamiento((anterior) => ({
            ...anterior,
            responsables: {
              ...(anterior.responsables || {}),
              fechaRevision: e.target.value,
            },
          }))
        }
      />
    </label>
  </div>
</div>

{/* ======================================================
    REGISTRO DE EVOLUCIÓN
   ====================================================== */}

<div className="informe-institucional__evolucion">
  <div className="informe-institucional__campo-encabezado">
    <strong className="informe-institucional__campo-titulo">
      Registro de evolución y seguimiento
    </strong>

    <p className="informe-institucional__campo-descripcion">
      Registrar en las instancias de revisión los avances observados,
      las dificultades que persisten y las decisiones adoptadas para dar
      continuidad al acompañamiento.
    </p>
  </div>

  {(acompanamiento.seguimientos || []).map((seguimiento, indice) => (
    <div
      key={seguimiento._id || `seguimiento-${indice}`}
      className="informe-institucional__evolucion-instancia"
    >
      <div className="informe-institucional__evolucion-datos">
        <label className="informe-institucional__campo-corto">
          <span>Fecha de revisión</span>

          <input
            type="date"
            value={seguimiento.fecha || ""}
            onChange={(e) =>
              setAcompanamiento((anterior) => ({
                ...anterior,
                seguimientos: anterior.seguimientos.map(
                  (item, posicion) =>
                    posicion === indice
                      ? {
                          ...item,
                          fecha: e.target.value,
                        }
                      : item,
                ),
              }))
            }
          />
        </label>

        <CampoCorto
          etiqueta="Participantes de la revisión"
          placeholder="Docentes, EC y otros participantes"
          value={seguimiento.participantes || ""}
          onChange={(e) =>
            setAcompanamiento((anterior) => ({
              ...anterior,
              seguimientos: anterior.seguimientos.map(
                (item, posicion) =>
                  posicion === indice
                    ? {
                        ...item,
                        participantes: e.target.value,
                      }
                    : item,
              ),
            }))
          }
        />
      </div>

      <label className="informe-institucional__evolucion-campo">
        <span>Avances observados</span>

        <textarea
          rows={2}
          placeholder="Registrar avances observados desde los acuerdos anteriores..."
          value={seguimiento.avances || ""}
          onChange={(e) =>
            setAcompanamiento((anterior) => ({
              ...anterior,
              seguimientos: anterior.seguimientos.map(
                (item, posicion) =>
                  posicion === indice
                    ? {
                        ...item,
                        avances: e.target.value,
                      }
                    : item,
              ),
            }))
          }
        />
      </label>

      <label className="informe-institucional__evolucion-campo">
        <span>Dificultades que persisten</span>

        <textarea
          rows={2}
          placeholder="Registrar situaciones que requieren continuidad o revisión..."
          value={seguimiento.dificultades || ""}
          onChange={(e) =>
            setAcompanamiento((anterior) => ({
              ...anterior,
              seguimientos: anterior.seguimientos.map(
                (item, posicion) =>
                  posicion === indice
                    ? {
                        ...item,
                        dificultades: e.target.value,
                      }
                    : item,
              ),
            }))
          }
        />
      </label>

      <label className="informe-institucional__evolucion-campo">
        <span>Continuidad / nuevos acuerdos</span>

        <textarea
          rows={2}
          placeholder="Registrar qué estrategias se sostienen, modifican o incorporan..."
          value={seguimiento.nuevosAcuerdos || ""}
          onChange={(e) =>
            setAcompanamiento((anterior) => ({
              ...anterior,
              seguimientos: anterior.seguimientos.map(
                (item, posicion) =>
                  posicion === indice
                    ? {
                        ...item,
                        nuevosAcuerdos: e.target.value,
                      }
                    : item,
              ),
            }))
          }
        />
      </label>
    </div>
  ))}

  <button
    type="button"
    className="informe-institucional__evolucion-agregar"
    onClick={() =>
      setAcompanamiento((anterior) => ({
        ...anterior,
        seguimientos: [
          ...(anterior.seguimientos || []),
          crearSeguimientoVacio(),
        ],
      }))
    }
  >
    + Agregar nueva instancia de seguimiento
  </button>
</div>

 <div className="informe-institucional__guardado">
  {estadoGuardado === "guardado" && (
    <span className="informe-institucional__mensaje-guardado">
      ✓ Guardado correctamente
    </span>
  )}

  {estadoGuardado === "error" && (
    <span className="informe-institucional__mensaje-error">
      No se pudo guardar
    </span>
  )}

  <button
    type="button"
    className="informe-institucional__guardar"
    onClick={guardarAcompanamiento}
    disabled={estadoGuardado === "guardando"}
  >
    {estadoGuardado === "guardando"
      ? "Guardando..."
      : "💾 Guardar acompañamiento pedagógico"}
  </button>
</div>

</section>
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
    <div className="informe-institucional__indicador">
      <span className="informe-institucional__indicador-etiqueta">
        {etiqueta}
      </span>

      <strong className="informe-institucional__indicador-cantidad">
        {cantidad}
      </strong>
    </div>
  );
}
function CampoCorto({ 
  etiqueta,
  placeholder,
  value = "",
  onChange,
}) {
  return (
    <label className="informe-institucional__campo-corto">
      <span>{etiqueta}</span>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}