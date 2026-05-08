import Button from '../../components/Button/Button'
import { Stepper } from '../../components/Stepper/Stepper'
import { SuccessModal } from '../../components/SuccessModal/SuccessModal'
import { useNavigation } from '../../contexts/NavigationContext'
import { StepAccount } from './StepAccount'
import { StepBioInfo } from './StepBioInfo'
import { StepContact } from './StepContact'
import { useNewSavingsAccount } from './useNewSavingsAccount'
import { useSavingsProducts } from './useSavingsProducts'
import styles from './new-savings-account.module.css'

const steps = [
  { id: 1, label: 'Bio Info' },
  { id: 2, label: 'Contact' },
  { id: 3, label: 'Account' },
]

export default function NewSavingsAccountScreen() {
  const { replace } = useNavigation()
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    successData,
    updateField,
    nextStep,
    previousStep,
    submit,
    dismissSuccess,
  } = useNewSavingsAccount()
  const { data: products = [], isLoading } = useSavingsProducts()

  const handleDone = () => {
    dismissSuccess()
    replace('dashboard')
  }

  return (
    <div className={styles.container} data-testid="new-savings-account-screen">
      <div className={styles.card}>
        <Stepper steps={steps} currentStep={currentStep} />

        <div className={styles.heading}>
          <h2 className={styles.title}>Open a New Savings Account</h2>
          <p className={styles.subtitle}>
            Complete the customer profile in three guided steps.
          </p>
        </div>

        <div className={styles.form}>
          {currentStep === 1 && (
            <StepBioInfo
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
          )}

          {currentStep === 2 && (
            <StepContact
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
          )}

          {currentStep === 3 && (
            <StepAccount
              formData={formData}
              errors={errors}
              updateField={updateField}
              products={products}
              isLoadingProducts={isLoading}
            />
          )}
        </div>

        <div className={styles.actions}>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={previousStep}>
              BACK
            </Button>
          )}
          {currentStep < 3 ? (
            <Button onClick={() => nextStep()}>CONTINUE</Button>
          ) : (
            <Button onClick={() => void submit()} loading={isSubmitting}>
              SUBMIT
            </Button>
          )}
        </div>
      </div>

      {successData && (
        <SuccessModal
          accountNumber={successData.accountNumber}
          onDone={handleDone}
        />
      )}
    </div>
  )
}
