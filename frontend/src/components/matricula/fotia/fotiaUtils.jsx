const esTextoVacioOMarcador = (valor) => {
  const texto = String(valor ?? "").trim();

  return (
    texto === "" ||
    texto === "-" ||
    texto === "----------"
  );
};

export const esMateriaPendienteValida = (materia) => {
  if (!materia) return false;

  if (typeof materia === "string") {
    return !esTextoVacioOMarcador(materia);
  }

  if (typeof materia === "object") {
    return !esTextoVacioOMarcador(
      materia.asignatura,
    );
  }

  return false;
};

const obtenerNombreCompleto = (alumno) => {
  const apellido = String(
    alumno?.apellido || "",
  ).trim();

  const nombre = String(
    alumno?.nombre || "",
  ).trim();

  return [apellido, nombre]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const obtenerDniLimpio = (dni) => {
  return String(dni ?? "").replace(/\D/g, "");
};

const obtenerIdAlumno = (alumno) => {
  if (alumno?._id) {
    return String(alumno._id);
  }

  const dni = obtenerDniLimpio(alumno?.dni);

  if (dni) {
    return dni;
  }

  return obtenerNombreCompleto(alumno)
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const obtenerIdPrevia = ({
  alumnoId,
  materia,
  indice,
}) => {
  if (
    typeof materia === "object" &&
    materia?._id
  ) {
    return String(materia._id);
  }

  const asignatura =
    typeof materia === "object"
      ? materia.asignatura
      : materia;

  const anio =
    typeof materia === "object"
      ? materia.anio
      : "";

  return [
    alumnoId,
    String(asignatura || "")
      .trim()
      .toLowerCase(),
    String(anio || "")
      .trim()
      .toLowerCase(),
    indice,
  ].join("-");
};

export const crearFilasFotia = (
  alumnosMatricula = [],
) => {
  if (!Array.isArray(alumnosMatricula)) {
    return [];
  }

  return alumnosMatricula.flatMap((alumno) => {
    const materias = Array.isArray(
      alumno?.materiasPendientes,
    )
      ? alumno.materiasPendientes
      : [];

    const alumnoId = obtenerIdAlumno(alumno);

    return materias
      .map((materia, indice) => ({
        materia,
        indice,
      }))
      .filter(({ materia }) =>
        esMateriaPendienteValida(materia),
      )
      .map(({ materia, indice }) => {
        const esObjeto =
          typeof materia === "object" &&
          materia !== null;

        const asignatura = esObjeto
          ? String(
              materia.asignatura || "",
            ).trim()
          : String(materia).trim();

        const anio = esObjeto
          ? String(materia.anio || "").trim()
          : "";

        const previaId = obtenerIdPrevia({
          alumnoId,
          materia,
          indice,
        });

        return {
          id: `${alumnoId}-${previaId}`,

          alumnoId,
          previaId,

          estudiante:
            obtenerNombreCompleto(alumno),

          apellido: String(
            alumno?.apellido || "",
          ).trim(),

          nombre: String(
            alumno?.nombre || "",
          ).trim(),

          cursoActual: String(
            alumno?.curso || "",
          ).trim(),

          turno: String(
            alumno?.turno || "",
          ).trim(),

          dni: String(
            alumno?.dni || "",
          ).trim(),

          asignatura,
          anio,

          estado: "Pendiente",
          fechaAprobacion: "",
          docenteResponsableId: "",
          docenteResponsableNombre: "",
        };
      });
  });
};

export const obtenerEstudiantesUnicosFotia = (
  filasFotia = [],
) => {
  const ids = new Set(
    filasFotia
      .map((fila) => fila.alumnoId)
      .filter(Boolean),
  );

  return ids.size;
};

export const ordenarFilasFotia = (
  filasFotia = [],
) => {
  return [...filasFotia].sort((a, b) => {
    const comparacionCurso =
      String(a.cursoActual).localeCompare(
        String(b.cursoActual),
        "es",
        {
          numeric: true,
          sensitivity: "base",
        },
      );

    if (comparacionCurso !== 0) {
      return comparacionCurso;
    }

    const comparacionEstudiante =
      String(a.estudiante).localeCompare(
        String(b.estudiante),
        "es",
        {
          sensitivity: "base",
        },
      );

    if (comparacionEstudiante !== 0) {
      return comparacionEstudiante;
    }

    const comparacionAnio =
      String(a.anio).localeCompare(
        String(b.anio),
        "es",
        {
          numeric: true,
          sensitivity: "base",
        },
      );

    if (comparacionAnio !== 0) {
      return comparacionAnio;
    }

    return String(a.asignatura).localeCompare(
      String(b.asignatura),
      "es",
      {
        sensitivity: "base",
      },
    );
  });
};

export const obtenerOpcionesUnicasFotia = (
  filasFotia = [],
  campo,
) => {
  return [
    ...new Set(
      filasFotia
        .map((fila) =>
          String(fila?.[campo] || "").trim(),
        )
        .filter(Boolean),
    ),
  ].sort((a, b) =>
    a.localeCompare(b, "es", {
      numeric: true,
      sensitivity: "base",
    }),
  );
};