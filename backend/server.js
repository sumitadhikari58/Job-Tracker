require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const authRoutes = require("./routes/authRoutes.js")
const jobRoutes = require('./routes/jobRoutes')

app.use("/api/auth", authRoutes)
app.use('/api/jobs', jobRoutes)

app.get("/health",(req,res)=>{
    res.send("Website is working properly");
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})