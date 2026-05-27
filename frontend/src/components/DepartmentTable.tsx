import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import type { Employee } from '../types/employee'

interface Props {
    employees: Employee[]
    country: string
}

function DepartmentTable({ employees, country }: Props) {
    const breakdown = Object.entries(
        employees
            .filter(e => e.country === country)
            .reduce((acc: Record<string, number[]>, e) => {
                if (!acc[e.department]) acc[e.department] = []
                acc[e.department].push(e.salary)
                return acc
            }, {})
    )

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {['Department', 'Avg Salary', 'Min Salary', 'Max Salary', 'Employees'].map(h => (
                            <TableCell key={h} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>{h}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {breakdown.map(([dept, salaries]) => (
                        <TableRow key={dept} hover>
                            <TableCell>{dept}</TableCell>
                            <TableCell>${Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length).toLocaleString()}</TableCell>
                            <TableCell>${Math.min(...salaries).toLocaleString()}</TableCell>
                            <TableCell>${Math.max(...salaries).toLocaleString()}</TableCell>
                            <TableCell>{salaries.length}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DepartmentTable