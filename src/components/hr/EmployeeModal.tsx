import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Employee, EmployeeStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, employeeToEdit }) => {
  const { addEmployee, updateEmployee } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('Engineering');
  const [status, setStatus] = useState<EmployeeStatus>('Active');
  const [salary, setSalary] = useState<number>(120000);

  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setEmail(employeeToEdit.email);
      setPhone(employeeToEdit.phone || '');
      setRole(employeeToEdit.role);
      setDepartment(employeeToEdit.department);
      setStatus(employeeToEdit.status);
      setSalary(employeeToEdit.salary || 100000);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setRole('Software Engineer');
      setDepartment('Engineering');
      setStatus('Active');
      setSalary(125000);
    }
  }, [employeeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, {
        name,
        email,
        phone,
        role,
        department,
        status,
        salary: Number(salary)
      });
    } else {
      addEmployee({
        name,
        email,
        phone,
        role,
        department,
        status,
        salary: Number(salary)
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? 'Edit Team Member' : 'Add Team Member'}
      subtitle="Register team member department, role, salary & status"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Corporate Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@nexusflow.io"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Role / Job Title *</label>
            <input
              type="text"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Lead Platform Architect"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Department</label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value as any)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition cursor-pointer"
            >
              <option value="Engineering" className="bg-[#101827]">Engineering</option>
              <option value="Product" className="bg-[#101827]">Product</option>
              <option value="Sales" className="bg-[#101827]">Sales</option>
              <option value="Marketing" className="bg-[#101827]">Marketing</option>
              <option value="Finance" className="bg-[#101827]">Finance</option>
              <option value="HR" className="bg-[#101827]">HR</option>
              <option value="Operations" className="bg-[#101827]">Operations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Annual Salary ($)</label>
            <input
              type="number"
              min={0}
              step={5000}
              value={salary}
              onChange={e => setSalary(Number(e.target.value))}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#818CF8]/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as EmployeeStatus)}
              className="w-full p-2.5 bg-[#151F32] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#818CF8]/60 transition cursor-pointer"
            >
              <option value="Active" className="bg-[#101827]">Active</option>
              <option value="On Leave" className="bg-[#101827]">On Leave</option>
              <option value="Terminated" className="bg-[#101827]">Terminated</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white border border-white/[0.08] font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#818CF8] hover:bg-[#6366F1] text-[#080B14] font-bold rounded-xl shadow-glow-primary transition active:scale-95"
          >
            {employeeToEdit ? 'Save Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
