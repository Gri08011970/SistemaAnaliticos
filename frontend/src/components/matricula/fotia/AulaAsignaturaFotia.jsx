import { useEffect, useState } from "react";

export default function AulaAsignaturaFotia({ inscripcion, volver }) {
  const [aula, setAula] = useState(null);
  const [cargandoAula, setCargandoAula] = useState(true);
  const [errorAula, setErrorAula] = useState("");
  const asignatura = inscripcion?.asignatura || "Asignatura";

  const docente = inscripcion?.docenteId
    ? `${inscripcion.docenteId.apellido || ""} ${
        inscripcion.docenteId.nombre || ""
      }`.trim()
    : "Sin docente asignado";

  const nombrePeriodo = inscripcion?.periodoId?.nombre || "";

  const cicloPeriodo = String(inscripcion?.periodoId?.cicloLectivo || "");

  const periodo = inscripcion?.periodoId
    ? cicloPeriodo && nombrePeriodo.includes(cicloPeriodo)
      ? nombrePeriodo
      : cicloPeriodo
        ? `${nombrePeriodo} - ${cicloPeriodo}`.trim()
        : nombrePeriodo || "Sin período informado"
    : "Sin período informado";

  useEffect(() => {
    async function cargarAulaPublicada() {
      try {
        setCargandoAula(true);
        setErrorAula("");

        const token = localStorage.getItem("tokenUsuario");

        const respuesta = await fetch(
          `/api/fotia/mi-espacio/aulas/${inscripcion._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || "No se pudo cargar el aula de esta asignatura.",
          );
        }

        const aulaRecibida = datos.contenido || datos;

        console.log("AULA PUBLICADA DEL ESTUDIANTE:", aulaRecibida);

        setAula(aulaRecibida);
      } catch (error) {
        console.error("Error al cargar aula del estudiante:", error);

        setErrorAula(error.message || "No se pudo cargar el aula.");

        setAula(null);
      } finally {
        setCargandoAula(false);
      }
    }

    if (inscripcion?._id) {
      cargarAulaPublicada();
    }
  }, [inscripcion?._id]);

  function obtenerMiniaturaVideo(url = "") {
    try {
      const urlVideo = String(url || "");

      if (urlVideo.includes("youtube.com/watch")) {
        const urlObj = new URL(urlVideo);
        const videoId = urlObj.searchParams.get("v");

        return videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : null;
      }

      if (urlVideo.includes("youtu.be/")) {
        const videoId = urlVideo
          .split("youtu.be/")[1]
          ?.split("?")[0]
          ?.split("&")[0];

        return videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : null;
      }

      return null;
    } catch {
      return null;
    }
  }

  if (cargandoAula) {
    return (
      <div style={pagina}>
        <div style={contenedor}>
          <button type="button" onClick={volver} style={botonVolver}>
            ← Volver a Mis asignaturas
          </button>

          <div style={estadoAulaInformativo}>⏳ Cargando aula...</div>
        </div>
      </div>
    );
  }

  if (errorAula || !aula) {
    return (
      <div style={pagina}>
        <div style={contenedor}>
          <button type="button" onClick={volver} style={botonVolver}>
            ← Volver a Mis asignaturas
          </button>

          <section style={aulaNoDisponible}>
            <div style={iconoAulaNoDisponible}>📚</div>

            <h2 style={tituloAulaNoDisponible}>Aula todavía no disponible</h2>

            <p style={textoAulaNoDisponible}>
              El contenido de esta asignatura todavía no fue publicado por tu
              docente.
            </p>

            <button
              type="button"
              onClick={volver}
              style={botonRecursoEstudiante}
            >
              Volver a Mis asignaturas
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <button type="button" onClick={volver} style={botonVolver}>
          ← Volver a Mis asignaturas
        </button>

        <section style={encabezado}>
          <div style={iconoPrincipal}>📘</div>

          <div>
            <div style={etiqueta}>ESPACIO DE FORTALECIMIENTO</div>

            <h1 style={titulo}>{asignatura}</h1>

            <p style={subtitulo}>
              Tu espacio de acompañamiento, materiales y actividades.
            </p>
          </div>
        </section>

        <section style={resumen}>
          <div style={dato}>
            <span style={etiquetaDato}>📋 Docente</span>

            <strong style={valorDato}>{docente}</strong>
          </div>

          <div style={dato}>
            <span style={etiquetaDato}>📅 Período</span>

            <strong style={valorDato}>{periodo}</strong>
          </div>

          <div style={dato}>
            <span style={etiquetaDato}>📌 Estado</span>

            <strong style={estado}>
              {inscripcion?.estado || "Incorporada"}
            </strong>
          </div>
        </section>
        {aula && (
          <div
            style={{
              marginTop: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            {/* MENSAJE DEL DOCENTE */}
            {aula.mensajeDocente?.texto && (
              <section
                style={{
                  background: "#ffffff",
                  border: "1px solid #cfe3ea",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    color: "#607d8b",
                    marginBottom: "10px",
                  }}
                >
                  💬 MENSAJE DEL DOCENTE
                </div>

                <div
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.6",
                    color: "#173f68",
                  }}
                >
                  {aula.mensajeDocente.texto}
                </div>
              </section>
            )}

            {/* UNIDADES PUBLICADAS */}
            {aula.unidades?.map((unidad, indiceUnidad) => (
              <section
                key={unidad._id || indiceUnidad}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cfe3ea",
                  borderRadius: "18px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    marginBottom: "22px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "#e8f5f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      color: "#087f72",
                      flexShrink: 0,
                    }}
                  >
                    {indiceUnidad + 1}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        letterSpacing: "1px",
                        color: "#607d8b",
                        marginBottom: "5px",
                      }}
                    >
                      UNIDAD
                    </div>

                    <h2
                      style={{
                        margin: "0 0 6px",
                        color: "#063b70",
                        fontSize: "21px",
                      }}
                    >
                      {unidad.titulo}
                    </h2>

                    {unidad.descripcion && (
                      <p
                        style={{
                          margin: 0,
                          color: "#607d8b",
                          lineHeight: "1.5",
                        }}
                      >
                        {unidad.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* RECURSOS DE LA UNIDAD */}
                {unidad.recursos?.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                         "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                      gap: "16px",
                    }}
                  >
                    {unidad.recursos.map((recurso, indiceRecurso) => (
                      <article
                        key={recurso._id || indiceRecurso}
                        style={{
                          border: "1px solid #cfe3ea",
                          borderRadius: "14px",
                          padding: "18px",
                          background: "#ffffff",
                          minWidth: 0,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "1px",
                            color: "#607d8b",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {recurso.tipo || "Material"}
                        </div>

                        <h3
                          style={{
                            margin: "0 0 8px",
                            color: "#063b70",
                            fontSize: "17px",
                            overflowWrap: "anywhere",

                          }}
                        >
                          {recurso.titulo}
                        </h3>

                        {recurso.descripcion && (
                          <p
                            style={{
                              color: "#607d8b",
                              lineHeight: "1.5",
                              margin: "0 0 14px",
                            }}
                          >
                            {recurso.descripcion}
                          </p>
                        )}

                        {/* IMAGEN */}
                        {recurso.tipo === "imagen" && recurso.url && (
                          <>
                            <img
                              src={recurso.url}
                              alt={recurso.titulo}
                              style={{
                                width: "100%",
                                maxHeight: "230px",
                                objectFit: "contain",
                                borderRadius: "12px",
                                background: "#f6fafb",
                                marginBottom: "12px",
                              }}
                            />

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const ventana = window.open("", "_blank");

                                  if (!ventana) return;

                                  ventana.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>${recurso.titulo}</title>

                <style>
                  body {
                    margin: 0;
                    padding: 24px;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    background: #ffffff;
                  }

                  img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                  }
                </style>
              </head>

              <body>
                <h2>${recurso.titulo}</h2>

                <img
                  src="${recurso.url}"
                  alt="${recurso.titulo}"
                />
              </body>
            </html>
          `);

                                  ventana.document.close();
                                }}
                                style={botonRecursoEstudiante}
                              >
                                🖼️ Ver imagen
                              </button>

                              <a
                                href={recurso.url}
                                download={
                                  recurso.nombreArchivo || recurso.titulo
                                }
                                style={botonSecundarioEstudiante}
                              >
                                ⬇️ Descargar
                              </a>

                              {recurso.imprimible && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ventana = window.open("", "_blank");

                                    if (!ventana) return;

                                    ventana.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <title>${recurso.titulo}</title>

                  <style>
                    body {
                      margin: 0;
                      padding: 20px;
                      text-align: center;
                    }

                    img {
                      max-width: 100%;
                      max-height: 95vh;
                      object-fit: contain;
                    }

                    @media print {
                      body {
                        padding: 0;
                      }
                    }
                  </style>
                </head>

                <body>
                  <img
                    src="${recurso.url}"
                    alt="${recurso.titulo}"
                    onload="
                      setTimeout(() => {
                        window.print();
                      }, 300);
                    "
                  />
                </body>
              </html>
            `);

                                    ventana.document.close();
                                  }}
                                  style={botonSecundarioEstudiante}
                                >
                                  🖨️ Imprimir
                                </button>
                              )}
                            </div>
                          </>
                        )}

                        {/* AUDIO */}
                        {recurso.tipo === "audio" && recurso.url && (
                          <>
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "12px",
                                borderRadius: "12px",
                                background: "#f6fafb",
                              }}
                            >
                              <audio
                                controls
                                src={recurso.url}
                                style={{ width: "100%" }}
                              >
                                Tu navegador no puede reproducir este audio.
                              </audio>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                marginTop: "10px",
                              }}
                            >
                              <a
                                href={recurso.url}
                                download={
                                  recurso.nombreArchivo || recurso.titulo
                                }
                                style={botonSecundarioEstudiante}
                              >
                                ⬇️ Descargar audio
                              </a>
                            </div>
                          </>
                        )}
                        {/* VIDEO SUBIDO */}
                        {recurso.tipo === "video" &&
                          recurso.url &&
                          recurso.url.startsWith("/uploads/") && (
                            <video
                              controls
                              src={recurso.url}
                              style={{
                                width: "100%",
                                borderRadius: "12px",
                                marginBottom: "10px",
                                background: "#000000",
                              }}
                            >
                              Tu navegador no puede reproducir este video.
                            </video>
                          )}

                        {/* VIDEO EXTERNO / YOUTUBE */}
                        {recurso.tipo === "video" &&
                          recurso.url &&
                          !recurso.url.startsWith("/uploads/") && (
                            <>
                              {obtenerMiniaturaVideo(recurso.url) && (
                                <a
                                  href={recurso.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "block",
                                    position: "relative",
                                    marginBottom: "12px",
                                    textDecoration: "none",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      overflow: "hidden",
                                      borderRadius: "12px",
                                      background: "#000000",
                                    }}
                                  >
                                    <img
                                      src={obtenerMiniaturaVideo(recurso.url)}
                                      alt={recurso.titulo}
                                      style={{
                                        width: "100%",
                                        display: "block",
                                        aspectRatio: "16 / 9",
                                        objectFit: "cover",
                                      }}
                                    />

                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "52px",
                                          height: "52px",
                                          borderRadius: "50%",
                                          background: "rgba(0, 0, 0, 0.65)",
                                          color: "#ffffff",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "22px",
                                          paddingLeft: "3px",
                                        }}
                                      >
                                        ▶
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              )}

                              <a
                                href={recurso.url}
                                target="_blank"
                                rel="noreferrer"
                                style={botonRecursoEstudiante}
                              >
                                ▶ Ver video
                              </a>
                            </>
                          )}

                        {/* ENLACE WEB */}
                        {recurso.tipo === "enlace" && recurso.url && (
                          <div
                            style={{
                              padding: "16px",
                              borderRadius: "12px",
                              background: "#f5f9ff",
                              border: "1px solid #d5e4f0",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "34px",
                                marginBottom: "8px",
                              }}
                            >
                              🌐
                            </div>

                            <div
                              style={{
                                color: "#1758c7",
                                fontWeight: "800",
                                marginBottom: "5px",
                                wordBreak: "break-word",
                              }}
                            >
                              {(() => {
                                try {
                                  return new URL(recurso.url).hostname.replace(
                                    "www.",
                                    "",
                                  );
                                } catch {
                                  return "Sitio externo";
                                }
                              })()}
                            </div>

                            <div
                              style={{
                                color: "#7a8a95",
                                fontSize: "12px",
                                marginBottom: "12px",
                              }}
                            >
                              Sitio externo
                            </div>

                            <a
                              href={recurso.url}
                              target="_blank"
                              rel="noreferrer"
                              style={botonRecursoEstudiante}
                            >
                              ↗ Visitar recurso
                            </a>
                          </div>
                        )}

                        {/* PDF */}
                        {recurso.tipo === "pdf" && recurso.url && (
                          <>
                            <div
                              style={{
                                width: "100%",
                                height: "230px",
                                borderRadius: "12px",
                                overflow: "hidden",
                                background: "#f6fafb",
                                border: "1px solid #d9e5ea",
                                marginBottom: "12px",
                              }}
                            >
                              <iframe
                                src={recurso.url}
                                title={recurso.titulo}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <a
                                href={recurso.url}
                                target="_blank"
                                rel="noreferrer"
                                style={botonRecursoEstudiante}
                              >
                                📄 Abrir PDF
                              </a>

                              <a
                                href={recurso.url}
                                download={
                                  recurso.nombreArchivo || recurso.titulo
                                }
                                style={botonSecundarioEstudiante}
                              >
                                ⬇️ Descargar
                              </a>

                              {recurso.imprimible && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ventana = window.open("", "_blank");

                                    if (!ventana) {
                                      window.alert(
                                        "El navegador bloqueó la ventana de impresión. Habilitá las ventanas emergentes e intentá nuevamente.",
                                      );
                                      return;
                                    }

                                    ventana.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>${recurso.titulo}</title>
            <style>
              html, body {
                margin: 0;
                width: 100%;
                height: 100%;
              }

              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>

          <body>
            <iframe
              src="${recurso.url}"
              onload="
                setTimeout(() => {
                  window.print();
                }, 500);
              "
            ></iframe>
          </body>
        </html>
      `);

                                    ventana.document.close();
                                  }}
                                  style={botonSecundarioEstudiante}
                                >
                                  🖨️ Imprimir
                                </button>
                              )}
                            </div>
                          </>
                        )}

                        {/* ARCHIVO */}
                        {recurso.tipo === "archivo" && recurso.url && (
                          <>
                            <div
                              style={{
                                padding: "18px",
                                borderRadius: "12px",
                                background: "#f6fafb",
                                border: "1px solid #d9e5ea",
                                textAlign: "center",
                                marginBottom: "12px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "38px",
                                  marginBottom: "8px",
                                }}
                              >
                                📎
                              </div>

                              <div 
                                style={{
                                  color: "#173f68",
                                  fontWeight: "800",
                                  marginBottom: "4px",
                                  wordBreak: "break-word",
                                }}
                              >
                                {recurso.nombreArchivo || recurso.titulo}
                              </div>

                              <div
                                style={{
                                  color: "#7a8a95",
                                  fontSize: "12px",
                                }}
                              >
                                Archivo descargable
                              </div>
                            </div>

                            <a
                              href={recurso.url}
                              download={recurso.nombreArchivo || recurso.titulo}
                              style={botonRecursoEstudiante}
                            >
                              ⬇️ Descargar archivo
                            </a>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "18px",
                      background: "#f6fafb",
                      borderRadius: "12px",
                      color: "#607d8b",
                      textAlign: "center",
                    }}
                  >
                    Esta unidad todavía no tiene materiales disponibles.
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
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
  maxWidth: "1050px",
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

