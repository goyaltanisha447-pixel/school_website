import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ClipboardList, BarChart3, Settings, ShieldCheck, 
  Search, Eye, Trash2, Calendar, FileText, CheckCircle2, AlertTriangle, Lightbulb
} from 'lucide-react';
import { featuredPackages } from '../data/packagesData';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, leads, packages
  const [searchTerm, setSearchTerm] = useState('');
  
  // Seed initial data if empty
  useEffect(() => {
    const localLeads = localStorage.getItem('srz_leads');
    const localBookings = localStorage.getItem('srz_bookings');

    const seedLeads = [
      { id: 101, type: 'General Inquiry', name: 'Alok Verma', email: 'alok@verma.com', phone: '+91 9898989898', message: 'Inquiring about 5 days Bali honeymoon trip.', status: 'Contacted', date: '15/06/2026' },
      { id: 102, type: 'Event - Wedding planning', name: 'Ritu Sen', email: 'ritu@sen.net', phone: '+91 9797979797', message: 'Guests: 250, Date: 20/12/2026, Type: Wedding', status: 'New', date: '16/06/2026' },
      { id: 103, type: 'Event - Corporate', name: 'Harish Mehta (Google Corp)', email: 'harish@google.com', phone: '+91 9696969696', message: 'Need conference AV and stage catering for 150 employees.', status: 'Won', date: '17/06/2026' }
    ];

    const seedBookings = [
      { id: 201, packageName: 'Dubai Delight', destination: 'Dubai', price: 49999, customerName: 'Sanjay Dutt', customerPhone: '+91 9999988888', travelDate: '2026-11-12', status: 'Confirmed', dateCreated: '12/06/2026' },
      { id: 202, packageName: 'Kashmir Paradise', destination: 'Kashmir', price: 24999, customerName: 'Karan Johar', customerPhone: '+91 9999977777', travelDate: '2026-12-05', status: 'Confirmed', dateCreated: '14/06/2026' }
    ];

    if (!localLeads) {
      localStorage.setItem('srz_leads', JSON.stringify(seedLeads));
      setLeads(seedLeads);
    } else {
      setLeads(JSON.parse(localLeads));
    }

    if (!localBookings) {
      localStorage.setItem('srz_bookings', JSON.stringify(seedBookings));
      setBookings(seedBookings);
    } else {
      setBookings(JSON.parse(localBookings));
    }
  }, []);

  // Update lead status
  const handleUpdateLeadStatus = (leadId, newStatus) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    setLeads(updated);
    localStorage.setItem('srz_leads', JSON.stringify(updated));
  };

  // Delete lead
  const handleDeleteLead = (leadId) => {
    const filtered = leads.filter(l => l.id !== leadId);
    setLeads(filtered);
    localStorage.setItem('srz_leads', JSON.stringify(filtered));
  };

  // Delete booking
  const handleDeleteBooking = (bookingId) => {
    const filtered = bookings.filter(b => b.id !== bookingId);
    setBookings(filtered);
    localStorage.setItem('srz_bookings', JSON.stringify(filtered));
  };

  // --- Calculations ---
  const totalTravelSales = bookings.reduce((sum, b) => sum + b.price, 0);
  // Assume a default budget setup for event leads marked as Won (e.g. 1.5 lakhs each)
  const totalEventSales = leads.filter(l => l.type.includes('Event') && l.status === 'Won').length * 150000;
  
  const totalRevenue = totalTravelSales + totalEventSales;
  const activeBookingsCount = bookings.length;
  const activeLeadsCount = leads.length;
  const conversionRate = activeLeadsCount > 0 ? ((leads.filter(l => l.status === 'Won').length + activeBookingsCount) / (activeLeadsCount + activeBookingsCount) * 100).toFixed(1) : '0';

  // Filter listings based on search
  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <span className="flex items-center space-x-1 text-brand-blue text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 mr-1 text-brand-blue" />
            <span>Secure Admin Control Desk</span>
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1 text-slate-800">
            SRZ Holidays Management
          </h1>
        </div>

        {/* Tab triggers */}
        <div className="flex space-x-1.5 bg-slate-200/60 p-1.5 rounded-xl border border-gray-150">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'leads', label: 'Leads & Inquiries', icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: OVERVIEW / KPI METRICS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow border border-gray-150 flex items-center space-x-4">
              <div className="bg-brand-blue/10 p-3.5 rounded-xl text-brand-blue">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Total Revenue</span>
                <span className="text-xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</span>
                <span className="text-[9px] text-emerald-500 block font-medium">✨ Travel + Confirmed Events</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border border-gray-150 flex items-center space-x-4">
              <div className="bg-brand-orange/10 p-3.5 rounded-xl text-brand-orange">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Active Bookings</span>
                <span className="text-xl font-bold text-slate-800">{activeBookingsCount} tours</span>
                <span className="text-[9px] text-slate-400 block font-medium">Invoices dispatched</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border border-gray-150 flex items-center space-x-4">
              <div className="bg-slate-100 p-3.5 rounded-xl text-slate-700">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Leads & Inquiries</span>
                <span className="text-xl font-bold text-slate-800">{activeLeadsCount} tickets</span>
                <span className="text-[9px] text-slate-400 block font-medium">Travel & Events desk</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border border-gray-150 flex items-center space-x-4">
              <div className="bg-emerald-50 p-3.5 rounded-xl text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Conversion Rate</span>
                <span className="text-xl font-bold text-slate-800">{conversionRate}%</span>
                <span className="text-[9px] text-emerald-500 block font-medium">Won + Booked ratio</span>
              </div>
            </div>
          </div>

          {/* Graphs / Dashboard representation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart Mock */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-150 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Monthly Revenue Inflow</h3>
                  <p className="text-[11px] text-slate-400">Mock financial tracker (Q3/Q4)</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">Tours vs Events</span>
              </div>
              
              {/* Custom Bar Graph */}
              <div className="h-48 flex items-end justify-between pt-6 border-b border-gray-200">
                {[
                  { month: 'Jul', tour: 40, event: 20 },
                  { month: 'Aug', tour: 55, event: 30 },
                  { month: 'Sep', tour: 35, event: 40 },
                  { month: 'Oct', tour: 75, event: 50 },
                  { month: 'Nov', tour: 90, event: 65 },
                  { month: 'Dec', tour: 110, event: 85 }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2 w-12">
                    <div className="flex space-x-1 items-end h-32 w-full justify-center">
                      {/* Tour sales bar */}
                      <div 
                        className="w-3 bg-brand-blue rounded-t"
                        style={{ height: `${(bar.tour / 120) * 100}%` }}
                        title={`Tours: ₹${(bar.tour * 10000).toLocaleString()}`}
                      ></div>
                      {/* Event sales bar */}
                      <div 
                        className="w-3 bg-brand-orange rounded-t"
                        style={{ height: `${(bar.event / 120) * 100}%` }}
                        title={`Events: ₹${(bar.event * 10000).toLocaleString()}`}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold">{bar.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center space-x-6 pt-2 text-[10px] text-slate-500 font-semibold">
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-brand-blue rounded-full mr-1.5"></span>Tour Packages</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-brand-orange rounded-full mr-1.5"></span>Event Planning</span>
              </div>
            </div>

            {/* AI Business Insights Panel */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-150 space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Lightbulb className="w-4 h-4 text-brand-orange mr-1.5" />
                  AI Business Insights
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Cognitive client analytics reports</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-brand-blue/5 border border-brand-blue/10 p-3 rounded-xl">
                  <span className="font-bold text-brand-blue block">🌴 Bali Package Alert</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Search metrics report 24% boost in Bali honeymoon inquiries for December. Suggest locking partner resort slots now to secure price matrices.
                  </p>
                </div>

                <div className="bg-brand-orange/5 border border-brand-orange/10 p-3 rounded-xl">
                  <span className="font-bold text-brand-orange block">📈 Event Revenue Shift</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Destination weddings represent 72% of Q4 event proposals. Consider adjusting local vendor pricing sheets to align with higher budgets.
                  </p>
                </div>

                <div className="bg-slate-50 border border-gray-200 p-3 rounded-xl flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-500 leading-normal text-[11px]">
                    2 travel inquiries remain untouched for over 24 hours. Connect with agents to maintain high conversion ratios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB B: BOOKINGS LISTING                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search bar */}
          <div className="max-w-md bg-white rounded-xl shadow border border-gray-200 px-3 py-2 flex items-center">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search bookings by name or package..."
              className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-150 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Tour Package</th>
                    <th className="p-4">Departure Date</th>
                    <th className="p-4">Billing Rate</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-slate-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        No active bookings logged in the system.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <span className="block font-bold text-slate-800">{b.customerName}</span>
                          <span className="text-[10px] text-slate-400 block">{b.customerPhone}</span>
                        </td>
                        <td className="p-4">
                          <span className="block font-semibold text-brand-blue">{b.packageName}</span>
                          <span className="text-[10px] text-slate-400 block">Dest: {b.destination}</span>
                        </td>
                        <td className="p-4 font-medium">{b.travelDate}</td>
                        <td className="p-4 font-bold text-slate-800">₹{b.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteBooking(b.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB C: LEADS & INQUIRIES DESK                                            */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search bar */}
          <div className="max-w-md bg-white rounded-xl shadow border border-gray-200 px-3 py-2 flex items-center">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search leads by name or specs..."
              className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl shadow border border-gray-150 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-4">Inquiry / Contact Info</th>
                    <th className="p-4">Sector Type</th>
                    <th className="p-4">Message Specifications</th>
                    <th className="p-4">Date Logged</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-slate-700">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        No active leads registered in the database.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <span className="block font-bold text-slate-800">{l.name}</span>
                          <span className="text-[10px] text-slate-400 block">{l.phone}</span>
                          <span className="text-[10px] text-slate-400 block">{l.email || 'No Email'}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {l.type}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate" title={l.message}>
                          {l.message}
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{l.date}</td>
                        <td className="p-4">
                          <select
                            className={`text-[10px] font-bold rounded-full border px-2 py-0.5 outline-none cursor-pointer ${
                              l.status === 'New' ? 'bg-blue-100 border-blue-200 text-blue-800' :
                              l.status === 'Contacted' ? 'bg-amber-100 border-amber-200 text-amber-800' :
                              l.status === 'Won' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' :
                              'bg-rose-100 border-rose-200 text-rose-800'
                            }`}
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Won">Won (Success)</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteLead(l.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                            title="Delete Lead ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
