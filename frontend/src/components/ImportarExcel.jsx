import * as XLSX from "xlsx"

export default function ImportarExcel({
  importarEstudiantes
}) {

  function importarArchivo(evento) {

    const archivo = evento.target.files[0]

    if (!archivo) return

    const lector = new FileReader()

    lector.readAsArrayBuffer(archivo)

    lector.onload = (eventoLectura) => {

      const data = eventoLectura.target.result

      const workbook = XLSX.read(data, {
        type: "buffer"
      })

      const nombreHoja = workbook.SheetNames[0]

      const hoja = workbook.Sheets[nombreHoja]

      const datosExcel = XLSX.utils.sheet_to_json(hoja)

      const nuevosEstudiantes = datosExcel.map((fila) => ({
        nombre: fila["Apellido y Nombre"] || "",
        dni: String(fila["DNI"] || ""),
        libro: String(fila["Libro"] || ""),
        folio: String(fila["Folio"] || ""),
        ultimoAnio: fila["Último año cursado"] || "",
        fecha: fila["Fecha"] || "",
        estado: "Pendiente",
        carpeta: "---",
        seleccionado: false
      }))

importarEstudiantes(nuevosEstudiantes)

alert("Excel importado y guardado correctamente 🎉")
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>

      <label
        style={{
          backgroundColor: "#1e3a5f",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Importar Excel

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={importarArchivo}
          style={{ display: "none" }}
        />
      </label>

    </div>
  )
}