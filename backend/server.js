import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import Alumno from "./models/Alumno.js"
import path from "path"
import { fileURLToPath } from "url"
import MatriculaAlumno from "./models/MatriculaAlumno.js"

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo conectado 🚀")
  })
  .catch((error) => {
    console.log("Error al conectar Mongo:", error)
  })

  function limpiarDni(dni) {
  return dni?.toString().replace(/\D/g, "")
} 
// ======================
// RUTAS API
// ======================

app.get("/alumnos", async (req, res) => {
  try {
    const alumnos = await Alumno.find()
    res.json(alumnos)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumnos"
    })
  }
})

app.post("/alumnos", async (req, res) => {
  try {
    const dniLimpio = limpiarDni(req.body.dni)

    const alumnoExistente = await Alumno.findOne({ dni: dniLimpio })

    if (alumnoExistente) {
      return res.status(400).json({
        mensaje: "Ya existe un pedido de analítico con ese DNI"
      })
    }

    const nuevoAlumno = new Alumno({
      ...req.body,
      dni: dniLimpio
    })

    await nuevoAlumno.save()
    res.json(nuevoAlumno)

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar alumno"
    })
  }
})

app.post("/alumnos/importar", async (req, res) => {
  try {
    const alumnos = req.body.alumnos

    const alumnosGuardados = await Alumno.insertMany(alumnos)

    res.json(alumnosGuardados)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al importar alumnos"
    })
  }
})

app.delete("/alumnos/:id", async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id)

    res.json({
      mensaje: "Alumno eliminado correctamente"
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar alumno"
    })
  }
})

app.put("/alumnos/:id", async (req, res) => {
  try {
    const alumnoActualizado = await Alumno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    )

    res.json(alumnoActualizado)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar alumno"
    })
  }
})

// OBTENER MATRÍCULA
app.get("/api/matricula", async (req, res) => {
  try {
    const alumnos = await MatriculaAlumno.find()

    res.json(alumnos)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener matrícula"
    })
  }
})


// GUARDAR ESTUDIANTE

app.post("/api/matricula", async (req, res) => {
  try { 
    const dniLimpio = limpiarDni(req.body.dni)

    const alumnoExistente = await MatriculaAlumno.findOne({ dni: dniLimpio })

    if (alumnoExistente) {
      return res.status(400).json({
        mensaje: "Ya existe un estudiante de matrícula con ese DNI"
      })
    }

    const nuevoAlumno = new MatriculaAlumno({
      ...req.body,
      dni: dniLimpio
    })

    await nuevoAlumno.save()
    res.json(nuevoAlumno)

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar estudiante"
    })
  }
}) 

app.put("/api/matricula/:id", async (req, res) => {
  try {
    const alumnoActualizado = await MatriculaAlumno.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    )

    res.json(alumnoActualizado)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar estudiante de matrícula"
    })
  }
})

app.delete("/api/matricula/:id", async (req, res) => {
  try {
    await MatriculaAlumno.findByIdAndDelete(req.params.id)

    res.json({
      mensaje: "Estudiante eliminado de matrícula"
    })
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar estudiante de matrícula"
    })
  }
})

// IMPORTAR MATRÍCULA DESDE EXCEL
app.post("/api/matricula/importar", async (req, res) => {
  try {
    const alumnos = req.body.alumnos

    const alumnosConRecursante = alumnos.map((alumno) => ({
      ...alumno,
      recursante:
        alumno.estadoInscripcion
          ?.toLowerCase()
          .includes("continúa mismo año de estudio") || false
    }))

    const alumnosGuardados = await MatriculaAlumno.insertMany(alumnosConRecursante)

    res.json(alumnosGuardados)
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al importar matrícula"
    })
  }
})

// ======================
// FRONTEND REACT
// ======================

app.use(
  express.static(
    path.join(__dirname, "../frontend/dist")
  )
)

app.use((req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../frontend/dist/index.html"
    )
  )
})

// ======================

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})