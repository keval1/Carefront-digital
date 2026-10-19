import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  X,
  CreditCard,
  FileText,
  Printer,
  CalendarDays,
  ExternalLink,
  Video,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appointment, Service, Provider } from '../../types';

interface UntitledMonthCalendarProps {
  appointments: Appointment[];
  services?: Service[];
  providers?: Provider[];
  onSelectAppointment?: (apt: Appointment) => void;
  onAddAppointment?: (apt: Appointment) => void;
  onToast?: (msg: string) => void;
}

export const UntitledMonthCalendar: React.FC<UntitledMonthCalendarProps> = ({
  appointments: initialAppointments,
  services = [],
  providers = [],
  onSelectAppointment,
  onAddAppointment,
  onToast
}) => {
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(initialAppointments);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  // Current view reference: October 2026 (or selected month)
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDay, setSelectedDay] = useState<number>(15); // Default to 15th (Thursday)
  const todayDay = 15; // Present day marker in October 2026 (Thursday, Oct 15)

  // Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  // New Schedule Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newServiceId, setNewServiceId] = useState<string>(services[0]?.id || 'srv-1');
  const [newProviderId, setNewProviderId] = useState<string>(providers[0]?.id || 'prv-1');
  const [newDay, setNewDay] = useState<number>(selectedDay);
  const [newTime, setNewTime] = useState<string>('10:00 AM');
  const [newDeposit, setNewDeposit] = useState<number>(75);
  const [newNotes, setNewNotes] = useState('');

  // Sync prop changes
  React.useEffect(() => {
    setAppointmentsList(initialAppointments);
  }, [initialAppointments]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const handleTodayClick = () => {
    setYear(2026);
    setMonth(9);
    setSelectedDay(todayDay);
  };

  // Filter appointments
  const filteredAppointments = appointmentsList.filter(apt => {
    if (filterProvider !== 'all' && apt.providerId !== filterProvider) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    return true;
  });

  // Helper to extract day of month from startTime
  const getAppointmentDay = (startTime: string): number => {
    try {
      const d = new Date(startTime);
      return d.getUTCDate();
    } catch {
      return 15;
    }
  };

  // Helper to extract time formatted string e.g. "09:30am"
  const getAppointmentTimeStr = (startTime: string): string => {
    try {
      const d = new Date(startTime);
      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      const h12 = hours % 12 || 12;
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${h12}:${mStr}${ampm}`;
    } catch {
      return '10:00am';
    }
  };

  // Map services to stylish left border strip colors and emojis
  const getEventStyling = (serviceName: string, index: number) => {
    const s = serviceName.toLowerCase();
    if (s.includes('morpheus') || s.includes('rf')) {
      return { border: 'border-l-blue-600', text: 'text-blue-900', bg: 'bg-blue-50/70', badge: 'bg-blue-600', icon: '✨' };
    }
    if (s.includes('botox') || s.includes('tox')) {
      return { border: 'border-l-amber-500', text: 'text-amber-900', bg: 'bg-amber-50/70', badge: 'bg-amber-500', icon: '💉' };
    }
    if (s.includes('laser') || s.includes('clear')) {
      return { border: 'border-l-rose-500', text: 'text-rose-900', bg: 'bg-rose-50/70', badge: 'bg-rose-500', icon: '⚡' };
    }
    if (s.includes('hydra') || s.includes('facial')) {
      return { border: 'border-l-emerald-600', text: 'text-emerald-900', bg: 'bg-emerald-50/70', badge: 'bg-emerald-600', icon: '💧' };
    }
    if (s.includes('sculptra')) {
      return { border: 'border-l-purple-600', text: 'text-purple-900', bg: 'bg-purple-50/70', badge: 'bg-purple-600', icon: '💎' };
    }
    const colors = [
      { border: 'border-l-blue-600', text: 'text-blue-900', bg: 'bg-blue-50/70', badge: 'bg-blue-600', icon: '🩺' },
      { border: 'border-l-emerald-600', text: 'text-emerald-900', bg: 'bg-emerald-50/70', badge: 'bg-emerald-600', icon: '🌿' },
      { border: 'border-l-amber-500', text: 'text-amber-900', bg: 'bg-amber-50/70', badge: 'bg-amber-500', icon: '✨' }
    ];
    return colors[index % colors.length];
  };

  // Build calendar matrix (for October 2026: Oct 1 is Thursday -> 4 leading blanks from Sun-Wed: Sep 27, 28, 29, 30)
  // Total 35 cells (5 rows x 7 cols)
  const generateMonthCells = () => {
    const firstDayOfWeek = 4; // Oct 1, 2026 is Thursday (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
    const daysInMonth = 31;
    const prevMonthDays = 30; // Sep has 30 days
    const cells = [];

    // Leading days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        appointments: []
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayApts = filteredAppointments.filter(apt => getAppointmentDay(apt.startTime) === d);
      cells.push({
        day: d,
        isCurrentMonth: true,
        isToday: d === todayDay && month === 9 && year === 2026,
        appointments: dayApts
      });
    }

    // Trailing days for next month to complete 35 cells
    let nextDay = 1;
    while (cells.length < 35) {
      cells.push({
        day: nextDay++,
        isCurrentMonth: false,
        isToday: false,
        appointments: []
      });
    }

    return cells;
  };

  const monthCells = generateMonthCells();

  // Create new appointment handler
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) {
      onToast?.('Please enter patient name.');
      return;
    }

    const selectedSrv = services.find(s => s.id === newServiceId) || services[0];
    const selectedPrv = providers.find(p => p.id === newProviderId) || providers[0];

    // Format ISO startTime
    const dayStr = newDay < 10 ? `0${newDay}` : `${newDay}`;
    const isoString = `2026-10-${dayStr}T10:00:00Z`;

    const newApt: Appointment = {
      id: `apt-manual-${Date.now()}`,
      tenantId: 'tenant-aura-1',
      patientId: `pat-${Date.now()}`,
      patientName: newPatientName.trim(),
      patientPhone: newPatientPhone.trim() || '(310) 555-0199',
      providerId: selectedPrv.id,
      providerName: selectedPrv.name,
      serviceId: selectedSrv.id,
      serviceName: selectedSrv.name,
      startTime: isoString,
      endTime: `2026-10-${dayStr}T11:00:00Z`,
      status: 'confirmed',
      depositAmountCents: newDeposit * 100,
      depositStripeId: `pi_manual_${Date.now()}`,
      emrSyncStatus: 'synced',
      emrAppointmentId: `AR-${Math.floor(1000 + Math.random() * 9000)}`,
      isMissedCallRecovered: false
    };

    setAppointmentsList(prev => [newApt, ...prev]);
    onAddAppointment?.(newApt);
    setIsAddScheduleOpen(false);
    onToast?.(`✅ Scheduled appointment for ${newApt.patientName} on Oct ${newDay}!`);

    // Reset fields
    setNewPatientName('');
    setNewPatientPhone('');
    setNewPatientEmail('');
    setNewNotes('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col font-manrope">
      
      {/* ======================================================== */}
      {/* TOP HEADER BAR (Clean style matching Images 7 & 8)       */}
      {/* ======================================================== */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Selected Month & Navigation Arrows */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Action Controls: Today, Filter, View Mode (Month/Week/Day), + Add Schedule */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Today Button */}
          <button
            onClick={handleTodayClick}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            Today
          </button>

          {/* Filter Popover Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                filterProvider !== 'all' || filterStatus !== 'all'
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
              }`}
              title="Filter Appointments"
            >
              <Filter className="w-4 h-4" />
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 text-xs space-y-3">
                  <div className="font-bold text-slate-800 pb-1 border-b border-slate-100 flex items-center justify-between">
                    <span>Filter Timetable</span>
                    {(filterProvider !== 'all' || filterStatus !== 'all') && (
                      <button
                        onClick={() => {
                          setFilterProvider('all');
                          setFilterStatus('all');
                        }}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Provider</label>
                    <select
                      value={filterProvider}
                      onChange={(e) => setFilterProvider(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                    >
                      <option value="all">All Clinicians</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* View Mode Switcher: Month, Week, Day */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Day
            </button>
          </div>

          {/* + Add Event Button (Primary Blue) */}
          <button
            onClick={() => {
              setNewDay(selectedDay);
              setIsAddScheduleOpen(true);
            }}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 1. MONTH VIEW (Matches Image 7)                          */}
      {/* ======================================================== */}
      {viewMode === 'month' && (
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[880px]">
            {/* Weekday Header: SUN to SAT */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-white text-slate-600 text-xs font-bold py-3 text-center">
              {weekDays.map((d) => (
                <div key={d} className="tracking-wider text-[11px] font-semibold text-slate-500">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid: 35 cells */}
            <div className="grid grid-cols-7 border-b border-slate-100 divide-x divide-y divide-slate-100 bg-white">
              {monthCells.map((cell, idx) => {
                const isSelected = cell.day === selectedDay && cell.isCurrentMonth;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (cell.isCurrentMonth) setSelectedDay(cell.day);
                    }}
                    className={`min-h-[120px] p-2 flex flex-col justify-between transition-colors ${
                      !cell.isCurrentMonth
                        ? 'bg-slate-50/40 text-slate-300 pointer-events-none'
                        : isSelected
                        ? 'bg-blue-50/20'
                        : 'bg-white hover:bg-slate-50/60 cursor-pointer'
                    }`}
                  >
                    {/* Date Number */}
                    <div className="flex justify-between items-center mb-1">
                      {cell.isToday ? (
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {cell.day}
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-semibold ${
                            cell.isCurrentMonth
                              ? isSelected
                                ? 'text-blue-700 font-bold'
                                : 'text-slate-700'
                              : 'text-slate-300'
                          }`}
                        >
                          {cell.day}
                        </span>
                      )}

                      {/* Present day indicator badge */}
                      {cell.isToday && (
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Appointment Chips with Color Accent Strip */}
                    <div className="space-y-1.5 flex-1 pt-1">
                      {cell.appointments.map((apt, aIdx) => {
                        const style = getEventStyling(apt.serviceName, aIdx);
                        const isPresentDayApt = cell.isToday;
                        return (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(apt);
                              onSelectAppointment?.(apt);
                            }}
                            className={`text-[10px] pl-2 pr-1.5 py-1 rounded-md border-l-2 ${style.border} ${
                              isPresentDayApt
                                ? 'bg-blue-50/90 text-blue-950 font-bold ring-1 ring-blue-300 shadow-2xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            } flex items-center gap-1.5 truncate cursor-pointer transition-all hover:scale-[1.02] shadow-2xs`}
                            title={`${apt.patientName} - ${apt.serviceName} (${getAppointmentTimeStr(apt.startTime)})`}
                          >
                            <span className="text-slate-400 font-mono text-[9px] shrink-0">
                              {getAppointmentTimeStr(apt.startTime)}
                            </span>
                            <span className="truncate">
                              {style.icon} {apt.serviceName.split(' ')[0]} {apt.serviceName.split(' ')[1] || ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DYNAMIC WEEK VIEW                                     */}
      {/* ======================================================== */}
      {viewMode === 'week' && (() => {
        // Oct 1, 2026 is Thursday (day 4). For date d, dayOfWeek = (d - 1 + 4) % 7
        const getDayOfWeek = (d: number) => ((d - 1 + 4) % 7);
        const dayOfWeek = getDayOfWeek(selectedDay);
        const weekStartDay = selectedDay - dayOfWeek;
        const currentWeekDays = Array.from({ length: 7 }, (_, i) => weekStartDay + i);

        return (
          <div className="flex-1 overflow-x-auto p-4">
            <div className="min-w-[850px]">
              {/* Week Navigation Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  Week of Oct {Math.max(1, currentWeekDays[0])} – Oct {Math.min(31, currentWeekDays[6])}, {year}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDay(Math.max(1, selectedDay - 7))}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Week</span>
                  </button>
                  <button
                    onClick={() => setSelectedDay(Math.min(31, selectedDay + 7))}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Week</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Week Column Headers */}
              <div className="grid grid-cols-8 border-b border-slate-200 pb-3 text-center text-xs font-bold text-slate-700">
                <div className="text-slate-400 text-[10px] pt-1">TIME</div>
                {weekDays.map((d, dIdx) => {
                  const dayNum = currentWeekDays[dIdx];
                  const isValidDay = dayNum >= 1 && dayNum <= 31;
                  const isToday = isValidDay && dayNum === todayDay;
                  const isSelected = isValidDay && dayNum === selectedDay;

                  return (
                    <div
                      key={d}
                      onClick={() => {
                        if (isValidDay) setSelectedDay(dayNum);
                      }}
                      className={`space-y-1 cursor-pointer p-1 rounded-xl transition-colors ${
                        isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{d}</span>
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                        isToday
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : isSelected
                          ? 'bg-slate-900 text-white font-semibold'
                          : isValidDay
                          ? 'text-slate-800'
                          : 'text-slate-300'
                      }`}>
                        {isValidDay ? dayNum : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Time Grid Rows */}
              <div className="divide-y divide-slate-100">
                {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'].map((hourTime) => (
                  <div key={hourTime} className="grid grid-cols-8 py-3 items-start min-h-[75px]">
                    <div className="text-[10px] font-mono text-slate-400 pt-1">
                      {hourTime}
                    </div>
                    {weekDays.map((_, colIdx) => {
                      const colDay = currentWeekDays[colIdx];
                      const isValidDay = colDay >= 1 && colDay <= 31;
                      const aptsInSlot = isValidDay
                        ? filteredAppointments.filter(a => getAppointmentDay(a.startTime) === colDay)
                        : [];

                      return (
                        <div key={colIdx} className="px-1 space-y-1">
                          {aptsInSlot.map((apt, aptIdx) => {
                            const style = getEventStyling(apt.serviceName, aptIdx);
                            const isTodayApt = colDay === todayDay;
                            return (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt)}
                                className={`p-2 rounded-xl border-l-4 ${style.border} ${
                                  isTodayApt ? 'bg-blue-50/90 text-blue-950 font-semibold ring-1 ring-blue-200' : 'bg-white'
                                } border border-slate-200/80 shadow-2xs text-[11px] space-y-1 cursor-pointer hover:shadow-md transition-all`}
                              >
                                <div className="font-bold text-slate-900 truncate">
                                  {style.icon} {apt.patientName}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {apt.serviceName}
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                                  <span>{getAppointmentTimeStr(apt.startTime)}</span>
                                  <span className="text-emerald-700 font-bold">${apt.depositAmountCents / 100}</span>
                                </div>
                              </div>
                            );
                          })}
                          {aptsInSlot.length === 0 && isValidDay && (
                            <div
                              onClick={() => {
                                setNewDay(colDay);
                                setIsAddScheduleOpen(true);
                              }}
                              className="h-12 border border-dashed border-slate-100 rounded-lg hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-colors flex items-center justify-center text-slate-300 hover:text-slate-500 text-[10px]"
                              title={`Schedule on Oct ${colDay}`}
                            >
                              <Plus className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. DYNAMIC DAY VIEW                                      */}
      {/* ======================================================== */}
      {viewMode === 'day' && (() => {
        const dayApts = filteredAppointments.filter(
          a => getAppointmentDay(a.startTime) === selectedDay
        );
        const dayDate = new Date(2026, 9, selectedDay);
        const dayName = weekDays[dayDate.getDay()];
        const isToday = selectedDay === todayDay;

        return (
          <div className="flex-1 flex flex-col p-6 space-y-4">
            {/* Day Header with Previous/Next Day Navigation */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                  <button
                    onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedDay(Math.min(31, selectedDay + 1))}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Next Day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm tracking-wide uppercase">
                    {dayName}, {selectedDay < 10 ? `0${selectedDay}` : selectedDay} October {year}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Today
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {dayApts.length} {dayApts.length === 1 ? 'Appointment' : 'Appointments'} Scheduled
                </span>
                <button
                  onClick={() => {
                    setNewDay(selectedDay);
                    setIsAddScheduleOpen(true);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book for this Day</span>
                </button>
              </div>
            </div>

            {/* Timeline View (Hours 08 AM to 05 PM) */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {[
                { hour: '08 AM', timeRange: '08:00 AM - 09:00 AM' },
                { hour: '09 AM', timeRange: '09:00 AM - 10:30 AM' },
                { hour: '11 AM', timeRange: '11:00 AM - 12:30 PM' },
                { hour: '01 PM', timeRange: '01:00 PM - 02:30 PM' },
                { hour: '03 PM', timeRange: '03:00 PM - 04:30 PM' },
                { hour: '05 PM', timeRange: '05:00 PM - 06:00 PM' }
              ].map((slot, sIdx) => {
                // Find appointments for current selected day for this index or hour
                const matchedApt = dayApts[sIdx] || null;
                const style = matchedApt ? getEventStyling(matchedApt.serviceName, sIdx) : null;

                return (
                  <div key={slot.hour} className="flex items-start gap-4 py-2 border-b border-slate-100">
                    <div className="w-16 text-right text-xs font-mono font-semibold text-slate-400 shrink-0 pt-2">
                      {slot.hour}
                    </div>

                    <div className="flex-1">
                      {matchedApt && style ? (
                        <div
                          onClick={() => setSelectedAppointment(matchedApt)}
                          className={`p-4 rounded-2xl bg-white border border-slate-200 border-l-4 ${style.border} ${
                            isToday ? 'ring-1 ring-blue-200 bg-blue-50/20' : ''
                          } shadow-2xs space-y-2 cursor-pointer hover:shadow-md transition-all`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{style.icon}</span>
                              <span className="font-bold text-slate-900 text-sm">
                                {matchedApt.serviceName}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-slate-500 font-medium">
                              {getAppointmentTimeStr(matchedApt.startTime)}
                            </span>
                          </div>

                          {/* Room & Meeting Link */}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5 text-blue-600 hover:underline">
                              <Video className="w-3.5 h-3.5" />
                              <span>https://meet.google.com/jeq-wunj-kmn</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>Suite 3B • Wilshire MedSpa</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">
                            Patient {matchedApt.patientName} scheduled with {matchedApt.providerName}. Pre-procedure medical consent and numbing cream protocol active.
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                                {matchedApt.patientName[0]}
                              </div>
                              <span className="font-semibold text-slate-700">{matchedApt.patientName}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                              Deposit Paid: ${(matchedApt.depositAmountCents / 100).toLocaleString()}.00
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="h-10 border border-dashed border-slate-200/80 rounded-xl flex items-center px-4 text-xs text-slate-400 hover:bg-slate-50/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setNewDay(selectedDay);
                            setNewTime(slot.timeRange.split(' - ')[0]);
                            setIsAddScheduleOpen(true);
                          }}
                        >
                          <Plus className="w-3.5 h-3.5 mr-2" />
                          <span>Available Slot ({slot.hour}) — Click to schedule appointment</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* APPOINTMENT DETAILS MODAL POPUP (With motion animations) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedAppointment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-xs text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                      Appointment Details
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      {selectedAppointment.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedAppointment.patientName}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Chart ID: {selectedAppointment.emrAppointmentId || 'AR-9941'} • {selectedAppointment.patientPhone}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 rounded-full bg-white text-slate-400 hover:text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">PROCEDURE</span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedAppointment.serviceName}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">CLINICIAN</span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {selectedAppointment.providerName}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-bold text-blue-950 text-xs">
                        Oct {getAppointmentDay(selectedAppointment.startTime)}, 2026 at {getAppointmentTimeStr(selectedAppointment.startTime)}
                      </div>
                      <div className="text-[10px] text-blue-700">Wilshire Executive Suite 3B</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    45 Min Session
                  </span>
                </div>

                {/* Financial Breakdown */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Financial Ledger (Stripe + EMR)
                  </span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Stripe Deposit Authorized:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ${(selectedAppointment.depositAmountCents / 100).toLocaleString()}.00 (Settled)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Remaining Balance at Clinic:</span>
                    <span className="font-mono font-bold text-slate-800">
                      $550.00 (Eligible for Cherry 0% APR)
                    </span>
                  </div>
                </div>

                {/* Patient Notes */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Intake & Chart Notes</span>
                  <p className="text-[11px] leading-relaxed">
                    Patient requested topical compounded numbing 20 min prior. No contraindications flagged on intake questionnaire.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    onToast?.(`Printed clinical route slip for ${selectedAppointment.patientName}.`);
                    setSelectedAppointment(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => {
                    onToast?.(`Checked in ${selectedAppointment.patientName} into Aesthetic Record!`);
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Check In Patient</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* + ADD SCHEDULE MANUAL APPOINTMENT MODAL POPUP            */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAddScheduleOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            onClick={() => setIsAddScheduleOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-xs text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Add New Appointment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manually book a patient consultation or clinical treatment session.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="p-1.5 rounded-full bg-white text-slate-400 hover:text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Arabella Vance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Phone Number</label>
                    <input
                      type="text"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      placeholder="(310) 555-0199"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Email</label>
                    <input
                      type="email"
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      placeholder="patient@beverlyhills.io"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Procedure</label>
                    <select
                      value={newServiceId}
                      onChange={(e) => setNewServiceId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${s.retailPriceCents / 100})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Clinician</label>
                    <select
                      value={newProviderId}
                      onChange={(e) => setNewProviderId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Date (Oct 2026)</label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      {Array.from({ length: 31 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>Oct {i + 1}, 2026</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Time Slot</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Deposit ($)</label>
                    <input
                      type="number"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Clinical Intake Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Specific requests, target treatment areas, or VIP preferences..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddScheduleOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                  >
                    Confirm & Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
