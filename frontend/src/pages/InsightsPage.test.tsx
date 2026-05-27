import { render, screen, waitFor } from '@testing-library/react'
import * as api from '../services/api'
import { vi } from 'vitest'
import InsightsPage from './InsightsPage'
import type { Employee } from '../types/employee'

const mockEmployees: Employee[] = [
    { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' },
    { id: 2, first_name: 'Priya', last_name: 'Singh', job_title: 'Designer', country: 'India', salary: 70000, department: 'Design', email: 'priya@test.com' },
]

vi.mock('../services/api')

describe('InsightsPage', () => {
    beforeEach(() => {
        vi.spyOn(api.employeeService, 'getAll').mockResolvedValue(mockEmployees)
    })

    it('renders country dropdown', () => {
        render(<InsightsPage />)
        expect(screen.getByLabelText('Country')).toBeInTheDocument()
    })

    it('shows min salary for selected country', async () => {
        render(<InsightsPage />)
        await waitFor(() => {
            expect(screen.getByText('Min salary in India')).toBeInTheDocument()
        })
    })

    it('shows department breakdown when country is selected', async () => {
        render(<InsightsPage />)
        await waitFor(() => {
            expect(screen.getByText('Department Breakdown')).toBeInTheDocument()
        })
    })

    it('shows total employee count for selected country', async () => {
        render(<InsightsPage />)
        await waitFor(() => {
            expect(screen.getByText('Total Employees: 2')).toBeInTheDocument()
        })
    })
})