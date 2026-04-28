import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { BarChart3, PieChart, TrendingUp, Users, Download, Archive } from 'lucide-react';
import { Button } from '../ui/button';
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileText, FileSpreadsheet } from 'lucide-react';

const ReportExportMenu: React.FC<{ 
  onExportPDF: () => void;
  onExportExcel: () => void;
}> = ({ onExportPDF, onExportExcel }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        title="Download Report"
      >
        <Download className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col p-1"
          >
            <button 
              onClick={() => { onExportPDF(); setIsOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </button>
            <button 
              onClick={() => { onExportExcel(); setIsOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};


export const ReportsView: React.FC = () => {
  const { orders, users, archivedOrders, kits } = useDataStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalRevenue / (orders.length || 1);

  const reports = [
    { 
      label: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: TrendingUp, 
      badge: 'FINANCIALS',
      gradient: 'from-[#6366F1] via-[#4F46E5] to-[#4338CA]',
      glow: 'shadow-indigo-500/40'
    },
    { 
      label: 'Total Sales', 
      value: orders.length, 
      icon: PieChart, 
      badge: 'VOLUME',
      gradient: 'from-[#0D9488] via-[#0891B2] to-[#0369A1]',
      glow: 'shadow-teal-500/40'
    },
    { 
      label: 'Avg Order Value', 
      value: `₹${Math.round(avgOrderValue)}`, 
      icon: BarChart3, 
      badge: 'VALUATION',
      gradient: 'from-[#F59E0B] via-[#EA580C] to-[#C2410C]',
      glow: 'shadow-orange-500/40'
    },
    { 
      label: 'Customer Base', 
      value: users.length, 
      icon: Users, 
      badge: 'COMMUNITY',
      gradient: 'from-[#E11D48] via-[#BE123C] to-[#9F1239]',
      glow: 'shadow-rose-500/40'
    },
  ];

  const exportPDF = (title: string, headers: string[], rows: any[][], filename: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text("CampusKit Stationery Hub", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(title, 14, 30);
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });
    doc.save(`${filename}.pdf`);
  };

  const exportExcel = (title: string, headers: string[], rows: any[][], filename: string) => {
    const ws = XLSX.utils.aoa_to_sheet([[title], [], headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const handleGlobalExport = (format: 'pdf' | 'excel') => {
    const headers = ['Metric', 'Value'];
    const rows = reports.map(r => [r.label, r.value]);
    const filename = `business_intelligence_summary_${Date.now()}`;
    const title = "Business Intelligence Summary";
    
    if (format === 'pdf') exportPDF(title, headers, rows, filename);
    else exportExcel(title, headers, rows, filename);
  };

  const handleRevenueExport = (format: 'pdf' | 'excel') => {
    const headers = ['Day', 'Revenue (₹)'];
    // Group orders by last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }).reverse();

    const rows = last7Days.map(day => {
      const dayRevenue = orders
        .filter(o => new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) === day)
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return [day, dayRevenue];
    });

    const filename = `revenue_distribution_${Date.now()}`;
    const title = "Weekly Revenue Distribution";

    if (format === 'pdf') exportPDF(title, headers, rows, filename);
    else exportExcel(title, headers, rows, filename);
  };

  const handleCategoryExport = (format: 'pdf' | 'excel') => {
    const headers = ['Category', 'Units Sold', 'Popularity (%)'];
    const categories = Array.from(new Set(kits.map(k => k.category)));
    const totalOrders = orders.length || 1;

    const data = categories.map(cat => {
      const unitsSold = orders.reduce((sum, o) => 
        sum + o.items.filter(i => {
          const kit = kits.find(k => k.id === i.kitId);
          return kit?.category === cat;
        }).reduce((s, it) => s + it.quantity, 0)
      , 0);
      return { 
        label: cat, 
        count: unitsSold, 
        val: Math.round((unitsSold / totalOrders) * 100) 
      };
    });

    const rows = data.map(d => [d.label, d.count, d.val]);
    const filename = `category_insights_${Date.now()}`;
    const title = "Kit Category Popularity Insights";

    if (format === 'pdf') exportPDF(title, headers, rows, filename);
    else exportExcel(title, headers, rows, filename);
  };

  const handleArchiveExport = (format: 'pdf' | 'excel') => {
    const headers = ['Order ID', 'Student', 'Department', 'Kits', 'Date'];
    const rows = archivedOrders.map(o => [
      o.id, 
      o.userName, 
      o.userDepartment || 'General', 
      o.items.map(i => i.kitName).join(', '), 
      new Date(o.createdAt).toLocaleDateString()
    ]);
    const filename = `reports_archive_${Date.now()}`;
    const title = "Archived Orders History";

    if (format === 'pdf') exportPDF(title, headers, rows, filename);
    else exportExcel(title, headers, rows, filename);
  };

  const columns = [
    { header: 'Order ID', accessor: 'id' as const },
    { header: 'Student', accessor: 'userName' as const },
    { header: 'Department', accessor: 'userDepartment' as const },
    { 
      header: 'Kits', 
      accessor: (order: any) => order.items.map((i: any) => i.kitName).join(', ') 
    },
    { 
      header: 'Status', 
      accessor: () => (
        <Badge variant="delivered" className="bg-slate-100 text-slate-600 border-slate-200">Archived</Badge>
      ) 
    },
    { header: 'Date', accessor: 'createdAt' as const },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-2 md:px-0">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[22px] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 shrink-0">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Reports & Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Export All:</span>
          <ReportExportMenu 
            onExportPDF={() => handleGlobalExport('pdf')}
            onExportExcel={() => handleGlobalExport('excel')}
          />
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative overflow-hidden rounded-[28px] bg-gradient-to-br ${report.gradient} p-5 ${report.glow} shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.01]`}
          >
            {/* Top Row: Icon and Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg group-hover:rotate-6 transition-transform duration-500">
                <report.icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.12em]">{report.badge}</span>
              </div>
            </div>

            {/* Bottom Row: Content and Trend */}
            <div className="flex items-end justify-between relative z-10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.1em] block">{report.label}</span>
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-black text-white tracking-tighter leading-none">{report.value}</p>
                  <div className="h-1 w-1 rounded-full bg-white/40 mb-1" />
                </div>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white/50 group-hover:text-white transition-colors">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            
            {/* Glossy Overlay Effects */}
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            {/* Animated Glow Border */}
            <div className="absolute inset-0 border border-white/10 rounded-[28px] pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[40px] border border-white bg-white/60 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/30">
          <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Distribution</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weekly Performance Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className={`h-1.5 w-${i===1?6:1.5} rounded-full ${i===1?'bg-indigo-600':'bg-slate-200'}`} />)}
              </div>
              <ReportExportMenu 
                onExportPDF={() => handleRevenueExport('pdf')}
                onExportExcel={() => handleRevenueExport('excel')}
              />
            </div>
          </div>
               <div className="flex items-end gap-3 h-64 px-4">
            {[...Array(7)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dayStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
              const dayRevenue = orders
                .filter(o => new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) === dayStr)
                .reduce((sum, o) => sum + o.totalAmount, 0);
              
              const maxRevenue = Math.max(...[...Array(7)].map((_, j) => {
                const dj = new Date();
                dj.setDate(dj.getDate() - j);
                const djStr = dj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                return orders
                  .filter(o => new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) === djStr)
                  .reduce((sum, o) => sum + o.totalAmount, 0);
              })) || 1;

              const height = (dayRevenue / maxRevenue) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 5)}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="w-full bg-slate-100 rounded-[12px] group-hover:bg-gradient-to-t group-hover:from-indigo-600 group-hover:to-blue-400 transition-all duration-500 relative shadow-inner overflow-hidden"
                    >
                       <div className="absolute inset-x-0 top-0 h-2 bg-white/20 opacity-0 group-hover:opacity-100" />
                    </motion.div>
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                       <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">
                         ₹{dayRevenue.toLocaleString()}
                       </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{dayStr}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[40px] border border-white bg-white/60 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/30">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Category Insights</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kit Popularity Ranking</p>
            </div>
            <ReportExportMenu 
              onExportPDF={() => handleCategoryExport('pdf')}
              onExportExcel={() => handleCategoryExport('excel')}
            />
          </div>
          
          <div className="space-y-8">
            {Array.from(new Set(kits.map(k => k.category))).map((cat: string, i: number) => {
              const unitsSold = orders.reduce((sum, o) => 
                sum + o.items.filter(i => {
                  const kit = kits.find(k => k.id === i.kitId);
                  return kit?.category === cat;
                }).reduce((s, it) => s + it.quantity, 0)
              , 0);
              
              const totalUnits = orders.reduce((sum, o) => 
                sum + o.items.reduce((s, it) => s + it.quantity, 0)
              , 0) || 1;
              
              const percentage = Math.round((unitsSold / totalUnits) * 100);
              const colors = [
                'from-indigo-500 to-blue-600',
                'from-emerald-500 to-teal-600',
                'from-amber-500 to-orange-600',
                'from-pink-500 to-rose-600'
              ];

              return (
                <div key={cat} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 tracking-tight">{cat}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unitsSold} Units Sold</span>
                    </div>
                    <span className="text-sm font-black text-indigo-600">{percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + (i * 0.2), ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]} shadow-lg shadow-indigo-500/20`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reports History Section */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/30">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Archive className="h-5 w-5" />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-wider">Order Archive</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">History of completed operations</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
              {archivedOrders.length} Records
            </Badge>
            <ReportExportMenu 
              onExportPDF={() => handleArchiveExport('pdf')}
              onExportExcel={() => handleArchiveExport('excel')}
            />
          </div>
        </div>
        
        {archivedOrders.length > 0 ? (
          <div className="p-2">
            {/* Desktop View */}
            <div className="hidden lg:block overflow-hidden rounded-[32px] border border-slate-50">
              <Table columns={columns as any} data={archivedOrders} />
            </div>

            {/* Mobile View */}
            <div className="lg:hidden p-2 space-y-4">
              {archivedOrders.map((order) => (
                <div key={order.id} className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="delivered" className="bg-white text-slate-500 border-slate-100">Archived</Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{order.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 font-black shadow-sm">
                      {order.userName.charAt(0)}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-black text-slate-900 truncate">{order.userName}</span>
                      <span className="text-[10px] font-bold text-slate-500">{order.userDepartment || 'General'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-white shadow-sm">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Kits Purchased</span>
                    <span className="text-[11px] font-bold text-slate-700 leading-tight">
                      {order.items.map(i => i.kitName).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-black text-slate-900">₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-3 bg-slate-50/50">
            <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
               <Archive className="h-5 w-5 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No archived orders available</p>
          </div>
        )}
      </div>
    </div>
  );
};

