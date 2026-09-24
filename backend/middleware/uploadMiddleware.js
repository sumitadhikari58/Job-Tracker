const multer = require('multer')

// Keep the file in memory - it's only forwarded to the AI model, never stored
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            const err = new Error("Resume must be a PDF")
            err.status = 400
            return cb(err)
        }
        cb(null, true)
    },
})

module.exports = upload
