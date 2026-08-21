require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const authRoutes = require("./routes/authRoutes.js")
app.use("/api/auth",authRoutes);
app.get("/health",(req,res)=>{
    res.send("Website is working properly");
})
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

