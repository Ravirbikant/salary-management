const db = require('../db/database');

const getAllEmployees = (req, res) => {
    const employees = db.prepare('SELECT * FROM employees').all();
    res.json(employees);
};

const createEmployee = (req, res) => {
    const { first_name, last_name, job_title, country, salary, department, email } = req.body;

    const result = db.prepare(`
    INSERT INTO employees (first_name, last_name, job_title, country, salary, department, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(first_name, last_name, job_title, country, salary, department, email);

    const employee = db.prepare(`SELECT * FROM employees WHERE id = ${result.lastInsertRowid}`).get();
    res.status(201).json(employee);
};

const updateEmployee = (req, res) => {
    const { id } = req.params;
    const fields = req.body;

    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    db.prepare(`UPDATE employees SET ${setClause} WHERE id = ?`).run(...values);

    const employee = db.prepare(`SELECT * FROM employees WHERE id = ${id}`).get();
    res.json(employee);
};

module.exports = { getAllEmployees, createEmployee, updateEmployee };

