import { Send, Save, Info, CheckCircle } from 'react-feather'

// ** Vars
export const StatusObj = {
  active: { color: 'light-success', icon: CheckCircle },
  complete: { color: 'light-success', icon: CheckCircle },
  incomplete: { color: 'light-secondary', icon: Send },
  upcoming: { color: 'primary', icon: Save },
  deleted: { color: 'light-danger', icon: Info },
  cancelled: { color: 'light-danger', icon: Info },
  inactive: { color: 'light-danger', icon: Info },
  pending: { color: 'light-danger', icon: Info },
  add: { color: 'light-success', icon: CheckCircle },
  remove: { color: 'light-danger', icon: Info },
  1: { color: 'light-success', icon: CheckCircle, label: 'Active' },
  2: { color: 'light-danger', icon: Info, label: 'Cancelled' },
  3: { color: 'light-info', icon: Send, label: 'Complete' }
}

export const BillingStatusObj = {
  1: { color: 'light-success', icon: CheckCircle, label: 'Paid' },
  2: { color: 'light-danger', icon: Info, label: 'Unpaid' },
  3: { color: 'light-secondary', icon: Send, label: 'Void' },
  4: { color: 'light-danger', icon: Send, label: 'Over Due' }
}

export const ProviderStatusObj = {
  1: { color: 'light-warning', icon: CheckCircle, label: 'Pending' },
  2: { color: 'light-success', icon: Send, label: 'Active' },
  3: { color: 'light-danger', icon: Send, label: 'Inactive' }
}
