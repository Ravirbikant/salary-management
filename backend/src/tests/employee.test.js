const db = require('../db/database');

describe('Database setup', () => {
    it('should have employees table', () => {
        const table = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='employees'
    `).get();

        expect(table).toBeDefined();
        expect(table.name).toBe('employees');
    });
});

const request = require('supertest');
const app = require('../app');

describe('GET /employees', () => {
    it('should return a list of employees', async () => {
        const response = await request(app).get('/employees');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('POST /employees', () => {
    it('should create a new employee', async () => {
        const newEmployee = {
            first_name: 'Ravi',
            last_name: 'Kant',
            job_title: 'Software Engineer',
            country: 'India',
            salary: 150000,
            department: 'Engineering',
            email: 'ravi.kant@test.com'
        };

        const response = await request(app).post('/employees').send(newEmployee);
        expect(response.status).toBe(201);
        expect(response.body.first_name).toBe('Ravi');
    });
});