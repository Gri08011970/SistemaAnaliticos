function nombreDocente(docente) {
  if (!docente) return "Sin docente asignado";

  return (
    [docente.apellido, docente.nombre]
      .filter(Boolean)
      .join(" ")
      .trim() || "Sin docente asignado"
  );
}

function nombrePeriodo(periodo) {
  if (!periodo) return "Sin período";

  const nombre = periodo.nombre || "";
  const ciclo = String(periodo.cicloLectivo || "");

  if (ciclo && nombre.includes(ciclo)) return nombre;

  return ciclo ? `${nombre} ${ciclo}`.trim() : nombre || "Sin período";
}

function youtubeEmbed(url = "") {
  try {
    const direccion = new URL(url);

    if (direccion.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${direccion.pathname.replace("/", "")}`;
    }

    const id = direccion.searchParams.get("v");

    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return "";
  }

  return "";
}

export default function AulaConsultaFotia({ aula, volver }) {
  const unidades =
    aula?.unidades?.filter((unidad) => unidad.activo !== false) || [];

  return (
    <div style={pagina}>
      <div style={contenedor}>
        <button type="button" onClick={volver} style={botonVolver}>
          ← Volver a aulas publicadas
        </button>

        <section style={encabezado}>
          <div style={iconoPrincipal}>📘</div>

          <div style={{ flex: 1 }}>
            <div style={etiqueta}>CONSULTA INSTITUCIONAL · SOLO LECTURA</div>

            <h1 style={titulo}>
              {aula?.asignatura || "-AULA ASIGNADA FOTIA-FORTE"}
            </h1>

            <p style={subtitulo}>
              {aula?.curso || "Sin curso"}
              {" · "}
              {nombrePeriodo(aula?.periodoId)}
              {" · "}
              {nombreDocente(aula?.docenteId)}
            </p>
          </div>

          <span style={publicada}>🟢 Publicada</span>
        </section>

        {aula?.mensajeDocente?.texto && (
          <section style={bloque}>
            <div style={etiqueta}>COMUNICACIÓN</div>

            <h2 style={tituloBloque}>💬 Mensaje del docente</h2>

            <p style={mensaje}>
              {aula.mensajeDocente.texto}
            </p>

            {aula.mensajeDocente.audioUrl && (
              <audio
                controls
                src={aula.mensajeDocente.audioUrl}
                style={{ width: "100%", marginTop: "12px" }}
              >
                Tu navegador no puede reproducir este audio.
              </audio>
            )}
          </section>
        )}

        <section style={bloque}>
          <div style={etiqueta}>CONTENIDOS PUBLICADOS</div>

          <h2 style={tituloBloque}>📚 Unidades y materiales</h2>

          {unidades.length === 0 ? (
            <div style={vacio}>
              Esta aula todavía no tiene unidades publicadas.
            </div>
          ) : (
            <div style={listaUnidades}>
              {unidades.map((unidad, indiceUnidad) => {
                const recursos =
                  unidad.recursos?.filter(
                    (recurso) => recurso.activo !== false,
                  ) || [];

                return (
                  <article
                    key={unidad._id || indiceUnidad}
                    style={unidadEstilo}
                  >
                    <div style={numeroUnidad}>
                      Unidad {indiceUnidad + 1}
                    </div>

                    <h3 style={tituloUnidad}>
                      {unidad.titulo || "Unidad"}
                    </h3>

                    {unidad.descripcion && (
                      <p style={descripcionUnidad}>
                        {unidad.descripcion}
                      </p>
                    )}

                    {recursos.length === 0 ? (
                      <div style={vacioRecursos}>
                        Sin materiales visibles.
                      </div>
                    ) : (
                      <div style={grillaRecursos}>
                        {recursos.map((recurso, indiceRecurso) => (
                          <article
                            key={recurso._id || indiceRecurso}
                            style={recursoEstilo}
                          >
                            <div style={tipoRecurso}>
                              {recurso.tipo || "material"}
                            </div>

                            <h4 style={tituloRecurso}>
                              {recurso.titulo || "Material"}
                            </h4>

                            {recurso.descripcion && (
                              <p style={descripcionRecurso}>
                                {recurso.descripcion}
                              </p>
                            )}

                            <VistaRecurso recurso={recurso} />
                          </article>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function VistaRecurso({ recurso }) {
  if (!recurso?.url && recurso?.tipo !== "texto") {
    return null;
  }

  if (recurso.tipo === "imagen") {
  const abrirImagen = () => {
    if (!recurso.url) return;

    if (recurso.url.startsWith("data:")) {
      fetch(recurso.url)
        .then((respuesta) => respuesta.blob())
        .then((blob) => {
          const urlBlob = URL.createObjectURL(blob);
          window.open(urlBlob, "_blank");
        })
        .catch((error) => {
          console.error("Error al abrir imagen:", error);
        });

      return;
    }

    window.open(recurso.url, "_blank");
  };

  const imprimirImagen = () => {
    if (!recurso.url) return;

    const abrirParaImprimir = (urlImagen) => {
      const ventana = window.open("", "_blank");

      if (!ventana) return;

      ventana.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${recurso.titulo || "Imagen"}</title>

            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                background: white;
              }

              img {
                max-width: 100%;
                height: auto;
                object-fit: contain;
              }

              @media print {
                body {
                  padding: 0;
                }

                img {
                  max-width: 100%;
                  max-height: 100vh;
                }
              }
            </style>
          </head>

          <body>
            <img src="${urlImagen}" />
          </body>
        </html>
      `);

      ventana.document.close();

      ventana.onload = () => {
        ventana.focus();
        ventana.print();
      };
    };

    if (recurso.url.startsWith("data:")) {
      fetch(recurso.url)
        .then((respuesta) => respuesta.blob())
        .then((blob) => {
          const urlBlob = URL.createObjectURL(blob);
          abrirParaImprimir(urlBlob);
        })
        .catch((error) => {
          console.error("Error al imprimir imagen:", error);
        });

      return;
    }

    abrirParaImprimir(recurso.url);
  };

  return (
    <>
      <img
        src={recurso.url}
        alt={recurso.titulo || "Material"}
        style={imagen}
      />

      <div style={acciones}>
        <button
          type="button"
          onClick={abrirImagen}
          style={botonAbrirRecurso}
        >
          🖼 Ver imagen
        </button>

        <a
          href={recurso.url}
          download={
            recurso.nombreArchivo ||
            recurso.titulo ||
            "imagen"
          }
          style={enlaceSecundario}
        >
          ⬇️ Descargar
        </a>

        {recurso.imprimible && (
          <button
            type="button"
            onClick={imprimirImagen}
            style={botonImprimir}
          >
            🖨️ Imprimir
          </button>
        )}
      </div>
    </>
  );
}

  if (recurso.tipo === "audio") {
    return (
      <audio controls src={recurso.url} style={{ width: "100%" }}>
        Tu navegador no puede reproducir este audio.
      </audio>
    );
  }

  if (recurso.tipo === "video") {
    const embed = youtubeEmbed(recurso.url);

    if (embed) {
      return (
        <iframe
          src={embed}
          title={recurso.titulo || "Video"}
          allowFullScreen
          style={video}
        />
      );
    }

    return (
      <a
        href={recurso.url}
        target="_blank"
        rel="noreferrer"
        style={enlace}
      >
        🎥 Abrir video
      </a>
    );
  }

   if (recurso.tipo === "pdf") {
  const obtenerUrlPdf = async () => {
    if (!recurso.url) return "";

    // PDF guardado como data:base64
    if (recurso.url.startsWith("data:")) {
      const respuesta = await fetch(recurso.url);
      const blob = await respuesta.blob();

      return URL.createObjectURL(blob);
    }

    // PDF normal: /uploads/... o URL externa
    return recurso.url;
  };

  const abrirPdf = async () => {
    try {
      const urlPdf = await obtenerUrlPdf();

      if (!urlPdf) return;

      window.open(urlPdf, "_blank");
    } catch (error) {
      console.error(
        "Error al abrir PDF:",
        error,
      );
    }
  };

  const imprimirPdf = async () => {
    try {
      const urlPdf = await obtenerUrlPdf();

      if (!urlPdf) return;

      const ventana = window.open(
        urlPdf,
        "_blank",
      );

      if (!ventana) return;

      // Le damos tiempo al visor de PDF del navegador
      // para cargar el documento.
      setTimeout(() => {
        try {
          ventana.focus();
          ventana.print();
        } catch (error) {
          console.error(
            "No se pudo iniciar la impresión:",
            error,
          );
        }
      }, 1200);
    } catch (error) {
      console.error(
        "Error al imprimir PDF:",
        error,
      );
    }
  };

  return (
    <>
      <iframe
        src={recurso.url}
        title={recurso.titulo || "PDF"}
        style={pdf}
      />

      <div style={acciones}>
        <button
          type="button"
          onClick={abrirPdf}
          style={botonAbrirRecurso}
        >
          📄 Abrir PDF
        </button>

        <a
          href={recurso.url}
          download={
            recurso.nombreArchivo ||
            recurso.titulo ||
            "documento.pdf"
          }
          style={enlaceSecundario}
        >
          ⬇️ Descargar
        </a>

        {recurso.imprimible && (
          <button
            type="button"
            onClick={imprimirPdf}
            style={botonImprimir}
          >
            🖨️ Imprimir
          </button>
        )}
      </div>
    </>
  );
}
  if (recurso.tipo === "texto") {
    return (
      <div style={textoMaterial}>
        {recurso.descripcion || recurso.titulo}
      </div>
    );
  }

  return (
    <div style={acciones}>
      <a
        href={recurso.url}
        target="_blank"
        rel="noreferrer"
        style={enlace}
      >
        🔗 Abrir recurso
      </a>

      {recurso.tipo === "archivo" && (
        <a
          href={recurso.url}
          download={recurso.nombreArchivo || recurso.titulo}
          style={enlaceSecundario}
        >
          ⬇️ Descargar
        </a>
      )}
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
  maxWidth: "1100px",
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
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  padding: "22px",
  border: "2px solid #b9d6df",
  borderRadius: "20px",
  background: "#ffffff",
  boxShadow: "0 10px 24px rgba(22,58,95,0.08)",
  marginBottom: "22px",
};

