const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController')

// All job routes are protected - user must be logged in
router.get('/', authMiddleware, getJobs)
router.get('/:id', authMiddleware, getJobById)
router.post('/', authMiddleware, createJob)
router.put('/:id', authMiddleware, updateJob)
router.delete('/:id', authMiddleware, deleteJob)

module.exports = router
