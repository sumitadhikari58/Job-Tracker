const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const { resumeMatch } = require('../controllers/aiController')

router.post('/resume-match', authMiddleware, upload.single('resume'), resumeMatch)

module.exports = router
