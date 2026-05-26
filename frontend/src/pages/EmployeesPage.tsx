import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import EmployeeModal from '../components/EmployeeModal'
import type { Employee } from '../types/employee';
import { employeeService } from '../services/api';

function EmployeesPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [employeeData, setEmployeeData] = useState<Employee>([])

    const handleAddEmployee = (employee: any) => {
        console.log('New employee:', employee)
    }


    useEffect(() => {
        employeeService.getAll().then(setEmployeeData)
    }, [])

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Employees</Typography>
                <Button variant="contained" onClick={() => setModalOpen(true)}>Add Employee</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Job Title</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeData.map(emp => (
                            <TableRow key={emp.id}>
                                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                                <TableCell>{emp.job_title}</TableCell>
                                <TableCell>{emp.country}</TableCell>
                                <TableCell>${emp.salary.toLocaleString()}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>
                                    <Button size="small" color="primary">Edit</Button>
                                    <Button size="small" color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <EmployeeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddEmployee}
            />
        </Box>
    )
}

export default EmployeesPage;