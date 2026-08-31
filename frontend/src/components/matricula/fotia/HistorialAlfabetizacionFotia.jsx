export default function HistorialAlfabetizacionFotia({
  inscripciones = [],
  onReabrir,
  esAdmin = false,
}) {
  const normalizarTexto = (valor = "") =>
    String(valor)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const historialFotia = inscripciones
    .filter((inscripcion) => {
      const asignatura = normalizarTexto(
        inscripcion.asignatura,
      );

      return (
        inscripcion.tipoOrigen === "En curso" &&
        asignatura === "practicas del lenguaje" &&
        inscripcion.estado === "Objetivo alcanzado"
      );
    })
    .sort((a, b) => {
      const apellidoA = String(a.apellido || "");
      const apellidoB = String(b.apellido || "");

      return apellidoA.localeCompare(apellidoB, "es", {
        sensitivity: "base",
      });
    });

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    const partes = String(fecha).split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return fecha;
  };

  const obtenerNombreDocente = (inscripcion) => {
    if (inscripcion.docenteNombre) {
      return inscripcion.docenteNombre;
    }

    const docente = inscripcion.docenteId;

    if (
      docente &&
      typeof docente === "object"
    ) {
      const nombreCompleto = [
        docente.apellido,
        docente.nombre,
      ]
        .filter(Boolean)
        .join(" ");

      if (nombreCompleto) {
        return nombreCompleto;
      }
    }

    return "Sin docente informado";
  };

  return (
    <section
      style={{
        marginTop: "24px",
        padding: "22px",
        border: "1px solid #b9d4ea",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow:
          "0 5px 14px rgba(41, 78, 112, 0.08)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "22px",
        }}
      >
        <span
          style={{
            display: "block",
            marginBottom: "5px",
            color: "#60758a",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          FOTIA · ALFABETIZACIÓN
        </span>

        <h3
          style={{
            margin: "0 0 7px",
            color: "#23436d",
            fontSize: "24px",
          }}
        >
          📖 Historial de alfabetización
        </h3>

        <p
          style={{
            margin: 0,
            color: "#607080",
            fontSize: "15px",
          }}
        >
          Estudiantes que alcanzaron el objetivo de
          alfabetización en Prácticas del Lenguaje.
        </p>
      </div>

      <div
        style={{
          marginBottom: "18px",
          padding: "13px 16px",
          border: "1px solid #c8dceb",
          borderRadius: "10px",
          background: "#f5f9fc",
          color: "#365f82",
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        Objetivos alcanzados:{" "}
        <strong>{historialFotia.length}</strong>
      </div>

      {historialFotia.length === 0 ? (
        <div
          style={{
            padding: "28px 18px",
            border: "1px dashed #c8dceb",
            borderRadius: "12px",
            background: "#fafcfd",
            color: "#607080",
            textAlign: "center",
          }}
        >
          Todavía no hay estudiantes con objetivo de
          alfabetización alcanzado.
        </div>
      ) : (
        <div
          className="tabla-scroll-mobile"
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "850px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#eef5fb",
                  color: "#23436d",
                }}
              >
                <th style={estiloEncabezado}>
                  Estudiante
                </th>

                <th style={estiloEncabezado}>
                  Curso
                </th>

                <th style={estiloEncabezado}>
                  Turno
                </th>

                <th style={estiloEncabezado}>
                  Docente
                </th>

                <th style={estiloEncabezado}>
                  Fecha
                </th>

                <th style={estiloEncabezado}>
                  Estado
                </th>

                {esAdmin && (
                  <th style={estiloEncabezado}>
                    Acción
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {historialFotia.map((inscripcion) => (
                <tr key={inscripcion._id}>
                  <td style={estiloCelda}>
                    <strong>
                      {[
                        inscripcion.apellido,
                        inscripcion.nombre,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </strong>
                  </td>

                  <td style={estiloCelda}>
                    {inscripcion.curso || "-"}
                  </td>

                  <td style={estiloCelda}>
                    {inscripcion.turno || "-"}
                  </td>

                  <td style={estiloCelda}>
                    {obtenerNombreDocente(inscripcion)}
                  </td>

                  <td style={estiloCelda}>
                    {formatearFecha(
                      inscripcion.fechaObjetivoAlcanzado,
                    )}
                  </td>

                  <td style={estiloCelda}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        border:
                          "1px solid #b7ddd3",
                        borderRadius: "999px",
                        background: "#eef8f5",
                        color: "#256b61",
                        fontSize: "12px",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ✓ Objetivo alcanzado
                    </span>
                  </td>

                  {esAdmin && (
                    <td style={estiloCelda}>
                      <button
                        type="button"
                        onClick={() =>
                          onReabrir?.(inscripcion)
                        }
                        style={{
                          padding: "8px 12px",
                          border:
                            "1px solid #b9d4ea",
                          borderRadius: "8px",
                          background: "#f4f9fc",
                          color: "#315f6f",
                          fontWeight: "700",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ↩ Reabrir seguimiento
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const estiloEncabezado = {
  padding: "11px 10px",
  border: "1px solid #c8d8e5",
  fontSize: "13px",
  textAlign: "center",
};

const estiloCelda = {
  padding: "11px 10px",
  border: "1px solid #d8e2ea",
  color: "#36506a",
  fontSize: "13px",
  textAlign: "center",
  verticalAlign: "middle",
};