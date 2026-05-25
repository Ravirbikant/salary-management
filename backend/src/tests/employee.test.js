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