import { render, screen, waitFor } from '@testing-library/react'
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
})