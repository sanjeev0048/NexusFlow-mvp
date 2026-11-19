import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

// Layout & Common
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DemoBanner } from './components/layout/DemoBanner';
import { ToastContainer } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Global Quick Modals
  const [isQuickLeadModalOpen, setIsQuickLeadModalOpen] = useState(false);
  const [isQuickProductModalOpen, setIsQuickProductModalOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  // Global Hotkey ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSetPage = (newPage: Page) => {
    setActivePage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Public Landing Page
  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] antialiased">
        <LandingPage setPage={handleSetPage} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // 2. Authentication Pages
  if (activePage === 'login') {
    return (
      <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] antialiased">
        <AuthPage mode="login" setPage={handleSetPage} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  if (activePage === 'signup') {
    return (
      <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] antialiased">
        <AuthPage mode="signup" setPage={handleSetPage} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // 3. Application Workspace Shell
  return (
    <div className="min-h-screen bg-[#080B14] font-sans text-[#F8FAFC] flex flex-col md:flex-row antialiased selection:bg-[#818CF8]/30 selection:text-white">
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
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
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

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setPage={handleSetPage}
        onOpenNewLead={() => setIsQuickLeadModalOpen(true)}
        onOpenNewProduct={() => setIsQuickProductModalOpen(true)}
      />

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
