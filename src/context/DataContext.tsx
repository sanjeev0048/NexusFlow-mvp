import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Lead, Customer, Product, Order, Invoice, Expense, Employee, AttendanceRecord, ToastMessage, LeadStatus, InvoiceStatus, OrderStatus 
} from '../types';
import { 
  STORAGE_KEYS, getStoredData, setStoredData, 
  initialLeads, initialCustomers, initialProducts, initialOrders, 
  initialInvoices, initialExpenses, initialEmployees, initialAttendance 
} from '../lib/storage';
import { calculateAILeadScore, generateId } from '../lib/utils';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Leads (CRM)
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'score'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  assignLeadEmployee: (id: string, employeeName: string) => void;
  convertLeadToCustomer: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedDate' | 'ordersCount' | 'totalSpend'>) => void;
  deleteCustomer: (id: string) => void;

  // Products & Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustProductStock: (id: string, delta: number) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Employees & HR
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'joinedDate'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Attendance
  attendance: AttendanceRecord[];
  currentAttendance: AttendanceRecord | null;
  toggleCheckIn: () => void;

  // Settings & Gemini API key
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  resetAllDemoData: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // State with LocalStorage backing
  const [leads, setLeads] = useState<Lead[]>(() => getStoredData(STORAGE_KEYS.LEADS, initialLeads));
  const [customers, setCustomers] = useState<Customer[]>(() => getStoredData(STORAGE_KEYS.CUSTOMERS, initialCustomers));
  const [products, setProducts] = useState<Product[]>(() => getStoredData(STORAGE_KEYS.PRODUCTS, initialProducts));
  const [orders, setOrders] = useState<Order[]>(() => getStoredData(STORAGE_KEYS.ORDERS, initialOrders));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredData(STORAGE_KEYS.INVOICES, initialInvoices));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStoredData(STORAGE_KEYS.EXPENSES, initialExpenses));
  const [employees, setEmployees] = useState<Employee[]>(() => getStoredData(STORAGE_KEYS.EMPLOYEES, initialEmployees));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStoredData(STORAGE_KEYS.ATTENDANCE, initialAttendance));
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => getStoredData(STORAGE_KEYS.GEMINI_KEY, ''));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auto-sync state changes to storage
  useEffect(() => { setStoredData(STORAGE_KEYS.LEADS, leads); }, [leads]);
  useEffect(() => { setStoredData(STORAGE_KEYS.CUSTOMERS, customers); }, [customers]);
  useEffect(() => { setStoredData(STORAGE_KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { setStoredData(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { setStoredData(STORAGE_KEYS.INVOICES, invoices); }, [invoices]);
  useEffect(() => { setStoredData(STORAGE_KEYS.EXPENSES, expenses); }, [expenses]);
  useEffect(() => { setStoredData(STORAGE_KEYS.EMPLOYEES, employees); }, [employees]);
  useEffect(() => { setStoredData(STORAGE_KEYS.ATTENDANCE, attendance); }, [attendance]);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    setStoredData(STORAGE_KEYS.GEMINI_KEY, key);
    addToast({ type: 'success', title: 'Settings Saved', message: 'FlowAI Gemini API key configured.' });
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ==========================================
  // CRM: LEADS OPERATIONS
  // ==========================================
  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'score'>) => {
    const score = calculateAILeadScore({
      value: newLeadData.value,
      email: newLeadData.email,
      company: newLeadData.company,
      status: newLeadData.status
    });

    const lead: Lead = {
      ...newLeadData,
      id: generateId('LD'),
      score,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeads(prev => [lead, ...prev]);
    addToast({ type: 'success', title: 'Lead Created', message: `${lead.name} (${lead.company}) added with AI Score: ${score}` });
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        const updated = { ...lead, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        if (updates.value !== undefined || updates.status !== undefined) {
          updated.score = calculateAILeadScore({
            value: updated.value,
            email: updated.email,
            company: updated.company,
            status: updated.status
          });
        }
        return updated;
      }
      return lead;
    }));
    addToast({ type: 'info', title: 'Lead Updated', message: 'Lead details have been saved.' });
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    addToast({ type: 'warning', title: 'Lead Deleted', message: 'The prospect was removed from pipeline.' });
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    updateLead(id, { status });
  };

  const assignLeadEmployee = (id: string, employeeName: string) => {
    updateLead(id, { assignedTo: employeeName });
    addToast({ type: 'info', title: 'Lead Assigned', message: `Assigned to ${employeeName}` });
  };

  const convertLeadToCustomer = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    // Check if already customer
    const existing = customers.find(c => c.email.toLowerCase() === lead.email.toLowerCase());
    if (existing) {
      addToast({ type: 'info', title: 'Customer Exists', message: `${lead.name} is already registered.` });
      return;
    }

    const newCustomer: Customer = {
      id: generateId('CUST'),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      totalSpend: lead.value,
      ordersCount: 1,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setCustomers(prev => [newCustomer, ...prev]);
    updateLeadStatus(id, 'Closed Won');
    addToast({ type: 'success', title: 'Account Converted', message: `${lead.name} is now an active Customer!` });
  };

  // ==========================================
  // CUSTOMERS OPERATIONS
  // ==========================================
  const addCustomer = (customerData: Omit<Customer, 'id' | 'joinedDate' | 'ordersCount' | 'totalSpend'>) => {
    const customer: Customer = {
      ...customerData,
      id: generateId('CUST'),
      totalSpend: 0,
      ordersCount: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [customer, ...prev]);
    addToast({ type: 'success', title: 'Customer Created', message: `${customer.company} added to accounts.` });
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast({ type: 'info', title: 'Customer Removed', message: 'Customer record deleted.' });
  };

  // ==========================================
  // INVENTORY OPERATIONS
  // ==========================================
  const addProduct = (prodData: Omit<Product, 'id' | 'status' | 'createdAt'>) => {
    const status: Product['status'] = 
      prodData.stock <= 0 ? 'Out of Stock' : prodData.stock <= prodData.lowStockThreshold ? 'Low Stock' : 'In Stock';

    const product: Product = {
      ...prodData,
      id: generateId('PRD'),
      status,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [product, ...prev]);
    addToast({ type: 'success', title: 'Product Added', message: `${product.name} (SKU: ${product.sku}) is now active.` });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updates };
        merged.status = merged.stock <= 0 ? 'Out of Stock' : merged.stock <= merged.lowStockThreshold ? 'Low Stock' : 'In Stock';
        return merged;
      }
      return p;
    }));
    addToast({ type: 'info', title: 'Catalog Updated', message: 'Product parameters saved.' });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast({ type: 'warning', title: 'Product Deleted', message: 'Item removed from catalog.' });
  };

  const adjustProductStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        const newStatus: Product['status'] = 
          newStock <= 0 ? 'Out of Stock' : newStock <= p.lowStockThreshold ? 'Low Stock' : 'In Stock';
        
        if (newStock <= p.lowStockThreshold) {
          addToast({ 
            type: 'warning', 
            title: 'Low Stock Alert', 
            message: `${p.name} stock level is now at ${newStock} units!` 
          });
        }
        return { ...p, stock: newStock, status: newStatus };
      }
      return p;
    }));
  };

  // ==========================================
  // ORDERS OPERATIONS
  // ==========================================
  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const order: Order = {
      ...orderData,
      id: generateId('ORD')
    };

    // Deduct stock for included items
    order.items.forEach(item => {
      adjustProductStock(item.productId, -item.quantity);
    });

    setOrders(prev => [order, ...prev]);
    addToast({ type: 'success', title: 'Order Submitted', message: `Order #${order.orderNumber} placed for $${order.total.toLocaleString()}.` });
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addToast({ type: 'info', title: 'Order Status Changed', message: `Order marked as ${status}.` });
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    addToast({ type: 'warning', title: 'Order Cancelled', message: 'Order record deleted.' });
  };

  // ==========================================
  // INVOICES OPERATIONS
  // ==========================================
  const addInvoice = (invData: Omit<Invoice, 'id'>) => {
    const invoice: Invoice = {
      ...invData,
      id: generateId('INV')
    };
    setInvoices(prev => [invoice, ...prev]);
    addToast({ type: 'success', title: 'Invoice Issued', message: `Invoice #${invoice.invoiceNumber} drafted for $${invoice.totalAmount.toLocaleString()}.` });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    addToast({ type: 'info', title: 'Invoice Updated', message: `Invoice status changed to ${status}.` });
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    addToast({ type: 'warning', title: 'Invoice Removed', message: 'Invoice was permanently deleted.' });
  };

  // ==========================================
  // EXPENSES OPERATIONS
  // ==========================================
  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...expData,
      id: generateId('EXP')
    };
    setExpenses(prev => [expense, ...prev]);
    addToast({ type: 'success', title: 'Expense Logged', message: `$${expense.amount.toLocaleString()} for ${expense.vendor} recorded.` });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addToast({ type: 'info', title: 'Expense Removed', message: 'Record removed.' });
  };

  // ==========================================
  // HR & EMPLOYEES
  // ==========================================
  const addEmployee = (empData: Omit<Employee, 'id' | 'joinedDate'>) => {
    const employee: Employee = {
      ...empData,
      id: generateId('EMP'),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [employee, ...prev]);
    addToast({ type: 'success', title: 'Employee Registered', message: `${employee.name} added to ${employee.department}.` });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addToast({ type: 'info', title: 'Profile Updated', message: 'Employee file updated.' });
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    addToast({ type: 'warning', title: 'Employee Removed', message: 'Staff member directory updated.' });
  };

  // Current user's attendance status today
  const todayStr = new Date().toISOString().split('T')[0];
  const currentAttendance = attendance.find(a => a.employeeName === (user?.name || 'Alex Morgan') && a.date === todayStr) || null;

  const toggleCheckIn = () => {
    const empName = user?.name || 'Alex Morgan';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!currentAttendance || !currentAttendance.checkIn) {
      // Check In
      const newRecord: AttendanceRecord = {
        id: generateId('ATT'),
        employeeId: user?.id || 'EMP-01',
        employeeName: empName,
        date: todayStr,
        checkIn: nowTime,
        checkOut: null,
        hoursWorked: 0,
        status: 'Present'
      };
      setAttendance(prev => [newRecord, ...prev]);
      addToast({ type: 'success', title: 'Checked In', message: `Good morning, ${empName}! Time logged: ${nowTime}` });
    } else if (!currentAttendance.checkOut) {
      // Check Out
      setAttendance(prev => prev.map(a => {
        if (a.id === currentAttendance.id) {
          return {
            ...a,
            checkOut: nowTime,
            hoursWorked: 8.5
          };
        }
        return a;
      }));
      addToast({ type: 'info', title: 'Checked Out', message: `Punch-out recorded at ${nowTime}. Have a great evening!` });
    } else {
      addToast({ type: 'info', title: 'Shift Complete', message: 'You have already completed check-in and check-out for today.' });
    }
  };

  const resetAllDemoData = () => {
    setLeads(initialLeads);
    setCustomers(initialCustomers);
    setProducts(initialProducts);
    setOrders(initialOrders);
    setInvoices(initialInvoices);
    setExpenses(initialExpenses);
    setEmployees(initialEmployees);
    setAttendance(initialAttendance);
    addToast({ type: 'success', title: 'Demo Data Reset', message: 'Workspace reset to default enterprise sample data.' });
  };

  return (
    <DataContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        deleteLead,
        updateLeadStatus,
        assignLeadEmployee,
        convertLeadToCustomer,

        customers,
        addCustomer,
        deleteCustomer,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,

        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,

        invoices,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,

        expenses,
        addExpense,
        deleteExpense,

        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,

        attendance,
        currentAttendance,
        toggleCheckIn,

        geminiApiKey,
        setGeminiApiKey,
        resetAllDemoData,

        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
