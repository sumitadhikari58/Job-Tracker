require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set - add it to backend/.env")
    process.exit(1)
}

// CLIENT_URL can be a comma separated list of allowed frontend origins
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((o) => o.trim()) : true
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const authRoutes = require("./routes/authRoutes.js")
const jobRoutes = require('./routes/jobRoutes')
const aiRoutes = require('./routes/aiRoutes')

app.use("/api/auth", authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/ai', aiRoutes)

app.get("/health",(req,res)=>{
    res.send("Website is working properly");
})

// Unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

// Fallback error handler (e.g. malformed JSON body)
app.use((err, req, res, next) => {
    // multer errors (e.g. file too large) are client errors
    const status = err.name === 'MulterError' ? 400 : err.status || err.statusCode || 500
    res.status(status).json({ message: status === 500 ? "Something went wrong" : err.message })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
