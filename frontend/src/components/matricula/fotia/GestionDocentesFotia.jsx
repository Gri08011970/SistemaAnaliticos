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
}) {

  console.log("GESTIÓN DOCENTES FOTIA SE ESTÁ RENDERIZANDO");
  
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [nuevaArea, setNuevaArea] = useState("");

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
      areas: formularioAnterior.areas.filter(
        (area) => area !== areaAEliminar,
      ),
    }));
  };

  const manejarTeclaArea = (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      agregarArea();
    }
  };

  const manejarSubmit = (evento) => {
    evento.preventDefault();

    // En el paso siguiente conectaremos este formulario
    // con POST /api/fotia/docentes.
    console.log("Docente preparado para guardar:", formulario);
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
          Registre aquí a los docentes que participarán en las intervenciones
          y acreditaciones de FOTIA.
        </p>
      </div>

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
              Nuevo docente responsable
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
            Escriba un área y presione Enter o el botón Agregar. Puede
            registrar más de una.
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
              Todavía no se agregaron áreas.
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
            title="En el próximo paso conectaremos el guardado con el backend"
            style={{
              minWidth: "210px",
              padding: "11px 20px",
              border: "1px solid #70b7a8",
              borderRadius: "9px",
              background: "#148c84",
              color: "#ffffff",
              fontWeight: "800",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 3px 8px rgba(20,140,132,.18)",
            }}
          >
            💾 Guardar docente
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "24px",
          padding: "16px 20px",
          border: "1px solid #d8e7ee",
          borderRadius: "12px",
          background: "#f8fbfd",
          color: "#315f6f",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Docentes registrados: {docentesFotia.length} 
      </div>
    </div>
  );
}
