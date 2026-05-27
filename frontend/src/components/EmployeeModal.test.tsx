import { render, screen } from '@testing-library/react'
import EmployeeModal from './EmployeeModal'
import userEvent from '@testing-library/user-event'

describe('EmployeeModal', () => {
    it('should render the modal when open', () => {
        render(<EmployeeModal open={true} onClose={() => { }} onSubmit={() => { }} />)
        expect(screen.getByText('Add Employee')).toBeInTheDocument()
    })

    it('should show error when required fields are missing', async () => {
        const user = userEvent.setup()
        render(<EmployeeModal open={true} onClose={() => { }} onSubmit={() => { }} />)

        await user.click(screen.getByRole('button', { name: 'Add' }))

        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument()
    })
})  