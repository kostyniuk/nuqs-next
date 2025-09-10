import { faker } from '@faker-js/faker'

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  category: "subscription" | "one-time" | "refund" | "fee"
  priority?: "low" | "medium" | "high" | "urgent"
  tags?: string[]
  createdAt?: string
  dueDate?: string
  subPayments?: SubPayment[]
}

export type SubPayment = {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

// Payment statuses with realistic distribution
const paymentStatuses: Payment['status'][] = ['success', 'success', 'success', 'pending', 'processing', 'failed']
const paymentCategories: Payment['category'][] = ['subscription', 'one-time', 'one-time', 'one-time', 'refund', 'fee']
const priorities: Payment['priority'][] = ['low', 'low', 'medium', 'medium', 'high', 'urgent']

// Sub-payment categories
const subPaymentCategories = [
  'Service Fee', 'Processing Fee', 'Tax', 'Subscription', 'Setup Fee', 
  'Monthly Plan', 'Add-ons', 'Support', 'Maintenance', 'License',
  'API Usage', 'Storage', 'Bandwidth', 'Premium Features', 'Analytics',
  'Backup', 'Security', 'Compliance', 'Training', 'Consulting'
]

// Common tags
const commonTags = [
  'premium', 'monthly', 'annual', 'enterprise', 'startup', 'trial',
  'conversion', 'upgrade', 'downgrade', 'migration', 'onboarding',
  'setup', 'maintenance', 'support', 'api', 'integration', 'custom'
]

function generateSubPayments(paymentId: string, mainAmount: number): SubPayment[] {
  const subPayments: SubPayment[] = []
  const numSubPayments = faker.number.int({ min: 3, max: 8 })
  
  // Ensure sub-payments don't exceed main amount
  let remainingAmount = mainAmount
  const baseAmount = Math.floor(remainingAmount / numSubPayments)
  
  for (let i = 0; i < numSubPayments; i++) {
    const isLast = i === numSubPayments - 1
    const amount = isLast ? remainingAmount : faker.number.int({ 
      min: Math.floor(baseAmount * 0.3), 
      max: Math.floor(baseAmount * 1.5) 
    })
    
    remainingAmount -= amount
    
    subPayments.push({
      id: `${paymentId}-sub-${i + 1}`,
      description: faker.helpers.arrayElement(subPaymentCategories),
      amount: Math.max(amount, 1), // Ensure positive amount
      date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      category: faker.helpers.arrayElement(subPaymentCategories)
    })
  }
  
  return subPayments
}

function generateTags(): string[] {
  const numTags = faker.number.int({ min: 0, max: 4 })
  return faker.helpers.arrayElements(commonTags, numTags)
}

function generatePayment(id: string): Payment {
  const amount = faker.number.int({ min: 50, max: 5000 })
  const status = faker.helpers.arrayElement(paymentStatuses)
  const category = faker.helpers.arrayElement(paymentCategories)
  const priority = faker.helpers.arrayElement(priorities)
  const createdAt = faker.date.recent({ days: 90 })
  const dueDate = faker.date.future({ years: 1 })
  
  const payment: Payment = {
    id,
    amount,
    status,
    email: faker.internet.email(),
    category,
    priority,
    tags: generateTags(),
    createdAt: createdAt.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    subPayments: generateSubPayments(id, amount)
  }
  
  return payment
}

export function generatePaymentData(count: number = 1000): Payment[] {
  const payments: Payment[] = []
  
  // Set seed for consistent data generation
  faker.seed(12345)
  
  for (let i = 0; i < count; i++) {
    const paymentId = faker.string.alphanumeric(8)
    payments.push(generatePayment(paymentId))
  }
  
  return payments
}

// Generate the data with 1000 rows
export const generatedData = generatePaymentData(1000)

// Log data generation info
console.log(`Generated ${generatedData.length} payments with ${generatedData.reduce((total, payment) => total + (payment.subPayments?.length || 0), 0)} total sub-payments`)
