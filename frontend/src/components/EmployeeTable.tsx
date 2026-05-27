import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Box } from '@mui/material'
import type { Employee } from '../types/employee'
import { PAGE_SIZE } from '../constants'

interface Props {
    employees: Employee[]
    page: number
    onPageChange: (page: number) => void
    onEdit: (employee: Employee) => void
    onDelete: (id: number) => void
}

function EmployeeTable({ employees, page, onPageChange, onEdit, onDelete }: Props) {
    const startIndex = page * PAGE_SIZE
    const visibleEmployees = employees.slice(startIndex, startIndex + PAGE_SIZE)

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '75vh' }}>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Job Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Country</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="right">Salary</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Department</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleEmployees.map(emp => (
                            <TableRow key={emp.id} hover>
                                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                                <TableCell>{emp.job_title}</TableCell>
                                <TableCell>{emp.country}</TableCell>
                                <TableCell align="right">${emp.salary.toLocaleString()}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell align="center">
                                    <Button size="small" color="primary" onClick={() => onEdit(emp)}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => onDelete(emp.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
                <TablePagination
                    component="div"
                    count={employees.length}
                    page={page}
                    onPageChange={(_, newPage) => onPageChange(newPage)}
                    rowsPerPage={PAGE_SIZE}
                    rowsPerPageOptions={[PAGE_SIZE]}
                />
            </Box>
        </Paper>
    )
}

export default EmployeeTable