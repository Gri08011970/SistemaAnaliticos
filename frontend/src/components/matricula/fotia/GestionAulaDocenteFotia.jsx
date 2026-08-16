import { useEffect, useState } from "react";

export default function GestionAulaDocenteFotia({ espacio, volver }) {
  const [contenido, setContenido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editandoMensaje, setEditandoMensaje] = useState(false);
  const [mensajeDocente, setMensajeDocente] = useState("");
  const [guardandoMensaje, setGuardandoMensaje] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [creandoUnidad, setCreandoUnidad] = useState(false);
  const [tituloUnidad, setTituloUnidad] = useState("");
  const [descripcionUnidadNueva, setDescripcionUnidadNueva] = useState("");
  const [guardandoUnidad, setGuardandoUnidad] = useState(false);
  const [errorUnidad, setErrorUnidad] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("tokenUsuario");

    fetch("/api/fotia/mi-espacio-docente/aula", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        periodoId: espacio?.periodoId?._id,
        asignatura: espacio?.asignatura,
        curso: espacio?.curso || "",
      }),
    })
      .then(async (respuesta) => {
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje || "No se pudo abrir el aula FOTIA.");
        }

        return datos;
      })
      .then((datos) => {
        const contenidoRecibido = datos.contenido || null;

        setContenido(contenidoRecibido);

        setMensajeDocente(contenidoRecibido?.mensajeDocente?.texto || "");
      })
      .catch((error) => {
        console.error("Error al abrir aula docente:", error);

        setError(error.message || "No se pudo conectar con el servidor.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [espacio]);

async function guardarMensaje() {
  if (!contenido?._id) {
    setErrorMensaje("No se pudo identificar el aula.");
    return;
  }

  if (!mensajeDocente.trim()) {
    setErrorMensaje("Escribí un mensaje antes de guardar.");
    return;
  }

  try {
    setGuardandoMensaje(true);
    setErrorMensaje("");

    const token = localStorage.getItem("tokenUsuario");

    const respuesta = await fetch(
      `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/mensaje`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          texto: mensajeDocente.trim(),
        }),
      },
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.mensaje || "No se pudo guardar el mensaje.",
      );
    }

    const contenidoActualizado =
      datos.contenido || datos;

    setContenido((contenidoAnterior) => ({
      ...contenidoAnterior,
      ...contenidoActualizado,
      mensajeDocente:
        contenidoActualizado?.mensajeDocente || {
          ...contenidoAnterior?.mensajeDocente,
          texto: mensajeDocente.trim(),
        },
    }));

    setMensajeDocente(
      contenidoActualizado?.mensajeDocente?.texto ||
        mensajeDocente.trim(),
    );

    setEditandoMensaje(false);
  } catch (error) {
    console.error(
      "Error al guardar mensaje docente:",
      error,
    );

    setErrorMensaje(
      error.message ||
        "No se pudo guardar el mensaje.",
    );
  } finally {
    setGuardandoMensaje(false);
  }
}

async function guardarUnidad() {
  if (!contenido?._id) {
    setErrorUnidad("No se pudo identificar el aula.");
    return;
  }

  if (!tituloUnidad.trim()) {
    setErrorUnidad(
      "Escribí un título para la unidad.",
    );
    return;
  }

  try {
    setGuardandoUnidad(true);
    setErrorUnidad("");

    const token =
      localStorage.getItem("tokenUsuario");

    const respuesta = await fetch(
      `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/unidades`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: tituloUnidad.trim(),
          descripcion:
            descripcionUnidadNueva.trim(),
        }),
      },
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.mensaje ||
          "No se pudo crear la unidad.",
      );
    }

    setContenido(
      datos.contenido || contenido,
    );

    setTituloUnidad("");
    setDescripcionUnidadNueva("");
    setCreandoUnidad(false);
  } catch (error) {
    console.error(
      "Error al crear unidad:",
      error,
    );

    setErrorUnidad(
      error.message ||
        "No se pudo crear la unidad.",
    );
  } finally {
    setGuardandoUnidad(false);
  }
}

const periodo =
  espacio?.periodoId?.nombre || "";

