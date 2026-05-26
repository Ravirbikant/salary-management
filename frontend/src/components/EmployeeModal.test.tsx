import { render, screen } from '@testing-library/react'
import EmployeeModal from './EmployeeModal'

describe('EmployeeModal', () => {
    it('should render the modal when open', () => {
        render(<EmployeeModal open={true} onClose={() => { }} onSubmit={() => { }} />)
        expect(screen.getByText('Add Employee')).toBeInTheDocument()
    })
})  