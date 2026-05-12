import styles from './Stepper.module.css'

export interface StepperStep {
  id: number
  label: string
}

interface StepperProps {
  steps: StepperStep[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className={styles.container} aria-label="Savings account progress">
      {steps.map((step) => {
        const isComplete = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div
            key={step.id}
            className={`${styles.step} ${isComplete ? styles.complete : ''} ${isActive ? styles.active : ''}`}
            data-testid={`step-${step.id}`}
          >
            <span className={styles.indicator} aria-hidden="true">
              {isComplete ? (
                <svg className={styles.check} viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.2 11.5L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.id
              )}
            </span>
            <span className={styles.label}>{step.label}</span>
          </div>
        )
      })}
    </div>
  )
}
