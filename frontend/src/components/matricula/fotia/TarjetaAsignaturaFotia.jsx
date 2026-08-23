import { useEffect, useRef, useState } from "react";
import FormularioEditarInscripcionFotia from "./FormularioEditarInscripcionFotia";
import FormularioAcreditacionFotia from "./FormularioAcreditacionFotia";

const CONFIGURACION_ESTADOS = {
  Incorporada: {
    icono: "🟡",
    fondo: "#fff8e8",
    color: "#8a5a16",
    borde: "#e6cf9e",
  },

  "En proceso": {
    icono: "🔵",
    fondo: "#eef5fb",
    color: "#365f82",
    borde: "#c8dceb",
  },

  Acreditada: {
    icono: "✅",
    fondo: "#eef8f5",
    color: "#256b61",
    borde: "#b7ddd3",
  },

  Suspendida: {
    icono: "⏸️",
    fondo: "#f3f4f6",
    color: "#667085",
    borde: "#d5dae0",
  },

  "Finalizada sin acreditar": {
    icono: "🔴",
    fondo: "#fff1f1",
    color: "#9b3d3d",
    borde: "#e8bcbc",
  },
};

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin informar";

  const partes = String(fecha).split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;

  return `${dia}/${mes}/${anio}`;
};

export default function TarjetaAsignaturaFotia({
  asignatura,
  docentesFotia = [],
  esAdmin = false,
  onRetirar,
  onActualizada,
}) {
  const configuracionEstado =
    CONFIGURACION_ESTADOS[asignatura.estado] ||
    CONFIGURACION_ESTADOS.Incorporada;

  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoAcreditacion, setModoAcreditacion] = useState(false);

  const [mensajeExito, setMensajeExito] = useState("");

  const mostrarMensajeExito = (mensaje) => {
    setMensajeExito(mensaje);

    setTimeout(() => {
      setMensajeExito("");
    }, 3000);
  };

  const formularioRef = useRef(null);
  useEffect(() => {
    if (!modoEdicion || !formularioRef.current) return;

    const temporizador = setTimeout(() => {
      const formulario = formularioRef.current;

      if (!formulario) return;

      // 1. Primero acomodamos el scroll interno de la tabla
      const contenedorTabla = formulario.closest('[data-fotia-scroll="tabla"]');

      if (contenedorTabla) {
        const rectFormulario = formulario.getBoundingClientRect();
        const rectTabla = contenedorTabla.getBoundingClientRect();

        const desplazamientoInterno =
          rectFormulario.top - rectTabla.top + contenedorTabla.scrollTop - 70;

        contenedorTabla.scrollTo({
          top: Math.max(0, desplazamientoInterno),
          behavior: "smooth",
        });
      }

      // 2. Después acomodamos la página
      setTimeout(() => {
        const rectFormulario = formulario.getBoundingClientRect();

        const posicionDeseada = 120;

        window.scrollBy({
          top: rectFormulario.top - posicionDeseada,
          behavior: "smooth",
        });
      }, 180);
    }, 100);

    return () => clearTimeout(temporizador);
  }, [modoEdicion]);
  const esForteAutomatico = asignatura.origenAutomaticoForte === true;

  const tieneIntervencionGuardada =
    Boolean(asignatura._id) && !String(asignatura._id).startsWith("forte-");

  return (
    <article
      style={{
        padding: "16px",
        border: "1px solid #c9dceb",
        borderRadius: "13px",
        background: "#ffffff",
        boxShadow: "0 3px 9px rgba(41, 78, 112, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: "1 1 260px",
          }}
        >
          <span
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#6b7f92",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Área de fortalecimiento
          </span>

          <h5
            style={{
              margin: "0 0 6px",
              color: "#23436d",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            📚 {asignatura.asignatura}
          </h5>

          <p
            style={{
              margin: 0,
              color: "#68798a",
              fontSize: "14px",
            }}
          >
            {asignatura.anio ? `${asignatura.anio} año` : "Año sin informar"}
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 11px",
            border: `1px solid ${configuracionEstado.borde}`,
            borderRadius: "999px",
            background: configuracionEstado.fondo,
            color: configuracionEstado.color,
            fontSize: "13px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            alignSelf: "flex-start",
            marginTop: "0",
          }}
        >
          <span>{configuracionEstado.icono}</span>
          <span>
            {esForteAutomatico && !tieneIntervencionGuardada
              ? "Sin intervención"
              : asignatura.estado || "Incorporada"}
          </span>
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <Dato
          etiqueta="Fecha de incorporación"
          valor={formatearFecha(asignatura.fechaIncorporacion)}
        />

        <Dato
          etiqueta="Docente responsable"
          valor={asignatura.docenteNombre || "Sin docente asignado"}
        />

        <Dato
          etiqueta="Motivo de incorporación"
          valor={
            asignatura.motivoIncorporacion ||
            (esForteAutomatico ? "Asignatura previa" : "Sin informar")
          }
          ocuparTodo
        />

        {asignatura.observaciones && (
          <Dato
            etiqueta="Observaciones"
            valor={asignatura.observaciones}
            ocuparTodo
          />
        )}

        {asignatura.estado === "Acreditada" && (
          <Dato
            etiqueta="Fecha de acreditación"
            valor={formatearFecha(asignatura.fechaAcreditacion)}
          />
        )}
      </div>

      {esAdmin && asignatura.estado !== "Acreditada" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "9px",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid #e0e9f0",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setModoAcreditacion(false);
              setModoEdicion(true);
            }}
            style={{
              padding: "8px 12px",
              border: "1px solid #f1c3b8",
              borderRadius: "8px",
              background: "#fff6f4",
              color: "#d26b56",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {esForteAutomatico && !tieneIntervencionGuardada
              ? " Iniciar intervención"
              : "✏️ Editar"}
          </button>

          {tieneIntervencionGuardada && (
            <button
              type="button"
              onClick={() => onRetirar?.(asignatura)}
              style={{
                padding: "8px 12px",
                border: "1px solid #e6cf9e",
                borderRadius: "8px",
                background: "#fff8e8",
                color: "#9a712a",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              ⏸️ Retirar de FOTIA
            </button>
          )}

          {tieneIntervencionGuardada && (
            <button
              type="button"
              onClick={() => {
                setModoEdicion(false);
                setModoAcreditacion(true);
              }}
              style={{
                padding: "8px 12px",
                border: "1px solid #70b7a8",
                borderRadius: "8px",
                background: "#eef8f5",
                color: "#256b61",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              ✅ Acreditar
            </button>
          )}
        </div>
      )}

      {mensajeExito && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px 16px",
            border: "1px solid #9fd4c7",
            borderRadius: "10px",
            background: "#eef9f6",
            color: "#1f6f63",
            fontWeight: "700",
            textAlign: "center",
            boxShadow: "0 3px 8px rgba(31, 111, 99, 0.10)",
          }}
        >
          {mensajeExito}
        </div>
      )}

      {esAdmin && modoEdicion && (
        <div
          ref={formularioRef}
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            scrollMarginTop: "12px",
          }}
        >
          <FormularioEditarInscripcionFotia
            inscripcion={asignatura}
            docentesFotia={docentesFotia}
            onCancelar={() => setModoEdicion(false)}
            onGuardado={(inscripcionActualizada) => {
              onActualizada?.(inscripcionActualizada);

              mostrarMensajeExito(
                esForteAutomatico && !tieneIntervencionGuardada
                  ? "✅ Intervención iniciada correctamente"
                  : "✅ Cambios guardados correctamente",
              );

              setModoEdicion(false);
            }}
          />
        </div>
      )}

      {esAdmin && modoAcreditacion && (
        <FormularioAcreditacionFotia
          inscripcion={asignatura}
          docentesFotia={docentesFotia}
          onCancelar={() => setModoAcreditacion(false)}
          onAcreditada={(inscripcionAcreditada) => {
            onActualizada?.(inscripcionAcreditada);
            setModoAcreditacion(false);
          }}
        />
      )}
    </article>
  );
}

function Dato({ etiqueta, valor, ocuparTodo = false }) {
  return (
    <div
      style={{
        padding: "8px 11px",
        border: "1px solid #dde7ee",
        borderRadius: "9px",
        background: "#f9fbfc",
        gridColumn: ocuparTodo ? "1 / -1" : "auto",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "5px",
          color: "#718193",
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {etiqueta}
      </span>

      <span
        style={{
          display: "block",
          color: "#31465a",
          fontSize: "13px",
          fontWeight: "600",
          lineHeight: 1.45,
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {valor}
      </span>
    </div>
  );
}
