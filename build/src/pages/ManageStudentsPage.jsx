/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSpace } from '../context/SpaceContext';
import { Search, PlusCircle, GraduationCap, X } from 'lucide-react';
export const ManageStudentsPage = () => {
  const {
    studentAccounts,
    updateStudentStatus,
    addStudent
  } = useSpace();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Bulks
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Registration Dialog Open State
  const [formOpen, setFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formDept, setFormDept] = useState('Computer Science');

  // Filter accounts
  const filteredStudents = studentAccounts.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const toggleSelectStudent = id => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(x => x !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };
  const handleBulkAction = action => {
    if (selectedStudentIds.length === 0) return;
    const confirmMsg = `Are you sure you want to bulk ${action} the ${selectedStudentIds.length} checked student profiles?`;
    if (confirm(confirmMsg)) {
      selectedStudentIds.forEach(id => {
        const targetStatus = action === 'Suspend' ? 'Suspended' : action === 'Activate' ? 'Active' : 'Flagged';
        updateStudentStatus(id, targetStatus);
      });
      setSelectedStudentIds([]);
      alert(`Bulk ${action} execution completed successfully.`);
    }
  };
  const handleCreateStudent = e => {
    e.preventDefault();
    if (!formName || !formEmail || !formStudentId) {
      alert('Please write all registration fields.');
      return;
    }
    addStudent({
      name: formName,
      email: formEmail,
      studentId: formStudentId,
      department: formDept,
      status: 'Active'
    });
    setFormName('');
    setFormEmail('');
    setFormStudentId('');
    setFormOpen(false);
    alert('Student registered successfully in the system database!');
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 selection:bg-indigo-950 font-sans">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Student Academic Registry</h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            Operator management system for student accounts, trust ratings, and compliance checks
          </p>
        </div>

        <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition">
          <PlusCircle size={15} />
          <span>Add New Student Profile</span>
        </button>
      </div>

      {/* Main Table Interface container */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        
        {/* Search & filters bar */}
        <div className="p-4 bg-slate-950/45 border-b border-slate-850 flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
          <div className="relative w-full max-w-sm">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search student by name or academic ID..." className="w-full pl-9 pr-4 py-2 bg-[#0c101c] border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-650 transition text-xs" />
            <Search className="absolute left-3.5 top-2.5 text-slate-500" size={14} />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="font-mono text-slate-500 text-[10px] uppercase tracking-wider">Status:</span>
            <div className="flex gap-1.5">
              {['All', 'Active', 'Suspended', 'Flagged'].map(st => <button key={st} onClick={() => setStatusFilter(st)} className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${statusFilter === st ? 'bg-indigo-600 border-indigo-505 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-400'}`}>
                  {st}
                </button>)}
            </div>
          </div>
        </div>

        {/* Bulk Action Controls Drawer */}
        {selectedStudentIds.length > 0 && <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-550 border border-indigo-400 rounded-full animate-ping" />
              <p className="text-slate-300 font-bold">
                {selectedStudentIds.length} profiles checked for bulk operation:
              </p>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => handleBulkAction('Suspend')} className="px-3 py-1.5 bg-red-955 hover:bg-red-900 border border-red-500/10 text-red-300 rounded font-bold cursor-pointer">
                Suspending Profiles
              </button>
              <button onClick={() => handleBulkAction('Activate')} className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/10 text-emerald-355 rounded font-bold cursor-pointer">
                Re-Activate
              </button>
              <button onClick={() => handleBulkAction('Notify')} className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 border border-emerald-500/10 text-amber-300 rounded font-medium cursor-pointer">
                Flag Incident
              </button>
            </div>
          </div>}

        {/* Dense Table Element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#111625] border-b border-slate-800 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 w-10">
                  <input type="checkbox" checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} className="accent-indigo-550 rounded border-slate-705 w-4 h-4 cursor-pointer" />
                </th>
                <th className="px-6 py-3.5">Student Profile</th>
                <th className="px-6 py-3.5">Academic Mail Address</th>
                <th className="px-6 py-3.5">Department Specialty</th>
                <th className="px-6 py-3.5">Assigned Desk</th>
                <th className="px-6 py-3.5">Status Check</th>
                <th className="px-6 py-3.5 text-right w-36">Actions Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.length === 0 ? <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    No student registrations found in database index.
                  </td>
                </tr> : filteredStudents.map(stu => <tr key={stu.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selectedStudentIds.includes(stu.id)} onChange={() => toggleSelectStudent(stu.id)} className="accent-indigo-550 rounded border-slate-705 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={stu.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700 object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-white text-sm">{stu.name}</p>
                        <p className="text-[10px] text-slate-505 font-mono font-medium">{stu.studentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">{stu.email}</td>
                    <td className="px-6 py-4 flex items-center gap-1.5">
                      <GraduationCap size={13} className="text-slate-500 mb-0.5" />
                      <span>{stu.department}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400 font-bold">{stu.activeDesk || 'None seated'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-black border ${stu.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : stu.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        <span className={`w-1 h-1 rounded-full ${stu.status === 'Active' ? 'bg-emerald-500' : stu.status === 'Suspended' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        {stu.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {stu.status === 'Suspended' ? <button onClick={() => updateStudentStatus(stu.id, 'Active')} className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer">
                          Re-Activate
                        </button> : <button onClick={() => updateStudentStatus(stu.id, 'Suspended')} className="text-xs font-bold text-red-400 hover:underline cursor-pointer">
                          Suspend Accounts
                        </button>}
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>

      </div>

      {/* Register dialog modal */}
      {formOpen && <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111625] border border-slate-800 w-full max-w-md rounded-2xl p-6 relative space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Enroll New Student Account
              </h3>
              <button onClick={() => setFormOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-850 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs font-sans text-slate-400">
              
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5 text-slate-400">
                  Legal Full Name
                </label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Jameson Doe" className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-indigo-600 text-white text-xs transition" required />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5 text-slate-400">
                  Academic Email Address
                </label>
                <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="j.doe@university.edu" className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-indigo-600 text-white text-xs transition" required />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5 text-slate-400">
                  Student Database ID
                </label>
                <input type="text" value={formStudentId} onChange={e => setFormStudentId(e.target.value)} placeholder="STU-94012" className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-indigo-600 text-white text-xs transition" required />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5 text-slate-400">
                  Specialty Department Major
                </label>
                <select value={formDept} onChange={e => setFormDept(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-indigo-650 text-white text-xs transition">
                  <option value="Computer Science">Computer Science & AI</option>
                  <option value="Literature & Arts">Literature & Arts</option>
                  <option value="Economics">Economics</option>
                  <option value="Neuroscience">Neuroscience</option>
                  <option value="General Engineering">General Engineering</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-4 justify-end">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow cursor-pointer transition">
                  Enroll Record
                </button>
              </div>

            </form>

          </div>
        </div>}

    </div>;
};