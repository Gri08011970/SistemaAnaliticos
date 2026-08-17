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
  const [unidadEditandoId, setUnidadEditandoId] = useState(null);
  const [tituloUnidadEditando, setTituloUnidadEditando] = useState("");
  const [descripcionUnidadEditando, setDescripcionUnidadEditando] =
    useState("");
  const [guardandoEdicionUnidad, setGuardandoEdicionUnidad] = useState(false);
  const [errorEdicionUnidad, setErrorEdicionUnidad] = useState("");
  const [unidadMaterialId, setUnidadMaterialId] = useState(null);
  const [tipoMaterial, setTipoMaterial] = useState("enlace");
  const [tituloMaterial, setTituloMaterial] = useState("");
  const [descripcionMaterial, setDescripcionMaterial] = useState("");
  const [urlMaterial, setUrlMaterial] = useState("");
  const [materialImprimible, setMaterialImprimible] = useState(false);
  const [guardandoMaterial, setGuardandoMaterial] = useState(false);
  const [errorMaterial, setErrorMaterial] = useState("");
  const [materialEditandoId, setMaterialEditandoId] = useState(null);
  const [tipoMaterialEditando, setTipoMaterialEditando] = useState("enlace");
  const [tituloMaterialEditando, setTituloMaterialEditando] = useState("");
  const [descripcionMaterialEditando, setDescripcionMaterialEditando] =
    useState("");
  const [urlMaterialEditando, setUrlMaterialEditando] = useState("");
  const [modoRecurso, setModoRecurso] = useState("material");
  const [imprimibleMaterialEditando, setImprimibleMaterialEditando] =
    useState(false);
  const [guardandoEdicionMaterial, setGuardandoEdicionMaterial] =
    useState(false);
  const [errorEdicionMaterial, setErrorEdicionMaterial] = useState("");
  const [origenMaterial, setOrigenMaterial] = useState("url");
  const [archivoMaterial, setArchivoMaterial] = useState(null);
  const [nombreArchivoMaterial, setNombreArchivoMaterial] = useState("");
  const [cambiandoPublicacion, setCambiandoPublicacion] = useState(false);
  const [errorPublicacion, setErrorPublicacion] = useState("");

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

        console.log("CONTENIDO COMPLETO DEL AULA:", contenidoRecibido);

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
        throw new Error(datos.mensaje || "No se pudo guardar el mensaje.");
      }

      const contenidoActualizado = datos.contenido || datos;

      setContenido((contenidoAnterior) => ({
        ...contenidoAnterior,
        ...contenidoActualizado,
        mensajeDocente: contenidoActualizado?.mensajeDocente || {
          ...contenidoAnterior?.mensajeDocente,
          texto: mensajeDocente.trim(),
        },
      }));

      setMensajeDocente(
        contenidoActualizado?.mensajeDocente?.texto || mensajeDocente.trim(),
      );

      setEditandoMensaje(false);
    } catch (error) {
      console.error("Error al guardar mensaje docente:", error);

      setErrorMensaje(error.message || "No se pudo guardar el mensaje.");
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
      setErrorUnidad("Escribí un título para la unidad.");
      return;
    }

    try {
      setGuardandoUnidad(true);
      setErrorUnidad("");

      const token = localStorage.getItem("tokenUsuario");

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
            descripcion: descripcionUnidadNueva.trim(),
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo crear la unidad.");
      }

      setContenido(datos.contenido || contenido);

      setTituloUnidad("");
      setDescripcionUnidadNueva("");
      setCreandoUnidad(false);
    } catch (error) {
      console.error("Error al crear unidad:", error);

      setErrorUnidad(error.message || "No se pudo crear la unidad.");
    } finally {
      setGuardandoUnidad(false);
    }
  }

  async function guardarMaterial(unidadId) {
    if (!contenido?._id) {
      setErrorMaterial("No se pudo identificar el aula.");
      return;
    }

    if (!tituloMaterial.trim()) {
      setErrorMaterial("Escribí un título para el material.");
      return;
    }

    if (
      origenMaterial === "url" &&
      ["enlace", "pdf", "archivo", "audio", "video", "imagen"].includes(
        tipoMaterial,
      ) &&
      !urlMaterial.trim()
    ) {
      setErrorMaterial("Ingresá una URL para este tipo de recurso.");
      return;
    }

    if (
      origenMaterial === "archivo" &&
      tipoMaterial !== "texto" &&
      !archivoMaterial
    ) {
      setErrorMaterial("Elegí un archivo desde tu dispositivo.");
      return;
    }

    try {
      setGuardandoMaterial(true);
      setErrorMaterial("");

      const token = localStorage.getItem("tokenUsuario");

      let urlFinal = urlMaterial.trim();
      let nombreArchivoFinal = "";

      // ==========================================
      // SI EL DOCENTE ELIGIÓ UN ARCHIVO LOCAL
      // ==========================================

      if (origenMaterial === "archivo" && archivoMaterial) {
        const formData = new FormData();

        formData.append("archivo", archivoMaterial);

        const respuestaArchivo = await fetch(
          "/api/fotia/mi-espacio-docente/archivos",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        const datosArchivo = await respuestaArchivo.json();

        if (!respuestaArchivo.ok) {
          throw new Error(
            datosArchivo.mensaje || "No se pudo subir el archivo.",
          );
        }

        urlFinal = datosArchivo.archivo?.url || "";

        nombreArchivoFinal =
          datosArchivo.archivo?.nombreOriginal || archivoMaterial.name || "";
      }

      // ==========================================
      // GUARDAR EL RECURSO EN LA UNIDAD
      // ==========================================

      const respuesta = await fetch(
        `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/unidades/${unidadId}/materiales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tipo: tipoMaterial,
            titulo: tituloMaterial.trim(),
            descripcion: descripcionMaterial.trim(),
            url: urlFinal,
            nombreArchivo: nombreArchivoFinal,
            imprimible: materialImprimible,
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo agregar el material.");
      }

      setContenido(datos.contenido || contenido);

      setUnidadMaterialId(null);
      setTipoMaterial("enlace");
      setTituloMaterial("");
      setDescripcionMaterial("");
      setUrlMaterial("");
      setMaterialImprimible(false);

      setOrigenMaterial("url");
      setArchivoMaterial(null);
      setNombreArchivoMaterial("");

      setErrorMaterial("");
    } catch (error) {
      console.error("Error al agregar material:", error);

      setErrorMaterial(error.message || "No se pudo agregar el material.");
    } finally {
      setGuardandoMaterial(false);
    }
  }

  async function guardarEdicionMaterial(unidadId, materialId) {
    if (!contenido?._id) {
      setErrorEdicionMaterial("No se pudo identificar el aula.");
      return;
    }

    if (!tituloMaterialEditando.trim()) {
      setErrorEdicionMaterial("El título del material es obligatorio.");
      return;
    }

    if (
      ["enlace", "pdf", "archivo", "audio", "video", "imagen"].includes(
        tipoMaterialEditando,
      ) &&
      !urlMaterialEditando.trim()
    ) {
      setErrorEdicionMaterial("Ingresá una URL para este tipo de recurso.");
      return;
    }

    try {
      setGuardandoEdicionMaterial(true);
      setErrorEdicionMaterial("");

      const token = localStorage.getItem("tokenUsuario");

      const respuesta = await fetch(
        `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/unidades/${unidadId}/materiales/${materialId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tipo: tipoMaterialEditando,
            titulo: tituloMaterialEditando.trim(),
            descripcion: descripcionMaterialEditando.trim(),
            url: urlMaterialEditando.trim(),
            imprimible: imprimibleMaterialEditando,
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo actualizar el material.");
      }

      setContenido(datos.contenido || contenido);

      setMaterialEditandoId(null);
      setErrorEdicionMaterial("");
    } catch (error) {
      console.error("Error al actualizar material:", error);

      setErrorEdicionMaterial(
        error.message || "No se pudo actualizar el material.",
      );
    } finally {
      setGuardandoEdicionMaterial(false);
    }
  }

  async function retirarMaterial(unidadId, materialId) {
    const confirmar = window.confirm(
       "¿Querés retirar este recurso del aula?\n\n" +
    "Los estudiantes dejarán de verlo, pero el resto del aula continuará publicado.",
    );

    if (!confirmar) {
      return;
    }

    try {
      const token = localStorage.getItem("tokenUsuario");

      const respuesta = await fetch(
        `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/unidades/${unidadId}/materiales/${materialId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo retirar el material.");
      }

      setContenido(datos.contenido || contenido);

      if (materialEditandoId === materialId) {
        setMaterialEditandoId(null);
      }
    } catch (error) {
      console.error("Error al retirar material:", error);

      window.alert(error.message || "No se pudo retirar el material.");
    }
  }

  async function guardarEdicionUnidad(unidadId) {
    if (!contenido?._id) {
      setErrorEdicionUnidad("No se pudo identificar el aula.");
      return;
    }

    if (!tituloUnidadEditando.trim()) {
      setErrorEdicionUnidad("El título de la unidad es obligatorio.");
      return;
    }

    try {
      setGuardandoEdicionUnidad(true);
      setErrorEdicionUnidad("");

      const token = localStorage.getItem("tokenUsuario");

      const respuesta = await fetch(
        `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/unidades/${unidadId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: tituloUnidadEditando.trim(),
            descripcion: descripcionUnidadEditando.trim(),
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo actualizar la unidad.");
      }

      setContenido(datos.contenido || contenido);

      setUnidadEditandoId(null);
      setTituloUnidadEditando("");
      setDescripcionUnidadEditando("");
      setErrorEdicionUnidad("");
    } catch (error) {
      console.error("Error al actualizar unidad:", error);

      setErrorEdicionUnidad(
        error.message || "No se pudo actualizar la unidad.",
      );
    } finally {
      setGuardandoEdicionUnidad(false);
    }
  }

  const nombrePeriodo = espacio?.periodoId?.nombre || "";

  const ciclo = String(espacio?.periodoId?.cicloLectivo || "");

  const periodo =
    ciclo && nombrePeriodo.includes(ciclo)
      ? nombrePeriodo
      : ciclo
        ? `${nombrePeriodo} ${ciclo}`.trim()
        : nombrePeriodo;

  const totalMaterialesActivos =
    contenido?.unidades?.reduce((total, unidad) => {
      const activos =
        unidad.recursos?.filter(
          (recurso) => recurso.activo !== false && recurso.tipo !== "video",
        ).length || 0;

      return total + activos;
    }, 0) || 0;

  const totalVideosActivos =
    contenido?.unidades?.reduce((total, unidad) => {
      const videos =
        unidad.recursos?.filter(
          (recurso) => recurso.activo !== false && recurso.tipo === "video",
        ).length || 0;

      return total + videos;
    }, 0) || 0;

  function obtenerMiniaturaVideo(url) {
    if (!url) return null;

    try {
      const urlObj = new URL(url);

      let videoId = "";

      if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.replace("/", "");
      }

      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");

        if (!videoId && urlObj.pathname.includes("/shorts/")) {
          videoId = urlObj.pathname.split("/shorts/")[1]?.split("/")[0];
        }

        if (!videoId && urlObj.pathname.includes("/embed/")) {
          videoId = urlObj.pathname.split("/embed/")[1]?.split("/")[0];
        }
      }

      if (!videoId) return null;

      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch {
      return null;
    }
  }

  function obtenerDominio(url) {
    if (!url) return "";

    try {
      const dominio = new URL(url).hostname;
      return dominio.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  function obtenerDatosVisualesRecurso(recurso) {
    switch (recurso?.tipo) {
      case "enlace":
        return {
          icono: "🔗",
          etiqueta: "ENLACE WEB",
          textoBoton: "↗ Visitar recurso",
        };

      case "pdf":
        return {
          icono: "📄",
          etiqueta: "DOCUMENTO PDF",
          textoBoton: "📄 Abrir PDF",
        };

      case "archivo":
        return {
          icono: "📎",
          etiqueta: "ARCHIVO",
          textoBoton: "📎 Abrir archivo",
        };

      case "imagen":
        return {
          icono: "🖼️",
          etiqueta: "IMAGEN",
          textoBoton: "🖼️ Ver imagen",
        };

      case "audio":
        return {
          icono: "🎧",
          etiqueta: "AUDIO",
          textoBoton: "🎧 Escuchar audio",
        };

      default:
        return {
          icono: "📄",
          etiqueta: "RECURSO",
          textoBoton: "Abrir recurso",
        };
    }
  }

  async function cambiarPublicacionAula() {
    if (!contenido?._id) {
      setErrorPublicacion("No se pudo identificar el aula.");
      return;
    }

    const nuevoEstado = !contenido.publicado;

    const mensaje = nuevoEstado
      ? "¿Querés publicar esta aula para que los estudiantes puedan verla?"
      : "¿Querés volver esta aula a borrador? Los estudiantes dejarán de verla.";

    const confirmar = window.confirm(mensaje);

    if (!confirmar) return;

    try {
      setCambiandoPublicacion(true);
      setErrorPublicacion("");

      const token = localStorage.getItem("tokenUsuario");

      const respuesta = await fetch(
        `/api/fotia/mi-espacio-docente/aulas/${contenido._id}/publicacion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            publicado: nuevoEstado,
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo cambiar la publicación del aula.",
        );
      }

      setContenido(datos.contenido || datos);
    } catch (error) {
      console.error("Error al cambiar publicación:", error);

      setErrorPublicacion(
        error.message || "No se pudo cambiar la publicación del aula.",
      );
    } finally {
      setCambiandoPublicacion(false);
    }
  }

  

  function descargarRecurso(url, nombreArchivo = "archivo") { 
    if (!url) return;

    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.target = "_blank";
    enlace.rel = "noreferrer";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }

  function imprimirImagen(url, titulo = "Imagen") {
    if (!url) return;

    const ventana = window.open("", "_blank");

    if (!ventana) {
      window.alert("El navegador bloqueó la ventana de impresión.");
      return;
    }

    ventana.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${titulo}</title>

        <style>
          body {
            margin: 0;
            padding: 24px;
            text-align: center;
            font-family: Arial, sans-serif;
          }

          h1 {
            font-size: 18px;
            margin-bottom: 18px;
          }

          img {
            max-width: 100%;
            max-height: 90vh;
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
        <h1>${titulo}</h1>

        <img
          src="${url}"
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
  }

  function imprimirPdf(url) {
    if (!url) return;

    const ventana = window.open(`${url}#toolbar=1`, "_blank");

    if (!ventana) {
      window.alert("El navegador bloqueó la apertura del PDF.");
    }
  }

  function obtenerExtensionArchivo(url = "", nombreArchivo = "") {
    const origen = nombreArchivo || url;

    const limpio = origen.split("?")[0].split("#")[0];

    const partes = limpio.split(".");

    if (partes.length < 2) {
      return "";
    }

    return partes.pop().toLowerCase();
  }

  function obtenerPortadaArchivo(recurso) {
    const extension = obtenerExtensionArchivo(
      recurso?.url,
      recurso?.nombreArchivo,
    );

    switch (extension) {
      case "xlsx":
      case "xls":
      case "csv":
        return {
          icono: "📊",
          tipo: "PLANILLA",
          extension: extension.toUpperCase(),
        };

      case "doc":
      case "docx":
        return {
          icono: "📝",
          tipo: "DOCUMENTO",
          extension: extension.toUpperCase(),
        };

      case "ppt":
      case "pptx":
        return {
          icono: "📽️",
          tipo: "PRESENTACIÓN",
          extension: extension.toUpperCase(),
        };

      case "zip":
      case "rar":
      case "7z":
        return {
          icono: "🗜️",
          tipo: "ARCHIVO COMPRIMIDO",
          extension: extension.toUpperCase(),
        };

      default:
        return {
          icono: "📎",
          tipo: "ARCHIVO",
          extension: extension ? extension.toUpperCase() : "FILE",
        };
    }
  }

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
            <span style={etiquetaDato}>📄 Cargar material</span>

            <strong style={valorDato}>{totalMaterialesActivos}</strong>
          </div>

          <div style={datoResumen}>
            <span style={etiquetaDato}>🎥 Cargar video</span>

            <strong style={valorDato}>{totalVideosActivos}</strong>
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
                  {unidadEditandoId === unidad._id ? (
                    <div style={formularioEdicionUnidad}>
                      <div style={encabezadoEdicionUnidad}>
                        <div>
                          <div style={etiqueta}>EDITAR UNIDAD</div>

                          <h3 style={tituloFormularioUnidad}>
                            ✏️ Modificar unidad o tema
                          </h3>
                        </div>
                      </div>

                      <label style={grupoCampo}>
                        <span style={labelCampo}>Título de la unidad *</span>

                        <input
                          type="text"
                          value={tituloUnidadEditando}
                          onChange={(evento) => {
                            setTituloUnidadEditando(evento.target.value);
                            setErrorEdicionUnidad("");
                          }}
                          style={inputUnidad}
                          disabled={guardandoEdicionUnidad}
                        />
                      </label>

                      <label style={grupoCampo}>
                        <span style={labelCampo}>Breve descripción</span>

                        <textarea
                          value={descripcionUnidadEditando}
                          onChange={(evento) =>
                            setDescripcionUnidadEditando(evento.target.value)
                          }
                          rows={4}
                          style={textareaUnidad}
                          disabled={guardandoEdicionUnidad}
                        />
                      </label>

                      {errorEdicionUnidad && (
                        <div style={errorUnidadEstilo}>
                          ⚠️ {errorEdicionUnidad}
                        </div>
                      )}

                      <div style={accionesUnidad}>
                        <button
                          type="button"
                          onClick={() => guardarEdicionUnidad(unidad._id)}
                          disabled={guardandoEdicionUnidad}
                          style={
                            guardandoEdicionUnidad
                              ? botonDeshabilitado
                              : botonGuardarUnidad
                          }
                        >
                          {guardandoEdicionUnidad
                            ? "Guardando..."
                            : "💾 Guardar cambios"}
                        </button>

                        <button
                          type="button"
                          disabled={guardandoEdicionUnidad}
                          onClick={() => {
                            setUnidadEditandoId(null);
                            setTituloUnidadEditando("");
                            setDescripcionUnidadEditando("");
                            setErrorEdicionUnidad("");
                          }}
                          style={botonCancelarUnidad}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={cabeceraUnidadCreada}>
                        <div style={numeroUnidad}>{unidad.orden}</div>

                        <div style={{ flex: 1 }}>
                          <strong style={tituloUnidadCreada}>
                            {unidad.titulo}
                          </strong>

                          {unidad.descripcion && (
                            <p style={descripcionUnidad}>
                              {unidad.descripcion}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUnidadEditandoId(unidad._id);

                            setTituloUnidadEditando(unidad.titulo || "");

                            setDescripcionUnidadEditando(
                              unidad.descripcion || "",
                            );

                            setErrorEdicionUnidad("");
                          }}
                          style={botonEditarUnidad}
                        >
                          ✏️ Editar
                        </button>
                      </div>

                      <div style={panelConstruccionAula}>
                        <div style={cabeceraConstruccionAula}>
                          <div>
                            <div style={etiquetaConstruccionAula}>
                              CONSTRUIR EL AULA
                            </div>

                            <strong style={tituloConstruccionAula}>
                              Sumá recursos para tus estudiantes
                            </strong>
                          </div>

                          <span style={ayudaConstruccionAula}>
                            Elegí qué querés agregar
                          </span>
                        </div>

                        <div style={accionesConstruccionAula}>
                          <button
                            type="button"
                            onClick={() => {
                              setUnidadMaterialId(unidad._id);
                              setModoRecurso("material");
                              setOrigenMaterial("url");
                              setTipoMaterial("enlace");
                              setTituloMaterial("");
                              setDescripcionMaterial("");
                              setUrlMaterial("");
                              setArchivoMaterial(null);
                              setNombreArchivoMaterial("");
                              setMaterialImprimible(false);
                              setErrorMaterial("");

                              setTimeout(() => {
                                document
                                  .getElementById(
                                    `formulario-recurso-${unidad._id}`,
                                  )
                                  ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              }, 100);
                            }}
                            style={botonConstruccionPrincipal}
                          >
                            <span style={iconoBotonConstruccion}>📄</span>

                            <span>
                              <strong>Subir material</strong>
                              <small style={textoBotonConstruccion}>
                                PDF, imagen, audio, archivo o enlace
                              </small>
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setUnidadMaterialId(unidad._id);
                              setModoRecurso("video");
                              setOrigenMaterial("url");
                              setTipoMaterial("video");
                              setTituloMaterial("");
                              setDescripcionMaterial("");
                              setUrlMaterial("");
                              setArchivoMaterial(null);
                              setNombreArchivoMaterial("");
                              setMaterialImprimible(false);
                              setErrorMaterial("");

                              setTimeout(() => {
                                document
                                  .getElementById(
                                    `formulario-recurso-${unidad._id}`,
                                  )
                                  ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              }, 100);
                            }}
                            style={botonConstruccionPrincipal}
                          >
                            <span style={iconoBotonConstruccion}>🎥</span>

                            <span>
                              <strong>Subir video</strong>
                              <small style={textoBotonConstruccion}>
                                YouTube o video desde tu dispositivo
                              </small>
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled
                            style={botonConstruccionDeshabilitado}
                          >
                            <span style={iconoBotonConstruccion}>📝</span>

                            <span>
                              <strong>Actividades</strong>
                              <small style={textoBotonConstruccion}>
                                Próximamente
                              </small>
                            </span>
                          </button>
                        </div>
                      </div>

                      {unidad?.recursos?.length > 0 && (
                        <div
                          style={{
                            ...listaMaterialesUnidad,
                            borderTop: "2px solid #dbe8ec",
                            marginTop: "24px",
                            paddingTop: "24px",
                          }}
                        >
                          <div style={cabeceraMaterialesGuardados}>
                            <div>
                              <div style={etiqueta}>
                                MATERIALES DE LA UNIDAD
                              </div>

                              <h4 style={tituloMaterialesGuardados}>
                                📚 Recursos disponibles
                              </h4>
                            </div>

                            <span style={contadorMateriales}>
                              {
                                unidad.recursos.filter(
                                  (recurso) =>
                                    recurso.activo !== false &&
                                    recurso.tipo !== "video",
                                ).length
                              }{" "}
                              {unidad.recursos.filter(
                                (recurso) =>
                                  recurso.activo !== false &&
                                  recurso.tipo !== "video",
                              ).length === 1
                                ? "recurso"
                                : "recursos"}
                            </span>
                          </div>

                          <div style={grillaMateriales}>
                            {unidad.recursos
                              .filter(
                                (recurso) =>
                                  recurso.activo !== false &&
                                  recurso.tipo !== "video",
                              )
                              .map((recurso) => {
                                const datosVisuales =
                                  obtenerDatosVisualesRecurso(recurso);

                                return (
                                  <div
                                    key={recurso._id}
                                    style={tarjetaMaterialGuardado}
                                  >
                                    {materialEditandoId === recurso._id ? (
                                      <div style={formularioEdicionMaterial}>
                                        <div style={etiqueta}>
                                          EDITAR MATERIAL
                                        </div>

                                        <h4 style={tituloFormularioMaterial}>
                                          ✏️ Modificar recurso
                                        </h4>

                                        <label style={grupoCampo}>
                                          <span style={labelCampo}>
                                            Tipo de recurso
                                          </span>

                                          <select
                                            value={tipoMaterialEditando}
                                            onChange={(evento) =>
                                              setTipoMaterialEditando(
                                                evento.target.value,
                                              )
                                            }
                                            style={inputUnidad}
                                            disabled={guardandoEdicionMaterial}
                                          >
                                            <option value="enlace">
                                              🔗 Recurso complementario
                                            </option>

                                            <option value="texto">
                                              📝 Texto / explicación
                                            </option>

                                            <option value="pdf">📄 PDF</option>

                                            <option value="archivo">
                                              📎 Archivo
                                            </option>

                                            <option value="audio">
                                              🎧 Audio
                                            </option>

                                            <option value="video">
                                              🎥 Video
                                            </option>

                                            <option value="imagen">
                                              🖼 Imagen
                                            </option>
                                          </select>
                                        </label>

                                        <label style={grupoCampo}>
                                          <span style={labelCampo}>
                                            Título *
                                          </span>

                                          <input
                                            type="text"
                                            value={tituloMaterialEditando}
                                            onChange={(evento) => {
                                              setTituloMaterialEditando(
                                                evento.target.value,
                                              );
                                              setErrorEdicionMaterial("");
                                            }}
                                            style={inputUnidad}
                                            disabled={guardandoEdicionMaterial}
                                          />
                                        </label>

                                        <label style={grupoCampo}>
                                          <span style={labelCampo}>
                                            Breve explicación
                                          </span>

                                          <textarea
                                            value={descripcionMaterialEditando}
                                            onChange={(evento) =>
                                              setDescripcionMaterialEditando(
                                                evento.target.value,
                                              )
                                            }
                                            rows={3}
                                            style={textareaUnidad}
                                            disabled={guardandoEdicionMaterial}
                                          />
                                        </label>

                                        {tipoMaterialEditando !== "texto" && (
                                          <label style={grupoCampo}>
                                            <span style={labelCampo}>URL</span>

                                            <input
                                              type="url"
                                              value={urlMaterialEditando}
                                              onChange={(evento) =>
                                                setUrlMaterialEditando(
                                                  evento.target.value,
                                                )
                                              }
                                              style={inputUnidad}
                                              disabled={
                                                guardandoEdicionMaterial
                                              }
                                            />
                                          </label>
                                        )}

                                        {["imagen", "pdf"].includes(
                                          tipoMaterial,
                                        ) && (
                                          <label style={opcionImprimible}>
                                            <input
                                              type="checkbox"
                                              checked={materialImprimible}
                                              onChange={(evento) =>
                                                setMaterialImprimible(
                                                  evento.target.checked,
                                                )
                                              }
                                              disabled={guardandoMaterial}
                                            />

                                            <span>
                                              🖨️ Este material puede imprimirse
                                            </span>
                                          </label>
                                        )}

                                        {errorEdicionMaterial && (
                                          <div style={errorUnidadEstilo}>
                                            ⚠️ {errorEdicionMaterial}
                                          </div>
                                        )}

                                        <div style={accionesMaterialGuardado}>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              guardarEdicionMaterial(
                                                unidad._id,
                                                recurso._id,
                                              )
                                            }
                                            disabled={guardandoEdicionMaterial}
                                            style={
                                              guardandoEdicionMaterial
                                                ? botonDeshabilitado
                                                : botonGuardarUnidad
                                            }
                                          >
                                            {guardandoEdicionMaterial
                                              ? "Guardando..."
                                              : "💾 Guardar cambios"}
                                          </button>

                                          <button
                                            type="button"
                                            disabled={guardandoEdicionMaterial}
                                            onClick={() => {
                                              setMaterialEditandoId(null);
                                              setErrorEdicionMaterial("");
                                            }}
                                            style={botonCancelarUnidad}
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div style={cabeceraMaterialGuardado}>
                                          <div style={iconoMaterialGuardado}>
                                            {datosVisuales.icono}
                                          </div>

                                          <div style={{ flex: 1 }}>
                                            <div style={tipoMaterialGuardado}>
                                              {datosVisuales.etiqueta}
                                            </div>

                                            <strong
                                              style={tituloMaterialGuardado}
                                            >
                                              {recurso.titulo}
                                            </strong>
                                          </div>
                                        </div>

                                        {recurso.descripcion && (
                                          <p
                                            style={descripcionMaterialGuardado}
                                          >
                                            {recurso.descripcion}
                                          </p>
                                        )}
                                        {recurso.tipo === "imagen" &&
                                          recurso.url && (
                                            <a
                                              href={recurso.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={enlaceImagenMaterial}
                                            >
                                              <img
                                                src={recurso.url}
                                                alt={recurso.titulo}
                                                style={miniaturaImagenMaterial}
                                              />
                                            </a>
                                          )}

                                        {recurso.tipo === "pdf" &&
                                          recurso.url && (
                                            <div style={vistaPreviaPdf}>
                                              <iframe
                                                src={`${recurso.url}#page=1&toolbar=0&navpanes=0`}
                                                title={`Vista previa de ${recurso.titulo}`}
                                                style={iframePdf}
                                              />
                                            </div>
                                          )}

                                        {recurso.tipo === "audio" &&
                                          recurso.url && (
                                            <div
                                              style={contenedorAudioMaterial}
                                            >
                                              <div
                                                style={cabeceraAudioMaterial}
                                              >
                                                <span>🎧</span>

                                                <strong>Escuchar audio</strong>
                                              </div>

                                              <audio
                                                controls
                                                preload="metadata"
                                                src={recurso.url}
                                                style={reproductorAudio}
                                              >
                                                Tu navegador no puede reproducir
                                                este audio.
                                              </audio>
                                            </div>
                                          )}
                                        {recurso.tipo === "enlace" &&
                                          recurso.url && (
                                            <div style={portadaEnlace}>
                                              <div style={iconoPortadaEnlace}>
                                                🌐
                                              </div>

                                              <strong
                                                style={dominioPortadaEnlace}
                                              >
                                                {obtenerDominio(recurso.url)}
                                              </strong>

                                              <span style={textoPortadaEnlace}>
                                                Sitio externo
                                              </span>

                                              <div style={flechaPortadaEnlace}>
                                                ↗
                                              </div>
                                            </div>
                                          )}

                                        {recurso.tipo === "archivo" && (
                                          <div style={portadaArchivo}>
                                            {(() => {
                                              const datosArchivo =
                                                obtenerPortadaArchivo(recurso);

                                              return (
                                                <>
                                                  <div
                                                    style={iconoPortadaArchivo}
                                                  >
                                                    {datosArchivo.icono}
                                                  </div>

                                                  <div style={extensionArchivo}>
                                                    {datosArchivo.extension}
                                                  </div>

                                                  <strong
                                                    style={tipoPortadaArchivo}
                                                  >
                                                    {datosArchivo.tipo}
                                                  </strong>

                                                  {recurso.nombreArchivo && (
                                                    <span
                                                      style={
                                                        nombrePortadaArchivo
                                                      }
                                                    >
                                                      {recurso.nombreArchivo}
                                                    </span>
                                                  )}

                                                  <span
                                                    style={textoPortadaArchivo}
                                                  >
                                                    Archivo descargable
                                                  </span>
                                                </>
                                              );
                                            })()}
                                          </div>
                                        )}

                                        {recurso.tipo === "enlace" &&
                                          recurso.url && (
                                            <a
                                              href={recurso.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={dominioMaterial}
                                            >
                                              🌐 {obtenerDominio(recurso.url)}
                                            </a>
                                          )}

                                        <div style={accionesMaterialGuardado}>
                                          {recurso.tipo === "enlace" &&
                                            recurso.url && (
                                              <a
                                                href={recurso.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={botonAbrirMaterial}
                                              >
                                                ↗ Visitar recurso
                                              </a>
                                            )}

                                          {recurso.tipo === "pdf" &&
                                            recurso.url && (
                                              <>
                                                <a
                                                  href={recurso.url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  style={botonAbrirMaterial}
                                                >
                                                  📄 Abrir PDF
                                                </a>

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    descargarRecurso(
                                                      recurso.url,
                                                      recurso.nombreArchivo ||
                                                        `${recurso.titulo}.pdf`,
                                                    )
                                                  }
                                                  style={botonDescargarMaterial}
                                                >
                                                  ⬇️ Descargar
                                                </button>
                                              </>
                                            )}

                                          {recurso.tipo === "archivo" &&
                                            recurso.url && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  descargarRecurso(
                                                    recurso.url,
                                                    recurso.nombreArchivo ||
                                                      recurso.titulo,
                                                  )
                                                }
                                                style={botonDescargarMaterial}
                                              >
                                                ⬇️ Descargar archivo
                                              </button>
                                            )}

                                          {recurso.tipo === "imagen" &&
                                            recurso.url && (
                                              <>
                                                <a
                                                  href={recurso.url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  style={botonAbrirMaterial}
                                                >
                                                  🖼️ Ver imagen
                                                </a>

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    descargarRecurso(
                                                      recurso.url,
                                                      recurso.nombreArchivo ||
                                                        recurso.titulo,
                                                    )
                                                  }
                                                  style={botonDescargarMaterial}
                                                >
                                                  ⬇️ Descargar
                                                </button>
                                              </>
                                            )}

                                          {recurso.tipo === "audio" &&
                                            recurso.url && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  descargarRecurso(
                                                    recurso.url,
                                                    recurso.nombreArchivo ||
                                                      recurso.titulo,
                                                  )
                                                }
                                                style={botonDescargarMaterial}
                                              >
                                                ⬇️ Descargar audio
                                              </button>
                                            )}
                                          {recurso.imprimible &&
                                            recurso.tipo === "imagen" && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  imprimirImagen(
                                                    recurso.url,
                                                    recurso.titulo,
                                                  )
                                                }
                                                style={botonImprimirMaterial}
                                              >
                                                🖨️ Imprimir
                                              </button>
                                            )}

                                          {recurso.imprimible &&
                                            recurso.tipo === "pdf" && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  imprimirPdf(recurso.url)
                                                }
                                                style={botonImprimirMaterial}
                                              >
                                                🖨️ Imprimir
                                              </button>
                                            )}

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setMaterialEditandoId(
                                                recurso._id,
                                              );

                                              setTipoMaterialEditando(
                                                recurso.tipo || "enlace",
                                              );

                                              setTituloMaterialEditando(
                                                recurso.titulo || "",
                                              );

                                              setDescripcionMaterialEditando(
                                                recurso.descripcion || "",
                                              );

                                              setUrlMaterialEditando(
                                                recurso.url || "",
                                              );

                                              setImprimibleMaterialEditando(
                                                Boolean(recurso.imprimible),
                                              );

                                              setErrorEdicionMaterial("");
                                            }}
                                            style={botonEditarMaterial}
                                          >
                                            ✏️ Editar
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              retirarMaterial(
                                                unidad._id,
                                                recurso._id,
                                              )
                                            }
                                            style={botonEliminarMaterial}
                                          >
                                              🚫 Retirar
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {unidad?.recursos?.filter(
                        (recurso) =>
                          recurso.activo !== false && recurso.tipo === "video",
                      ).length > 0 && (
                        <div style={seccionVideosUnidad}>
                          <div style={cabeceraVideosUnidad}>
                            <div>
                              <div style={etiqueta}>VIDEOS DE LA UNIDAD</div>

                              <h4 style={tituloVideosUnidad}>
                                🎥 Videos y explicaciones
                              </h4>
                            </div>

                            <span style={contadorVideos}>
                              {
                                unidad.recursos.filter(
                                  (recurso) =>
                                    recurso.activo !== false &&
                                    recurso.tipo === "video",
                                ).length
                              }{" "}
                              {unidad.recursos.filter(
                                (recurso) =>
                                  recurso.activo !== false &&
                                  recurso.tipo === "video",
                              ).length === 1
                                ? "video"
                                : "videos"}
                            </span>
                          </div>

                          <div style={grillaVideos}>
                            {unidad.recursos
                              .filter(
                                (recurso) =>
                                  recurso.activo !== false &&
                                  recurso.tipo === "video",
                              )
                              .map((recurso) => (
                                <div key={recurso._id} style={tarjetaVideo}>
                                  {materialEditandoId === recurso._id ? (
                                    <div style={formularioEdicionMaterial}>
                                      <div style={etiqueta}>EDITAR VIDEO</div>

                                      <h4 style={tituloFormularioMaterial}>
                                        ✏️ Modificar video
                                      </h4>

                                      <label style={grupoCampo}>
                                        <span style={labelCampo}>Título *</span>

                                        <input
                                          type="text"
                                          value={tituloMaterialEditando}
                                          onChange={(evento) => {
                                            setTituloMaterialEditando(
                                              evento.target.value,
                                            );
                                            setErrorEdicionMaterial("");
                                          }}
                                          style={inputUnidad}
                                          disabled={guardandoEdicionMaterial}
                                        />
                                      </label>

                                      <label style={grupoCampo}>
                                        <span style={labelCampo}>
                                          Breve explicación
                                        </span>

                                        <textarea
                                          value={descripcionMaterialEditando}
                                          onChange={(evento) =>
                                            setDescripcionMaterialEditando(
                                              evento.target.value,
                                            )
                                          }
                                          rows={3}
                                          style={textareaUnidad}
                                          disabled={guardandoEdicionMaterial}
                                        />
                                      </label>

                                      <label style={grupoCampo}>
                                        <span style={labelCampo}>
                                          URL del video
                                        </span>

                                        <input
                                          type="url"
                                          value={urlMaterialEditando}
                                          onChange={(evento) => {
                                            setUrlMaterialEditando(
                                              evento.target.value,
                                            );
                                            setErrorEdicionMaterial("");
                                          }}
                                          style={inputUnidad}
                                          disabled={guardandoEdicionMaterial}
                                        />
                                      </label>

                                      {errorEdicionMaterial && (
                                        <div style={errorUnidadEstilo}>
                                          ⚠️ {errorEdicionMaterial}
                                        </div>
                                      )}

                                      <div style={accionesMaterialGuardado}>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            guardarEdicionMaterial(
                                              unidad._id,
                                              recurso._id,
                                            )
                                          }
                                          disabled={guardandoEdicionMaterial}
                                          style={
                                            guardandoEdicionMaterial
                                              ? botonDeshabilitado
                                              : botonGuardarUnidad
                                          }
                                        >
                                          {guardandoEdicionMaterial
                                            ? "Guardando..."
                                            : "💾 Guardar cambios"}
                                        </button>

                                        <button
                                          type="button"
                                          disabled={guardandoEdicionMaterial}
                                          onClick={() => {
                                            setMaterialEditandoId(null);
                                            setErrorEdicionMaterial("");
                                          }}
                                          style={botonCancelarUnidad}
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <>
                                        {obtenerMiniaturaVideo(recurso.url) ? (
                                          // VIDEO DE YOUTUBE
                                          <a
                                            href={recurso.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={enlaceMiniaturaVideo}
                                          >
                                            <div
                                              style={contenedorMiniaturaVideo}
                                            >
                                              <img
                                                src={obtenerMiniaturaVideo(
                                                  recurso.url,
                                                )}
                                                alt={recurso.titulo}
                                                style={miniaturaVideo}
                                              />

                                              <div style={botonPlayMiniatura}>
                                                ▶
                                              </div>
                                            </div>
                                          </a>
                                        ) : recurso.url ? (
                                          // VIDEO SUBIDO DESDE LA PC
                                          <div style={contenedorMiniaturaVideo}>
                                            <video
                                              src={recurso.url}
                                              controls
                                              preload="metadata"
                                              style={{
                                                width: "100%",
                                                aspectRatio: "16 / 9",
                                                objectFit: "cover",
                                                display: "block",
                                                background: "#000",
                                              }}
                                            >
                                              Tu navegador no puede reproducir
                                              este video.
                                            </video>
                                          </div>
                                        ) : null}
                                        <div style={cabeceraTarjetaVideo}>
                                          <div style={iconoVideo}>🎥</div>

                                          <div style={{ flex: 1 }}>
                                            <div style={etiquetaVideo}>
                                              VIDEO DE APOYO
                                            </div>

                                            <strong style={tituloVideo}>
                                              {recurso.titulo}
                                            </strong>
                                          </div>
                                        </div>
                                      </>
                                      {recurso.descripcion && (
                                        <p style={descripcionVideo}>
                                          {recurso.descripcion}
                                        </p>
                                      )}

                                      <div style={accionesVideo}>
                                        {recurso.url &&
                                          obtenerMiniaturaVideo(
                                            recurso.url,
                                          ) && (
                                            <a
                                              href={recurso.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={botonVerVideo}
                                            >
                                              ▶ Ver video
                                            </a>
                                          )}

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setMaterialEditandoId(recurso._id);

                                            setTipoMaterialEditando("video");

                                            setTituloMaterialEditando(
                                              recurso.titulo || "",
                                            );

                                            setDescripcionMaterialEditando(
                                              recurso.descripcion || "",
                                            );

                                            setUrlMaterialEditando(
                                              recurso.url || "",
                                            );

                                            setImprimibleMaterialEditando(
                                              false,
                                            );

                                            setErrorEdicionMaterial("");
                                          }}
                                          style={botonEditarMaterial}
                                        >
                                          ✏️ Editar
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            retirarMaterial(
                                              unidad._id,
                                              recurso._id,
                                            )
                                          }
                                          style={botonEliminarMaterial}
                                        >
                                            🚫 Retirar
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {unidadMaterialId === unidad._id && (
                        <div
                          id={`formulario-recurso-${unidad._id}`}
                          style={formularioMaterial}
                        >
                          <div style={cabeceraFormularioMaterial}>
                            <div>
                              <div style={etiqueta}>
                                {modoRecurso === "video"
                                  ? "VIDEO DE LA UNIDAD"
                                  : "MATERIAL DE LA UNIDAD"}
                              </div>

                              <h4 style={tituloFormularioMaterial}>
                                {modoRecurso === "video"
                                  ? "🎥 Agregar video"
                                  : "📄 Agregar material"}
                              </h4>
                            </div>
                          </div>
                          <div style={selectorOrigenRecurso}>
                            <button
                              type="button"
                              onClick={() => {
                                setOrigenMaterial("url");
                                setArchivoMaterial(null);
                                setNombreArchivoMaterial("");
                                setErrorMaterial("");
                              }}
                              style={
                                origenMaterial === "url"
                                  ? botonOrigenActivo
                                  : botonOrigenInactivo
                              }
                            >
                              🌐 Usar enlace
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOrigenMaterial("archivo");
                                setUrlMaterial("");
                                setErrorMaterial("");
                              }}
                              style={
                                origenMaterial === "archivo"
                                  ? botonOrigenActivo
                                  : botonOrigenInactivo
                              }
                            >
                              {modoRecurso === "video"
                                ? "⬆️ Subir video"
                                : "⬆️ Subir archivo"}
                            </button>
                          </div>

                          {modoRecurso === "material" && (
                            <label style={grupoCampo}>
                              <span style={labelCampo}>Tipo de recurso</span>

                              <select
                                value={tipoMaterial}
                                onChange={(evento) => {
                                  setTipoMaterial(evento.target.value);
                                  setErrorMaterial("");
                                }}
                                style={inputUnidad}
                                disabled={guardandoMaterial}
                              >
                                <option value="enlace">
                                  🔗 Recurso complementario
                                </option>

                                <option value="texto">
                                  📝 Texto / explicación
                                </option>

                                <option value="pdf">📄 PDF</option>

                                <option value="archivo">📎 Archivo</option>

                                <option value="audio">🎧 Audio</option>

                                <option value="video">🎥 Video</option>

                                <option value="imagen">🖼 Imagen</option>
                              </select>
                            </label>
                          )}

                          <label style={grupoCampo}>
                            <span style={labelCampo}>Título *</span>

                            <input
                              type="text"
                              value={tituloMaterial}
                              onChange={(evento) => {
                                setTituloMaterial(evento.target.value);
                                setErrorMaterial("");
                              }}
                              placeholder="Ej.: Present Simple — guía de apoyo"
                              style={inputUnidad}
                              disabled={guardandoMaterial}
                            />
                          </label>

                          <label style={grupoCampo}>
                            <span style={labelCampo}>Breve explicación</span>

                            <textarea
                              value={descripcionMaterial}
                              onChange={(evento) =>
                                setDescripcionMaterial(evento.target.value)
                              }
                              placeholder="Contá brevemente qué encontrará el estudiante en este recurso."
                              rows={3}
                              style={textareaUnidad}
                              disabled={guardandoMaterial}
                            />
                          </label>

                          {tipoMaterial !== "texto" &&
                            origenMaterial === "url" && (
                              <label style={grupoCampo}>
                                <span style={labelCampo}>URL del recurso</span>

                                <input
                                  type="url"
                                  value={urlMaterial}
                                  onChange={(evento) => {
                                    setUrlMaterial(evento.target.value);
                                    setErrorMaterial("");
                                  }}
                                  placeholder="https://..."
                                  style={inputUnidad}
                                  disabled={guardandoMaterial}
                                />
                              </label>
                            )}

                          {tipoMaterial !== "texto" &&
                            origenMaterial === "archivo" && (
                              <div style={grupoCampo}>
                                <span style={labelCampo}>
                                  Archivo desde tu dispositivo
                                </span>

                                <label style={selectorArchivo}>
                                  <input
                                    type="file"
                                    accept={
                                      modoRecurso === "video"
                                        ? "video/*,.mp4,.webm,.mov"
                                        : undefined
                                    }
                                    onChange={(evento) => {
                                      const archivo =
                                        evento.target.files?.[0] || null;

                                      setArchivoMaterial(archivo);
                                      setNombreArchivoMaterial(
                                        archivo?.name || "",
                                      );
                                      setErrorMaterial("");

                                      if (!archivo) {
                                        return;
                                      }

                                      const tipoMime =
                                        archivo.type?.toLowerCase() || "";

                                      const nombre =
                                        archivo.name?.toLowerCase() || "";

                                      if (
                                        tipoMime.startsWith("image/") ||
                                        /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(
                                          nombre,
                                        )
                                      ) {
                                        setTipoMaterial("imagen");
                                        return;
                                      }

                                      if (
                                        tipoMime === "application/pdf" ||
                                        nombre.endsWith(".pdf")
                                      ) {
                                        setTipoMaterial("pdf");
                                        return;
                                      }

                                      if (
                                        tipoMime.startsWith("audio/") ||
                                        /\.(mp3|wav|ogg|m4a|aac)$/i.test(nombre)
                                      ) {
                                        setTipoMaterial("audio");
                                        return;
                                      }

                                      if (
                                        tipoMime.startsWith("video/") ||
                                        /\.(mp4|webm|mov|avi|mkv)$/i.test(
                                          nombre,
                                        )
                                      ) {
                                        setTipoMaterial("video");
                                        return;
                                      }

                                      setTipoMaterial("archivo");
                                    }}
                                    style={{ display: "none" }}
                                    disabled={guardandoMaterial}
                                  />

                                  <span style={botonElegirArchivo}>
                                    📂 Elegir archivo
                                  </span>

                                  <span style={nombreArchivoSeleccionado}>
                                    {nombreArchivoMaterial ||
                                      "Todavía no seleccionaste ningún archivo"}
                                  </span>
                                </label>
                              </div>
                            )}
                          <label style={opcionImprimible}>
                            <input
                              type="checkbox"
                              checked={materialImprimible}
                              onChange={(evento) =>
                                setMaterialImprimible(evento.target.checked)
                              }
                              disabled={guardandoMaterial}
                            />

                            <span>🖨️ Este material puede imprimirse</span>
                          </label>

                          {errorMaterial && (
                            <div style={errorUnidadEstilo}>
                              ⚠️ {errorMaterial}
                            </div>
                          )}

                          <div style={accionesUnidad}>
                            <button
                              type="button"
                              onClick={() => guardarMaterial(unidad._id)}
                              disabled={guardandoMaterial}
                              style={
                                guardandoMaterial
                                  ? botonDeshabilitado
                                  : botonGuardarUnidad
                              }
                            >
                              {guardandoMaterial
                                ? "Guardando..."
                                : modoRecurso === "video"
                                  ? "💾 Guardar video"
                                  : "💾 Guardar material"}
                            </button>

                            <button
                              type="button"
                              disabled={guardandoMaterial}
                              onClick={() => {
                                setUnidadMaterialId(null);
                                setTipoMaterial("enlace");
                                setTituloMaterial("");
                                setDescripcionMaterial("");
                                setUrlMaterial("");
                                setMaterialImprimible(false);
                                setErrorMaterial("");
                              }}
                              style={botonCancelarUnidad}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
              {contenido?.publicado
                ? "Esta aula está publicada y disponible para los estudiantes."
                : "Mientras esté en borrador, tus estudiantes no verán el contenido que prepares."}
            </p>

            {errorPublicacion && (
              <div style={errorPublicacionEstilo}>⚠️ {errorPublicacion}</div>
            )}
          </div>

          <button
            type="button"
            onClick={cambiarPublicacionAula}
            disabled={cambiandoPublicacion}
            style={
              contenido?.publicado ? botonVolverBorrador : botonPublicarAula
            }
          >
            {cambiandoPublicacion
              ? "Guardando..."
              : contenido?.publicado
                ? "🟡 Volver a borrador"
                : "🟢 Publicar aula"}
          </button>
        </section>
      </div>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f4f8fb 0%, #eef7f4 100%)",
  padding: "20px 12px",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
  flexWrap: "wrap",
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

const formularioEdicionUnidad = {
  background: "#f8fbfc",
  border: "1px solid #c7dce3",
  borderRadius: "14px",
  padding: "16px",
};

const encabezadoEdicionUnidad = {
  marginBottom: "14px",
};

const botonEditarUnidad = {
  border: "1px solid #b9d6df",
  background: "#ffffff",
  color: "#31556c",
  borderRadius: "999px",
  padding: "7px 12px",
  cursor: "pointer",
  fontWeight: "700",
  flexShrink: 0,
};


const formularioMaterial = {
  marginTop: "14px",
  padding: "18px",
  background: "#f7fbfc",
  border: "1px solid #bfd5dc",
  borderRadius: "14px",
};

const cabeceraFormularioMaterial = {
  marginBottom: "15px",
};

const tituloFormularioMaterial = {
  margin: "5px 0 0",
  color: "#173f68",
  fontSize: "18px",
};

const opcionImprimible = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: "4px 0 15px",
  color: "#536575",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
};
const listaMaterialesUnidad = {
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #edf2f4",
};

const cabeceraMaterialesGuardados = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "12px",
};

const tituloMaterialesGuardados = {
  margin: "4px 0 0",
  color: "#173f68",
  fontSize: "17px",
};

const contadorMateriales = {
  background: "#edf7f5",
  color: "#0f766e",
  borderRadius: "999px",
  padding: "5px 10px",
  fontSize: "12px",
  fontWeight: "700",
};

const grillaMateriales = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "12px",
};

const tarjetaMaterialGuardado = {
  background: "#ffffff",
  border: "3px solid #d4e2e7",
  borderRadius: "14px",
  padding: "14px",
};

const cabeceraMaterialGuardado = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
};

const iconoMaterialGuardado = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "#e8f4f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "19px",
  flexShrink: 0,
};

const tipoMaterialGuardado = {
  fontSize: "10px",
  fontWeight: "800",
  color: "#758791",
  letterSpacing: "0.7px",
  marginBottom: "3px",
};

const tituloMaterialGuardado = {
  color: "#173f68",
  fontSize: "15px",
};

const descripcionMaterialGuardado = {
  color: "#5f6f7a",
  lineHeight: 1.5,
  fontSize: "13px",
  margin: "10px 0",
};

const accionesMaterialGuardado = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const botonAbrirMaterial = {
  textDecoration: "none",
  borderRadius: "999px",
  padding: "7px 11px",
  background: "#0f766e",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "700",
};

const botonImprimirMaterial = {
  border: "1px solid #bfd5dc",
  borderRadius: "999px",
  padding: "7px 11px",
  background: "#ffffff",
  color: "#31556c",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
};
const formularioEdicionMaterial = {
  background: "#f8fbfc",
  borderRadius: "12px",
  padding: "4px",
};

const botonEditarMaterial = {
  border: "1px solid #bfd5dc",
  borderRadius: "999px",
  padding: "7px 11px",
  background: "#ffffff",
  color: "#31556c",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
};

const botonEliminarMaterial = {
  border: "1px solid #efb6b6",
  borderRadius: "999px",
  padding: "7px 11px",
  background: "#fff7f7",
  color: "#a52a2a",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
};
const seccionVideosUnidad = {
  marginTop: "18px",
  paddingTop: "16px",
  borderTop: "1px solid #edf2f4",
};

const cabeceraVideosUnidad = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "14px",
};

const tituloVideosUnidad = {
  margin: "4px 0 0",
  color: "#173f68",
  fontSize: "17px",
};

const contadorVideos = {
  background: "#f2eef8",
  color: "#5b4774",
  borderRadius: "999px",
  padding: "5px 10px",
  fontSize: "12px",
  fontWeight: "700",
};

const grillaVideos = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "14px",
};

const tarjetaVideo = {
  background: "#ffffff",
  border: "3px solid #d4e2e7",
  borderRadius: "15px",
  padding: "15px",
  minWidth: 0,
};

const cabeceraTarjetaVideo = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
};

const iconoVideo = {
  width: "42px",
  height: "42px",
  borderRadius: "11px",
  background: "#f2eef8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "21px",
  flexShrink: 0,
};

const etiquetaVideo = {
  fontSize: "10px",
  fontWeight: "800",
  color: "#758791",
  letterSpacing: "0.7px",
  marginBottom: "4px",
};

const tituloVideo = {
  color: "#173f68",
  fontSize: "15px",
  lineHeight: 1.35,
};

const descripcionVideo = {
  color: "#5f6f7a",
  lineHeight: 1.5,
  fontSize: "13px",
  margin: "12px 0",
};

const accionesVideo = {
  display: "flex",
  gap: "7px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const botonVerVideo = {
  textDecoration: "none",
  borderRadius: "999px",
  padding: "7px 11px",
  background: "#0f766e",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "700",
};
const enlaceMiniaturaVideo = {
  display: "block",
  textDecoration: "none",
  margin: "-15px -15px 14px",
};

const contenedorMiniaturaVideo = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  borderRadius: "15px 15px 0 0",
  background: "#edf3f5",
};

const miniaturaVideo = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const botonPlayMiniatura = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.72)",
  color: "#ffffff",
  fontSize: "22px",
  paddingLeft: "3px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
};
const dominioMaterial = {
  display: "inline-block",
  marginTop: "4px",
  marginBottom: "14px",
  color: "#2563eb",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "underline",
  cursor: "pointer",
  overflowWrap: "anywhere",
};
const enlaceImagenMaterial = {
  display: "block",
  margin: "12px 0",
  borderRadius: "12px",
  overflow: "hidden",
  background: "#eef3f5",
};

