import { Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import EmployeeModal from '../components/EmployeeModal'
import EmployeeTable from '../components/EmployeeTable'
import type { Employee } from '../types/employee'
import { employeeService } from '../services/api'
import { PAGE_SIZE } from '../constants'

function EmployeesPage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [employeeData, setEmployeeData] = useState<Employee[]>([])
    const [page, setPage] = useState(0)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const handleEmployeeSubmit = async (employee: any) => {
        if (editingEmployee) {
            const updated = await employeeService.update(editingEmployee.id, employee)
            setEmployeeData(prev => prev.map(emp => emp.id === editingEmployee.id ? updated : emp))
            return
        }
        const created = await employeeService.create(employee)
        setEmployeeData(prev => [created, ...prev])
    }

    const handleDelete = async (id: number) => {
        await employeeService.delete(id)
        setEmployeeData(prev => prev.filter(emp => emp.id !== id))
        setDeleteConfirmId(null)
    }

    const filteredEmployees = employeeData.filter(emp => {
        const query = search.toLowerCase()
        return (
            `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query) ||
            emp.last_name.toLowerCase().includes(query) ||
            emp.job_title.toLowerCase().includes(query) ||
            emp.country.toLowerCase().includes(query)
        )
    })

    useEffect(() => {
        employeeService.getAll().then(data => {
            setEmployeeData(data)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (page * PAGE_SIZE >= employeeData.length && page > 0) setPage(0)
    }, [employeeData, page])

    if (loading) return <Typography>Loading...</Typography>

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Employees</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        size="small"
                        sx={{ width: 220 }}
                    />
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
            </Box>

            <EmployeeTable
                employees={filteredEmployees}
                page={page}
                onPageChange={setPage}
                onEdit={(emp) => { setEditingEmployee(emp); setModalOpen(true) }}
                onDelete={setDeleteConfirmId}
            />

            <EmployeeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                employee={editingEmployee}
                onSubmit={handleEmployeeSubmit}
            />

            <Dialog open={deleteConfirmId !== null} onClose={() => setDeleteConfirmId(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this employee?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                    <Button color="error" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EmployeesPage