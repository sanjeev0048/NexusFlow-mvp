import { 
  Lead, Customer, Product, Order, Invoice, Expense, Employee, AttendanceRecord 
} from '../types';

export const STORAGE_KEYS = {
  USER: 'nexusflow_user',
  THEME: 'nexusflow_theme',
  GEMINI_KEY: 'nexusflow_gemini_key',
  LEADS: 'nexusflow_leads_v2',
  CUSTOMERS: 'nexusflow_customers_v2',
  PRODUCTS: 'nexusflow_products_v2',
  ORDERS: 'nexusflow_orders_v2',
  INVOICES: 'nexusflow_invoices_v2',
  EXPENSES: 'nexusflow_expenses_v2',
  EMPLOYEES: 'nexusflow_employees_v2',
  ATTENDANCE: 'nexusflow_attendance_v2'
};

export const initialLeads: Lead[] = [
  { 
    id: 'LD-101', 
    name: 'Sarah Jenkins', 
    company: 'Acme Corp', 
    email: 'sarah@acme.com', 
    phone: '+1 (555) 234-8890',
    value: 45000, 
    status: 'Qualified', 
    score: 88, 
    assignedTo: 'Marcus Vance',
    notes: 'Interested in enterprise cloud deployment for 200 seats.',
    createdAt: '2025-05-01' 
  },
  { 
    id: 'LD-102', 
    name: 'Michael Chang', 
    company: 'Global Tech Systems', 
    email: 'mchang@globaltech.io', 
    phone: '+1 (555) 789-2234',
    value: 120000, 
    status: 'Proposal', 
    score: 94, 
    assignedTo: 'Sophia Chen',
    notes: 'Requested custom SLA agreement and dedicated support engineer.',
    createdAt: '2025-05-04' 
  },
  { 
    id: 'LD-103', 
    name: 'Elena Rostova', 
    company: 'Vanguard Systems', 
    email: 'elena@vanguard.com', 
    phone: '+1 (555) 443-9021',
    value: 35000, 
    status: 'Contacted', 
    score: 62, 
    assignedTo: 'Marcus Vance',
    notes: 'Evaluating migration options from legacy on-premise ERP.',
    createdAt: '2025-05-08' 
  },
  { 
    id: 'LD-104', 
    name: 'David Miller', 
    company: 'Apex Logistics', 
    email: 'dmiller@apex.com', 
    phone: '+1 (555) 671-8842',
    value: 85000, 
    status: 'Closed Won', 
    score: 98, 
    assignedTo: 'Sophia Chen',
    notes: 'Contract signed. Onboarding scheduled for next Monday.',
    createdAt: '2025-05-10' 
  },
  { 
    id: 'LD-105', 
    name: 'Rachel Green', 
    company: 'Starlight Retail', 
    email: 'rachel@starlight.com', 
    phone: '+1 (555) 912-3341',
    value: 18000, 
    status: 'New', 
    score: 45, 
    assignedTo: 'Unassigned',
    notes: 'Downloaded product catalog from marketing landing page.',
    createdAt: '2025-05-14' 
  }
];

export const initialCustomers: Customer[] = [
  { id: 'CUST-01', name: 'Sarah Jenkins', company: 'Acme Corp', email: 'sarah@acme.com', phone: '+1 (555) 234-8890', totalSpend: 60000, ordersCount: 3, status: 'Active', joinedDate: '2024-11-12' },
  { id: 'CUST-02', name: 'David Miller', company: 'Apex Logistics', email: 'dmiller@apex.com', phone: '+1 (555) 671-8842', totalSpend: 97500, ordersCount: 2, status: 'Active', joinedDate: '2025-01-15' },
  { id: 'CUST-03', name: 'Marcus Bell', company: 'Nexus Dynamics', email: 'mbell@nexusdyn.io', phone: '+1 (555) 302-9912', totalSpend: 145000, ordersCount: 5, status: 'Active', joinedDate: '2024-08-20' },
  { id: 'CUST-04', name: 'Laura Lin', company: 'Horizon Media', email: 'laura@horizon.co', phone: '+1 (555) 881-2299', totalSpend: 24000, ordersCount: 1, status: 'Inactive', joinedDate: '2024-06-10' }
];

