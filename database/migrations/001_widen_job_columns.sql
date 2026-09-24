-- Run this once if your database was created with the original schema.sql
-- (company_name 30 / role 20 / job_link 40 chars were too short for real listings)
USE job_tracker;

UPDATE jobs SET status = 'Applied' WHERE status IS NULL;

ALTER TABLE jobs
    MODIFY COLUMN company_name VARCHAR(100) NOT NULL,
    MODIFY COLUMN role VARCHAR(100) NOT NULL,
    MODIFY COLUMN job_link VARCHAR(500),
    MODIFY COLUMN status ENUM('Applied', 'OA', 'Interview', 'Offer', 'Rejected') NOT NULL DEFAULT 'Applied';
