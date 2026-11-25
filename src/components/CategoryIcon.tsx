import {
  Award,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Car,
  Check,
  Clock,
  Dumbbell,
  Flower2,
  Home,
  Hospital,
  LayoutGrid,
  LogOut,
  Plus,
  Scissors,
  Search,
  Settings,
  ShieldCheck,
  Star,
  User,
  Users,
} from 'lucide-react';
import { IconKey } from '../types';

interface CategoryIconProps {
  name: IconKey;
  size?: number;
  className?: string;
}

export function CategoryIcon({ name, size = 18, className = '' }: CategoryIconProps) {
  const props = { size, strokeWidth: 1.8, className, 'aria-hidden': true as const };

  switch (name) {
    case 'hospital':
      return <Hospital {...props} />;
    case 'fitness':
      return <Dumbbell {...props} />;
    case 'car':
      return <Car {...props} />;
    case 'salon':
      return <Scissors {...props} />;
    case 'beauty':
      return <Flower2 {...props} />;
    case 'vip':
      return <Award {...props} />;
    case 'celebrity':
      return <Star {...props} />;
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'bell':
      return <Bell {...props} />;
    case 'home':
      return <Home {...props} />;
    case 'calendar':
      return <Calendar {...props} />;
    case 'user':
      return <User {...props} />;
    case 'users':
      return <Users {...props} />;
    case 'search':
      return <Search {...props} />;
    case 'shield':
      return <ShieldCheck {...props} />;
    case 'chart':
      return <BarChart3 {...props} />;
    case 'settings':
      return <Settings {...props} />;
    case 'clock':
      return <Clock {...props} />;
    case 'check':
      return <Check {...props} />;
    case 'plus':
      return <Plus {...props} />;
    case 'building':
      return <Building2 {...props} />;
    case 'logout':
      return <LogOut {...props} />;
    case 'grid':
    default:
      return <LayoutGrid {...props} />;
  }
}
