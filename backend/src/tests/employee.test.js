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

    it('should return 400 if first_name is missing', async () => {
        const response = await request(app).post('/employees').send({
            last_name: 'Sharma',
            job_title: 'Engineer',
            country: 'India',
            salary: 50000,
            department: 'Engineering',
            email: 'test@test.com'
        });
        expect(response.status).toBe(400);
    });

    it('should return 400 if country is missing', async () => {
        const response = await request(app).post('/employees').send({
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Engineer',
            salary: 50000,
            department: 'Engineering',
            email: 'nocountry@test.com'
        });
        expect(response.status).toBe(400);
    });

    it('should return 400 if salary is negative', async () => {
        const response = await request(app).post('/employees').send({
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Engineer',
            country: 'India',
            salary: -1000,
            department: 'Engineering',
            email: 'negative@test.com'
        });
        expect(response.status).toBe(400);
    });

    it('should return 400 if salary is not a number', async () => {
        const response = await request(app).post('/employees').send({
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Engineer',
            country: 'India',
            salary: 'notanumber',
            department: 'Engineering',
            email: 'nonum@test.com'
        });
        expect(response.status).toBe(400);
    });

    it('should return 409 if email is duplicate', async () => {
        await request(app).post('/employees').send({
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Engineer',
            country: 'India',
            salary: 50000,
            department: 'Engineering',
            email: 'duplicate@test.com'
        });

        const response = await request(app).post('/employees').send({
            first_name: 'Priya',
            last_name: 'Singh',
            job_title: 'Designer',
            country: 'India',
            salary: 60000,
            department: 'Design',
            email: 'duplicate@test.com'
        });
        expect(response.status).toBe(409);
    });

    it('should return 400 if first_name is blank spaces', async () => {
        const response = await request(app).post('/employees').send({
            first_name: '   ',
            last_name: 'Sharma',
            job_title: 'Engineer',
            country: 'India',
            salary: 50000,
            department: 'Engineering',
            email: 'emptyname@test.com'
        });
        expect(response.status).toBe(400);
    });
});

describe('PUT /employees/:id', () => {
    it('should update an existing employee', async () => {
        const created = await request(app).post('/employees').send({
            first_name: 'Test',
            last_name: 'User',
            job_title: 'Designer',
            country: 'India',
            salary: 40000,
            department: 'Design',
            email: 'test.user@test.com'
        });

        const response = await request(app)
            .put(`/employees/${created.body.id}`)
            .send({ salary: 60000 });

        expect(response.status).toBe(200);
        expect(response.body.salary).toBe(60000);
    });

    it('should return 404 if employee does not exist', async () => {
        const response = await request(app)
            .put('/employees/99999')
            .send({ salary: 60000 });
        expect(response.status).toBe(404);
    });
});

describe('DELETE /employees/:id', () => {
    it('should delete an existing employee', async () => {
        const created = await request(app).post('/employees').send({
            first_name: 'Delete',
            last_name: 'Me',
            job_title: 'Tester',
            country: 'India',
            salary: 30000,
            department: 'QA',
            email: 'delete.me@test.com'
        });

        const response = await request(app).delete(`/employees/${created.body.id}`);
        expect(response.status).toBe(200);

        const check = await request(app).get(`/employees/${created.body.id}`);
        expect(check.status).toBe(404);
    });
});

describe('GET /employees/:id', () => {
    it('should return a single employee', async () => {
        const created = await request(app).post('/employees').send({
            first_name: 'Single',
            last_name: 'Employee',
            job_title: 'Manager',
            country: 'India',
            salary: 70000,
            department: 'HR',
            email: 'single.employee@test.com'
        });

        const response = await request(app).get(`/employees/${created.body.id}`);
        expect(response.status).toBe(200);
        expect(response.body.first_name).toBe('Single');
    });

    it('should return 404 if employee not found', async () => {
        const response = await request(app).get('/employees/99999');
        expect(response.status).toBe(404);
    });
});

