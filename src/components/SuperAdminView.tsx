import { useState } from 'react';
import app4appLogo from '../assets/app4app-logo.png';
import { SUPER_MENU } from '../data/initialData';
import { Booking, BookingStatus, Business, CategoryItem, SuperPage } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { MonitorFrame } from './MonitorFrame';

interface SuperAdminViewProps {
  businesses: Business[];
  categories: CategoryItem[];
  cities: string[];
  bookings: Booking[];
  onUpdateBooking: (id: string, status: BookingStatus) => void;
  onApproveReschedule: (id: string) => void;
  onViewBookingDetails: (booking: Booking) => void;
  onOpenCreateBusiness: () => void;
  onOpenEditBusiness: (business: Business) => void;
  onToggleBusinessPause: (id: string) => void;
  onOpenAddCategory: () => void;
  onOpenAddCity: () => void;
  onExitPreview: () => void;
  onNotify: (msg: string) => void;
}

export function SuperAdminView({
  businesses,
  categories,
  cities,
  bookings,
  onUpdateBooking,
  onApproveReschedule,
  onViewBookingDetails,
  onOpenCreateBusiness,
  onOpenEditBusiness,
  onToggleBusinessPause,
  onOpenAddCategory,
  onOpenAddCity,
  onExitPreview,
  onNotify,
}: SuperAdminViewProps) {
  const [activePage, setActivePage] = useState<SuperPage>('Overview');
  const [platformName, setPlatformName] = useState('App4App');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [approvalRule, setApprovalRule] = useState('Business admin approval required');
  const [notificationsEnabled, setNotificationsEnabled] = useState('Enable notification events');

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const uniquePhones = Array.from(new Set(bookings.map((b) => b.phone)));

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
            <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
              <th className="px-2 py-2.5">Booking</th>
              <th className="px-2 py-2.5">Customer</th>
              <th className="px-2 py-2.5">Business</th>
              <th className="px-2 py-2.5">Date & time</th>
              <th className="px-2 py-2.5">Status</th>
              <th className="px-2 py-2.5">Actions</th>
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
                  <div>{b.business}</div>
                  <small className="text-[10px] text-[#71819b]">{b.category}</small>
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
                { label: 'Businesses', value: businesses.length, sub: 'Registered demo businesses', icon: 'building' as const },
                { label: 'Customers', value: uniquePhones.length, sub: 'Unique customers', icon: 'users' as const },
                { label: 'Appointments', value: bookings.length, sub: 'Platform-wide', icon: 'calendar' as const },
                { label: 'Pending', value: pendingCount, sub: 'Awaiting business action', icon: 'clock' as const },
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
                  <strong className="text-[13px] font-bold text-[#172b4d]">
                    Recent platform bookings
                  </strong>
                  <button
                    type="button"
                    onClick={() => setActivePage('All Appointments')}
                    className="rounded-[7px] bg-[#edf4ff] px-2.5 py-1 text-[10px] font-bold text-[#185bbd]"
                  >
                    View all
                  </button>
                </div>
                {renderBookingsTable(bookings.slice(0, 5))}
              </div>

              <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
                <div className="mb-3">
                  <strong className="text-[13px] font-bold text-[#172b4d]">
                    Business distribution
                  </strong>
                </div>
                <div className="divide-y divide-[#eef2f7]">
                  {categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between py-2.5 text-[11px] text-[#52647e]"
                    >
                      <span className="flex items-center gap-2">
                        <CategoryIcon name={cat.icon} size={15} className="text-[#1763d5]" />
                        <span>
                          {cat.name}
                          {cat.subtitle ? ` (${cat.subtitle})` : ''}
                        </span>
                      </span>
                      <b className="text-[#172b4d] tabular-nums">
                        {businesses.filter((b) => b.category === cat.name).length}
                      </b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'Businesses':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Business directory</strong>
              <button
                type="button"
                onClick={onOpenCreateBusiness}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                + Create business
              </button>
            </div>
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
                  <th className="px-2 py-2.5">Business</th>
                  <th className="px-2 py-2.5">Category</th>
                  <th className="px-2 py-2.5">City</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="px-2 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7]">
                {businesses.map((b) => (
                  <tr key={b.id} className="text-[#52647e]">
                    <td className="px-2 py-2.5 font-semibold text-[#172b4d]">{b.name}</td>
                    <td className="px-2 py-2.5">
                      {b.category}
                      {b.audienceTag ? ` · ${b.audienceTag}` : ''}
                    </td>
                    <td className="px-2 py-2.5">{b.city}</td>
                    <td className="px-2 py-2.5">
                      <span
                        className={`font-semibold ${
                          b.paused ? 'text-[#a36c14]' : 'text-[#16805b]'
                        }`}
                      >
                        {b.paused ? 'Paused' : 'Active'}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditBusiness(b)}
                          className="rounded-[7px] bg-[#edf4ff] px-2 py-1 text-[10px] font-bold text-[#185bbd]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleBusinessPause(b.id)}
                          className="rounded-[7px] bg-[#fff0f1] px-2 py-1 text-[10px] font-bold text-[#b83f50]"
                        >
                          {b.paused ? 'Resume' : 'Pause'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Categories & Cities':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-[13px] font-bold text-[#172b4d]">Business categories</strong>
                <button
                  type="button"
                  onClick={onOpenAddCategory}
                  className="rounded-[10px] bg-[#1763d5] px-3 py-1.5 text-[11px] font-bold text-white"
                >
                  + Add
                </button>
              </div>
              <div className="divide-y divide-[#eef2f7]">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center gap-2.5 py-2.5 text-[11px] text-[#52647e]">
                    <CategoryIcon name={c.icon} size={16} className="text-[#1763d5]" />
                    <span className="font-semibold text-[#172b4d]">{c.name}</span>
                    {c.subtitle && <span className="text-[#71819b]">· {c.subtitle}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-[13px] font-bold text-[#172b4d]">Available cities</strong>
                <button
                  type="button"
                  onClick={onOpenAddCity}
                  className="rounded-[10px] bg-[#1763d5] px-3 py-1.5 text-[11px] font-bold text-white"
                >
                  + Add city
                </button>
              </div>
              <div className="divide-y divide-[#eef2f7]">
                {cities.map((c) => (
                  <div key={c} className="py-2.5 text-[11px] font-semibold text-[#172b4d]">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'All Appointments':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">
                All platform appointments
              </strong>
              <span className="text-[11px] font-bold text-[#1763d5] tabular-nums">
                {bookings.length} total
              </span>
            </div>
            {renderBookingsTable(bookings)}
          </div>
        );

      case 'Customers':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <strong className="mb-3 block text-[13px] font-bold text-[#172b4d]">
              Platform customers
            </strong>
            {uniquePhones.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-[#71819b]">
                No customer records yet.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#e5ebf4] text-[10px] text-[#8492a7] uppercase">
                    <th className="px-2 py-2.5">Name</th>
                    <th className="px-2 py-2.5">Mobile</th>
                    <th className="px-2 py-2.5">Total bookings</th>
                    <th className="px-2 py-2.5">Latest business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef2f7]">
                  {uniquePhones.map((ph) => {
                    const list = bookings.filter((b) => b.phone === ph);
                    const latest = list[0];
                    return (
                      <tr key={ph} className="text-[#52647e]">
                        <td className="px-2 py-2.5 font-semibold text-[#172b4d]">{latest.customer}</td>
                        <td className="px-2 py-2.5 tabular-nums">{ph}</td>
                        <td className="px-2 py-2.5 tabular-nums">{list.length}</td>
                        <td className="px-2 py-2.5">{latest.business}</td>
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
                <div className="text-[11px] font-bold text-[#71819b]">Total bookings</div>
                <strong className="mt-2 block text-[26px] font-extrabold text-[#172b4d] tabular-nums">
                  {bookings.length}
                </strong>
                <small className="text-[10px] text-[#8b98ab]">All categories</small>
              </div>
              <div className="rounded-[15px] border border-[#e5ebf4] bg-white p-4">
                <div className="text-[11px] font-bold text-[#71819b]">Active businesses</div>
                <strong className="mt-2 block text-[26px] font-extrabold text-[#172b4d] tabular-nums">
                  {businesses.filter((b) => !b.paused).length}
                </strong>
                <small className="text-[10px] text-[#8b98ab]">Demo records</small>
              </div>
            </div>
            <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
              <strong className="mb-3 block text-[13px] font-bold text-[#172b4d]">Booking status</strong>
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

      case 'Platform Settings':
        return (
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">
                Platform configuration
              </strong>
              <button
                type="button"
                onClick={() => onNotify('Platform settings saved')}
                className="rounded-[10px] bg-[#1763d5] px-3.5 py-2 text-[12px] font-bold text-white"
              >
                Save settings
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Platform name</label>
                <input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Default timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                >
                  <option>Asia/Kolkata</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Booking approval</label>
                <select
                  value={approvalRule}
                  onChange={(e) => setApprovalRule(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                >
                  <option>Business admin approval required</option>
                  <option>Auto approve</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">Notifications</label>
                <select
                  value={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.value)}
                  className="w-full rounded-[10px] border border-[#dfe7f2] px-3 py-2 text-[12px]"
                >
                  <option>Enable notification events</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <MonitorFrame>
      <div className="flex h-[58px] items-center justify-between border-b border-[#e5ebf4] px-5">
        <div>
          <strong className="block text-[14px] font-bold text-[#172b4d]">Super Admin Console</strong>
          <small className="text-[11px] text-[#71819b]">
            Platform-wide management · {platformName}
          </small>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNotify('No new platform alerts')}
            aria-label="Platform alerts"
            className="grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-[#f0f5fd] text-[#185bc1]"
          >
            <CategoryIcon name="bell" size={18} />
          </button>
          <span className="text-[12px] font-bold text-[#52647f]">Super Admin</span>
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
              <small className="block text-[9px] tracking-wide text-[#a9bddc]">PLATFORM CONTROL</small>
            </div>
          </div>

          <div className="px-2.5 pt-2 pb-1.5 text-[9px] font-extrabold tracking-widest text-[#8fa7ca]">
            WORKSPACE
          </div>
          {SUPER_MENU.map((item) => {
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
              <p className="text-[11px] text-[#71819b]">Platform overview and administration.</p>
            </div>
            <span className="text-[11px] font-bold text-[#1763d5]">Super Admin</span>
          </div>
          {renderContent()}
        </div>
      </div>
    </MonitorFrame>
  );
}
