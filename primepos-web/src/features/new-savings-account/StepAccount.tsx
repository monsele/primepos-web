import Input from '../../components/Input/Input'
import ProductSelect from '../../components/ProductSelect/ProductSelect'
import type { SavingsProduct } from '../../components/ProductSelect/ProductSelect'
import type { SavingsAccountFormData } from './useNewSavingsAccount'

interface StepAccountProps {
  formData: SavingsAccountFormData
  errors: Record<string, string>
  updateField: <K extends keyof SavingsAccountFormData>(
    field: K,
    value: SavingsAccountFormData[K]
  ) => void
  products: SavingsProduct[]
  isLoadingProducts: boolean
}

export function StepAccount({
  formData,
  errors,
  updateField,
  products,
  isLoadingProducts,
}: StepAccountProps) {
  return (
    <>
      <ProductSelect
        label="Product Type"
        value={formData.productId}
        onChange={(value) => updateField('productId', value)}
        options={products}
        placeholder={isLoadingProducts ? 'Loading products...' : 'Select a product'}
        error={errors.productId}
        disabled={isLoadingProducts}
      />
      <Input
        label="Initial Deposit"
        placeholder="Enter initial deposit amount"
        value={formData.initialDeposit}
        onChange={(value) => updateField('initialDeposit', value)}
        error={errors.initialDeposit}
      />
    </>
  )
}
