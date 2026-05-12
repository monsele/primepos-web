import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlaceholderScreen from './PlaceholderScreen'

describe('PlaceholderScreen', () => {
  it('renders the icon, title, and subtitle', () => {
    render(
      <PlaceholderScreen
        icon="📋"
        title="Test Title"
        subtitle="Test subtitle text"
      />
    )

    expect(screen.getByTestId('placeholder-screen')).toBeInTheDocument()
    expect(screen.getByText('📋')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test subtitle text')).toBeInTheDocument()
  })

  it('renders different icons based on props', () => {
    render(
      <PlaceholderScreen
        icon="📊"
        title="Charts"
        subtitle="Some subtitle"
      />
    )

    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('Charts')).toBeInTheDocument()
  })
})
