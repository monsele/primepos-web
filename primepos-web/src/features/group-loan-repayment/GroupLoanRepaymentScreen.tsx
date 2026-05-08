import { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { LoanCard } from '../../components/LoanCard/LoanCard'
import { GroupSelect } from '../../components/GroupSelect/GroupSelect'
import { useGroupSearch } from './useGroupSearch'
import { useGroupLoanRepayment } from './useGroupLoanRepayment'
import { useAuth } from '../../contexts/useAuth'
import { searchGroupLoan } from '../../api/loans'
import styles from './group-loan-repayment.module.css'

export default function GroupLoanRepaymentScreen() {
  const { user } = useAuth()
  const { groups, isLoading: isLoadingGroups, search: loadGroups } = useGroupSearch()
  const {
    form,
    errors,
    isSubmitting,
    selectedGroup,
    setAmount,
    setGroup,
    handleSubmit,
  } = useGroupLoanRepayment()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groupLoan, setGroupLoan] = useState<
    import('../../types/group').GroupLoan | null
  >(null)
  const [isSearchingLoan, setIsSearchingLoan] = useState(false)
  const [loanSearchError, setLoanSearchError] = useState<Error | null>(null)

  const openGroupSelect = async () => {
    setIsModalOpen(true)
    if (user?.branchId) {
      try {
        await loadGroups(user.branchId)
      } catch {
        // error handled in hook
      }
    }
  }

  const onSelectGroup = (group: import('../../types/group').Group) => {
    setGroup(group)
    setGroupLoan(null)
    setLoanSearchError(null)
  }

  const onSearchLoan = async () => {
    if (!selectedGroup) return
    setIsSearchingLoan(true)
    setLoanSearchError(null)
    try {
      const loan = await searchGroupLoan(selectedGroup.id)
      setGroupLoan(loan)
    } catch (err) {
      setLoanSearchError(
        err instanceof Error ? err : new Error('Group loan not found')
      )
      setGroupLoan(null)
    } finally {
      setIsSearchingLoan(false)
    }
  }

  const onSubmit = () => {
    handleSubmit(groupLoan)
  }

  return (
    <div className={styles.container} data-testid="group-loan-repayment-screen">
      <div className={styles.groupSelectRow}>
        {selectedGroup ? (
          <div className={styles.groupDisplay} data-testid="selected-group">
            <div className={styles.groupDisplayLabel}>Selected Group</div>
            <div className={styles.groupDisplayName}>{selectedGroup.groupName}</div>
            <div className={styles.groupDisplayMeta}>
              {selectedGroup.groupCode} · {selectedGroup.memberCount} members
            </div>
          </div>
        ) : (
          <div className={styles.groupDisplay} data-testid="no-group-selected">
            <div className={styles.groupDisplayLabel}>Group</div>
            <div className={styles.groupDisplayName}>No group selected</div>
          </div>
        )}
        <div className={styles.selectButton}>
          <Button onClick={openGroupSelect} loading={isLoadingGroups} size="small">
            SELECT GROUP
          </Button>
        </div>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchInput}>
          <Input
            label="Loan Account Number"
            placeholder="Enter loan number"
            value={groupLoan?.loanNumber || ''}
            onChange={() => {}}
            error={loanSearchError ? 'Loan not found' : undefined}
            disabled
          />
        </div>
        <div className={styles.searchButton}>
          <Button
            onClick={onSearchLoan}
            loading={isSearchingLoan}
            size="small"
            disabled={!selectedGroup}
          >
            SEARCH
          </Button>
        </div>
      </div>

      {groupLoan && (
        <div className={styles.loanCard}>
          <LoanCard loan={groupLoan} />
        </div>
      )}

      <div className={styles.form}>
        <Input
          label="Repayment Amount"
          placeholder="Enter amount"
          value={form.amount}
          onChange={setAmount}
          error={errors.amount}
        />

        <Button
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!groupLoan}
        >
          POST REPAYMENT
        </Button>
      </div>

      <GroupSelect
        groups={groups}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onSelectGroup}
      />
    </div>
  )
}
