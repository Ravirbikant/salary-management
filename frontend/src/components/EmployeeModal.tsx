import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type { Employee } from '../types/employee'

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (employee: any) => void
    employee?: Employee | null
}

const emptyForm = {
    first_name: '',
    last_name: '',
    job_title: '',
    country: '',
    salary: '',
    department: '',
    email: ''
}

function EmployeeModal({ open, onClose, onSubmit, employee }: Props) {
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState('')

    useEffect(() => {
        if (employee) {
            setForm({
                first_name: employee.first_name,
                last_name: employee.last_name,
                job_title: employee.job_title,
                country: employee.country,
                salary: String(employee.salary),
                department: employee.department,
                email: employee.email
            })
        } else {
            setForm(emptyForm)
        }
    }, [employee])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (!form.first_name.trim() || !form.last_name.trim() || !form.job_title.trim() || !form.country.trim() || !form.salary) {
            setError('Please fill in all required fields')
            return
        }
        setError('')
        onSubmit({ ...form, salary: Number(form.salary) })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} fullWidth />
                    <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth />
                    <TextField label="Job Title" name="job_title" value={form.job_title} onChange={handleChange} fullWidth />
                    <TextField label="Country" name="country" value={form.country} onChange={handleChange} fullWidth />
                    <TextField label="Salary" name="salary" type="number" value={form.salary} onChange={handleChange} fullWidth />
                    <TextField label="Department" name="department" value={form.department} onChange={handleChange} fullWidth />
                    <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
                </Box>

                {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">{employee ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EmployeeModal