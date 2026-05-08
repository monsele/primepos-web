import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GroupSelect } from './GroupSelect'
import type { Group } from '../../types/group'

const mockGroups: Group[] = [
  { id: '1', groupCode: 'GC-001', groupName: 'Alpha Group', branchId: 'B1', memberCount: 5 },
  { id: '2', groupCode: 'GC-002', groupName: 'Beta Group', branchId: 'B1', memberCount: 8 },
  { id: '3', groupCode: 'GC-003', groupName: 'Gamma Coop', branchId: 'B1', memberCount: 12 },
]

describe('GroupSelect', () => {
  it('does not render when closed', () => {
    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={false}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    expect(screen.queryByTestId('group-select-backdrop')).not.toBeInTheDocument()
  })

  it('renders group list when open', () => {
    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByTestId('group-select-backdrop')).toBeInTheDocument()
    expect(screen.getByText('Alpha Group')).toBeInTheDocument()
    expect(screen.getByText('Beta Group')).toBeInTheDocument()
    expect(screen.getByText('Gamma Coop')).toBeInTheDocument()
  })

  it('filters groups by search query', () => {
    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    const searchInput = screen.getByTestId('group-select-search')
    fireEvent.change(searchInput, { target: { value: 'Beta' } })

    expect(screen.queryByText('Alpha Group')).not.toBeInTheDocument()
    expect(screen.getByText('Beta Group')).toBeInTheDocument()
    expect(screen.queryByText('Gamma Coop')).not.toBeInTheDocument()
  })

  it('filters groups by group code', () => {
    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    const searchInput = screen.getByTestId('group-select-search')
    fireEvent.change(searchInput, { target: { value: 'GC-003' } })

    expect(screen.queryByText('Alpha Group')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta Group')).not.toBeInTheDocument()
    expect(screen.getByText('Gamma Coop')).toBeInTheDocument()
  })

  it('calls onSelect and onClose when a group is selected', () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()

    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={onClose}
        onSelect={onSelect}
      />
    )

    const item = screen.getByTestId('group-select-item-2')
    fireEvent.click(item)

    expect(onSelect).toHaveBeenCalledWith(mockGroups[1])
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()

    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={onClose}
        onSelect={vi.fn()}
      />
    )

    const backdrop = screen.getByTestId('group-select-backdrop')
    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()

    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={onClose}
        onSelect={vi.fn()}
      />
    )

    const closeBtn = screen.getByTestId('group-select-close')
    fireEvent.click(closeBtn)

    expect(onClose).toHaveBeenCalled()
  })

  it('shows empty state when no groups match search', () => {
    render(
      <GroupSelect
        groups={mockGroups}
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    const searchInput = screen.getByTestId('group-select-search')
    fireEvent.change(searchInput, { target: { value: 'zzz' } })

    expect(screen.getByTestId('group-select-empty')).toBeInTheDocument()
    expect(screen.getByText('No groups found')).toBeInTheDocument()
  })
})
