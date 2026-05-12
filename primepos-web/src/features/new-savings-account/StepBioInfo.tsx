import Input from '../../components/Input/Input'
import { DateInput } from '../../components/DateInput/DateInput'
import { GenderToggle } from '../../components/GenderToggle/GenderToggle'
import type { SavingsAccountFormData } from './useNewSavingsAccount'

interface StepBioInfoProps {
  formData: SavingsAccountFormData
  errors: Record<string, string>
  updateField: <K extends keyof SavingsAccountFormData>(
    field: K,
    value: SavingsAccountFormData[K]
  ) => void
}

export function StepBioInfo({
  formData,
  errors,
  updateField,
}: StepBioInfoProps) {
  return (
    <>
      <Input
        label="Branch"
        placeholder="Enter branch code"
        value={formData.branch}
        onChange={(value) => updateField('branch', value)}
        error={errors.branch}
      />
      <Input
        label="First Name"
        placeholder="Enter first name"
        value={formData.firstName}
        onChange={(value) => updateField('firstName', value)}
        error={errors.firstName}
      />
      <Input
        label="Other Name"
        placeholder="Enter other name"
        value={formData.otherName}
        onChange={(value) => updateField('otherName', value)}
      />
      <Input
        label="Surname"
        placeholder="Enter surname"
        value={formData.surname}
        onChange={(value) => updateField('surname', value)}
        error={errors.surname}
      />
      <GenderToggle
        value={formData.gender}
        onChange={(value) => updateField('gender', value)}
        error={errors.gender}
      />
      <DateInput
        label="Date of Birth"
        value={formData.dateOfBirth}
        onChange={(value) => updateField('dateOfBirth', value)}
        error={errors.dateOfBirth}
      />
    </>
  )
}
