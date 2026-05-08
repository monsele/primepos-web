import Input from '../../components/Input/Input'
import type { SavingsAccountFormData } from './useNewSavingsAccount'

interface StepContactProps {
  formData: SavingsAccountFormData
  errors: Record<string, string>
  updateField: <K extends keyof SavingsAccountFormData>(
    field: K,
    value: SavingsAccountFormData[K]
  ) => void
}

export function StepContact({
  formData,
  errors,
  updateField,
}: StepContactProps) {
  return (
    <>
      <Input
        label="Home Address"
        placeholder="Enter home address"
        value={formData.homeAddress}
        onChange={(value) => updateField('homeAddress', value)}
      />
      <Input
        label="Business Address"
        placeholder="Enter business address"
        value={formData.businessAddress}
        onChange={(value) => updateField('businessAddress', value)}
      />
      <Input
        label="Phone Number"
        placeholder="Enter phone number"
        value={formData.phoneNumber}
        onChange={(value) => updateField('phoneNumber', value)}
        error={errors.phoneNumber}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter email address"
        value={formData.email}
        onChange={(value) => updateField('email', value)}
      />
      <Input
        label="BVN"
        placeholder="Enter 11-digit BVN"
        value={formData.bvn}
        onChange={(value) => updateField('bvn', value.replace(/\D/g, '').slice(0, 11))}
        error={errors.bvn}
        maxLength={11}
      />
      <Input
        label="Next of Kin Name"
        placeholder="Enter next of kin name"
        value={formData.nextOfKinName}
        onChange={(value) => updateField('nextOfKinName', value)}
        error={errors.nextOfKinName}
      />
      <Input
        label="Next of Kin Phone"
        placeholder="Enter next of kin phone"
        value={formData.nextOfKinPhone}
        onChange={(value) => updateField('nextOfKinPhone', value)}
      />
    </>
  )
}
