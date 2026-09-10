const db = require('../config/db')

// GET all jobs for the logged-in user
const getJobs = async (req, res) => {
    try {
        const userId = req.user.id
        const [rows] = await db.query('SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC', [userId])
        res.status(200).json(rows)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET a single job by id (only if it belongs to the logged-in user)
const getJobById = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params
        const [rows] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [id, userId])

        if (rows.length === 0) {
            return res.status(404).json({ message: "Job not found" })
        }

        res.status(200).json(rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST create a new job
const createJob = async (req, res) => {
    try {
        const userId = req.user.id
        const { company_name, role, status, job_link, notes, date_applied } = req.body

        const [result] = await db.query(
            `INSERT INTO jobs (user_id, company_name, role, status, job_link, notes, date_applied)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, company_name, role, status || 'Applied', job_link, notes, date_applied]
        )

        res.status(201).json({ message: "Job created successfully", jobId: result.insertId })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PUT update an existing job
const updateJob = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params
        const { company_name, role, status, job_link, notes, date_applied } = req.body

        const [existing] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [id, userId])
        if (existing.length === 0) {
            return res.status(404).json({ message: "Job not found" })
        }

        await db.query(
            `UPDATE jobs SET company_name = ?, role = ?, status = ?, job_link = ?, notes = ?, date_applied = ?
             WHERE id = ? AND user_id = ?`,
            [company_name, role, status, job_link, notes, date_applied, id, userId]
        )

        res.status(200).json({ message: "Job updated successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE a job
const deleteJob = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params

        const [existing] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [id, userId])
        if (existing.length === 0) {
            return res.status(404).json({ message: "Job not found" })
        }

        await db.query('DELETE FROM jobs WHERE id = ? AND user_id = ?', [id, userId])
        res.status(200).json({ message: "Job deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob }
