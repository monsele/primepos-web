import { describe, it, expect } from 'vitest'
import {
  navigationReducer,
  initialNavigationState,
  isInnerScreen,
  MAIN_TAB_SCREENS,
} from './navigation'
import type { NavigationAction, Screen } from './navigation'

describe('navigationReducer', () => {
  it('NAVIGATE sets current screen and pushes to history for inner screen', () => {
    const action: NavigationAction = { type: 'NAVIGATE', payload: 'cashIn' }
    const state = navigationReducer(initialNavigationState, action)

    expect(state.currentScreen).toBe('cashIn')
    expect(state.screenHistory).toEqual(['dashboard'])
    expect(state.transitionDirection).toBe('push')
  })

  it('NAVIGATE to main tab switches without animation or history', () => {
    const startState = {
      ...initialNavigationState,
      currentScreen: 'cashIn' as Screen,
      screenHistory: ['dashboard'] as Screen[],
      transitionDirection: 'push' as const,
    }
    const action: NavigationAction = { type: 'NAVIGATE', payload: 'transactMenu' }
    const state = navigationReducer(startState, action)

    expect(state.currentScreen).toBe('transactMenu')
    expect(state.screenHistory).toEqual([])
    expect(state.transitionDirection).toBe('none')
  })

  it('NAVIGATE between main tabs clears history', () => {
    const startState = {
      ...initialNavigationState,
      currentScreen: 'reports' as Screen,
      screenHistory: [] as Screen[],
      transitionDirection: 'none' as const,
    }
    const action: NavigationAction = { type: 'NAVIGATE', payload: 'more' }
    const state = navigationReducer(startState, action)

    expect(state.currentScreen).toBe('more')
    expect(state.screenHistory).toEqual([])
    expect(state.transitionDirection).toBe('none')
  })

  it('GO_BACK pops history and sets pop direction', () => {
    const startState = {
      ...initialNavigationState,
      currentScreen: 'cashIn' as Screen,
      screenHistory: ['dashboard'] as Screen[],
      transitionDirection: 'push' as const,
    }
    const action: NavigationAction = { type: 'GO_BACK' }
    const state = navigationReducer(startState, action)

    expect(state.currentScreen).toBe('dashboard')
    expect(state.screenHistory).toEqual([])
    expect(state.transitionDirection).toBe('pop')
  })

  it('GO_BACK does nothing when history is empty', () => {
    const action: NavigationAction = { type: 'GO_BACK' }
    const state = navigationReducer(initialNavigationState, action)

    expect(state.currentScreen).toBe('dashboard')
    expect(state.screenHistory).toEqual([])
    expect(state.transitionDirection).toBe('none')
  })

  it('REPLACE replaces current screen without history', () => {
    const startState = {
      ...initialNavigationState,
      currentScreen: 'cashIn' as Screen,
      screenHistory: ['dashboard'] as Screen[],
    }
    const action: NavigationAction = { type: 'REPLACE', payload: 'cashOut' }
    const state = navigationReducer(startState, action)

    expect(state.currentScreen).toBe('cashOut')
    expect(state.screenHistory).toEqual(['dashboard'])
    expect(state.transitionDirection).toBe('none')
  })

  it('SET_TRANSITION updates direction', () => {
    const action: NavigationAction = { type: 'SET_TRANSITION', payload: 'push' }
    const state = navigationReducer(initialNavigationState, action)

    expect(state.transitionDirection).toBe('push')
  })
})

describe('isInnerScreen', () => {
  it('returns false for main tab screens', () => {
    MAIN_TAB_SCREENS.forEach((screen) => {
      expect(isInnerScreen(screen)).toBe(false)
    })
  })

  it('returns true for inner screens', () => {
    const innerScreens: Screen[] = [
      'cashIn',
      'cashOut',
      'loanRepayment',
      'newAccount',
      'settings',
      'profile',
    ]
    innerScreens.forEach((screen) => {
      expect(isInnerScreen(screen)).toBe(true)
    })
  })
})
