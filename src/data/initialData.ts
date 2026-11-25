import {
  Business,
  BusinessPage,
  CategoryItem,
  DepartmentItem,
  IconKey,
  ServiceItem,
  StaffItem,
  SuperPage,
} from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { name: 'Hospital', icon: 'hospital' },
  { name: 'Gym', icon: 'fitness' },
  { name: 'Car Service', icon: 'car' },
  { name: 'Salon', icon: 'salon' },
  { name: 'Beauty Parlour', subtitle: 'Bridal & Skin Care', icon: 'beauty' },
  { name: 'VIPs', subtitle: 'Top Business Persons', icon: 'vip' },
  { name: 'Celebrities', subtitle: 'Actors & Well-Known Persons', icon: 'celebrity' },
  { name: 'Other', icon: 'briefcase' },
];

export const INITIAL_CITIES: string[] = [
  'Chennai',
  'Coimbatore',
  'Thiruvarur',
  'Madurai',
  'Trichy',
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'City Care Hospital',
    category: 'Hospital',
    city: 'Chennai',
    address: 'Anna Nagar, Chennai',
    rating: '4.8',
    price: 500,
    icon: 'hospital',
    services: ['Cardiology', 'General Medicine', 'Dermatology'],
    staff: ['Dr. Meera', 'Dr. Arjun'],
  },
  {
    id: 'b2',
    name: 'ProFit Fitness Studio',
    category: 'Gym',
    city: 'Coimbatore',
    address: 'RS Puram, Coimbatore',
    rating: '4.7',
    price: 400,
    icon: 'fitness',
    services: ['Personal Training', 'Yoga', 'Fitness Assessment'],
    staff: ['Vikram', 'Nisha'],
  },
  {
    id: 'b3',
    name: 'AutoCare Service Hub',
    category: 'Car Service',
    city: 'Chennai',
    address: 'Guindy, Chennai',
    rating: '4.6',
    price: 900,
    icon: 'car',
    services: ['General Service', 'Oil Change', 'AC Service'],
    staff: ['Service Team'],
  },
  {
    id: 'b4',
    name: 'Glow Beauty Studio',
    category: 'Salon',
    city: 'Thiruvarur',
    address: 'South Street, Thiruvarur',
    rating: '4.9',
    price: 350,
    icon: 'salon',
    services: ['Haircut', 'Facial', 'Hair Spa'],
    staff: ['Anu', 'Priya'],
  },
  {
    id: 'b5',
    name: 'Aura Bridal & Beauty Parlour',
    category: 'Beauty Parlour',
    audienceTag: 'Bridal, Skin & Makeup',
    city: 'Chennai',
    address: 'T. Nagar, Chennai',
    rating: '4.9',
    price: 800,
    icon: 'beauty',
    services: [
      'Bridal & Party Makeup',
      'Gold & Glow Facial',
      'Hair Spa & Styling',
      'Manicure & Pedicure',
    ],
    staff: ['Divya', 'Kavya'],
  },
  {
    id: 'b6',
    name: 'Apex Executive & VIP Desk',
    category: 'VIPs',
    audienceTag: 'Top Business Persons',
    city: 'Chennai',
    address: 'MRC Nagar, Chennai',
    rating: '4.9',
    price: 5000,
    icon: 'vip',
    services: [
      'Top Business Person Meet',
      'CXO Strategic Advisory',
      'Investor Pitch & Board Slot',
      'Corporate Keynote Request',
    ],
    staff: ['Raghavendra Rao (Chairman)', 'Meenakshi Sundaram (MD)'],
  },
  {
    id: 'b7',
    name: 'Starlight Celebrity & Actor Desk',
    category: 'Celebrities',
    audienceTag: 'Actors & Film Personalities',
    city: 'Chennai',
    address: 'Kodambakkam, Chennai',
    rating: '4.9',
    price: 15000,
    icon: 'celebrity',
    services: [
      'Actor Appearance & Endorsement',
      'Chief Guest & Launch Event',
      'Media Interview & Podcast Slot',
      'Fan Meet & Greet Session',
    ],
    staff: ['Aravind Karthik (Actor)', 'Priyadharshini (Film Artist)'],
  },
  {
    id: 'b8',
    name: 'Eminent Voices & Public Figures',
    category: 'Celebrities',
    audienceTag: 'Well-Known Persons & Mentors',
    city: 'Coimbatore',
    address: 'Race Course Road, Coimbatore',
    rating: '4.8',
    price: 7500,
    icon: 'celebrity',
    services: [
      'Well-Known Person Keynote',
      'Cultural & Book Launch Guest',
      'Public Panel & Talk Session',
    ],
    staff: ['Dr. K. Balasubramanian (Author)', 'Sadhana Krishnan (Media Host)'],
  },
];