const iconoPrincipal = {
  width: "58px",
  height: "58px",
  borderRadius: "16px",
  background: "#e8f4f1",
  display: "grid",
  placeItems: "center",
  fontSize: "30px",
};

const etiqueta = {
  color: "#607784",
  fontSize: "11px",
  fontWeight: "900",
  letterSpacing: "1px",
};

const titulo = {
  margin: "5px 0",
  color: "#173f68",
  fontSize: "30px",
};

const subtitulo = {
  margin: 0,
  color: "#5f6f7a",
  lineHeight: 1.5,
};

const publicada = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#eaf8f4",
  border: "1px solid #9fd5c8",
  color: "#176b61",
  fontWeight: "800",
};

const bloque = {
  marginBottom: "22px",
  padding: "22px",
  border: "1px solid #c9dce3",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 7px 16px rgba(22,58,95,0.06)",
};

const tituloBloque = {
  margin: "6px 0 14px",
  color: "#173f68",
  fontSize: "23px",
};

const mensaje = {
  margin: 0,
  padding: "14px",
  borderRadius: "12px",
  background: "#f7fbfc",
  color: "#435e71",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
};

const listaUnidades = {
  display: "grid",
  gap: "18px",
};

const unidadEstilo = {
  padding: "18px",
  border: "1px solid #bdd5e3",
  borderRadius: "15px",
  background: "#fbfdfe",
};

const numeroUnidad = {
  color: "#6b7f92",
  fontSize: "11px",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: ".8px",
};

const tituloUnidad = {
  margin: "5px 0 6px",
  color: "#173f68",
  fontSize: "21px",
};

const descripcionUnidad = {
  margin: "0 0 14px",
  color: "#607080",
  lineHeight: 1.5,
};

const grillaRecursos = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "14px",
};

const recursoEstilo = {
  padding: "15px",
  border: "1px solid #d4e2e9",
  borderRadius: "13px",
  background: "#ffffff",
};

const tipoRecurso = {
  color: "#6b7f92",
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: ".8px",
};

const tituloRecurso = {
  margin: "5px 0 7px",
  color: "#173f68",
  fontSize: "16px",
};

const descripcionRecurso = {
  margin: "0 0 12px",
  color: "#607080",
  lineHeight: 1.5,
  fontSize: "14px",
};

const imagen = {
  width: "100%",
  maxHeight: "240px",
  objectFit: "contain",
  borderRadius: "12px",
  background: "#f6fafb",
};

const video = {
  width: "100%",
  aspectRatio: "16 / 9",
  border: "none",
  borderRadius: "12px",
};

const pdf = {
  width: "100%",
  height: "230px",
  border: "1px solid #d9e5ea",
  borderRadius: "12px",
};

const acciones = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const enlace = {
  display: "inline-block",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "13px",
};

const enlaceSecundario = {
  display: "inline-block",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#eef5f7",
  color: "#315f6f",
  fontWeight: "700",
  fontSize: "13px",
};

const textoMaterial = {
  padding: "12px",
  borderRadius: "10px",
  background: "#f7fbfc",
  color: "#435e71",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
};

const vacio = {
  padding: "22px",
  border: "1px dashed #bdd2dc",
  borderRadius: "13px",
  color: "#607080",
  textAlign: "center",
};

const vacioRecursos = {
  padding: "12px",
  borderRadius: "10px",
  background: "#f4f7f9",
  color: "#7a8994",
  fontSize: "13px",
}; 
const botonImprimir = {
  padding: "8px 12px",
  border: "1px solid #bfd4df",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#315f6f",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
}; 
const botonAbrirRecurso = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "999px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
};