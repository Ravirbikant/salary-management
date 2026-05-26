import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import EmployeesPage from './EmployeesPage'
import * as api from '../services/api'
import type { Employee } from '../types/employee'

vi.mock('../services/api')

describe('EmployeesPage', () => {
    it('should fetch and display employees on load', async () => {
        const mockEmployees: Employee[] = [
            { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' }
        ]

        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(mockEmployees)

        render(<EmployeesPage />)

        await waitFor(() => {
            expect(screen.getByText('Ravi Sharma')).toBeInTheDocument()
        })
    })

    it('adds employee when modal submits', async () => {
        const existing: Employee[] = [
            { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' }
        ]
        const newEmployee: Employee = {
            id: 2, first_name: 'Jane', last_name: 'Doe', job_title: 'Designer', country: 'USA', salary: 60000, department: 'Design', email: 'jane@test.com'
        }

        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(existing)
        vi.spyOn(api.employeeService, 'create').mockResolvedValue(newEmployee)

        const user = userEvent.setup()
        render(<EmployeesPage />)

        await waitFor(() => {
            expect(screen.getByText('Ravi Sharma')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: 'Add Employee' }))
        await user.type(screen.getByLabelText('First Name'), 'Jane')
        await user.type(screen.getByLabelText('Last Name'), 'Doe')
        await user.type(screen.getByLabelText('Job Title'), 'Designer')
        await user.type(screen.getByLabelText('Country'), 'USA')
        await user.type(screen.getByLabelText('Salary'), '60000')
        await user.type(screen.getByLabelText('Department'), 'Design')
        await user.type(screen.getByLabelText('Email'), 'jane@test.com')
        await user.click(screen.getByRole('button', { name: 'Add' }))

        expect(api.employeeService.create).toHaveBeenCalledWith({
            first_name: 'Jane',
            last_name: 'Doe',
            job_title: 'Designer',
            country: 'USA',
            salary: 60000,
            department: 'Design',
            email: 'jane@test.com'
        })

        await waitFor(() => {
            expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        })
    })

    it('deletes employee when delete is clicked', async () => {
        const employees: Employee[] = [
            { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' },
            { id: 2, first_name: 'Jane', last_name: 'Doe', job_title: 'Designer', country: 'USA', salary: 60000, department: 'Design', email: 'jane@test.com' }
        ]

        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(employees)
        vi.spyOn(api.employeeService, 'delete').mockResolvedValue({})

        const user = userEvent.setup()
        render(<EmployeesPage />)

        await waitFor(() => {
            expect(screen.getByText('Ravi Sharma')).toBeInTheDocument()
            expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        })

        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
        await user.click(deleteButtons[0])

        expect(api.employeeService.delete).toHaveBeenCalledWith(1)

        await waitFor(() => {
            expect(screen.queryByText('Ravi Sharma')).not.toBeInTheDocument()
        })
    })
})