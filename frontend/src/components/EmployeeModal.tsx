import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material'
import { useState } from 'react'

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (employee: any) => void
}

function EmployeeModal({ open, onClose, onSubmit }: Props) {
    const [form, setForm] = useState({
        first_name: '', last_name: '', job_title: '', country: '', salary: '', department: '', email: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        onSubmit({ ...form, salary: Number(form.salary) })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Employee</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label="First Name" name="first_name" onChange={handleChange} fullWidth />
                    <TextField label="Last Name" name="last_name" onChange={handleChange} fullWidth />
                    <TextField label="Job Title" name="job_title" onChange={handleChange} fullWidth />
                    <TextField label="Country" name="country" onChange={handleChange} fullWidth />
                    <TextField label="Salary" name="salary" type="number" onChange={handleChange} fullWidth />
                    <TextField label="Department" name="department" onChange={handleChange} fullWidth />
                    <TextField label="Email" name="email" onChange={handleChange} fullWidth />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EmployeeModal