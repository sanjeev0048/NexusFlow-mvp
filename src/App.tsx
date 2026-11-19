import React, { useState, useEffect } from 'react';
import { Page, Product } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

// Layout & Common
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DemoBanner } from './components/layout/DemoBanner';
import { ToastContainer } from './components/common/Toast';
import { LeadModal } from './components/crm/LeadModal';
import { ProductModal } from './components/inventory/ProductModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { CustomersPage } from './pages/CustomersPage';
import { SalesPipelinePage } from './pages/SalesPipelinePage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FlowAIPage } from './pages/FlowAIPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toasts, removeToast } = useData();

  const [activePage, setActivePage] = useState<Page>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (window.localStorage.getItem('nexusflow_theme') as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Global Quick Modals
  const [isQuickLeadModalOpen, setIsQuickLeadModalOpen] = useState(false);
  const [isQuickProductModalOpen, setIsQuickProductModalOpen] = useState(false);

  // Sync theme to root html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('nexusflow_theme', theme);
    } catch {}
  }, [theme]);

  // Auth routing enforcement: if user accesses dashboard while logged out, or logs in, handle transition
  const handleSetPage = (newPage: Page) => {
    setActivePage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Public Landing Page
  if (activePage === 'landing') {
    return (
      <>
        <LandingPage setPage={handleSetPage} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // 2. Authentication Pages
  if (activePage === 'login') {
    return (
      <>
        <AuthPage mode="login" setPage={handleSetPage} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  if (activePage === 'signup') {
    return (
      <>
        <AuthPage mode="signup" setPage={handleSetPage} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // 3. Application Workspace Shell
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Enterprise Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setPage={handleSetPage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Supabase / Demo Status Banner */}
        <DemoBanner onOpenSettings={() => handleSetPage('settings')} />

        {/* Global Top Navbar */}
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          theme={theme} 
          setTheme={setTheme} 
        />

        {/* Active Page View */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activePage === 'dashboard' && (
            <DashboardPage 
              setPage={handleSetPage} 
              onOpenNewLead={() => setIsQuickLeadModalOpen(true)}
              onOpenNewProduct={() => setIsQuickProductModalOpen(true)}
            />
          )}

          {activePage === 'leads' && <LeadsPage />}
          {activePage === 'customers' && <CustomersPage />}
          {activePage === 'sales-pipeline' && <SalesPipelinePage />}
          {activePage === 'products' && <ProductsPage />}
          {activePage === 'orders' && <OrdersPage />}
          {activePage === 'invoices' && <InvoicesPage />}
          {activePage === 'expenses' && <ExpensesPage />}
          {activePage === 'employees' && <EmployeesPage />}
          {activePage === 'attendance' && <AttendancePage />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === 'flow-ai' && <FlowAIPage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Quick Access Modals */}
      <LeadModal
        isOpen={isQuickLeadModalOpen}
        onClose={() => setIsQuickLeadModalOpen(false)}
      />

      <ProductModal
        isOpen={isQuickProductModalOpen}
        onClose={() => setIsQuickProductModalOpen(false)}
      />

      {/* Global Toast System */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
