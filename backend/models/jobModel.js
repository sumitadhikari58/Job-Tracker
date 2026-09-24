const db = require('../config/db')

const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

const findAllByUser = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM jobs WHERE user_id = ? ORDER BY date_applied DESC, created_at DESC',
        [userId]
    )
    return rows
}

const findByIdForUser = async (id, userId) => {
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [id, userId])
    return rows[0]
}

const create = async (userId, job) => {
    const [result] = await db.query(
        `INSERT INTO jobs (user_id, company_name, role, status, job_link, notes, date_applied)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, job.company_name, job.role, job.status, job.job_link, job.notes, job.date_applied]
    )
    return result.insertId
}

const update = async (id, userId, job) => {
    await db.query(
        `UPDATE jobs SET company_name = ?, role = ?, status = ?, job_link = ?, notes = ?, date_applied = ?
         WHERE id = ? AND user_id = ?`,
        [job.company_name, job.role, job.status, job.job_link, job.notes, job.date_applied, id, userId]
    )
}

const remove = async (id, userId) => {
    const [result] = await db.query('DELETE FROM jobs WHERE id = ? AND user_id = ?', [id, userId])
    return result.affectedRows
}

module.exports = { STATUSES, findAllByUser, findByIdForUser, create, update, remove }
