export type Screen =
  | 'dashboard'
  | 'transactMenu'
  | 'servicesMenu'
  | 'reports'
  | 'more'
  | 'cashIn'
  | 'cashOut'
  | 'loanRepayment'
  | 'newAccount'
  | 'batchDeposit'
  | 'accountBalance'
  | 'accountStatement'
  | 'loanInquiry'
  | 'settings'
  | 'profile'
  | 'groupLoanRepayment'
  | 'cardTransactions'
  | 'cardDeposit'
  | 'cardWithdrawal'
  | 'cardBalance'
  | 'cardStatement'
  | 'loansBookedReport'
  | 'eLedgerReport'
  | 'loParReport'
  | 'transactionReports'
  | 'loPerformanceReport'
  | 'unpostedTransactions'
  | 'changePassword'
  | 'newSavingsAccount'
  | 'betterLife'
  | 'portfolio'
  | 'groups'
  | 'loanRecords'
  | 'syncData'
  | 'appSettings'

export const MAIN_TAB_SCREENS: Screen[] = [
  'dashboard',
  'transactMenu',
  'servicesMenu',
  'reports',
  'more',
]

export interface NavigationState {
  currentScreen: Screen
  screenHistory: Screen[]
  transitionDirection: 'push' | 'pop' | 'none'
}

export type NavigationAction =
  | { type: 'NAVIGATE'; payload: Screen }
  | { type: 'GO_BACK' }
  | { type: 'REPLACE'; payload: Screen }
  | { type: 'SET_TRANSITION'; payload: 'push' | 'pop' | 'none' }

export const initialNavigationState: NavigationState = {
  currentScreen: 'dashboard',
  screenHistory: [],
  transitionDirection: 'none',
}

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'NAVIGATE': {
      const isTargetMainTab = MAIN_TAB_SCREENS.includes(action.payload)

      // Navigating to a main tab always clears history and has no animation
      if (isTargetMainTab) {
        return {
          ...state,
          currentScreen: action.payload,
          transitionDirection: 'none',
          screenHistory: [],
        }
      }

      // Push to inner screen: animate from right, push to history
      return {
        ...state,
        screenHistory: [...state.screenHistory, state.currentScreen],
        currentScreen: action.payload,
        transitionDirection: 'push',
      }
    }

    case 'GO_BACK': {
      if (state.screenHistory.length === 0) {
        return state
      }
      const previousScreen = state.screenHistory[state.screenHistory.length - 1]
      return {
        ...state,
        currentScreen: previousScreen,
        screenHistory: state.screenHistory.slice(0, -1),
        transitionDirection: 'pop',
      }
    }

    case 'REPLACE': {
      return {
        ...state,
        currentScreen: action.payload,
        transitionDirection: 'none',
      }
    }

    case 'SET_TRANSITION': {
      return {
        ...state,
        transitionDirection: action.payload,
      }
    }

    default:
      return state
  }
}

export function isInnerScreen(screen: Screen): boolean {
  return !MAIN_TAB_SCREENS.includes(screen)
}
