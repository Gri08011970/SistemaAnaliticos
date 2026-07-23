/*
 * ============================================================
 * INFORME INSTITUCIONAL
 * ============================================================
 *
 * Componente de presentación del informe institucional.
 *
 * No calcula puntajes.
 *
 * No determina categorías.
 *
 * No interpreta trayectorias.
 *
 * Recibe un informe ya construido y se limita a presentarlo
 * de manera clara, ordenada y respetuosa.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FUNCIONES AUXILIARES DE PRESENTACIÓN
 * ============================================================
 */

/**
 * Verifica que una lista posea elementos.
 */

/**
 * Devuelve un texto seguro.
 */
function obtenerTextoSeguro(valor, textoAlternativo = "Sin información") {
  if (valor === null || valor === undefined || valor === "") {
    return textoAlternativo;
  }

  return valor;
}

/*
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 */

export default function InformeInstitucional({
  informe,
  mostrarDetalleTecnico = false,
}) {
  if (!informe) {
    return (
      <section className="informe-institucional informe-institucional--vacio">
        <h2>Informe institucional</h2>

        <p>Todavía no hay información disponible para mostrar.</p>
      </section>
    );
  }

  const encabezado = informe.encabezado || {};

  return (
    <article
      id="informe-institucional-imprimir"
      className="informe-institucional"
    >
      
      {/*
       * ======================================================
       * ENCABEZADO
       * ======================================================
       */}

      <header className="informe-institucional__encabezado">
        {informe.institucion && (
          <p className="informe-institucional__institucion">
            {informe.institucion}
          </p>
        )}

        <h2 className="informe-institucional__titulo">
          {obtenerTextoSeguro(
            encabezado.titulo,
            "Informe institucional de trayectoria",
          )}
        </h2>

        <p className="informe-institucional__fecha">
          Fecha de elaboración: {obtenerTextoSeguro(informe.fechaFormateada)}
        </p>
      </header>

      {/*
       * ======================================================
       * DATOS GENERALES
       * ======================================================
       */}
      <section className="informe-institucional__datos">
        <div className="informe-institucional__dato informe-institucional__dato--principal">
          <span className="informe-institucional__dato-etiqueta">
            Estudiante
          </span>

          <strong className="informe-institucional__dato-valor">
            {obtenerTextoSeguro(
              informe.estudiante?.apellidoNombre ||
                informe.estudiante?.nombreCompleto ||
                informe.estudiante?.nombre ||
                informe.encabezado?.estudiante,
            )}
          </strong>
        </div>

        <div className="informe-institucional__datos-secundarios">
          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">DNI</span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.estudiante?.dni || informe.encabezado?.dni,
              )}
            </strong>
          </div>

          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">Curso</span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.curso ||
                  informe.estudiante?.curso ||
                  informe.encabezado?.curso,
              )}
            </strong>
          </div>

          <div className="informe-institucional__dato">
            <span className="informe-institucional__dato-etiqueta">
              Período analizado
            </span>

            <strong className="informe-institucional__dato-valor">
              {obtenerTextoSeguro(
                informe.periodo || informe.encabezado?.periodo,
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="informe-institucional__valoracion">
        <span className="informe-institucional__valoracion-etiqueta">
          Valoración general
        </span>

        <p className="informe-institucional__valoracion-texto">
          {obtenerTextoSeguro(informe.valoracionInstitucional)}
        </p>
      </section>

      {/*
       * ======================================================
       * SECCIONES DEL INFORME
       * ======================================================
       */}

      <section
        className="
    informe-institucional__seccion
    informe-institucional__sintesis-final
  "
      >
        <h3>Síntesis institucional</h3>

        <p>{obtenerTextoSeguro(informe.sintesisInstitucional)}</p>
      </section>

      <section
        className="
    informe-institucional__seccion
    informe-institucional__orientacion-final
  "
      >
        <h3>Orientación de intervención</h3>

        <p>{obtenerTextoSeguro(informe.orientacionIntervencion)}</p>
      </section>

      {/*
       * ======================================================
       * ACLARACIÓN PROFESIONAL
       * ======================================================
       */}

      {informe.aclaracionInstitucional && (
        <aside className="informe-institucional__aclaracion">
          <strong>Aclaración</strong>

          <p>{informe.aclaracionInstitucional}</p>
        </aside>
      )}

      {/*
       * ======================================================
       * DETALLE TÉCNICO OPCIONAL
       * ======================================================
       */}

      {mostrarDetalleTecnico && (
        <details className="informe-institucional__detalle-tecnico">
          <summary>Ver detalle técnico</summary>

          <pre>{JSON.stringify(informe.detalleTecnico, null, 2)}</pre>
        </details>
      )}
    </article>
  );
}
