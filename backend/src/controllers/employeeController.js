const db = require('../db/database');

const getAllEmployees = (req, res) => {
    const employees = db.prepare('SELECT * FROM employees').all();
    res.json(employees);
};

const createEmployee = (req, res) => {
    const { first_name, last_name, job_title, country, salary, department, email } = req.body;

    if (!first_name || !last_name || !job_title || !country || !salary) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof salary !== 'number' || salary < 0) {
        return res.status(400).json({ error: 'Salary must be a positive number' });
    }

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

const deleteEmployee = (req, res) => {
    const { id } = req.params;

    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

    if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    db.prepare('DELETE FROM employees WHERE id = ?').run(id);
    res.json({ message: 'Employee deleted successfully' });
};

const getEmployeeById = (req, res) => {
    const { id } = req.params;
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

    if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
};

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };

