import { useState } from "react";
import TablaSeguimiento from "./TablaSeguimiento";
import ResumenCurso from "./ResumenCurso";
import FichaSeguimientoAlumno from "./FichaSeguimientoAlumno";
import { obtenerAsignaturasPorCurso } from "./seguimientoConstants";
import "./pruebasTrayectoria";
import "./seguimientoPedagogico.css";

const cursos = [
  "1°1°",
  "1°2°",
  "1°3°",
  "1°4°",
  "2°1°",
  "2°2°",
  "2°3°",
  "2°4°",
  "3°1°",
  "3°2°",
  "3°3°",
  "3°4°",
  "4°1°",
  "4°2°",
  "4°3°",
  "4°4°",
  "5°1°",
  "5°2°",
  "5°3°",
  "5°4°",
  "6°1°",
  "6°2°",
  "6°3°",
  "6°4°",
];
function PanelHerramienta({ icono, titulo, descripcion, children }) {
  return (
    <section className="seguimiento-panel-herramienta">
      <header className="seguimiento-panel-encabezado">
        <span className="seguimiento-panel-icono">{icono}</span>

        <div>
          <h3 className="seguimiento-panel-titulo">{titulo}</h3>

          <p className="seguimiento-panel-descripcion">{descripcion}</p>
        </div>
      </header>

      <div className="seguimiento-panel-contenido">{children}</div>
    </section>
  );
}

export default function SeguimientoPedagogico({ alumnos, esAdmin }) {
  const [vistaActiva, setVistaActiva] = useState("carga");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");

  const asignaturasDisponibles = obtenerAsignaturasPorCurso(cursoSeleccionado);

  const alumnosOrdenados = [...alumnos].sort((a, b) => {
    const comparacionApellido = (a.apellido || "").localeCompare(
      b.apellido || "",
      "es",
      { sensitivity: "base" },
    );

    if (comparacionApellido !== 0) {
      return comparacionApellido;
    }

    return (a.nombre || "").localeCompare(b.nombre || "", "es", {
      sensitivity: "base",
    });
  });

  return (
    <div className="seguimiento-container seguimiento-encabezado-responsive">
      <h2>🚦 Seguimiento Pedagógico</h2>
      {!esAdmin && (
        <div
          style={{
            maxWidth: "760px",
            margin: "10px auto 18px",
            padding: "10px 14px",
            border: "1px solid #d8c6ea",
            borderRadius: "10px",
            backgroundColor: "#f8f3fc",
            color: "#684b80",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          🔒 Modo consulta: podés revisar, analizar e imprimir, pero no
          modificar datos.
        </div>
      )}

      <div className="seguimiento-opciones-grid">
        <button
          type="button"
          className={`seguimiento-opcion-card ${
            vistaActiva === "carga" ? "seguimiento-opcion-card--activa" : ""
          }`}
          onClick={() => setVistaActiva("carga")}
        >
          <span className="seguimiento-opcion-icono">📋</span>

          <span className="seguimiento-opcion-titulo">
            Carga por asignatura
          </span>

          <span className="seguimiento-opcion-descripcion">
            Registrá conceptos e informes por curso, asignatura y período.
          </span>

          <span className="seguimiento-opcion-accion">Entrar</span>
        </button>

        <button
          type="button"
          className={`seguimiento-opcion-card ${
            vistaActiva === "resumen" ? "seguimiento-opcion-card--activa" : ""
          }`}
          onClick={() => setVistaActiva("resumen")}
        >
          <span className="seguimiento-opcion-icono">📊</span>

          <span className="seguimiento-opcion-titulo">Resumen del curso</span>

          <span className="seguimiento-opcion-descripcion">
            Analizá indicadores, trayectorias y situaciones que requieren
            atención.
          </span>

          <span className="seguimiento-opcion-accion">Entrar</span>
        </button>

        <button
          type="button"
          className={`seguimiento-opcion-card ${
            vistaActiva === "detalle" ? "seguimiento-opcion-card--activa" : ""
          }`}
          onClick={() => setVistaActiva("detalle")}
        >
          <span className="seguimiento-opcion-icono">👤</span>

          <span className="seguimiento-opcion-titulo">
            Ficha del estudiante
          </span>

          <span className="seguimiento-opcion-descripcion">
            Consultá la trayectoria individual y generá el informe
            institucional.
          </span>

          <span className="seguimiento-opcion-accion">Entrar</span>
        </button>
      </div>

      {vistaActiva === "carga" && (
        <PanelHerramienta
          icono="📋"
          titulo="Carga por asignatura"
          descripcion="Seleccioná el curso y la asignatura para registrar el seguimiento pedagógico."
        >
          <div className="seguimiento-panel-filtros">
            <div className="seguimiento-panel-campo">
              <label htmlFor="curso-carga">Curso</label>

              <select
                id="curso-carga"
                className="select-seguimiento-responsive"
                value={cursoSeleccionado}
                onChange={(e) => {
                  setCursoSeleccionado(e.target.value);
                  setAsignaturaSeleccionada("");
                }}
              >
                <option value="">Seleccionar curso</option>

                {cursos.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
            </div>

            <div className="seguimiento-panel-campo">
              <label htmlFor="asignatura-carga">Asignatura</label>

              <select
                id="asignatura-carga"
                className="select-seguimiento-responsive"
                value={asignaturaSeleccionada}
                onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
                disabled={!cursoSeleccionado}
              >
                <option value="">Seleccionar asignatura</option>

                {asignaturasDisponibles.map((asignatura) => (
                  <option key={asignatura} value={asignatura}>
                    {asignatura}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {cursoSeleccionado && asignaturaSeleccionada ? (
            <TablaSeguimiento
              curso={cursoSeleccionado}
              asignatura={asignaturaSeleccionada}
              alumnos={alumnosOrdenados}
              esAdmin={esAdmin}
            />
          ) : (
            <p className="seguimiento-panel-mensaje">
              Seleccioná curso y asignatura para cargar la planilla.
            </p>
          )}
        </PanelHerramienta>
      )}

      {vistaActiva === "resumen" && (
        <PanelHerramienta
          icono="📊"
          titulo="Resumen del curso"
          descripcion="Seleccioná un curso para consultar sus indicadores y analizar las trayectorias educativas."
        >
          <div className="seguimiento-panel-filtros seguimiento-panel-filtros--centrado">
            <div className="seguimiento-panel-campo">
              <label htmlFor="curso-resumen">Curso</label>

              <select
                id="curso-resumen"
                className="select-seguimiento-responsive"
                value={cursoSeleccionado}
                onChange={(e) => {
                  setCursoSeleccionado(e.target.value);
                  setAsignaturaSeleccionada("");
                }}
              >
                <option value="">Seleccionar curso</option>

                {cursos.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {cursoSeleccionado ? (
            <ResumenCurso curso={cursoSeleccionado} alumnos={alumnos} />
          ) : (
            <p className="seguimiento-panel-mensaje">
              Seleccioná un curso para ver el resumen.
            </p>
          )}
        </PanelHerramienta>
      )}

      {vistaActiva === "detalle" && (
        <PanelHerramienta
          icono="👤"
          titulo="Ficha del estudiante"
          descripcion="Buscá un estudiante para consultar su trayectoria individual y generar el informe institucional."
        >
          <FichaSeguimientoAlumno alumnos={alumnos} />
        </PanelHerramienta>
      )}
    </div>
  );
}
