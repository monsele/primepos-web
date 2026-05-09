import { render, screen } from '@testing-library/react'
import LoansBookedReportScreen from './LoansBookedReportScreen'

describe('LoansBookedReportScreen', () => {
  it('renders placeholder with correct content', () => {
    render(<LoansBookedReportScreen />)

    expect(screen.getByTestId('placeholder-screen')).toBeInTheDocument()
    expect(screen.getByText('📋')).toBeInTheDocument()
    expect(screen.getByText('Loans Booked Report')).toBeInTheDocument()
    expect(
      screen.getByText(/new loan disbursements/i)
    ).toBeInTheDocument()
  })
})
