import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NewSavingsAccountScreen from './NewSavingsAccountScreen'
import type { UseNewSavingsAccountReturn } from './useNewSavingsAccount'

vi.mock('./useNewSavingsAccount', () => ({
  useNewSavingsAccount: vi.fn(),
}))

vi.mock('./useSavingsProducts', () => ({
  useSavingsProducts: vi.fn(),
}))

vi.mock('../../contexts/NavigationContext', () => ({
  useNavigation: vi.fn(),
}))

import { useNavigation } from '../../contexts/NavigationContext'
import { useNewSavingsAccount } from './useNewSavingsAccount'
import { useSavingsProducts } from './useSavingsProducts'

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

const baseHookValue: UseNewSavingsAccountReturn = {
  currentStep: 1 as const,
  formData: {
    branch: '',
    firstName: '',
    otherName: '',
    surname: '',
    gender: '' as const,
    dateOfBirth: '',
    homeAddress: '',
    businessAddress: '',
    phoneNumber: '',
    email: '',
    bvn: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    productId: '',
    initialDeposit: '',
  },
  errors: {},
  isSubmitting: false,
  successData: null,
  updateField: vi.fn(),
  nextStep: vi.fn(),
  previousStep: vi.fn(),
  submit: vi.fn(),
  dismissSuccess: vi.fn(),
}

describe('NewSavingsAccountScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigation).mockReturnValue({
      replace: vi.fn(),
    } as unknown as ReturnType<typeof useNavigation>)
    vi.mocked(useSavingsProducts).mockReturnValue({
      data: [{ id: '1', name: 'Prime Savings', minDeposit: 100000, description: 'Standard' }],
      isLoading: false,
    } as ReturnType<typeof useSavingsProducts>)
  })

  it('renders the bio info step by default', () => {
    vi.mocked(useNewSavingsAccount).mockReturnValue(baseHookValue)

    render(<NewSavingsAccountScreen />, { wrapper: Wrapper })

    expect(screen.getByTestId('new-savings-account-screen')).toBeInTheDocument()
    expect(screen.getByText('Open a New Savings Account')).toBeInTheDocument()
    expect(screen.getByText('Branch')).toBeInTheDocument()
    expect(screen.getByText('CONTINUE')).toBeInTheDocument()
  })

  it('renders contact step and supports going back', () => {
    const previousStep = vi.fn()

    vi.mocked(useNewSavingsAccount).mockReturnValue({
      ...baseHookValue,
      currentStep: 2,
      previousStep,
    })

    render(<NewSavingsAccountScreen />, { wrapper: Wrapper })

    expect(screen.getByText('Phone Number')).toBeInTheDocument()
    fireEvent.click(screen.getByText('BACK'))
    expect(previousStep).toHaveBeenCalledTimes(1)
  })

  it('submits on the final step', () => {
    const submit = vi.fn()

    vi.mocked(useNewSavingsAccount).mockReturnValue({
      ...baseHookValue,
      currentStep: 3,
      submit,
    })

    render(<NewSavingsAccountScreen />, { wrapper: Wrapper })

    expect(screen.getByText('Product Type')).toBeInTheDocument()
    fireEvent.click(screen.getByText('SUBMIT'))
    expect(submit).toHaveBeenCalledTimes(1)
  })

  it('navigates to dashboard after success modal done', () => {
    const replace = vi.fn()
    const dismissSuccess = vi.fn()

    vi.mocked(useNavigation).mockReturnValue({
      replace,
    } as unknown as ReturnType<typeof useNavigation>)
    vi.mocked(useNewSavingsAccount).mockReturnValue({
      ...baseHookValue,
      successData: { accountNumber: '1234567890' },
      dismissSuccess,
    })

    render(<NewSavingsAccountScreen />, { wrapper: Wrapper })

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }))

    expect(dismissSuccess).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('dashboard')
  })
})
