const db = require('../db/database');

const getAllEmployees = (req, res) => {
    const employees = db.prepare('SELECT * FROM employees').all();
    res.json(employees);
};

module.exports = { getAllEmployees };