const miniaturaImagenMaterial = {
  width: "100%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  display: "block",
};

const contenedorAudioMaterial = {
  margin: "12px 0",
  padding: "12px",
  borderRadius: "12px",
  background: "#f7fbfc",
  border: "3px solid #d4e2e7",
};

const cabeceraAudioMaterial = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  color: "#31556c",
  fontSize: "13px",
  marginBottom: "9px",
};

const reproductorAudio = {
  width: "100%",
  maxWidth: "100%",
};
const selectorOrigenRecurso = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const botonOrigenActivo = {
  border: "none",
  borderRadius: "999px",
  padding: "9px 14px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
};

const botonOrigenInactivo = {
  border: "1px solid #c9dce3",
  borderRadius: "999px",
  padding: "9px 14px",
  background: "#ffffff",
  color: "#536575",
  fontWeight: "700",
  cursor: "pointer",
};

const selectorArchivo = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  padding: "14px",
  background: "#ffffff",
  border: "3px dashed #b9d6df",
  borderRadius: "12px",
  cursor: "pointer",
};

const botonElegirArchivo = {
  background: "#edf7f5",
  color: "#0f766e",
  borderRadius: "999px",
  padding: "8px 12px",
  fontWeight: "700",
  fontSize: "13px",
};

const nombreArchivoSeleccionado = {
  color: "#5f6f7a",
  fontSize: "13px",
  overflowWrap: "anywhere",
};
const botonDescargarMaterial = {
  border: "3px solid #bfd5dc",
  borderRadius: "999px",
  padding: "7px 11px",
  background: "#ffffff",
  color: "#31556c",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
};
const vistaPreviaPdf = {
  width: "100%",
  aspectRatio: "4 / 3",
  margin: "12px 0",
  borderRadius: "12px",
  overflow: "hidden",
  background: "#f5f7f8",
  border: "3px solid #e1eaee",
};

