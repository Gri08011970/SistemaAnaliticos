import { useEffect, useMemo, useState } from "react";
import AulaConsultaFotia from "./AulaConsultaFotia";

const normalizar = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

function nombreDocente(docente) {
  if (!docente) return "Sin docente asignado";

  const nombre = [docente.apellido, docente.nombre]
    .filter(Boolean)
    .join(" ")
    .trim();

  return nombre || "Sin docente asignado";
}

function nombrePeriodo(periodo) {
  if (!periodo) return "Sin período";

  const nombre = periodo.nombre || "";
  const ciclo = String(periodo.cicloLectivo || "");

  if (ciclo && nombre.includes(ciclo)) return nombre;

  return ciclo ? `${nombre} ${ciclo}`.trim() : nombre || "Sin período";
}

export default function ConsultaAulasFotia({ volver }) {
  const [aulas, setAulas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [docenteFiltro, setDocenteFiltro] = useState("");
  const [asignaturaFiltro, setAsignaturaFiltro] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState("");

  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tokenUsuario");

    fetch("/api/fotia/consulta/aulas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje ||
              "No se pudieron obtener las aulas publicadas de FOTIA.",
          );
        }

        return datos;
      })
      .then((datos) => {
        setAulas(Array.isArray(datos.aulas) ? datos.aulas : []);
      })
      .catch((error) => {
        console.error("Error al consultar aulas FOTIA:", error);
        setError(
          error.message ||
            "No se pudo conectar con el servidor.",
        );
        setAulas([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const docentes = useMemo(
    () =>
      Array.from(
        new Set(
          aulas
            .map((aula) => nombreDocente(aula.docenteId))
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [aulas],
  );

  const asignaturas = useMemo(
    () =>
      Array.from(
        new Set(aulas.map((aula) => aula.asignatura).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [aulas],
  );

  const cursos = useMemo(
    () =>
      Array.from(
        new Set(aulas.map((aula) => aula.curso).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [aulas],
  );

  const aulasFiltradas = useMemo(() => {
    const texto = normalizar(busqueda);

    return aulas.filter((aula) => {
      const docente = nombreDocente(aula.docenteId);

      const coincideTexto =
        !texto ||
        normalizar(
          [
            aula.asignatura,
            aula.curso,
            docente,
            nombrePeriodo(aula.periodoId),
          ]
            .filter(Boolean)
            .join(" "),
        ).includes(texto);

      const coincideDocente =
        !docenteFiltro || docente === docenteFiltro;

      const coincideAsignatura =
        !asignaturaFiltro ||
        aula.asignatura === asignaturaFiltro;

      const coincideCurso =
        !cursoFiltro || aula.curso === cursoFiltro;

      return (
        coincideTexto &&
        coincideDocente &&
        coincideAsignatura &&
        coincideCurso
      );
    });
  }, [
    aulas,
    busqueda,
    docenteFiltro,
    asignaturaFiltro,
    cursoFiltro,
  ]);

  if (aulaSeleccionada) {
    return (
      <AulaConsultaFotia
        aula={aulaSeleccionada}
        volver={() => setAulaSeleccionada(null)}
      />
    );
  }

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <button type="button" onClick={volver} style={botonVolver}>
          ← Volver
        </button>

        <header style={encabezado}>
          <div>
            <div style={etiqueta}>CONSULTA INSTITUCIONAL</div>

            <h1 style={titulo}>👁 Aulas FOTIA-FORTE publicadas</h1>

            <p style={subtitulo}>
              Recorrido institucional de aulas, docentes, asignaturas y
              materiales visibles para estudiantes.
            </p>
          </div>

          <div style={insigniaConsulta}>
            🔒 Solo lectura
          </div>
        </header>

        <section style={aviso}>
          <strong>Vista institucional</strong>

          <span>
            Acá solamente aparecen aulas publicadas. Esta vista no permite
            editar, retirar, acreditar, agregar materiales ni cambiar la
            publicación.
          </span>
        </section>

        <section style={filtros}>
          <input
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar por asignatura, docente, curso o período"
            style={control}
          />

          <select
            value={docenteFiltro}
            onChange={(evento) => setDocenteFiltro(evento.target.value)}
            style={control}
          >
            <option value="">Todos los docentes</option>

            {docentes.map((docente) => (
              <option key={docente} value={docente}>
                {docente}
              </option>
            ))}
          </select>

          <select
            value={asignaturaFiltro}
            onChange={(evento) =>
              setAsignaturaFiltro(evento.target.value)
            }
            style={control}
          >
            <option value="">Todas las asignaturas</option>

            {asignaturas.map((asignatura) => (
              <option key={asignatura} value={asignatura}>
                {asignatura}
              </option>
            ))}
          </select>

          <select
            value={cursoFiltro}
            onChange={(evento) => setCursoFiltro(evento.target.value)}
            style={control}
          >
            <option value="">Todos los cursos</option>

            {cursos.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </section>

        {cargando && (
          <div style={estado}>
            ⏳ Cargando aulas publicadas...
          </div>
        )}

        {error && (
          <div style={errorEstilo}>⚠️ {error}</div>
        )}

        {!cargando && !error && aulas.length === 0 && (
          <div style={estado}>
            📭 Todavía no hay aulas publicadas.
          </div>
        )}

        {!cargando && !error && aulas.length > 0 && (
          <>
            <div style={resumen}>
              <strong>{aulasFiltradas.length}</strong>

              <span>
                {aulasFiltradas.length === 1
                  ? "aula visible"
                  : "aulas visibles"}
              </span>
            </div>

            {aulasFiltradas.length === 0 ? (
              <div style={estado}>
                No hay aulas que coincidan con los filtros.
              </div>
            ) : (
              <div style={grilla}>
                {aulasFiltradas.map((aula) => (
                  <article key={aula._id} style={tarjeta}>
                    <div style={cabeceraTarjeta}>
                      <div style={icono}>📘</div>

                      <div style={{ minWidth: 0 }}>
                        <div style={miniEtiqueta}>
                          AULA PUBLICADA
                        </div>

                        <h2 style={tituloAula}>
                          {aula.asignatura || "Asignatura"}
                        </h2>
                      </div>
                    </div>

                    <div style={datos}>
                      <Dato
                        etiqueta="Docente"
                        valor={nombreDocente(aula.docenteId)}
                      />

                      <Dato
                        etiqueta="Curso"
                        valor={aula.curso || "Sin curso"}
                      />

                      <Dato
                        etiqueta="Período"
                        valor={nombrePeriodo(aula.periodoId)}
                      />

                      <Dato
                        etiqueta="Unidades"
                        valor={String(
                          aula.unidades?.filter(
                            (unidad) => unidad.activo !== false,
                          ).length || 0,
                        )}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setAulaSeleccionada(aula)}
                      style={botonEntrar}
                    >
                      👁 Ver aula →
                    </button>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <div style={dato}>
      <span style={datoEtiqueta}>{etiqueta}</span>
      <strong style={datoValor}>{valor}</strong>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f4f8fb 0%, #eef7f4 100%)",
  padding: "32px 20px",
  fontFamily: "Arial, sans-serif",
};

const contenedor = {
  maxWidth: "1180px",
  margin: "0 auto",
};

const botonVolver = {
  border: "1px solid #bfd4df",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#315f6f",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "700",
  marginBottom: "22px",
};

const encabezado = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "22px",
};

const etiqueta = {
  color: "#607784",
  fontSize: "11px",
  fontWeight: "900",
  letterSpacing: "1px",
};

const titulo = {
  margin: "6px 0 6px",
  color: "#173f68",
  fontSize: "32px",
};

const subtitulo = {
  margin: 0,
  color: "#5f6f7a",
  lineHeight: 1.5,
};

const insigniaConsulta = {
  padding: "9px 14px",
  borderRadius: "999px",
  background: "#eef5fb",
  border: "1px solid #c8dceb",
  color: "#365f82",
  fontWeight: "800",
};

const aviso = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "16px 18px",
  marginBottom: "22px",
  border: "1px solid #b9ddd6",
  borderRadius: "14px",
  background: "#edf8f5",
  color: "#256b61",
  lineHeight: 1.5,
};

const filtros = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "12px",
  marginBottom: "24px",
  padding: "18px",
  border: "1px solid #c9dce3",
  borderRadius: "16px",
  background: "#ffffff",
};

const control = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #bfd4df",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#31465a",
  fontSize: "14px",
};

const estado = {
  padding: "26px",
  border: "1px dashed #bdd2dc",
  borderRadius: "16px",
  background: "#ffffff",
  color: "#607080",
  textAlign: "center",
  fontWeight: "700",
};

const errorEstilo = {
  padding: "16px",
  borderRadius: "14px",
  background: "#fff1f1",
  border: "1px solid #e2b8b8",
  color: "#963d3d",
  textAlign: "center",
  fontWeight: "700",
};

const resumen = {
  marginBottom: "16px",
  display: "flex",
  gap: "6px",
  alignItems: "baseline",
  color: "#315f6f",
};

const grilla = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
  gap: "18px",
};

const tarjeta = {
  padding: "20px",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 7px 16px rgba(22,58,95,0.07)",
};

const cabeceraTarjeta = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
};

const icono = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "#e8f4f1",
  display: "grid",
  placeItems: "center",
  fontSize: "25px",
  flexShrink: 0,
};

const miniEtiqueta = {
  color: "#64808a",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: ".8px",
};

const tituloAula = {
  margin: "4px 0 0",
  color: "#173f68",
  fontSize: "20px",
};

const datos = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "16px",
};

const dato = {
  padding: "10px",
  borderRadius: "11px",
  background: "#f7fbfc",
};

const datoEtiqueta = {
  display: "block",
  marginBottom: "3px",
  color: "#71838e",
  fontSize: "11px",
};

const datoValor = {
  color: "#304d63",
  fontSize: "13px",
};

const botonEntrar = {
  width: "100%",
  padding: "10px 14px",
  border: "none",
  borderRadius: "999px",
  background: "#0f766e",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "800",
};