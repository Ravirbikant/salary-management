import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from '@mui/material'
import { useState } from 'react'
import EmployeeModal from '../components/EmployeeModal'

const dummyEmployees = [
    { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Software Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' },
    { id: 2, first_name: 'Priya', last_name: 'Singh', job_title: 'Designer', country: 'India', salary: 70000, department: 'Design', email: 'priya@test.com' },
    { id: 3, first_name: 'John', last_name: 'Doe', job_title: 'Product Manager', country: 'USA', salary: 90000, department: 'Product', email: 'john@test.com' },
]

function EmployeesPage() {
    const [modalOpen, setModalOpen] = useState(false)

    const handleAddEmployee = (employee: any) => {
        console.log('New employee:', employee)
    }

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
                        {dummyEmployees.map(emp => (
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