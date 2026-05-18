import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import Alumno from "./models/Alumno.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo conectado 🚀")
  })
  .catch((error) => {
    console.log("Error al conectar Mongo:", error)
  })

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀")
})
app.get("/alumnos", async (req, res) => {

  const alumnos = await Alumno.find()

  res.json(alumnos)

})

app.post("/alumnos", async (req, res) => {

  const nuevoAlumno = new Alumno(req.body)

  await nuevoAlumno.save()

  res.json(nuevoAlumno)

})

app.delete("/alumnos/:id", async (req, res) => {
  await Alumno.findByIdAndDelete(req.params.id)

  res.json({
    mensaje: "Alumno eliminado correctamente"
  })
})

app.put("/alumnos/:id", async (req, res) => {
  const alumnoActualizado = await Alumno.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.json(alumnoActualizado)
})

app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001")
})