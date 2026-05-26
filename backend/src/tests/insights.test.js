const request = require('supertest');
const app = require('../app');
const db = require('../db/database');

afterEach(() => {
    db.prepare('DELETE FROM employees').run();
});

describe('GET /insights/country/:country', () => {
    beforeEach(async () => {
        await request(app).post('/employees').send({
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Engineer',
            country: 'India',
            salary: 50000,
            department: 'Engineering',
            email: 'ravi2.sharma@test.com'
        });

        await request(app).post('/employees').send({
            first_name: 'Priya',
            last_name: 'Singh',
            job_title: 'Designer',
            country: 'India',
            salary: 70000,
            department: 'Design',
            email: 'priya.singh@test.com'
        });
    });

    it('should return min, max and average salary for a country', async () => {
        const response = await request(app).get('/insights/country/India');
        expect(response.status).toBe(200);
        expect(response.body.min).toBe(50000);
        expect(response.body.max).toBe(70000);
        expect(response.body.average).toBe(60000);
    });

    it('should return 404 if no employees found for country', async () => {
        const response = await request(app).get('/insights/country/Antarctica');
        expect(response.status).toBe(404);
    });

});

describe('GET /insights/jobtitle', () => {
    beforeEach(async () => {
        await request(app).post('/employees').send({
            first_name: 'John',
            last_name: 'Doe',
            job_title: 'Engineer',
            country: 'India',
            salary: 50000,
            department: 'Engineering',
            email: 'john.doe@test.com'
        });
    });

    it('should return average salary for a job title in a country', async () => {
        const response = await request(app)
            .get('/insights/jobtitle')
            .query({ job_title: 'Engineer', country: 'India' });

        expect(response.status).toBe(200);
        expect(response.body.average).toBeDefined();
        expect(response.body.job_title).toBe('Engineer');
        expect(response.body.country).toBe('India');
    });

    it('should return 400 if query params are missing', async () => {
        const response = await request(app).get('/insights/jobtitle');
        expect(response.status).toBe(400);
    });
});

describe('GET /insights/department', () => {
    beforeEach(async () => {
        await request(app).post('/employees').send({
            first_name: 'Jane',
            last_name: 'Doe',
            job_title: 'Engineer',
            country: 'India',
            salary: 60000,
            department: 'Engineering',
            email: 'jane.doe@test.com'
        });

        await request(app).post('/employees').send({
            first_name: 'Mike',
            last_name: 'Ross',
            job_title: 'Designer',
            country: 'India',
            salary: 50000,
            department: 'Design',
            email: 'mike.ross@test.com'
        });
    });

    it('should return average salary per department for a country', async () => {
        const response = await request(app)
            .get('/insights/department')
            .query({ country: 'India' });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('department');
        expect(response.body[0]).toHaveProperty('average');
        expect(response.body.find(d => d.department === 'Design').average).toBe(50000);
    });
});