const ciclo =
  espacio?.periodoId?.cicloLectivo || "";
  if (cargando) {
    return (
      <div style={pagina}>
        <div style={contenedor}>
          <div style={estadoCarga}>⏳ Preparando aula...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pagina}>
        <div style={contenedor}>
          <button type="button" onClick={volver} style={botonVolver}>
            ← Volver a Mis espacios
          </button>

          <div style={mensajeError}>⚠️ {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <button type="button" onClick={volver} style={botonVolver}>
          ← Volver a Mis espacios
        </button>

        <section style={encabezadoAula}>
          <div style={iconoPrincipal}>📘</div>

          <div style={{ flex: 1 }}>
            <div style={etiqueta}>GESTIÓN DEL AULA FOTIA</div>

            <h1 style={titulo}>{espacio?.asignatura}</h1>

            <p style={subtitulo}>
              Curso: <strong>{espacio?.curso}</strong>
              {" · "}
              {periodo}
              {ciclo ? ` - ${ciclo}` : ""}
            </p>
          </div>

          <div style={contenido?.publicado ? estadoPublicado : estadoBorrador}>
            {contenido?.publicado ? "🟢 Publicada" : "🟡 Borrador"}
          </div>
        </section>

        <section style={resumen}>
          <div style={datoResumen}>
            <span style={etiquetaDato}>👥 Estudiantes</span>

            <strong style={valorDato}>
              {espacio?.cantidadEstudiantes || 0}
            </strong>
          </div>

          <div style={datoResumen}>
            <span style={etiquetaDato}>📚 Unidades</span>

            <strong style={valorDato}>
              {contenido?.unidades?.length || 0}
            </strong>
          </div>

          <div style={datoResumen}>
            <span style={etiquetaDato}>📄 Recursos generales</span>

            <strong style={valorDato}>
              {contenido?.recursosGenerales?.length || 0}
            </strong>
          </div>
        </section>

        <section style={bloquePrincipal}>
          <div style={cabeceraBloque}>
            <div>
              <div style={etiqueta}>COMUNICACIÓN</div>

              <h2 style={tituloBloque}>💬 Mensaje para tus estudiantes</h2>
            </div>

            <span style={proximamente}>Comunicación del aula</span>
          </div>

          <div style={mensajeActual}>
            {editandoMensaje ? (
              <>
                <textarea
                  value={mensajeDocente}
                  onChange={(evento) => {
                    setMensajeDocente(evento.target.value);
                    setErrorMensaje("");
                  }}
                  placeholder="Escribí un mensaje para tus estudiantes..."
                  rows={5}
                  style={campoMensaje}
                  disabled={guardandoMensaje}
                />

                <div style={contadorMensaje}>
                  {mensajeDocente.length} caracteres
                </div>

                {errorMensaje && (
                  <div style={errorMensajeEstilo}>⚠️ {errorMensaje}</div>
                )}

                <div style={accionesMensaje}>
                  <button
                    type="button"
                    onClick={guardarMensaje}
                    disabled={guardandoMensaje}
                    style={
                      guardandoMensaje
                        ? botonDeshabilitado
                        : botonGuardarMensaje
                    }
                  >
                    {guardandoMensaje ? "Guardando..." : "💾 Guardar mensaje"}
                  </button>

                  <button
                    type="button"
                    disabled={guardandoMensaje}
                    onClick={() => {
                      setMensajeDocente(contenido?.mensajeDocente?.texto || "");

                      setErrorMensaje("");
                      setEditandoMensaje(false);
                    }}
                    style={botonCancelarMensaje}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                {contenido?.mensajeDocente?.texto ? (
                  <div style={mensajePublicado}>
                    <div style={etiquetaMensaje}>💬 MENSAJE DEL DOCENTE</div>

                    <p style={textoMensaje}>{contenido.mensajeDocente.texto}</p>
                  </div>
                ) : (
                  <p style={textoVacio}>
                    Todavía no cargaste un mensaje para este espacio.
                  </p>
                )}

                <div style={accionesMensaje}>
                  <button
                    type="button"
                    onClick={() => {
                      setMensajeDocente(contenido?.mensajeDocente?.texto || "");

                      setErrorMensaje("");
                      setEditandoMensaje(true);
                    }}
                    style={botonEscribirMensaje}
                  >
                    {contenido?.mensajeDocente?.texto
                      ? "✏️ Editar mensaje"
                      : "✍️ Escribir mensaje"}
                  </button>

                  <button type="button" disabled style={botonDeshabilitado}>
                    🎙️ Agregar mensaje de voz
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <section style={bloquePrincipal}>
          <div style={cabeceraBloque}>
            <div>
              <div style={etiqueta}>ORGANIZACIÓN PEDAGÓGICA</div>

              <h2 style={tituloBloque}>📚 Unidades y temas</h2>
            </div>

            {!creandoUnidad && (
              <button
                type="button"
                onClick={() => {
                  setTituloUnidad("");
                  setDescripcionUnidadNueva("");
                  setErrorUnidad("");
                  setCreandoUnidad(true);
                }}
                style={botonCrearUnidad}
              >
                + Crear unidad
              </button>
            )}
          </div>

          {creandoUnidad && (
            <div style={formularioUnidad}>
              <div style={encabezadoFormularioUnidad}>
                <div>
                  <div style={etiqueta}>NUEVA UNIDAD</div>

                  <h3 style={tituloFormularioUnidad}>📖 Crear unidad o tema</h3>
                </div>
              </div>

              <label style={grupoCampo}>
                <span style={labelCampo}>Título de la unidad *</span>

                <input
                  type="text"
                  value={tituloUnidad}
                  onChange={(evento) => {
                    setTituloUnidad(evento.target.value);
                    setErrorUnidad("");
                  }}
                  placeholder="Ej.: Unidad 1 — Present Simple"
                  style={inputUnidad}
                  disabled={guardandoUnidad}
                />
              </label>

              <label style={grupoCampo}>
                <span style={labelCampo}>Breve descripción</span>

                <textarea
                  value={descripcionUnidadNueva}
                  onChange={(evento) =>
                    setDescripcionUnidadNueva(evento.target.value)
                  }
                  placeholder="Ej.: En esta unidad vamos a trabajar estructura, usos y ejemplos del Present Simple."
                  rows={4}
                  style={textareaUnidad}
                  disabled={guardandoUnidad}
                />
              </label>

              {errorUnidad && (
                <div style={errorUnidadEstilo}>⚠️ {errorUnidad}</div>
              )}

              <div style={accionesUnidad}>
                <button
                  type="button"
                  onClick={guardarUnidad}
                  disabled={guardandoUnidad}
                  style={
                    guardandoUnidad ? botonDeshabilitado : botonGuardarUnidad
                  }
                >
                  {guardandoUnidad ? "Guardando..." : "💾 Guardar unidad"}
                </button>

                <button
                  type="button"
                  disabled={guardandoUnidad}
                  onClick={() => {
                    setTituloUnidad("");
                    setDescripcionUnidadNueva("");
                    setErrorUnidad("");
                    setCreandoUnidad(false);
                  }}
                  style={botonCancelarUnidad}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {contenido?.unidades?.length ? (
            <div style={listaUnidades}>
              {contenido.unidades.map((unidad) => (
                <div key={unidad._id} style={unidadTarjeta}>
                  <div style={cabeceraUnidadCreada}>
                    <div style={numeroUnidad}>{unidad.orden}</div>

                    <div style={{ flex: 1 }}>
                      <strong style={tituloUnidadCreada}>
                        {unidad.titulo}
                      </strong>

                      {unidad.descripcion && (
                        <p style={descripcionUnidad}>{unidad.descripcion}</p>
                      )}
                    </div>
                  </div>

                  <div style={herramientasUnidad}>
                    <span style={miniHerramienta}>📄 Materiales</span>

                    <span style={miniHerramienta}>🎥 Videos</span>

                    <span style={miniHerramienta}>📝 Actividades</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !creandoUnidad && (
              <div style={estadoVacio}>
                <div style={iconoVacio}>📖</div>

                <strong>Todavía no creaste unidades.</strong>

                <span>
                  Podés organizar el contenido por unidades, temas o bloques de
                  trabajo.
                </span>
              </div>
            )
          )}
        </section>

        <section style={grillaHerramientas}>
          <article style={tarjetaHerramienta}>
            <div style={iconoHerramienta}>📅</div>

            <h3 style={tituloHerramienta}>Fechas importantes</h3>

            <p style={textoHerramienta}>
              Encuentros, entregas y fechas relevantes del espacio.
            </p>

            <button type="button" disabled style={botonDeshabilitado}>
              Próximamente
            </button>
          </article>
        </section>

        <section style={publicacion}>
          <div>
            <div style={etiqueta}>VISIBILIDAD</div>

            <h2 style={tituloPublicacion}>🚦 Publicación del aula</h2>

            <p style={textoPublicacion}>
              Mientras esté en borrador, tus estudiantes no verán el contenido
              nuevo que prepares.
            </p>
          </div>

          <button type="button" disabled style={botonPublicarDeshabilitado}>
            {contenido?.publicado ? "Volver a borrador" : "Publicar aula"}
          </button>
        </section>
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f4f8fb 0%, #eef7f4 100%)",
  padding: "28px 20px",
  fontFamily: "Arial, sans-serif",
};

const contenedor = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const botonVolver = {
  border: "1px solid #bfd5dc",
  background: "#ffffff",
  color: "#31556c",
  borderRadius: "999px",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "700",
  marginBottom: "18px",
};

const encabezadoAula = {
  display: "flex",
  gap: "18px",
  alignItems: "center",
  background: "#ffffff",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  padding: "22px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.08)",
  marginBottom: "18px",
  flexWrap: "wrap",
};

const iconoPrincipal = {
  width: "68px",
  height: "68px",
  borderRadius: "18px",
  background: "#e8f4f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "34px",
  flexShrink: 0,
};

const etiqueta = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#64808a",
};

const titulo = {
  margin: "5px 0",
  color: "#173f68",
  fontSize: "30px",
};

const subtitulo = {
  margin: 0,
  color: "#5f6f7a",
};

const estadoBorrador = {
  background: "#fff7df",
  color: "#8a6500",
  border: "1px solid #ecd58c",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: "800",
};

const estadoPublicado = {
  background: "#eaf7ef",
  color: "#286440",
  border: "1px solid #b8ddc4",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: "800",
};

const resumen = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginBottom: "18px",
};

const datoResumen = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
};

const etiquetaDato = {
  color: "#6b7f8b",
  fontSize: "13px",
};

const valorDato = {
  color: "#173f68",
  fontSize: "18px",
};

const bloquePrincipal = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "22px",
  marginBottom: "18px",
  boxShadow: "0 7px 16px rgba(22,58,95,0.06)",
};

const cabeceraBloque = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const tituloBloque = {
  margin: "5px 0 0",
  color: "#173f68",
  fontSize: "22px",
};

const proximamente = {
  background: "#edf3f5",
  color: "#73858f",
  borderRadius: "999px",
  padding: "5px 10px",
  fontSize: "12px",
  fontWeight: "700",
};

const mensajeActual = {
  background: "#f7fbfc",
  border: "1px dashed #bfd5dc",
  borderRadius: "14px",
  padding: "18px",
};

const textoMensaje = {
  margin: "0 0 14px",
  color: "#405c70",
  lineHeight: 1.6,
};

const textoVacio = {
  margin: "0 0 14px",
  color: "#778993",
  fontStyle: "italic",
};

const accionesMensaje = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const botonDeshabilitado = {
  border: "none",
  borderRadius: "999px",
  padding: "9px 13px",
  background: "#e5ecef",
  color: "#7b8b94",
  fontWeight: "700",
  cursor: "not-allowed",
};

const botonDeshabilitadoPequeno = {
  border: "none",
  borderRadius: "999px",
  padding: "9px 14px",
  background: "#e5ecef",
  color: "#7b8b94",
  fontWeight: "700",
  cursor: "not-allowed",
};

const listaUnidades = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const unidadTarjeta = {
  padding: "14px",
  border: "1px solid #d5e2e6",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const descripcionUnidad = {
  color: "#667a87",
  lineHeight: 1.5,
};

const estadoVacio = {
  background: "#f7fbfc",
  border: "1px dashed #bfd5dc",
  borderRadius: "14px",
  padding: "22px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  textAlign: "center",
  color: "#607784",
};

const iconoVacio = {
  fontSize: "30px",
};

const grillaHerramientas = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "18px",
};

const tarjetaHerramienta = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 7px 16px rgba(22,58,95,0.06)",
};

const iconoHerramienta = {
  fontSize: "30px",
  marginBottom: "10px",
};

const tituloHerramienta = {
  margin: "0 0 8px",
  color: "#173f68",
};

const textoHerramienta = {
  color: "#5f6f7a",
  lineHeight: 1.5,
  minHeight: "88px",
};

const publicacion = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "center",
  flexWrap: "wrap",
  background: "#ffffff",
  border: "2px solid #d6dfe2",
  borderRadius: "18px",
  padding: "20px",
};

const tituloPublicacion = {
  margin: "5px 0",
  color: "#173f68",
};

const textoPublicacion = {
  margin: 0,
  color: "#667984",
};

const botonPublicarDeshabilitado = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 18px",
  background: "#e5ecef",
  color: "#7b8b94",
  fontWeight: "800",
  cursor: "not-allowed",
};

const estadoCarga = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  padding: "28px",
  textAlign: "center",
  color: "#31556c",
  fontWeight: "700",
};

