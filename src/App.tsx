import { useCallback, useRef, useState } from 'react';
import { Download, Mail, Phone } from 'lucide-react';
import app4appLogo from './assets/app4app-logo.png';
import { BusinessAdminView } from './components/BusinessAdminView';
import { CategoryIcon } from './components/CategoryIcon';
import { CustomerView } from './components/CustomerView';
import { Modal } from './components/Modal';
import { SuperAdminView } from './components/SuperAdminView';
import {
  INITIAL_BUSINESSES,
  INITIAL_CATEGORIES,
  INITIAL_CITIES,
  INITIAL_DEPARTMENTS,
  INITIAL_SERVICES,
  INITIAL_STAFF,
} from './data/initialData';
import {
  Booking,
  BookingStatus,
  Business,
  CategoryItem,
  DepartmentItem,
  Role,
  ServiceItem,
  StaffItem,
} from './types';

type ActiveModal =
  | { type: 'details'; booking: Booking }
  | { type: 'reschedule'; booking: Booking }
  | { type: 'addService' }
  | { type: 'addDepartment' }
  | { type: 'addStaff' }
  | { type: 'createBusiness' }
  | { type: 'editBusiness'; business: Business }
  | { type: 'addCategory' }
  | { type: 'addCity' }
  | null;

export default function App() {
  const [role, setRole] = useState<Role>('customer');
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [cities, setCities] = useState<string[]>(INITIAL_CITIES);
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [staffList, setStaffList] = useState<StaffItem[]>(INITIAL_STAFF);

  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const toastTimer = useRef<number | null>(null);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Modal form states
  const [reschedDate, setReschedDate] = useState('2026-11-28');
  const [reschedTime, setReschedTime] = useState('11:30 AM');

  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('30 min');

  const [newDeptName, setNewDeptName] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');

  const [bizName, setBizName] = useState('');
  const [bizCat, setBizCat] = useState(INITIAL_CATEGORIES[0].name);
  const [bizCity, setBizCity] = useState(INITIAL_CITIES[0]);
  const [bizAddr, setBizAddr] = useState('');

  const [editBizName, setEditBizName] = useState('');
  const [editBizCity, setEditBizCity] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [newCityName, setNewCityName] = useState('');

  const notify = useCallback((message: string) => {
    setToastMsg(message);
    setToastVisible(true);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  }, []);

  const handleCreateBooking = (draft: Omit<Booking, 'id' | 'status'>): Booking => {
    const id = `AF4-${1000 + bookings.length + 1}`;
    const created: Booking = { ...draft, id, status: 'Pending' };
    setBookings((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateBooking = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    notify(`Booking ${id} ${status.toLowerCase()}`);
  };

  const handleApproveReschedule = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              date: b.requestedDate || b.date,
              time: b.requestedTime || b.time,
              status: 'Rescheduled',
            }
          : b
      )
    );
    notify('New appointment time approved');
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
    notify('Cancellation request recorded');
  };

  const introContent: Record<Role, { title: string; subtitle: string }> = {
    customer: {
      title: 'One app. Every appointment.',
      subtitle:
        'Discover trusted services, beauty parlours, VIPs and celebrity desks at the right time.',
    },
    business: {
      title: 'Business operations, under control.',
      subtitle:
        'Manage your own business, team, availability and every customer appointment.',
    },
    super: {
      title: 'One platform. Complete visibility.',
      subtitle:
        'Oversee businesses, customers, bookings and platform configuration from one control center.',
    },
  };

  return (
    <div className="min-h-screen bg-[#eef3fa] text-[#172b4d]">
      <div className="mx-auto max-w-[1640px] px-3 py-4 sm:px-7 sm:py-6">
        {/* Top Header */}
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="grid h-[64px] w-[64px] shrink-0 place-items-center overflow-hidden rounded-[16px] border border-[#dce6f4] bg-white p-1 shadow-[0_8px_22px_rgba(23,99,213,0.14)] sm:h-[76px] sm:w-[76px]">
              <img
                src={app4appLogo}
                alt="App4App logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <strong className="font-display block text-[17px] leading-snug font-extrabold tracking-tight text-[#172b4d] sm:text-[21px]">
                App4App - One App for All Appointment
              </strong>
              <small className="mt-0.5 block text-[11px] text-[#71819b] sm:text-[12px]">
                Multi-domain appointment platform · Client presentation
              </small>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div
              role="tablist"
              aria-label="Role switcher"
              className="flex w-full gap-1 rounded-[13px] bg-[#e5ecf7] p-1 sm:w-auto"
            >
              {(
                [
                  { id: 'customer', label: 'Customer', icon: 'user' },
                  { id: 'business', label: 'Business Admin', icon: 'building' },
                  { id: 'super', label: 'Super Admin', icon: 'shield' },
                ] as const
              ).map((tab) => {
                const active = role === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setRole(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[12px] font-bold whitespace-nowrap transition sm:flex-none ${
                      active
                        ? 'bg-white text-[#1763d5] shadow-[0_2px_8px_rgba(21,46,80,0.08)]'
                        : 'text-[#60718b] hover:text-[#172b4d]'
                    }`}
                  >
                    <CategoryIcon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Section Intro */}
        <section className="mt-2 mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-[26px] leading-tight font-extrabold tracking-tight text-[#172b4d] sm:text-[30px]">
              {introContent[role].title}
            </h1>
            <p className="mt-1 text-[13px] text-[#71819b]">{introContent[role].subtitle}</p>
          </div>
          <span className="text-[11px] font-bold tracking-wide text-[#1763d5] whitespace-nowrap">
            Interactive product walkthrough
          </span>
        </section>

        {/* Active Stage */}
        <main>
          {role === 'customer' && (
            <CustomerView
              categories={categories}
              cities={cities}
              businesses={businesses}
              bookings={bookings}
              onCreateBooking={handleCreateBooking}
              onViewBookingDetails={(b) => setActiveModal({ type: 'details', booking: b })}
              onRequestReschedule={(b) => {
                setReschedDate('2026-11-28');
                setReschedTime('11:30 AM');
                setActiveModal({ type: 'reschedule', booking: b });
              }}
              onCancelBooking={handleCancelBooking}
              onNotify={notify}
            />
          )}

          {role === 'business' && (
            <BusinessAdminView
              bookings={bookings}
              services={services}
              departments={departments}
              staffList={staffList}
              onUpdateBooking={handleUpdateBooking}
              onApproveReschedule={handleApproveReschedule}
              onViewBookingDetails={(b) => setActiveModal({ type: 'details', booking: b })}
              onOpenAddService={() => {
                setNewServiceName('');
                setNewServicePrice('');
                setNewServiceDuration('30 min');
                setActiveModal({ type: 'addService' });
              }}
              onOpenAddDepartment={() => {
                setNewDeptName('');
                setActiveModal({ type: 'addDepartment' });
              }}
              onOpenAddStaff={() => {
                setNewStaffName('');
                setNewStaffRole('');
                setActiveModal({ type: 'addStaff' });
              }}
              onExitPreview={() => setRole('customer')}
              onNotify={notify}
            />
          )}

          {role === 'super' && (
            <SuperAdminView
              businesses={businesses}
              categories={categories}
              cities={cities}
              bookings={bookings}
              onUpdateBooking={handleUpdateBooking}
              onApproveReschedule={handleApproveReschedule}
              onViewBookingDetails={(b) => setActiveModal({ type: 'details', booking: b })}
              onOpenCreateBusiness={() => {
                setBizName('');
                setBizCat(categories[0]?.name || 'Hospital');
                setBizCity(cities[0] || 'Chennai');
                setBizAddr('');
                setActiveModal({ type: 'createBusiness' });
              }}
              onOpenEditBusiness={(b) => {
                setEditBizName(b.name);
                setEditBizCity(b.city);
                setActiveModal({ type: 'editBusiness', business: b });
              }}
              onToggleBusinessPause={(id) => {
                setBusinesses((prev) =>
                  prev.map((b) => {
                    if (b.id !== id) return b;
                    const nextPaused = !b.paused;
                    notify(nextPaused ? 'Business paused in demo' : 'Business activated in demo');
                    return { ...b, paused: nextPaused };
                  })
                );
              }}
              onOpenAddCategory={() => {
                setNewCatName('');
                setActiveModal({ type: 'addCategory' });
              }}
              onOpenAddCity={() => {
                setNewCityName('');
                setActiveModal({ type: 'addCity' });
              }}
              onExitPreview={() => setRole('customer')}
              onNotify={notify}
            />
          )}
        </main>

        {/* Footnote */}
        <p className="mt-5 text-center text-[11px] text-[#8b98aa]">
          App4App · Connected customer, business and platform workflows · Demonstration data only
        </p>

        {/* Contact Information Card */}
        <section
          aria-label="Contact Information"
          className="mx-auto mt-6 flex max-w-[1360px] flex-wrap items-center justify-between gap-6 rounded-[18px] border border-[#dfe7f2] bg-white px-6 py-5 shadow-[0_12px_32px_rgba(20,44,80,0.05)]"
        >
          <div className="grid gap-1">
            <span className="text-[10px] font-extrabold tracking-[1.5px] text-[#1763d5]">
              CONTACT INFORMATION
            </span>
            <strong className="font-display text-[17px] font-bold tracking-tight text-[#10284f]">
              FUTURE FUSION INFO TECH
            </strong>
            <span className="text-[12px] text-[#71819b]">
              App4App - One App for All Appointment
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:futurefusioninfotech@gmail.com"
              aria-label="Email Future Fusion Info Tech"
              className="flex items-center gap-2.5 rounded-[12px] border border-[#e5ebf4] bg-[#f8faff] px-3.5 py-2.5 text-[#172b4d] transition hover:border-[#9fc2ff] hover:bg-[#edf4ff]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#e7f0ff] text-[#1763d5]">
                <Mail size={16} />
              </span>
              <span>
                <small className="block text-[10px] text-[#71819b]">Email</small>
                <b className="text-[12px] font-bold">futurefusioninfotech@gmail.com</b>
              </span>
            </a>
            <a
              href="tel:+919500553499"
              aria-label="Call Future Fusion Info Tech"
              className="flex items-center gap-2.5 rounded-[12px] border border-[#e5ebf4] bg-[#f8faff] px-3.5 py-2.5 text-[#172b4d] transition hover:border-[#9fc2ff] hover:bg-[#edf4ff]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#e7f0ff] text-[#1763d5]">
                <Phone size={16} />
              </span>
              <span>
                <small className="block text-[10px] text-[#71819b]">Phone</small>
                <b className="text-[12px] font-bold tabular-nums">+91 95005 53499</b>
              </span>
            </a>
            <a
              href="/app4app-single.html"
              download="index.html"
              onClick={() => notify('Downloading standalone single index.html')}
              className="flex items-center gap-2.5 rounded-[12px] border border-[#1763d5] bg-[#1763d5] px-4 py-2.5 text-white transition hover:bg-[#0d4eb5]"
            >
              <Download size={16} />
              <span>
                <small className="block text-[10px] text-white/80">Single File</small>
                <b className="text-[12px] font-bold whitespace-nowrap">Download HTML</b>
              </span>
            </a>
          </div>
        </section>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-[12px] bg-[#10284f] px-4 py-3 text-[12px] font-medium text-white shadow-[0_12px_30px_rgba(20,45,80,0.22)] transition-opacity duration-200 ${
          toastVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {toastMsg}
      </div>

      {/* Interactive Modals */}
      <Modal
        open={activeModal?.type === 'details'}
        title="Appointment details"
        onClose={() => setActiveModal(null)}
      >
        {activeModal?.type === 'details' && (
          <div className="space-y-2 text-[13px] text-[#172b4d]">
            <p className="font-bold text-[15px]">{activeModal.booking.business}</p>
            <p className="tabular-nums">
              {activeModal.booking.id} · {activeModal.booking.service}
            </p>
            <p className="tabular-nums">
              {activeModal.booking.date} at {activeModal.booking.time}
            </p>
            <p>
              Status: <b>{activeModal.booking.status}</b>
            </p>
            <p className="text-[12px] text-[#71819b]">
              Status changes are reflected across Customer and Admin views.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={activeModal?.type === 'reschedule'}
        title="Request reschedule"
        onClose={() => setActiveModal(null)}
        footer={
          activeModal?.type === 'reschedule' && (
            <button
              type="button"
              onClick={() => {
                const targetId = activeModal.booking.id;
                setBookings((prev) =>
                  prev.map((b) =>
                    b.id === targetId
                      ? {
                          ...b,
                          status: 'Reschedule Requested',
                          requestedDate: reschedDate,
                          requestedTime: reschedTime,
                        }
                      : b
                  )
                );
                setActiveModal(null);
                notify('Reschedule request sent to business');
              }}
              className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
            >
              Send request
            </button>
          )
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
              New preferred date
            </label>
            <input
              type="date"
              value={reschedDate}
              onChange={(e) => setReschedDate(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
              Preferred time
            </label>
            <select
              value={reschedTime}
              onChange={(e) => setReschedTime(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            >
              <option>11:30 AM</option>
              <option>02:00 PM</option>
              <option>03:30 PM</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'addService'}
        title="Add service"
        onClose={() => setActiveModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              if (!newServiceName.trim()) {
                notify('Enter service name');
                return;
              }
              setServices((prev) => [
                ...prev,
                {
                  service: newServiceName.trim(),
                  category: 'Custom',
                  duration: newServiceDuration,
                  price: `₹${newServicePrice || '500'}`,
                  status: 'Active',
                },
              ]);
              notify(`${newServiceName.trim()} added to demo catalogue`);
              setActiveModal(null);
            }}
            className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            Save service
          </button>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
              Service name
            </label>
            <input
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Enter service"
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">Price (₹)</label>
            <input
              type="number"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              placeholder="Price"
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">Duration</label>
            <select
              value={newServiceDuration}
              onChange={(e) => setNewServiceDuration(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            >
              <option>30 min</option>
              <option>45 min</option>
              <option>60 min</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'addDepartment'}
        title="Add department"
        onClose={() => setActiveModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              if (!newDeptName.trim()) {
                notify('Enter department');
                return;
              }
              setDepartments((prev) => [
                ...prev,
                { department: newDeptName.trim(), doctors: 'Assigned Doctor', status: 'Active' },
              ]);
              notify(`${newDeptName.trim()} added`);
              setActiveModal(null);
            }}
            className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            Add department
          </button>
        }
      >
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
            Department name
          </label>
          <input
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            placeholder="e.g. Neurology"
            className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
          />
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'addStaff'}
        title="Add professional"
        onClose={() => setActiveModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              if (!newStaffName.trim()) {
                notify('Enter name');
                return;
              }
              setStaffList((prev) => [
                ...prev,
                {
                  name: newStaffName.trim(),
                  role: newStaffRole.trim() || 'Specialist',
                  assignedService: 'General',
                  availability: 'Mon–Sat',
                },
              ]);
              notify(`${newStaffName.trim()} added to staff list`);
              setActiveModal(null);
            }}
            className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            Add professional
          </button>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">Name</label>
            <input
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Professional name"
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
              Role / specialization
            </label>
            <input
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value)}
              placeholder="Role"
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'createBusiness'}
        title="Create new business"
        onClose={() => setActiveModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              if (!bizName.trim()) {
                notify('Enter business name');
                return;
              }
              const catObj = categories.find((c) => c.name === bizCat);
              setBusinesses((prev) => [
                ...prev,
                {
                  id: `b${Date.now()}`,
                  name: bizName.trim(),
                  category: bizCat,
                  audienceTag: catObj?.subtitle,
                  city: bizCity,
                  address: bizAddr.trim() || bizCity,
                  rating: 'New',
                  price: 500,
                  icon: catObj?.icon || 'briefcase',
                  services: ['Consultation', 'Standard service'],
                  staff: ['Any available'],
                },
              ]);
              setActiveModal(null);
              notify('New business created');
            }}
            className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            Create business
          </button>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
              Business name
            </label>
            <input
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              placeholder="Business name"
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">Category</label>
            <select
              value={bizCat}
              onChange={(e) => setBizCat(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                  {c.subtitle ? ` (${c.subtitle})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">City</label>
            <select
              value={bizCity}
              onChange={(e) => setBizCity(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">Address</label>
            <input
              value={bizAddr}
              onChange={(e) => setBizAddr(e.target.value)}
              placeholder="Business address"
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'editBusiness'}
        title="Edit business"
        onClose={() => setActiveModal(null)}
        footer={
          activeModal?.type === 'editBusiness' && (
            <button
              type="button"
              onClick={() => {
                const targetId = activeModal.business.id;
                setBusinesses((prev) =>
                  prev.map((b) =>
                    b.id === targetId
                      ? { ...b, name: editBizName.trim() || b.name, city: editBizCity.trim() || b.city }
                      : b
                  )
                );
                setActiveModal(null);
                notify('Business updated');
              }}
              className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
            >
              Save changes
            </button>
          )
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">
              Business name
            </label>
            <input
              value={editBizName}
              onChange={(e) => setEditBizName(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">City</label>
            <input
              value={editBizCity}
              onChange={(e) => setEditBizCity(e.target.value)}
              className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'addCategory'}
        title="Add category"
        onClose={() => setActiveModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              if (!newCatName.trim()) {
                notify('Enter category name');
                return;
              }
              setCategories((prev) => [...prev, { name: newCatName.trim(), icon: 'briefcase' }]);
              setActiveModal(null);
              notify('Category saved');
            }}
            className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            Save
          </button>
        }
      >
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">Category</label>
          <input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name"
            className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
          />
        </div>
      </Modal>

      <Modal
        open={activeModal?.type === 'addCity'}
        title="Add city"
        onClose={() => setActiveModal(null)}
        footer={
          <button
            type="button"
            onClick={() => {
              if (!newCityName.trim()) {
                notify('Enter city name');
                return;
              }
              setCities((prev) => [...prev, newCityName.trim()]);
              setActiveModal(null);
              notify('City saved');
            }}
            className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            Save
          </button>
        }
      >
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-[#52647e]">City</label>
          <input
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            placeholder="City name"
            className="w-full rounded-[10px] border border-[#dce5f1] px-3 py-2.5 text-[13px]"
          />
        </div>
      </Modal>
    </div>
  );
}
