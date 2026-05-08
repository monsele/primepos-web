import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper } from './Stepper'

const steps = [
  { id: 1, label: 'Bio Info' },
  { id: 2, label: 'Contact' },
  { id: 3, label: 'Account' },
]

describe('Stepper', () => {
  it('shows the active step', () => {
    render(<Stepper steps={steps} currentStep={1} />)

    expect(screen.getByTestId('step-1')).toHaveTextContent('Bio Info')
    expect(screen.getByTestId('step-2')).toHaveTextContent('Contact')
  })

  it('marks previous steps complete', () => {
    render(<Stepper steps={steps} currentStep={3} />)

    expect(screen.getByTestId('step-1').querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('step-2').querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('step-3')).toHaveTextContent('Account')
  })
})
