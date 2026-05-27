import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import EmployeesPage from './EmployeesPage'
import * as api from '../services/api'
import type { Employee } from '../types/employee'

vi.mock('../services/api')

describe('EmployeesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
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

        const allDeleteButtons = screen.getAllByRole('button', { name: 'Delete', hidden: true })
        await user.click(allDeleteButtons[allDeleteButtons.length - 1])

        expect(api.employeeService.delete).toHaveBeenCalledWith(1)

        await waitFor(() => {
            expect(screen.queryByText('Ravi Sharma')).not.toBeInTheDocument()
        })
    })

    it('opens edit modal with prefilled data when edit is clicked', async () => {
        const employees: Employee[] = [
            { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' }
        ]

        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(employees)

        const user = userEvent.setup()
        render(<EmployeesPage />)

        await waitFor(() => {
            expect(screen.getByText('Ravi Sharma')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: 'Edit' }))

        expect(screen.getByLabelText('First Name')).toHaveValue('Ravi')
        expect(screen.getByLabelText('Last Name')).toHaveValue('Sharma')
        expect(screen.getByLabelText('Job Title')).toHaveValue('Engineer')
        expect(screen.getByLabelText('Country')).toHaveValue('India')
        expect(screen.getByLabelText('Salary')).toHaveValue(50000)
        expect(screen.getByLabelText('Department')).toHaveValue('Engineering')
        expect(screen.getByLabelText('Email')).toHaveValue('ravi@test.com')
    })

    it('submits edit modal and updates employee in table', async () => {
        const employees: Employee[] = [
            { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' }
        ]

        const updatedEmployee: Employee = {
            id: 1,
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Senior Engineer',
            country: 'India',
            salary: 55000,
            department: 'Engineering',
            email: 'ravi@test.com'
        }

        const createdEmployeeForCurrentBehavior: Employee = {
            ...updatedEmployee,
            id: 2
        }

        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(employees)
        vi.spyOn(api.employeeService, 'update').mockResolvedValue(updatedEmployee)
        vi.spyOn(api.employeeService, 'create').mockResolvedValue(createdEmployeeForCurrentBehavior)

        const user = userEvent.setup()
        render(<EmployeesPage />)

        await waitFor(() => {
            expect(screen.getByText('Ravi Sharma')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: 'Edit' }))

        await user.clear(screen.getByLabelText('Job Title'))
        await user.type(screen.getByLabelText('Job Title'), 'Senior Engineer')
        await user.clear(screen.getByLabelText('Salary'))
        await user.type(screen.getByLabelText('Salary'), '55000')

        await user.click(screen.getByRole('button', { name: 'Add' }))

        expect(api.employeeService.update).toHaveBeenCalledWith(1, {
            first_name: 'Ravi',
            last_name: 'Sharma',
            job_title: 'Senior Engineer',
            country: 'India',
            salary: 55000,
            department: 'Engineering',
            email: 'ravi@test.com'
        })

        await waitFor(() => {
            expect(screen.getByText('Senior Engineer', { exact: true })).toBeInTheDocument()
            expect(screen.queryByText('Engineer', { exact: true })).not.toBeInTheDocument()
        })
    })

    it('shows confirmation dialog before deleting employee', async () => {
        const employees: Employee[] = [
            { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' }
        ]

        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(employees)
        vi.spyOn(api.employeeService, 'delete').mockResolvedValue({})

        const user = userEvent.setup()
        render(<EmployeesPage />)

        await waitFor(() => {
            expect(screen.getByText('Ravi Sharma')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: 'Delete' }))

        expect(screen.getByText('Are you sure you want to delete this employee?')).toBeInTheDocument()
        expect(api.employeeService.delete).not.toHaveBeenCalled()
    })

    it('shows loading state while fetching employees', async () => {
        vi.spyOn(api.employeeService, 'getAll').mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve([]), 100))
        )
        render(<EmployeesPage />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})