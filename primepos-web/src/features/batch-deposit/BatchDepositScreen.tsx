import { useState, useMemo } from 'react'
import type { Group } from '../../types/group'
import type { GroupMember } from '../../types/group'
import { GroupSelect } from '../../components/GroupSelect/GroupSelect'
import MemberAmountTable from '../../components/MemberAmountTable/MemberAmountTable'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import styles from './batch-deposit.module.css'

export default function BatchDepositScreen() {
  const [payeeName, setPayeeName] = useState('')
  const [branchId, setBranchId] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [sendSms, setSendSms] = useState(false)
  const [isGroupSelectOpen, setIsGroupSelectOpen] = useState(false)

  // Mock groups - in real app, fetch from API
  const mockGroups: Group[] = [
    {
      id: 'group-1',
      groupCode: 'GRP001',
      groupName: 'Women Empowerment Group',
      branchId: 'branch-1',
      memberCount: 15
    },
    {
      id: 'group-2',
      groupCode: 'GRP002',
      groupName: 'Youth Savings Circle',
      branchId: 'branch-1',
      memberCount: 12
    }
  ]

  // Mock members - in real app, fetch from API when group selected
  const mockMembers: GroupMember[] = [
    { id: '1', customerName: 'Ada Okafor', accountNumber: '1000000001', amount: null },
    { id: '2', customerName: 'Bola Adeyemi', accountNumber: '1000000002', amount: null },
    { id: '3', customerName: 'Chioma Nwosu', accountNumber: '1000000003', amount: null },
    { id: '4', customerName: 'Damilola Ogunleye', accountNumber: '1000000004', amount: null },
    { id: '5', customerName: 'Efe Eghosa', accountNumber: '1000000005', amount: null },
  ]

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group)
    setMembers(mockMembers.map(m => ({ ...m }))) // Reset amounts
    setIsGroupSelectOpen(false)
  }

  const handleAmountChange = (memberId: string, amount: number | null) => {
    setMembers(prev =>
      prev.map(m => m.id === memberId ? { ...m, amount } : m)
    )
  }

  const totalAmount = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.amount || 0), 0)
  }, [members])

  const handleSubmit = () => {
    if (!selectedGroup || totalAmount === 0) return

    // Mock submission
    console.log('Submitting batch deposit:', {
      payeeName,
      branchId,
      groupId: selectedGroup.id,
      deposits: members.filter(m => m.amount && m.amount > 0).map(m => ({
        accountNumber: m.accountNumber,
        amount: m.amount
      })),
      sendSms,
      totalAmount
    })

    alert(`Batch submitted successfully! Reference: BATCH${Date.now()}`)
  }

  return (
    <div className={styles.container}>
      <h1>Batch BBLS Deposit</h1>

      <div className={styles.formSection}>
        <Input
          label="Payee/Collector Name"
          value={payeeName}
          onChange={setPayeeName}
          placeholder="Enter collector name"
        />

        <Input
          label="Branch ID"
          value={branchId}
          onChange={setBranchId}
          placeholder="Enter branch ID"
        />

        <div className={styles.groupSection}>
          <label className={styles.groupLabel}>Group Selection</label>
          {selectedGroup ? (
            <div className={styles.selectedGroup}>
              <div className={styles.groupInfo}>
                <strong>{selectedGroup.groupName}</strong>
                <div>Code: {selectedGroup.groupCode}</div>
                <div>Members: {selectedGroup.memberCount}</div>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setIsGroupSelectOpen(true)}
              >
                Change Group
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsGroupSelectOpen(true)}>
              SELECT GROUP
            </Button>
          )}
        </div>
      </div>

      {selectedGroup && (
        <div className={styles.membersSection}>
          <h2>Enter Deposit Amounts</h2>
          <MemberAmountTable
            members={members}
            onAmountChange={handleAmountChange}
          />
        </div>
      )}

      {totalAmount > 0 && (
        <div className={styles.submitSection}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
            />
            Send SMS notification to customers
          </label>

          <Button
            onClick={handleSubmit}
            disabled={!payeeName || !branchId || totalAmount === 0}
          >
            SUBMIT BATCH
          </Button>
        </div>
      )}

      <GroupSelect
        groups={mockGroups}
        isOpen={isGroupSelectOpen}
        onClose={() => setIsGroupSelectOpen(false)}
        onSelect={handleGroupSelect}
      />
    </div>
  )
}