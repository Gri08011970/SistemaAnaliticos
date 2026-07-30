import { useState } from "react";

const FORMULARIO_INICIAL = {
  apellido: "",
  nombre: "",
  dni: "",
  cargo: "",
  areas: [],
  email: "",
  telefono: "",
  observaciones: "",
};

export default function GestionDocentesFotia({
  docentesFotia = [],
  onVolver,
  onDocenteCreado,
  onDocenteActualizado,
  onDocenteEliminado,
}) {
  console.log("GESTIÓN DOCENTES FOTIA SE ESTÁ RENDERIZANDO");

  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [nuevaArea, setNuevaArea] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [docenteEnEdicion, setDocenteEnEdicion] = useState(null);

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }));
  };

  const agregarArea = () => {
    const areaLimpia = nuevaArea.trim();

    if (!areaLimpia) return;

    const areaYaExiste = formulario.areas.some(
      (area) => area.toLowerCase() === areaLimpia.toLowerCase(),
    );

    if (areaYaExiste) {
      setNuevaArea("");
      return;
    }

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      areas: [...formularioAnterior.areas, areaLimpia],
    }));

    setNuevaArea("");
  };

  const quitarArea = (areaAEliminar) => {
    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      areas: formularioAnterior.areas.filter((area) => area !== areaAEliminar),
    }));
  };

  const manejarTeclaArea = (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      agregarArea();
    }
  };

  const manejarSubmit = async (evento) => {
  evento.preventDefault();

  setMensajeExito("");
  setMensajeError("");

  const apellido = formulario.apellido.trim();
  const nombre = formulario.nombre.trim();

  if (!apellido || !nombre) {
    setMensajeError(
      "El apellido y el nombre del docente son obligatorios.",
    );
    return;
  }

  const docenteParaGuardar = {
    apellido,
    nombre,
    dni: formulario.dni.trim(),
    cargo: formulario.cargo.trim(),
    areas: formulario.areas,
    email: formulario.email.trim(),
    telefono: formulario.telefono.trim(),
    observaciones: formulario.observaciones.trim(),
  };

  try {
    setGuardando(true);

    const editando = Boolean(docenteEnEdicion?._id);

    const url = editando
      ? `http://localhost:3001/api/fotia/docentes/${docenteEnEdicion._id}`
      : "http://localhost:3001/api/fotia/docentes";

    const respuesta = await fetch(url, {
      method: editando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(docenteParaGuardar),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.mensaje || "No se pudo guardar el docente.",
      );
    }

    if (editando) {
      onDocenteActualizado?.(datos.docente);
    } else {
      onDocenteCreado?.(datos.docente);
    }

    setFormulario(FORMULARIO_INICIAL);
    setNuevaArea("");
    setDocenteEnEdicion(null);

    setMensajeExito(
      editando
        ? `✔ Los datos de ${datos.docente.nombre} ${datos.docente.apellido} fueron actualizados correctamente.`
        : `✔ ${datos.docente.nombre} ${datos.docente.apellido} fue incorporado/a correctamente como docente responsable de FOTIA.`,
    );
  } catch (error) {
    console.error("Error al guardar docente FOTIA:", error);

    setMensajeError(
      error.message || "Ocurrió un error al guardar el docente.",
    );
  } finally {
    setGuardando(false);
  }
};

  const comenzarEdicion = (docente) => {
    setDocenteEnEdicion(docente);

    setFormulario({
      apellido: docente.apellido || "",
      nombre: docente.nombre || "",
      dni: docente.dni || "",
      cargo: docente.cargo || "",
      areas: Array.isArray(docente.areas) ? docente.areas : [],
      email: docente.email || "",
      telefono: docente.telefono || "",
      observaciones: docente.observaciones || "",
    });

    setNuevaArea("");
    setMensajeExito("");
    setMensajeError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelarEdicion = () => {
    setDocenteEnEdicion(null);
    setFormulario(FORMULARIO_INICIAL);
    setNuevaArea("");
    setMensajeError("");
  };

  const eliminarDocente = async (docente) => {
    const nombreCompleto =
      `${docente.apellido || ""} ${docente.nombre || ""}`.trim();

    const confirmar = window.confirm(
      `¿Eliminar a ${nombreCompleto} del plantel activo de FOTIA?\n\nDejará de aparecer en nuevas asignaciones, pero se conservarán sus registros históricos.`,
    );

    if (!confirmar) return;

    try {
      setMensajeExito("");
      setMensajeError("");

      const respuesta = await fetch(
        `http://localhost:3001/api/fotia/docentes/${docente._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activo: false,
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo eliminar el docente.");
      }

      onDocenteEliminado?.(datos.docente);

      if (docenteEnEdicion?._id === docente._id) {
        cancelarEdicion();
      }

      setMensajeExito(
        `✔ ${nombreCompleto} fue eliminado/a del plantel activo de FOTIA.`,
      );
    } catch (error) {
      console.error("Error al eliminar docente FOTIA:", error);

      setMensajeError(
        error.message || "Ocurrió un error al eliminar el docente.",
      );
    }
  };

  const estiloLabel = {
    display: "block",
    marginBottom: "7px",
    color: "#315f6f",
    fontWeight: "700",
    fontSize: "14px",
  };

  const estiloInput = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #c7dbe5",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#30485a",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <div
      style={{
        border: "2px solid #b9d4ea",
        borderRadius: "16px",
        padding: "28px",
        background: "#ffffff",
        boxShadow: "0 5px 16px rgba(41,78,112,.08)",
      }}
    >
      <button
        type="button"
        onClick={onVolver}
        style={{
          padding: "9px 16px",
          border: "1px solid #bfd4df",
          borderRadius: "9px",
          background: "#f3f8fa",
          color: "#315f6f",
          cursor: "pointer",
          fontWeight: "700",
          marginBottom: "24px",
        }}
      >
        ← Volver al menú FOTIA
      </button>

      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <p
          style={{
            margin: 0,
            color: "#6b7f92",
            fontWeight: "700",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          FOTIA
        </p>

        <h2
          style={{
            margin: "8px 0",
            color: "#23436d",
            fontSize: "30px",
          }}
        >
          👩‍🏫 Docentes responsables
        </h2>

        <p
          style={{
            margin: "8px auto 0",
            maxWidth: "720px",
            color: "#607080",
            fontSize: "16px",
            lineHeight: 1.6,
          }}
        >
          Registre aquí a los docentes que participarán en las intervenciones y
          acreditaciones de FOTIA.
        </p>
      </div>

      {mensajeExito && (
        <div
          role="status"
          style={{
            maxWidth: "760px",
            margin: "0 auto 18px",
            padding: "14px 18px",
            border: "1px solid #9fd5c8",
            borderRadius: "11px",
            background: "#eaf8f4",
            color: "#176b61",
            fontWeight: "700",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {mensajeExito}
        </div>
      )}

      {mensajeError && (
        <div
          role="alert"
          style={{
            maxWidth: "760px",
            margin: "0 auto 18px",
            padding: "14px 18px",
            border: "1px solid #e2b8b8",
            borderRadius: "11px",
            background: "#fff1f1",
            color: "#963d3d",
            fontWeight: "700",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {mensajeError}
        </div>
      )}

      <form
        onSubmit={manejarSubmit}
        style={{
          border: "1px solid #c7e1dc",
          borderRadius: "15px",
          padding: "24px",
          background: "#fbfefd",
          boxShadow: "0 4px 12px rgba(20,140,132,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "1px solid #dbe9e7",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              display: "grid",
              placeItems: "center",
              borderRadius: "12px",
              background: "#e8f7f3",
              fontSize: "23px",
            }}
          >
            👩‍🏫
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                color: "#23436d",
                fontSize: "21px",
              }}
            >
              {docenteEnEdicion
                ? "Editar docente responsable"
                : "Nuevo docente responsable"}
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: "#718291",
                fontSize: "14px",
              }}
            >
              Los campos señalados con * son obligatorios.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
          }}
        >
          <div>
            <label htmlFor="fotia-docente-apellido" style={estiloLabel}>
              Apellido *
            </label>

            <input
              id="fotia-docente-apellido"
              type="text"
              name="apellido"
              value={formulario.apellido}
              onChange={cambiarCampo}
              placeholder="Ej.: Pérez"
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label htmlFor="fotia-docente-nombre" style={estiloLabel}>
              Nombre *
            </label>

            <input
              id="fotia-docente-nombre"
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={cambiarCampo}
              placeholder="Ej.: Laura"
              required
              style={estiloInput}
            />
          </div>

          <div>
            <label htmlFor="fotia-docente-dni" style={estiloLabel}>
              DNI
            </label>

            <input
              id="fotia-docente-dni"
              type="text"
              name="dni"
              value={formulario.dni}
              onChange={cambiarCampo}
              placeholder="Sin puntos"
              inputMode="numeric"
              style={estiloInput}
            />
          </div>

          <div>
            <label htmlFor="fotia-docente-cargo" style={estiloLabel}>
              Cargo
            </label>

            <input
              id="fotia-docente-cargo"
              type="text"
              name="cargo"
              value={formulario.cargo}
              onChange={cambiarCampo}
              placeholder="Ej.: Profesora"
              style={estiloInput}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            border: "1px solid #d5e8e4",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <label htmlFor="fotia-docente-area" style={estiloLabel}>
            Áreas de desempeño
          </label>

          <p
            style={{
              margin: "0 0 12px",
              color: "#748594",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Escriba un área y presione Enter o el botón Agregar. Puede registrar
            más de una.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              id="fotia-docente-area"
              type="text"
              value={nuevaArea}
              onChange={(evento) => setNuevaArea(evento.target.value)}
              onKeyDown={manejarTeclaArea}
              placeholder="Ej.: Matemática"
              style={{
                ...estiloInput,
                flex: "1 1 280px",
              }}
            />

            <button
              type="button"
              onClick={agregarArea}
              style={{
                padding: "10px 18px",
                minWidth: "150px",
                border: "1px solid #7bc4b6",
                borderRadius: "9px",
                background: "#e9f8f4",
                color: "#148c84",
                fontWeight: "800",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              ＋ Agregar
            </button>
          </div>

          {formulario.areas.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "9px",
                marginTop: "16px",
              }}
            >
              {formulario.areas.map((area) => (
                <span
                  key={area}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 9px 7px 12px",
                    border: "1px solid #b7e1d8",
                    borderRadius: "999px",
                    background: "#e9f8f4",
                    color: "#14776f",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  {area}

                  <button
                    type="button"
                    onClick={() => quitarArea(area)}
                    aria-label={`Quitar área ${area}`}
                    title={`Quitar ${area}`}
                    style={{
                      width: "22px",
                      height: "22px",
                      display: "grid",
                      placeItems: "center",
                      padding: 0,
                      border: "none",
                      borderRadius: "50%",
                      background: "#ffffff",
                      color: "#64877f",
                      cursor: "pointer",
                      fontWeight: "900",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p
              style={{
                margin: "14px 0 0",
                color: "#8a98a4",
                fontSize: "13px",
                fontStyle: "italic",
              }}
            >
              Agregue una o más áreas para identificar las asignaturas que podrá
              acompañar en FOTIA.
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          <div>
            <label htmlFor="fotia-docente-email" style={estiloLabel}>
              Correo electrónico
            </label>

            <input
              id="fotia-docente-email"
              type="email"
              name="email"
              value={formulario.email}
              onChange={cambiarCampo}
              placeholder="Ej.: docente@escuela.edu.ar"
              style={estiloInput}
            />
          </div>

          <div>
            <label htmlFor="fotia-docente-telefono" style={estiloLabel}>
              Teléfono
            </label>

            <input
              id="fotia-docente-telefono"
              type="tel"
              name="telefono"
              value={formulario.telefono}
              onChange={cambiarCampo}
              placeholder="Ej.: 11 1234-5678"
              style={estiloInput}
            />
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label htmlFor="fotia-docente-observaciones" style={estiloLabel}>
            Observaciones
          </label>

          <textarea
            id="fotia-docente-observaciones"
            name="observaciones"
            value={formulario.observaciones}
            onChange={cambiarCampo}
            rows={4}
            placeholder="Agregar información institucional relevante (opcional)"
            style={{
              ...estiloInput,
              resize: "vertical",
              minHeight: "105px",
              fontFamily: "inherit",
              lineHeight: 1.5,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #dbe9e7",
          }}
        >
          <button
            type="submit"
            disabled={guardando}
            style={{
              minWidth: "250px",
              padding: "12px 22px",
              border: "1px solid #70b7a8",
              borderRadius: "9px",
              background: "#148c84",
              color: "#ffffff",
              fontWeight: "800",
              fontSize: "16px",
              letterSpacing: ".02em",
              cursor: guardando ? "not-allowed" : "pointer",
              opacity: guardando ? 0.7 : 1,
              boxShadow: "0 3px 8px rgba(20,140,132,.18)",
            }}
          >
            {guardando
              ? "Guardando..."
              : docenteEnEdicion
                ? "💾 Guardar cambios"
                : "💾 Guardar docente"}
          </button>
          {docenteEnEdicion && (
            <button
              type="button"
              onClick={cancelarEdicion}
              disabled={guardando}
              style={{
                marginLeft: "10px",
                minWidth: "170px",
                padding: "12px 20px",
                border: "1px solid #cbd8df",
                borderRadius: "9px",
                background: "#f4f7f9",
                color: "#607080",
                fontWeight: "700",
                cursor: guardando ? "not-allowed" : "pointer",
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>
      <div
        style={{
          marginTop: "28px",
          border: "1px solid #cfe0e8",
          borderRadius: "15px",
          padding: "22px",
          background: "#fbfdfe",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#6b7f92",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Plantel FOTIA
          </p>

          <h3
            style={{
              margin: "7px 0 0",
              color: "#23436d",
              fontSize: "22px",
            }}
          >
            👩‍🏫 Docentes registrados: {docentesFotia.length}
          </h3>
        </div>

        {docentesFotia.length === 0 ? (
          <div
            style={{
              padding: "24px",
              border: "2px dashed #c9dce6",
              borderRadius: "12px",
              background: "#ffffff",
              textAlign: "center",
              color: "#748594",
            }}
          >
            Todavía no hay docentes activos registrados en FOTIA.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "16px",
            }}
          >
            {docentesFotia.map((docente) => (
              <article
                key={docente._id}
                style={{
                  padding: "18px",
                  border: "1px solid #c8dde6",
                  borderRadius: "13px",
                  background: "#ffffff",
                  boxShadow: "0 3px 9px rgba(41,78,112,.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#718291",
                        fontSize: "11px",
                        fontWeight: "800",
                        letterSpacing: ".07em",
                        textTransform: "uppercase",
                      }}
                    >
                      Docente responsable
                    </p>

                    <h4
                      style={{
                        margin: "6px 0 0",
                        color: "#23436d",
                        fontSize: "19px",
                      }}
                    >
                      {docente.apellido} {docente.nombre}
                    </h4>
                  </div>

                  <span
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #a9dacd",
                      borderRadius: "999px",
                      background: "#eaf8f4",
                      color: "#16766c",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  >
                    Activo
                  </span>
                </div>

                {docente.cargo && (
                  <p
                    style={{
                      margin: "13px 0 0",
                      color: "#536a7d",
                      fontWeight: "700",
                    }}
                  >
                    {docente.cargo}
                  </p>
                )}

                {Array.isArray(docente.areas) && docente.areas.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "7px",
                      marginTop: "14px",
                    }}
                  >
                    {docente.areas.map((area) => (
                      <span
                        key={area}
                        style={{
                          padding: "6px 10px",
                          border: "1px solid #b9e0d7",
                          borderRadius: "999px",
                          background: "#edf9f6",
                          color: "#19786f",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}

                {(docente.email || docente.telefono) && (
                  <div
                    style={{
                      marginTop: "15px",
                      paddingTop: "13px",
                      borderTop: "1px solid #e0e9ed",
                      color: "#607080",
                      fontSize: "13px",
                      lineHeight: 1.7,
                    }}
                  >
                    {docente.email && <div>📧 {docente.email}</div>}
                    {docente.telefono && <div>📱 {docente.telefono}</div>}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                    gap: "9px",
                    marginTop: "18px",
                    paddingTop: "14px",
                    borderTop: "1px solid #e0e9ed",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => comenzarEdicion(docente)}
                    style={{
                      padding: "8px 14px",
                      border: "1px solid #efc1b3",
                      borderRadius: "8px",
                      background: "#fff5f1",
                      color: "#b45c43",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarDocente(docente)}
                    style={{
                      padding: "8px 14px",
                      border: "1px solid #e2bcbc",
                      borderRadius: "8px",
                      background: "#fff1f1",
                      color: "#a64949",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