export const initialProducts: Product[] = [
  { id: 'PRD-001', name: 'Enterprise Cloud License', sku: 'ECL-8921', category: 'Software', price: 1200, cost: 300, stock: 450, lowStockThreshold: 50, status: 'In Stock', createdAt: '2025-01-10' },
  { id: 'PRD-002', name: 'Edge Router Pro X', sku: 'ERP-3301', category: 'Hardware', price: 450, cost: 220, stock: 12, lowStockThreshold: 20, status: 'Low Stock', createdAt: '2025-01-15' },
  { id: 'PRD-003', name: 'Database Optimization Suite', sku: 'DOS-9912', category: 'Software', price: 890, cost: 150, stock: 0, lowStockThreshold: 10, status: 'Out of Stock', createdAt: '2025-02-01' },
  { id: 'PRD-004', name: 'Security Audit Module', sku: 'SAM-1049', category: 'Services', price: 2500, cost: 800, stock: 99, lowStockThreshold: 15, status: 'In Stock', createdAt: '2025-02-12' },
  { id: 'PRD-005', name: 'AI Analytics Plugin', sku: 'AAP-4421', category: 'Software', price: 350, cost: 40, stock: 850, lowStockThreshold: 100, status: 'In Stock', createdAt: '2025-03-05' }
];

export const initialOrders: Order[] = [
  { 
    id: 'ORD-7001', 
    orderNumber: 'PO-2025-001',
    customer: 'Acme Corp', 
    customerEmail: 'billing@acme.com',
    date: '2025-05-10', 
    total: 45000, 
    status: 'Completed', 
    items: [
      { id: 'ITM-1', productId: 'PRD-001', productName: 'Enterprise Cloud License', quantity: 30, unitPrice: 1200, subtotal: 36000 },
      { id: 'ITM-2', productId: 'PRD-002', productName: 'Edge Router Pro X', quantity: 20, unitPrice: 450, subtotal: 9000 }
    ]
  },
  { 
    id: 'ORD-7002', 
    orderNumber: 'PO-2025-002',
    customer: 'Apex Logistics', 
    customerEmail: 'accounts@apex.com',
    date: '2025-05-12', 
    total: 12500, 
    status: 'Processing', 
    items: [
      { id: 'ITM-3', productId: 'PRD-004', productName: 'Security Audit Module', quantity: 5, unitPrice: 2500, subtotal: 12500 }
    ]
  },
  { 
    id: 'ORD-7003', 
    orderNumber: 'PO-2025-003',
    customer: 'Starlight Retail', 
    customerEmail: 'purchasing@starlight.com',
    date: '2025-05-14', 
    total: 3500, 
    status: 'Pending', 
    items: [
      { id: 'ITM-4', productId: 'PRD-005', productName: 'AI Analytics Plugin', quantity: 10, unitPrice: 350, subtotal: 3500 }
    ]
  },
  { 
    id: 'ORD-7004', 
    orderNumber: 'PO-2025-004',
    customer: 'Nexus Dynamics', 
    customerEmail: 'ops@nexusdyn.io',
    date: '2025-05-15', 
    total: 89000, 
    status: 'Completed', 
    items: [
      { id: 'ITM-5', productId: 'PRD-001', productName: 'Enterprise Cloud License', quantity: 60, unitPrice: 1200, subtotal: 72000 },
      { id: 'ITM-6', productId: 'PRD-004', productName: 'Security Audit Module', quantity: 6, unitPrice: 2500, subtotal: 15000 },
      { id: 'ITM-7', productId: 'PRD-002', productName: 'Edge Router Pro X', quantity: 4, unitPrice: 500, subtotal: 2000 }
    ]
  }
];

export const initialInvoices: Invoice[] = [
  { 
    id: 'INV-301', 
    invoiceNumber: 'INV-2025-001',
    client: 'Acme Corp', 
    clientEmail: 'billing@acme.com',
    subtotal: 13636.36,
    taxRate: 10,
    taxAmount: 1363.64,
    totalAmount: 15000, 
    issueDate: '2025-05-01',
    dueDate: '2025-06-01', 
    status: 'Paid',
    items: [
      { id: 'II-1', description: 'Enterprise License Deployment', quantity: 1, unitPrice: 13636.36, total: 13636.36 }
    ],
    notes: 'Thank you for your business. Payment received via Wire Transfer.'
  },
  { 
    id: 'INV-302', 
    invoiceNumber: 'INV-2025-002',
    client: 'Global Tech Systems', 
    clientEmail: 'payables@globaltech.io',
    subtotal: 40909.09,
    taxRate: 10,
    taxAmount: 4090.91,
    totalAmount: 45000, 
    issueDate: '2025-05-10',
    dueDate: '2025-05-25', 
    status: 'Pending',
    items: [
      { id: 'II-2', description: 'Phase 1 ERP Migration & Integration', quantity: 1, unitPrice: 40909.09, total: 40909.09 }
    ],
    notes: 'Net 15 payment terms. Remit payment to Silicon Valley Bank.'
  },
  { 
    id: 'INV-303', 
    invoiceNumber: 'INV-2025-003',
    client: 'Vanguard Systems', 
    clientEmail: 'accounting@vanguard.com',
    subtotal: 10909.09,
    taxRate: 10,
    taxAmount: 1090.91,
    totalAmount: 12000, 
    issueDate: '2025-04-15',
    dueDate: '2025-05-01', 
    status: 'Overdue',
    items: [
      { id: 'II-3', description: 'Q1 Consulting & Audit Retainer', quantity: 1, unitPrice: 10909.09, total: 10909.09 }
    ],
    notes: 'Overdue notice sent on May 5th.'
  },
  { 
    id: 'INV-304', 
    invoiceNumber: 'INV-2025-004',
    client: 'Apex Logistics', 
    clientEmail: 'finance@apex.com',
    subtotal: 25454.55,
    taxRate: 10,
    taxAmount: 2545.45,
    totalAmount: 28000, 
    issueDate: '2025-05-12',
    dueDate: '2025-06-10', 
    status: 'Pending',
    items: [
      { id: 'II-4', description: 'Supply Chain Tracker Software & Routers', quantity: 1, unitPrice: 25454.55, total: 25454.55 }
    ]
  }
];

