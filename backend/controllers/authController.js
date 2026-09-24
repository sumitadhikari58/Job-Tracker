const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const signToken = (user) =>
    jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

const register = async (req, res) => {
    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const { password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" })
        }
        if (name.length > 30) {
            return res.status(400).json({ message: "Name must be at most 30 characters" })
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        if (await User.findByEmail(email)) {
            return res.status(409).json({ message: "Email is already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const id = await User.create({ name, email, password: hashedPassword })
        const user = { id, name, email }

        return res.status(201).json({ message: "User registered successfully", token: signToken(user), user })
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()
        const { password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findByEmail(email)
        // Same response for unknown email and wrong password so accounts can't be enumerated
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        return res.status(200).json({
            message: "Login Successful",
            token: signToken(user),
            user: { id: user.id, name: user.name, email: user.email },
        })
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

// GET the currently logged-in user
const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = { register, login, me }