const mensajeError = {
  padding: "16px",
  background: "#fff4f4",
  color: "#a52a2a",
  border: "1px solid #efb6b6",
  borderRadius: "14px",
  fontWeight: "700",
};
const campoMensaje = {
  width: "100%",
  minHeight: "130px",
  boxSizing: "border-box",
  resize: "vertical",
  border: "1px solid #b9d6df",
  borderRadius: "14px",
  padding: "14px 16px",
  fontFamily: "Arial, sans-serif",
  fontSize: "15px",
  lineHeight: 1.6,
  color: "#173f68",
  background: "#ffffff",
  outlineColor: "#0f766e",
};

const contadorMensaje = {
  marginTop: "6px",
  textAlign: "right",
  color: "#7b8b94",
  fontSize: "12px",
};

const errorMensajeEstilo = {
  marginTop: "10px",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "#fff1f1",
  border: "1px solid #f1b5b5",
  color: "#b42318",
  fontWeight: "700",
  fontSize: "14px",
};

const botonEscribirMensaje = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};

const botonGuardarMensaje = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 18px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};

const botonCancelarMensaje = {
  border: "1px solid #c9dce3",
  borderRadius: "999px",
  padding: "10px 18px",
  background: "#ffffff",
  color: "#536575",
  fontWeight: "700",
  cursor: "pointer",
};

