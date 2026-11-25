import { useState } from 'react';
import { Booking, Business, CategoryItem, CustomerPage } from '../types';
import { TIME_SLOTS } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';

interface CustomerViewProps {
  categories: CategoryItem[];
  cities: string[];
  businesses: Business[];
  bookings: Booking[];
  onCreateBooking: (booking: Omit<Booking, 'id' | 'status'>) => Booking;
  onViewBookingDetails: (booking: Booking) => void;
  onRequestReschedule: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onNotify: (message: string) => void;
}

export function CustomerView({
  categories,
  cities,
  businesses,
  bookings,
  onCreateBooking,
  onViewBookingDetails,
  onRequestReschedule,
  onCancelBooking,
  onNotify,
}: CustomerViewProps) {
  const [page, setPage] = useState<CustomerPage>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-27');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [customerName, setCustomerName] = useState<string>('Keerthana');
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [customerNote, setCustomerNote] = useState<string>('');
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  const activeBusinesses = businesses.filter((b) => !b.paused);

  const filteredBusinesses = activeBusinesses.filter((b) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesCity = selectedCity === 'All Cities' || b.city === selectedCity;
    const q = searchQuery.trim().toLowerCase();
    const searchable = [
      b.name,
      b.category,
      b.audienceTag || '',
      b.city,
      ...b.services,
      ...b.staff,
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = !q || searchable.includes(q);
    return matchesCat && matchesCity && matchesQuery;
  });

  const startBooking = (biz: Business) => {
    setSelectedBiz(biz);
    setSelectedService(null);
    setSelectedStaff(null);
    setBookingStep(0);
    setPage('book');
  };

  const handleNextStep = () => {
    if (bookingStep === 0 && !selectedService) {
      onNotify('Please select a service');
      return;
    }
    if (bookingStep === 1 && !selectedStaff) {
      setSelectedStaff('Any available');
    }
    setBookingStep((s) => Math.min(3, s + 1));
  };

  const handleSubmitBooking = () => {
    if (!selectedBiz || !selectedService) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      onNotify('Enter customer name and mobile number');
      return;
    }
    const created = onCreateBooking({
      businessId: selectedBiz.id,
      business: selectedBiz.name,
      category: selectedBiz.category,
      city: selectedBiz.city,
      service: selectedService,
      professional: selectedStaff || 'Any available',
      date: selectedDate,
      time: selectedTime,
      customer: customerName.trim(),
      phone: customerPhone.trim(),
      note: customerNote.trim(),
    });
    setLastBooking(created);
    setPage('confirmation');
    onNotify('Appointment request submitted');
  };

  const handleDomainSelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setPage('home');
  };

  const renderMobileContent = () => {
    if (page === 'home') {
      return (
        <div>
          <div className="relative mb-3.5 overflow-hidden rounded-[19px] bg-gradient-to-br from-[#123e8f] to-[#1972e7] p-4 text-white">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-9 -right-12 h-[130px] w-[130px] rounded-full border-[18px] border-white/15"
            />
            <span className="text-[10px] font-semibold tracking-wider text-white/80 uppercase">
              Your time, your choice
            </span>
            <h2 className="mt-1.5 mb-1.5 text-[20px] leading-tight font-bold">
              Appointments made simple.
            </h2>
            <p className="max-w-[245px] text-[11px] leading-relaxed text-white/90">
              Discover trusted local services, beauty parlours, VIPs and celebrity desks at the right time.
            </p>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-[13px] border border-[#e5ebf4] bg-white p-1.5 shadow-[0_4px_14px_rgba(23,47,85,0.04)]">
            <span className="pl-2 text-[#71819b]">
              <CategoryIcon name="search" size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business, beauty, VIP, actor..."
              aria-label="Search mobile services"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-[12px] text-[#172b4d] outline-none placeholder:text-[#8b98ab]"
            />
            <button
              type="button"
              onClick={() => onNotify('Search results updated')}
              aria-label="Run search"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#1763d5] text-white transition hover:bg-[#0d4eb5]"
            >
              <CategoryIcon name="search" size={16} />
            </button>
          </div>

          <div className="mt-3.5 mb-2.5 flex items-center justify-between">
            <strong className="text-[13px] font-bold text-[#172b4d]">Explore categories</strong>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-[11px] font-bold text-[#1763d5] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-[13px] border px-1.5 py-2 text-center transition ${
                selectedCategory === 'All'
                  ? 'border-[#9fc2ff] bg-[#edf4ff] text-[#1358bf]'
                  : 'border-[#e5ebf4] bg-white text-[#566783] hover:border-[#c9daf5]'
              }`}
            >
              <CategoryIcon name="grid" size={20} className="text-[#1763d5]" />
              <span className="text-[10px] leading-tight font-bold">All</span>
            </button>

            {categories.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-[13px] border px-1.5 py-2 text-center transition ${
                    active
                      ? 'border-[#9fc2ff] bg-[#edf4ff] text-[#1358bf]'
                      : 'border-[#e5ebf4] bg-white text-[#566783] hover:border-[#c9daf5]'
                  }`}
                >
                  <CategoryIcon name={cat.icon} size={20} className="text-[#1763d5]" />
                  <span className="text-[10px] leading-tight font-bold">{cat.name}</span>
                  {cat.subtitle && (
                    <span className="line-clamp-1 text-[8px] leading-tight text-[#71819b]">
                      {cat.subtitle}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 mb-2 flex items-center justify-between">
            <strong className="text-[13px] font-bold text-[#172b4d]">Choose your city</strong>
            <span className="text-[11px] font-semibold text-[#1763d5]">{selectedCity}</span>
          </div>
          <div className="mb-3">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                onNotify(`City filter: ${e.target.value}`);
              }}
              aria-label="Choose city"
              className="w-full rounded-[10px] border border-[#dfe7f2] bg-white px-3 py-2.5 text-[12px] text-[#172b4d] outline-none focus:border-[#79a8f2]"
            >
              <option value="All Cities">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3.5 mb-2.5 flex items-center justify-between">
            <strong className="text-[13px] font-bold text-[#172b4d]">
              {selectedCategory === 'All' ? 'Popular mobile services' : `${selectedCategory} services`}
            </strong>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCity('All Cities');
                setSearchQuery('');
              }}
              className="text-[11px] font-bold text-[#1763d5] hover:underline"
            >
              See all →
            </button>
          </div>

          <div className="space-y-2.5">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className="flex items-center gap-2.5 rounded-[15px] border border-[#e5ebf4] bg-white p-2.5 shadow-[0_4px_14px_rgba(21,47,83,0.03)]"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[#edf4ff] text-[#1763d5]">
                    <CategoryIcon name={biz.icon} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-[12px] font-bold text-[#172b4d]">
                      {biz.name}
                    </strong>
                    <small className="mt-0.5 block truncate text-[10px] text-[#71819b]">
                      {biz.category}
                      {biz.audienceTag ? ` · ${biz.audienceTag}` : ''} · {biz.city}
                    </small>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] tabular-nums">
                      <span className="font-semibold text-[#b7791f]">★ {biz.rating}</span>
                      <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                      <span className="text-[#71819b]">{biz.services.length} services</span>
                      <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                      <span className="font-semibold text-[#172b4d]">From ₹{biz.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startBooking(biz)}
                    className="shrink-0 rounded-[9px] bg-[#1763d5] px-2.5 py-2 text-[10px] font-bold whitespace-nowrap text-white transition hover:bg-[#0d4eb5]"
                  >
                    Book now
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-[15px] border border-[#e5ebf4] bg-white px-4 py-8 text-center text-[12px] text-[#71819b]">
                No services found for this category and city.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (page === 'book' && selectedBiz) {
      const steps = ['Service', 'Professional', 'Date & time', 'Details'];
      return (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage('home')}
              className="text-[11px] font-bold text-[#1763d5] hover:underline"
            >
              ← Back to explore
            </button>
            <span className="text-[11px] font-bold text-[#1763d5] tabular-nums">
              Step {bookingStep + 1} of 4
            </span>
          </div>

          <div className="mb-3 rounded-[15px] border border-[#e5ebf4] bg-white p-3.5">
            {bookingStep === 0 && (
              <>
                <h3 className="text-[14px] font-bold text-[#172b4d]">{selectedBiz.name}</h3>
                <p className="mt-0.5 text-[11px] text-[#71819b]">
                  {selectedBiz.category}
                  {selectedBiz.audienceTag ? ` · ${selectedBiz.audienceTag}` : ''} · {selectedBiz.city}
                </p>
                <div className="my-3 flex gap-1.5">
                  {steps.map((s, idx) => (
                    <span
                      key={s}
                      className={`h-1 flex-1 rounded-full ${
                        idx <= bookingStep ? 'bg-[#1763d5]' : 'bg-[#e3eaf4]'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="mb-2.5 text-[13px] font-bold text-[#172b4d]">
                  Select {selectedBiz.category === 'Hospital' ? 'department / consultation' : 'service'}
                </h4>
                <div className="space-y-2">
                  {selectedBiz.services.map((srv, idx) => {
                    const active = selectedService === srv;
                    const price = selectedBiz.price + idx * 150;
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => setSelectedService(srv)}
                        className={`flex w-full items-center justify-between gap-2 rounded-[13px] border p-2.5 text-left transition ${
                          active
                            ? 'border-[#7ba9ed] bg-[#f4f8ff]'
                            : 'border-[#e5ebf4] bg-white hover:border-[#c9daf5]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-[12px] text-[#172b4d]">{srv}</strong>
                          <small className="text-[10px] text-[#71819b] tabular-nums">
                            {selectedBiz.category === 'Hospital' ? 'Consultation' : 'Appointment'} ·{' '}
                            {30 + idx * 15} min
                          </small>
                        </div>
                        <span className="text-[12px] font-bold text-[#1763d5] tabular-nums">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {active && <CategoryIcon name="check" size={16} className="text-[#1763d5]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {bookingStep === 1 && (
              <>
                <div className="mb-3 flex gap-1.5">
                  {steps.map((s, idx) => (
                    <span
                      key={s}
                      className={`h-1 flex-1 rounded-full ${
                        idx <= bookingStep ? 'bg-[#1763d5]' : 'bg-[#e3eaf4]'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="text-[13px] font-bold text-[#172b4d]">Select professional</h4>
                <p className="mt-0.5 mb-2.5 text-[11px] text-[#71819b]">
                  Choose a preferred professional or continue with first available.
                </p>
                <div className="space-y-2">
                  {selectedBiz.staff.map((person) => {
                    const active = selectedStaff === person;
                    return (
                      <button
                        key={person}
                        type="button"
                        onClick={() => setSelectedStaff(person)}
                        className={`flex w-full items-center gap-2.5 rounded-[13px] border p-2.5 text-left transition ${
                          active
                            ? 'border-[#7ba9ed] bg-[#f4f8ff]'
                            : 'border-[#e5ebf4] bg-white hover:border-[#c9daf5]'
                        }`}
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#edf4ff] text-[#1763d5]">
                          <CategoryIcon name="user" size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-[12px] text-[#172b4d]">
                            {person}
                          </strong>
                          <small className="text-[10px] text-[#71819b]">
                            Available for selected service
                          </small>
                        </div>
                        {active && <CategoryIcon name="check" size={16} className="text-[#1763d5]" />}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaff('Any available');
                    setBookingStep(2);
                  }}
                  className="mt-2.5 w-full rounded-[10px] border border-[#e5ebf4] bg-white py-2.5 text-[12px] font-bold text-[#536783] transition hover:bg-[#f8faff]"
                >
                  Any available professional
                </button>
              </>
            )}

            {bookingStep === 2 && (
              <>
                <div className="mb-3 flex gap-1.5">
                  {steps.map((s, idx) => (
                    <span
                      key={s}
                      className={`h-1 flex-1 rounded-full ${
                        idx <= bookingStep ? 'bg-[#1763d5]' : 'bg-[#e3eaf4]'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="mb-2.5 text-[13px] font-bold text-[#172b4d]">Choose date & time</h4>
                <div className="mb-3">
                  <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">
                    Appointment date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-11-25"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-[10px] border border-[#dfe7f2] bg-white px-3 py-2 text-[12px] text-[#172b4d] outline-none focus:border-[#79a8f2]"
                  />
                </div>
                <label className="block text-[11px] font-bold text-[#5d6f89]">
                  Available time slots
                </label>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-[9px] border py-2 text-[10px] tabular-nums transition ${
                        selectedTime === slot
                          ? 'border-[#78a7ef] bg-[#eaf2ff] font-bold text-[#1557b7]'
                          : 'border-[#dce6f4] bg-white text-[#536783]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="mt-3 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-2.5 text-[11px] leading-relaxed text-[#245a9f]">
                  Availability is checked again when the appointment request is submitted. A pending request is not a confirmed appointment.
                </div>
              </>
            )}

            {bookingStep === 3 && (
              <>
                <div className="mb-3 flex gap-1.5">
                  {steps.map((s, idx) => (
                    <span
                      key={s}
                      className={`h-1 flex-1 rounded-full ${
                        idx <= bookingStep ? 'bg-[#1763d5]' : 'bg-[#e3eaf4]'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="mb-2.5 text-[13px] font-bold text-[#172b4d]">Customer details</h4>
                <div className="space-y-2.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-[10px] border border-[#dfe7f2] bg-white px-3 py-2 text-[12px] text-[#172b4d] outline-none focus:border-[#79a8f2]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">
                      Mobile number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile number"
                      className="w-full rounded-[10px] border border-[#dfe7f2] bg-white px-3 py-2 text-[12px] text-[#172b4d] outline-none focus:border-[#79a8f2]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#5d6f89]">
                      Notes (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      placeholder="Add a note"
                      className="w-full rounded-[10px] border border-[#dfe7f2] bg-white px-3 py-2 text-[12px] text-[#172b4d] outline-none focus:border-[#79a8f2]"
                    />
                  </div>
                </div>
                <div className="mt-3 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-2.5 text-[11px] leading-relaxed text-[#245a9f]">
                  Your booking will be submitted as Pending until the business admin reviews it.
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={bookingStep === 0}
              onClick={() => setBookingStep((s) => Math.max(0, s - 1))}
              className="rounded-[10px] bg-[#edf3fc] px-4 py-2.5 text-[12px] font-bold text-[#2359a7] transition disabled:opacity-45"
            >
              Back
            </button>
            <button
              type="button"
              onClick={bookingStep === 3 ? handleSubmitBooking : handleNextStep}
              className="flex-1 rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#0d4eb5]"
            >
              {bookingStep === 3 ? 'Submit appointment' : 'Continue'}
            </button>
          </div>
        </div>
      );
    }

    if (page === 'confirmation' && lastBooking) {
      return (
        <div className="rounded-[15px] border border-[#e5ebf4] bg-white p-6 text-center">
          <div className="mx-auto grid h-[60px] w-[60px] place-items-center rounded-[15px] bg-[#e8f7f0] text-[#15966a]">
            <CategoryIcon name="check" size={28} />
          </div>
          <h2 className="mt-3 text-[19px] font-bold text-[#172b4d]">Request submitted</h2>
          <p className="mt-1 text-[12px] text-[#71819b]">
            Your appointment request has been sent to the business.
          </p>
          <div className="my-4 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-3 text-[11px] leading-relaxed text-[#245a9f] tabular-nums">
            <b className="block text-[12px]">{lastBooking.id}</b>
            {lastBooking.business}
            <br />
            {lastBooking.service} · {lastBooking.date} · {lastBooking.time}
            <br />
            Status: {lastBooking.status}
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage('bookings')}
              className="rounded-[10px] bg-[#1763d5] px-3.5 py-2.5 text-[12px] font-bold text-white"
            >
              View my bookings
            </button>
            <button
              type="button"
              onClick={() => setPage('home')}
              className="rounded-[10px] border border-[#e5ebf4] bg-white px-3.5 py-2.5 text-[12px] font-bold text-[#536783]"
            >
              Explore more
            </button>
          </div>
        </div>
      );
    }

    if (page === 'bookings') {
      return (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <strong className="text-[13px] font-bold text-[#172b4d]">My appointments</strong>
            <span className="text-[11px] font-bold text-[#1763d5] tabular-nums">
              {bookings.length} total
            </span>
          </div>
          {bookings.length === 0 ? (
            <div className="rounded-[15px] border border-[#e5ebf4] bg-white px-4 py-8 text-center">
              <div className="mx-auto mb-2 grid h-10 w-10 place-items-center text-[#71819b]">
                <CategoryIcon name="calendar" size={28} />
              </div>
              <p className="mb-3 text-[12px] text-[#71819b]">No appointments yet.</p>
              <button
                type="button"
                onClick={() => setPage('home')}
                className="rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white"
              >
                Explore services
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-[15px] border border-[#e5ebf4] bg-white p-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <b className="text-[13px] text-[#172b4d]">{b.business}</b>
                    <span
                      className={`shrink-0 text-[10px] font-bold ${
                        b.status === 'Approved' || b.status === 'Rescheduled'
                          ? 'text-[#16805b]'
                          : b.status === 'Rejected' || b.status === 'Cancelled'
                            ? 'text-[#bd4250]'
                            : 'text-[#a36c14]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <small className="mt-0.5 block text-[11px] text-[#71819b] tabular-nums">
                    {b.id} · {b.category}
                  </small>
                  <p className="mt-2 mb-1 text-[12px] text-[#172b4d]">
                    <b>{b.service}</b> · {b.professional}
                  </p>
                  <p className="mb-3 text-[11px] text-[#71819b] tabular-nums">
                    {b.date} · {b.time}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewBookingDetails(b)}
                      className="rounded-[9px] border border-[#e5ebf4] bg-white px-3 py-1.5 text-[11px] font-bold text-[#536783]"
                    >
                      View details
                    </button>
                    {['Pending', 'Approved'].includes(b.status) && (
                      <>
                        <button
                          type="button"
                          onClick={() => onRequestReschedule(b)}
                          className="rounded-[9px] bg-[#edf3fc] px-3 py-1.5 text-[11px] font-bold text-[#2359a7]"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => onCancelBooking(b.id)}
                          className="rounded-[9px] bg-[#fff0f1] px-3 py-1.5 text-[11px] font-bold text-[#bd4250]"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (page === 'notifications') {
      return (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <strong className="text-[13px] font-bold text-[#172b4d]">Notification center</strong>
            <span className="text-[11px] font-bold text-[#1763d5]">Live updates</span>
          </div>
          {bookings.length === 0 ? (
            <div className="rounded-[15px] border border-[#e5ebf4] bg-white px-4 py-8 text-center text-[12px] text-[#71819b]">
              You are all caught up.
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2.5 rounded-[15px] border border-[#e5ebf4] bg-white p-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#edf4ff] text-[#1763d5]">
                    <CategoryIcon name="bell" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-[12px] text-[#172b4d]">
                      {b.status === 'Pending'
                        ? 'Booking submitted'
                        : `Booking ${b.status.toLowerCase()}`}
                    </strong>
                    <small className="block truncate text-[10px] text-[#71819b] tabular-nums">
                      {b.business} · {b.id}
                    </small>
                    <small className="block text-[10px] text-[#71819b] tabular-nums">
                      {b.date} · {b.time}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="rounded-[15px] border border-[#e5ebf4] bg-white p-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[16px] bg-[#edf4ff] text-[#1763d5]">
            <CategoryIcon name="user" size={28} />
          </div>
          <h3 className="mt-3 text-[15px] font-bold text-[#172b4d]">{customerName}</h3>
          <p className="mt-0.5 mb-3 text-[12px] text-[#71819b] tabular-nums">{customerPhone}</p>
          <button
            type="button"
            onClick={() => onNotify('Profile details are synced with booking form')}
            className="rounded-[10px] border border-[#e5ebf4] bg-white px-4 py-2 text-[12px] font-bold text-[#536783]"
          >
            Edit profile
          </button>
        </div>
        <div className="rounded-[15px] border border-[#e5ebf4] bg-white p-4">
          <h3 className="mb-1 text-[13px] font-bold text-[#172b4d]">Account</h3>
          <p className="mb-3 text-[12px] text-[#71819b]">
            Personal details · Saved preferences · Help & support
          </p>
          <button
            type="button"
            onClick={() => onNotify('Signed out in demo')}
            className="rounded-[10px] bg-[#edf3fc] px-4 py-2 text-[12px] font-bold text-[#2359a7]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  };

  const navItems: { id: CustomerPage; label: string; icon: 'home' | 'calendar' | 'bell' | 'user' }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'notifications', label: 'Alerts', icon: 'bell' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-start">
      {/* Android-style Mobile Preview */}
      <section
        aria-label="Customer Mobile Preview"
        className="relative w-full max-w-[410px] shrink-0 rounded-[38px] bg-[#142b4f] p-[10px] shadow-[0_28px_65px_rgba(19,44,80,0.16)]"
      >
        <span
          aria-hidden="true"
          className="absolute top-[10px] left-1/2 z-10 h-[17px] w-[110px] -translate-x-1/2 rounded-b-[13px] bg-[#142b4f]"
        />
        <div className="flex h-[780px] sm:h-[800px] flex-col overflow-hidden rounded-[29px] bg-[#f7f9fd]">
          <div className="flex h-[31px] shrink-0 items-center justify-between bg-white px-5 text-[10px] font-medium text-[#5c6c83] tabular-nums">
            <span>9:41</span>
            <span>5G · 100%</span>
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-[#edf1f7] bg-white px-4 py-3">
            <div>
              <div className="text-[11px] text-[#71819b]">Welcome back</div>
              <strong className="text-[16px] font-bold text-[#172b4d]">Explore services</strong>
            </div>
            <button
              type="button"
              onClick={() => setPage('notifications')}
              aria-label="Notifications"
              className="relative grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-[#f0f5fd] text-[#185bc1]"
            >
              <CategoryIcon name="bell" size={18} />
              {bookings.length > 0 && (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-extrabold text-[#bd4250]">
                  {bookings.length}
                </span>
              )}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3.5">{renderMobileContent()}</div>

          <nav
            aria-label="Mobile bottom navigation"
            className="flex h-[67px] shrink-0 items-center justify-around border-t border-[#e8edf5] bg-white px-1.5 pt-1 pb-2"
          >
            {navItems.map((item) => {
              const active =
                page === item.id || (item.id === 'home' && (page === 'book' || page === 'confirmation'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPage(item.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-[12px] px-3 py-1.5 text-[10px] font-bold transition ${
                    active ? 'bg-[#eef4ff] text-[#1763d5]' : 'text-[#8391a8] hover:text-[#172b4d]'
                  }`}
                >
                  <CategoryIcon name={item.icon} size={18} />
                  <span>
                    {item.label}
                    {item.id === 'notifications' && bookings.length > 0 ? ` (${bookings.length})` : ''}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Desktop Journey Overview Panel */}
      <aside className="w-full min-w-0 flex-1 overflow-hidden rounded-[19px] border border-[#dfe7f2] bg-white shadow-[0_18px_55px_rgba(20,44,80,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5ebf4] px-5 py-3.5">
          <div>
            <strong className="block text-[14px] font-bold text-[#172b4d]">Customer journey</strong>
            <small className="text-[11px] text-[#71819b]">Mobile-first booking experience</small>
          </div>
          <span className="text-[11px] font-bold tracking-wide text-[#1763d5]">
            Android preview · Live sync
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-[13px] font-bold text-[#172b4d]">Booking journey</strong>
              <span className="text-[#1763d5]">
                <CategoryIcon name="calendar" size={18} />
              </span>
            </div>
            <div className="divide-y divide-[#eef2f7]">
              {[
                'Select category & city',
                'Choose a business, beauty parlour, VIP or celebrity desk',
                'Select service & professional',
                'Choose date and available slot',
                'Submit request & receive reference',
                'Track approval and notifications',
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-[#edf4ff] text-[11px] font-bold text-[#1763d5] tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-[12px] font-semibold text-[#172b4d]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[16px] border border-[#e5ebf4] bg-white p-5">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-[13px] font-bold text-[#172b4d]">Connected demo data</strong>
                <span className="text-[#1763d5]">
                  <CategoryIcon name="shield" size={18} />
                </span>
              </div>
              <div className="my-2 text-[34px] leading-none font-extrabold text-[#172b4d] tabular-nums">
                {bookings.length}
              </div>
              <small className="text-[11px] text-[#71819b]">
                Appointments created in this session
              </small>
              <div className="mt-4 rounded-[11px] border border-[#d6e7ff] bg-[#eaf3ff] p-3 text-[12px] leading-relaxed text-[#245a9f]">
                Create a booking on the mobile preview. It will appear in Business Admin and Super Admin immediately.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setPage('home');
                onNotify('Ready to book on mobile preview');
              }}
              className="mt-4 w-fit rounded-[10px] bg-[#1763d5] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#0d4eb5]"
            >
              Start customer journey
            </button>
          </div>

          <div className="rounded-[16px] border border-[#e5ebf4] bg-white p-5 md:col-span-2">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-[13px] font-bold text-[#172b4d]">
                Supported mobile service domains
              </strong>
              <span className="text-[11px] text-[#71819b]">
                Click any domain to filter the mobile preview
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {categories.map((cat) => {
                const active = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleDomainSelect(cat.name)}
                    className={`flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-[13px] border p-3 text-center transition ${
                      active
                        ? 'border-[#9fc2ff] bg-[#edf4ff] text-[#1358bf]'
                        : 'border-[#e5ebf4] bg-white text-[#566783] hover:border-[#c9daf5]'
                    }`}
                  >
                    <CategoryIcon name={cat.icon} size={22} className="text-[#1763d5]" />
                    <span className="text-[12px] font-bold text-[#172b4d]">{cat.name}</span>
                    {cat.subtitle && (
                      <span className="text-[10px] leading-tight text-[#71819b]">
                        {cat.subtitle}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
