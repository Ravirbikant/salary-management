const express = require('express');
const router = express.Router();
const { getAllEmployees, createEmployee, updateEmployee } = require('../controllers/employeeController');

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);

module.exports = router;