export const TIME_SLOTS: string[] = [
  '09:00 AM',
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

export const BUSINESS_MENU: { label: BusinessPage; icon: IconKey }[] = [
  { label: 'Overview', icon: 'chart' },
  { label: 'Appointments', icon: 'calendar' },
  { label: 'Services', icon: 'grid' },
  { label: 'Departments', icon: 'hospital' },
  { label: 'Staff & Professionals', icon: 'users' },
  { label: 'Availability', icon: 'clock' },
  { label: 'Customers', icon: 'user' },
  { label: 'Reports', icon: 'chart' },
  { label: 'Business Profile', icon: 'building' },
  { label: 'Notifications', icon: 'bell' },
];

export const SUPER_MENU: { label: SuperPage; icon: IconKey }[] = [
  { label: 'Overview', icon: 'chart' },
  { label: 'Businesses', icon: 'building' },
  { label: 'Categories & Cities', icon: 'grid' },
  { label: 'All Appointments', icon: 'calendar' },
  { label: 'Customers', icon: 'users' },
  { label: 'Reports', icon: 'chart' },
  { label: 'Platform Settings', icon: 'settings' },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  { service: 'General Consultation', category: 'Hospital', duration: '30 min', price: '₹500', status: 'Active' },
  { service: 'Personal Training', category: 'Gym', duration: '60 min', price: '₹800', status: 'Active' },
  { service: 'Oil Change', category: 'Car Service', duration: '45 min', price: '₹900', status: 'Active' },
  { service: 'Haircut', category: 'Salon', duration: '30 min', price: '₹350', status: 'Active' },
  { service: 'Bridal & Party Makeup', category: 'Beauty Parlour', duration: '90 min', price: '₹2,500', status: 'Active' },
  { service: 'Top Business Person Meet', category: 'VIPs', duration: '45 min', price: '₹5,000', status: 'Active' },
  { service: 'Actor & Well-Known Person Booking', category: 'Celebrities', duration: '60 min', price: '₹15,000', status: 'Active' },
];

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { department: 'Cardiology', doctors: 'Dr. Meera', status: 'Active' },
  { department: 'General Medicine', doctors: 'Dr. Arjun', status: 'Active' },
  { department: 'Dermatology', doctors: 'Dr. Nisha', status: 'Active' },
];

export const INITIAL_STAFF: StaffItem[] = [
  { name: 'Dr. Meera', role: 'Cardiologist', assignedService: 'Cardiology', availability: 'Mon–Fri' },
  { name: 'Dr. Arjun', role: 'General Physician', assignedService: 'General Medicine', availability: 'Mon–Sat' },
  { name: 'Divya', role: 'Bridal Makeup Specialist', assignedService: 'Beauty Parlour', availability: 'Tue–Sun' },
  { name: 'Raghavendra Rao', role: 'Executive Chairman (VIP Desk)', assignedService: 'VIPs - Top Business Persons', availability: 'By Appointment' },
  { name: 'Aravind Karthik', role: 'Film Actor & Celebrity Liaison', assignedService: 'Celebrities & Well-Known Persons', availability: 'By Schedule' },
];
