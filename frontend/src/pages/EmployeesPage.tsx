import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, TablePagination } from '@mui/material'
import { useEffect, useState } from 'react'
import EmployeeModal from '../components/EmployeeModal'
import type { Employee } from '../types/employee';
import { employeeService } from '../services/api';
import { PAGE_SIZE } from '../constants';

function EmployeesPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [employeeData, setEmployeeData] = useState<Employee[]>([])
    const [page, setPage] = useState(0)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

    const handleAddEmployee = async (employee: any) => {
        const created = await employeeService.create(employee)
        setEmployeeData(prev => [...prev, created])
    }

    const handleDelete = async (id: number) => {
        await employeeService.delete(id)
        setEmployeeData(prev => prev.filter(emp => emp.id !== id))
    }

    useEffect(() => {
        employeeService.getAll().then(setEmployeeData)
    }, [])

    useEffect(() => {
        if (page * PAGE_SIZE >= employeeData.length && page > 0) setPage(0)
    }, [employeeData, page])

    const startIndex = page * PAGE_SIZE
    const visibleEmployees = employeeData.slice(startIndex, startIndex + PAGE_SIZE)

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Employees</Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditingEmployee(null)
                        setModalOpen(true)
                    }}
                >
                    Add Employee
                </Button>
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
                        {visibleEmployees.map(emp => (
                            <TableRow key={emp.id}>
                                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                                <TableCell>{emp.job_title}</TableCell>
                                <TableCell>{emp.country}</TableCell>
                                <TableCell>${emp.salary.toLocaleString()}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                            setEditingEmployee(emp)
                                            setModalOpen(true)
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button size="small" color="error" onClick={() => handleDelete(emp.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={employeeData.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={PAGE_SIZE}
                    rowsPerPageOptions={[PAGE_SIZE]}
                />
            </TableContainer>
            <EmployeeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                employee={editingEmployee}
                onSubmit={handleAddEmployee}
            />
        </Box>
    )
}

export default EmployeesPage;