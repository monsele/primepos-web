import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from 'react'
import {
  navigationReducer,
  initialNavigationState,
  MAIN_TAB_SCREENS,
} from '../types/navigation'
import type { Screen, NavigationState } from '../types/navigation'

interface NavigationContextValue extends NavigationState {
  navigateTo: (screen: Screen) => void
  goBack: () => void
  replace: (screen: Screen) => void
  isInnerScreen: boolean
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState)

  const navigateTo = useCallback(
    (screen: Screen) => {
      dispatch({ type: 'NAVIGATE', payload: screen })
    },
    []
  )

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' })
  }, [])

  const replace = useCallback(
    (screen: Screen) => {
      dispatch({ type: 'REPLACE', payload: screen })
    },
    []
  )

  const isInnerScreen = !MAIN_TAB_SCREENS.includes(state.currentScreen)

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        navigateTo,
        goBack,
        replace,
        isInnerScreen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
