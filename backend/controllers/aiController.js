const { GoogleGenerativeAI } = require('@google/generative-ai')

const PROMPT = `You are a technical recruiter. Compare the attached resume (PDF) against the job description below.
Respond with JSON only, using exactly this shape:
{
  "score": <integer 0-100, how well the resume matches the role>,
  "verdict": "<short headline, e.g. 'Strong match' or 'Partial match'>",
  "summary": "<one or two sentences explaining the score>",
  "strengths": ["<3-5 short points where the resume matches the role>"],
  "gaps": ["<3-5 short, actionable points the candidate should address>"]
}

Job description:
`

const toStringList = (value) =>
    Array.isArray(value) ? value.filter((v) => typeof v === 'string' && v.trim()).slice(0, 6) : []

// POST /api/ai/resume-match  (multipart: resume = PDF file, job_description = text)
const resumeMatch = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ message: "AI feature is not configured (GEMINI_API_KEY missing)" })
        }

        const jobDescription = req.body.job_description?.trim()
        if (!req.file) {
            return res.status(400).json({ message: "Resume PDF is required" })
        }
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" })
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        })

        const result = await model.generateContent([
            { inlineData: { mimeType: 'application/pdf', data: req.file.buffer.toString('base64') } },
            { text: PROMPT + jobDescription.slice(0, 15000) },
        ])

        const parsed = JSON.parse(result.response.text())
        const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)))

        res.status(200).json({
            score,
            verdict: String(parsed.verdict || ''),
            summary: String(parsed.summary || ''),
            strengths: toStringList(parsed.strengths),
            gaps: toStringList(parsed.gaps),
        })
    } catch (err) {
        console.error("Resume match failed:", err.message)
        res.status(502).json({ message: "Couldn't analyze the resume right now. Try again." })
    }
}

module.exports = { resumeMatch }
