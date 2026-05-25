const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.get('/:id', getEmployeeById);

module.exports = router;