const iframePdf = {
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
};
const portadaArchivo = {
  minHeight: "180px",
  margin: "14px 0",
  padding: "22px 16px",
  borderRadius: "14px",
  background: "#f6fafb",
  border: "3px solid #dce9ed",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "6px",
};

const iconoPortadaArchivo = {
  fontSize: "38px",
  marginBottom: "3px",
};

const extensionArchivo = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#0f766e",
};

const tipoPortadaArchivo = {
  color: "#173f68",
  fontSize: "15px",
};

const nombrePortadaArchivo = {
  maxWidth: "100%",
  color: "#526876",
  fontSize: "12px",
  overflowWrap: "anywhere",
};

const textoPortadaArchivo = {
  color: "#80909a",
  fontSize: "11px",
};

const portadaEnlace = {
  minHeight: "180px",
  margin: "14px 0",
  padding: "22px 16px",
  borderRadius: "14px",
  background: "#f5f9ff",
  border: "3px solid #d8e5f3",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "7px",
};

const iconoPortadaEnlace = {
  fontSize: "38px",
};

const dominioPortadaEnlace = {
  color: "#2563eb",
  fontSize: "15px",
  overflowWrap: "anywhere",
};

const textoPortadaEnlace = {
  color: "#778995",
  fontSize: "12px",
};

