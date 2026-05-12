import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NewAccountDepositScreen from './NewAccountDepositScreen'

vi.mock('./useNewAccountDeposit', () => ({
  useNewAccountDeposit: vi.fn(),
}))

import { useNewAccountDeposit } from './useNewAccountDeposit'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('NewAccountDepositScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders new account deposit screen', () => {
    vi.mocked(useNewAccountDeposit).mockReturnValue({
      form: {
        firstName: '',
        surname: '',
        otherName: '',
        gender: '',
        bvn: '',
        productId: '',
        initialDeposit: '',
      },
      errors: {},
      isSubmitting: false,
      successData: null,
      setFirstName: vi.fn(),
      setSurname: vi.fn(),
      setOtherName: vi.fn(),
      setGender: vi.fn(),
      setBvn: vi.fn(),
      setProductId: vi.fn(),
      setInitialDeposit: vi.fn(),
      handleSubmit: vi.fn(),
      dismissSuccess: vi.fn(),
    })

    render(<NewAccountDepositScreen />, { wrapper: Wrapper })

    expect(screen.getByTestId('new-account-deposit-screen')).toBeInTheDocument()
    expect(screen.getByText('First Name')).toBeInTheDocument()
    expect(screen.getByText('Surname')).toBeInTheDocument()
    expect(screen.getByText('Other Name')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('BVN')).toBeInTheDocument()
    expect(screen.getByText('Savings Product')).toBeInTheDocument()
    expect(screen.getByText('Initial Deposit')).toBeInTheDocument()
    expect(screen.getByText('SUBMIT')).toBeInTheDocument()
  })

  it('shows success message with account number', () => {
    vi.mocked(useNewAccountDeposit).mockReturnValue({
      form: {
        firstName: '',
        surname: '',
        otherName: '',
        gender: '',
        bvn: '',
        productId: '',
        initialDeposit: '',
      },
      errors: {},
      isSubmitting: false,
      successData: { nuban: '1234567890', accountName: 'Doe John' },
      setFirstName: vi.fn(),
      setSurname: vi.fn(),
      setOtherName: vi.fn(),
      setGender: vi.fn(),
      setBvn: vi.fn(),
      setProductId: vi.fn(),
      setInitialDeposit: vi.fn(),
      handleSubmit: vi.fn(),
      dismissSuccess: vi.fn(),
    })

    render(<NewAccountDepositScreen />, { wrapper: Wrapper })

    expect(screen.getByTestId('success-message')).toBeInTheDocument()
    expect(screen.getByTestId('account-number')).toHaveTextContent('1234567890')
    expect(screen.getByText('Account Created Successfully')).toBeInTheDocument()
  })

  it('triggers dismiss when dismiss button clicked', () => {
    const dismissSuccess = vi.fn()
    vi.mocked(useNewAccountDeposit).mockReturnValue({
      form: {
        firstName: '',
        surname: '',
        otherName: '',
        gender: '',
        bvn: '',
        productId: '',
        initialDeposit: '',
      },
      errors: {},
      isSubmitting: false,
      successData: { nuban: '1234567890', accountName: 'Doe John' },
      setFirstName: vi.fn(),
      setSurname: vi.fn(),
      setOtherName: vi.fn(),
      setGender: vi.fn(),
      setBvn: vi.fn(),
      setProductId: vi.fn(),
      setInitialDeposit: vi.fn(),
      handleSubmit: vi.fn(),
      dismissSuccess,
    })

    render(<NewAccountDepositScreen />, { wrapper: Wrapper })

    const dismissButton = screen.getByText('DISMISS')
    fireEvent.click(dismissButton)

    expect(dismissSuccess).toHaveBeenCalled()
  })

  it('shows validation errors', () => {
    vi.mocked(useNewAccountDeposit).mockReturnValue({
      form: {
        firstName: '',
        surname: '',
        otherName: '',
        gender: '',
        bvn: '123',
        productId: '',
        initialDeposit: '',
      },
      errors: {
        firstName: 'First name is required',
        bvn: 'BVN must be 11 digits',
        productId: 'Product is required',
      },
      isSubmitting: false,
      successData: null,
      setFirstName: vi.fn(),
      setSurname: vi.fn(),
      setOtherName: vi.fn(),
      setGender: vi.fn(),
      setBvn: vi.fn(),
      setProductId: vi.fn(),
      setInitialDeposit: vi.fn(),
      handleSubmit: vi.fn(),
      dismissSuccess: vi.fn(),
    })

    render(<NewAccountDepositScreen />, { wrapper: Wrapper })

    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('BVN must be 11 digits')).toBeInTheDocument()
    expect(screen.getByText('Product is required')).toBeInTheDocument()
  })

  it('triggers submit when SUBMIT button clicked', () => {
    const handleSubmit = vi.fn()
    vi.mocked(useNewAccountDeposit).mockReturnValue({
      form: {
        firstName: 'John',
        surname: 'Doe',
        otherName: '',
        gender: 'Male',
        bvn: '12345678901',
        productId: '1',
        initialDeposit: '5000',
      },
      errors: {},
      isSubmitting: false,
      successData: null,
      setFirstName: vi.fn(),
      setSurname: vi.fn(),
      setOtherName: vi.fn(),
      setGender: vi.fn(),
      setBvn: vi.fn(),
      setProductId: vi.fn(),
      setInitialDeposit: vi.fn(),
      handleSubmit,
      dismissSuccess: vi.fn(),
    })

    render(<NewAccountDepositScreen />, { wrapper: Wrapper })

    const submitButton = screen.getByText('SUBMIT')
    fireEvent.click(submitButton)

    expect(handleSubmit).toHaveBeenCalled()
  })
})
