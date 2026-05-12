import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductSelect from './ProductSelect'

const mockProducts = [
  { id: '1', name: 'Prime Savings', minDeposit: 100000, description: 'Standard' },
  { id: '2', name: 'Better Life Savings', minDeposit: 50000, description: 'Group' },
]

describe('ProductSelect', () => {
  it('renders with placeholder', () => {
    render(
      <ProductSelect
        label="Savings Product"
        value=""
        onChange={vi.fn()}
        options={mockProducts}
      />
    )

    expect(screen.getByText('Savings Product')).toBeInTheDocument()
    expect(screen.getByTestId('product-select')).toBeInTheDocument()
  })

  it('renders all product options', () => {
    render(
      <ProductSelect
        label="Savings Product"
        value=""
        onChange={vi.fn()}
        options={mockProducts}
      />
    )

    const select = screen.getByTestId('product-select') as HTMLSelectElement
    expect(select.options.length).toBe(3) // placeholder + 2 products
    expect(screen.getByText('Prime Savings')).toBeInTheDocument()
    expect(screen.getByText('Better Life Savings')).toBeInTheDocument()
  })

  it('calls onChange with selected value', () => {
    const onChange = vi.fn()
    render(
      <ProductSelect
        label="Savings Product"
        value=""
        onChange={onChange}
        options={mockProducts}
      />
    )

    const select = screen.getByTestId('product-select')
    fireEvent.change(select, { target: { value: '2' } })

    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('displays error message', () => {
    render(
      <ProductSelect
        label="Savings Product"
        value=""
        onChange={vi.fn()}
        options={mockProducts}
        error="Product is required"
      />
    )

    expect(screen.getByText('Product is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