const encabezado = {
  display: "flex",
  gap: "18px",
  alignItems: "center",
  background: "#ffffff",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 10px 24px rgba(22,58,95,0.08)",
  marginBottom: "20px",
};

const iconoPrincipal = {
  width: "70px",
  height: "70px",
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

const resumen = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginBottom: "22px",
};

const dato = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const etiquetaDato = {
  fontSize: "12px",
  color: "#6b7f8b",
  fontWeight: "700",
};

const valorDato = {
  color: "#304d63",
};

const estado = {
  width: "fit-content",
  background: "#eaf7ef",
  color: "#286440",
  borderRadius: "999px",
  padding: "4px 9px",
  fontSize: "12px",
};

const botonRecursoEstudiante = {
  display: "inline-block",
  border: "none",
  textDecoration: "none",
  background: "#078578",
  color: "#ffffff",
  padding: "9px 14px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
};
const botonSecundarioEstudiante = {
  display: "inline-block",
  border: "1px solid #bfd5dc",
  textDecoration: "none",
  background: "#ffffff",
  color: "#31556c",
  padding: "9px 14px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
};
const estadoAulaInformativo = {
  background: "#ffffff",
  border: "1px solid #c9dce3",
  borderRadius: "16px",
  padding: "24px",
  textAlign: "center",
  color: "#607d8b",
  fontWeight: "700",
};

const aulaNoDisponible = {
  background: "#ffffff",
  border: "2px solid #c9dce3",
  borderRadius: "20px",
  padding: "36px 24px",
  textAlign: "center",
  maxWidth: "650px",
  margin: "40px auto 0",
};

const iconoAulaNoDisponible = {
  fontSize: "44px",
  marginBottom: "12px",
};

const tituloAulaNoDisponible = {
  margin: "0 0 10px",
  color: "#173f68",
  fontSize: "24px",
};

const textoAulaNoDisponible = {
  margin: "0 auto 20px",
  maxWidth: "480px",
  color: "#607d8b",
  lineHeight: 1.6,
};
