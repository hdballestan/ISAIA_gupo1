-- Migration: Add VirusTotal scan fields to certificates table
-- Created: 2026-04-17
-- Task: T-2026-04-17-03

ALTER TABLE certificates ADD COLUMN vt_last_scan TIMESTAMP NULL;
ALTER TABLE certificates ADD COLUMN vt_threat_level VARCHAR(20) NOT NULL DEFAULT 'unknown';
ALTER TABLE certificates ADD COLUMN vt_note VARCHAR(255) NULL;
