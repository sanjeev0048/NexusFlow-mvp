// ==========================================
// NEXUSFLOW CORE TYPES & DATA CONTRACTS
// ==========================================

export type Page = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'leads' 
  | 'customers' 
  | 'sales-pipeline' 
  | 'products' 
  | 'orders' 
  | 'invoices' 
  | 'expenses' 
  | 'employees' 
  | 'attendance' 
  | 'analytics' 
  | 'flow-ai' 
  | 'settings';

export type UserRole = 'admin' | 'manager' | 'sales' | 'finance' | 'hr' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  avatar?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed Won' | 'Closed Lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  value: number;
  status: LeadStatus;
  score: number; // AI score 0-100
  assignedTo?: string; // Employee ID or name
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  totalSpend: number;
  ordersCount: number;
  status: 'Active' | 'Inactive' | 'Churned';
  joinedDate: string;
}

export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Software' | 'Hardware' | 'Services' | 'Consulting' | string;
  price: number;
  cost?: number;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail?: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  clientEmail?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
}

export type ExpenseCategory = 
  | 'Infrastructure' 
  | 'Office & Rent' 
  | 'Marketing' 
  | 'Payroll' 
  | 'Software & Tools' 
  | 'Travel' 
  | 'Other';

export interface Expense {
  id: string;
  vendor: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description?: string;
  receiptUrl?: string;
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Sales' | 'Marketing' | 'Finance' | 'HR' | 'Operations';
  email: string;
  phone?: string;
  status: EmployeeStatus;
  salary?: number;
  joinedDate: string;
  avatar?: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number;
  status: AttendanceStatus;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
