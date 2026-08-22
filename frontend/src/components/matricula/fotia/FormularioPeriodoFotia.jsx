import { useState } from "react";

const estadoInicial = {
  nombre: "",
  cicloLectivo: new Date().getFullYear(),
  fechaInicio: "",
  fechaFin: "",
  estado: "Planificado",
  descripcion: "",
  observaciones: "",
};

export default function FormularioPeriodoFotia({
  onCancelar,
  onPeriodoCreado,
}) {
  const [formulario, setFormulario] =
    useState(estadoInicial);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] = useState("");

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const guardarPeriodo = async (evento) => {
    evento.preventDefault();

    try {
      setGuardando(true);
      setError("");

      const respuesta = await fetch(
        "/api/fotia/periodos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formulario,
            cicloLectivo: Number(
              formulario.cicloLectivo,
            ),
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No se pudo crear el período de FOTIA",
        );
      }

      onPeriodoCreado?.(datos.periodo);
    } catch (errorGuardado) {
      console.error(
        "Error al crear período de FOTIA:",
        errorGuardado,
      );

      setError(errorGuardado.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={guardarPeriodo}
      style={{
        margin: "24px 0 28px",
        padding: "clamp(18px, 3vw, 26px)",
        border: "2px solid #b9d4ea",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow:
          "0 5px 16px rgba(41, 78, 112, 0.08)",
      }}
    >
      <div
        style={{
          marginBottom: "22px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
            color: "#23436d",
            fontSize: "22px",
          }}
        >
          📘 Nuevo período de fortalecimiento
        </h3>

        <p
          style={{
            margin: 0,
            color: "#607080",
            lineHeight: 1.5,
          }}
        >
          Definí el período institucional en el que se
          desarrollará FOTIA.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "18px",
        }}
      >
        <Campo
          etiqueta="Nombre del período"
          name="nombre"
          value={formulario.nombre}
          onChange={actualizarCampo}
          placeholder="Ej.: FOTIA-FORTE Agosto - Octubre 2026"
          requerido
          ocuparTodo
        />

        <Campo
          etiqueta="Ciclo lectivo"
          name="cicloLectivo"
          type="number"
          value={formulario.cicloLectivo}
          onChange={actualizarCampo}
          min="2020"
          max="2100"
          requerido
        />

        <Campo
          etiqueta="Fecha de inicio"
          name="fechaInicio"
          type="date"
          value={formulario.fechaInicio}
          onChange={actualizarCampo}
          requerido
        />

        <Campo
          etiqueta="Fecha de finalización"
          name="fechaFin"
          type="date"
          value={formulario.fechaFin}
          onChange={actualizarCampo}
          requerido
        />

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
          }}
        >
          <span
            style={{
              color: "#365b7d",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Estado
          </span>

          <select
            name="estado"
            value={formulario.estado}
            onChange={actualizarCampo}
            style={estiloControl}
          >
            <option value="Planificado">
              Planificado
            </option>

            <option value="Activo">
              Activo
            </option>

            <option value="Cerrado">
              Cerrado
            </option>
          </select>
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            gridColumn: "1 / -1",
          }}
        >
          <span
            style={{
              color: "#365b7d",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Descripción
          </span>

          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={actualizarCampo}
            rows={3}
            placeholder="Descripción general del período de fortalecimiento."
            style={{
              ...estiloControl,
              resize: "vertical",
              minHeight: "92px",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            gridColumn: "1 / -1",
          }}
        >
          <span
            style={{
              color: "#365b7d",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Observaciones
          </span>

          <textarea
            name="observaciones"
            value={formulario.observaciones}
            onChange={actualizarCampo}
            rows={3}
            placeholder="Información adicional, recursos disponibles o decisiones institucionales."
            style={{
              ...estiloControl,
              resize: "vertical",
              minHeight: "92px",
            }}
          />
        </label>
      </div>

      {error && (
        <p
          style={{
            margin: "20px 0 0",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fff1f1",
            color: "#9b3d3d",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          style={{
            padding: "11px 20px",
            border: "1px solid #bfd4df",
            borderRadius: "10px",
            background: "#f3f8fa",
            color: "#315f6f",
            fontWeight: "700",
            cursor: guardando
              ? "not-allowed"
              : "pointer",
            opacity: guardando ? 0.65 : 1,
          }}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={guardando}
          style={{
            padding: "11px 22px",
            border: "none",
            borderRadius: "10px",
            background: "#148c84",
            color: "#ffffff",
            fontWeight: "700",
            cursor: guardando
              ? "not-allowed"
              : "pointer",
            opacity: guardando ? 0.7 : 1,
            boxShadow:
              "0 4px 10px rgba(20, 140, 132, 0.20)",
          }}
        >
          {guardando
            ? "Guardando..."
            : "💾 Crear período"}
        </button>
      </div>
    </form>
  );
}

function Campo({
  etiqueta,
  ocuparTodo = false,
  requerido = false,
  ...propiedades
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        gridColumn: ocuparTodo
          ? "1 / -1"
          : "auto",
      }}
    >
      <span
        style={{
          color: "#365b7d",
          fontWeight: "700",
          fontSize: "14px",
        }}
      >
        {etiqueta}
        {requerido ? " *" : ""}
      </span>

      <input
        {...propiedades}
        required={requerido}
        style={estiloControl}
      />
    </label>
  );
}

const estiloControl = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #bfd4df",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#31465a",
  fontSize: "15px",
  outline: "none",
};