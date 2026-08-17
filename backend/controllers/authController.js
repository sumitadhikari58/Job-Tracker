const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const register = async(req,res) =>{
    try{
    const{name,email,password} = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
 await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            name,
            email,
            hashedPassword,
        ]);
        return res.status(201).json({ message: "User registered successfully" })
    }
catch(err){
    return res.status(500).json({message:err.message})
}
}
const login = async(req,res)=>{
    try{
        const{email,password} = req.body;
        const [rows] = await db.query('SELECT * FROM USERS WHERE email = ?',[email]);
        if(rows.length == 0){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,rows[0].password);
        if(!isMatch){
             return res.status(401).json({message:"Password mismatched"});
        }
        const token = jwt.sign({id:rows[0].id,email:rows[0].email},process.env.JWT_SECRET,{expiresIn:"7d"});
        return res.status(200).json({message:"Login Successful",token});
    }
    catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}
module.exports = {register,login};
      