export type Role = 'customer' | 'business' | 'super';

export type CustomerPage =
  | 'home'
  | 'book'
  | 'bookings'
  | 'notifications'
  | 'profile'
  | 'confirmation';

export type BusinessPage =
  | 'Overview'
  | 'Appointments'
  | 'Services'
  | 'Departments'
  | 'Staff & Professionals'
  | 'Availability'
  | 'Customers'
  | 'Reports'
  | 'Business Profile'
  | 'Notifications';

export type SuperPage =
  | 'Overview'
  | 'Businesses'
  | 'Categories & Cities'
  | 'All Appointments'
  | 'Customers'
  | 'Reports'
  | 'Platform Settings';

export type IconKey =
  | 'grid'
  | 'hospital'
  | 'fitness'
  | 'car'
  | 'salon'
  | 'beauty'
  | 'vip'
  | 'celebrity'
  | 'briefcase'
  | 'bell'
  | 'home'
  | 'calendar'
  | 'user'
  | 'users'
  | 'search'
  | 'shield'
  | 'chart'
  | 'settings'
  | 'clock'
  | 'check'
  | 'plus'
  | 'building'
  | 'logout';

export interface CategoryItem {
  name: string;
  subtitle?: string;
  icon: IconKey;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  audienceTag?: string;
  city: string;
  address: string;
  rating: string;
  price: number;
  icon: IconKey;
  services: string[];
  staff: string[];
  paused?: boolean;
}

export type BookingStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Reschedule Requested'
  | 'Rescheduled'
  | 'Cancelled'
  | 'Completed';

export interface Booking {
  id: string;
  businessId: string;
  business: string;
  category: string;
  city: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  customer: string;
  phone: string;
  status: BookingStatus;
  note?: string;
  requestedDate?: string;
  requestedTime?: string;
}

export interface ServiceItem {
  service: string;
  category: string;
  duration: string;
  price: string;
  status: string;
}

export interface DepartmentItem {
  department: string;
  doctors: string;
  status: string;
}

export interface StaffItem {
  name: string;
  role: string;
  assignedService: string;
  availability: string;
}
