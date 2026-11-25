import { useState } from 'react';
import app4appLogo from '../assets/app4app-logo.png';
import { BUSINESS_MENU } from '../data/initialData';
import {
  Booking,
  BookingStatus,
  BusinessPage,
  DepartmentItem,
  ServiceItem,
  StaffItem,
} from '../types';
import { CategoryIcon } from './CategoryIcon';
import { MonitorFrame } from './MonitorFrame';

interface BusinessAdminViewProps {
  bookings: Booking[];
  services: ServiceItem[];
  departments: DepartmentItem[];
  staffList: StaffItem[];
  onUpdateBooking: (id: string, status: BookingStatus) => void;
  onApproveReschedule: (id: string) => void;
  onViewBookingDetails: (booking: Booking) => void;
  onOpenAddService: () => void;
  onOpenAddDepartment: () => void;
  onOpenAddStaff: () => void;
  onExitPreview: () => void;
  onNotify: (msg: string) => void;
}

export function BusinessAdminView({
  bookings,
  services,
  departments,
  staffList,
  onUpdateBooking,
  onApproveReschedule,
  onViewBookingDetails,
  onOpenAddService,
  onOpenAddDepartment,
  onOpenAddStaff,
  onExitPreview,
  onNotify,
}: BusinessAdminViewProps) {
  const [activePage, setActivePage] = useState<BusinessPage>('Overview');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('18:00');
  const [slotDuration, setSlotDuration] = useState('30 minutes');
  const [breakTime, setBreakTime] = useState('13:00 – 14:00');
  const [maxPerSlot, setMaxPerSlot] = useState('1');
  const [weeklySchedule, setWeeklySchedule] = useState('Monday – Saturday');

  const [bizName, setBizName] = useState('City Care Hospital');
  const [bizCategory, setBizCategory] = useState('Hospital');
  const [bizCity, setBizCity] = useState('Chennai');
  const [bizPhone, setBizPhone] = useState('044 4000 5000');
  const [bizEmail, setBizEmail] = useState('care@example.com');
  const [bizAddress, setBizAddress] = useState('Anna Nagar, Chennai');

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'Approved').length;
  const uniquePhones = Array.from(new Set(bookings.map((b) => b.phone)));

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q || `${b.id} ${b.customer} ${b.business} ${b.service}`.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const renderBookingsTable = (list: Booking[]) => {
    if (list.length === 0) {
      return (
        <div className="py-8 text-center text-[12px] text-[#71819b]">
          No appointments yet. Create one from the Customer App preview.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#e5ebf4] text-[10px] tracking-wider text-[#8492a7] uppercase">
              <th className="px-2 py-2.5 font-semibold">Booking</th>
              <th className="px-2 py-2.5 font-semibold">Customer</th>
              <th className="px-2 py-2.5 font-semibold">Service / Business</th>
              <th className="px-2 py-2.5 font-semibold">Date & time</th>
              <th className="px-2 py-2.5 font-semibold">Status</th>
              <th className="px-2 py-2.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef2f7]">
            {list.map((b) => (
              <tr key={b.id} className="text-[#52647e]">
                <td className="px-2 py-2.5 font-bold text-[#263c5c] tabular-nums">{b.id}</td>
                <td className="px-2 py-2.5">
                  <div>{b.customer}</div>
                  <small className="text-[10px] text-[#71819b] tabular-nums">{b.phone}</small>
                </td>
                <td className="px-2 py-2.5">
                  <div>{b.service}</div>
                  <small className="text-[10px] text-[#71819b]">{b.business}</small>
                </td>
                <td className="px-2 py-2.5 tabular-nums">
                  <div>{b.date}</div>
                  <div>{b.time}</div>
                </td>
                <td className="px-2 py-2.5">
                  <span
                    className={`text-[10px] font-bold ${
                      b.status === 'Approved' || b.status === 'Rescheduled'
                        ? 'text-[#16805b]'
                        : b.status === 'Rejected' || b.status === 'Cancelled'
                          ? 'text-[#bd4250]'
                          : 'text-[#a36c14]'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {b.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateBooking(b.id, 'Approved')}
                          className="rounded-[7px] bg-[#e6f6ef] px-2 py-1 text-[10px] font-bold text-[#16805b]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateBooking(b.id, 'Rejected')}
                          className="rounded-[7px] bg-[#fff0f1] px-2 py-1 text-[10px] font-bold text-[#b83f50]"
                        >
                          Reject
                        </button>
                      </>
                    ) : b.status === 'Reschedule Requested' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onApproveReschedule(b.id)}
                          className="rounded-[7px] bg-[#e6f6ef] px-2 py-1 text-[10px] font-bold text-[#16805b]"
                        >
                          Accept new time
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateBooking(b.id, 'Approved')}
                          className="rounded-[7px] bg-[#edf4ff] px-2 py-1 text-[10px] font-bold text-[#185bbd]"
                        >
                          Keep current
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onViewBookingDetails(b)}
                        className="rounded-[7px] bg-[#edf4ff] px-2 py-1 text-[10px] font-bold text-[#185bbd]"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Overview':
        return (
          <>
            <div className="mb-5 grid grid-cols-4 gap-4">
              {[
                { label: 'Total appointments', value: bookings.length, sub: 'All time', icon: 'calendar' as const },
                { label: 'Pending requests', value: pendingCount, sub: 'Needs review', icon: 'clock' as const },
                { label: 'Approved', value: approvedCount, sub: 'Confirmed bookings', icon: 'check' as const },
                { label: 'Customers', value: uniquePhones.length, sub: 'Unique customers', icon: 'users' as const },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-[15px] border border-[#e5ebf4] bg-white p-4 shadow-[0_3px_12px_rgba(20,47,83,0.03)]"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#71819b]">
                    <span>{m.label}</span>
                    <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#edf4ff] text-[#1763d5]">
                      <CategoryIcon name={m.icon} size={16} />
                    </span>
                  </div>
                  <strong className="mt-2.5 mb-1 block text-[26px] font-extrabold text-[#172b4d] tabular-nums">
                    {m.value}
                  </strong>
                  <small className="text-[10px] text-[#8b98ab]">{m.sub}</small>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[1.25fr_1fr] gap-4">
              <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <strong className="text-[13px] font-bold text-[#172b4d]">Recent appointments</strong>
                  <button
                    type="button"
                    onClick={() => setActivePage('Appointments')}
                    className="rounded-[7px] bg-[#edf4ff] px-2.5 py-1 text-[10px] font-bold text-[#185bbd]"
                  >
                    View all
                  </button>
                </div>
                {renderBookingsTable(bookings.slice(0, 4))}
              </div>

              <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <strong className="text-[13px] font-bold text-[#172b4d]">Appointment activity</strong>
                  <span className="text-[11px] font-semibold text-[#1763d5]">Weekly view</span>
                </div>
                <div className="flex h-[180px] items-end gap-3 border-b border-[#e5ebf4] px-2 pt-2">
                  {[35, 55, 42, 72, 60, 88, 66].map((val, idx) => (
                    <div key={idx} className="grid flex-1 content-end justify-items-center gap-1.5 h-full">
                      <div
                        className="w-[70%] max-w-[40px] rounded-t-[6px] bg-gradient-to-b from-[#6ca7f8] to-[#1763d5]"
                        style={{ height: `${val}%` }}
                      />
                      <small className="text-[10px] text-[#8997aa]">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                      </small>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 text-[11px] text-[#71819b]">Illustrative weekly activity</p>
              </div>
            </div>
          </>
        );

      case 'Appointments':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Appointment management</strong>
              <span className="text-[11px] font-bold text-[#1763d5] tabular-nums">
                {pendingCount} pending review
              </span>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search booking or customer"
                className="rounded-[9px] border border-[#e5ebf4] bg-white px-3 py-2 text-[11px] text-[#52647e] outline-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-[9px] border border-[#e5ebf4] bg-white px-3 py-2 text-[11px] text-[#52647e] outline-none"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reschedule Requested">Reschedule Requested</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            {renderBookingsTable(filteredBookings)}
          </div>
        );

      case 'Services':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Service catalogue</strong>
              <button
                type="button"
                onClick={onOpenAddService}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                + Add service
              </button>
            </div>
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
                  <th className="px-2 py-2.5">Service</th>
                  <th className="px-2 py-2.5">Category</th>
                  <th className="px-2 py-2.5">Duration</th>
                  <th className="px-2 py-2.5">Price</th>
                  <th className="px-2 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7]">
                {services.map((s) => (
                  <tr key={s.service} className="text-[#52647e]">
                    <td className="px-2 py-2.5 font-semibold text-[#172b4d]">{s.service}</td>
                    <td className="px-2 py-2.5">{s.category}</td>
                    <td className="px-2 py-2.5 tabular-nums">{s.duration}</td>
                    <td className="px-2 py-2.5 tabular-nums">{s.price}</td>
                    <td className="px-2 py-2.5 text-[#16805b] font-semibold">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Departments':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Hospital departments</strong>
              <button
                type="button"
                onClick={onOpenAddDepartment}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                + Add department
              </button>
            </div>
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
                  <th className="px-2 py-2.5">Department</th>
                  <th className="px-2 py-2.5">Doctors</th>
                  <th className="px-2 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7]">
                {departments.map((d) => (
                  <tr key={d.department} className="text-[#52647e]">
                    <td className="px-2 py-2.5 font-semibold text-[#172b4d]">{d.department}</td>
                    <td className="px-2 py-2.5">{d.doctors}</td>
                    <td className="px-2 py-2.5 text-[#16805b] font-semibold">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-3 text-[11px] text-[#245a9f]">
              Department management is relevant to hospital businesses. Other categories use service and professional management.
            </div>
          </div>
        );

      case 'Staff & Professionals':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Staff & professionals</strong>
              <button
                type="button"
                onClick={onOpenAddStaff}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                + Add professional
              </button>
            </div>
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
                  <th className="px-2 py-2.5">Name</th>
                  <th className="px-2 py-2.5">Role</th>
                  <th className="px-2 py-2.5">Assigned service</th>
                  <th className="px-2 py-2.5">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7]">
                {staffList.map((st) => (
                  <tr key={st.name} className="text-[#52647e]">
                    <td className="px-2 py-2.5 font-semibold text-[#172b4d]">{st.name}</td>
                    <td className="px-2 py-2.5">{st.role}</td>
                    <td className="px-2 py-2.5">{st.assignedService}</td>
                    <td className="px-2 py-2.5">{st.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Availability':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">
                Working hours & slot rules
              </strong>
              <button
                type="button"
                onClick={() => onNotify('Availability settings saved')}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                Save changes
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Opening time</label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Closing time</label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">
                    Appointment duration
                  </label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                  >
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Break time</label>
                  <input
                    type="text"
                    value={breakTime}
                    onChange={(e) => setBreakTime(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">
                    Maximum bookings per slot
                  </label>
                  <input
                    type="number"
                    value={maxPerSlot}
                    onChange={(e) => setMaxPerSlot(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Weekly schedule</label>
                  <input
                    type="text"
                    value={weeklySchedule}
                    onChange={(e) => setWeeklySchedule(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-3 text-[11px] text-[#245a9f]">
              Configure staff-specific schedules, holidays and break times. Slot conflicts must be checked before confirming bookings.
            </div>
          </div>
        );

      case 'Customers':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3">
              <strong className="text-[13px] font-bold text-[#172b4d]">Customer directory</strong>
            </div>
            {uniquePhones.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-[#71819b]">
                No customer bookings yet.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
                    <th className="px-2 py-2.5">Customer</th>
                    <th className="px-2 py-2.5">Mobile</th>
                    <th className="px-2 py-2.5">Appointments</th>
                    <th className="px-2 py-2.5">Last booking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef2f7]">
                  {uniquePhones.map((ph) => {
                    const custBookings = bookings.filter((b) => b.phone === ph);
                    const latest = custBookings[0];
                    return (
                      <tr key={ph} className="text-[#52647e]">
                        <td className="px-2 py-2.5 font-semibold text-[#172b4d]">
                          {latest.customer}
                        </td>
                        <td className="px-2 py-2.5 tabular-nums">{ph}</td>
                        <td className="px-2 py-2.5 tabular-nums">{custBookings.length}</td>
                        <td className="px-2 py-2.5 tabular-nums">{latest.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );

      case 'Reports':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[15px] border border-[#e5ebf4] bg-white p-4">
                <div className="text-[11px] font-bold text-[#71819b]">Bookings</div>
                <strong className="mt-2 block text-[26px] font-extrabold text-[#172b4d] tabular-nums">
                  {bookings.length}
                </strong>
                <small className="text-[10px] text-[#8b98ab]">Selected business</small>
              </div>
              <div className="rounded-[15px] border border-[#e5ebf4] bg-white p-4">
                <div className="text-[11px] font-bold text-[#71819b]">Approval rate</div>
                <strong className="mt-2 block text-[26px] font-extrabold text-[#172b4d] tabular-nums">
                  {bookings.length ? Math.round((approvedCount / bookings.length) * 100) : 0}%
                </strong>
                <small className="text-[10px] text-[#8b98ab]">Approved bookings</small>
              </div>
            </div>
            <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
              <strong className="mb-3 block text-[13px] font-bold text-[#172b4d]">
                Booking status summary
              </strong>
              <div className="divide-y divide-[#eef2f7]">
                {['Pending', 'Approved', 'Rejected', 'Rescheduled', 'Cancelled', 'Completed'].map(
                  (st) => (
                    <div
                      key={st}
                      className="flex items-center justify-between py-2 text-[11px] text-[#52647e]"
                    >
                      <span>{st}</span>
                      <b className="text-[#172b4d] tabular-nums">
                        {bookings.filter((b) => b.status === st).length}
                      </b>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case 'Business Profile':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Business profile</strong>
              <button
                type="button"
                onClick={() => onNotify('Business profile saved')}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                Save profile
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Business name</label>
                <input
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Category</label>
                <select
                  value={bizCategory}
                  onChange={(e) => setBizCategory(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                >
                  <option>Hospital</option>
                  <option>Gym</option>
                  <option>Car Service</option>
                  <option>Salon</option>
                  <option>Beauty Parlour</option>
                  <option>VIPs</option>
                  <option>Celebrities</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">City</label>
                <input
                  value={bizCity}
                  onChange={(e) => setBizCity(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Contact number</label>
                <input
                  value={bizPhone}
                  onChange={(e) => setBizPhone(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Email</label>
                <input
                  value={bizEmail}
                  onChange={(e) => setBizEmail(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Address</label>
                <input
                  value={bizAddress}
                  onChange={(e) => setBizAddress(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                />
              </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <strong className="mb-2 block text-[13px] font-bold text-[#172b4d]">Notifications</strong>
            <div className="mb-3 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-3 text-[11px] text-[#245a9f]">
              New booking requests and status changes appear here during the demo.
            </div>
            {bookings.length === 0 ? (
              <p className="text-[12px] text-[#71819b]">No booking notifications yet.</p>
            ) : (
              <div className="divide-y divide-[#e5ebf4]">
                {bookings.map((b) => (
                  <p key={b.id} className="py-2.5 text-[11px] text-[#52647e] tabular-nums">
                    {b.id} · {b.customer} · {b.service} · <b>{b.status}</b>
                  </p>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <MonitorFrame>
      <div className="flex h-[58px] items-center justify-between border-b border-[#e5ebf4] px-5">
        <div>
          <strong className="block text-[14px] font-bold text-[#172b4d]">Business Admin Portal</strong>
          <small className="text-[11px] text-[#71819b]">
            {bizName} · {bizCity}
          </small>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActivePage('Notifications')}
            aria-label="Business notifications"
            className="relative grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-[#f0f5fd] text-[#185bc1]"
          >
            <CategoryIcon name="bell" size={18} />
            {bookings.length > 0 && (
              <span className="absolute top-1 right-1 text-[9px] font-bold text-[#bd4250]">
                {bookings.length}
              </span>
            )}
          </button>
          <span className="text-[12px] font-bold text-[#52647f]">Business Admin</span>
        </div>
      </div>

      <div className="flex min-h-[780px]">
        <aside className="w-[232px] shrink-0 bg-[#10284f] px-3 py-4 text-[#d9e5f8]">
          <div className="mb-3 flex items-center gap-2.5 border-b border-white/15 px-2 pb-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-white p-0.5">
              <img src={app4appLogo} alt="App4App logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <strong className="block truncate text-[13px] font-bold text-white">App4App</strong>
              <small className="block text-[9px] tracking-wide text-[#a9bddc]">BUSINESS PORTAL</small>
            </div>
          </div>

          <div className="px-2.5 pt-2 pb-1.5 text-[9px] font-extrabold tracking-widest text-[#8fa7ca]">
            WORKSPACE
          </div>
          {BUSINESS_MENU.map((item) => {
            const active = activePage === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActivePage(item.label)}
                className={`my-0.5 flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left text-[11px] font-bold transition ${
                  active
                    ? 'bg-white/10 text-white shadow-[inset_3px_0_#6ea8ff]'
                    : 'text-[#c6d5eb] hover:bg-white/10 hover:text-white'
                }`}
              >
                <CategoryIcon name={item.icon} size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="px-2.5 pt-4 pb-1.5 text-[9px] font-extrabold tracking-widest text-[#8fa7ca]">
            ACCOUNT
          </div>
          <button
            type="button"
            onClick={onExitPreview}
            className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left text-[11px] font-bold text-[#c6d5eb] transition hover:bg-white/10 hover:text-white"
          >
            <CategoryIcon name="logout" size={17} />
            <span>Exit admin preview</span>
          </button>
        </aside>

        <div className="min-w-0 flex-1 overflow-auto bg-[#f7f9fd] p-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[19px] font-bold text-[#172b4d]">{activePage}</h2>
              <p className="text-[11px] text-[#71819b]">
                Good morning · Here is your business activity overview.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#1763d5]">Business workspace</span>
          </div>
          {renderContent()}
        </div>
      </div>
    </MonitorFrame>
  );
}
