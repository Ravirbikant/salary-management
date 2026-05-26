import { render, screen } from '@testing-library/react'
import InsightsPage from './InsightsPage'

describe('InsightsPage', () => {
    it('renders country dropdown', () => {
        render(<InsightsPage />)
        expect(screen.getByLabelText('Country')).toBeInTheDocument()
    })
})

