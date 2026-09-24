const Job = require('../models/jobModel')

const FIELD_LIMITS = { company_name: 100, role: 100, job_link: 500 }

// Trim strings and turn empty optional values into null
const clean = (value) => {
    if (typeof value !== 'string') return value ?? null
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
}

// Returns an error message, or null if the job is valid
const validateJob = (job) => {
    if (!job.company_name) return "Company name is required"
    if (!job.role) return "Role is required"
    if (!job.date_applied) return "Date applied is required"
    if (!/^\d{4}-\d{2}-\d{2}$/.test(job.date_applied) || isNaN(Date.parse(job.date_applied))) {
        return "Date applied must be a valid date (YYYY-MM-DD)"
    }
    if (!Job.STATUSES.includes(job.status)) {
        return `Status must be one of: ${Job.STATUSES.join(', ')}`
    }
    for (const [field, max] of Object.entries(FIELD_LIMITS)) {
        if (job[field] && job[field].length > max) {
            return `${field} must be at most ${max} characters`
        }
    }
    return null
}

const pickJobFields = (body) => ({
    company_name: clean(body.company_name),
    role: clean(body.role),
    status: clean(body.status),
    job_link: clean(body.job_link),
    notes: clean(body.notes),
    date_applied: clean(body.date_applied),
})

// GET all jobs for the logged-in user
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAllByUser(req.user.id)
        res.status(200).json(jobs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET a single job by id (only if it belongs to the logged-in user)
const getJobById = async (req, res) => {
    try {
        const job = await Job.findByIdForUser(req.params.id, req.user.id)
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }
        res.status(200).json(job)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST create a new job
const createJob = async (req, res) => {
    try {
        const job = pickJobFields(req.body)
        job.status = job.status || 'Applied'

        const error = validateJob(job)
        if (error) {
            return res.status(400).json({ message: error })
        }

        const jobId = await Job.create(req.user.id, job)
        const created = await Job.findByIdForUser(jobId, req.user.id)
        res.status(201).json({ message: "Job created successfully", jobId, job: created })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PUT update an existing job - only the fields sent are changed,
// so a status-only update like { status: 'Interview' } works
const updateJob = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const existing = await Job.findByIdForUser(id, userId)
        if (!existing) {
            return res.status(404).json({ message: "Job not found" })
        }

        const updates = pickJobFields(req.body)
        const job = {}
        for (const field of Object.keys(updates)) {
            job[field] = field in req.body ? updates[field] : existing[field]
        }

        const error = validateJob(job)
        if (error) {
            return res.status(400).json({ message: error })
        }

        await Job.update(id, userId, job)
        const updated = await Job.findByIdForUser(id, userId)
        res.status(200).json({ message: "Job updated successfully", job: updated })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE a job
const deleteJob = async (req, res) => {
    try {
        const deleted = await Job.remove(req.params.id, req.user.id)
        if (!deleted) {
            return res.status(404).json({ message: "Job not found" })
        }
        res.status(200).json({ message: "Job deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob }
