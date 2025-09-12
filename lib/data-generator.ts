import { faker } from '@faker-js/faker'

export type Project = {
  id: string
  customerEmail: string
  customerName: string
  grossPrice: number
  netPrice: number
  deliveryMethod: "standard" | "express" | "overnight" | "pickup"
  paymentMethod: "credit_card" | "bank_transfer" | "paypal" | "crypto" | "invoice"
  ticketStatus: "draft" | "pending" | "in_progress" | "review" | "completed" | "cancelled"
  createdAt?: string
  dueDate?: string
  parts?: Part[]
}

export type Part = {
  id: string
  modelName: string
  volume: number
  boundingBox: {
    width: number
    height: number
    depth: number
  }
  shippingDeadline: string
  quantity: number
  stlImageUrl?: string
}

// Project statuses with realistic distribution
const ticketStatuses: Project['ticketStatus'][] = ['completed', 'completed', 'in_progress', 'pending', 'review', 'draft', 'cancelled']
const deliveryMethods: Project['deliveryMethod'][] = ['standard', 'standard', 'express', 'overnight', 'pickup']
const paymentMethods: Project['paymentMethod'][] = ['credit_card', 'credit_card', 'bank_transfer', 'paypal', 'crypto', 'invoice']

// 3D model file extensions and naming patterns
const modelExtensions = ['stl', 'step', 'obj', 'ply', '3mf']
const modelNamePrefixes = [
  'Box', 'Cylinder', 'Sphere', 'Pyramid', 'Cone', 'Torus', 'Gear', 'Bracket',
  'Housing', 'Cover', 'Base', 'Mount', 'Adapter', 'Connector', 'Frame',
  'Panel', 'Block', 'Disk', 'Ring', 'Tube', 'Rod', 'Plate', 'Beam'
]
const modelNameSuffixes = [
  '1mm', '2mm', '5mm', '10mm', '20mm', '50mm', '100mm', '200mm',
  'v1', 'v2', 'v3', 'final', 'draft', 'prototype', 'production'
]

// STL 2D image placeholders - using Picsum Photos for beautiful random images
const stlImageUrls = [
  'https://picsum.photos/80/60?random=1',
  'https://picsum.photos/80/60?random=2',
  'https://picsum.photos/80/60?random=3',
  'https://picsum.photos/80/60?random=4',
  'https://picsum.photos/80/60?random=5',
  'https://picsum.photos/80/60?random=6',
  'https://picsum.photos/80/60?random=7',
  'https://picsum.photos/80/60?random=8',
  'https://picsum.photos/80/60?random=9',
  'https://picsum.photos/80/60?random=10',
  'https://picsum.photos/80/60?random=11',
  'https://picsum.photos/80/60?random=12'
]

function generateParts(projectId: string): Part[] {
  const parts: Part[] = []
  const numParts = faker.number.int({ min: 2, max: 8 })
  
  for (let i = 0; i < numParts; i++) {
    const prefix = faker.helpers.arrayElement(modelNamePrefixes)
    const suffix = faker.helpers.arrayElement(modelNameSuffixes)
    const extension = faker.helpers.arrayElement(modelExtensions)
    
    parts.push({
      id: `${projectId}-${i + 1}`,
      modelName: `${suffix}_${prefix}.${extension}`,
      volume: faker.number.float({ min: 0.1, max: 1000, fractionDigits: 2 }),
      boundingBox: {
        width: faker.number.float({ min: 1, max: 500, fractionDigits: 1 }),
        height: faker.number.float({ min: 1, max: 500, fractionDigits: 1 }),
        depth: faker.number.float({ min: 1, max: 500, fractionDigits: 1 })
      },
      shippingDeadline: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      quantity: faker.number.int({ min: 1, max: 50 }),
      stlImageUrl: faker.helpers.arrayElement(stlImageUrls)
    })
  }
  
  return parts
}

function generateProject(projectNumber: number): Project {
  const grossPrice = faker.number.int({ min: 100, max: 10000 })
  const netPrice = Math.floor(grossPrice * faker.number.float({ min: 0.8, max: 0.95, fractionDigits: 2 }))
  const ticketStatus = faker.helpers.arrayElement(ticketStatuses)
  const deliveryMethod = faker.helpers.arrayElement(deliveryMethods)
  const paymentMethod = faker.helpers.arrayElement(paymentMethods)
  const createdAt = faker.date.recent({ days: 90 })
  const dueDate = faker.date.future({ years: 1 })
  
  const projectId = `PROJECT-${projectNumber.toString().padStart(5, '0')}`
  
  const project: Project = {
    id: projectId,
    customerEmail: faker.internet.email(),
    customerName: faker.person.fullName(),
    grossPrice,
    netPrice,
    deliveryMethod,
    paymentMethod,
    ticketStatus,
    createdAt: createdAt.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    parts: generateParts(projectId)
  }
  
  return project
}

export function generateProjectData(count: number = 1000): Project[] {
  const projects: Project[] = []
  
  // Set seed for consistent data generation
  faker.seed(12345)
  
  for (let i = 0; i < count; i++) {
    projects.push(generateProject(i + 1))
  }
  
  return projects
}

// Generate the data with 1000 rows
export const generatedData = generateProjectData(1000)

// Log data generation info
console.log(`Generated ${generatedData.length} projects with ${generatedData.reduce((total, project) => total + (project.parts?.length || 0), 0)} total parts`)