const mensajePublicado = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "14px",
  padding: "16px 18px",
  marginBottom: "14px",
};

const etiquetaMensaje = {
  color: "#5f7280",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "0.8px",
  marginBottom: "8px",
};
const botonCrearUnidad = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};

const formularioUnidad = {
  background: "#f7fbfc",
  border: "1px solid #bfd5dc",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "18px",
};

const encabezadoFormularioUnidad = {
  marginBottom: "16px",
};

const tituloFormularioUnidad = {
  margin: "5px 0 0",
  color: "#173f68",
  fontSize: "19px",
};

const grupoCampo = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  marginBottom: "15px",
};

const labelCampo = {
  color: "#536575",
  fontSize: "13px",
  fontWeight: "700",
};

const inputUnidad = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #b9d6df",
  borderRadius: "12px",
  padding: "11px 13px",
  fontFamily: "Arial, sans-serif",
  fontSize: "15px",
  color: "#173f68",
  background: "#ffffff",
  outlineColor: "#0f766e",
};

const textareaUnidad = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "100px",
  resize: "vertical",
  border: "1px solid #b9d6df",
  borderRadius: "12px",
  padding: "12px 13px",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  lineHeight: 1.5,
  color: "#173f68",
  background: "#ffffff",
  outlineColor: "#0f766e",
};

const accionesUnidad = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const botonGuardarUnidad = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 18px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(15,118,110,0.18)",
};

const botonCancelarUnidad = {
  border: "1px solid #c9dce3",
  borderRadius: "999px",
  padding: "10px 18px",
  background: "#ffffff",
  color: "#536575",
  fontWeight: "700",
  cursor: "pointer",
};

const errorUnidadEstilo = {
  marginBottom: "14px",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "#fff1f1",
  border: "1px solid #f1b5b5",
  color: "#b42318",
  fontWeight: "700",
};

const cabeceraUnidadCreada = {
  display: "flex",
  alignItems: "flex-start",
  gap: "13px",
};

const numeroUnidad = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  background: "#e8f4f1",
  color: "#0f766e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  flexShrink: 0,
};

const tituloUnidadCreada = {
  color: "#173f68",
  fontSize: "17px",
};

const herramientasUnidad = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "14px",
  paddingTop: "12px",
  borderTop: "1px solid #edf2f4",
};

const miniHerramienta = {
  background: "#edf3f5",
  color: "#637782",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};
