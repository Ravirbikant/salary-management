const db = require('./db/database');
const fs = require('fs');
const path = require('path');

const firstNames = fs.readFileSync(path.join(__dirname, './data/first_names.txt'), 'utf8')
    .split('\n')
    .map(name => name.trim())
    .filter(Boolean);

const lastNames = fs.readFileSync(path.join(__dirname, './data/last_names.txt'), 'utf8')
    .split('\n')
    .map(name => name.trim())
    .filter(Boolean);

const roles = [
    { job_title: 'Software Engineer', department: 'Engineering' },
    { job_title: 'DevOps Engineer', department: 'Engineering' },
    { job_title: 'QA Engineer', department: 'QA' },
    { job_title: 'Designer', department: 'Design' },
    { job_title: 'Product Manager', department: 'Product' },
    { job_title: 'HR Manager', department: 'HR' },
    { job_title: 'HR Executive', department: 'HR' },
    { job_title: 'Data Analyst', department: 'Data' },
    { job_title: 'Data Engineer', department: 'Data' },
];

const countries = ['India', 'USA', 'UK', 'Germany', 'Canada', 'Australia'];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomSalary = () => Math.floor(Math.random() * 150000) + 30000;

const seedEmployees = db.transaction(() => {
    db.prepare('DELETE FROM employees').run();

    const insert = db.prepare(`
    INSERT INTO employees (first_name, last_name, job_title, country, salary, department, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    for (let i = 0; i < 10000; i++) {
        const first = random(firstNames);
        const last = random(lastNames);
        const role = random(roles);
        const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`;
        insert.run(first, last, role.job_title, random(countries), randomSalary(), role.department, email);
    }
});

seedEmployees();
console.log('Seeded 10,000 employees successfully!');