export const initialExpenses: Expense[] = [
  { id: 'EXP-101', vendor: 'Amazon Web Services', category: 'Infrastructure', amount: 14200, date: '2025-05-14', description: 'Monthly production cloud hosting & RDS clusters' },
  { id: 'EXP-102', vendor: 'WeWork Global Space', category: 'Office & Rent', amount: 8500, date: '2025-05-01', description: 'HQ Office lease - May 2025' },
  { id: 'EXP-103', vendor: 'Google Ads & Meta', category: 'Marketing', amount: 6200, date: '2025-05-08', description: 'B2B enterprise lead generation campaigns' },
  { id: 'EXP-104', vendor: 'Slack & GitHub Enterprise', category: 'Software & Tools', amount: 2400, date: '2025-05-03', description: 'Developer productivity licenses' },
  { id: 'EXP-105', vendor: 'Delta Air Lines & Hotels', category: 'Travel', amount: 3100, date: '2025-05-11', description: 'Client on-site discovery workshops in Chicago' }
];

export const initialEmployees: Employee[] = [
  { id: 'EMP-01', name: 'Alexander Wright', role: 'VP of Engineering', department: 'Engineering', email: 'alex.w@nexusflow.io', phone: '+1 (555) 101-2001', status: 'Active', salary: 185000, joinedDate: '2023-03-01' },
  { id: 'EMP-02', name: 'Sophia Chen', role: 'Senior Product Manager', department: 'Product', email: 'sophia.c@nexusflow.io', phone: '+1 (555) 101-2002', status: 'Active', salary: 145000, joinedDate: '2023-06-15' },
  { id: 'EMP-03', name: 'Marcus Vance', role: 'Account Executive', department: 'Sales', email: 'marcus.v@nexusflow.io', phone: '+1 (555) 101-2003', status: 'On Leave', salary: 110000, joinedDate: '2024-01-10' },
  { id: 'EMP-04', name: 'Emily Watson', role: 'Lead UI/UX Designer', department: 'Product', email: 'emily.w@nexusflow.io', phone: '+1 (555) 101-2004', status: 'Active', salary: 130000, joinedDate: '2023-09-01' },
  { id: 'EMP-05', name: 'David Zhao', role: 'Senior DevOps Architect', department: 'Engineering', email: 'david.z@nexusflow.io', phone: '+1 (555) 101-2005', status: 'Active', salary: 160000, joinedDate: '2024-04-01' }
];

export const initialAttendance: AttendanceRecord[] = [
  { id: 'ATT-01', employeeId: 'EMP-01', employeeName: 'Alexander Wright', date: '2025-05-18', checkIn: '08:55 AM', checkOut: '05:30 PM', hoursWorked: 8.58, status: 'Present' },
  { id: 'ATT-02', employeeId: 'EMP-02', employeeName: 'Sophia Chen', date: '2025-05-18', checkIn: '09:02 AM', checkOut: '05:15 PM', hoursWorked: 8.21, status: 'Present' },
  { id: 'ATT-03', employeeId: 'EMP-03', employeeName: 'Marcus Vance', date: '2025-05-18', checkIn: null, checkOut: null, hoursWorked: 0, status: 'On Leave' },
  { id: 'ATT-04', employeeId: 'EMP-04', employeeName: 'Emily Watson', date: '2025-05-18', checkIn: '09:35 AM', checkOut: '06:00 PM', hoursWorked: 8.41, status: 'Late' },
  { id: 'ATT-05', employeeId: 'EMP-05', employeeName: 'David Zhao', date: '2025-05-18', checkIn: '08:45 AM', checkOut: '05:00 PM', hoursWorked: 8.25, status: 'Present' }
];

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to store key ${key}`, error);
  }
}
