# NexusFlow – All-in-One Enterprise SaaS CRM & ERP Platform

NexusFlow is a production-ready, multi-tenant enterprise operating system built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Supabase PostgreSQL RLS**, **Recharts**, **Lucide React**, and **Google Gemini API**.

---

## 🌟 Key Architecture & Capabilities

1. **Public Marketing Landing Page**
   - Modern dark-mode aesthetic with hero callout, live product mockup preview, feature breakdown, interactive pricing tiers, and FAQ.
2. **Executive Dashboard**
   - Real-time financial growth charts (AreaChart), vertical revenue distribution (PieChart), KPIs, and quick recent orders/prospects feeds.
3. **CRM & Sales Pipeline**
   - Complete leads management table with search, status filters, and CSV export.
   - Interactive Kanban pipeline stages (`New` → `Contacted` → `Qualified` → `Proposal` → `Closed Won` / `Closed Lost`).
   - Automated AI lead conversion score (0–100) based on deal size, corporate domain, and pipeline velocity.
   - One-click account conversion from Lead to Customer.
4. **Supply Chain & Warehouse Inventory**
   - Catalog management with SKU tracking, category tagging, and pricing/costs.
   - Real-time stock level monitoring with automated low-stock warnings when inventory falls below buffer thresholds.
   - Quick **Stock In / Stock Out** adjustment dialog with instant delta recalculation.
5. **Orders Workflow**
   - Purchase order fulfillment tracker (`Pending` → `Processing` → `Completed` → `Cancelled`).
   - Interactive order creation with multi-item catalog selections and automatic stock deduction.
6. **Finance & Billing Invoices**
   - Accounts receivable management (`Pending`, `Paid`, `Overdue`).
   - Dynamic line-item invoice builder with tax rate and balance calculation.
   - Dedicated printable/downloadable invoice sheet with one-click payment settlement.
   - Corporate expense tracking with categorized spending insights.
7. **HR & Workforce Management**
   - Employee directory with departmental roles, compensation, and status.
   - Real-time **Attendance Punch Console**: digital clock with 1-click **Clock In** and **Clock Out**, logging check-in/out timestamps and total hours worked.
8. **FlowAI Copilot (Powered by Google Gemini 1.5)**
   - Context-aware enterprise copilot with real-time access to database state.
   - Natural language querying for revenue margins, low-stock warnings, top prospects, and attendance logs.
   - Pre-configured prompt shortcuts and automatic fallback to an offline enterprise intelligence rule engine if an API key is not supplied.
9. **Multi-Tenant Security & Supabase RLS**
   - PostgreSQL schema with Row Level Security (RLS) policies on `organization_id` located in `supabase/migrations/20250101_init_schema.sql`.
   - Complete offline **Demo Mode** with persistent `localStorage` synchronization for zero-config evaluation.

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
cd c:\NexusFlow-mvp
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## ⚙️ Environment Configuration (Optional)

Create a `.env` file in the project root:

```env
# Supabase (Optional - NexusFlow uses local demo store if omitted)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API (Optional - FlowAI uses offline intelligence engine if omitted)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

*Note: You can also configure your Gemini API Key directly inside the application under **System Settings**.*
"# NexusFlow-mvp" 
