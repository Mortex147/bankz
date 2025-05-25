export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  EARNING: 'earning',
} as const;

export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  WIRE_TRANSFER: 'wire_transfer',
} as const;

export const MIN_DEPOSIT_AMOUNT = 10;
export const MAX_DEPOSIT_AMOUNT = 10000;
export const MIN_WITHDRAWAL_AMOUNT = 25;
