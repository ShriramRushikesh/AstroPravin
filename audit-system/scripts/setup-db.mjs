import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const envPath = path.resolve(process.cwd(), '.env.local');
let env = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const dbConfig = {
    host: env.MYSQL_HOST || 'localhost',
    user: env.MYSQL_USER || 'root',
    password: env.MYSQL_PASSWORD || '',
    multipleStatements: true
};

async function setup() {
    console.log('🔵 Connecting to MySQL...');
    const connection = await mysql.createConnection(dbConfig);

    console.log('🔵 Creating Database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${env.MYSQL_DATABASE || 'audit_system'}`);
    await connection.query(`USE ${env.MYSQL_DATABASE || 'audit_system'}`);

    console.log('🔵 Creating Tables...');
    const schema = `
    SET FOREIGN_KEY_CHECKS = 0;
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS submissions;
    DROP TABLE IF EXISTS audit_sections;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS colleges;
    SET FOREIGN_KEY_CHECKS = 1;

    CREATE TABLE colleges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      logo_url VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('SUPER_ADMIN', 'ASSOCIATE_AUDITOR', 'COLLEGE') NOT NULL,
      college_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL
    );

    CREATE TABLE audit_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      college_id INT NOT NULL,
      section_id INT NOT NULL,
      data JSON,
      status ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
      deadline DATETIME NULL, 
      locked_at DATETIME NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_submission (college_id, section_id),
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES audit_sections(id) ON DELETE CASCADE
    );

    CREATE TABLE comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      submission_id INT NOT NULL,
      user_id INT NOT NULL, 
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      action_type VARCHAR(50) NOT NULL,
      resource_entity VARCHAR(50) NOT NULL,
      resource_id INT NULL,
      details TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `;
    await connection.query(schema);

    console.log('🔵 Seeding Colleges...');
    const colleges = [
        ['Tech Institute of Innovation', 'Pune'],
        ['Global Management Academy', 'Mumbai'],
        ['City Arts & Science College', 'Delhi'],
        ['Blue River Engineering', 'Bangalore'],
        ['Sunrise Medical Campus', 'Chennai'],
        ['Northern Law School', 'Chandigarh'],
        ['Oceanic Maritime Studies', 'Goa'],
        ['Vedic Heritage Institute', 'Varanasi'],
        ['Royal Commerce College', 'Jaipur'],
        ['Green Verify Polytechnic', 'Hyderabad']
    ];
    await connection.query('INSERT INTO colleges (name, location) VALUES ?', [colleges]);

    console.log('🔵 Seeding Users...');
    const passwordHash = await bcrypt.hash('demo123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    const users = [
        ['Super Admin', 'admin@audit.com', adminHash, 'SUPER_ADMIN', null],
        ['Jane Auditor', 'auditor@audit.com', passwordHash, 'ASSOCIATE_AUDITOR', null],
        ['Tech Rep', 'tech@college.com', passwordHash, 'COLLEGE', 1],
        ['Global Rep', 'global@college.com', passwordHash, 'COLLEGE', 2],
        ['Sunrise Rep', 'sunrise@college.com', passwordHash, 'COLLEGE', 5]
    ];
    await connection.query('INSERT INTO users (full_name, email, password_hash, role, college_id) VALUES ?', [users]);

    console.log('🔵 Seeding Audit Sections...');
    const sections = [
        ['Infrastructure Audit', 'Details about buildings, labs,land wifi.'],
        ['Financial Report', 'Annual budget, expenses, and audit reports.'],
        ['Faculty Details', 'List of permanent and visiting faculty.'],
        ['Student Admissions', 'Intake capacity and actual admissions.'],
        ['Research & Publications', 'Journals, patents, and conferences.']
    ];
    await connection.query('INSERT INTO audit_sections (title, description) VALUES ?', [sections]);

    console.log('🔵 Seeding Scenarios...');
    await connection.query(`
    INSERT INTO submissions (college_id, section_id, data, status, deadline)
    VALUES (1, 1, '{"classrooms": 50, "labs": 10, "wifi_speed": "1Gbps"}', 'APPROVED', '2025-12-31 23:59:59')
  `);

    await connection.query(`
    INSERT INTO submissions (college_id, section_id, data, status, deadline)
    VALUES (2, 2, '{"budget": 5000000, "expenses": 5100000, "misc": "Unknown"}', 'REJECTED', '2025-12-31 23:59:59')
  `);

    await connection.query(`
    INSERT INTO comments (submission_id, user_id, content) 
    SELECT s.id, u.id, 'Please clarify the miscellaneous expenses row.'
    FROM submissions s, users u 
    WHERE s.college_id = 2 AND s.section_id = 2 AND u.email = 'auditor@audit.com'
  `);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().slice(0, 19).replace('T', ' ');

    await connection.query(`
    INSERT INTO submissions (college_id, section_id, data, status, deadline)
    VALUES (5, 3, '{}', 'DRAFT', ?)
  `, [dateStr]);

    console.log('✅ Database Setup Complete!');
    process.exit(0);
}

setup().catch(err => {
    console.error(err);
    process.exit(1);
});