const flechaPortadaEnlace = {
  marginTop: "3px",
  fontSize: "22px",
  color: "#0f766e",
};
const panelConstruccionAula = {
  marginTop: "14px",
  marginBottom: "20px",
  padding: "16px",
  border: "2px solid #cfe3ea",
  borderRadius: "16px",
  background: "#f8fcfd",
};

const cabeceraConstruccionAula = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "14px",
};

const etiquetaConstruccionAula = {
  color: "#607989",
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "1px",
  marginBottom: "3px",
};

const tituloConstruccionAula = {
  color: "#103f68",
  fontSize: "16px",
};

const ayudaConstruccionAula = {
  color: "#7a8d98",
  fontSize: "12px",
};

const accionesConstruccionAula = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "10px",
};

const botonConstruccionPrincipal = {
  border: "1px solid #b9d8df",
  borderRadius: "14px",
  padding: "13px 14px",
  background: "#ffffff",
  color: "#0f4c67",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "11px",
  textAlign: "left",
  fontSize: "14px",
};

const botonConstruccionDeshabilitado = {
  ...botonConstruccionPrincipal,
  background: "#f0f4f5",
  color: "#91a0a8",
  cursor: "not-allowed",
};

const iconoBotonConstruccion = {
  fontSize: "25px",
  flexShrink: 0,
};

const textoBotonConstruccion = {
  display: "block",
  marginTop: "3px",
  fontSize: "11px",
  fontWeight: "400",
  color: "#72848f",
};
const botonPublicarAula = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#0f766e",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
};

const botonVolverBorrador = {
  border: "1px solid #e5c76f",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#fff7df",
  color: "#8a6500",
  fontWeight: "800",
  cursor: "pointer",
};

const errorPublicacionEstilo = {
  marginTop: "10px",
  color: "#b42318",
  fontSize: "13px",
  fontWeight: "700",
};