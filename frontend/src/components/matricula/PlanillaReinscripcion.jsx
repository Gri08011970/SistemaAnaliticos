import { useEffect, useRef, useState } from "react";
import VistaPlanillaReinscripcion from "./VistaPlanillaReinscripcion";

const CURSOS_MANANA = [
  "1°1°",
  "1°2°",
  "2°1°",
  "2°2°",
  "3°1°",
  "3°2°",
  "4°1°",
  "4°2°",
  "5°1°",
  "5°2°",
  "6°1°",
  "6°2°",
];

const CURSOS_TARDE = [
  "1°3°",
  "1°4°",
  "2°3°",
  "2°4°",
  "3°3°",
  "3°4°",
  "4°3°",
  "4°4°",
  "5°3°",
  "5°4°",
  "6°3°",
  "6°4°",
];

export default function PlanillaReinscripcion({
  volver,
  seleccionarCurso,
  alumnosMatricula = [],
}) {
  const [cursoElegido, setCursoElegido] = useState(null);

  const [mostrarPlanilla, setMostrarPlanilla] = useState(false);

  const preparacionRef = useRef(null);

  useEffect(() => {
    if (!cursoElegido) return;

    const temporizador = window.setTimeout(() => {
      preparacionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [cursoElegido]);

  const elegirCurso = (curso, turno) => {
    const estudiantesCurso = alumnosMatricula.filter(
      (alumno) => alumno.curso === curso,
    );

    const seleccion = {
      curso,
      turno,
      cantidadEstudiantes: estudiantesCurso.length,
    };

    setMostrarPlanilla(false);
    setCursoElegido(seleccion);

    if (typeof seleccionarCurso === "function") {
      seleccionarCurso(curso, turno);
    }
  };

  const volverASeleccionCursos = () => {
    setMostrarPlanilla(false);
    setCursoElegido(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const generarPlanilla = () => {
    setMostrarPlanilla(true);
  };

  const estudiantesCurso = cursoElegido
    ? alumnosMatricula.filter(
        (alumno) =>
          String(alumno.curso || "").trim() ===
          String(cursoElegido.curso).trim(),
      )
    : [];
  return (
    <div style={contenedorGeneral}>
      <button type="button" onClick={volver} style={botonVolver}>
        ← Volver a Herramientas de gestión
      </button>

      <section style={encabezadoInstitucional}>
        <div style={iconoPrincipal}>📋</div>

        <div>
          <p style={etiquetaInstitucional}>MATRÍCULA INSTITUCIONAL</p>

          <h2 style={tituloPrincipal}>Planilla Integral de Reinscripción</h2>

          <p style={descripcionPrincipal}>
            Herramienta institucional para verificar, actualizar y registrar los
            datos de cada estudiante durante la reinscripción anual.
          </p>
        </div>
      </section>

      {!cursoElegido ? (
        <SeleccionCursos elegirCurso={elegirCurso} />
      ) : mostrarPlanilla ? (
        <VistaPlanillaReinscripcion
          curso={cursoElegido.curso}
          turno={cursoElegido.turno}
          cicloLectivo={new Date().getFullYear() + 1}
          estudiantes={estudiantesCurso}
          volverPreparacion={() => setMostrarPlanilla(false)}
        />
      ) : (
        <PreparacionPlanilla
          cursoElegido={cursoElegido}
          preparacionRef={preparacionRef}
          volverASeleccionCursos={volverASeleccionCursos}
          generarPlanilla={generarPlanilla}
        />
      )}
    </div>
  );
}

function SeleccionCursos({ elegirCurso }) {
  return (
    <>
      <section style={bloqueSeleccion}>
        <div style={encabezadoSeleccion}>
          <span style={iconoSeleccion}>🏫</span>

          <div>
            <h3 style={tituloSeleccion}>Seleccionar curso</h3>

            <p style={textoAyuda}>
              La planilla se preparará con la totalidad de los estudiantes
              activos del curso seleccionado.
            </p>
          </div>
        </div> 

        <BloqueTurno
          titulo="☀️ Turno Mañana"
          descripcion="Cursos de primera y segunda división."
          cursos={CURSOS_MANANA}
          turno="Mañana"
          seleccionarCurso={elegirCurso}
        />

        <BloqueTurno
          titulo="🌙 Turno Tarde"
          descripcion="Cursos de tercera y cuarta división."
          cursos={CURSOS_TARDE}
          turno="Tarde"
          seleccionarCurso={elegirCurso}
        />
      </section>

      <section style={proximoPaso}>
        <strong style={tituloProximoPaso}>Próximo paso</strong>

        <p style={textoProximoPaso}>
          Seleccioná un curso para revisar sus datos generales y preparar la
          Planilla Integral de Reinscripción.
        </p>
      </section>
    </>
  );
}

function PreparacionPlanilla({
  cursoElegido,
  preparacionRef,
  volverASeleccionCursos,
  generarPlanilla,
}) {
  const cicloLectivoSiguiente = new Date().getFullYear() + 1;

  return (
    <section
      ref={preparacionRef}
      style={{
        ...contenedorPreparacion,
        scrollMarginTop: "24px",
      }}
    >
      <div style={encabezadoPreparacion}>
        <div style={iconoPreparacion}>📄</div>

        <div>
          <p style={etiquetaPreparacion}>PREPARACIÓN DEL DOCUMENTO</p>

          <h3 style={tituloPreparacion}>Planilla de {cursoElegido.curso}</h3>

          <p style={descripcionPreparacion}>
            Confirmá la información general antes de generar la vista completa.
          </p>
        </div>
      </div>

      <div style={grillaResumen}>
        <TarjetaResumen
          icono="🏫"
          etiqueta="Curso seleccionado"
          valor={cursoElegido.curso}
        />

        <TarjetaResumen
          icono={cursoElegido.turno === "Mañana" ? "☀️" : "🌙"}
          etiqueta="Turno"
          valor={cursoElegido.turno}
        />

        <TarjetaResumen
          icono="👥"
          etiqueta="Estudiantes activos"
          valor={
            cursoElegido.cantidadEstudiantes > 0
              ? cursoElegido.cantidadEstudiantes
              : "A verificar"
          }
        />

        <TarjetaResumen
          icono="📅"
          etiqueta="Ciclo lectivo"
          valor={cicloLectivoSiguiente}
        />
      </div>

      <div style={bloqueOpciones}>
        <h4 style={tituloOpciones}>La planilla incluirá</h4>

        <div style={grillaOpciones}>
          <OpcionPreparada texto="Datos personales" />
          <OpcionPreparada texto="Legajo y matriz" />
          <OpcionPreparada texto="Domicilio y teléfono" />
          <OpcionPreparada texto="Adulto responsable" />
          <OpcionPreparada texto="Autorizados a retirar" />
          <OpcionPreparada texto="Asignaturas pendientes" />
          <OpcionPreparada texto="Documentación" />
          <OpcionPreparada texto="Observaciones" />
        </div>
      </div>

      <div style={avisoEtapa}>
        <strong style={tituloAviso}>📌 Vista de preparación</strong>

        <p style={textoAviso}>
          En la próxima etapa aparecerán aquí todos los estudiantes del curso
          con la información institucional organizada para su revisión.
        </p>
      </div>

      <div style={botoneraPreparacion}>
        <button
          type="button"
          onClick={volverASeleccionCursos}
          style={botonSecundario}
        >
          ← Elegir otro curso
        </button>

        <button type="button" onClick={generarPlanilla} style={botonGenerar}>
          📋 Generar planilla
        </button>
      </div>
    </section>
  );
}

function TarjetaResumen({ icono, etiqueta, valor }) {
  return (
    <div style={tarjetaResumen}>
      <span style={iconoResumen}>{icono}</span>

      <span style={etiquetaResumen}>{etiqueta}</span>

      <strong style={valorResumen}>{valor}</strong>
    </div>
  );
}

function OpcionPreparada({ texto }) {
  return (
    <div style={opcionPreparada}>
      <span style={tildeOpcion}>✓</span>
      <span>{texto}</span>
    </div>
  );
}

function BloqueTurno({ titulo, descripcion, cursos, turno, seleccionarCurso }) {
  return (
    <div style={bloqueTurno}>
      <div style={encabezadoTurno}>
        <div>
          <h4 style={tituloTurno}>{titulo}</h4>

          <p style={descripcionTurno}>{descripcion}</p>
        </div>

        <span style={contadorTurno}>{cursos.length} cursos</span>
      </div>

      <div style={grillaCursos}>
        {cursos.map((curso) => (
          <button
            type="button"
            key={curso}
            onClick={() => seleccionarCurso(curso, turno)}
            style={botonCurso}
            title={`Preparar planilla de ${curso}`}
          >
            <span style={iconoCurso}>🏫</span>
            <strong>{curso}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

const contenedorGeneral = {
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
  boxSizing: "border-box",
};

const botonVolver = {
  marginBottom: "18px",
  padding: "9px 16px",
  border: "1px solid #bfd7df",
  borderRadius: "10px",
  background: "#eef8fa",
  color: "#164e63",
  fontWeight: "700",
  cursor: "pointer",
};

const encabezadoInstitucional = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "25px",
  border: "2px solid #d8c79d",
  borderTop: "6px solid #c3a65c",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #fffdf7 0%, #ffffff 100%)",
  boxShadow: "0 8px 20px rgba(94, 75, 31, 0.12)",
};

const iconoPrincipal = {
  width: "70px",
  height: "70px",
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: "18px",
  background: "#f2ead4",
  fontSize: "35px",
};

const etiquetaInstitucional = {
  margin: "0 0 5px",
  color: "#806e47",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "0.09em",
};

const tituloPrincipal = {
  margin: 0,
  color: "#173f68",
  fontSize: "29px",
};

const descripcionPrincipal = {
  margin: "9px 0 0",
  color: "#665f52",
  lineHeight: 1.6,
  fontSize: "16px",
};

const bloqueSeleccion = {
  marginTop: "22px",
  padding: "24px",
  border: "2px solid #c9e0e6",
  borderTop: "6px solid #76b9c8",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 7px 18px rgba(22, 58, 95, 0.09)",
};

const encabezadoSeleccion = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
  textAlign: "left",
};

const iconoSeleccion = {
  fontSize: "28px",
};

const tituloSeleccion = {
  margin: 0,
  color: "#173f68",
  fontSize: "23px",
};

const textoAyuda = {
  margin: "5px 0 0",
  color: "#6a7783",
  lineHeight: 1.5,
};

const bloqueTurno = {
  marginTop: "18px",
  padding: "18px",
  border: "1px solid #cfe1e6",
  borderRadius: "15px",
  background: "#f8fcfd",
};

const encabezadoTurno = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
};

const tituloTurno = {
  margin: 0,
  color: "#24516f",
  fontSize: "19px",
};

const descripcionTurno = {
  margin: "5px 0 0",
  color: "#71808c",
  fontSize: "13px",
};

const contadorTurno = {
  padding: "6px 10px",
  border: "1px solid #c4dce2",
  borderRadius: "999px",
  background: "#edf7f8",
  color: "#315b6b",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const grillaCursos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
  gap: "12px",
};

const botonCurso = {
  minHeight: "66px",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  border: "1px solid #acd4d2",
  borderRadius: "13px",
  background: "#ffffff",
  color: "#194866",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 3px 8px rgba(30, 58, 95, 0.08)",
};

const iconoCurso = {
  fontSize: "19px",
};

const proximoPaso = {
  marginTop: "20px",
  padding: "18px",
  border: "1px dashed #b9cfd8",
  borderRadius: "15px",
  background: "#fafcfd",
  textAlign: "center",
};

const tituloProximoPaso = {
  display: "block",
  marginBottom: "7px",
  color: "#31556e",
  fontSize: "17px",
};

const textoProximoPaso = {
  maxWidth: "760px",
  margin: "0 auto",
  color: "#687783",
  lineHeight: 1.6,
};

const contenedorPreparacion = {
  marginTop: "22px",
  padding: "24px",
  border: "2px solid #b9dcd5",
  borderTop: "6px solid #5fae9d",
  borderRadius: "18px",
  background: "linear-gradient(180deg, #f8fdfc 0%, #ffffff 100%)",
  boxShadow: "0 8px 20px rgba(37, 93, 82, 0.10)",
};

const encabezadoPreparacion = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginBottom: "22px",
};

const iconoPreparacion = {
  width: "58px",
  height: "58px",
  display: "grid",
  placeItems: "center",
  borderRadius: "15px",
  background: "#e3f3ef",
  fontSize: "29px",
};

const etiquetaPreparacion = {
  margin: "0 0 4px",
  color: "#66837d",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "0.08em",
};

const tituloPreparacion = {
  margin: 0,
  color: "#173f68",
  fontSize: "25px",
};

const descripcionPreparacion = {
  margin: "5px 0 0",
  color: "#6c7777",
};

const grillaResumen = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px",
};

const tarjetaResumen = {
  padding: "17px 14px",
  border: "1px solid #c9dfda",
  borderRadius: "13px",
  background: "#ffffff",
  textAlign: "center",
};

const iconoResumen = {
  display: "block",
  marginBottom: "7px",
  fontSize: "24px",
};

const etiquetaResumen = {
  display: "block",
  marginBottom: "5px",
  color: "#71807d",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const valorResumen = {
  display: "block",
  color: "#194866",
  fontSize: "19px",
};

const bloqueOpciones = {
  marginTop: "18px",
  padding: "18px",
  border: "1px solid #d4e5e1",
  borderRadius: "14px",
  background: "#ffffff",
};

const tituloOpciones = {
  margin: "0 0 14px",
  color: "#315f5a",
  textAlign: "center",
  fontSize: "17px",
};

const grillaOpciones = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "9px",
};

const opcionPreparada = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px 11px",
  borderRadius: "9px",
  background: "#f2f8f6",
  color: "#49625e",
  fontSize: "13px",
};

const tildeOpcion = {
  color: "#1f9b7b",
  fontWeight: "900",
};

const avisoEtapa = {
  marginTop: "18px",
  padding: "16px",
  border: "1px dashed #bdcec9",
  borderRadius: "13px",
  background: "#fafcfb",
  textAlign: "center",
};

const tituloAviso = {
  display: "block",
  marginBottom: "6px",
  color: "#3f625c",
};

const textoAviso = {
  margin: 0,
  color: "#6c7875",
  lineHeight: 1.55,
};

const botoneraPreparacion = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "22px",
};

const botonSecundario = {
  padding: "11px 19px",
  border: "1px solid #bdd4d8",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#31586b",
  fontWeight: "700",
  cursor: "pointer",
};

const botonGenerar = {
  padding: "11px 23px",
  border: "none",
  borderRadius: "10px",
  background: "#168f84",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(22, 143, 132, 0.22)",
};
