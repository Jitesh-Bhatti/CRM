export interface NavigationItem {
  name: string;
  path: string;
  // In the future, you can add: icon?: React.FC, requiredRole?: 'admin' | 'user'
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Dashboard', path: '/' },
  { name: 'Clients', path: '/clients' },
  { name: 'Leads Board', path: '/leads' },
  { name: 'Projects', path: '/projects' }, // Automatically included now!
];