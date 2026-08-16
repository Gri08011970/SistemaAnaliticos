import { useEffect, useRef } from "react";
import useDatosReinscripcion from "./useDatosReinscripcion";
import imprimirPlanillaReinscripcion from "./imprimirPlanillaReinscripcion";

const obtenerTexto = (...valores) => {
  const encontrado = valores.find(
    (valor) =>
      valor !== undefined && valor !== null && String(valor).trim() !== "",
  );

  return encontrado !== undefined ? String(encontrado).trim() : "—";
};

const normalizarTexto = (valor) =>
  String(valor || "")
    .trim()
    .toLocaleLowerCase("es");

const esEstudianteVaron = (alumno) => {
  const sexo = normalizarTexto(
    alumno.sexo || alumno.genero || alumno.sexoRegistrado,
  );

  return ["masculino", "masculino/a", "varón", "varon", "m"].includes(sexo);
};

const formatearDni = (dni) => {
  const numeros = String(dni || "").replace(/\D/g, "");

  if (!numeros) return "—";

  return numeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatearFecha = (fecha) => {
  if (!fecha) return "—";

  const texto = String(fecha).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return texto;
  }

  const fechaPreparada = new Date(texto);

  if (Number.isNaN(fechaPreparada.getTime())) {
    return texto;
  }

  return fechaPreparada.toLocaleDateString("es-AR");
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "—";

  const nacimiento = new Date(fechaNacimiento);

  if (Number.isNaN(nacimiento.getTime())) {
    return "—";
  }

  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

  if (
    diferenciaMes < 0 ||
    (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
  ) {
    edad -= 1;
  }

  return edad >= 0 ? edad : "—";
};

const obtenerNombreCompleto = (alumno) => {
  const apellido = String(alumno.apellido || "").trim();

  const nombre = String(alumno.nombre || "").trim();

  if (apellido || nombre) {
    return [apellido, nombre].filter(Boolean).join(", ");
  }

  return obtenerTexto(
    alumno.apellidoNombre,
    alumno.estudiante,
    alumno.nombreCompleto,
  );
};

const obtenerLegajo = (alumno) => {
  const numero = obtenerTexto(alumno.legajoNumero, alumno.numeroLegajo);

  const anio = obtenerTexto(alumno.legajoAnio, alumno.anioLegajo);

  if (numero === "—") return "—";
  if (anio === "—") return numero;

  return `${numero}/${anio}`;
};

const obtenerMatriz = (alumno) => {
  const libro = obtenerTexto(alumno.libroMatriz, alumno.libro);

  const folio = obtenerTexto(alumno.folioMatriz, alumno.folio);

  if (libro === "—" && folio === "—") {
    return "—";
  }

  if (libro !== "—" && libro.includes("/")) {
    return libro;
  }

  return [libro, folio].filter((valor) => valor !== "—").join("/");
};

const obtenerAsignaturasPendientes = (alumno) => {
  const materias = Array.isArray(alumno.materiasPendientes)
    ? alumno.materiasPendientes
    : [];

  const nombres = materias
    .map((materia) => {
      if (typeof materia === "string") {
        return materia.trim();
      }

      return String(
        materia?.asignatura || materia?.materia || materia?.nombre || "",
      ).trim();
    })
    .filter(Boolean);

  return nombres.length > 0 ? nombres.join(", ") : "Ninguna";
};

export default function VistaPlanillaReinscripcion({
  curso,
  turno,
  estudiantes = [],
  cicloLectivo,
  volverPreparacion,
}) {
  const {
    cargando: cargandoDatosComplementarios,
    error: errorDatosComplementarios,
    obtenerDatosAlumno,
  } = useDatosReinscripcion();

  const estudiantesOrdenados = [...estudiantes].sort((alumnoA, alumnoB) =>
    obtenerNombreCompleto(alumnoA).localeCompare(
      obtenerNombreCompleto(alumnoB),
      "es",
      {
        sensitivity: "base",
      },
    ),
  );
  const scrollSuperiorRef = useRef(null);
  const scrollTablaRef = useRef(null);
  const contenidoSuperiorRef = useRef(null);

  useEffect(() => {
    const scrollSuperior = scrollSuperiorRef.current;
    const scrollTabla = scrollTablaRef.current;
    const contenidoSuperior = contenidoSuperiorRef.current;

    if (!scrollSuperior || !scrollTabla || !contenidoSuperior) {
      return;
    }

    const actualizarAncho = () => {
      contenidoSuperior.style.width = `${scrollTabla.scrollWidth}px`;
    };

    const sincronizarDesdeArriba = () => {
      scrollTabla.scrollLeft = scrollSuperior.scrollLeft;
    };

    const sincronizarDesdeTabla = () => {
      scrollSuperior.scrollLeft = scrollTabla.scrollLeft;
    };

    actualizarAncho();

    scrollSuperior.addEventListener("scroll", sincronizarDesdeArriba);

    scrollTabla.addEventListener("scroll", sincronizarDesdeTabla);

    window.addEventListener("resize", actualizarAncho);

    return () => {
      scrollSuperior.removeEventListener("scroll", sincronizarDesdeArriba);

      scrollTabla.removeEventListener("scroll", sincronizarDesdeTabla);

      window.removeEventListener("resize", actualizarAncho);
    };
  }, [estudiantesOrdenados.length]);

  const imprimirPlanilla = () => {
    imprimirPlanillaReinscripcion({
      curso,
      turno,
      cicloLectivo,
      estudiantes: estudiantesOrdenados,
      obtenerDatosAlumno,
    });
  };

  return (
    <section style={contenedorVista}>
      <div style={encabezadoVista}>
        <div>
          <p style={etiqueta}>VISTA PREVIA INSTITUCIONAL</p>

          <h3 style={titulo}>Planilla Integral de Reinscripción</h3>

          <p style={subtitulo}>
            Curso: <strong>{curso}</strong>
            {" · "}
            Turno: <strong>{turno}</strong>
            {" · "}
            Ciclo lectivo: <strong>{cicloLectivo}</strong>
          </p>
        </div>

        <div style={contador}>
          <span style={numeroContador}>{estudiantesOrdenados.length}</span>

          <span style={textoContador}>estudiantes</span>
        </div>
      </div>

      <BotoneraPlanilla
        volverPreparacion={volverPreparacion}
        imprimirPlanilla={imprimirPlanilla}
        puedeImprimir={
          estudiantesOrdenados.length > 0 && !cargandoDatosComplementarios
        }
        superior
      />

      <div style={avisoHorizontal}>
        ↔ Desplazá horizontalmente para consultar todas las columnas.
      </div>

      {cargandoDatosComplementarios && (
        <div style={estadoCarga}>
          Cargando domicilio, teléfono y autorizados...
        </div>
      )}

      {errorDatosComplementarios && (
        <div style={estadoError}>{errorDatosComplementarios}</div>
      )}

      <div
        ref={scrollSuperiorRef}
        style={scrollSuperior}
        aria-label="Desplazamiento horizontal superior"
      >
        <div ref={contenidoSuperiorRef} style={contenidoScrollSuperior} />
      </div>

      {estudiantesOrdenados.length === 0 ? (
        <div style={estadoVacio}>
          No se encontraron estudiantes activos en este curso.
        </div>
      ) : (
        <div ref={scrollTablaRef} style={contenedorTabla}>
          <table style={tabla}>
            <thead>
              <tr>
                <th style={celdaEncabezado}>N.º</th>
                <th style={celdaEncabezado}>Apellido y nombre</th>
                <th style={celdaEncabezado}>DNI</th>
                <th style={celdaEncabezado}>Fecha de nacimiento</th>
                <th style={celdaEncabezado}>Edad</th>
                <th style={celdaEncabezado}>Nacionalidad</th>
                <th style={celdaEncabezado}>Sexo</th>
                <th style={celdaEncabezado}>Legajo</th>
                <th style={celdaEncabezado}>Libro/Folio matriz</th>
                <th style={celdaEncabezado}>Domicilio</th>
                <th style={celdaEncabezado}>Teléfono</th>
                <th style={celdaEncabezado}>Adulto responsable</th>
                <th style={celdaEncabezado}>Vínculo responsable</th>
                <th style={celdaEncabezado}>Autorizados a retirar</th>
                <th style={celdaEncabezado}>Vínculo autorizado</th>
                <th style={celdaEncabezado}>DNI autorizado</th>
                <th style={celdaEncabezado}>Asignaturas pendientes</th>
                <th style={celdaEncabezado}>Documentación / observaciones</th>
              </tr>
            </thead>

            <tbody>
              {estudiantesOrdenados.map((alumno, indice) => {
                const filaVaron = esEstudianteVaron(alumno);
                const datosComplementarios = obtenerDatosAlumno(alumno);
                const autorizadosAlumno =
                  datosComplementarios.autorizados || [];

                const separador = (indice + 1) % 5 === 0;

                const estiloFila = {
                  backgroundColor: filaVaron ? "#d8dde3" : "#ffffff",

                  borderBottom: separador
                    ? "3px solid #7b8794"
                    : "1px solid #aeb8c2",
                };

                return (
                  <tr
                    key={alumno._id || alumno.id || `${curso}-${indice}`}
                    style={estiloFila}
                  >
                    <td style={celda}>{indice + 1}</td>

                    <td style={celdaNombre}>{obtenerNombreCompleto(alumno)}</td>

                    <td style={celda}>{formatearDni(alumno.dni)}</td>

                    <td style={celda}>
                      {formatearFecha(alumno.fechaNacimiento)}
                    </td>

                    <td style={celda}>
                      {calcularEdad(alumno.fechaNacimiento)}
                    </td>

                    <td style={celda}>{obtenerTexto(alumno.nacionalidad)}</td>

                    <td style={celda}>
                      {obtenerTexto(alumno.sexo, alumno.genero)}
                    </td>

                    <td style={celda}>{obtenerLegajo(alumno)}</td>

                    <td style={celda}>{obtenerMatriz(alumno)}</td>

                    <td style={celdaAmplia}>
                      {obtenerTexto(
                        datosComplementarios.domicilio,
                        alumno.domicilio,
                        alumno.direccion,
                      )}
                    </td>

                    <td style={celda}>
                      {obtenerTexto(
                        datosComplementarios.telefono,
                        alumno.telefono,
                        alumno.celular,
                      )}
                    </td>

                    <td style={celdaAmplia}>
                      {obtenerTexto(
                        datosComplementarios.nombreResponsable,
                        alumno.adultoResponsable,
                        alumno.responsable,
                        alumno.tutor,
                      )}
                    </td>

                    <td style={celda}>
                      {obtenerTexto(
                        datosComplementarios.vinculoResponsable,
                        alumno.vinculo,
                        alumno.vinculoResponsable,
                      )}
                    </td>

                    <td style={celdaAutorizados}>
                      {datosComplementarios.sinAutorizados ? (
                        <strong style={textoSinAutorizados}>
                          SIN AUTORIZADOS
                        </strong>
                      ) : autorizadosAlumno.length > 0 ? (
                        autorizadosAlumno.map((registro) => (
                          <div
                            key={registro._id || registro.adultoAutorizado}
                            style={lineaAutorizado}
                          >
                            {registro.adultoAutorizado || "—"}
                          </div>
                        ))
                      ) : (
                        <span style={textoSinDatos}>Sin información</span>
                      )}
                    </td>

                    <td style={celdaAutorizados}>
                      {datosComplementarios.sinAutorizados
                        ? "—"
                        : autorizadosAlumno.length > 0
                          ? autorizadosAlumno.map((registro) => (
                              <div
                                key={`${registro._id || registro.adultoAutorizado}-vinculo`}
                                style={lineaAutorizado}
                              >
                                {registro.vinculo === "Otro"
                                  ? registro.vinculoOtro || "Otro"
                                  : registro.vinculo || "—"}
                              </div>
                            ))
                          : "—"}
                    </td>

                    <td style={celdaAutorizados}>
                      {datosComplementarios.sinAutorizados
                        ? "—"
                        : autorizadosAlumno.length > 0
                          ? autorizadosAlumno.map((registro) => (
                              <div
                                key={`${registro._id || registro.adultoAutorizado}-dni`}
                                style={lineaAutorizado}
                              >
                                {formatearDni(registro.dniAdultoResponsable)}
                              </div>
                            ))
                          : "—"}
                    </td>

                    <td style={celdaAmplia}>
                      {obtenerAsignaturasPendientes(alumno)}
                    </td>

                    <td style={celdaDocumentacion}>
                      <div style={resumenDocumentacion}>
                        <span>
                          DNI físico:{" "}
                          <strong>{alumno.dniFisico || "NO"}</strong>
                        </span>
                        <span>
                          Partida:{" "}
                          <strong>{alumno.partidaNacimiento || "NO"}</strong>
                        </span>
                        <span>
                          Analítico:{" "}
                          <strong>{alumno.analiticoParcial || "-----"}</strong>
                        </span>
                      </div>

                      {alumno.observacionDocumentacion && (
                        <div style={observacionGuardada}>
                          {alumno.observacionDocumentacion}
                        </div>
                      )}

                      <div style={lineaEscritura} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={leyenda}>
        <span>
          <span style={muestraVaron} />
          Fila gris: estudiante registrado como varón.
        </span>

        <span>Línea más gruesa cada cinco estudiantes.</span>
      </div>

      <BotoneraPlanilla
        volverPreparacion={volverPreparacion}
        imprimirPlanilla={imprimirPlanilla}
        puedeImprimir={
          estudiantesOrdenados.length > 0 && !cargandoDatosComplementarios
        }
      />
    </section>
  );
}

function BotoneraPlanilla({
  volverPreparacion,
  imprimirPlanilla,
  puedeImprimir,
  superior = false,
}) {
  return (
    <div
      style={{
        ...botonera,
        marginTop: superior ? 0 : "20px",
        marginBottom: superior
          ? "16px"
          : 0,
      }}
    >
      <button
        type="button"
        onClick={volverPreparacion}
        style={botonVolver}
      >
        ← Volver a preparación
      </button>

      <button
        type="button"
        onClick={imprimirPlanilla}
        disabled={!puedeImprimir}
        style={{
          ...botonImprimir,
          opacity: puedeImprimir ? 1 : 0.55,
          cursor: puedeImprimir
            ? "pointer"
            : "not-allowed",
        }}
        title={
          puedeImprimir
            ? "Imprimir Planilla Integral de Reinscripción"
            : "Esperando la carga de los datos complementarios"
        }
      >
        🖨️ Imprimir planilla
      </button>
    </div>
  );
}

const contenedorVista = {
  marginTop: "22px",
  padding: "22px",
  border: "2px solid #9fc7d5",
  borderTop: "6px solid #568ea6",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 8px 22px rgba(30, 58, 95, 0.11)",
};

const encabezadoVista = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  marginBottom: "16px",
};

const etiqueta = {
  margin: "0 0 4px",
  color: "#71808d",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "0.08em",
};

const titulo = {
  margin: 0,
  color: "#173f68",
  fontSize: "25px",
};

const subtitulo = {
  margin: "7px 0 0",
  color: "#667480",
  fontSize: "14px",
};

const contador = {
  minWidth: "105px",
  padding: "12px 15px",
  border: "1px solid #bad4de",
  borderRadius: "13px",
  background: "#eef7fa",
  textAlign: "center",
};

const numeroContador = {
  display: "block",
  color: "#173f68",
  fontSize: "25px",
  fontWeight: "800",
};

const textoContador = {
  color: "#617583",
  fontSize: "11px",
  fontWeight: "700",
};

const avisoHorizontal = {
  marginBottom: "12px",
  padding: "9px 12px",
  borderRadius: "9px",
  background: "#f4f8fa",
  color: "#5e7180",
  fontSize: "12px",
  textAlign: "center",
};

const contenedorTabla = {
  width: "100%",
  overflowX: "auto",
  border: "2px solid #7f8d99",
  borderRadius: "9px",
  background: "#ffffff",
};

const tabla = {
  width: "max-content",
  minWidth: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
  color: "#24364a",
  fontSize: "11px",
};

const celdaEncabezado = {
  minWidth: "90px",
  padding: "9px 7px",
  border: "1px solid #778691",
  background: "#dbe8ee",
  color: "#173f68",
  fontWeight: "800",
  textAlign: "center",
  verticalAlign: "middle",
};

const celda = {
  minWidth: "85px",
  height: "54px",
  padding: "7px",
  borderLeft: "1px solid #aeb8c2",
  borderRight: "1px solid #aeb8c2",
  textAlign: "center",
  verticalAlign: "middle",
};

const celdaNombre = {
  ...celda,
  minWidth: "190px",
  maxWidth: "190px",
  fontWeight: "800",
  textAlign: "left",
};

const celdaAmplia = {
  ...celda,
  minWidth: "175px",
  maxWidth: "175px",
  textAlign: "left",
};

const celdaObservaciones = {
  ...celda,
  minWidth: "240px",
  maxWidth: "240px",
};

const lineaEscritura = {
  height: "18px",
  borderBottom: "1px dotted #79838b",
};

const celdaAutorizados = {
  ...celda,
  minWidth: "175px",
  maxWidth: "175px",
  textAlign: "left",
  verticalAlign: "top",
};

const lineaAutorizado = {
  padding: "4px 0",
  borderBottom: "1px dotted #9aa6af",
};

const textoSinAutorizados = {
  color: "#9f2f2f",
  fontSize: "10px",
};

const textoSinDatos = {
  color: "#78858e",
  fontStyle: "italic",
};

const celdaDocumentacion = {
  ...celda,
  minWidth: "255px",
  maxWidth: "255px",
  textAlign: "left",
  verticalAlign: "top",
};

const resumenDocumentacion = {
  display: "grid",
  gap: "3px",
  marginBottom: "5px",
  fontSize: "10px",
};

const observacionGuardada = {
  marginTop: "5px",
  padding: "5px 6px",
  borderRadius: "5px",
  background: "rgba(255, 255, 255, 0.55)",
  fontSize: "10px",
  lineHeight: 1.35,
};

const estadoCarga = {
  marginBottom: "8px",
  padding: "8px 12px",
  border: "1px solid #bdd6df",
  borderRadius: "8px",
  background: "#f1f8fa",
  color: "#496979",
  fontSize: "12px",
  textAlign: "center",
};

const estadoError = {
  marginBottom: "8px",
  padding: "8px 12px",
  border: "1px solid #e7b1b1",
  borderRadius: "8px",
  background: "#fff1f1",
  color: "#9b3434",
  fontSize: "12px",
  textAlign: "center",
};

const estadoVacio = {
  padding: "30px",
  border: "1px dashed #b7c8cf",
  borderRadius: "12px",
  background: "#fafcfd",
  color: "#6c7982",
  textAlign: "center",
};

const leyenda = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "12px",
  color: "#6a7781",
  fontSize: "11px",
};

const muestraVaron = {
  display: "inline-block",
  width: "18px",
  height: "11px",
  marginRight: "6px",
  border: "1px solid #aeb8c2",
  background: "#d8dde3",
  verticalAlign: "middle",
};

const botonera = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "20px",
};

const botonVolver = {
  padding: "10px 18px",
  border: "1px solid #b9ced7",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#31596d",
  fontWeight: "700",
  cursor: "pointer",
};

const botonImprimir = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#168f84",
  color: "#ffffff",
  fontWeight: "800",
  boxShadow:
    "0 4px 10px rgba(22, 143, 132, 0.20)",
};

const scrollSuperior = {
  width: "100%",
  height: "18px",
  marginBottom: "8px",
  overflowX: "auto",
  overflowY: "hidden",
  border: "1px solid #b7c7cf",
  borderRadius: "8px",
  background: "#f4f8fa",
};

const contenidoScrollSuperior = {
  height: "1px",
};
